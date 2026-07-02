/* ════════════════════════════════════════════════════════════════
   SC Modals — SC-10 Map · SC-13 3-Way · SC-15 Bank · SC-16 Print · SC-18 Tracking
   API: dfOpenMap · dfOpen3Way · dfOpenBank · dfOpenPrint · dfOpenTracking
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var _ctx = { onConfirm: null, onSelect: null };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmt(n) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  var TH_ZIP_META = {
    '10110': { province: 'กรุงเทพมหานคร', district: 'วัฒนา', subdistricts: ['คลองเตยเหนือ', 'คลองตันเหนือ', 'พระโขนงเหนือ'] },
    '10220': { province: 'กรุงเทพมหานคร', district: 'บางเขน', subdistricts: ['อนุสาวรีย์', 'ท่าแร้ง'] },
    '10230': { province: 'กรุงเทพมหานคร', district: 'ลาดพร้าว', subdistricts: ['ลาดพร้าว', 'จรเข้บัว'] },
    '10540': { province: 'สมุทรปราการ', district: 'บางพลี', subdistricts: ['บางโฉลง', 'บางพลีใหญ่', 'ราชาเทวะ'] },
    '12000': { province: 'ปทุมธานี', district: 'เมืองปทุมธานี', subdistricts: ['บางปรอก', 'บ้านใหม่', 'บางขะแยง'] },
    '48130': { province: 'นครพนม', district: 'นาแก', subdistricts: ['นาแก', 'พิมาน'] },
    '50000': { province: 'เชียงใหม่', district: 'เมืองเชียงใหม่', subdistricts: ['ศรีภูมิ', 'พระสิงห์', 'ช้างเผือก'] }
  };

  function zipOnly(v) {
    return String(v || '').replace(/\D/g, '').slice(0, 5);
  }

  var BASE_CSS = `
  .df-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.42);z-index:950;align-items:center;justify-content:center;font-family:'Inter','Noto Sans Thai',sans-serif;font-size:13px;color:#111827}
  .df-bg.on{display:flex}
  .scm-modal{background:#fff;border-radius:10px;box-shadow:0 12px 44px rgba(0,0,0,.28);display:flex;flex-direction:column;max-height:92vh;font-family:inherit}
  .scm-hd{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:14px 18px;border-bottom:1px solid #E5E7EB}
  .scm-hd h3{margin:0;font-size:15px;font-weight:700;display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex:1;min-width:0}
  .scm-x,.df-x{flex-shrink:0;width:30px;height:30px;border:none;border-radius:6px;background:#F3F4F6;color:#6B7280;font-size:17px;line-height:1;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;padding:0}
  .scm-x:hover,.df-x:hover{background:#FEE2E2;color:#DC2626}
  .scm-bd{padding:14px 18px;overflow:auto;flex:1;min-height:0}
  .scm-ft{display:flex;justify-content:flex-end;gap:8px;padding:12px 18px;border-top:1px solid #E5E7EB}
  .scm-btn{padding:7px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid transparent;font-family:inherit}
  .scm-btn.out{background:#fff;color:#374151;border-color:#E5E7EB}
  .scm-btn.pri{background:#2563EB;color:#fff}
  .scm-btn.ok{background:#10B981;color:#fff}
  .scm-tbl{width:100%;border-collapse:collapse;font-size:12px}
  .scm-tbl th{background:#F8FAFC;padding:7px 9px;text-align:left;border-bottom:2px solid #E5E7EB;font-size:10.5px;color:#6B7280;text-transform:uppercase}
  .scm-tbl td{padding:7px 9px;border-bottom:1px solid #F3F4F6}
  .scm-tbl .num{text-align:right;font-family:'Inter',monospace}
  .scm-chip{display:inline-block;padding:2px 8px;border-radius:9px;font-size:10px;font-weight:700;background:#DCFCE7;color:#166534}
  .scm-chip.warn{background:#FEF3C7;color:#92400E}
  .scm-chip.bad{background:#FEE2E2;color:#991B1B}
  .mono{font-family:'Inter',monospace}
  `;

  function injectStyle(id, extra) {
    if (document.getElementById(id)) return;
    var st = document.createElement('style');
    st.id = id;
    st.textContent = BASE_CSS + (extra || '');
    document.head.appendChild(st);
  }

  function closeAll() {
    document.querySelectorAll('.df-bg.scm').forEach(function (m) { m.classList.remove('on'); });
  }

  function scmHd(titleInner, closeFn) {
    return '<div class="scm-hd"><h3>' + titleInner + '</h3>' +
      '<button type="button" class="scm-x" onclick="' + closeFn + '()" title="ปิด (Esc)" aria-label="ปิด">✕</button></div>';
  }

  document.addEventListener('click', function (e) {
    if (e.target.classList && e.target.classList.contains('df-bg') && e.target.classList.contains('scm')) {
      e.target.classList.remove('on');
    }
  });

  var SCM_CLOSE = ['dfMap', 'dfTrack', 'dfPrint', 'df3Way', 'dfBank'];
  var SCM_CLOSE_FN = { dfBank: 'dfCloseBank', df3Way: 'dfClose3Way', dfPrint: 'dfClosePrint', dfTrack: 'dfCloseTracking', dfMap: 'dfCloseMap' };
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    for (var i = 0; i < SCM_CLOSE.length; i++) {
      var id = SCM_CLOSE[i];
      var el = document.getElementById(id);
      if (el && el.classList.contains('on')) {
        var fn = window[SCM_CLOSE_FN[id]];
        if (typeof fn === 'function') fn();
        return;
      }
    }
  });

  /* ── SC-15 Bank ── */
  var BANK_ROWS = [
    { code: 'BNK-SCB-01', bank: 'SCB', no: '547-2-55623-9', name: 'บจก.แสงวิจิตร ไทรเทพ', branch: 'สำนักงานใหญ่', def: true, bal: 8425600 },
    { code: 'BNK-KB-02', bank: 'KBANK', no: '089-2-88888-1', name: 'บจก.แสงวิจิตร ไทรเทพ', branch: 'รามอินทรา', def: false, bal: 1250400 },
    { code: 'BNK-BBL-03', bank: 'BBL', no: '123-4-56789-0', name: 'บจก.แสงวิจิตร ไทรเทพ', branch: 'สาขา 08', def: false, bal: 320500 }
  ];

  function injectBank() {
    injectStyle('scm-style', `
    #dfBank.scm{z-index:962}
    #dfBank .scm-modal{width:900px;max-width:96vw}
    #dfBank .scm-search{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap}
    #dfBank .scm-search input{flex:1;min-width:200px;padding:7px 10px;border:1px solid #E5E7EB;border-radius:6px;font-size:12.5px;font-family:inherit}
    #dfBank tbody tr{cursor:pointer}
    #dfBank tbody tr:hover{background:#F8FAFC}
    #dfBank tbody tr.on{background:#FEF3C7}
    `);
    if (document.getElementById('dfBank')) return;
    var w = document.createElement('div');
    w.innerHTML = '<div class="df-bg scm" id="dfBank"><div class="scm-modal">' +
      scmHd('🏦 เลือกบัญชีธนาคาร (SC-15) · <span id="dfBankDir" style="color:#2563EB">—</span>', 'dfCloseBank') +
      '<div class="scm-bd"><div class="scm-search"><input id="dfBankQ" placeholder="ค้นหา ธนาคาร / เลขบัญชี / ชื่อบัญชี / สาขา" oninput="dfBankFilter()">' +
      '<span style="font-size:11px;color:#6B7280;align-self:center">คลิกแถว → ยืนยัน</span></div>' +
      '<table class="scm-tbl"><thead><tr><th>รหัส</th><th>ธนาคาร</th><th>เลขบัญชี</th><th>ชื่อบัญชี</th><th>สาขา</th><th>ค่าเริ่มต้น</th><th class="num">ยอดคงเหลือ</th></tr></thead>' +
      '<tbody id="dfBankRows"></tbody></table></div>' +
      '<div class="scm-ft"><button class="scm-btn out" onclick="dfCloseBank()">ยกเลิก</button><button class="scm-btn ok" onclick="dfBankConfirm()">✓ เลือกบัญชี</button></div></div></div>';
    document.body.appendChild(w);
    var tb = document.getElementById('dfBankRows');
    tb.innerHTML = BANK_ROWS.map(function (r, i) {
      return '<tr data-i="' + i + '" onclick="dfBankPick(' + i + ')"><td class="mono">' + esc(r.code) + '</td><td>' + esc(r.bank) +
        '</td><td class="mono">' + esc(r.no) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.branch) +
        '</td><td>' + (r.def ? '<span class="scm-chip">★ ค่าเริ่มต้น</span>' : '—') +
        '</td><td class="num">' + fmt(r.bal) + '</td></tr>';
    }).join('');
  }

  var _bankPick = -1;
  window.dfBankPick = function (i) {
    _bankPick = i;
    document.querySelectorAll('#dfBankRows tr').forEach(function (tr) { tr.classList.toggle('on', Number(tr.getAttribute('data-i')) === i); });
  };
  window.dfBankFilter = function () {
    var q = (document.getElementById('dfBankQ') || {}).value || '';
    q = q.toLowerCase();
    document.querySelectorAll('#dfBankRows tr').forEach(function (tr, i) {
      var r = BANK_ROWS[i];
      var hay = (r.code + r.bank + r.no + r.name + r.branch).toLowerCase();
      tr.style.display = !q || hay.indexOf(q) >= 0 ? '' : 'none';
    });
  };
  window.dfOpenBank = function (opts) {
    opts = opts || {};
    injectBank();
    _bankPick = -1;
    _ctx.onSelect = opts.onSelect || null;
    var dir = document.getElementById('dfBankDir');
    if (dir) dir.textContent = opts.direction === 'in' ? 'รับเงิน (IN)' : opts.direction === 'out' ? 'จ่ายออก (OUT)' : 'ทั้งหมด';
    document.querySelectorAll('#dfBankRows tr').forEach(function (tr) { tr.classList.remove('on'); });
    document.getElementById('dfBank').classList.add('on');
  };
  window.dfCloseBank = function () { document.getElementById('dfBank').classList.remove('on'); };
  window.dfBankConfirm = function () {
    if (_bankPick < 0) { alert('เลือกบัญชีก่อน'); return; }
    var r = BANK_ROWS[_bankPick];
    var detail = { id: r.code, bank: r.bank, accountNo: r.no, name: r.name, branch: r.branch, balance: r.bal };
    if (_ctx.onSelect) _ctx.onSelect(detail);
    document.dispatchEvent(new CustomEvent('bank:selected', { detail: detail }));
    dfCloseBank();
  };

  /* ── SC-13 3-Way Match ── */
  var WAY_LINES = [
    { code: 'DAI-FTKM24', name: 'แอร์ Daikin FTKM 24,000 BTU', po: 80, grn: 80, inv: 80, poP: 14500, invP: 14500, ok: true },
    { code: 'DAI-FTKM18', name: 'แอร์ Daikin FTKM 18,000 BTU', po: 40, grn: 40, inv: 40, poP: 12800, invP: 12800, ok: true },
    { code: 'DAI-FTKM12', name: 'แอร์ Daikin FTKM 12,000 BTU', po: 60, grn: 60, inv: 58, poP: 9800, invP: 9800, ok: false }
  ];

  function inject3Way() {
    injectStyle('scm-style');
    if (document.getElementById('df3Way')) return;
    var w = document.createElement('div');
    w.innerHTML = '<div class="df-bg scm" id="df3Way"><div class="scm-modal" style="width:820px;max-width:94vw">' +
      scmHd('🔍 3-Way Match (SC-13) — <span class="mono" id="df3WayTitle">—</span>', 'dfClose3Way') +
      '<div class="scm-bd"><table class="scm-tbl"><thead><tr><th>รหัส</th><th>รายการ</th><th class="num">PO</th><th class="num">รับ WH-1</th><th class="num">Invoice</th><th class="num">ราคา PO</th><th class="num">ราคา Inv</th><th>Match</th></tr></thead>' +
      '<tbody id="df3WayRows"></tbody></table>' +
      '<div style="margin-top:10px;font-size:11px;color:#6B7280">💡 PO Qty = รับ WH-1 = Invoice Qty · ราคาต่างเกิน 5% → ⚠ ต้องอนุมัติพิเศษ</div></div>' +
      '<div class="scm-ft"><button class="scm-btn pri" onclick="dfClose3Way()">ปิด</button></div></div></div>';
    document.body.appendChild(w);
  }

  window.dfOpen3Way = function (opts) {
    opts = opts || {};
    inject3Way();
    var t = document.getElementById('df3WayTitle');
    if (t) t.textContent = (opts.grnNo || 'GR-—') + ' ↔ ' + (opts.poNo || 'PO-—') + ' ↔ ' + (opts.invNo || 'INV-—');
    var tb = document.getElementById('df3WayRows');
    if (tb) {
      tb.innerHTML = WAY_LINES.map(function (l) {
        var chip = l.ok ? '<span class="scm-chip">✓ ตรง</span>' : '<span class="scm-chip warn">⚠ qty</span>';
        return '<tr><td class="mono">' + esc(l.code) + '</td><td>' + esc(l.name) + '</td><td class="num">' + l.po +
          '</td><td class="num">' + l.grn + '</td><td class="num">' + l.inv + '</td><td class="num">' + fmt(l.poP) +
          '</td><td class="num">' + fmt(l.invP) + '</td><td>' + chip + '</td></tr>';
      }).join('');
    }
    document.getElementById('df3Way').classList.add('on');
  };
  window.dfClose3Way = function () { document.getElementById('df3Way').classList.remove('on'); };

  /* ── SC-16 Print ── */
  var PRINT_TPLS = [
    { id: 'std-th', name: 'แบบมาตรฐาน (ไทย)', lang: 'TH', copies: 1 },
    { id: 'std-en', name: 'Standard (English)', lang: 'EN', copies: 1 },
    { id: 'tax', name: 'ใบกำกับภาษีเต็มรูป', lang: 'TH', copies: 2 },
    { id: 'slip', name: 'สลิปย่อ (POS)', lang: 'TH', copies: 1 }
  ];

  function injectPrint() {
    injectStyle('scm-style');
    if (document.getElementById('dfPrint')) return;
    var w = document.createElement('div');
    w.innerHTML = '<div class="df-bg scm" id="dfPrint"><div class="scm-modal" style="width:560px;max-width:94vw">' +
      scmHd('🖨️ เลือกแบบพิมพ์ (SC-16) — <span id="dfPrintDoc" class="mono" style="color:#2563EB">—</span>', 'dfClosePrint') +
      '<div class="scm-bd" id="dfPrintList"></div>' +
      '<div style="padding:0 18px 10px;font-size:11px;color:#6B7280"><label><input type="checkbox" id="dfPrintEmail"> แนบส่ง email หลังพิมพ์</label></div>' +
      '<div class="scm-ft"><button class="scm-btn out" onclick="dfClosePrint()">ยกเลิก</button><button class="scm-btn ok" onclick="dfPrintConfirm()">🖨️ พิมพ์</button></div></div></div>';
    document.body.appendChild(w);
  }

  window.dfOpenPrint = function (opts) {
    opts = opts || {};
    injectPrint();
    _ctx.onSelect = opts.onSelect || null;
    var doc = document.getElementById('dfPrintDoc');
    if (doc) doc.textContent = (opts.docType || 'DOC') + ' · ' + (opts.docNo || '—');
    var list = opts.templates && opts.templates.length ? opts.templates : PRINT_TPLS;
    var el = document.getElementById('dfPrintList');
    if (el) {
      el.innerHTML = list.map(function (t, i) {
        return '<label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:8px;cursor:pointer">' +
          '<input type="radio" name="dfPrintTpl" value="' + esc(t.id) + '"' + (i === 0 ? ' checked' : '') + '>' +
          '<span style="flex:1"><b>' + esc(t.name) + '</b><br><span style="font-size:11px;color:#6B7280">' + esc(t.lang) + ' · ' + t.copies + ' สำเนา</span></span></label>';
      }).join('');
    }
    document.getElementById('dfPrint').classList.add('on');
  };
  window.dfClosePrint = function () { document.getElementById('dfPrint').classList.remove('on'); };
  window.dfPrintConfirm = function () {
    var sel = document.querySelector('input[name=dfPrintTpl]:checked');
    if (!sel) return;
    var detail = { templateId: sel.value, email: !!(document.getElementById('dfPrintEmail') || {}).checked };
    if (_ctx.onSelect) _ctx.onSelect(detail);
    document.dispatchEvent(new CustomEvent('print:selected', { detail: detail }));
    dfClosePrint();
  };

  /* ── SC-18 Tracking ── */
  function injectTracking() {
    injectStyle('scm-style', `
    #dfTrack .scm-modal{width:720px;max-width:94vw}
    #dfTrack input{padding:5px 8px;border:1px solid #E5E7EB;border-radius:5px;font-size:12px;font-family:inherit;width:100%}
    `);
    if (document.getElementById('dfTrack')) return;
    var w = document.createElement('div');
    w.innerHTML = '<div class="df-bg scm" id="dfTrack"><div class="scm-modal">' +
      scmHd('📦 Tracking ขนส่ง (SC-18) — ไลน์ <span id="dfTrackLine" class="mono">—</span>', 'dfCloseTracking') +
      '<div class="scm-bd"><table class="scm-tbl"><thead><tr><th>เลข tracking</th><th>ขนส่ง</th><th>วันส่ง</th><th class="num">จำนวน</th><th>สถานะ</th></tr></thead>' +
      '<tbody id="dfTrackRows"><tr><td><input placeholder="TH123456789"></td><td><input placeholder="Kerry"></td><td><input placeholder="11/06/26"></td><td class="num"><input placeholder="10" style="text-align:right"></td><td><span class="scm-chip">รอส่ง</span></td></tr></tbody></table>' +
      '<button class="scm-btn out" style="margin-top:8px" onclick="dfTrackAddRow()">+ เพิ่มแถว</button></div>' +
      '<div class="scm-ft"><button class="scm-btn out" onclick="dfCloseTracking()">ยกเลิก</button><button class="scm-btn ok" onclick="dfTrackConfirm()">✓ บันทึก tracking</button></div></div></div>';
    document.body.appendChild(w);
  }

  window.dfTrackAddRow = function () {
    var tb = document.getElementById('dfTrackRows');
    if (!tb) return;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td><input placeholder="เลข tracking"></td><td><input placeholder="ขนส่ง"></td><td><input placeholder="วว/ดด/26"></td><td class="num"><input placeholder="0" style="text-align:right"></td><td><span class="scm-chip">รอส่ง</span></td>';
    tb.appendChild(tr);
  };
  window.dfOpenTracking = function (opts) {
    opts = opts || {};
    injectTracking();
    _ctx.onConfirm = opts.onConfirm || null;
    var el = document.getElementById('dfTrackLine');
    if (el) el.textContent = opts.lineId || opts.lineNo || '—';
    document.getElementById('dfTrack').classList.add('on');
  };
  window.dfCloseTracking = function () { document.getElementById('dfTrack').classList.remove('on'); };
  window.dfTrackConfirm = function () {
    var rows = [];
    document.querySelectorAll('#dfTrackRows tr').forEach(function (tr) {
      var ins = tr.querySelectorAll('input');
      if (ins[0] && ins[0].value.trim()) {
        rows.push({ trackingNo: ins[0].value.trim(), carrier: (ins[1] || {}).value || '', shipDate: (ins[2] || {}).value || '', qty: Number((ins[3] || {}).value || 0) });
      }
    });
    var detail = { entries: rows };
    if (_ctx.onConfirm) _ctx.onConfirm(detail);
    document.dispatchEvent(new CustomEvent('tracking:added', { detail: detail }));
    dfCloseTracking();
  };

  /* ── SC-10 Map ── */
  function injectMap() {
    injectStyle('scm-style', `
    #dfMap .scm-modal{width:640px;max-width:94vw}
    #dfMapMap{height:220px;background:linear-gradient(135deg,#DBEAFE 0%,#D1FAE5 50%,#FEF3C7 100%);border:1px solid #BFDBFE;border-radius:8px;position:relative;margin-bottom:10px}
    #dfMapPin{position:absolute;left:50%;top:45%;transform:translate(-50%,-100%);font-size:28px;cursor:grab}
    #dfMapAddrSearch,#dfMapAddrLine,#dfMapZip,#dfMapProv,#dfMapDist,#dfMapSub{width:100%;padding:8px 10px;border:1px solid #E5E7EB;border-radius:6px;font-size:12.5px;font-family:inherit}
    #dfMapProv,#dfMapDist{background:#F8FAFC}
    #dfMapForm{display:grid;grid-template-columns:130px 1fr;gap:8px 10px;align-items:center}
    #dfMapForm label{font-size:11px;font-weight:600;color:#6B7280}
    #dfMapCoords{font-size:11px;color:#6B7280;margin-top:6px;font-family:monospace}
    #dfMapPreview{margin-top:8px;padding:8px 10px;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:6px;font-size:11.5px;color:#374151}
    `);
    if (document.getElementById('dfMap')) return;
    var w = document.createElement('div');
    w.innerHTML = '<div class="df-bg scm" id="dfMap"><div class="scm-modal">' +
      scmHd('📍 ปักหมุดแผนที่ (SC-10)', 'dfCloseMap') +
      '<div class="scm-bd"><div id="dfMapMap"><span id="dfMapPin">📍</span></div>' +
      '<div id="dfMapForm">' +
      '<label>ค้นหาที่อยู่</label><input id="dfMapAddrSearch" placeholder="ค้นหาหรือพิมพ์ที่อยู่โดยรวม (ถ้าเจอ)">' +
      '<label>รหัสไปรษณีย์</label><input id="dfMapZip" inputmode="numeric" maxlength="5" placeholder="เช่น 10220">' +
      '<label>จังหวัด</label><input id="dfMapProv" readonly>' +
      '<label>อำเภอ/เขต</label><input id="dfMapDist" readonly>' +
      '<label>ตำบล/แขวง</label><select id="dfMapSub"></select>' +
      '<label>รายละเอียดที่อยู่</label><input id="dfMapAddrLine" placeholder="บ้านเลขที่/หมู่/ถนน">' +
      '</div>' +
      '<div id="dfMapCoords">lat 13.7563 · lng 100.5018</div>' +
      '<div id="dfMapPreview">ที่อยู่สำหรับบันทึก: -</div></div>' +
      '<div class="scm-ft"><button class="scm-btn out" onclick="dfCloseMap()">ยกเลิก</button><button class="scm-btn ok" onclick="dfMapConfirm()">✓ ยืนยันพิกัด</button></div></div></div>';
    document.body.appendChild(w);

    function fillMapSubdistrict(list, selected) {
      var sel = document.getElementById('dfMapSub');
      if (!sel) return;
      var html = '<option value="">เลือกตำบล/แขวง</option>';
      (list || []).forEach(function (name) {
        var isSel = selected && selected === name ? ' selected' : '';
        html += '<option value="' + esc(name) + '"' + isSel + '>' + esc(name) + '</option>';
      });
      if (selected && list && list.indexOf(selected) < 0) {
        html += '<option value="' + esc(selected) + '" selected>' + esc(selected) + '</option>';
      }
      sel.innerHTML = html;
    }

    function applyMapZip(zip, preferredSub) {
      var code = zipOnly(zip);
      var zipEl = document.getElementById('dfMapZip');
      var provEl = document.getElementById('dfMapProv');
      var distEl = document.getElementById('dfMapDist');
      if (zipEl) zipEl.value = code;
      var meta = TH_ZIP_META[code];
      if (meta) {
        if (provEl) provEl.value = meta.province;
        if (distEl) distEl.value = meta.district;
        fillMapSubdistrict(meta.subdistricts, preferredSub || meta.subdistricts[0]);
      } else {
        if (provEl) provEl.value = '';
        if (distEl) distEl.value = '';
        fillMapSubdistrict([], preferredSub || '');
      }
    }

    function updateMapPreview() {
      var addrLine = (document.getElementById('dfMapAddrLine') || {}).value || '';
      var sub = (document.getElementById('dfMapSub') || {}).value || '';
      var dist = (document.getElementById('dfMapDist') || {}).value || '';
      var prov = (document.getElementById('dfMapProv') || {}).value || '';
      var zip = (document.getElementById('dfMapZip') || {}).value || '';
      var parts = [addrLine, sub, dist, prov, zip].filter(Boolean);
      var preview = document.getElementById('dfMapPreview');
      if (preview) preview.textContent = 'ที่อยู่สำหรับบันทึก: ' + (parts.length ? parts.join(' ') : '-');
    }

    var zipInput = document.getElementById('dfMapZip');
    var searchInput = document.getElementById('dfMapAddrSearch');
    var addrLineInput = document.getElementById('dfMapAddrLine');
    var subInput = document.getElementById('dfMapSub');
    if (zipInput) {
      zipInput.addEventListener('input', function () {
        applyMapZip(zipInput.value, '');
        updateMapPreview();
      });
    }
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var m = (searchInput.value || '').match(/\b\d{5}\b/);
        if (m) applyMapZip(m[0], '');
      });
    }
    if (addrLineInput) addrLineInput.addEventListener('input', updateMapPreview);
    if (subInput) subInput.addEventListener('change', updateMapPreview);
    applyMapZip('10220', '');
    updateMapPreview();

    var pin = document.getElementById('dfMapPin');
    var map = document.getElementById('dfMapMap');
    if (pin && map) {
      map.addEventListener('click', function (e) {
        var r = map.getBoundingClientRect();
        pin.style.left = ((e.clientX - r.left) / r.width * 100) + '%';
        pin.style.top = ((e.clientY - r.top) / r.height * 100) + '%';
        var lat = (13.65 + (1 - (e.clientY - r.top) / r.height) * 0.25).toFixed(4);
        var lng = (100.35 + ((e.clientX - r.left) / r.width) * 0.35).toFixed(4);
        var c = document.getElementById('dfMapCoords');
        if (c) c.textContent = 'lat ' + lat + ' · lng ' + lng;
      });
    }
  }

  window.dfOpenMap = function (opts) {
    opts = opts || {};
    injectMap();
    _ctx.onConfirm = opts.onConfirm || null;
    var search = document.getElementById('dfMapAddrSearch');
    var zip = document.getElementById('dfMapZip');
    var sub = document.getElementById('dfMapSub');
    var line = document.getElementById('dfMapAddrLine');
    var prov = document.getElementById('dfMapProv');
    var dist = document.getElementById('dfMapDist');
    if (search) search.value = opts.address || '';
    if (line) line.value = opts.addressLine || opts.address || '';
    if (zip) zip.value = zipOnly(opts.zip || ((opts.address || '').match(/\b\d{5}\b/) || [])[0] || '10220');
    var meta = TH_ZIP_META[(zip && zip.value) || ''];
    if (meta) {
      if (prov) prov.value = meta.province;
      if (dist) dist.value = meta.district;
      var selectedSub = opts.subdistrict || meta.subdistricts[0] || '';
      var html = '<option value="">เลือกตำบล/แขวง</option>';
      meta.subdistricts.forEach(function (name) {
        var selected = selectedSub === name ? ' selected' : '';
        html += '<option value="' + esc(name) + '"' + selected + '>' + esc(name) + '</option>';
      });
      if (selectedSub && meta.subdistricts.indexOf(selectedSub) < 0) {
        html += '<option value="' + esc(selectedSub) + '" selected>' + esc(selectedSub) + '</option>';
      }
      if (sub) sub.innerHTML = html;
    } else if (sub) {
      sub.innerHTML = '<option value="">เลือกตำบล/แขวง</option>' + (opts.subdistrict ? '<option value="' + esc(opts.subdistrict) + '" selected>' + esc(opts.subdistrict) + '</option>' : '');
    }
    var preview = document.getElementById('dfMapPreview');
    if (preview) {
      var parts = [
        (line || {}).value || '',
        (sub || {}).value || '',
        (dist || {}).value || '',
        (prov || {}).value || '',
        (zip || {}).value || ''
      ].filter(Boolean);
      preview.textContent = 'ที่อยู่สำหรับบันทึก: ' + (parts.length ? parts.join(' ') : '-');
    }
    var c = document.getElementById('dfMapCoords');
    if (c) c.textContent = 'lat ' + (opts.lat || '13.8563') + ' · lng ' + (opts.lng || '100.6018');
    document.getElementById('dfMap').classList.add('on');
  };
  window.dfCloseMap = function () { document.getElementById('dfMap').classList.remove('on'); };
  window.dfMapConfirm = function () {
    var coords = (document.getElementById('dfMapCoords') || {}).textContent || '';
    var m = coords.match(/lat\s([\d.]+).*lng\s([\d.]+)/);
    var line = (document.getElementById('dfMapAddrLine') || {}).value || '';
    var sub = (document.getElementById('dfMapSub') || {}).value || '';
    var dist = (document.getElementById('dfMapDist') || {}).value || '';
    var prov = (document.getElementById('dfMapProv') || {}).value || '';
    var zip = zipOnly((document.getElementById('dfMapZip') || {}).value || '');
    var formatted = [line, sub, dist, prov, zip].filter(Boolean).join(' ');
    var detail = {
      lat: m ? m[1] : '13.8563',
      lng: m ? m[2] : '100.6018',
      zip: zip,
      province: prov,
      district: dist,
      subdistrict: sub,
      addressLine: line,
      formattedAddress: formatted
    };
    if (_ctx.onConfirm) _ctx.onConfirm(detail);
    document.dispatchEvent(new CustomEvent('map:confirmed', { detail: detail }));
    dfCloseMap();
  };
})();
