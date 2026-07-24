// swt-address.js — ที่อยู่ 12 ช่อง (shared component · ใช้ซ้ำ ลูกค้า/ผู้ขาย/สาขา/พนักงาน)
// grill 2026-07-24: postal-first — พิมพ์รหัสไปรษณีย์ → เด้ง จังหวัด/อำเภอ/ตำบล · + ปุ่มอ่านบัตรประชาชน
// ใช้:  swtRenderAddress(el, {data:{...}, prefix:'cust'})
(function(){
  // sample dataset (mockup) — จริงต่อ API ไปรษณีย์ไทย / กรมการปกครอง
  var POSTAL = {
    '10110': {prov:'กรุงเทพมหานคร', dist:'คลองเตย',        subs:['คลองเตย','คลองตัน','พระโขนง']},
    '10230': {prov:'กรุงเทพมหานคร', dist:'บางเขน',          subs:['อนุสาวรีย์','ท่าแร้ง']},
    '11000': {prov:'นนทบุรี',        dist:'เมืองนนทบุรี',    subs:['สวนใหญ่','ตลาดขวัญ','บางเขน','ท่าทราย']},
    '20000': {prov:'ชลบุรี',         dist:'เมืองชลบุรี',     subs:['บางปลาสร้อย','มะขามหย่ง','บ้านโขด']},
    '50000': {prov:'เชียงใหม่',      dist:'เมืองเชียงใหม่',  subs:['ศรีภูมิ','พระสิงห์','หายยา','ช้างม่อย','ช้างคลาน']},
    '10400': {prov:'กรุงเทพมหานคร', dist:'ดินแดง',          subs:['ดินแดง','รัชดาภิเษก']},
    '10540': {prov:'สมุทรปราการ',    dist:'บางพลี',          subs:['บางพลีใหญ่','บางแก้ว','ราชาเทวะ']},
    '47000': {prov:'สกลนคร',         dist:'เมืองสกลนคร',     subs:['ธาตุเชิงชุม','ธาตุนาเวง','งิ้วด่อน','ฮางโฮง','พังขว้าง']},
    '47230': {prov:'สกลนคร',         dist:'เมืองสกลนคร',     subs:['ท่าแร่','ม่วงลาย']},
    '38000': {prov:'บึงกาฬ',         dist:'เมืองบึงกาฬ',     subs:['บึงกาฬ','โนนสมบูรณ์','โคกก่อง','วิศิษฐ์']}
  };
  // 8 ช่องรายละเอียด (กรอกเอง) + 4 ช่องท้อง (ตำบล/อำเภอ/จังหวัด/ไปรษณีย์)
  var DETAIL = [
    ['building','อาคาร'],['village','หมู่บ้าน/โครงการ'],['room','ห้อง'],['floor','ชั้น'],
    ['no','เลขที่'],['moo','หมู่'],['soi','ตรอก/ซอย'],['road','ถนน']
  ];
  var CSS = 'display:grid;grid-template-columns:repeat(4,1fr);gap:9px';
  function fld(key,label,val){
    return '<div><label style="font-size:11px;color:#64748B;display:block;margin-bottom:2px">'+label+'</label>'+
      '<input data-f="'+key+'" value="'+(val||'')+'" style="width:100%;padding:6px 9px;border:1px solid #CBD5E1;border-radius:6px;font-family:inherit;font-size:13px"></div>';
  }
  window.swtRenderAddress = function(el, opts){
    opts = opts || {}; var d = opts.data || {};
    var detailHtml = DETAIL.map(function(f){return fld(f[0],f[1],d[f[0]]);}).join('');
    el.innerHTML =
      '<div style="border:1px solid #E2E8F0;border-radius:10px;padding:13px 15px;background:#fff">'+
      '  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:11px">'+
      '    <span style="font-size:12.5px;font-weight:700;color:#1E3A5F">📍 ที่อยู่ (12 ช่อง)</span>'+
      '    <button type="button" class="addr-idcard" style="font-size:11.5px;font-weight:700;color:#1E40AF;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:7px;padding:4px 11px;cursor:pointer;font-family:inherit">📇 อ่านบัตรประชาชน</button>'+
      '    <span class="addr-idresult" style="font-size:11px;color:#059669"></span>'+
      '  </div>'+
      '  <div style="'+CSS+'">'+ detailHtml +'</div>'+
      '  <div style="'+CSS+';margin-top:9px;align-items:end">'+
      '    <div><label style="font-size:11px;color:#B45309;display:block;margin-bottom:2px;font-weight:700">รหัสไปรษณีย์ ⚡</label>'+
      '      <input class="addr-postal" maxlength="5" value="'+(d.postal||'')+'" placeholder="พิมพ์ 5 หลัก" style="width:100%;padding:6px 9px;border:1.5px solid #FDBA74;border-radius:6px;font-family:inherit;font-size:13px;font-weight:700"></div>'+
      '    <div><label style="font-size:11px;color:#64748B;display:block;margin-bottom:2px">ตำบล/แขวง</label>'+
      '      <select class="addr-sub" data-f="sub" style="width:100%;padding:6px 9px;border:1px solid #CBD5E1;border-radius:6px;font-family:inherit;font-size:13px"><option value="">—</option></select></div>'+
      '    <div><label style="font-size:11px;color:#64748B;display:block;margin-bottom:2px">อำเภอ/เขต</label>'+
      '      <input class="addr-dist" data-f="dist" readonly value="'+(d.dist||'')+'" style="width:100%;padding:6px 9px;border:1px solid #E2E8F0;border-radius:6px;font-family:inherit;font-size:13px;background:#F8FAFC;color:#475569"></div>'+
      '    <div><label style="font-size:11px;color:#64748B;display:block;margin-bottom:2px">จังหวัด</label>'+
      '      <input class="addr-prov" data-f="prov" readonly value="'+(d.prov||'')+'" style="width:100%;padding:6px 9px;border:1px solid #E2E8F0;border-radius:6px;font-family:inherit;font-size:13px;background:#F8FAFC;color:#475569"></div>'+
      '  </div>'+
      '  <div class="addr-hint" style="font-size:11px;color:#94A3B8;margin-top:7px">พิมพ์รหัสไปรษณีย์ → จังหวัด/อำเภอเด้งอัตโนมัติ · เลือกตำบล (mockup dataset · จริงต่อ API ไปรษณีย์ไทย)</div>'+
      '</div>';

    var pc = el.querySelector('.addr-postal'),
        sub = el.querySelector('.addr-sub'),
        dist = el.querySelector('.addr-dist'),
        prov = el.querySelector('.addr-prov'),
        hint = el.querySelector('.addr-hint');

    function fillPostal(keepSub){
      var v = (pc.value||'').trim(), m = POSTAL[v];
      if(m){
        prov.value = m.prov; dist.value = m.dist;
        var cur = keepSub ? sub.value : '';
        sub.innerHTML = m.subs.map(function(s){return '<option'+(s===cur?' selected':'')+'>'+s+'</option>';}).join('');
        hint.textContent = m.subs.length>1 ? ('✓ เด้งแล้ว — เลือกตำบล ('+m.subs.length+' ตัวเลือก)') : '✓ เด้งอัตโนมัติจากไปรษณีย์';
        hint.style.color = '#059669';
      } else if(v.length===5){
        prov.value=''; dist.value=''; sub.innerHTML='<option value="">—</option>';
        hint.textContent='ไม่พบไปรษณีย์นี้ใน mockup dataset (จริงต่อ API ไปรษณีย์ไทย)';
        hint.style.color = '#DC2626';
      }
    }
    pc.addEventListener('input', function(){ fillPostal(false); });

    el.querySelector('.addr-idcard').addEventListener('click', function(){
      // mockup: จำลองอ่านบัตร (จริง = เครื่องอ่าน smartcard / OCR)
      pc.value = '50000'; fillPostal(false); sub.value = 'ศรีภูมิ';
      var setF = function(k,val){ var i=el.querySelector('[data-f="'+k+'"]'); if(i) i.value=val; };
      setF('no','99/1'); setF('moo','4'); setF('road','ห้วยแก้ว'); setF('village','');
      el.querySelector('.addr-idresult').textContent = '✓ อ่านบัตร: นายสมชาย จินตนากูล · 1-5099-xxxxx-xx-x';
    });

    if(d.postal) fillPostal(true);
  };

  // swtAddressWire(map) — ผูก postal-first + อ่านบัตร เข้ากับ "ฟอร์ม 12 ช่องที่มีอยู่แล้ว" (ไม่ต้องรื้อ markup)
  // map = {post, tambon, amphur, province, no, moo, road, idBtn, idResult}  (ค่า = element id)
  window.swtAddressWire = function(map){
    var g = function(id){ return id ? document.getElementById(id) : null; };
    var post = g(map.post); if(!post) return;
    function fill(){
      var v = (post.value||'').trim(), m = POSTAL[v];
      if(!m) return;
      if(g(map.province)) g(map.province).value = m.prov;
      if(g(map.amphur))   g(map.amphur).value   = m.dist;
      var tb = g(map.tambon);
      if(tb && (!tb.value || m.subs.indexOf(tb.value) === -1)) tb.value = m.subs[0]; // เด้งตำบลแรกถ้าว่าง/ไม่ตรง
    }
    post.addEventListener('input', fill);
    var btn = g(map.idBtn);
    if(btn) btn.addEventListener('click', function(){
      if(g(map.post)){ g(map.post).value = '50000'; fill(); }
      if(g(map.tambon)) g(map.tambon).value = 'ศรีภูมิ';
      if(g(map.no))   g(map.no).value = '99/1';
      if(g(map.moo))  g(map.moo).value = '4';
      if(g(map.road)) g(map.road).value = 'ห้วยแก้ว';
      if(g(map.idResult)) g(map.idResult).textContent = '✓ อ่านบัตร: นายสมชาย จินตนากูล · 1-5099-xxxxx-xx-x';
    });
  };
})();
