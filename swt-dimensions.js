// swt-dimensions.js — 5 มิติมาตรฐานบนเอกสาร (shared · แทน hardcode ซ้ำ sl3/sl4/slcn/sqt)
// DOCGROUP · DEPARTMENT · PROJECT · ALLOCATECODE · SITECODE — ตัวเลือกจากทะเบียนกลาง (cf2-7 แม่แบบเอกสาร · ต่อ BC)
// ใช้: <div data-dims="docGroup,site" style="display:grid;grid-template-columns:1fr 1fr;gap:6px 14px"></div>
//      หลาย field: data-dims="department,project,allocate" · auto-render ตอนโหลด (swtInitDimensions)
// เดิม hardcode 5 มิติ 4 หน้า → ตอนนี้แก้ options ที่เดียว sync ทุกหน้า
(function(global){
  var DIM = {
    docGroup:   { label:'กลุ่มเอกสาร', id:'dimDocGroup',   code:'DOCGROUP',     opts:['ขายปกติ','ขายโครงการ','ขายพนักงาน','ขายส่งเสริมการขาย','งานบริการ','โอนภายใน','ใบรับชำระหนี้'] },
    department: { label:'แผนก',        id:'dimDepartment', code:'DEPARTMENT',   opts:['ฝ่ายขาย','ศูนย์บริการ','คลังสินค้า','บริหาร'] },
    project:    { label:'โครงการ',      id:'dimProject',    code:'PROJECT',      opts:['— ไม่ระบุ —','PRJ-001 คอนโดสุขุมวิท','PRJ-002 โรงแรมหัวหิน'] },
    allocate:   { label:'การจัดสรร',    id:'dimAllocate',   code:'ALLOCATECODE', opts:['— ไม่ระบุ —','ALC-01 งบการตลาด','ALC-02 งบซ่อมบำรุง'] },
    site:       { label:'สาขา',         id:'dimSite',       code:'SITECODE',     opts:['TPM เทรดดิ้ง (โกดัง)','SWE1 สำนักงานใหญ่','07 ศูนย์บริการซ่อม-เคลม','SHO สาขา 10'] }
  };

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // render <field><label><select> ต่อ key — ใส่ id/code เดิม (JS อื่นอ้าง id ได้เหมือน hardcode)
  // sel = {key: value} เลือก option ตาม default หน้านั้น (ไม่มี = option แรก) — กันหน้าที่ context ต่าง (เช่น sqt งานบริการ)
  function swtRenderDimensions(el, keys, sel){
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el || !keys) return;
    el.innerHTML = keys.map(function(k){
      var d = DIM[k]; if (!d) return '';
      return '<div class="field" style="margin-bottom:0"><div class="field-label">' + esc(d.label) + '</div>' +
        '<select class="resv-sel" id="' + d.id + '" title="' + d.code + '">' +
        d.opts.map(function(o,i){
          var chosen = (sel && sel[k] != null) ? (o === sel[k]) : (i === 0);
          return '<option' + (chosen ? ' selected' : '') + '>' + esc(o) + '</option>';
        }).join('') +
        '</select></div>';
    }).join('');
  }

  // data-dim-sel="docGroup=งานบริการ;department=ศูนย์บริการ" → default ต่อหน้า
  function parseSel(el){
    var sel = {}, raw = el.getAttribute('data-dim-sel');
    if (raw) raw.split(';').forEach(function(p){ var i = p.indexOf('='); if (i > 0) sel[p.slice(0, i).trim()] = p.slice(i + 1).trim(); });
    return sel;
  }
  function swtInitDimensions(root){
    (root || document).querySelectorAll('[data-dims]').forEach(function(el){
      if (el.getAttribute('data-dims-done')) return;
      swtRenderDimensions(el, el.getAttribute('data-dims').split(',').map(function(s){ return s.trim(); }), parseSel(el));
      el.setAttribute('data-dims-done', '1');
    });
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ swtInitDimensions(); });
    else swtInitDimensions();
  }

  global.SWT_DIMENSIONS = DIM;
  global.swtRenderDimensions = swtRenderDimensions;
  global.swtInitDimensions = swtInitDimensions;
})(typeof window !== 'undefined' ? window : this);
