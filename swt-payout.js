/* ═══════════════════════════════════════════════════════════════
   swt-payout.js — Shared Component "จ่ายชำระเงิน" (SC-3P ฝั่งจ่าย)
   mirror swt-payment.js (ฝั่งรับ) · split payment (Total/Remain)
   ฝั่งจ่ายเจ้าหนี้: โอนออก / เงินสด / เช็คจ่าย (+ทะเบียนเช็ค 7.1.2 ฝังในจอ)
   API:
     swtRenderPayout(el, opts)  → render ลง element
     swtOpenPayout(opts)        → เปิดเป็น modal
   opts = { total, ref, accounts:[str], chequeBooks:[str], onConfirm(paid[]), onCancel }
   paid[] = [{method:'transfer|cash|cheque', label, amount, meta:{}}]
   ═══════════════════════════════════════════════════════════════ */
(function(global){
  var CSS = `
  .pay{background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;max-width:900px;font-family:'Inter','Noto Sans Thai',sans-serif;color:#111827}
  .pay-head{background:linear-gradient(90deg,#1E3A5F,#2563EB);color:#fff;padding:10px 16px;display:flex;align-items:center;gap:10px}
  .pay-head.pyo{background:linear-gradient(90deg,#7C2D12,#B45309)}
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
  .pm-transfer.chq{background:#FFFBEB;border-color:#FDE68A}
  .pm-transfer .tt{font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase}
  .pm-mini{display:grid;grid-template-columns:100px 1fr;gap:6px 8px;align-items:center;font-size:12px}
  .pm-mini label{color:#6B7280;font-weight:500}
  .pm-mini input,.pm-mini select{padding:5px 8px;border:1px solid #D1D5DB;border-radius:5px;font-size:12px;font-family:inherit;width:100%}
  .pay-foot{border-top:1px solid #E5E7EB;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .paid-list{flex:1;display:flex;gap:6px;flex-wrap:wrap;min-height:26px;align-items:center}
  .paid-chip{display:inline-flex;align-items:center;gap:6px;background:#FEF3C7;color:#92400E;border:1px solid #FDE68A;border-radius:16px;padding:3px 6px 3px 10px;font-size:11.5px;font-weight:600}
  .paid-chip .x{cursor:pointer;background:#92400E;color:#fff;border-radius:50%;width:15px;height:15px;display:flex;align-items:center;justify-content:center;font-size:10px}
  .paid-empty{font-size:12px;color:#9CA3AF}
  .pay-btn{padding:9px 20px;border:none;border-radius:7px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit}
  .pay-btn.ok{background:#B45309;color:#fff}.pay-btn.ok:disabled{background:#D1D5DB;color:#9CA3AF;cursor:not-allowed}
  .pay-btn.cancel{background:#fff;color:#6B7280;border:1px solid #D1D5DB}
  .pay-overlay{position:fixed;inset:0;background:rgba(15,23,42,.45);display:flex;align-items:flex-start;justify-content:center;padding:48px 16px;z-index:9998;overflow-y:auto}
  `;
  var injected=false;
  function inject(){ if(injected)return; var s=document.createElement('style'); s.textContent=CSS; document.head.appendChild(s); injected=true; }
  function fmt(n){return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
  function num(v){var n=parseFloat(String(v).replace(/,/g,''));return isNaN(n)?0:n;}
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function buildHTML(o){
    var accs=(o.accounts||['BBL · 123-4-56789-0 (SWT หลัก)','KBANK · 098-7-65432-1']).map(function(a){return '<option>'+esc(a)+'</option>';}).join('');
    var books=(o.chequeBooks||['BBL สมุดเช็ค · 123-4-56789-0','KBANK สมุดเช็ค · 098-7-65432-1']).map(function(a){return '<option>'+esc(a)+'</option>';}).join('');
    var total=o.total||0;
    return ''
    +'<div class="pay">'
    +'<div class="pay-head pyo"><span class="ico">💳</span><h2>จ่ายชำระเงิน (เจ้าหนี้)</h2><span class="ref">'+esc(o.ref||'')+'</span></div>'
    +'<div class="pay-body">'
    +'<div class="pay-tot">'
      +'<div class="box"><div class="lbl">ยอดที่ต้องจ่าย (Total)</div><div class="amt" data-el="total">'+fmt(total)+'</div></div>'
      +'<div class="box remain" data-el="remainbox"><div class="lbl">คงเหลือ (Remain)</div><div class="amt" data-el="remain">'+fmt(total)+'</div></div>'
    +'</div>'
    +'<div class="pay-methods">'
      // เงินสด
      +'<div class="pm-row"><div class="plbl">💵 เงินสด</div><input class="pm-in" data-el="cash" placeholder="0.00" inputmode="decimal"><button class="pm-add" data-act="cash" title="เพิ่ม">+</button></div>'
      +'<div class="pm-row" style="margin-top:-4px"><div class="plbl" style="font-weight:400;color:#9CA3AF">↳ หมายเหตุ</div><input class="pm-in" data-el="cashnote" style="text-align:left;font-weight:400" placeholder="เช่น เบิกเงินสดค่าอุปกรณ์ศูนย์บริการ"></div>'
      // โอนออก
      +'<div class="pm-transfer"><div class="tt">🏦 โอนออกจากบัญชีบริษัท</div><div class="pm-mini">'
        +'<label>บัญชีจ่ายออก</label><select data-el="tfacc">'+accs+'</select>'
        +'<label>เลขอ้างอิง/สลิป</label><input data-el="tfref" style="text-align:left" placeholder="เลขสลิปโอน">'
        +'<label>จำนวนเงิน</label><div style="display:flex;gap:6px"><input data-el="tfamt" placeholder="0.00" inputmode="decimal" style="text-align:right;font-weight:600"><button class="pm-add" data-act="transfer">+</button></div>'
      +'</div></div>'
      // เช็คจ่าย (ทะเบียนเช็ค 7.1.2)
      +'<div class="pm-transfer chq"><div class="tt">🧾 เช็คจ่าย · ลงทะเบียนเช็ค (7.1.2)</div><div class="pm-mini">'
        +'<label>เลขที่เช็ค</label><input data-el="chqno" style="text-align:left" placeholder="เช่น 70328945">'
        +'<label>สมุดเช็ค · บัญชีตัดเช็ค</label><select data-el="chqbook">'+books+'</select>'
        +'<label>ลงวันที่</label><input data-el="chqdate" style="text-align:left" placeholder="วว/ดด/ปป" value="02/06/69">'
        +'<label>วันครบกำหนด</label><input data-el="chqdue" style="text-align:left" placeholder="วว/ดด/ปป">'
        +'<label>สถานะเช็ค</label><select data-el="chqstat"><option>⏳ ยังไม่ขึ้นเงิน (สั่งจ่ายล่วงหน้า)</option><option>✅ ขึ้นเงินแล้ว</option></select>'
        +'<label>มูลค่าเช็ค</label><div style="display:flex;gap:6px"><input data-el="chqamt" placeholder="0.00" inputmode="decimal" style="text-align:right;font-weight:600"><button class="pm-add" data-act="cheque">+</button></div>'
      +'</div></div>'
    +'</div></div>'
    +'<div class="pay-foot"><div class="paid-list" data-el="paidlist"><span class="paid-empty">ยังไม่มีการจ่าย — เพิ่มวิธีจ่ายจนคงเหลือ = 0</span></div>'
    +'<button class="pay-btn cancel" data-act="cancel">ยกเลิก</button><button class="pay-btn ok" data-act="ok" disabled>✓ ยืนยันการจ่าย</button></div>'
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
      if(!paid.length) pl.innerHTML='<span class="paid-empty">ยังไม่มีการจ่าย — เพิ่มวิธีจ่ายจนคงเหลือ = 0</span>';
      else pl.innerHTML=paid.map(function(p,i){return '<span class="paid-chip">'+esc(p.label)+' '+fmt(p.amount)+' <span class="x" data-act="del" data-i="'+i+'">✕</span></span>';}).join('');
      if(over) pl.innerHTML+='<span class="paid-empty" style="color:#DC2626">⚠ เกินยอด '+fmt(s-total)+'</span>';
      root.querySelector('[data-act="ok"]').disabled=!(remain<0.005 && paid.length>0 && !over);
    }
    function push(m,l,a,meta){ if(a>0){paid.push({method:m,label:l,amount:a,meta:meta||{}});render();} }
    root.addEventListener('click', function(e){
      var b=e.target.closest('[data-act]'); if(!b||!root.contains(b))return;
      var act=b.getAttribute('data-act');
      if(act==='del'){ paid.splice(+b.getAttribute('data-i'),1); render(); return; }
      if(act==='cash'){ var el=q('cash'); push('cash','💵 เงินสด', num(el.value)||suggest(), {note:q('cashnote').value}); el.value=''; }
      else if(act==='transfer'){ var a=q('tfamt'); push('transfer','🏦 โอน '+(q('tfacc').value.split('·')[0].trim()), num(a.value)||suggest(), {acc:q('tfacc').value,ref:q('tfref').value}); a.value=''; q('tfref').value=''; }
      else if(act==='cheque'){ var c=q('chqamt'),no=q('chqno').value||'(ไม่ระบุเลข)'; push('cheque','🧾 เช็ค '+no+(q('chqdue').value?' ครบ '+q('chqdue').value:''), num(c.value)||suggest(), {no:q('chqno').value,book:q('chqbook').value,date:q('chqdate').value,due:q('chqdue').value,status:q('chqstat').value}); c.value=''; q('chqno').value=''; q('chqdue').value=''; }
      else if(act==='ok'){ if(o.onConfirm)o.onConfirm(paid.slice()); }
      else if(act==='cancel'){ if(o.onCancel)o.onCancel(); }
    });
    render();
  }

  function renderInto(el, o){ inject(); el.innerHTML=buildHTML(o||{}); wire(el, o||{}); return el; }
  global.swtRenderPayout=renderInto;
  global.swtOpenPayout=function(o){
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
