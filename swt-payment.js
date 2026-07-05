/* ═══════════════════════════════════════════════════════════════
   swt-payment.js — Shared Component "รับชำระเงิน" (SC-Payment)
   อิง _reference/ComponanceShare/payment (ERP เดิม) · split payment (Total/Remain)
   API:
     swtRenderPayment(el, opts)  → render component ลงใน element
     swtOpenPayment(opts)        → เปิดเป็น modal
   opts = { total, ref, accounts:[str], cardTypes:[{name,charge}], promptpay:{biller,ref1,ref2}, onConfirm(paid[]) }
   state แยกต่อ instance (closure) · wire ผ่าน data-act ไม่ชน global
   ═══════════════════════════════════════════════════════════════ */
(function(global){
  var CSS = `
  .pay{background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;max-width:900px;font-family:'Inter','Noto Sans Thai',sans-serif;color:#111827}
  .pay-head{background:linear-gradient(90deg,#1E3A5F,#2563EB);color:#fff;padding:10px 16px;display:flex;align-items:center;gap:10px}
  .pay-head .ico{font-size:18px}.pay-head h2{font-size:15px;font-weight:700;flex:1;margin:0}
  .pay-head .ref{font-size:11px;color:rgba(255,255,255,.75);font-family:monospace}
  .pay-body{display:grid;grid-template-columns:230px 1fr;gap:0}
  .pay-tot{background:#374151;padding:16px;display:flex;flex-direction:column;gap:12px}
  .pay-tot .box{background:#4B5563;border-radius:8px;padding:12px 14px}
  .pay-tot .lbl{font-size:11px;color:#D1D5DB;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
  .pay-tot .amt{font-size:30px;font-weight:800;font-family:'Inter',monospace;color:#fff;text-align:right;line-height:1.1;margin-top:4px}
  .pay-tot .box.remain{background:#fff}.pay-tot .box.remain .lbl{color:#6B7280}.pay-tot .box.remain .amt{color:#DC2626}
  .pay-tot .box.remain.done{background:#6EE7B7}.pay-tot .box.remain.done .amt{color:#065F46}.pay-tot .box.remain.done .lbl{color:#065F46}
  .pay-methods{padding:14px 16px;display:flex;flex-direction:column;gap:12px}
  .pm-row{display:flex;align-items:center;gap:10px}
  .pm-row .plbl{font-size:12.5px;font-weight:600;color:#374151;width:110px;flex-shrink:0;display:flex;align-items:center;gap:6px}
  .pm-in{flex:1;padding:7px 10px;border:1px solid #D1D5DB;border-radius:6px;font-size:13px;font-family:inherit;text-align:right;font-weight:600}
  .pm-in:focus{outline:none;border-color:#2563EB}
  .pm-add{background:#10B981;color:#fff;border:none;border-radius:6px;width:32px;height:32px;font-size:15px;cursor:pointer;flex-shrink:0;font-family:inherit}
  .pm-add:hover{background:#059669}
  .pm-transfer{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}
  .pm-transfer .tt{font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase}
  .pm-mini{display:grid;grid-template-columns:90px 1fr;gap:6px 8px;align-items:center;font-size:12px}
  .pm-mini label{color:#6B7280;font-weight:500}
  .pm-mini input,.pm-mini select{padding:5px 8px;border:1px solid #D1D5DB;border-radius:5px;font-size:12px;font-family:inherit;width:100%}
  .pm-tabs{display:flex;gap:0;border-bottom:2px solid #E5E7EB}
  .pm-tab{padding:8px 14px;border:none;background:transparent;cursor:pointer;font-size:12.5px;font-weight:600;color:#6B7280;font-family:inherit;border-bottom:2px solid transparent;margin-bottom:-2px;display:flex;gap:5px;align-items:center}
  .pm-tab.active{color:#2563EB;border-bottom-color:#2563EB}
  .pm-pane{display:none;padding-top:12px}.pm-pane.active{display:block}
  .qr-wrap{display:flex;gap:16px;align-items:center;background:#F0F9FF;border:1px solid #BAE6FD;border-radius:8px;padding:14px}
  .qr-img{width:130px;height:130px;flex-shrink:0;background:#fff;border:1px solid #CBD5E1;border-radius:8px;background-image:linear-gradient(45deg,#0F172A 25%,transparent 25%),linear-gradient(-45deg,#0F172A 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#0F172A 75%),linear-gradient(-45deg,transparent 75%,#0F172A 75%);background-size:12px 12px;background-position:0 0,0 6px,6px -6px,-6px 0}
  .qr-info{font-size:12.5px;line-height:1.7;color:#0C4A6E}.qr-info b{color:#2563EB;font-family:monospace}
  .pm-grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px 14px;margin-top:2px}
  .pm-fld{display:flex;flex-direction:column;gap:3px}
  .pm-fld label{font-size:11px;color:#6B7280;font-weight:500}
  .pm-fld input,.pm-fld select{padding:6px 9px;border:1px solid #D1D5DB;border-radius:5px;font-size:12.5px;font-family:inherit}
  .pm-charge{font-size:11.5px;color:#B45309;font-weight:600}
  .pay-foot{border-top:1px solid #E5E7EB;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .paid-list{flex:1;display:flex;gap:6px;flex-wrap:wrap;min-height:26px;align-items:center}
  .paid-chip{display:inline-flex;align-items:center;gap:6px;background:#ECFDF5;color:#065F46;border:1px solid #A7F3D0;border-radius:16px;padding:3px 6px 3px 10px;font-size:11.5px;font-weight:600}
  .paid-chip .x{cursor:pointer;background:#065F46;color:#fff;border-radius:50%;width:15px;height:15px;display:flex;align-items:center;justify-content:center;font-size:10px}
  .paid-empty{font-size:12px;color:#9CA3AF}
  .pay-btn{padding:9px 20px;border:none;border-radius:7px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit}
  .pay-btn.ok{background:#10B981;color:#fff}.pay-btn.ok:disabled{background:#D1D5DB;color:#9CA3AF;cursor:not-allowed}
  .pay-btn.cancel{background:#fff;color:#6B7280;border:1px solid #D1D5DB}
  .pay-overlay{position:fixed;inset:0;background:rgba(15,23,42,.45);display:flex;align-items:flex-start;justify-content:center;padding:48px 16px;z-index:9998;overflow-y:auto}
  `;
  var injected=false;
  function inject(){ if(injected)return; var s=document.createElement('style'); s.textContent=CSS; document.head.appendChild(s); injected=true; }
  function fmt(n){return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
  function num(v){var n=parseFloat(String(v).replace(/,/g,''));return isNaN(n)?0:n;}
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  var DEFAULT_CARDS=[
    {name:'บัตรกสิกรไทย',charge:0},{name:'บัตรไทยพาณิชย์',charge:0},
    {name:'SHOPEE',charge:3.21},{name:'LaZaDa',charge:3.00},{name:'Noc Noc',charge:2.14},
    {name:'คนละครึ่ง',charge:0},{name:'ปลายทาง (COD)',charge:0},{name:'ผ่อนกับแสงวิจิตร',charge:0}
  ];

  function buildHTML(o){
    var cards=(o.cardTypes||DEFAULT_CARDS).map(function(c){return '<option data-c="'+(c.charge||0)+'">'+esc(c.name)+(c.charge?' (ชาร์จ '+c.charge+'%)':'')+'</option>';}).join('');
    var accs=(o.accounts||['547-2-55623-9 · กสิกรไทย (SWT)']).map(function(a){return '<option>'+esc(a)+'</option>';}).join('');
    var pp=o.promptpay||{}; var total=o.total||0;
    return ''
    +'<div class="pay">'
    +'<div class="pay-head"><span class="ico">💵</span><h2>รับชำระเงิน</h2><span class="ref">'+esc(o.ref||'')+'</span></div>'
    +'<div class="pay-body">'
    +'<div class="pay-tot">'
      +'<div class="box"><div class="lbl">ยอดที่ต้องรับ (Total)</div><div class="amt" data-el="total">'+fmt(total)+'</div></div>'
      +'<div class="box remain" data-el="remainbox"><div class="lbl">คงเหลือ (Remain)</div><div class="amt" data-el="remain">'+fmt(total)+'</div></div>'
    +'</div>'
    +'<div class="pay-methods">'
      +'<div class="pm-row"><div class="plbl">💵 เงินสด</div><input class="pm-in" data-el="cash" placeholder="0.00" inputmode="decimal"><button class="pm-add" data-act="cash" title="เพิ่ม">+</button></div>'
      +'<div class="pm-transfer"><div class="tt">🏦 ลูกค้าโอนเงินเข้าธนาคาร</div><div class="pm-mini">'
        +'<label>เลขที่บัญชี</label><select>'+accs+'</select>'
        +'<label>จำนวนเงิน</label><div style="display:flex;gap:6px"><input data-el="tfamt" placeholder="0.00" inputmode="decimal" style="text-align:right;font-weight:600"><button class="pm-add" data-act="transfer">+</button></div>'
        +'<label>ค่าธรรมเนียม</label><input value="0.00" inputmode="decimal" style="text-align:right"></div></div>'
      +'<div class="pm-tabs">'
        +'<button class="pm-tab active" data-act="tab" data-tab="qr">📱 QR PromptPay</button>'
        +'<button class="pm-tab" data-act="tab" data-tab="card">💳 บัตร/มาร์เก็ตเพลส</button>'
        +'<button class="pm-tab" data-act="tab" data-tab="chq">🧾 เช็ค</button>'
        +'<button class="pm-tab" data-act="tab" data-tab="etc">📋 อื่นๆ</button>'
      +'</div>'
      +'<div class="pm-pane active" data-pane="qr"><div class="qr-wrap"><div class="qr-img"></div><div class="qr-info">'
        +'<div><b>PromptPay</b> · '+esc(pp.biller||'SWT 099-4-12345-6')+'</div>'
        +'<div>Ref1: <b>'+esc(pp.ref1||o.ref||'-')+'</b></div><div>Ref2: <b>'+esc(pp.ref2||'-')+'</b></div>'
        +'<div style="margin-top:6px">ยอด <b>'+fmt(total)+'</b> ฿</div>'
        +'<button class="pm-add" data-act="qr" style="width:auto;padding:4px 12px;margin-top:6px;font-size:12px">✓ ยืนยันรับ QR</button>'
      +'</div></div></div>'
      +'<div class="pm-pane" data-pane="card"><div class="pm-grid2">'
        +'<div class="pm-fld"><label>ประเภทบัตร/ช่องทาง (master)</label><select data-el="cardtype" data-act="calc"><option data-c="0" value="">— เลือก —</option>'+cards+'</select></div>'
        +'<div class="pm-fld"><label>ยอดชำระบัตร</label><input data-el="cardamt" data-act="calcin" placeholder="0.00" inputmode="decimal" style="text-align:right"></div>'
        +'<div class="pm-fld"><label>เลขที่บัตร/อ้างอิง</label><input placeholder="xxxx-xxxx"></div>'
        +'<div class="pm-fld"><label>ค่าชาร์จ (auto)</label><input data-el="cardchg" value="0.00" readonly style="text-align:right;background:#F9FAFB"></div>'
      +'</div><div class="pm-charge" data-el="chgnote" style="margin-top:8px;display:none"></div>'
      +'<button class="pm-add" data-act="card" style="width:auto;padding:5px 14px;margin-top:8px;font-size:12px">+ เพิ่มการชำระบัตร</button></div>'
      +'<div class="pm-pane" data-pane="chq"><div class="pm-grid2">'
        +'<div class="pm-fld"><label>เลขที่เช็ค</label><input placeholder="เลขเช็ค"></div>'
        +'<div class="pm-fld"><label>ธนาคาร · สาขา</label><input placeholder="ธนาคาร / สาขา"></div>'
        +'<div class="pm-fld"><label>ลงวันที่</label><input value="05 ก.ค. 26"></div>'
        +'<div class="pm-fld"><label>มูลค่าเช็ค</label><input data-el="chqamt" placeholder="0.00" inputmode="decimal" style="text-align:right"></div>'
      +'</div><button class="pm-add" data-act="cheque" style="width:auto;padding:5px 14px;margin-top:8px;font-size:12px">+ เพิ่มเช็ค</button></div>'
      +'<div class="pm-pane" data-pane="etc"><div class="pm-grid2">'
        +'<div class="pm-fld"><label>ลูกหนี้เงินผ่อน (AR)</label><input data-el="etcamt" placeholder="0.00" inputmode="decimal" style="text-align:right"></div>'
        +'<div class="pm-fld"><label>หมายเหตุ</label><input placeholder="เช่น ตั้งเป็นลูกหนี้ Net 7"></div>'
      +'</div><button class="pm-add" data-act="etc" style="width:auto;padding:5px 14px;margin-top:8px;font-size:12px">+ ตั้งเป็นลูกหนี้/ผ่อน</button></div>'
    +'</div></div>'
    +'<div class="pay-foot"><div class="paid-list" data-el="paidlist"><span class="paid-empty">ยังไม่มีการชำระ — เพิ่มวิธีจ่ายจนคงเหลือ = 0</span></div>'
    +'<button class="pay-btn cancel" data-act="cancel">ยกเลิก</button><button class="pay-btn ok" data-act="ok" disabled>✓ ตกลง (รับชำระ)</button></div>'
    +'</div>';
  }

  function wire(root, o){
    var total=o.total||0, paid=[];
    function q(k){return root.querySelector('[data-el="'+k+'"]');}
    function sum(){return paid.reduce(function(s,p){return s+p.amount;},0);}
    function suggest(){return Math.max(0,total-sum());}
    function render(){
      var s=sum(), remain=Math.max(0,total-s), over=s>total+0.001;
      q('remain').textContent=fmt(remain);
      q('remainbox').classList.toggle('done', remain<0.005 && paid.length>0);
      var pl=q('paidlist');
      if(!paid.length) pl.innerHTML='<span class="paid-empty">ยังไม่มีการชำระ — เพิ่มวิธีจ่ายจนคงเหลือ = 0</span>';
      else pl.innerHTML=paid.map(function(p,i){return '<span class="paid-chip">'+esc(p.label)+' '+fmt(p.amount)+' <span class="x" data-act="del" data-i="'+i+'">✕</span></span>';}).join('');
      if(over) pl.innerHTML+='<span class="paid-empty" style="color:#DC2626">⚠ เกินยอด '+fmt(s-total)+'</span>';
      root.querySelector('[data-act="ok"]').disabled=!(remain<0.005 && paid.length>0 && !over);
    }
    function push(m,l,a){ if(a>0){paid.push({method:m,label:l,amount:a});render();} }
    function calc(){
      var sel=q('cardtype'); if(!sel)return;
      var c=parseFloat(sel.options[sel.selectedIndex].getAttribute('data-c')||'0'), amt=num(q('cardamt').value), chg=amt*c/100;
      q('cardchg').value=fmt(chg);
      var note=q('chgnote');
      if(c>0&&amt>0){note.style.display='block';note.textContent='ค่าชาร์จ '+c+'% = '+fmt(chg)+' ฿ · ยอดสุทธิเข้าบริษัท '+fmt(amt-chg)+' ฿ (ลูกค้าจ่ายเต็ม '+fmt(amt)+')';}
      else note.style.display='none';
    }
    root.addEventListener('click', function(e){
      var b=e.target.closest('[data-act]'); if(!b||!root.contains(b))return;
      var act=b.getAttribute('data-act');
      if(act==='del'){ paid.splice(+b.getAttribute('data-i'),1); render(); return; }
      if(act==='tab'){ var t=b.getAttribute('data-tab');
        root.querySelectorAll('.pm-tab').forEach(function(x){x.classList.remove('active');});
        root.querySelectorAll('.pm-pane').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active'); root.querySelector('[data-pane="'+t+'"]').classList.add('active'); return; }
      if(act==='cash'){ var el=q('cash'); push('cash','💵 เงินสด', num(el.value)||suggest()); el.value=''; }
      else if(act==='transfer'){ var el2=q('tfamt'); push('transfer','🏦 โอน', num(el2.value)||suggest()); el2.value=''; }
      else if(act==='qr'){ push('qr','📱 QR PromptPay', suggest()); }
      else if(act==='card'){ var el3=q('cardamt'),sel=q('cardtype'); push('card','💳 '+(sel.value||'บัตร'), num(el3.value)||suggest()); el3.value=''; q('cardchg').value='0.00'; q('chgnote').style.display='none'; }
      else if(act==='cheque'){ var el4=q('chqamt'); push('cheque','🧾 เช็ค', num(el4.value)||suggest()); el4.value=''; }
      else if(act==='etc'){ var el5=q('etcamt'); push('ar','📋 ลูกหนี้/ผ่อน', num(el5.value)||suggest()); el5.value=''; }
      else if(act==='ok'){ if(o.onConfirm)o.onConfirm(paid.slice()); }
      else if(act==='cancel'){ if(o.onCancel)o.onCancel(); }
    });
    root.addEventListener('input', function(e){ if(e.target.getAttribute('data-act')==='calcin')calc(); });
    root.addEventListener('change', function(e){ if(e.target.getAttribute('data-act')==='calc')calc(); });
    render();
  }

  function renderInto(el, o){ inject(); el.innerHTML=buildHTML(o||{}); wire(el, o||{}); return el; }
  global.swtRenderPayment=renderInto;
  global.swtOpenPayment=function(o){
    inject(); o=o||{};
    var ov=document.createElement('div'); ov.className='pay-overlay';
    var box=document.createElement('div'); box.style.maxWidth='900px'; box.style.width='100%'; ov.appendChild(box);
    document.body.appendChild(ov);
    var origCancel=o.onCancel, origConfirm=o.onConfirm;
    o.onCancel=function(){ ov.remove(); if(origCancel)origCancel(); };
    o.onConfirm=function(p){ ov.remove(); if(origConfirm)origConfirm(p); };
    renderInto(box, o);
    return ov;
  };
})(window);
