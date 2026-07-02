/* ════════════════════════════════════════════════════════════════
   SC-14 — AP Reduction / Ledger Picker
   API: dfOpenApReduce({vendorName, poRef, grnRef, mode, onPull})
        dfCloseApReduce() · event apreduce:selected
   สกัดจาก PO-6 refPickModal · reuse ตั้งหนี้ AP (+ invoice / − deduct)
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var _dfArCtx = { onPull: null };

  var CSS = `
  .df-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.42);z-index:950;align-items:center;justify-content:center}
  .df-bg.on{display:flex}
  #dfApReduce.df-bg{z-index:960}
  #dfApReduce .df-ar-modal{background:#fff;border-radius:10px;box-shadow:0 12px 44px rgba(0,0,0,.28);width:920px;max-width:96vw;max-height:92vh;display:flex;flex-direction:column;font-family:'Inter','Noto Sans Thai',sans-serif;font-size:13px;color:#111827}
  #dfApReduce .df-ar-hd{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:14px 18px;border-bottom:1px solid #E5E7EB}
  #dfApReduce .df-ar-hd-main{flex:1;min-width:0}
  #dfApReduce .df-ar-hd h3{margin:0;font-size:15px;font-weight:700;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  #dfApReduce .df-ar-x{flex-shrink:0;width:30px;height:30px;border:none;border-radius:6px;background:#F3F4F6;color:#6B7280;font-size:17px;line-height:1;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;padding:0}
  #dfApReduce .df-ar-x:hover{background:#FEE2E2;color:#DC2626}
  #dfApReduce .df-ar-body{padding:0 18px 12px;overflow:auto;flex:1;min-height:0}
  #dfApReduce .df-ar-ft{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 18px;border-top:1px solid #E5E7EB}
  #dfApReduce .df-ar-tabs{display:flex;gap:6px;margin:12px 0 10px;flex-wrap:wrap}
  #dfApReduce .df-ar-tabs button{padding:6px 12px;border:1px solid #E5E7EB;background:#fff;color:#6B7280;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit}
  #dfApReduce .df-ar-tabs button.on{background:#EFF6FF;border-color:#93C5FD;color:#1D4ED8}
  #dfApReduce .df-ar-pane{display:none}#dfApReduce .df-ar-pane.on{display:block}
  #dfApReduce .df-ar-tbl{width:100%;border-collapse:collapse;font-size:12px}
  #dfApReduce .df-ar-tbl th{background:#F8FAFC;padding:7px 9px;text-align:left;border-bottom:2px solid #E5E7EB;font-size:10.5px;color:#6B7280;text-transform:uppercase;white-space:nowrap}
  #dfApReduce .df-ar-tbl td{padding:7px 9px;border-bottom:1px solid #F3F4F6}
  #dfApReduce .df-ar-tbl .num{text-align:right;font-family:'Inter',monospace}
  #dfApReduce .df-ar-scroll{max-height:240px;overflow:auto;border:1px solid #E5E7EB;border-radius:8px}
  #dfApReduce .df-ar-scroll.tall{max-height:280px}
  #dfApReduce .df-ar-form{display:grid;grid-template-columns:170px 1fr;gap:8px 12px;align-items:center;font-size:12.5px;padding:6px 2px}
  #dfApReduce .df-ar-form label{color:#6B7280;font-weight:600}
  #dfApReduce .df-ar-form input{padding:6px 9px;border:1px solid #E5E7EB;border-radius:6px;font-size:12.5px;font-family:inherit}
  #dfApReduce .df-ar-form input.num{text-align:right;font-family:'Inter',monospace}
  #dfApReduce .df-ar-keybox{display:none;border:1px solid #E5E7EB;border-radius:8px;padding:10px 12px;margin-bottom:10px;background:#F8FAFC}
  #dfApReduce .df-ar-keybox.on{display:block}
  #dfApReduce .df-ar-hint{margin-top:8px;font-size:11px;color:#6B7280;line-height:1.45}
  #dfApReduce .df-ar-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid transparent;font-family:inherit}
  #dfApReduce .df-ar-btn.out{background:#fff;color:#374151;border-color:#E5E7EB}
  #dfApReduce .df-ar-btn.ok{background:#10B981;color:#fff}
  #dfApReduce .df-ar-btn.sm{padding:4px 10px;font-size:11px;background:transparent;border:1px solid #E5E7EB;color:#6B7280}
  #dfApReduce .df-ar-chip{display:inline-block;padding:2px 8px;border-radius:9px;font-size:10px;font-weight:700}
  #dfApReduce .df-ar-pill{display:inline-flex;padding:3px 8px;border-radius:5px;font-size:10.5px;font-weight:600}
  #dfApReduce .df-ar-pill.info{background:#EFF6FF;color:#0C4A6E}
  #dfApReduce .df-ar-pill.warn{background:#FEF3C7;color:#92400E}
  #dfApReduce .df-ar-pill.violet{background:#F3E8FF;color:#6D28D9}
  #dfApReduce .df-ar-pill.ok{background:#ECFDF5;color:#065F46}
  #dfApReduce .df-ar-btype{display:inline-block;padding:2px 8px;border-radius:5px;font-size:10px;font-weight:700}
  #dfApReduce .amt-neg{color:#059669;font-weight:700}
  #dfApReduce .mono{font-family:'Inter',monospace}
  #dfApReduce .drill-btn{padding:2px 8px;border:1px solid #BFDBFE;background:#EFF6FF;color:#2563EB;border-radius:4px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit}
  `;

  var HTML = `
  <div class="df-bg" id="dfApReduce">
    <div class="df-ar-modal">
      <div class="df-ar-hd">
        <div class="df-ar-hd-main">
          <h3>🔗 ดึงรายการอ้างอิง (SC-14) — เจ้าหนี้: <span class="mono" id="dfArVendor" style="color:#2563EB">—</span>
            <span id="dfArChain" style="margin-left:auto;font-size:11px;color:#6B7280;font-weight:500"></span></h3>
          <div class="df-ar-tabs" id="dfArMainTabs">
            <button class="on" onclick="dfArTab(this,'dfArInv')">🧾 ใบแจ้งหนี้ (ตั้งหนี้ +)</button>
            <button onclick="dfArTab(this,'dfArDeduct')">↩️ ดึงลดหนี้/หัก (−)</button>
          </div>
        </div>
        <button type="button" class="df-ar-x" onclick="dfCloseApReduce()" title="ปิด (Esc)" aria-label="ปิด">✕</button>
      </div>
      <div class="df-ar-body">
        <div id="dfArInv" class="df-ar-pane on">
          <div style="display:flex;align-items:center;margin-bottom:8px">
            <span style="font-size:11px;color:#6B7280">เลือกได้หลายใบ (1 ใบตั้งหนี้รวมหลายบิล) · อ้างอิงใบรับครบ</span>
            <button class="df-ar-btn sm" style="margin-left:auto" onclick="dfArKeyToggle()">✍️ คีย์เอง + แนบสแกน</button>
          </div>
          <div class="df-ar-keybox" id="dfArKeyForm">
            <div class="df-ar-form">
              <label>เลขที่ใบแจ้งหนี้ Vendor <span style="color:#EF4444">*</span></label><input id="dfArKeyNo" placeholder="เช่น DKN-INV-25099">
              <label>วันที่ใบแจ้งหนี้</label><input id="dfArKeyDate" placeholder="วว/ดด/ปป (ค.ศ. 26)">
              <label>อ้างอิงใบรับครบ (GRN)</label><input id="dfArKeyGrn" placeholder="เช่น GR-2606-0220">
              <label>ยอดก่อน VAT</label><input id="dfArKeyBase" class="num" placeholder="0.00">
              <label>แนบไฟล์สแกน</label><div style="padding:8px;border:1px dashed #CBD5E1;border-radius:6px;font-size:11px;color:#6B7280">📎 ลากไฟล์ / เลือก PDF·JPG</div>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:8px"><button class="df-ar-btn out" onclick="dfArKeyAdd()">➕ เพิ่มใบนี้เข้ารายการเลือก</button></div>
          </div>
          <div class="df-ar-tabs" style="margin:0 0 8px" id="dfArInvFilters">
            <button class="on" onclick="dfArFilterInv(this,'all')">ทั้งหมด</button>
            <button onclick="dfArFilterInv(this,'full')">📥 รับทั้งหมด (รับครบ)</button>
            <button onclick="dfArFilterInv(this,'deposit')">🟣 บิลฝาก</button>
          </div>
          <div class="df-ar-scroll"><table class="df-ar-tbl">
            <thead><tr><th style="width:32px"><input type="checkbox" onchange="dfArAll(this,'dfArInv')"></th>
              <th>เลขที่ใบแจ้งหนี้</th><th>ประเภทรับ</th><th>วันที่</th><th>อ้างรับ/บิลฝาก</th><th class="num">ยอด (+)</th><th>เทียบ</th><th></th></tr></thead>
            <tbody id="dfArInvRows"></tbody>
          </table></div>
          <div class="df-ar-hint">💡 <b>📥 รับทั้งหมด</b> = รับครบ (3-Way) · <b>🟣 บิลฝาก</b> = ตั้งก่อนรับครบ (2-Way · PO-8)</div>
        </div>
        <div id="dfArDeduct" class="df-ar-pane">
          <div class="df-ar-tabs" style="margin-top:0" id="dfArDeductFilters">
            <button class="on" onclick="dfArFilterDeduct(this,'all')">ทั้งหมด</button>
            <button onclick="dfArFilterDeduct(this,'adv')">💰 มัดจำจ่ายล่วงหน้า</button>
            <button onclick="dfArFilterDeduct(this,'dep')">🟣 บิลฝาก (PO-8)</button>
            <button onclick="dfArFilterDeduct(this,'cn')">↩️ ใบลดหนี้</button>
            <button onclick="dfArFilterDeduct(this,'promo')">🎁 ส่งเสริมได้จริง</button>
          </div>
          <div class="df-ar-scroll tall"><table class="df-ar-tbl">
            <thead><tr><th style="width:32px"><input type="checkbox" onchange="dfArAll(this,'dfArDeduct')"></th>
              <th>ประเภท</th><th>เลขที่</th><th>วันที่</th><th>เหตุผล</th><th class="num">ยอด (−)</th><th>สถานะ</th></tr></thead>
            <tbody id="dfArDeductRows"></tbody>
          </table></div>
          <div class="df-ar-hint">💡 หมวดหักหลังบิล · มัดจำ/บิลฝาก · PO-CN · PO-7 ส่งเสริม</div>
        </div>
      </div>
      <div class="df-ar-ft">
        <span id="dfArSummary" style="font-size:12px;color:#6B7280">เลือก 0 · ตั้งหนี้ <b class="mono">+0.00</b> · หัก <b class="mono">-0.00</b></span>
        <span style="display:flex;gap:8px">
          <button class="df-ar-btn out" onclick="dfCloseApReduce()">ยกเลิก</button>
          <button class="df-ar-btn ok" onclick="dfArPull()">↩ ดึงเข้าฟอร์ม</button>
        </span>
      </div>
    </div>
  </div>`;

  var DF_AR_INV_ROWS = [
    { kind: 'inv', recv: 'full', recvlabel: '📥 รับทั้งหมด', type: '🧾 ใบแจ้งหนี้ Vendor', no: 'DKN-INV-25088', date: '25 มิ.ย. 26', amt: 2260000, ref: 'GR-0210', match: '✓ ตรง', pulled: true },
    { kind: 'inv', recv: 'full', recvlabel: '📥 รับทั้งหมด', type: '🧾 ใบแจ้งหนี้ Vendor', no: 'DKN-INV-25092', date: '27 มิ.ย. 26', amt: 540000, ref: 'GR-0215', match: '✓ ตรง', drill: true },
    { kind: 'inv', recv: 'full', recvlabel: '📥 รับทั้งหมด', type: '🧾 ใบแจ้งหนี้ Vendor', no: 'DKN-INV-25090', date: '26 มิ.ย. 26', amt: 2418200, ref: 'GR-0210', match: '⚠ ต่าง', matchWarn: true, drill: true },
    { kind: 'inv', recv: 'deposit', recvlabel: '🟣 บิลฝาก', type: '🧾 ใบแจ้งหนี้ Vendor', no: 'DKN-INV-25095', date: '28 มิ.ย. 26', amt: 320000, ref: 'PO8-2606-0007', match: '2-Way', deposit: true }
  ];

  var DF_AR_DEDUCT_ROWS = [
    { kind: 'deduct', g: 'adv', type: '💰 มัดจำจ่ายล่วงหน้า', no: 'DP-PAY-2605-003', date: '20 พ.ค. 26', reason: 'จ่ายมัดจำ 30% ตอนสั่ง', amt: 200000, status: 'จ่ายแล้ว', pill: 'info' },
    { kind: 'deduct', g: 'dep', type: '🟣 บิลฝาก (PO-8)', no: 'PO8-2605-0012', date: '22 พ.ค. 26', reason: 'บิลฝากเรียกออกบางส่วน', amt: 150000, status: 'ฝากอยู่', pill: 'violet' },
    { kind: 'deduct', g: 'cn', type: '↩️ ใบลดหนี้ (PO-CN)', no: 'APCN-2606-0015', date: '26 มิ.ย. 26', reason: 'คืนสินค้า — แอร์ชำรุด 2 ตัว', amt: 29000, status: '⏳ รอหักหนี้', pill: 'warn', href: 'po-cn-credit-note-mockup.html' },
    { kind: 'deduct', g: 'cn', type: '↩️ ใบลดหนี้ (PO-CN)', no: 'APCN-2606-0018', date: '27 มิ.ย. 26', reason: 'ราคาผิด — ปรับลดรุ่น FTKM18', amt: 8500, status: '⏳ รอหักหนี้', pill: 'warn', href: 'po-cn-credit-note-mockup.html' },
    { kind: 'deduct', g: 'cn', type: '🎫 เคลม→ใบลดหนี้', no: 'APCN-2606-0021', date: '28 มิ.ย. 26', reason: 'เคลมคอมเพรสเซอร์ (CLM-2606-0007)', amt: 15000, status: '⏳ รอหักหนี้', pill: 'warn', href: 'clm-vendor-claim-mockup.html', btype: 'ret' },
    { kind: 'deduct', g: 'promo', type: '🎁 ส่งเสริมได้จริง (PO-7)', no: 'VC-RB-2604-002', date: '30 มิ.ย. 26', reason: 'Rebate ได้จริง Q2 — ยืนยันจาก PO-7', amt: 52000, status: '✅ ได้จริง', pill: 'ok', href: 'po7-rebate-dashboard.html', btype: 'promo' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmt(n) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function inject() {
    if (document.getElementById('df-ap-reduce-style')) return;
    var st = document.createElement('style');
    st.id = 'df-ap-reduce-style';
    st.textContent = CSS;
    document.head.appendChild(st);
    var wrap = document.createElement('div');
    wrap.innerHTML = HTML;
    document.body.appendChild(wrap);
    dfArRenderTables();
  }

  function recvChip(r) {
    var bg = r.deposit ? 'background:#F3E8FF;color:#6D28D9' : 'background:#ECFDF5;color:#065F46';
    return '<span class="df-ar-chip" style="' + bg + '">' + esc(r.recvlabel) + '</span>';
  }

  function dfArRenderTables() {
    var inv = document.getElementById('dfArInvRows');
    if (inv) {
      inv.innerHTML = DF_AR_INV_ROWS.map(function (r) {
        var mchip = r.matchWarn ? 'background:#FEF3C7;color:#92400E' : (r.deposit ? 'background:#EFF6FF;color:#1D4ED8' : '');
        var last = r.pulled ? '<span style="font-size:10px;color:#9CA3AF">ดึงแล้ว</span>'
          : (r.drill ? '<button class="drill-btn" onclick="typeof openMatch===\'function\'&&openMatch()">3-Way</button>'
            : (r.deposit ? '<span style="font-size:10px;color:#6D28D9">ตั้งก่อนรับ</span>' : ''));
        return '<tr data-kind="inv" data-recv="' + esc(r.recv) + '" data-recvlabel="' + esc(r.recvlabel) + '" data-type="' + esc(r.type) + '" data-no="' + esc(r.no) + '" data-date="' + esc(r.date) + '" data-amt="' + r.amt + '"' + (r.pulled ? ' style="opacity:.45"' : '') + '>' +
          '<td><input type="checkbox"' + (r.pulled ? ' checked disabled' : ' onchange="dfArCount()"') + '></td>' +
          '<td class="mono" style="font-weight:700;color:#2563EB">' + esc(r.no) + '</td>' +
          '<td>' + recvChip(r) + '</td>' +
          '<td>' + esc(r.date) + '</td><td class="mono">' + esc(r.ref) + '</td>' +
          '<td class="num" style="font-weight:700">+' + fmt(r.amt) + '</td>' +
          '<td><span class="df-ar-chip" style="' + mchip + '">' + esc(r.match) + '</span></td><td>' + last + '</td></tr>';
      }).join('');
    }
    var ded = document.getElementById('dfArDeductRows');
    if (ded) {
      ded.innerHTML = DF_AR_DEDUCT_ROWS.map(function (r) {
        var bcls = r.btype === 'promo' ? 'background:#ECFDF5;color:#065F46' : (r.btype === 'ret' ? 'background:#FEF2F2;color:#991B1B' : (r.g === 'adv' ? 'background:#FEF9C3;color:#854D0E' : (r.g === 'dep' ? 'background:#F3E8FF;color:#6D28D9' : 'background:#FEE2E2;color:#991B1B')));
        var noCell = r.href ? '<a href="' + esc(r.href) + '" style="color:#2563EB;font-weight:700;text-decoration:none">' + esc(r.no) + '</a>' : esc(r.no);
        return '<tr data-kind="deduct" data-g="' + esc(r.g) + '" data-type="' + esc(r.type) + '" data-no="' + esc(r.no) + '" data-date="' + esc(r.date) + '" data-amt="' + r.amt + '">' +
          '<td><input type="checkbox" onchange="dfArCount()"></td>' +
          '<td><span class="df-ar-btype" style="' + bcls + '">' + esc(r.type) + '</span></td>' +
          '<td class="mono">' + noCell + '</td><td>' + esc(r.date) + '</td><td>' + esc(r.reason) + '</td>' +
          '<td class="num amt-neg">-' + fmt(r.amt) + '</td>' +
          '<td><span class="df-ar-pill ' + esc(r.pill) + '">' + esc(r.status) + '</span></td></tr>';
      }).join('');
    }
  }

  function dfArRowData(tr) {
    return {
      kind: tr.getAttribute('data-kind'),
      type: tr.getAttribute('data-type'),
      no: tr.getAttribute('data-no'),
      date: tr.getAttribute('data-date'),
      amt: Number(tr.getAttribute('data-amt') || 0),
      recv: tr.getAttribute('data-recv'),
      recvlabel: tr.getAttribute('data-recvlabel'),
      g: tr.getAttribute('data-g'),
      el: tr
    };
  }

  window.dfOpenApReduce = function (opts) {
    opts = opts || {};
    inject();
    _dfArCtx.onPull = opts.onPull || null;
    var v = document.getElementById('dfArVendor');
    if (v) v.textContent = opts.vendorName || opts.vendor || '—';
    var ch = document.getElementById('dfArChain');
    if (ch) {
      var parts = [];
      if (opts.poRef) parts.push('จับคู่ <span class="mono">' + esc(opts.poRef) + '</span>');
      if (opts.grnRef) parts.push('รับครบ <span class="mono">' + esc(opts.grnRef) + '</span>');
      ch.innerHTML = parts.join(' · ');
    }
    var mode = opts.mode || 'inv';
    var tabs = document.getElementById('dfArMainTabs');
    if (tabs) {
      var btns = tabs.querySelectorAll('button');
      if (mode === 'deduct' && btns[1]) dfArTab(btns[1], 'dfArDeduct');
      else if (btns[0]) dfArTab(btns[0], 'dfArInv');
    }
    document.getElementById('dfApReduce').classList.add('on');
    dfArCount();
  };

  window.dfCloseApReduce = function () {
    var m = document.getElementById('dfApReduce');
    if (m) m.classList.remove('on');
  };

  window.dfArTab = function (btn, id) {
    var tabs = btn.parentElement;
    tabs.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    document.querySelectorAll('#dfApReduce .df-ar-pane').forEach(function (p) { p.classList.remove('on'); });
    var pane = document.getElementById(id);
    if (pane) pane.classList.add('on');
  };

  window.dfArKeyToggle = function () {
    var f = document.getElementById('dfArKeyForm');
    if (f) f.classList.toggle('on');
  };

  window.dfArFilterDeduct = function (btn, g) {
    btn.parentElement.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    document.querySelectorAll('#dfArDeductRows tr').forEach(function (tr) {
      tr.style.display = (g === 'all' || tr.getAttribute('data-g') === g) ? '' : 'none';
    });
  };

  window.dfArFilterInv = function (btn, g) {
    btn.parentElement.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    document.querySelectorAll('#dfArInvRows tr').forEach(function (tr) {
      tr.style.display = (g === 'all' || tr.getAttribute('data-recv') === g) ? '' : 'none';
    });
  };

  window.dfArSelected = function () {
    return [].slice.call(document.querySelectorAll('#dfApReduce tbody tr')).filter(function (tr) {
      if (tr.style.display === 'none') return false;
      var c = tr.querySelector('input[type=checkbox]');
      return c && c.checked && !c.disabled;
    });
  };

  window.dfArAll = function (master, paneId) {
    var pane = document.getElementById(paneId);
    if (!pane) return;
    [].slice.call(pane.querySelectorAll('tbody tr')).forEach(function (tr) {
      if (tr.style.display === 'none') return;
      var c = tr.querySelector('input[type=checkbox]');
      if (c && !c.disabled) c.checked = master.checked;
    });
    dfArCount();
  };

  window.dfArCount = function () {
    var pos = 0, neg = 0, n = 0;
    dfArSelected().forEach(function (tr) {
      n++;
      var amt = Number(tr.getAttribute('data-amt') || 0);
      if (tr.getAttribute('data-kind') === 'inv') pos += amt; else neg += amt;
    });
    var el = document.getElementById('dfArSummary');
    if (el) el.innerHTML = 'เลือก ' + n + ' · ตั้งหนี้ <b class="mono" style="color:#111827">+' + fmt(pos) + '</b> · หัก <b class="mono" style="color:#059669">-' + fmt(neg) + '</b>';
  };

  window.dfArKeyAdd = function () {
    var no = (document.getElementById('dfArKeyNo') || {}).value;
    if (!no || !String(no).trim()) { alert('กรอกเลขที่ใบแจ้งหนี้ Vendor ก่อน'); return; }
    no = String(no).trim();
    var base = parseFloat(String((document.getElementById('dfArKeyBase') || {}).value || '').replace(/,/g, '')) || 0;
    var date = String((document.getElementById('dfArKeyDate') || {}).value || '').trim() || '—';
    var grn = String((document.getElementById('dfArKeyGrn') || {}).value || '').trim() || '—';
    var tb = document.getElementById('dfArInvRows');
    var tr = document.createElement('tr');
    tr.setAttribute('data-kind', 'inv');
    tr.setAttribute('data-recv', 'full');
    tr.setAttribute('data-recvlabel', '📥 รับทั้งหมด');
    tr.setAttribute('data-type', '🧾 ใบแจ้งหนี้ Vendor');
    tr.setAttribute('data-no', no);
    tr.setAttribute('data-date', date);
    tr.setAttribute('data-amt', base);
    tr.innerHTML = '<td><input type="checkbox" checked onchange="dfArCount()"></td>' +
      '<td class="mono" style="font-weight:700;color:#2563EB">' + esc(no) + '</td>' +
      '<td><span class="df-ar-chip" style="background:#ECFDF5;color:#065F46">📥 รับทั้งหมด</span></td>' +
      '<td>' + esc(date) + '</td><td class="mono">' + esc(grn) + '</td>' +
      '<td class="num" style="font-weight:700">+' + fmt(base) + '</td>' +
      '<td><span class="df-ar-chip" style="background:#EFF6FF;color:#1D4ED8">คีย์มือ</span></td>' +
      '<td><span style="font-size:10px;color:#9CA3AF">แนบแล้ว</span></td>';
    tb.appendChild(tr);
    document.getElementById('dfArKeyNo').value = '';
    document.getElementById('dfArKeyBase').value = '';
    document.getElementById('dfArKeyDate').value = '';
    document.getElementById('dfArKeyGrn').value = '';
    dfArKeyToggle();
    dfArCount();
  };

  window.dfArPull = function () {
    var picked = dfArSelected();
    if (!picked.length) { alert('ยังไม่ได้เลือกรายการ'); return; }
    var rows = picked.map(dfArRowData);
    var inv = 0, deduct = 0;
    rows.forEach(function (r) {
      if (r.kind === 'inv') inv += r.amt; else deduct += r.amt;
    });
    var detail = { rows: rows, inv: inv, deduct: deduct, net: inv - deduct };
    if (_dfArCtx.onPull) _dfArCtx.onPull(detail);
    document.dispatchEvent(new CustomEvent('apreduce:selected', { detail: detail }));
    picked.forEach(function (tr) {
      var c = tr.querySelector('input[type=checkbox]');
      if (c) { c.checked = false; c.disabled = true; }
      tr.style.opacity = '.45';
    });
    dfCloseApReduce();
  };

  document.addEventListener('click', function (e) {
    if (e.target.id === 'dfApReduce') dfCloseApReduce();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.getElementById('dfApReduce') && document.getElementById('dfApReduce').classList.contains('on')) {
      dfCloseApReduce();
    }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
