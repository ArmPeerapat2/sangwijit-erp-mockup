/* ════════════════════════════════════════════════════════════════
   SWT SC Wire — orchestrator ผูก SC runtime เข้าหน้าฟอร์ม (Wire phase)
   ใช้: <body data-swt-sc="sl4"> + bundle scripts แล้ว swtScWire()
   ════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var FILE_MAP = {
    'sl1-quotation-mockup': 'sl1',
    'sl2-reservation-mockup': 'sl2',
    'sl3-deposit-mockup': 'sl3',
    'sl4-invoice-mockup': 'sl4',
    'slcn-credit-memo-mockup': 'slcn',
    'po1-purchase-request-mockup': 'po1',
    'po4-purchase-order-mockup': 'po4',
    'po6-ap-invoice-mockup': 'po6',
    'po8-deposit-bill-mockup': 'po8',
    'po-cn-credit-note-mockup': 'po-cn',
    'wh1-receive-mockup': 'wh1',
    'fi2-ap-payment-mockup': 'fi2',
    'fi1-ar-receive-mockup': 'fi1'
  };

  var PROFILES = {
    sl1: {
      print: { docType: 'QT', docNo: 'QT-2606-0047' },
      panels: { 't-ship': { kind: 'delivery', opts: { address: '86/1 ม.4 ต.นาแก อ.นาแก จ.นครพนม', shipDate: '13/06/26', receiver: 'คุณอดิเทพ 081-xxx-xxxx' } } },
      migrate: {
        status: '.status-strip',
        summaryCard: '.row-bottom > .card:last-child',
        sc11: { template: 'sales-invoice', interactive: true, calc: { subtotal: 17089, lineDiscount: 799 }, discountInput: 799, vatMode: 'exclusive', vatRate: 7 },
        sc12: { pills: [{ text: '📄 ร่าง', type: 'neutral' }, { text: '฿ VAT 7%', type: 'info' }, { text: 'เครดิต 7 วัน', type: 'success' }], makerChecker: { nodes: [{ role: 'ขาย ✓', step: 'เสนอราคา', state: 'ok' }, { role: 'ลูกค้า ⏱', step: 'ตอบรับ', state: 'wait' }] }, docChain: [{ label: 'QT 0047', state: 'current' }, { label: 'SO', href: 'sl2-reservation-mockup.html' }] }
      }
    },
    sl2: {
      print: { docType: 'SO', docNo: 'SO-2606-0021' },
      panels: {
        't-pay': { kind: 'payment', opts: { total: 17430.30, creditRemaining: 800000, compact: true } },
        't-ship': { kind: 'delivery', opts: { address: '86/1 ม.4 ต.นาแก อ.นาแก จ.นครพนม', shipDate: '13/06/26' } }
      },
      migrate: {
        status: '.status-strip',
        summaryCard: '.row-bottom > .card:last-child',
        sc11: { template: 'sales-invoice', interactive: true, calc: { subtotal: 17089, lineDiscount: 799 }, discountInput: 799, vatMode: 'exclusive', vatRate: 7 },
        sc12: { pills: [{ text: '📄 จองแล้ว', type: 'neutral' }, { text: '฿ VAT 7%', type: 'info' }], makerChecker: { nodes: [{ role: 'ขาย ✓', step: 'จอง', state: 'ok' }, { role: 'INV ⏱', step: 'ออกบิล', state: 'wait' }] }, docChain: [{ label: 'QT 0047 ✓', href: 'bc365/sl1-quotation-mockup.html', state: 'done' }, { label: 'SO 0021', state: 'current' }, { label: 'INV', href: 'sl4-invoice-mockup.html' }] }
      }
    },
    sl3: {
      print: { docType: 'DP', docNo: 'DP-08DP-2606-0009' },
      panels: { 't-pay': { kind: 'payment', opts: { total: 6290, creditRemaining: 500000, showCredit: false, compact: true } } },
      migrate: {
        status: '.status-strip',
        summaryCard: '.row-bottom > .card:last-child',
        sc11: { template: 'sales-invoice', interactive: false, calc: { subtotal: 6290 }, vatMode: 'exclusive', vatRate: 7 },
        sc12: { pills: [{ text: '💰 มัดจำ', type: 'warning' }, { text: 'จาก SO 0021', type: 'info' }], docChain: [{ label: 'SO 0021 ✓', href: 'sl2-reservation-mockup.html', state: 'done' }, { label: 'DP 0009', state: 'current' }, { label: 'INV', href: 'sl4-invoice-mockup.html' }] }
      }
    },
    sl4: {
      print: { docType: 'INV', docNo: 'INV-2606-0221' },
      panels: {
        't-pay': { kind: 'payment', opts: { total: 17430.30, creditRemaining: 500000, compact: true } },
        't-dep': { kind: 'deposit', opts: { invoiceAmt: 17430.30, mode: 'apply' } },
        't-ship': { kind: 'delivery', opts: { address: '86/1 ม.4 ต.นาแก อ.นาแก จ.นครพนม', shipDate: '13/06/26', shipTime: '13:00–16:00' } }
      },
      tracking: true
    },
    slcn: {
      print: { docType: 'CN', docNo: 'CN-2606-0012' },
      migrate: {
        status: '.status-strip',
        summaryCard: '.row-bottom > .card:last-child',
        sc11: { template: 'sales-invoice', interactive: true, calc: { subtotal: 12000 }, discountInput: 0, vatMode: 'exclusive', vatRate: 7 },
        sc12: { pills: [{ text: '📄 ร่าง CN', type: 'neutral' }], docChain: [{ label: 'INV 0221 ✓', href: 'sl4-invoice-mockup.html', state: 'done' }, { label: 'CN', state: 'current' }] }
      }
    },
    po1: {
      print: { docType: 'PR', docNo: 'PR-2606-0019' },
      panels: { 't-hist': { kind: 'approval', opts: { steps: [{ label: 'ขอสั่ง', state: 'done', who: 'สมศรี' }, { label: 'ผจก.จัดซื้อ', state: 'current', who: 'ก้อง' }, { label: 'อนุมัติ', state: 'wait', who: '—' }] } } },
      migrate: {
        status: '.status-strip',
        summaryCard: '.row-bottom > .card:last-child',
        sc11: { template: 'sales-invoice', interactive: false, calc: { subtotal: 2260000 }, vatMode: 'exclusive', vatRate: 7 },
        sc12: { pills: [{ text: '📄 ร่าง PR', type: 'neutral' }], makerChecker: { nodes: [{ role: 'ผู้ขอ ✓', step: 'PR', state: 'ok' }, { role: 'อนุมัติ ⏱', step: 'CF-2.6', state: 'wait' }] } }
      }
    },
    po4: {
      print: { docType: 'PO', docNo: 'PO-2606-0042' },
      panels: { 't-hist': { kind: 'approval', opts: { steps: [{ label: 'สร้าง PO', state: 'done', who: 'สมศรี' }, { label: 'ส่งอนุมัติ', state: 'current', who: 'ผจก.จัดซื้อ' }, { label: 'Send PO', state: 'wait', who: '—' }] } } }
    },
    po6: {
      print: { docType: 'AP', docNo: 'AP-2606-0088' },
      threeWay: { poNo: 'PO-2606-0042', grnNo: 'GR-2606-0210', invNo: 'DKN-INV-25088' },
      panels: { 't-hist': { kind: 'approval', opts: { steps: [{ label: 'จัดซื้อ Match', state: 'done', who: 'วิไล' }, { label: 'บัญชี Post', state: 'current', who: 'บัญชี' }] } } }
    },
    po8: {
      print: { docType: 'DEP-POOL', docNo: 'POOL-2606-0089' }
    },
    'po-cn': {
      print: { docType: 'PO-CN', docNo: 'PCN-2606-0007' },
      migrate: {
        summaryCard: '.row-bottom > .card:last-child',
        sc11: { template: 'sales-invoice', interactive: true, calc: { subtotal: 49000 }, discountInput: 0, vatMode: 'exclusive', vatRate: 7 }
      }
    },
    wh1: {
      print: { docType: 'GR', docNo: 'GR-2606-0210' },
      serial: true,
      panels: { 't-serial': { kind: 'serialSummary', opts: { text: 'Serial ครบ 70/90 · คลิกปุ่ม Serial ต่อแถวเพื่อ SC-8' } } }
    },
    fi2: {
      print: { docType: 'PV', docNo: 'PV-2606-0042' },
      bankOut: '#fi2BankOut',
      panels: {
        't-pay': { kind: 'approval', opts: { steps: [{ label: 'เตรียมจ่าย', state: 'done', who: 'วิไล' }, { label: 'อนุมัติจ่าย', state: 'current', who: 'ผจก.บัญชี' }, { label: 'Post PV', state: 'wait', who: '—' }] } }
      }
    },
    fi1: {
      print: { docType: 'RV', docNo: 'RV-2606-0033' },
      bankIn: '#fi1BankIn'
    }
  };

  function pageKey() {
    var attr = document.body && document.body.getAttribute('data-swt-sc');
    if (attr) return attr;
    var path = (global.location && global.location.pathname) || '';
    var base = path.split('/').pop().replace(/\.html$/i, '');
    return FILE_MAP[base] || null;
  }

  function hideLegacy(ids) {
    (ids || ['printModal', 'matchModal']).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  function wirePrint(cfg, overrides) {
    if (!cfg || typeof global.dfOpenPrint !== 'function') return;
    var o = Object.assign({}, cfg, overrides && overrides.print);
    global.tplOpenPrint = function () { global.dfOpenPrint(o); };
    global.tplClosePrint = function () { if (global.dfClosePrint) global.dfClosePrint(); };
    hideLegacy(['printModal']);
    if (cfg.printSelector) {
      var btn = document.querySelector(cfg.printSelector);
      if (btn) {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function (e) { e.preventDefault(); global.dfOpenPrint(o); });
      }
    }
    document.querySelectorAll('[onclick*="tplOpenPrint"]').forEach(function (el) {
      var oc = el.getAttribute('onclick') || '';
      if (oc.indexOf('tplOpenPrint') >= 0) {
        el.removeAttribute('onclick');
        el.addEventListener('click', function (e) { e.preventDefault(); global.dfOpenPrint(o); });
      }
    });
  }

  function mountPanel(tabId, html) {
    var pane = document.getElementById(tabId);
    if (!pane) return null;
    pane.innerHTML = html;
    return pane.querySelector('[data-sc-mount]') || pane;
  }

  function wirePanels(panels) {
    if (!panels) return;
    Object.keys(panels).forEach(function (tabId) {
      var p = panels[tabId];
      var mountId = 'scWire_' + tabId;
      var pane = mountPanel(tabId, '<div data-sc-mount id="' + mountId + '"></div>');
      if (!pane) return;
      var sel = '#' + mountId;
      if (p.kind === 'payment' && global.swtRenderPayment) global.swtRenderPayment(sel, p.opts || {});
      else if (p.kind === 'deposit' && global.swtRenderDeposit) global.swtRenderDeposit(sel, p.opts || {});
      else if (p.kind === 'delivery' && global.swtRenderDelivery) global.swtRenderDelivery(sel, p.opts || {});
      else if (p.kind === 'approval' && global.swtRenderApproval) global.swtRenderApproval(sel, p.opts || {});
      else if (p.kind === 'serialSummary') {
        pane.innerHTML = '<div style="font-size:12px;color:#6B7280;padding:4px 0">' + (p.opts && p.opts.text ? p.opts.text : '') + '</div>';
      }
    });
  }

  function wireThreeWay(cfg) {
    if (!cfg || typeof global.dfOpen3Way !== 'function') return;
    global.openMatch = function () { global.dfOpen3Way(cfg); };
    global.closeMatch = function () { if (global.dfClose3Way) global.dfClose3Way(); };
    hideLegacy(['matchModal']);
  }

  function wireBankIn(selector) {
    if (!selector || typeof global.dfOpenBank !== 'function') return;
    var field = document.querySelector(selector);
    if (!field || field.dataset.sc15in) return;
    field.dataset.sc15in = '1';
    var wrap = field.closest('.field') || field.parentElement;
    if (!wrap) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card-btn';
    btn.style.cssText = 'margin-top:6px;font-size:11px;padding:5px 10px';
    btn.textContent = '🏦 เลือกบัญชีรับ (SC-15)';
    btn.onclick = function () {
      global.dfOpenBank({
        direction: 'in',
        onSelect: function (bk) {
          var label = (bk.bank || '') + ' · ' + (bk.accountNo || '');
          if (field.tagName === 'SELECT') {
            var opt = field.options[0] || new Option(label, label);
            opt.text = label + (bk.entity ? ' (' + bk.entity + ')' : '');
            if (!field.options.length) field.add(opt);
            else field.options[0].text = opt.text;
          } else {
            field.value = label;
          }
          document.dispatchEvent(new CustomEvent('bank:selected', { detail: bk }));
        }
      });
    };
    wrap.appendChild(btn);
  }

  function wireBankOut(selector) {
    if (!selector || typeof global.dfOpenBank !== 'function') return;
    var field = document.querySelector(selector);
    if (!field || field.dataset.sc15) return;
    field.dataset.sc15 = '1';
    var wrap = field.closest('.field') || field.parentElement;
    if (!wrap) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card-btn';
    btn.style.cssText = 'margin-top:6px;font-size:11px;padding:5px 10px';
    btn.textContent = '🏦 เลือกบัญชี (SC-15)';
    btn.onclick = function () {
      global.dfOpenBank({
        direction: 'out',
        onSelect: function (bk) {
          var label = (bk.bank || '') + ' · ' + (bk.accountNo || '');
          if (field.tagName === 'SELECT') {
            var opt = field.options[0] || new Option(label, label);
            opt.text = label + (bk.entity ? ' (' + bk.entity + ')' : '');
            if (!field.options.length) field.add(opt);
            else field.options[0].text = opt.text;
          } else {
            field.value = label;
          }
          document.dispatchEvent(new CustomEvent('bank:selected', { detail: bk }));
        }
      });
    };
    wrap.appendChild(btn);
    var bankField = wrap.querySelector('select.pay-sel');
    if (bankField && bankField !== field) wireBankOutSelect(bankField);
    else if (field.tagName === 'SELECT') wireBankOutSelect(field);
  }

  function wireBankOutSelect(sel) {
    if (sel.dataset.sc15sel) return;
    sel.dataset.sc15sel = '1';
    sel.addEventListener('dblclick', function () {
      if (typeof global.dfOpenBank === 'function') {
        global.dfOpenBank({ direction: 'out', onSelect: function (bk) {
          sel.options[0].text = bk.bank + ' · ' + bk.accountNo;
        }});
      }
    });
    sel.title = 'ดับเบิลคลิกเปิด SC-15 เลือกบัญชี';
  }

  function wireSerialWh1() {
    if (typeof global.swtSerialInline !== 'function') return;
    global.wh1Serial = function (sku, qty) {
      var modal = document.getElementById('serialModal');
      if (!modal) return;
      var title = document.getElementById('serialTitle');
      if (title) title.textContent = '🔢 Serial (SC-8) — ' + sku + ' (' + qty + ' ชิ้น)';
      var body = modal.querySelector('.tpl-modal');
      if (!body) return;
      body.querySelectorAll('.srow').forEach(function (n) { n.remove(); });
      var mount = document.getElementById('wh1SerialMount');
      if (!mount) {
        mount = document.createElement('div');
        mount.id = 'wh1SerialMount';
        var actions = body.querySelector('.m-actions');
        body.insertBefore(mount, actions);
      }
      global.swtSerialInline('#wh1SerialMount', { qty: qty });
      modal.classList.add('on');
    };
  }

  function wireTracking() {
    if (typeof global.dfOpenTracking !== 'function') return;
    document.querySelectorAll('table.items tbody tr:not(.empty-row)').forEach(function (tr) {
      var code = tr.querySelector('.item-code');
      if (!code || tr.querySelector('.sc-track-btn')) return;
      var sku = (code.textContent || '').trim();
      if (!sku) return;
      var td = tr.cells[tr.cells.length - 1];
      if (!td) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sc-track-btn';
      b.style.cssText = 'border:none;background:none;color:#2563EB;cursor:pointer;font-size:10px;font-weight:600';
      b.textContent = '📦 Track';
      b.onclick = function () { global.dfOpenTracking({ lineId: sku }); };
      td.appendChild(document.createTextNode(' '));
      td.appendChild(b);
    });
  }

  function wireBcHints() {
    if (typeof global.swtBcTooltip !== 'function') return;
    document.querySelectorAll('[data-bc-field]').forEach(function (el) {
      global.swtBcTooltip(el, el.getAttribute('data-bc-field'));
    });
  }

  function migrateSummary(cardSel, mountId, sc11) {
    if (!global.swtRenderSummary) return;
    var card = document.querySelector(cardSel);
    if (!card || card.querySelector('#' + mountId)) return;
    card.querySelectorAll('.summary-row, .summary-total').forEach(function (n) { n.remove(); });
    var baht = card.querySelector('.baht-text');
    var mount = document.createElement('div');
    mount.id = mountId;
    if (baht) card.insertBefore(mount, baht);
    else card.appendChild(mount);
    var hdr = card.querySelector('.card-title, .card-header');
    if (hdr) {
      var zone = hdr.querySelector('.tpl-zone');
      if (zone) zone.textContent = 'SC-11';
    }
    global.swtRenderSummary('#' + mountId, sc11);
  }

  function stripOptsFromSc12(sc12) {
    if (!sc12) return {};
    return { pills: sc12.pills, makerChecker: sc12.makerChecker };
  }

  function migrateStatus(stripSel, mountId, sc12) {
    if (!global.swtRenderStatusStrip) return;
    var strip = document.querySelector(stripSel);
    if (!strip || document.getElementById(mountId)) return;
    var wrap = document.createElement('div');
    wrap.id = mountId;
    wrap.className = 'status-strip';
    strip.parentNode.replaceChild(wrap, strip);
    global.swtRenderStatusStrip('#' + mountId, stripOptsFromSc12(sc12));
  }

  function wireStandardMounts(key, sc12, gateCfg) {
    if (!sc12) return;
    var id12 = keyId(key) + 'Sc12';
    var idDc = keyId(key) + 'DcStrip';
    var idGate = keyId(key) + 'Gate';
    var el12 = document.getElementById(id12);
    if (el12 && global.swtRenderStatusStrip) {
      global.swtRenderStatusStrip('#' + id12, stripOptsFromSc12(sc12));
    }
    if (sc12.docChain && global.swtRenderDocChain) {
      var elDc = document.getElementById(idDc);
      if (elDc) global.swtRenderDocChain('#' + idDc, { label: 'Doc Chain', nodes: sc12.docChain });
    }
    if (gateCfg && global.swtRenderGateAlert) {
      var elGate = document.getElementById(idGate);
      if (elGate) global.swtRenderGateAlert('#' + idGate, gateCfg);
    }
  }

  var GATE_DEFAULTS = {
    sl1: { type: 'ok', compactOk: true, text: '✅ ใบเสนอราคาพร้อมส่ง · VAT 7%' },
    sl2: { type: 'ok', compactOk: true, text: '✅ จองสต็อกแล้ว · มัดจำ 6,290 · คงค้าง 11,140.30' },
    sl3: { type: 'ok', compactOk: true, text: '✅ รับมัดจำแล้ว · รอออกบิลขาย (SL-4)' },
    slcn: { type: 'ok', compactOk: true, text: '✅ อ้างอิง INV-2606-0221 · พร้อมออก CN' },
    po1: { type: 'warn', text: '⏳ รออนุมัติ CF-2.6 · Maker ≠ Checker' },
    po4: { type: 'warn', text: '⏳ รออนุมัติ CF-2.6 · Maker ≠ Checker — ผู้สั่งอนุมัติเองไม่ได้' }
  };

  function keyId(key) {
    return String(key || '').replace(/-/g, '_');
  }

  function wireDepositSync(key) {
    document.addEventListener('deposit:applied', function (e) {
      var lines = e.detail && e.detail.lines;
      if (!lines || !lines.length || !global.swtSummarySetDeposits) return;
      var mount = document.getElementById(keyId(key) + 'Sc11');
      if (mount) global.swtSummarySetDeposits(mount, lines);
    });
  }

  function runMigrate(key, m) {
    if (!m) return;
    var id11 = keyId(key) + 'Sc11';
    if (m.summaryCard && m.sc11) migrateSummary(m.summaryCard, id11, m.sc11);
    if (m.status && m.sc12) migrateStatus(m.status, keyId(key) + 'Sc12', m.sc12);
    if (m.sc12) wireStandardMounts(key, m.sc12, GATE_DEFAULTS[key]);
  }

  function swtScWire(overrides) {
    var key = pageKey();
    if (!key) return { key: null };
    var profile = PROFILES[key];
    if (!profile) return { key: key, wired: false };
    overrides = overrides || {};

    wirePrint(profile, overrides);
    wirePanels(profile.panels);
    if (profile.threeWay) wireThreeWay(profile.threeWay);
    if (profile.bankOut) wireBankOut(profile.bankOut);
    if (profile.bankIn) wireBankIn(profile.bankIn);
    if (profile.serial) wireSerialWh1();
    if (profile.tracking) wireTracking();
    runMigrate(key, profile.migrate);
    wireDepositSync(key);
    wireBcHints();
    hideLegacy(['printModal', 'matchModal']);

    document.dispatchEvent(new CustomEvent('sc:wired', { detail: { page: key } }));
    return { key: key, wired: true };
  }

  global.swtScWire = swtScWire;
  global.swtScWireProfiles = PROFILES;

  if (document.body && document.body.getAttribute('data-swt-sc-auto') !== 'off') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { swtScWire(); });
    } else {
      swtScWire();
    }
  }
})(typeof window !== 'undefined' ? window : this);
