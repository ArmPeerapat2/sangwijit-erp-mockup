/*
 * DEPLOY INSTRUCTIONS
 * 1. Open the Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1NUIMJhRoldCI-kWknHxeHTfLg7FPQiveLyTxdRrfdK0/edit
 *    Then choose Extensions > Apps Script.
 * 2. Add this file as Code.gs and add index.html as an HTML file named "index".
 * 3. Deploy > New deployment > Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone in organization
 * 4. Copy the Web App URL and replace APPS_SCRIPT_URL in index.html when using
 *    the HTML outside Apps Script. If served by this Apps Script doGet(), the
 *    template injects the URL automatically.
 * 5. Optional Script Properties:
 *    - LINE_NOTIFY_TOKEN: legacy compatibility only. LINE Notify APIs ended
 *      on 2025-03-31, so prefer Messaging API.
 *    - LINE_MESSAGING_CHANNEL_ACCESS_TOKEN and LINE_MESSAGING_TO: preferred
 *      LINE push notification settings.
 *    - MD_ALERT_EMAILS: comma-separated emails for budget alerts.
 *    - USER_ROLES_JSON: optional JSON array of {email, role, branch, name}.
 */

var SPREADSHEET_ID = '1NUIMJhRoldCI-kWknHxeHTfLg7FPQiveLyTxdRrfdK0';
var SHEET_TRANSACTION = 'Transaction Log';
var SHEET_RECURRING = 'Recurring Expense';
var SHEET_AUDIT = 'AuditLog';
var SHEET_BUDGET = 'Budget Config';
var SHEET_USERS = 'UserRoles';
var ALLOWED_DOMAIN = 'sangwijit.co.th';
var DEFAULT_PAGE_SIZE = 500;
var MAX_PAGE_SIZE = 500;

var ENTITY_LIST = ['SWT', 'SWE', 'WMN', 'WPS'];
var ACTIVE_BRANCHES = [
  'อากาศฯ',
  'บ้านม่วง',
  'ท่าแร่',
  'เซกา',
  'การไฟฟ้า สำนักงานใหญ่',
  'หน้าร้านในเมือง',
  'สาขาปลีกโกดัง',
  'ปลีกโกดัง'
];
var CLOSED_BRANCH_MARKERS = ['สาขาสว่าง', 'สาขาสมเด็จ', 'สาขาบึงกาฬ'];
var EXCLUDED_DEP_NAME = 'บานาน่า';
var UNKNOWN_DEP_NAME = 'unknown';
var TAX_DEP_NAME = 'คชจ.บิลเพิ่ม';

var RECURRING_FIELD_MAP = {
  id: 'ลำดับรายการ',
  vendorCode: 'รหัสเจ้าหนี้',
  vendorName: 'เจ้าหนี้',
  systemCode: 'รหัสในระบบ',
  category: 'รหัสค่าใช้จ่าย',
  docGroup: 'กลุ่มเอกสาร',
  amount: 'จำนวนเงิน',
  note: 'หมายเหตุ',
  depName: 'แผนก',
  startDate: 'วันที่เริ่มต้น',
  totalPeriods: 'จำนวนงวด',
  dueDay: 'ชำระทุกวันที่',
  frequency: 'ความถี่ทุกกี่เดือน',
  alertPeriods: 'เตือนกี่งวดสุดท้าย',
  alertText: 'ข้อความเตือน'
};

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  if (params.action) {
    return handleApiGet_(params);
  }

  var auth = requireAuth_();
  if (!auth.ok) {
    return HtmlService.createHtmlOutput(buildUnauthorizedHtml_(auth))
      .setTitle('ไม่สามารถเข้าใช้งานได้');
  }

  var template = HtmlService.createTemplateFromFile('index');
  template.webAppUrl = ScriptApp.getService().getUrl();
  template.currentUserEmail = auth.email;
  return template.evaluate()
    .setTitle('Sangwijit Expense Management')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  var auth = requireAuth_();
  if (!auth.ok) {
    return jsonOutput_({ ok: false, error: auth.message, code: auth.code });
  }

  try {
    var payload = parsePostPayload_(e);
    var action = payload.action || '';
    var result;

    if (action === 'updateRecurringItem') {
      result = updateRecurringItem(payload.id, payload.data || {});
    } else if (action === 'addRecurringItem') {
      result = addRecurringItem(payload.data || {});
    } else if (action === 'deactivateRecurringItem') {
      result = deactivateRecurringItem(payload.id);
    } else if (action === 'bulkDeactivateRecurringItems') {
      result = bulkDeactivateRecurringItems(payload.ids || []);
    } else if (action === 'updateTransactionDepName') {
      result = updateTransactionDepName(payload.rowNumber, payload.depName);
    } else if (action === 'saveBudgetTargets') {
      result = saveBudgetTargets(payload.targets || []);
    } else if (action === 'sendLineDueNotifications') {
      result = sendLineDueNotifications(payload.days || 3);
    } else if (action === 'sendBudgetAlerts') {
      result = sendBudgetAlerts(payload.year, payload.month, payload.entity, payload.recipient);
    } else {
      throw new Error('Unknown action: ' + action);
    }

    return jsonOutput_({ ok: true, data: result });
  } catch (err) {
    return jsonOutput_({ ok: false, error: getErrorMessage_(err) });
  }
}

function getRecurringData() {
  assertAuthorized_();

  var source = readSheetObjects_(SHEET_RECURRING);
  var items = source.rows.map(function(row) {
    return decorateRecurringRow_(row);
  });

  var activeCount = 0;
  var historicalCount = 0;
  var expiresSoonCount = 0;
  items.forEach(function(item) {
    if (item.isHistorical) {
      historicalCount++;
    } else if (item.isActive) {
      activeCount++;
    }
    if (item.expirySoon) {
      expiresSoonCount++;
    }
  });

  return {
    items: items,
    summary: {
      activeCount: activeCount,
      historicalCount: historicalCount,
      expiresSoonCount: expiresSoonCount
    },
    lastUpdated: getLastUpdated_()
  };
}

function getTransactionData(year, month, entity, branch, page, pageSize) {
  assertAuthorized_();

  var currentUser = getCurrentUser();
  var selectedYear = parseIntSafe_(year) || new Date().getFullYear();
  var selectedMonth = parseMonth_(month);
  var selectedEntity = normalizeFilter_(entity);
  var selectedBranch = normalizeFilter_(branch);
  var requestedPage = Math.max(1, parseIntSafe_(page) || 1);
  var requestedPageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, parseIntSafe_(pageSize) || DEFAULT_PAGE_SIZE));

  if (currentUser.role === 'branch' && currentUser.branch) {
    selectedBranch = currentUser.branch;
  }

  var source = readSheetObjects_(SHEET_TRANSACTION);
  var scopedYearRows = [];
  var periodRows = [];
  var taxRows = [];
  var unknownRows = [];
  var historyRows = [];
  var excludedCount = 0;

  source.rows.forEach(function(row) {
    var tx = decorateTransactionRow_(row);

    if (tx.isExcludedBusiness) {
      excludedCount++;
      return;
    }
    if (tx.year !== selectedYear) {
      return;
    }
    if (selectedEntity && selectedEntity !== 'ทั้งหมด' && tx.entity !== selectedEntity) {
      return;
    }
    if (selectedBranch && selectedBranch !== 'ทั้งหมด' && tx.branchName !== selectedBranch) {
      return;
    }

    var matchesPeriod = !selectedMonth || tx.month === selectedMonth;

    if (tx.isClosedBranch) {
      if (matchesPeriod) {
        historyRows.push(tx);
      }
      return;
    }

    if (tx.isTax) {
      if (matchesPeriod) {
        taxRows.push(tx);
      }
      return;
    }

    scopedYearRows.push(tx);
    if (matchesPeriod) {
      periodRows.push(tx);
      if (tx.isUnknownDep) {
        unknownRows.push(tx);
      }
    }
  });

  periodRows.sort(sortByDateDesc_);
  taxRows.sort(sortByDateDesc_);
  unknownRows.sort(sortByDateDesc_);
  historyRows.sort(sortByDateDesc_);

  var start = (requestedPage - 1) * requestedPageSize;
  var pageRows = periodRows.slice(start, start + requestedPageSize);
  var trends = buildMonthlyTrend_(scopedYearRows);
  var fuel = buildFuelAnalytics_(scopedYearRows, selectedMonth);
  var categoryTotals = sumBy_(periodRows, 'expenseCode');
  var entityTotals = sumBy_(periodRows, 'entity');

  return {
    rows: pageRows,
    taxRows: taxRows.slice(0, 500),
    unknownRows: unknownRows.slice(0, 500),
    historyRows: historyRows.slice(0, 500),
    pagination: {
      page: requestedPage,
      pageSize: requestedPageSize,
      totalRows: periodRows.length,
      hasMore: start + requestedPageSize < periodRows.length
    },
    metrics: {
      totalAmount: sumAmount_(periodRows),
      totalTransactions: periodRows.length,
      taxAmount: sumAmount_(taxRows),
      unknownCount: unknownRows.length,
      historyCount: historyRows.length,
      excludedBusinessCount: excludedCount,
      categoryTotalsAll: objectToSortedArray_(categoryTotals),
      entityTotals: objectToSortedArray_(entityTotals),
      topCategories: objectToSortedArray_(categoryTotals).slice(0, 10),
      entityTopCategories: buildEntityTopCategories_(periodRows)
    },
    charts: {
      monthlyTrend: trends,
      categoryTotals: objectToSortedArray_(categoryTotals).slice(0, 10),
      entitySplit: objectToSortedArray_(entityTotals)
    },
    fuel: fuel,
    filters: {
      year: selectedYear,
      month: selectedMonth,
      entity: selectedEntity || 'ทั้งหมด',
      branch: selectedBranch || 'ทั้งหมด',
      roleLockedBranch: currentUser.role === 'branch' ? currentUser.branch : ''
    },
    lastUpdated: getLastUpdated_()
  };
}

function updateRecurringItem(id, data) {
  var user = getCurrentUser();
  var found = findRecurringRowById_(id);
  if (!found) {
    throw new Error('ไม่พบรายการค่าใช้จ่ายประจำ ID ' + id);
  }

  var before = rowValuesToObject_(found.headers, found.sheet.getRange(found.rowNumber, 1, 1, found.headers.length).getValues()[0], found.rowNumber);
  writeRecurringFields_(found.sheet, found.headers, found.rowNumber, data);
  var after = rowValuesToObject_(found.headers, found.sheet.getRange(found.rowNumber, 1, 1, found.headers.length).getValues()[0], found.rowNumber);

  appendAudit_('updateRecurringItem', before, after, user.email);
  return decorateRecurringRow_(after);
}

function getConfig() {
  assertAuthorized_();

  var txSource = safeReadSheetObjects_(SHEET_TRANSACTION);
  var recurringSource = safeReadSheetObjects_(SHEET_RECURRING);
  var branches = {};
  var departments = {};
  var categories = {};

  txSource.rows.forEach(function(row) {
    var dep = normalizeText_(row.DepName);
    var branch = normalizeText_(row.BranchName);
    var category = normalizeText_(row['รหัสค่าใช้จ่าย']);
    if (dep) {
      departments[dep] = true;
    }
    if (branch && !isClosedBranch_(branch)) {
      branches[branch] = true;
    }
    if (category) {
      categories[category] = true;
    }
  });

  recurringSource.rows.forEach(function(row) {
    var dep = normalizeText_(row['แผนก']);
    var category = normalizeText_(row['รหัสค่าใช้จ่าย']);
    if (dep) {
      departments[dep] = true;
    }
    if (category) {
      categories[category] = true;
    }
  });

  ACTIVE_BRANCHES.forEach(function(branch) {
    branches[branch] = true;
  });

  return {
    entities: ENTITY_LIST,
    entityOptions: ['ทั้งหมด'].concat(ENTITY_LIST),
    branches: Object.keys(branches).sort(),
    branchOptions: ['ทั้งหมด'].concat(Object.keys(branches).sort()),
    departments: Object.keys(departments).sort(),
    categories: Object.keys(categories).sort(),
    categoryColors: getCategoryColorMap_(),
    dataRules: {
      excludedDepName: EXCLUDED_DEP_NAME,
      unknownDepName: UNKNOWN_DEP_NAME,
      taxDepName: TAX_DEP_NAME,
      closedBranchMarkers: CLOSED_BRANCH_MARKERS,
      activeBranches: ACTIVE_BRANCHES
    },
    user: getCurrentUser(),
    lastUpdated: getLastUpdated_(),
    lineNotice: 'LINE Notify legacy API ended on 2025-03-31. Messaging API properties are supported as the preferred notification path.'
  };
}

function getCurrentUser() {
  var auth = requireAuth_();
  if (!auth.ok) {
    throw new Error(auth.message);
  }

  var fromSheet = findUserRoleInSheet_(auth.email);
  if (fromSheet) {
    return fromSheet;
  }

  var fromProperties = findUserRoleInProperties_(auth.email);
  if (fromProperties) {
    return fromProperties;
  }

  return {
    email: auth.email,
    role: 'md',
    branch: '',
    name: auth.email.split('@')[0]
  };
}

function addRecurringItem(data) {
  var user = getCurrentUser();
  var source = readSheetObjects_(SHEET_RECURRING);
  var headers = source.headers;
  var nextId = getNextRecurringId_(source.rows);
  var row = headers.map(function(header) {
    if (header === RECURRING_FIELD_MAP.id) {
      return nextId;
    }
    return valueForRecurringHeader_(header, data);
  });

  source.sheet.appendRow(row);
  var rowNumber = source.sheet.getLastRow();
  var after = rowValuesToObject_(headers, source.sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0], rowNumber);
  appendAudit_('addRecurringItem', null, after, user.email);
  return decorateRecurringRow_(after);
}

function deactivateRecurringItem(id) {
  var found = findRecurringRowById_(id);
  if (!found) {
    throw new Error('ไม่พบรายการค่าใช้จ่ายประจำ ID ' + id);
  }
  return markRecurringInactive_(found);
}

function bulkDeactivateRecurringItems(ids) {
  var results = [];
  ids.forEach(function(id) {
    results.push(deactivateRecurringItem(id));
  });
  return results;
}

function updateTransactionDepName(rowNumber, depName) {
  var user = getCurrentUser();
  var rowNum = parseIntSafe_(rowNumber);
  var newDep = normalizeText_(depName);
  if (!rowNum || rowNum < 2) {
    throw new Error('rowNumber ไม่ถูกต้อง');
  }
  if (!newDep) {
    throw new Error('กรุณาระบุแผนกใหม่');
  }

  var source = readSheetObjects_(SHEET_TRANSACTION);
  var depIndex = source.headers.indexOf('DepName');
  if (depIndex === -1) {
    throw new Error('ไม่พบคอลัมน์ DepName');
  }

  var before = rowValuesToObject_(source.headers, source.sheet.getRange(rowNum, 1, 1, source.headers.length).getValues()[0], rowNum);
  source.sheet.getRange(rowNum, depIndex + 1).setValue(newDep);
  var after = rowValuesToObject_(source.headers, source.sheet.getRange(rowNum, 1, 1, source.headers.length).getValues()[0], rowNum);
  appendAudit_('updateTransactionDepName', before, after, user.email);
  return decorateTransactionRow_(after);
}

function getBudgetData(year, month, entity, branch) {
  assertAuthorized_();

  var selectedYear = parseIntSafe_(year) || new Date().getFullYear();
  var selectedMonth = parseMonth_(month) || (new Date().getMonth() + 1);
  var selectedEntity = normalizeFilter_(entity) || 'ทั้งหมด';
  var actualData = getTransactionData(selectedYear, selectedMonth, selectedEntity, branch, 1, MAX_PAGE_SIZE);
  var actualByCategory = {};

  (actualData.metrics.categoryTotalsAll || []).forEach(function(row) {
    actualByCategory[row.label] = row.amount;
  });

  var budgetRows = readBudgetTargets_(selectedYear, selectedMonth, selectedEntity);
  var categorySet = {};
  Object.keys(actualByCategory).forEach(function(category) {
    categorySet[category] = true;
  });
  budgetRows.forEach(function(row) {
    categorySet[row.category] = true;
  });

  var budgetByCategory = {};
  budgetRows.forEach(function(row) {
    budgetByCategory[row.category] = row.budget;
  });

  var rows = Object.keys(categorySet).sort().map(function(category) {
    var actual = actualByCategory[category] || 0;
    var budget = budgetByCategory[category] || 0;
    var ratio = budget > 0 ? actual / budget : null;
    return {
      year: selectedYear,
      month: selectedMonth,
      entity: selectedEntity,
      category: category,
      actual: actual,
      budget: budget,
      variance: actual - budget,
      ratio: ratio,
      status: getBudgetStatus_(actual, budget)
    };
  });

  return {
    rows: rows,
    summary: {
      actual: sumProperty_(rows, 'actual'),
      budget: sumProperty_(rows, 'budget'),
      variance: sumProperty_(rows, 'variance'),
      overBudgetCount: rows.filter(function(row) {
        return row.status === 'red';
      }).length
    },
    lastUpdated: getLastUpdated_()
  };
}

function saveBudgetTargets(targets) {
  var user = getCurrentUser();
  var sheet = getOrCreateBudgetSheet_();
  var source = readSheetObjects_(SHEET_BUDGET);
  var headers = source.headers;
  var keyMap = {};

  source.rows.forEach(function(row) {
    var key = budgetKey_(row.year, row.month, row.entity, row.category);
    keyMap[key] = row._rowNumber;
  });

  var changed = [];
  targets.forEach(function(target) {
    var year = parseIntSafe_(target.year);
    var month = parseMonth_(target.month);
    var entity = normalizeFilter_(target.entity) || 'ทั้งหมด';
    var category = normalizeText_(target.category);
    var budget = parseAmount_(target.budget);
    if (!year || !month || !category) {
      return;
    }

    var key = budgetKey_(year, month, entity, category);
    var values = {
      year: year,
      month: month,
      entity: entity,
      category: category,
      budget: budget,
      updatedAt: new Date(),
      updatedBy: user.email
    };
    if (keyMap[key]) {
      var rowNumber = keyMap[key];
      var before = rowValuesToObject_(headers, sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0], rowNumber);
      writeBudgetRow_(sheet, headers, rowNumber, values);
      var after = rowValuesToObject_(headers, sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0], rowNumber);
      changed.push(after);
      appendAudit_('saveBudgetTarget:update', before, after, user.email);
    } else {
      var row = headers.map(function(header) {
        return values[header] !== undefined ? values[header] : '';
      });
      sheet.appendRow(row);
      var newRowNumber = sheet.getLastRow();
      var created = rowValuesToObject_(headers, sheet.getRange(newRowNumber, 1, 1, headers.length).getValues()[0], newRowNumber);
      changed.push(created);
      appendAudit_('saveBudgetTarget:add', null, created, user.email);
    }
  });

  return { updated: changed.length, rows: changed };
}

function sendLineDueNotifications(days) {
  var user = getCurrentUser();
  var horizon = Math.max(1, parseIntSafe_(days) || 3);
  var recurring = getRecurringData();
  var today = resetTime_(new Date());
  var until = addDays_(today, horizon);
  var dueItems = [];

  recurring.items.forEach(function(item) {
    if (!item.isActive || item.isHistorical) {
      return;
    }
    var dates = buildRecurringDatesBetween_(item, today, until);
    dates.forEach(function(dateInfo) {
      dueItems.push({
        id: item.id,
        vendorName: item.vendorName,
        category: item.category,
        amount: item.amount,
        dueDate: formatDate_(dateInfo.date),
        entity: item.entity
      });
    });
  });

  if (!dueItems.length) {
    return { sent: false, count: 0, message: 'ไม่มีรายการครบกำหนดภายใน ' + horizon + ' วัน' };
  }

  var message = buildLineDueMessage_(dueItems, horizon);
  var sendResult = sendLineMessage_(message);
  appendAudit_('sendLineDueNotifications', null, { days: horizon, count: dueItems.length, result: sendResult }, user.email);
  return { sent: sendResult.sent, count: dueItems.length, result: sendResult };
}

function sendBudgetAlerts(year, month, entity, recipient) {
  var user = getCurrentUser();
  var data = getBudgetData(year, month, entity, '');
  var overRows = data.rows.filter(function(row) {
    return row.status === 'red';
  });
  if (!overRows.length) {
    return { sent: false, count: 0, message: 'ไม่มีหมวดที่เกินงบ' };
  }

  var props = PropertiesService.getScriptProperties();
  var recipients = normalizeText_(recipient) || props.getProperty('MD_ALERT_EMAILS') || user.email;
  var subject = 'แจ้งเตือนงบประมาณเกินเป้า - Sangwijit Expense';
  var body = overRows.map(function(row) {
    return [
      row.category,
      'งบ: ' + formatAmountForText_(row.budget),
      'จริง: ' + formatAmountForText_(row.actual),
      'ส่วนต่าง: ' + formatAmountForText_(row.variance)
    ].join(' | ');
  }).join('\n');

  MailApp.sendEmail(recipients, subject, body);
  appendAudit_('sendBudgetAlerts', null, { recipients: recipients, rows: overRows }, user.email);
  return { sent: true, count: overRows.length, recipients: recipients };
}

function dailyExpenseAlerts() {
  var lineResult = sendLineDueNotifications(3);
  var now = new Date();
  var budgetResult = sendBudgetAlerts(now.getFullYear(), now.getMonth() + 1, 'ทั้งหมด', '');
  return { line: lineResult, budget: budgetResult };
}

function handleApiGet_(params) {
  var auth = requireAuth_();
  if (!auth.ok) {
    return jsonOutput_({ ok: false, error: auth.message, code: auth.code });
  }

  try {
    var action = params.action;
    var result;
    if (action === 'getRecurringData') {
      result = getRecurringData();
    } else if (action === 'getTransactionData') {
      result = getTransactionData(params.year, params.month, params.entity, params.branch, params.page, params.pageSize);
    } else if (action === 'getBudgetData') {
      result = getBudgetData(params.year, params.month, params.entity, params.branch);
    } else if (action === 'getConfig') {
      result = getConfig();
    } else if (action === 'getCurrentUser') {
      result = getCurrentUser();
    } else {
      throw new Error('Unknown action: ' + action);
    }
    return jsonOutput_({ ok: true, data: result });
  } catch (err) {
    return jsonOutput_({ ok: false, error: getErrorMessage_(err) });
  }
}

function parsePostPayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }
  return JSON.parse(e.postData.contents);
}

function requireAuth_() {
  var email = '';
  try {
    email = Session.getActiveUser().getEmail();
  } catch (err) {
    email = '';
  }
  email = normalizeText_(email).toLowerCase();
  if (!email) {
    return {
      ok: false,
      code: 'NO_EMAIL',
      message: 'ไม่พบอีเมลผู้ใช้งาน กรุณาเข้าใช้งานผ่านบัญชี Google Workspace ของบริษัท'
    };
  }
  if (email.split('@').pop() !== ALLOWED_DOMAIN) {
    return {
      ok: false,
      code: 'INVALID_DOMAIN',
      message: 'บัญชีนี้ไม่ได้อยู่ในโดเมน @' + ALLOWED_DOMAIN
    };
  }
  return { ok: true, email: email };
}

function assertAuthorized_() {
  var auth = requireAuth_();
  if (!auth.ok) {
    throw new Error(auth.message);
  }
  return auth;
}

function buildUnauthorizedHtml_(auth) {
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<style>body{font-family:Arial,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#f8fafc;color:#1A1A2E}' +
    '.box{max-width:520px;padding:32px;border:1px solid #e5e7eb;background:white;border-radius:8px;box-shadow:0 20px 45px rgba(26,26,46,.08)}' +
    'h1{font-size:24px;margin:0 0 12px;color:#E31E24}p{line-height:1.6}</style></head><body><main class="box">' +
    '<h1>ไม่สามารถเข้าใช้งานได้</h1><p>' + escapeHtml_(auth.message) + '</p>' +
    '<p>กรุณาเข้าสู่ระบบด้วยบัญชี @' + ALLOWED_DOMAIN + '</p></main></body></html>';
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function readSheetObjects_(sheetName) {
  var sheet = getSheet_(sheetName);
  var range = sheet.getDataRange();
  var values = range.getValues();
  if (!values.length) {
    return { sheet: sheet, headers: [], rows: [] };
  }

  var headers = values[0].map(function(header, index) {
    var text = normalizeText_(header);
    return text || ('Column' + (index + 1));
  });
  var rows = [];

  for (var r = 1; r < values.length; r++) {
    var blank = true;
    var row = { _rowNumber: r + 1 };
    for (var c = 0; c < headers.length; c++) {
      var value = normalizeCell_(values[r][c]);
      if (value !== '' && value !== null && value !== undefined) {
        blank = false;
      }
      row[headers[c]] = value;
    }
    if (!blank) {
      rows.push(row);
    }
  }
  return { sheet: sheet, headers: headers, rows: rows };
}

function safeReadSheetObjects_(sheetName) {
  try {
    return readSheetObjects_(sheetName);
  } catch (err) {
    return { sheet: null, headers: [], rows: [] };
  }
}

function getSheet_(sheetName) {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('ไม่พบชีต "' + sheetName + '"');
  }
  return sheet;
}

function normalizeCell_(value) {
  if (value instanceof Date) {
    return formatDate_(value);
  }
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}

function decorateRecurringRow_(row) {
  var startDate = parseDate_(row[RECURRING_FIELD_MAP.startDate]);
  var item = {
    rowNumber: row._rowNumber,
    id: normalizeText_(row[RECURRING_FIELD_MAP.id]) || String(row._rowNumber),
    vendorCode: normalizeText_(row[RECURRING_FIELD_MAP.vendorCode]),
    vendorName: normalizeText_(row[RECURRING_FIELD_MAP.vendorName]),
    systemCode: normalizeText_(row[RECURRING_FIELD_MAP.systemCode]),
    category: normalizeText_(row[RECURRING_FIELD_MAP.category]) || 'ไม่ระบุหมวด',
    docGroup: normalizeText_(row[RECURRING_FIELD_MAP.docGroup]),
    amount: parseAmount_(row[RECURRING_FIELD_MAP.amount]),
    note: normalizeText_(row[RECURRING_FIELD_MAP.note]),
    depName: normalizeText_(row[RECURRING_FIELD_MAP.depName]),
    startDate: startDate ? formatDate_(startDate) : '',
    totalPeriods: parseIntSafe_(row[RECURRING_FIELD_MAP.totalPeriods]) || null,
    dueDay: parseIntSafe_(row[RECURRING_FIELD_MAP.dueDay]) || 1,
    frequency: parseIntSafe_(row[RECURRING_FIELD_MAP.frequency]) || 1,
    alertPeriods: parseIntSafe_(row[RECURRING_FIELD_MAP.alertPeriods]) || 0,
    alertText: normalizeText_(row[RECURRING_FIELD_MAP.alertText]),
    entity: inferEntityFromRecurring_(row),
    raw: row
  };

  item.isHistorical = item.note.indexOf('เลิก') !== -1;
  var status = calculateRecurringStatus_(item, new Date());
  item.isActive = !item.isHistorical && status.isActive;
  item.remainingPeriods = status.remainingPeriods;
  item.usedPeriods = status.usedPeriods;
  item.expirySoon = item.isActive && status.expirySoon;
  item.nextDueDate = status.nextDueDate;
  item.lastDueDate = status.lastDueDate;
  return item;
}

function decorateTransactionRow_(row) {
  var docDate = parseDate_(row.DocDate);
  var year = parseIntSafe_(row.year) || (docDate ? docDate.getFullYear() : 0);
  var month = parseMonth_(row.Month) || (docDate ? docDate.getMonth() + 1 : 0);
  var branchName = normalizeText_(row.BranchName);
  var depName = normalizeText_(row.DepName);
  var expenseCode = normalizeText_(row['รหัสค่าใช้จ่าย']) || 'ไม่ระบุหมวด';
  var name = normalizeText_(row.Name);
  var note = normalizeText_(row['หมายเหตุ']);
  var license = extractLicensePlate_(name + ' ' + note);

  return {
    rowNumber: row._rowNumber,
    docDate: docDate ? formatDate_(docDate) : '',
    docNo: normalizeText_(row.DocNo),
    code: normalizeText_(row.Code),
    name: name,
    amount: parseAmount_(row.Amount),
    depName: depName,
    depDisplay: depName.toLowerCase() === UNKNOWN_DEP_NAME ? '⚠️ ยังไม่จัดกลุ่ม' : depName,
    branchName: branchName,
    vendorName: normalizeText_(row.VenName),
    expenseCode: expenseCode,
    note: note,
    docGroup: normalizeText_(row['กลุ่มเอกสาร']),
    year: year,
    month: month,
    entity: inferEntityFromTransaction_(row),
    isUnknownDep: depName.toLowerCase() === UNKNOWN_DEP_NAME,
    isExcludedBusiness: depName === EXCLUDED_DEP_NAME,
    isTax: depName === TAX_DEP_NAME,
    isClosedBranch: isClosedBranch_(branchName),
    licensePlate: license,
    isFuel: isFuelExpense_(expenseCode, name, note),
    raw: row
  };
}

function calculateRecurringStatus_(item, today) {
  var startDate = parseDate_(item.startDate);
  if (!startDate) {
    return {
      isActive: true,
      remainingPeriods: item.totalPeriods,
      usedPeriods: 0,
      expirySoon: false,
      nextDueDate: '',
      lastDueDate: ''
    };
  }

  var firstDue = getFirstDueDate_(startDate, item.dueDay, item.frequency);
  var used = countDueOnOrBefore_(firstDue, item.frequency, item.dueDay, today, item.totalPeriods);
  var remaining = item.totalPeriods ? Math.max(0, item.totalPeriods - used) : null;
  var isActive = !item.totalPeriods || remaining > 0;
  var nextDue = getNextDueDate_(firstDue, item.frequency, item.dueDay, today, item.totalPeriods);
  var lastDue = item.totalPeriods ? addMonthsClamped_(firstDue, (item.totalPeriods - 1) * item.frequency, item.dueDay) : null;
  var expirySoon = item.alertPeriods > 0 && remaining !== null && remaining <= item.alertPeriods;

  return {
    isActive: isActive,
    remainingPeriods: remaining,
    usedPeriods: used,
    expirySoon: expirySoon,
    nextDueDate: nextDue ? formatDate_(nextDue) : '',
    lastDueDate: lastDue ? formatDate_(lastDue) : ''
  };
}

function getFirstDueDate_(startDate, dueDay, frequency) {
  var first = makeDateWithDay_(startDate.getFullYear(), startDate.getMonth(), dueDay);
  if (first.getTime() < resetTime_(startDate).getTime()) {
    first = addMonthsClamped_(first, frequency, dueDay);
  }
  return resetTime_(first);
}

function getNextDueDate_(firstDue, frequency, dueDay, today, totalPeriods) {
  var current = resetTime_(firstDue);
  var count = 0;
  var target = resetTime_(today);
  while (current.getTime() < target.getTime()) {
    count++;
    if (totalPeriods && count >= totalPeriods) {
      return null;
    }
    current = addMonthsClamped_(firstDue, count * frequency, dueDay);
  }
  return current;
}

function countDueOnOrBefore_(firstDue, frequency, dueDay, untilDate, totalPeriods) {
  var count = 0;
  var current = resetTime_(firstDue);
  var target = resetTime_(untilDate);
  while (current.getTime() <= target.getTime()) {
    count++;
    if (totalPeriods && count >= totalPeriods) {
      return count;
    }
    if (count > 600) {
      break;
    }
    current = addMonthsClamped_(firstDue, count * frequency, dueDay);
  }
  return count;
}

function buildRecurringDatesBetween_(item, rangeStart, rangeEnd) {
  var startDate = parseDate_(item.startDate);
  if (!startDate) {
    return [];
  }
  var firstDue = getFirstDueDate_(startDate, item.dueDay, item.frequency);
  var dates = [];
  var count = 0;
  var current = firstDue;
  var start = resetTime_(rangeStart);
  var end = resetTime_(rangeEnd);
  while (current.getTime() <= end.getTime()) {
    if (current.getTime() >= start.getTime()) {
      dates.push({ date: current, period: count + 1 });
    }
    count++;
    if (item.totalPeriods && count >= item.totalPeriods) {
      break;
    }
    if (count > 600) {
      break;
    }
    current = addMonthsClamped_(firstDue, count * item.frequency, item.dueDay);
  }
  return dates;
}

function addMonthsClamped_(baseDate, months, dueDay) {
  return makeDateWithDay_(baseDate.getFullYear(), baseDate.getMonth() + months, dueDay);
}

function makeDateWithDay_(year, monthIndex, dueDay) {
  var lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return resetTime_(new Date(year, monthIndex, Math.min(Math.max(1, dueDay), lastDay)));
}

function resetTime_(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays_(date, days) {
  var result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return resetTime_(result);
}

function inferEntityFromRecurring_(row) {
  var haystack = [
    row[RECURRING_FIELD_MAP.systemCode],
    row[RECURRING_FIELD_MAP.docGroup],
    row[RECURRING_FIELD_MAP.depName],
    row[RECURRING_FIELD_MAP.note],
    row[RECURRING_FIELD_MAP.vendorName]
  ].join(' ').toUpperCase();
  return inferEntityFromText_(haystack);
}

function inferEntityFromTransaction_(row) {
  var haystack = [
    row.DocNo,
    row.Code,
    row.DepName,
    row.BranchName,
    row.VenName,
    row['กลุ่มเอกสาร'],
    row['หมายเหตุ']
  ].join(' ').toUpperCase();
  return inferEntityFromText_(haystack);
}

function inferEntityFromText_(haystack) {
  for (var i = 0; i < ENTITY_LIST.length; i++) {
    if (haystack.indexOf(ENTITY_LIST[i]) !== -1) {
      return ENTITY_LIST[i];
    }
  }
  if (haystack.indexOf('วีมันนี่') !== -1 || haystack.indexOf('เครดิต') !== -1) {
    return 'WMN';
  }
  if (haystack.indexOf('ลาว') !== -1 || haystack.indexOf('LAOS') !== -1 || haystack.indexOf('EXPORT') !== -1) {
    return 'WPS';
  }
  if (haystack.indexOf('การไฟฟ้า') !== -1 || ACTIVE_BRANCHES.some(function(branch) {
    return haystack.indexOf(branch.toUpperCase()) !== -1;
  })) {
    return 'SWE';
  }
  return 'SWT';
}

function isClosedBranch_(branchName) {
  var branch = normalizeText_(branchName);
  return CLOSED_BRANCH_MARKERS.some(function(marker) {
    return branch.indexOf(marker) !== -1;
  });
}

function isFuelExpense_(expenseCode, name, note) {
  var text = [expenseCode, name, note].join(' ');
  return text.indexOf('ค่าน้ำมันยานพาหนะ') !== -1 || text.indexOf('น้ำมัน') !== -1;
}

function extractLicensePlate_(text) {
  var match = normalizeText_(text).match(/[\u0E00-\u0E7F]{2}-?\d{4}/);
  return match ? match[0] : 'ไม่พบทะเบียน';
}

function buildMonthlyTrend_(rows) {
  var trend = [];
  for (var i = 1; i <= 12; i++) {
    trend.push({ month: i, amount: 0 });
  }
  rows.forEach(function(row) {
    if (row.month >= 1 && row.month <= 12) {
      trend[row.month - 1].amount += row.amount;
    }
  });
  return trend;
}

function buildFuelAnalytics_(rows, selectedMonth) {
  var vehicleTotals = {};
  var trendByVehicle = {};
  rows.forEach(function(row) {
    if (!row.isFuel) {
      return;
    }
    var plate = row.licensePlate || 'ไม่พบทะเบียน';
    if (!selectedMonth || row.month === selectedMonth) {
      vehicleTotals[plate] = (vehicleTotals[plate] || 0) + row.amount;
    }
    if (!trendByVehicle[plate]) {
      trendByVehicle[plate] = Array(12).fill(0);
    }
    if (row.month >= 1 && row.month <= 12) {
      trendByVehicle[plate][row.month - 1] += row.amount;
    }
  });
  return {
    totals: objectToSortedArray_(vehicleTotals),
    trend: trendByVehicle
  };
}

function buildEntityTopCategories_(rows) {
  var byEntity = {};
  rows.forEach(function(row) {
    if (!byEntity[row.entity]) {
      byEntity[row.entity] = {};
    }
    byEntity[row.entity][row.expenseCode] = (byEntity[row.entity][row.expenseCode] || 0) + row.amount;
  });
  var result = {};
  Object.keys(byEntity).forEach(function(entity) {
    result[entity] = objectToSortedArray_(byEntity[entity]).slice(0, 3);
  });
  return result;
}

function sumBy_(rows, key) {
  var totals = {};
  rows.forEach(function(row) {
    var groupKey = row[key] || 'ไม่ระบุ';
    totals[groupKey] = (totals[groupKey] || 0) + row.amount;
  });
  return totals;
}

function objectToSortedArray_(obj) {
  return Object.keys(obj).map(function(key) {
    return { label: key, amount: obj[key] };
  }).sort(function(a, b) {
    return b.amount - a.amount;
  });
}

function sumAmount_(rows) {
  return rows.reduce(function(total, row) {
    return total + row.amount;
  }, 0);
}

function sumProperty_(rows, property) {
  return rows.reduce(function(total, row) {
    return total + (parseAmount_(row[property]) || 0);
  }, 0);
}

function sortByDateDesc_(a, b) {
  return normalizeText_(b.docDate).localeCompare(normalizeText_(a.docDate));
}

function findRecurringRowById_(id) {
  var source = readSheetObjects_(SHEET_RECURRING);
  var idText = normalizeText_(id);
  for (var i = 0; i < source.rows.length; i++) {
    var row = source.rows[i];
    var rowId = normalizeText_(row[RECURRING_FIELD_MAP.id]) || String(row._rowNumber);
    if (rowId === idText || String(row._rowNumber) === idText) {
      return {
        sheet: source.sheet,
        headers: source.headers,
        row: row,
        rowNumber: row._rowNumber
      };
    }
  }
  return null;
}

function writeRecurringFields_(sheet, headers, rowNumber, data) {
  Object.keys(data).forEach(function(key) {
    var header = RECURRING_FIELD_MAP[key] || key;
    var index = headers.indexOf(header);
    if (index === -1) {
      return;
    }
    sheet.getRange(rowNumber, index + 1).setValue(valueForSheet_(header, data[key]));
  });
}

function valueForRecurringHeader_(header, data) {
  var keys = Object.keys(RECURRING_FIELD_MAP);
  for (var i = 0; i < keys.length; i++) {
    if (RECURRING_FIELD_MAP[keys[i]] === header && data[keys[i]] !== undefined) {
      return valueForSheet_(header, data[keys[i]]);
    }
  }
  if (data[header] !== undefined) {
    return valueForSheet_(header, data[header]);
  }
  return '';
}

function valueForSheet_(header, value) {
  if (header === RECURRING_FIELD_MAP.startDate && value) {
    return parseDate_(value) || value;
  }
  if (header === RECURRING_FIELD_MAP.amount) {
    return parseAmount_(value);
  }
  if ([
    RECURRING_FIELD_MAP.totalPeriods,
    RECURRING_FIELD_MAP.dueDay,
    RECURRING_FIELD_MAP.frequency,
    RECURRING_FIELD_MAP.alertPeriods
  ].indexOf(header) !== -1) {
    return parseIntSafe_(value) || '';
  }
  return value;
}

function getNextRecurringId_(rows) {
  var max = 0;
  rows.forEach(function(row) {
    var id = parseIntSafe_(row[RECURRING_FIELD_MAP.id]);
    if (id > max) {
      max = id;
    }
  });
  return max + 1;
}

function markRecurringInactive_(found) {
  var user = getCurrentUser();
  var noteIndex = found.headers.indexOf(RECURRING_FIELD_MAP.note);
  if (noteIndex === -1) {
    throw new Error('ไม่พบคอลัมน์หมายเหตุ');
  }
  var before = rowValuesToObject_(found.headers, found.sheet.getRange(found.rowNumber, 1, 1, found.headers.length).getValues()[0], found.rowNumber);
  var note = normalizeText_(before[RECURRING_FIELD_MAP.note]);
  if (note.indexOf('เลิก') === -1) {
    note = note ? note + ' | เลิก' : 'เลิก';
  }
  found.sheet.getRange(found.rowNumber, noteIndex + 1).setValue(note);
  var after = rowValuesToObject_(found.headers, found.sheet.getRange(found.rowNumber, 1, 1, found.headers.length).getValues()[0], found.rowNumber);
  appendAudit_('deactivateRecurringItem', before, after, user.email);
  return decorateRecurringRow_(after);
}

function rowValuesToObject_(headers, values, rowNumber) {
  var row = { _rowNumber: rowNumber };
  headers.forEach(function(header, index) {
    row[header] = normalizeCell_(values[index]);
  });
  return row;
}

function getOrCreateBudgetSheet_() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_BUDGET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_BUDGET);
    sheet.appendRow(['year', 'month', 'entity', 'category', 'budget', 'updatedAt', 'updatedBy']);
  }
  return sheet;
}

function readBudgetTargets_(year, month, entity) {
  var source;
  try {
    source = readSheetObjects_(SHEET_BUDGET);
  } catch (err) {
    return [];
  }
  return source.rows.filter(function(row) {
    var rowEntity = normalizeFilter_(row.entity) || 'ทั้งหมด';
    return parseIntSafe_(row.year) === year &&
      parseMonth_(row.month) === month &&
      (rowEntity === entity || rowEntity === 'ทั้งหมด');
  }).map(function(row) {
    return {
      year: parseIntSafe_(row.year),
      month: parseMonth_(row.month),
      entity: normalizeFilter_(row.entity) || 'ทั้งหมด',
      category: normalizeText_(row.category),
      budget: parseAmount_(row.budget)
    };
  });
}

function writeBudgetRow_(sheet, headers, rowNumber, values) {
  headers.forEach(function(header, index) {
    if (values[header] !== undefined) {
      sheet.getRange(rowNumber, index + 1).setValue(values[header]);
    }
  });
}

function budgetKey_(year, month, entity, category) {
  return [year, month, entity || 'ทั้งหมด', category].join('|');
}

function getBudgetStatus_(actual, budget) {
  if (!budget) {
    return 'none';
  }
  var ratio = actual / budget;
  if (ratio <= 0.9) {
    return 'green';
  }
  if (ratio <= 1.1) {
    return 'amber';
  }
  return 'red';
}

function buildLineDueMessage_(dueItems, days) {
  var lines = ['แจ้งเตือนค่าใช้จ่ายครบกำหนดภายใน ' + days + ' วัน'];
  dueItems.forEach(function(item) {
    lines.push([
      item.dueDate,
      item.vendorName || item.category,
      item.category,
      formatAmountForText_(item.amount)
    ].join(' | '));
  });
  return lines.join('\n');
}

function sendLineMessage_(message) {
  var props = PropertiesService.getScriptProperties();
  var channelToken = props.getProperty('LINE_MESSAGING_CHANNEL_ACCESS_TOKEN');
  var to = props.getProperty('LINE_MESSAGING_TO');
  if (channelToken && to) {
    var response = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + channelToken
      },
      payload: JSON.stringify({
        to: to,
        messages: [{ type: 'text', text: message }]
      }),
      muteHttpExceptions: true
    });
    return {
      sent: response.getResponseCode() >= 200 && response.getResponseCode() < 300,
      channel: 'Messaging API',
      status: response.getResponseCode(),
      body: response.getContentText()
    };
  }

  var legacyToken = props.getProperty('LINE_NOTIFY_TOKEN');
  if (legacyToken) {
    var legacyResponse = UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
      method: 'post',
      payload: { message: message },
      headers: {
        Authorization: 'Bearer ' + legacyToken
      },
      muteHttpExceptions: true
    });
    return {
      sent: legacyResponse.getResponseCode() >= 200 && legacyResponse.getResponseCode() < 300,
      channel: 'LINE Notify legacy',
      status: legacyResponse.getResponseCode(),
      body: legacyResponse.getContentText(),
      warning: 'LINE Notify APIs ended on 2025-03-31; use Messaging API if this fails.'
    };
  }

  return {
    sent: false,
    channel: '',
    status: 0,
    body: '',
    warning: 'ยังไม่ได้ตั้งค่า LINE_MESSAGING_CHANNEL_ACCESS_TOKEN/LINE_MESSAGING_TO หรือ LINE_NOTIFY_TOKEN'
  };
}

function appendAudit_(action, before, after, userEmail) {
  try {
    var sheet = getOrCreateAuditSheet_();
    sheet.appendRow([
      new Date(),
      userEmail || (requireAuth_().email || ''),
      action,
      before ? JSON.stringify(before) : '',
      after ? JSON.stringify(after) : ''
    ]);
  } catch (err) {
    // Audit failures should not block the user's primary action.
  }
}

function getOrCreateAuditSheet_() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_AUDIT);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_AUDIT);
    sheet.appendRow(['timestamp', 'user', 'action', 'before', 'after']);
  }
  return sheet;
}

function findUserRoleInSheet_(email) {
  var source = safeReadSheetObjects_(SHEET_USERS);
  var lowerEmail = email.toLowerCase();
  for (var i = 0; i < source.rows.length; i++) {
    var row = source.rows[i];
    var rowEmail = normalizeText_(row.email || row.Email || row['อีเมล']).toLowerCase();
    var active = normalizeText_(row.active || row.Active || row['ใช้งาน']);
    if (rowEmail === lowerEmail && active !== 'false' && active !== '0') {
      return {
        email: email,
        role: normalizeText_(row.role || row.Role || row['สิทธิ์']) || 'branch',
        branch: normalizeText_(row.branch || row.Branch || row['สาขา']),
        name: normalizeText_(row.name || row.Name || row['ชื่อ']) || email.split('@')[0]
      };
    }
  }
  return null;
}

function findUserRoleInProperties_(email) {
  var raw = PropertiesService.getScriptProperties().getProperty('USER_ROLES_JSON');
  if (!raw) {
    return null;
  }
  try {
    var roles = JSON.parse(raw);
    for (var i = 0; i < roles.length; i++) {
      if (normalizeText_(roles[i].email).toLowerCase() === email.toLowerCase()) {
        return {
          email: email,
          role: normalizeText_(roles[i].role) || 'branch',
          branch: normalizeText_(roles[i].branch),
          name: normalizeText_(roles[i].name) || email.split('@')[0]
        };
      }
    }
  } catch (err) {
    return null;
  }
  return null;
}

function getLastUpdated_() {
  try {
    return DriveApp.getFileById(SPREADSHEET_ID).getLastUpdated().toISOString();
  } catch (err) {
    return new Date().toISOString();
  }
}

function getCategoryColorMap_() {
  return {
    'ค่าเช่าพื้นที่': '#7C3AED',
    'ค่าไฟฟ้า': '#16A34A',
    'ค่าน้ำ': '#2563EB',
    'ค่าทำบัญชี': '#D97706',
    'ค่าเช่ารถ': '#DB2777',
    'ค่าใช้จ่าย MD': '#6B7280',
    'ดอกเบี้ย': '#DC2626'
  };
}

function normalizeText_(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

function normalizeFilter_(value) {
  var text = normalizeText_(value);
  if (!text || text === 'undefined' || text === 'null') {
    return '';
  }
  return text;
}

function parseAmount_(value) {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }
  var text = normalizeText_(value)
    .replace(/,/g, '')
    .replace(/฿/g, '')
    .replace(/\s/g, '');
  if (!text) {
    return 0;
  }
  var number = parseFloat(text);
  return isNaN(number) ? 0 : number;
}

function parseIntSafe_(value) {
  if (typeof value === 'number') {
    return Math.floor(value);
  }
  var text = normalizeText_(value).replace(/,/g, '');
  if (!text) {
    return 0;
  }
  var number = parseInt(text, 10);
  return isNaN(number) ? 0 : number;
}

function parseMonth_(value) {
  if (typeof value === 'number') {
    return value >= 1 && value <= 12 ? Math.floor(value) : 0;
  }
  var text = normalizeText_(value);
  if (!text || text === 'ทั้งหมด') {
    return 0;
  }
  var numeric = parseInt(text, 10);
  if (!isNaN(numeric) && numeric >= 1 && numeric <= 12) {
    return numeric;
  }
  var months = {
    'มกราคม': 1,
    'ม.ค.': 1,
    'กุมภาพันธ์': 2,
    'ก.พ.': 2,
    'มีนาคม': 3,
    'มี.ค.': 3,
    'เมษายน': 4,
    'เม.ย.': 4,
    'พฤษภาคม': 5,
    'พ.ค.': 5,
    'มิถุนายน': 6,
    'มิ.ย.': 6,
    'กรกฎาคม': 7,
    'ก.ค.': 7,
    'สิงหาคม': 8,
    'ส.ค.': 8,
    'กันยายน': 9,
    'ก.ย.': 9,
    'ตุลาคม': 10,
    'ต.ค.': 10,
    'พฤศจิกายน': 11,
    'พ.ย.': 11,
    'ธันวาคม': 12,
    'ธ.ค.': 12
  };
  return months[text] || 0;
}

function parseDate_(value) {
  if (value instanceof Date) {
    return resetTime_(value);
  }
  if (typeof value === 'number' && value > 20000) {
    return resetTime_(new Date(Math.round((value - 25569) * 86400 * 1000)));
  }
  var text = normalizeText_(value);
  if (!text) {
    return null;
  }
  var iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    return resetTime_(new Date(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10)));
  }
  var local = text.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (local) {
    var year = parseInt(local[3], 10);
    if (year > 2400) {
      year -= 543;
    }
    if (year < 100) {
      year += 2000;
    }
    return resetTime_(new Date(year, parseInt(local[2], 10) - 1, parseInt(local[1], 10)));
  }
  var parsed = new Date(text);
  if (!isNaN(parsed.getTime())) {
    return resetTime_(parsed);
  }
  return null;
}

function formatDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function formatAmountForText_(amount) {
  return '฿' + Number(amount || 0).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function escapeHtml_(value) {
  return normalizeText_(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getErrorMessage_(err) {
  return err && err.message ? err.message : String(err);
}
