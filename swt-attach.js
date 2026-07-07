/* ═══════════════════════════════════════════════════════════════
   swt-attach.js — Document Attachment (Grill M · transaction-level · private)
   เอกสารแนบที่ transaction · version (ไม่ทับ) + audit (ใคร upload/ดู/download) +
   RBAC + signed URL หมดอายุ · ปรับระดับต่อจุดแนบได้ (config)
   API: swtRenderAttach(el, {title, transaction, docs, config:{versioning,audit,rbac}, editable})
     docs = [{name, type, date, by, version, history:[{v,date,by}], sensitivity}]
   ═══════════════════════════════════════════════════════════════ */
(function(global){
  var CSS = `
  .att{font-family:'Inter','Noto Sans Thai',sans-serif;color:#111827;background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;max-width:760px}
  .att-head{display:flex;align-items:center;gap:8px;padding:9px 14px;border-bottom:1px solid #E5E7EB;background:#F8FAFC}
  .att-head .t{font-size:13px;font-weight:700;color:#1E3A5F;flex:1}
  .att-head .pv{font-size:9.5px;font-weight:700;background:#FEF2F2;color:#991B1B;padding:2px 8px;border-radius:8px}
  .att-head .tx{font-size:10.5px;color:#6B7280;font-family:'Inter',monospace}
  .att-body{padding:12px 14px}
  .att-tbl{width:100%;border-collapse:collapse;font-size:12px}
  .att-tbl th{background:#F8FAFC;padding:6px 9px;text-align:left;font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;border-bottom:1px solid #E5E7EB}
  .att-tbl td{padding:6px 9px;border-bottom:1px solid #F3F4F6;vertical-align:middle}
  .att-tag{font-size:9.5px;font-weight:700;padding:1px 7px;border-radius:8px}
  .tg-legal{background:#FEF3C7;color:#92400E}.tg-tax{background:#EFF6FF;color:#1D4ED8}.tg-gen{background:#F3F4F6;color:#6B7280}
  .att-v{font-family:'Inter',monospace;font-weight:700;color:#2563EB;cursor:pointer}
  .att-btn{padding:3px 8px;border:1px solid #D1D5DB;background:#fff;border-radius:5px;font-size:10.5px;font-weight:600;cursor:pointer;font-family:inherit;color:#374151;margin-right:3px}
  .att-btn.view{border-color:#BFDBFE;background:#EFF6FF;color:#2563EB}
  .att-hist{background:#FAFBFC;font-size:11px;color:#6B7280}
  .att-hist td{padding:5px 9px}
  .att-hist .row{display:flex;gap:12px;padding:2px 0}
  .att-drop{margin-top:10px;border:2px dashed #CBD5E1;border-radius:8px;padding:14px;text-align:center;color:#94A3B8;font-size:12px;cursor:pointer;background:#F8FAFC}
  .att-drop:hover{border-color:#2563EB;color:#2563EB;background:#EFF6FF}
  .att-cfg{margin-top:9px;font-size:10.5px;color:#0C4A6E;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:7px 10px;line-height:1.5;display:flex;gap:8px;flex-wrap:wrap}
  .att-cfg .on{color:#065F46;font-weight:700}.att-cfg .off{color:#9CA3AF}
  `;
  var injected=false;
  function inject(){ if(injected)return; var s=document.createElement('style'); s.textContent=CSS; document.head.appendChild(s); injected=true; }
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function typeTag(t){ var m={'สัญญา':'tg-legal','จดทะเบียน':'tg-legal','ภาษี':'tg-tax'}; return '<span class="att-tag '+(m[t]||'tg-gen')+'">'+esc(t||'เอกสาร')+'</span>'; }

  function build(o){
    var cfg=o.config||{versioning:true,audit:true,rbac:true}, docs=o.docs||[];
    var cols='<th>เอกสาร</th><th>ประเภท</th><th>วันที่</th>'+(cfg.versioning?'<th>เวอร์ชัน</th>':'')+(cfg.audit?'<th>โดย</th>':'')+'<th></th>';
    var rows=docs.map(function(d,i){
      return '<tr data-row="'+i+'"><td><b>'+esc(d.name)+'</b></td><td>'+typeTag(d.type)+'</td><td>'+esc(d.date||'')+'</td>'
      +(cfg.versioning?'<td><span class="att-v" data-act="hist" data-i="'+i+'">'+esc(d.version||'v1')+' ▾</span></td>':'')
      +(cfg.audit?'<td>'+esc(d.by||'')+'</td>':'')
      +'<td style="text-align:right"><button class="att-btn view" data-act="view" data-i="'+i+'">👁 ดู</button>'+(cfg.audit?'<button class="att-btn" data-act="audit" data-i="'+i+'">📜 audit</button>':'')+'</td></tr>';
    }).join('');
    return ''
    +'<div class="att">'
    +'<div class="att-head"><span class="t">📎 '+esc(o.title||'เอกสารแนบ')+'</span>'+(o.transaction?'<span class="tx">'+esc(o.transaction)+'</span>':'')+'<span class="pv">🔒 private</span></div>'
    +'<div class="att-body">'
      +'<table class="att-tbl"><thead><tr>'+cols+'</tr></thead><tbody data-el="rows">'+rows+'</tbody></table>'
      +(o.editable!==false?'<div class="att-drop" data-act="upload">📎 ลากไฟล์มาวาง / คลิกเพื่อแนบเอกสาร</div>':'')
      +'<div class="att-cfg">ระดับควบคุม: '
        +'<span class="'+(cfg.versioning?'on':'off')+'">'+(cfg.versioning?'✓':'✕')+' version</span>'
        +'<span class="'+(cfg.audit?'on':'off')+'">'+(cfg.audit?'✓':'✕')+' audit</span>'
        +'<span class="'+(cfg.rbac?'on':'off')+'">'+(cfg.rbac?'✓':'✕')+' RBAC</span>'
        +'<span class="on">✓ signed URL หมดอายุ</span>'
        +'<span style="color:#6B7280">· ปรับได้ต่อจุดแนบ (สัญญา/ภาษี=ครบ · รูปหลักฐาน=เบา)</span></div>'
    +'</div></div>';
  }

  function wire(root, o){
    var cfg=o.config||{}, docs=o.docs||[];
    root.addEventListener('click', function(e){
      var b=e.target.closest('[data-act]'); if(!b)return;
      var act=b.getAttribute('data-act'), i=+b.getAttribute('data-i'), d=docs[i];
      if(act==='view'){ alert('เปิด "'+d.name+'" ผ่าน signed URL (SAS token · หมดอายุ 15 นาที)\n→ เช็ค RBAC ก่อนออก token · log การเปิดใน audit'); }
      else if(act==='audit'){ alert('📜 Audit "'+d.name+'":\n• upload โดย '+(d.by||'-')+' · '+(d.date||'-')+'\n• ดูล่าสุด: คุณสมชาย · 2 ชม.ที่แล้ว\n• download: 3 ครั้ง (trace ครบ)'); }
      else if(act==='hist'){
        var tr=b.closest('tr'), nx=tr.nextElementSibling;
        if(nx && nx.classList.contains('att-hist')){ nx.remove(); return; }
        var h=(d.history||[{v:d.version||'v1',date:d.date,by:d.by}]);
        var cells=(root.querySelector('thead tr').children.length);
        var html='<tr class="att-hist"><td colspan="'+cells+'"><b>ประวัติเวอร์ชัน (ไม่ทับของเก่า):</b>'+h.map(function(x){return '<div class="row"><span class="att-v">'+esc(x.v)+'</span><span>'+esc(x.date||'')+'</span><span>โดย '+esc(x.by||'')+'</span><span class="att-btn view" data-act="viewold">👁 ดูเวอร์ชันนี้</span></div>';}).join('')+'</td></tr>';
        tr.insertAdjacentHTML('afterend', html);
      }
      else if(act==='viewold'){ alert('ดูเวอร์ชันเก่า (signed URL) — v เก่ายังเก็บไว้ ไม่ถูกทับ'); }
      else if(act==='upload'){ alert('แนบเอกสาร (mock):\n• อัปไป private bucket (Azure Blob)\n• ถ้ามีชื่อซ้ำ → สร้าง version ใหม่ (ไม่ทับ)\n• บันทึก reference + audit (ใคร/เมื่อไหร่)'); }
    });
  }

  global.swtRenderAttach=function(el,o){ inject(); o=o||{}; el.innerHTML=build(o); wire(el.firstElementChild, o); return el; };
})(window);
