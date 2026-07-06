/* ═══════════════════════════════════════════════════════════════
   swt-master-editor.js — Shared "Master Editor" (list-detail · schema-driven)
   Grill A / A2 (2026-07-06): พอร์ทัลถือเฉพาะ UI master (บัตร+%ชาร์จ · สถานะสี ·
   เหตุผลปรับสต็อก WH-5 · doc template) · ทุกตัวหน้าตาเดียว = list ซ้าย + ฟอร์มขวา
   API: swtRenderMasterEditor(el, {title, columns, fields, data, onSave, onDelete})
     columns = [{key,label,width?,render?(row)->html}]
     fields  = [{key,label,type('text'|'number'|'select'|'color'|'toggle'), options?, suffix?, width?}]
     data    = [ {รหัส/ชื่อ.../key:value} ]   (toggle key เก็บ true/false)
   state ต่อ instance (closure) · wire ผ่าน data-act · CSS inject เอง
   ═══════════════════════════════════════════════════════════════ */
(function(global){
  var CSS = `
  .me{display:grid;grid-template-columns:1fr 340px;gap:14px;font-family:'Inter','Noto Sans Thai',sans-serif;color:#111827}
  .me-panel{background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;display:flex;flex-direction:column}
  .me-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #E5E7EB;background:#F8FAFC}
  .me-head .me-title{font-size:13px;font-weight:700;color:#1E3A5F;flex:1}
  .me-search{padding:5px 9px;border:1px solid #D1D5DB;border-radius:6px;font-size:12px;font-family:inherit;width:150px}
  .me-list-wrap{overflow-y:auto;max-height:460px}
  .me-tbl{width:100%;border-collapse:collapse;font-size:12.5px}
  .me-tbl th{position:sticky;top:0;background:#F8FAFC;padding:7px 10px;text-align:left;font-size:10.5px;font-weight:600;color:#6B7280;text-transform:uppercase;border-bottom:1px solid #E5E7EB;white-space:nowrap}
  .me-tbl td{padding:6px 10px;border-bottom:1px solid #F3F4F6;cursor:pointer}
  .me-tbl tr:hover td{background:#FAFBFC}
  .me-tbl tr.sel td{background:#EFF6FF}
  .me-tbl .me-code{font-family:'Inter',monospace;font-weight:700;color:#2563EB}
  .me-off{opacity:.45}
  .me-badge{display:inline-block;font-size:9.5px;font-weight:700;padding:1px 6px;border-radius:8px}
  .me-badge.on{background:#ECFDF5;color:#065F46}.me-badge.off{background:#F3F4F6;color:#9CA3AF}
  .me-add{padding:9px 12px;border-top:1px dashed #E5E7EB;color:#2563EB;font-size:12px;font-weight:600;cursor:pointer;background:#FAFBFC}
  .me-add:hover{background:#EFF6FF}
  .me-form{padding:14px}
  .me-form .me-fh{font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px}
  .me-fld{display:flex;flex-direction:column;gap:3px;margin-bottom:10px}
  .me-fld label{font-size:11px;color:#6B7280;font-weight:600}
  .me-fld input,.me-fld select{padding:7px 9px;border:1px solid #D1D5DB;border-radius:6px;font-size:12.5px;font-family:inherit}
  .me-fld input:focus,.me-fld select:focus{outline:none;border-color:#2563EB}
  .me-fld .me-suffix{position:relative}
  .me-fld .me-suffix span{position:absolute;right:9px;top:8px;font-size:11px;color:#9CA3AF}
  .me-colors{display:flex;gap:6px;flex-wrap:wrap}
  .me-colors label{width:24px;height:24px;border-radius:6px;cursor:pointer;border:2px solid transparent;display:block}
  .me-colors label.sel{border-color:#111827}
  .me-colors input{display:none}
  .me-facts{display:flex;gap:8px;margin-top:6px}
  .me-btn{flex:1;padding:8px;border:none;border-radius:6px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit}
  .me-btn.save{background:#2563EB;color:#fff}.me-btn.del{background:#fff;color:#DC2626;border:1px solid #FCA5A5;flex:0 0 90px}
  .me-empty{color:#9CA3AF;font-size:12px;text-align:center;padding:30px 10px}
  .me-bc{font-size:11px;color:#0C4A6E;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:7px 10px;margin-top:10px;line-height:1.5}
  `;
  var injected=false;
  function inject(){ if(injected)return; var s=document.createElement('style'); s.textContent=CSS; document.head.appendChild(s); injected=true; }
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  var PALETTE=['#10B981','#F59E0B','#EF4444','#2563EB','#8B5CF6','#6B7280','#EC4899','#14B8A6'];

  function buildHTML(o){
    var cols=o.columns||[];
    var ths=cols.map(function(c){return '<th'+(c.width?' style="width:'+c.width+'"':'')+'>'+esc(c.label)+'</th>';}).join('')+'<th style="width:54px">ใช้</th>';
    return ''
    +'<div class="me">'
    +'<div class="me-panel">'
      +'<div class="me-head"><span class="me-title">'+esc(o.title||'Master')+'</span><input class="me-search" data-el="search" placeholder="ค้นหา…"></div>'
      +'<div class="me-list-wrap"><table class="me-tbl"><thead><tr>'+ths+'</tr></thead><tbody data-el="rows"></tbody></table></div>'
      +'<div class="me-add" data-act="new">➕ เพิ่มรายการใหม่</div>'
    +'</div>'
    +'<div class="me-panel"><div class="me-form" data-el="form"></div></div>'
    +'</div>';
  }

  function wire(root, o){
    var cols=o.columns||[], fields=o.fields||[], data=(o.data||[]).slice(), sel=-1, filter='';
    function q(k){return root.querySelector('[data-el="'+k+'"]');}
    function cellVal(row,c){ if(c.render)return c.render(row); return esc(row[c.key]); }
    function renderList(){
      var rows=q('rows'); var html='';
      data.forEach(function(row,i){
        if(filter){ var hay=(cols.map(function(c){return row[c.key];}).join(' ')).toLowerCase(); if(hay.indexOf(filter)<0)return; }
        var on=row.active!==false;
        html+='<tr class="'+(i===sel?'sel':'')+(on?'':' me-off')+'" data-act="pick" data-i="'+i+'">'
          + cols.map(function(c,ci){return '<td'+(ci===0?' class="me-code"':'')+'>'+cellVal(row,c)+'</td>';}).join('')
          + '<td><span class="me-badge '+(on?'on':'off')+'">'+(on?'ใช้':'ปิด')+'</span></td></tr>';
      });
      rows.innerHTML=html||'<tr><td colspan="'+(cols.length+1)+'" class="me-empty">— ไม่มีรายการ —</td></tr>';
    }
    function renderForm(){
      var f=q('form');
      if(sel<0 && !root._newMode){ f.innerHTML='<div class="me-empty">เลือกรายการซ้าย<br>หรือกด ➕ เพิ่มใหม่</div>'; return; }
      var row=(sel>=0)?data[sel]:{active:true};
      var h='<div class="me-fh">'+(sel>=0?'✏️ แก้ไขรายการ':'➕ รายการใหม่')+'</div>';
      fields.forEach(function(fl){
        var v=row[fl.key];
        h+='<div class="me-fld"><label>'+esc(fl.label)+'</label>';
        if(fl.type==='select'){
          h+='<select data-f="'+fl.key+'">'+(fl.options||[]).map(function(op){var val=op.value!=null?op.value:op; var lb=op.label!=null?op.label:op; return '<option value="'+esc(val)+'"'+(String(v)===String(val)?' selected':'')+'>'+esc(lb)+'</option>';}).join('')+'</select>';
        } else if(fl.type==='toggle'){
          h+='<select data-f="'+fl.key+'"><option value="1"'+(v!==false?' selected':'')+'>🟢 ใช้งาน</option><option value="0"'+(v===false?' selected':'')+'>⚪ ปิด</option></select>';
        } else if(fl.type==='color'){
          h+='<div class="me-colors">'+PALETTE.map(function(c){return '<label class="'+(v===c?'sel':'')+'" style="background:'+c+'"><input type="radio" name="mecolor" data-f="'+fl.key+'" value="'+c+'"'+(v===c?' checked':'')+'></label>';}).join('')+'</div>';
        } else if(fl.suffix){
          h+='<div class="me-suffix"><input data-f="'+fl.key+'" value="'+esc(v)+'" inputmode="'+(fl.type==='number'?'decimal':'text')+'" style="text-align:right;width:100%"><span>'+esc(fl.suffix)+'</span></div>';
        } else {
          h+='<input data-f="'+fl.key+'" value="'+esc(v)+'"'+(fl.type==='number'?' inputmode="decimal" style="text-align:right"':'')+'>';
        }
        h+='</div>';
      });
      h+='<div class="me-facts"><button class="me-btn save" data-act="save">💾 บันทึก</button>'+(sel>=0?'<button class="me-btn del" data-act="del">🗑 ลบ</button>':'')+'</div>';
      if(o.bcNote) h+='<div class="me-bc">🔒 '+esc(o.bcNote)+'</div>';
      f.innerHTML=h;
    }
    function readForm(){
      var row={}; root.querySelectorAll('[data-f]').forEach(function(el){
        if(el.type==='radio'){ if(el.checked)row[el.getAttribute('data-f')]=el.value; }
        else row[el.getAttribute('data-f')]=el.value;
      });
      if('active' in row || fields.some(function(f){return f.key==='active';})) row.active=(row.active!=='0');
      return row;
    }
    root.addEventListener('click',function(e){
      var b=e.target.closest('[data-act]'); if(!b||!root.contains(b))return;
      var act=b.getAttribute('data-act');
      if(act==='pick'){ sel=+b.getAttribute('data-i'); root._newMode=false; renderList(); renderForm(); }
      else if(act==='new'){ sel=-1; root._newMode=true; renderList(); renderForm(); }
      else if(act==='save'){ var r=readForm(); if(sel>=0){ data[sel]=Object.assign({},data[sel],r);} else { data.push(r); sel=data.length-1; } root._newMode=false; renderList(); renderForm(); if(o.onSave)o.onSave(data.slice()); }
      else if(act==='del'){ if(sel>=0){ data.splice(sel,1); sel=-1; renderList(); renderForm(); if(o.onDelete)o.onDelete(data.slice()); } }
    });
    q('search').addEventListener('input',function(e){ filter=e.target.value.trim().toLowerCase(); renderList(); });
    renderList(); renderForm();
  }

  global.swtRenderMasterEditor=function(el,o){
    inject(); o=o||{};
    el.innerHTML=buildHTML(o);
    wire(el.firstElementChild, o);  /* wire ลง .me (fresh ทุก render) — re-render = element ใหม่ · listener เก่าตายไปกับ DOM เดิม (กัน listener ซ้อน) */
    return el;
  };
})(window);
