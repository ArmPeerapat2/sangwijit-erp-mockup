/* ════════════════════════════════════════════════════════════════
   SWT Embedded Panels — SC-3P Payment · SC-6 Deposit · SC-4 Delivery
                        SC-17 Approval · SC-8 Serial inline
   ════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmt(n) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  function parseAmt(s) {
    return Number(String(s || '').replace(/,/g, '')) || 0;
  }

  var PANEL_CSS = `
  .swt-panel{font-family:'Inter','Noto Sans Thai',sans-serif;font-size:13px;color:#111827}
  .swt-pay-top{display:flex;gap:14px;margin-bottom:12px}
  .swt-pay-tot{flex:1;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden}
  .swt-pay-tot .r{padding:12px 16px;display:flex;justify-content:space-between;align-items:center}
  .swt-pay-tot .r.t{background:#374151;color:#fff;font-weight:700}
  .swt-pay-tot .r.rem{background:#D1FAE5}
  .swt-pay-tot .r.rem.zero{background:#A7F3D0}
  .swt-pay-tot .v{font-size:22px;font-weight:800;font-family:'Inter',monospace}
  .swt-pay-credit{width:200px;background:#F8FAFC;border:1px solid #E5E7EB;border-radius:8px;padding:10px;font-size:11px}
  .swt-pay-enter{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:12px;margin-bottom:10px}
  .swt-pay-enter input{width:100%;padding:10px 12px;border:2px solid #2563EB;border-radius:6px;font-size:18px;font-weight:700;text-align:right;font-family:'Inter',monospace}
  .swt-pay-mbtns{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
  .swt-pay-mbtns button{padding:8px 12px;border:1px solid #CBD5E1;border-radius:6px;background:#fff;cursor:pointer;font-size:11.5px;font-weight:600;font-family:inherit}
  .swt-pay-mbtns button:hover{border-color:#10B981;background:#F0FDF4}
  .swt-pay-tbl{width:100%;border-collapse:collapse;font-size:12px}
  .swt-pay-tbl th{background:#F8FAFC;padding:6px 8px;text-align:left;font-size:10px;color:#6B7280}
  .swt-pay-tbl td{padding:6px 8px;border-bottom:1px solid #F3F4F6}
  .swt-pay-warn{display:none;background:#FEF3C7;border:1px solid #FDE68A;color:#92400E;padding:8px 10px;border-radius:6px;font-size:11px;font-weight:600;margin-top:8px}
  .swt-pay-warn.on{display:block}
  .swt-pay-compact .swt-pay-row1{display:flex;align-items:center;gap:8px;margin-bottom:6px}
  .swt-pay-compact .swt-pay-stat{flex:1;min-width:0;padding:5px 8px;border:1px solid #E5E7EB;border-radius:6px;background:#F8FAFC}
  .swt-pay-compact .swt-pay-stat .lbl{font-size:9px;font-weight:700;color:#6B7280;text-transform:uppercase}
  .swt-pay-compact .swt-pay-stat .val{font-size:14px;font-weight:800;font-family:'Inter',monospace;color:#111827;line-height:1.2}
  .swt-pay-compact .swt-pay-stat.rem{background:#ECFDF5;border-color:#A7F3D0}
  .swt-pay-compact .swt-pay-stat.rem.zero{background:#D1FAE5}
  .swt-pay-compact .swt-pay-stat.credit{flex:0 0 118px;font-size:10px}
  .swt-pay-compact .swt-pay-stat.credit .val{font-size:12px;color:#DC2626}
  .swt-pay-compact .swt-pay-amt-wrap{flex:0 0 108px}
  .swt-pay-compact .swt-pay-amt-wrap .lbl{font-size:9px;font-weight:700;color:#1D4ED8;margin-bottom:2px}
  .swt-pay-compact .swt-pay-amt-inline{width:100%;padding:5px 8px;border:1px solid #93C5FD;border-radius:5px;font-size:13px;font-weight:700;text-align:right;font-family:'Inter',monospace}
  .swt-pay-compact .swt-pay-mbtns{margin-bottom:4px}
  .swt-pay-compact .swt-pay-mbtns button{padding:4px 8px;font-size:10.5px}
  .swt-pay-compact .swt-pay-lines{font-size:10.5px;color:#374151;max-height:28px;overflow-y:auto;line-height:1.35}
  .swt-pay-compact .swt-pay-lines .empty{color:#9CA3AF}
  .swt-pay-compact .swt-pay-warn{margin-top:4px;padding:4px 8px;font-size:10px}
  .swt-pay-compact .swt-pay-rm{border:none;background:transparent;color:#EF4444;cursor:pointer;padding:0 2px;font-size:10px;font-family:inherit}
  .row-bottom .tabset{display:flex;flex-direction:column;min-height:0}
  .row-bottom .tabset-nav{flex:none}
  .row-bottom .tabset-pane.on{display:flex;flex-direction:column;min-height:0;overflow:hidden;padding:6px 8px}
  .swt-dep-tabs{display:flex;gap:0;border-bottom:1px solid #E5E7EB;margin-bottom:10px}
  .swt-dep-tabs button{padding:8px 12px;border:none;background:transparent;font-size:11.5px;font-weight:600;color:#6B7280;cursor:pointer;border-bottom:2px solid transparent;font-family:inherit}
  .swt-dep-tabs button.on{color:#2563EB;border-bottom-color:#2563EB}
  .swt-del-grid{display:grid;grid-template-columns:120px 1fr;gap:6px 10px;align-items:center;font-size:12px}
  .swt-del-grid label{color:#6B7280;font-weight:600;font-size:11px}
  .swt-del-grid input,.swt-del-grid select,.swt-del-grid textarea{padding:6px 9px;border:1px solid #E5E7EB;border-radius:6px;font-size:12px;font-family:inherit}
  .swt-del-grid textarea{min-height:52px;resize:vertical}
  .swt-del-install{margin-top:10px;padding:10px;border:1px dashed #CBD5E1;border-radius:8px;background:#FAFBFC}
  .swt-appr-steps{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
  .swt-appr-step{padding:8px 12px;border-radius:8px;border:1px solid #E5E7EB;background:#F8FAFC;font-size:11px}
  .swt-appr-step.cur{background:#EFF6FF;border-color:#93C5FD;color:#1D4ED8;font-weight:700}
  .swt-appr-step.done{background:#ECFDF5;border-color:#A7F3D0;color:#065F46}
  .swt-appr-btns{display:flex;gap:8px;flex-wrap:wrap}
  .swt-appr-btns button{padding:7px 12px;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer;border:1px solid #E5E7EB;background:#fff;font-family:inherit}
  .swt-serial-wrap{display:flex;flex-direction:column;gap:6px;font-size:12px}
  .swt-serial-row{display:flex;gap:6px;align-items:center}
  .swt-serial-row input{flex:1;padding:5px 8px;border:1px solid #E5E7EB;border-radius:5px;font-family:monospace;font-size:11.5px}
  .swt-serial-meta{font-size:10.5px;color:#6B7280}
  .swt-serial-err{color:#EF4444;font-size:10.5px}
  `;

  function injectPanelCss() {
    if (document.getElementById('swt-panels-style')) return;
    var st = document.createElement('style');
    st.id = 'swt-panels-style';
    st.textContent = PANEL_CSS;
    document.head.appendChild(st);
  }

  /** SC-3P — Payment panel (opts.compact = fit row-bottom tab) */
  function swtRenderPayment(el, opts) {
    injectPanelCss();
    opts = opts || {};
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) return;
    var total = Number(opts.total || 0);
    var creditRem = Number(opts.creditRemaining || 0);
    var compact = !!opts.compact;
    var uid = 'pay' + Math.random().toString(36).slice(2, 8);
    root.className = (root.className || '') + ' swt-panel' + (compact ? ' swt-pay-compact' : '');
    if (compact) {
      root.innerHTML =
        '<div class="swt-pay-row1">' +
        '<div class="swt-pay-stat"><div class="lbl">ยอดบิล</div><div class="val" id="' + uid + 't">' + fmt(total) + '</div></div>' +
        '<div class="swt-pay-stat rem" id="' + uid + 'remrow"><div class="lbl">คงเหลือ</div><div class="val" id="' + uid + 'rem">' + fmt(total) + '</div></div>' +
        (opts.showCredit !== false ? '<div class="swt-pay-stat credit"><div class="lbl">เครดิตคงเหลือ</div><div class="val">' + fmt(creditRem) + '</div></div>' : '') +
        '<div class="swt-pay-amt-wrap"><div class="lbl">รับครั้งนี้</div><input class="swt-pay-amt-inline" id="' + uid + 'amt" value="' + fmt(total) + '"></div>' +
        '</div>' +
        '<div class="swt-pay-mbtns" id="' + uid + 'mb"></div>' +
        '<div class="swt-pay-lines" id="' + uid + 'rows"><span class="empty">ยังไม่มีรายการชำระ — เลือกวิธีด้านบน</span></div>' +
        '<div class="swt-pay-warn" id="' + uid + 'warn">⚠ ลงเครดิตเกินวงเงิน → approval:required</div>';
    } else {
      root.innerHTML =
        '<div class="swt-pay-top"><div class="swt-pay-tot"><div class="r t"><span>Total</span><span class="v" id="' + uid + 't">' + fmt(total) + '</span></div>' +
        '<div class="r rem" id="' + uid + 'remrow"><span>Remain</span><span class="v" id="' + uid + 'rem">' + fmt(total) + '</span></div></div>' +
        (opts.showCredit !== false ? '<div class="swt-pay-credit"><div style="font-weight:700;color:#374151">วงเงินเครดิตคงเหลือ</div><div style="font-size:15px;font-weight:800;color:#DC2626;margin:4px 0">' + fmt(creditRem) + '</div><div style="color:#9CA3AF">เกินวงเงิน → approval:required</div></div>' : '') +
        '</div><div class="swt-pay-enter"><div style="font-size:11px;font-weight:700;color:#1D4ED8;margin-bottom:6px">① จำนวนเงินที่รับ</div>' +
        '<input id="' + uid + 'amt" value="' + fmt(total) + '"></div>' +
        '<div style="font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;margin-bottom:6px">② เลือกวิธีชำระ</div>' +
        '<div class="swt-pay-mbtns" id="' + uid + 'mb"></div>' +
        '<table class="swt-pay-tbl"><thead><tr><th>วิธี</th><th>อ้างอิง</th><th style="text-align:right">จำนวน</th><th></th></tr></thead><tbody id="' + uid + 'rows"><tr><td colspan="4" style="color:#9CA3AF;text-align:center">ยังไม่มีรายการ</td></tr></tbody></table>' +
        '<div class="swt-pay-warn" id="' + uid + 'warn">⚠ ลงเครดิตเกินวงเงิน → approval:required</div>';
    }

    var methods = opts.methods || [
      { label: '💵 เงินสด', ref: '' },
      { label: '🏦 โอน', ref: '→ SC-15', action: 'bank' },
      { label: '📝 เช็ค', ref: '' },
      { label: '📱 QR', ref: '' },
      { label: '🧾 เครดิต', ref: 'Net30' }
    ];
    var mb = document.getElementById(uid + 'mb');
    var pays = [];
    methods.forEach(function (m) {
      var b = document.createElement('button');
      b.textContent = m.label;
      b.onclick = function () {
        if (m.action === 'bank' && typeof global.dfOpenBank === 'function') {
          global.dfOpenBank({ direction: 'in', onSelect: function (bk) { addPay(m.label, bk.bank + ' ' + bk.accountNo); } });
          return;
        }
        addPay(m.label, m.ref || '');
      };
      mb.appendChild(b);
    });

    function remain() { return total - pays.reduce(function (s, p) { return s + p.amt; }, 0); }
    function render() {
      var paid = pays.reduce(function (s, p) { return s + p.amt; }, 0);
      var rem = total - paid;
      var tb = document.getElementById(uid + 'rows');
      if (compact) {
        tb.innerHTML = pays.length ? pays.map(function (p, i) {
          return '<span class="swt-pay-line" data-i="' + i + '">' + esc(p.method) + ' ' + fmt(p.amt) + (p.ref ? ' · ' + esc(p.ref) : '') + ' <button type="button" class="swt-pay-rm">✕</button></span>';
        }).join(' · ') : '<span class="empty">ยังไม่มีรายการชำระ — เลือกวิธีด้านบน</span>';
        tb.querySelectorAll('.swt-pay-rm').forEach(function (btn) {
          btn.onclick = function (e) {
            e.stopPropagation();
            var line = btn.closest('.swt-pay-line');
            if (!line) return;
            pays.splice(Number(line.getAttribute('data-i')), 1);
            render();
            emit();
          };
        });
      } else {
        tb.innerHTML = pays.length ? pays.map(function (p, i) {
          return '<tr><td>' + esc(p.method) + '</td><td style="color:#6B7280">' + esc(p.ref || '—') + '</td><td style="text-align:right;font-family:monospace">' + fmt(p.amt) + '</td><td><span style="color:#EF4444;cursor:pointer" data-i="' + i + '">✕</span></td></tr>';
        }).join('') : '<tr><td colspan="4" style="color:#9CA3AF;text-align:center">ยังไม่มีรายการ</td></tr>';
        tb.querySelectorAll('[data-i]').forEach(function (x) {
          x.onclick = function () { pays.splice(Number(x.getAttribute('data-i')), 1); render(); emit(); };
        });
      }
      document.getElementById(uid + 'rem').textContent = fmt(Math.max(0, rem));
      document.getElementById(uid + 'remrow').classList.toggle('zero', rem <= 0);
      var credit = pays.filter(function (p) { return p.method.indexOf('เครดิต') >= 0; }).reduce(function (s, p) { return s + p.amt; }, 0);
      document.getElementById(uid + 'warn').classList.toggle('on', credit > creditRem);
      if (rem <= 0 && credit <= creditRem) {
        document.dispatchEvent(new CustomEvent('payment:complete', { detail: { lines: pays, total: total } }));
      }
    }
    function addPay(method, ref) {
      var inp = document.getElementById(uid + 'amt');
      var a = parseAmt(inp.value);
      var rem = remain();
      if (a <= 0 || rem <= 0) return;
      if (a > rem) a = rem;
      pays.push({ method: method, ref: ref, amt: a });
      inp.value = fmt(remain());
      render();
      emit();
    }
    function emit() {
      document.dispatchEvent(new CustomEvent('payment:changed', { detail: { lines: pays, remain: remain() } }));
      var credit = pays.filter(function (p) { return p.method.indexOf('เครดิต') >= 0; }).reduce(function (s, p) { return s + p.amt; }, 0);
      if (credit > creditRem) document.dispatchEvent(new CustomEvent('approval:required', { detail: { reason: 'credit_exceeded', amount: credit } }));
    }
    document.getElementById(uid + 'amt').addEventListener('input', function () {
      var v = parseAmt(this.value);
      this.value = v ? fmt(v) : '';
    });
    return { getLines: function () { return pays.slice(); }, getRemain: remain };
  }

  /* SC-3P เปิดเป็น modal — ห่อ swtRenderPayment (amount-first · ตัว canonical ในแคตตาล็อก) ด้วย overlay + ปุ่มตกลง/ปิด
     ทุกจุดรับเงิน (FI-1/SL-3/SL-4/SV-7) เรียก swtOpenPayment(opts) เหมือนเดิม → เด้งจอนี้ · opts.onConfirm(paid[]) */
  function swtOpenPayment(opts) {
    injectPanelCss();
    opts = opts || {};
    if (!document.getElementById('swtPayModalCss')) {
      var st = document.createElement('style'); st.id = 'swtPayModalCss';
      st.textContent = '.swt-pay-bg{position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:9998;display:flex;align-items:flex-start;justify-content:center;padding:40px 16px;overflow:auto}'
        + '.swt-pay-modal{background:#fff;border-radius:12px;max-width:780px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.3);overflow:hidden}'
        + '.swt-pay-modal .swt-pay-mhd{background:linear-gradient(90deg,#1E3A5F,#2563EB);color:#fff;padding:11px 16px;display:flex;align-items:center;gap:10px;font-weight:700}'
        + '.swt-pay-modal .swt-pay-mhd .ref{font-size:11px;color:rgba(255,255,255,.75);font-family:monospace;flex:1}'
        + '.swt-pay-modal .swt-pay-mhd .x{cursor:pointer;font-size:18px;opacity:.85}'
        + '.swt-pay-modal .swt-pay-mbd{padding:16px}'
        + '.swt-pay-modal .swt-pay-mact{display:flex;justify-content:flex-end;gap:10px;padding:12px 16px;border-top:1px solid #E5E7EB;background:#F9FAFB}'
        + '.swt-pay-modal .swt-pay-mact button{padding:9px 18px;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid #D1D5DB;background:#fff;color:#374151}'
        + '.swt-pay-modal .swt-pay-mact .ok{background:#10B981;color:#fff;border-color:#10B981}';
      document.head.appendChild(st);
    }
    var bg = document.createElement('div'); bg.className = 'swt-pay-bg';
    bg.innerHTML = '<div class="swt-pay-modal"><div class="swt-pay-mhd"><span>💵 รับชำระเงิน</span>'
      + '<span class="ref">' + esc(opts.ref || '') + '</span><span class="x" data-x>✕</span></div>'
      + '<div class="swt-pay-mbd"><div data-host></div></div>'
      + '<div class="swt-pay-mact"><button data-x>ปิดหน้าจอ</button><button class="ok" data-ok>✓ ตกลง (รับชำระ)</button></div></div>';
    document.body.appendChild(bg);
    var api = swtRenderPayment(bg.querySelector('[data-host]'), opts);
    function close() { bg.remove(); if (opts.onCancel) opts.onCancel(); }
    bg.querySelectorAll('[data-x]').forEach(function (b) { b.onclick = close; });
    bg.addEventListener('click', function (e) { if (e.target === bg) close(); });
    bg.querySelector('[data-ok]').onclick = function () {
      var lines = api.getLines();
      if (!lines.length) { alert('ยังไม่ได้ระบุวิธีรับชำระ'); return; }
      var paid = lines.map(function (p) { return { method: (p.method || '').replace(/^[^ก-๙A-Za-z]+/, '').trim() || p.method, label: p.method, ref: p.ref, amount: p.amt }; });
      bg.remove();
      if (opts.onConfirm) opts.onConfirm(paid);
    };
    return api;
  }

  /** SC-6 — Deposit apply */
  var DEP_MODES = {
    apply: { title: 'ตัดมัดจำ', cols: ['', 'เลขที่มัดจำ', 'วันที่', 'คงเหลือ', 'ตัดครั้งนี้'], event: 'deposit:applied' },
    billout: { title: 'วางบิล (AR)', cols: ['', 'เลขที่บิล', 'ครบกำหนด', 'ยอด', 'วางบิล'], event: 'billing:created' },
    billin: { title: 'รับวางบิล (AP)', cols: ['', 'เลขที่ vendor', 'กำหนดจ่าย', 'ยอด', 'รับวางบิล'], event: 'apbill:received' },
    settle: { title: 'ดึงตัดชำระ', cols: ['', 'เลขที่ค้าง', 'ครบกำหนด', 'ค้างชำระ', 'ตัดชำระ'], event: 'settlement:applied' }
  };

  function swtRenderDeposit(el, opts) {
    injectPanelCss();
    opts = opts || {};
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) return;
    var uid = 'dep' + Math.random().toString(36).slice(2, 8);
    var mode = opts.mode || 'apply';
    var maxAmt = Number(opts.invoiceAmt || opts.maxApply || 485000);
    var rows = opts.rows || [
      { no: 'DEP-2605-0002', date: '15 พ.ค. 26', balance: 30000 },
      { no: 'DEP-2605-0005', date: '20 พ.ค. 26', balance: 20000 },
      { no: 'DEP-2604-0099', date: '28 เม.ย. 26', balance: 40000 }
    ];
    root.className = (root.className || '') + ' swt-panel';
    root.innerHTML = '<div class="swt-dep-tabs" id="' + uid + 'tabs"></div><div id="' + uid + 'body"></div>' +
      '<div style="margin-top:10px;padding:10px 12px;background:#EFF6FF;border-radius:6px;display:flex;justify-content:space-between;font-weight:700">' +
      '<span id="' + uid + 'lbl">รวมตัด</span><span id="' + uid + 'sum" style="color:#1D4ED8;font-family:monospace">0</span></div>' +
      '<div style="margin-top:8px;text-align:right"><button class="scm-btn ok" style="padding:7px 14px;border:none;border-radius:6px;background:#10B981;color:#fff;font-weight:600;cursor:pointer;font-family:inherit" id="' + uid + 'go">ทำรายการ</button></div>';

    var tabs = document.getElementById(uid + 'tabs');
    Object.keys(DEP_MODES).forEach(function (k) {
      var b = document.createElement('button');
      b.textContent = DEP_MODES[k].title;
      b.className = k === mode ? 'on' : '';
      b.onclick = function () {
        mode = k;
        tabs.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        draw();
      };
      tabs.appendChild(b);
    });

    function calc() {
      var t = 0;
      document.querySelectorAll('#' + uid + 'body input[type=checkbox]:checked').forEach(function (c) {
        var i = c.getAttribute('data-i');
        var inp = document.getElementById(uid + 'a' + i);
        var bal = rows[Number(i)].balance;
        t += Math.min(parseAmt(inp ? inp.value : 0), bal);
      });
      document.getElementById(uid + 'sum').textContent = fmt(t);
      return t;
    }
    function draw() {
      var d = DEP_MODES[mode];
      document.getElementById(uid + 'lbl').textContent = d.title + ' รวม';
      document.getElementById(uid + 'go').textContent = '✓ ' + d.title;
      var html = '<div style="font-size:11px;color:#6B7280;margin-bottom:8px">ยอดบิลสูงสุด ' + fmt(maxAmt) + ' · validate รวม ≤ ยอดบิล</div><table class="swt-pay-tbl"><thead><tr>';
      d.cols.forEach(function (c, i) { html += '<th' + (i >= 3 ? ' style="text-align:right"' : '') + '>' + esc(c) + '</th>'; });
      html += '</tr></thead><tbody>';
      rows.forEach(function (r, i) {
        html += '<tr><td><input type="checkbox" data-i="' + i + '" onchange="void(0)"></td><td class="mono">' + esc(r.no) + '</td><td>' + esc(r.date) +
          '</td><td style="text-align:right;font-family:monospace">' + fmt(r.balance) + '</td><td style="text-align:right"><input id="' + uid + 'a' + i + '" value="' + r.balance + '" style="width:90px;text-align:right;padding:4px 6px;border:1px solid #E5E7EB;border-radius:4px;font-family:inherit"></td></tr>';
      });
      html += '</tbody></table>';
      document.getElementById(uid + 'body').innerHTML = html;
      document.querySelectorAll('#' + uid + 'body input').forEach(function (inp) {
        inp.addEventListener('change', calc);
        inp.addEventListener('input', calc);
      });
      calc();
    }
    document.getElementById(uid + 'go').onclick = function () {
      var t = calc();
      if (mode === 'apply' && t > maxAmt) { alert('ยอดตัดรวมเกินยอดบิล'); return; }
      var ev = DEP_MODES[mode].event;
      var lines = [];
      if (mode === 'apply') {
        document.querySelectorAll('#' + uid + 'body input[type=checkbox]:checked').forEach(function (c) {
          var i = Number(c.getAttribute('data-i'));
          var inp = document.getElementById(uid + 'a' + i);
          var bal = rows[i].balance;
          var amt = Math.min(parseAmt(inp ? inp.value : 0), bal);
          if (amt > 0) lines.push({ no: rows[i].no, amount: amt, href: 'sl3-deposit-mockup.html' });
        });
      }
      document.dispatchEvent(new CustomEvent(ev, { detail: { mode: mode, total: t, lines: lines, rows: rows } }));
      if (t >= maxAmt && mode === 'apply') document.dispatchEvent(new CustomEvent('deposit:fullyUsed', { detail: { total: t } }));
    };
    draw();
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

  function fillSubdistrict(sel, list, selected) {
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

  /** SC-4 — Delivery + install */
  function swtRenderDelivery(el, opts) {
    injectPanelCss();
    opts = opts || {};
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) return;
    var uid = 'del' + Math.random().toString(36).slice(2, 8);
    root.className = (root.className || '') + ' swt-panel';
    root.innerHTML =
      '<div class="swt-del-grid">' +
      '<label>รหัสไปรษณีย์</label><div style="display:flex;gap:6px">' +
      '<input id="' + uid + 'zip" inputmode="numeric" maxlength="5" placeholder="เช่น 10220" style="max-width:120px">' +
      '<button type="button" style="padding:6px 10px;border:1px solid #BFDBFE;background:#EFF6FF;color:#2563EB;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600" id="' + uid + 'map">📍 SC-10</button></div>' +
      '<label>จังหวัด</label><input type="text" id="' + uid + 'prov" readonly style="background:#F8FAFC">' +
      '<label>อำเภอ/เขต</label><input type="text" id="' + uid + 'dist" readonly style="background:#F8FAFC">' +
      '<label>ตำบล/แขวง</label><select id="' + uid + 'sub"></select>' +
      '<label>ที่อยู่ (บ้านเลขที่/หมู่/ถนน)</label><textarea id="' + uid + 'addr" placeholder="เช่น 123/4 หมู่ 5 ถ.รามอินทรา">' + esc(opts.addressLine || '') + '</textarea>' +
      '<label>วันนัดส่ง</label><input type="text" id="' + uid + 'date" value="' + esc(opts.shipDate || '12/06/26') + '">' +
      '<label>เวลา</label><input type="text" id="' + uid + 'time" value="' + esc(opts.shipTime || '09:00–12:00') + '">' +
      '<label>วิธีส่ง</label><select id="' + uid + 'meth"><option>รถบริษัท</option><option>Kerry</option><option>Flash</option><option>ลูกค้ารับเอง</option></select>' +
      '<label>ผู้รับ · เบอร์</label><input id="' + uid + 'recv" value="' + esc(opts.receiver || 'คุณสมชาย 081-234-5678') + '">' +
      '</div><div class="swt-del-install"><label style="display:flex;align-items:center;gap:8px;font-weight:600;cursor:pointer"><input type="checkbox" id="' + uid + 'inst"> ต้องการติดตั้ง (spawn SV)</label>' +
      '<div id="' + uid + 'instfld" style="display:none;margin-top:8px" class="swt-del-grid">' +
      '<label>วันนัดช่าง</label><input value="13/06/26"><label>ทีม</label><select><option>ทีม A — บางเขน</option></select><label>หมายเหตุ</label><input placeholder="ขึ้นชั้น 3 มีลิฟต์"></div></div>';

    var zipEl = document.getElementById(uid + 'zip');
    var provEl = document.getElementById(uid + 'prov');
    var distEl = document.getElementById(uid + 'dist');
    var subEl = document.getElementById(uid + 'sub');
    var addrEl = document.getElementById(uid + 'addr');

    function applyZip(zip, preferredSub) {
      var code = zipOnly(zip);
      if (zipEl) zipEl.value = code;
      var meta = TH_ZIP_META[code];
      if (meta) {
        if (provEl) provEl.value = meta.province;
        if (distEl) distEl.value = meta.district;
        fillSubdistrict(subEl, meta.subdistricts, preferredSub || meta.subdistricts[0]);
      } else {
        if (provEl) provEl.value = '';
        if (distEl) distEl.value = '';
        fillSubdistrict(subEl, [], preferredSub || '');
      }
    }

    var initZip = zipOnly(opts.zip || ((opts.address || '').match(/\b\d{5}\b/) || [])[0] || '10220');
    applyZip(initZip, opts.subdistrict || '');
    if (addrEl && opts.address && !opts.addressLine) addrEl.value = opts.address;

    if (zipEl) {
      zipEl.addEventListener('input', function () {
        applyZip(zipEl.value, '');
        document.dispatchEvent(new CustomEvent('delivery:changed', { detail: { field: 'zip' } }));
      });
    }
    if (subEl) {
      subEl.addEventListener('change', function () {
        document.dispatchEvent(new CustomEvent('delivery:changed', { detail: { field: 'subdistrict' } }));
      });
    }

    document.getElementById(uid + 'inst').onchange = function () {
      document.getElementById(uid + 'instfld').style.display = this.checked ? 'grid' : 'none';
      if (this.checked) document.dispatchEvent(new CustomEvent('install:toggled', { detail: { on: true } }));
    };
    document.getElementById(uid + 'map').onclick = function () {
      if (typeof global.dfOpenMap === 'function') {
        global.dfOpenMap({
          address: (addrEl && addrEl.value) || '',
          zip: (zipEl && zipEl.value) || '',
          subdistrict: (subEl && subEl.value) || '',
          onConfirm: function (d) {
            if (d.zip && zipEl) zipEl.value = zipOnly(d.zip);
            applyZip((zipEl && zipEl.value) || d.zip, d.subdistrict || '');
            if (addrEl && d.addressLine != null) addrEl.value = d.addressLine;
          }
        });
      }
    };
    ['addr', 'date', 'time', 'meth', 'recv'].forEach(function (f) {
      var e = document.getElementById(uid + f);
      if (e) e.addEventListener('change', function () {
        document.dispatchEvent(new CustomEvent('delivery:changed', { detail: { field: f } }));
      });
    });
  }

  /** SC-17 — Approval strip */
  function swtRenderApproval(el, opts) {
    injectPanelCss();
    opts = opts || {};
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) return;
    var steps = opts.steps || [
      { label: 'สร้างเอกสาร', state: 'done', who: 'สมศรี' },
      { label: 'ตรวจสอบ', state: 'done', who: 'ก้อง' },
      { label: 'อนุมัติ', state: 'current', who: 'ผจก.บัญชี' },
      { label: 'Post', state: 'wait', who: '—' }
    ];
    root.className = (root.className || '') + ' swt-panel';
    var html = '<div class="swt-appr-steps">';
    steps.forEach(function (s) {
      html += '<div class="swt-appr-step ' + (s.state === 'current' ? 'cur' : s.state === 'done' ? 'done' : '') + '">' + esc(s.label) + '<br><span style="font-size:10px;color:#6B7280">' + esc(s.who) + '</span></div>';
    });
    html += '</div><div style="font-size:11px;color:#6B7280;margin-bottom:8px">Maker ≠ Checker · CF-2.6 Approval Matrix</div><div class="swt-appr-btns">';
    if (opts.mode !== 'view') {
      html += '<button type="button" data-a="submit">ส่งอนุมัติ</button><button type="button" data-a="approve" style="background:#ECFDF5;border-color:#A7F3D0;color:#065F46">✓ อนุมัติ</button><button type="button" data-a="reject" style="color:#991B1B">ปฏิเสธ</button>';
    }
    html += '</div>';
    root.innerHTML = html;
    root.querySelectorAll('[data-a]').forEach(function (b) {
      b.onclick = function () {
        var a = b.getAttribute('data-a');
        if (a === 'reject') {
          var reason = prompt('เหตุผลปฏิเสธ (mock)');
          if (!reason) return;
          document.dispatchEvent(new CustomEvent('workflow:reject', { detail: { reason: reason } }));
        } else {
          document.dispatchEvent(new CustomEvent('workflow:' + a, { detail: {} }));
        }
      };
    });
  }

  /** SC-8 — Serial inline per line */
  function swtSerialInline(el, opts) {
    injectPanelCss();
    opts = opts || {};
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) return;
    var qty = Number(opts.qty || 3);
    var uid = 'sn' + Math.random().toString(36).slice(2, 8);
    var used = opts.usedSerials || [];
    root.className = (root.className || '') + ' swt-panel swt-serial-wrap';
    var html = '<div class="swt-serial-meta">S/N ต่อแถว · ต้องครบ ' + qty + ' หมายเลข · <button type="button" style="border:none;background:none;color:#2563EB;cursor:pointer;font-size:11px;font-weight:600" id="' + uid + 'csv">📎 CSV</button></div>';
    for (var i = 0; i < qty; i++) {
      html += '<div class="swt-serial-row"><span style="font-size:10px;color:#9CA3AF;width:18px">' + (i + 1) + '</span><input placeholder="สแกน S/N" data-i="' + i + '"><span class="swt-serial-err" id="' + uid + 'e' + i + '"></span></div>';
    }
    root.innerHTML = html;
    function validate(inp) {
      var v = inp.value.trim();
      var err = document.getElementById(uid + 'e' + inp.getAttribute('data-i'));
      if (!v) { if (err) err.textContent = ''; return; }
      if (used.indexOf(v) >= 0 || [].slice.call(root.querySelectorAll('input')).filter(function (x) { return x !== inp && x.value.trim() === v; }).length) {
        if (err) err.textContent = 'ซ้ำ';
        document.dispatchEvent(new CustomEvent('serial:duplicate', { detail: { serial: v } }));
        return;
      }
      if (err) err.textContent = '';
      document.dispatchEvent(new CustomEvent('serial:added', { detail: { serial: v, index: Number(inp.getAttribute('data-i')) } }));
    }
    root.querySelectorAll('input').forEach(function (inp) {
      inp.addEventListener('input', function () { validate(inp); });
    });
    document.getElementById(uid + 'csv').onclick = function () {
      alert('Mock: อัปโหลด CSV bulk S/N');
    };
  }

  global.swtRenderPayment = swtRenderPayment;
  global.swtOpenPayment = swtOpenPayment;   /* SC-3P modal (amount-first · canonical) — retire swt-payment.js */
  global.swtRenderDeposit = swtRenderDeposit;
  global.swtRenderDelivery = swtRenderDelivery;
  global.swtRenderApproval = swtRenderApproval;
  global.swtSerialInline = swtSerialInline;
})(typeof window !== 'undefined' ? window : this);
