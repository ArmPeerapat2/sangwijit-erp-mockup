// swt-perm.js — permission store กลาง + บังคับสิทธิ์ระดับฟิลด์บนหน้าเอกสาร (shared)
// ต่อยอด pattern sc2 (view-cost) ให้ครอบทุก field · ผูกกับสิทธิ์ 18 ช่องใน CF-1 (แท็บสิทธิ์ระดับฟิลด์)
//
// ใช้:  <input data-perm="editUnitPrice">                    ← ไม่มีสิทธิ์ = เทา+disabled (lock · ค่าเริ่มต้น)
//       <td class="cost-col" data-perm="viewCost">…</td>     ← ไม่มีสิทธิ์ = ค่าออกจาก DOM (hide · อ่อนไหว)
//       <span data-perm="editDocNo" data-perm-mode="lock">   ← บังคับโหมดเองได้
//       + <script src="swt-perm.js"></script>
//
// 🔒 โหมด hide = ย้ายค่าจริงเก็บใน JS memory แล้วล้าง DOM (ตาม sc2 — เปิด DevTools ก็ไม่เห็น)
//    ⚠️ ของจริงต้องบังคับฝั่งเซิร์ฟเวอร์ด้วย · mockup จำลองพฤติกรรมให้เห็นภาพ
(function (global) {
  'use strict';

  // 18 สิทธิ์ field-level (ตรงแท็บ CF-1 · def = ค่าตั้งต้นของ role "พนักงานขาย")
  var PERMS = {
    editUnitPrice:    { label: 'แก้ราคาต่อหน่วย',        def: true },
    editLineDiscount: { label: 'แก้ส่วนลดรายบรรทัด',      def: true },
    editBillDiscount: { label: 'แก้ส่วนลดท้ายบิล',        def: false },
    setItemPrice:     { label: 'ตั้งราคาซื้อ/ขายทะเบียน',  def: false },
    approveBelowMin:  { label: 'ขายต่ำกว่าราคาขั้นต่ำ',    def: false },
    viewCost:         { label: 'ดูต้นทุน',               def: false, mode: 'hide' },
    viewCreditLimit:  { label: 'ดูวงเงินเครดิต',          def: true,  mode: 'hide' },
    editCreditLimit:  { label: 'แก้วงเงินเครดิต',          def: false },
    editDocDate:      { label: 'แก้วันที่เอกสาร',          def: false },
    editDocNo:        { label: 'แก้เลขที่เอกสาร',          def: false },
    changeCustomer:   { label: 'เปลี่ยนคู่ค้าในบิล',        def: false },
    editPosted:       { label: 'แก้/ยกเลิกบิลที่โพสต์แล้ว', def: false },
    reprintBill:      { label: 'พิมพ์บิลซ้ำ',             def: true },
    approveOverPo:    { label: 'อนุมัติรับเกิน PO',        def: false }
  };

  // สิทธิ์ผูกที่ "กลุ่มสิทธิ์/ตำแหน่ง" ที่ตั้งเองที่ CF-1 — ไม่มี preset role ตายตัว
  // def = สถานะติ๊กตั้งต้นของเดโม (แอดมินเปลี่ยนได้จริงที่ CF-1)
  var state = {};
  Object.keys(PERMS).forEach(function (k) { state[k] = PERMS[k].def; });

  function isField(el) { return /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName); }
  function modeOf(el, key) { return el.getAttribute('data-perm-mode') || (PERMS[key] && PERMS[key].mode) || 'lock'; }

  function applyOne(el) {
    var key = el.getAttribute('data-perm');
    if (!key || !(key in state)) return;
    var allowed = !!state[key];
    var field = isField(el);

    if (modeOf(el, key) === 'hide') {
      // เก็บค่าจริงไว้ใน JS (ไม่ทิ้งใน DOM ตอนไม่มีสิทธิ์)
      if (el.__permVal == null) el.__permVal = field ? el.value : el.innerHTML;
      if (allowed) {
        el.style.display = el.__permDisp || '';
        if (field) el.value = el.__permVal; else el.innerHTML = el.__permVal;
      } else {
        if (el.__permDisp == null) el.__permDisp = el.style.display;
        el.style.display = 'none';
        if (field) el.value = ''; else el.innerHTML = '';
      }
    } else { // lock
      if (field) el.disabled = !allowed;
      else el.style.pointerEvents = allowed ? '' : 'none';
      el.classList.toggle('perm-locked', !allowed);
      el.title = allowed ? (el.__permTitle || '') : ('🔒 ไม่มีสิทธิ์: ' + (PERMS[key].label));
    }
  }

  function applyAll(root) {
    (root || document).querySelectorAll('[data-perm]').forEach(applyOne);
    document.dispatchEvent(new CustomEvent('perm:applied', { detail: { state: state } }));
  }

  function setPerm(key, val) { if (key in state) { state[key] = !!val; applyAll(); } }

  // ───────── แถบจำลองสิทธิ์ (เดโม · โผล่เฉพาะหน้าที่ wire) ─────────
  var panel;
  function buildPanel() {
    if (!document.querySelector('[data-perm]')) return; // ไม่มี field wire = ไม่ต้องมีแถบ
    var css = '.perm-locked{background:#F1F5F9!important;color:#94A3B8!important;cursor:not-allowed!important}'
      + '#swtPermBar{position:fixed;right:14px;bottom:14px;z-index:120;width:250px;background:#0F172A;color:#E2E8F0;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.35);font:12px/1.5 Inter,sans-serif;overflow:hidden}'
      + '#swtPermBar .hd{background:#1E293B;padding:8px 12px;font-weight:700;display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none}'
      + '#swtPermBar .hd .x{margin-left:auto;opacity:.6;font-weight:400}'
      + '#swtPermBar .bd{padding:10px 12px;max-height:52vh;overflow:auto}'
      + '#swtPermBar.min .bd{display:none}'
      + '#swtPermBar label{display:flex;align-items:center;gap:7px;padding:3px 0;cursor:pointer}'
      + '#swtPermBar label input{margin:0}'
      + '#swtPermBar .note{margin-top:8px;font-size:10px;color:#64748B;line-height:1.5}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    panel = document.createElement('div'); panel.id = 'swtPermBar';
    // แสดงเฉพาะสิทธิ์ที่หน้านี้ผูกไว้จริง (ติ๊กแล้วเห็นผลทุกช่อง) — สิทธิ์ตั้งจริงที่ CF-1 (กลุ่ม/ตำแหน่ง)
    var keys = [];
    document.querySelectorAll('[data-perm]').forEach(function (el) {
      var k = el.getAttribute('data-perm');
      if (PERMS[k] && keys.indexOf(k) < 0) keys.push(k);
    });
    var rows = keys.map(function (k) {
      return '<label><input type="checkbox" data-permkey="' + k + '">' + PERMS[k].label + '</label>';
    }).join('');
    panel.innerHTML =
      '<div class="hd">🧪 สิทธิ์กลุ่มนี้ (เดโม)<span class="x">▾ ย่อ</span></div>'
      + '<div class="bd">'
      + '<div style="font-size:10.5px;color:#94A3B8;margin-bottom:8px">ติ๊ก = กลุ่ม/ตำแหน่งนี้มีสิทธิ์ · ตั้งจริงที่ CF-1</div>'
      + rows
      + '<div class="note">🔒 mockup จำลองการบังคับสิทธิ์ให้เห็นภาพ · ของจริงต้องบังคับฝั่งเซิร์ฟเวอร์ด้วย</div>'
      + '</div>';
    document.body.appendChild(panel);

    panel.querySelector('.hd').addEventListener('click', function () { panel.classList.toggle('min'); });
    panel.querySelectorAll('[data-permkey]').forEach(function (cb) {
      cb.addEventListener('change', function () { setPerm(cb.getAttribute('data-permkey'), cb.checked); });
    });
    syncPanel();
  }
  function syncPanel() {
    if (!panel) return;
    panel.querySelectorAll('[data-permkey]').forEach(function (cb) {
      cb.checked = !!state[cb.getAttribute('data-permkey')];
    });
  }

  function init() { buildPanel(); applyAll(); }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }

  global.SWT_PERM = { state: state, perms: PERMS };
  global.swtApplyPerm = applyAll;
  global.swtSetPerm = setPerm;
})(typeof window !== 'undefined' ? window : this);
