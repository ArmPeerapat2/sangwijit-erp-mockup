/* ═══════════════════════════════════════════════════════════════
   swt-gallery.js — Product Media Gallery (Grill M · master-level · public CDN)
   รูป/วิดีโอสินค้า · หลายรูป+รูปหลัก+จัดลำดับ + วิดีโอ (อัป+poster / ฝัง YouTube)
   public CDN URL คงที่ · gen หลายขนาด · API คืน array URL → เว็บ/e-commerce reuse
   API: swtRenderGallery(el, {title, images:[{url,alt,main}], videos:[{label,kind}], editable})
   ═══════════════════════════════════════════════════════════════ */
(function(global){
  var CSS = `
  .gal{font-family:'Inter','Noto Sans Thai',sans-serif;color:#111827;background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;max-width:760px}
  .gal-head{display:flex;align-items:center;gap:8px;padding:9px 14px;border-bottom:1px solid #E5E7EB;background:#F8FAFC}
  .gal-head .t{font-size:13px;font-weight:700;color:#1E3A5F;flex:1}
  .gal-head .pub{font-size:9.5px;font-weight:700;background:#ECFDF5;color:#065F46;padding:2px 8px;border-radius:8px}
  .gal-body{display:grid;grid-template-columns:1fr 150px;gap:12px;padding:14px}
  .gal-main{aspect-ratio:4/3;border-radius:10px;border:1px solid #E5E7EB;position:relative;display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;font-weight:700;overflow:hidden;background-size:cover}
  .gal-main .badge{position:absolute;top:8px;left:8px;background:#F59E0B;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px}
  .gal-thumbs{display:flex;flex-direction:column;gap:7px;max-height:280px;overflow-y:auto}
  .gal-th{aspect-ratio:1;border-radius:7px;border:2px solid transparent;cursor:pointer;position:relative;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;background-size:cover}
  .gal-th.sel{border-color:#2563EB}
  .gal-th .m{position:absolute;top:2px;right:2px;font-size:11px}
  .gal-th .del{position:absolute;top:2px;left:2px;background:rgba(0,0,0,.5);color:#fff;border-radius:50%;width:16px;height:16px;font-size:10px;display:none;align-items:center;justify-content:center;cursor:pointer}
  .gal-th:hover .del{display:flex}
  .gal-add{aspect-ratio:1;border:2px dashed #CBD5E1;border-radius:7px;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-size:22px;cursor:pointer;background:#F8FAFC}
  .gal-add:hover{border-color:#2563EB;color:#2563EB;background:#EFF6FF}
  .gal-tools{grid-column:1/-1;display:flex;gap:8px;align-items:center;flex-wrap:wrap;border-top:1px solid #F3F4F6;padding-top:10px}
  .gal-btn{padding:5px 11px;border:1px solid #D1D5DB;background:#fff;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit;color:#374151}
  .gal-btn.pri{background:#2563EB;color:#fff;border-color:#2563EB}
  .gal-videos{grid-column:1/-1;border-top:1px solid #F3F4F6;padding-top:10px}
  .gal-vh{font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;margin-bottom:6px}
  .gal-vids{display:flex;gap:8px;flex-wrap:wrap}
  .gal-vid{width:150px;height:88px;border-radius:8px;background:#0F172A;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;position:relative;cursor:pointer}
  .gal-vid .play{font-size:24px}.gal-vid .lb{font-size:10px;margin-top:2px;opacity:.85}
  .gal-vid .kind{position:absolute;top:4px;right:4px;font-size:8.5px;font-weight:700;background:rgba(255,255,255,.2);padding:1px 5px;border-radius:6px}
  .gal-note{grid-column:1/-1;font-size:10.5px;color:#0C4A6E;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:7px 10px;line-height:1.5}
  `;
  var injected=false;
  function inject(){ if(injected)return; var s=document.createElement('style'); s.textContent=CSS; document.head.appendChild(s); injected=true; }
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  var GRAD=['#2563EB','#7C3AED','#059669','#DC2626','#D97706','#0891B2','#DB2777','#475569'];
  function bg(i){return 'linear-gradient(135deg,'+GRAD[i%GRAD.length]+','+GRAD[(i+3)%GRAD.length]+')';}

  function build(o){
    var imgs=o.images||[], vids=o.videos||[];
    var mainIdx=Math.max(0,imgs.findIndex(function(x){return x.main;}));
    var thumbs=imgs.map(function(im,i){return '<div class="gal-th'+(i===mainIdx?' sel':'')+'" data-act="pick" data-i="'+i+'" style="background:'+bg(i)+'">'+esc(im.alt||('รูป '+(i+1)))+(im.main?'<span class="m">⭐</span>':'')+(o.editable!==false?'<span class="del" data-act="del" data-i="'+i+'">✕</span>':'')+'</div>';}).join('');
    var vidhtml=vids.map(function(v,i){return '<div class="gal-vid" data-act="playvid" data-i="'+i+'">'+(v.kind?'<span class="kind">'+esc(v.kind)+'</span>':'')+'<span class="play">▶</span><span class="lb">'+esc(v.label||('วิดีโอ '+(i+1)))+'</span></div>';}).join('');
    return ''
    +'<div class="gal">'
    +'<div class="gal-head"><span class="t">🖼️ '+esc(o.title||'รูปสินค้า')+'</span><span class="pub">🌐 public CDN</span></div>'
    +'<div class="gal-body">'
      +'<div class="gal-main" data-el="main" style="background:'+bg(mainIdx)+'"><span class="badge">รูปหลัก</span><span data-el="mainlabel">'+esc((imgs[mainIdx]||{}).alt||'รูปหลัก')+'</span></div>'
      +'<div class="gal-thumbs" data-el="thumbs">'+thumbs+(o.editable!==false?'<div class="gal-add" data-act="add">+</div>':'')+'</div>'
      +'<div class="gal-tools">'+(o.editable!==false?'<button class="gal-btn pri" data-act="setmain">⭐ ตั้งเป็นรูปหลัก</button><button class="gal-btn" data-act="up">↑ เลื่อนขึ้น</button><button class="gal-btn" data-act="down">↓ เลื่อนลง</button>':'')+'<span style="flex:1"></span><button class="gal-btn" data-act="apilink">🔗 ดู API URL</button></div>'
      +'<div class="gal-videos"><div class="gal-vh">🎬 วิดีโอ</div><div class="gal-vids" data-el="vids">'+vidhtml+(o.editable!==false?'<div class="gal-vid" data-act="addvid" style="background:#F8FAFC;color:#94A3B8;border:2px dashed #CBD5E1"><span class="play">＋</span><span class="lb">อัป / ฝัง YouTube</span></div>':'')+'</div></div>'
      +'<div class="gal-note">🌐 URL คงที่ต่อ item (<code>cdn/products/'+esc(o.entityId||'{item}')+'/n.jpg</code>) · gen thumb/medium/full ตอน upload · <b>API สินค้าคืน array URL → เว็บ/e-commerce ดึงตรง</b> ไม่ผ่าน ERP</div>'
    +'</div></div>';
  }

  function wire(root, o){
    var imgs=(o.images||[]).slice(), sel=Math.max(0,imgs.findIndex(function(x){return x.main;}));
    function q(k){return root.querySelector('[data-el="'+k+'"]');}
    function reMain(){ var m=q('main'); m.style.background=bg(sel); q('mainlabel').textContent=(imgs[sel]||{}).alt||('รูป '+(sel+1)); }
    function reThumbs(){
      var t=q('thumbs'); var add=t.querySelector('.gal-add');
      t.querySelectorAll('.gal-th').forEach(function(n){n.remove();});
      var html=imgs.map(function(im,i){return '<div class="gal-th'+(i===sel?' sel':'')+'" data-act="pick" data-i="'+i+'" style="background:'+bg(i)+'">'+esc(im.alt||('รูป '+(i+1)))+(im.main?'<span class="m">⭐</span>':'')+(o.editable!==false?'<span class="del" data-act="del" data-i="'+i+'">✕</span>':'')+'</div>';}).join('');
      t.insertAdjacentHTML('afterbegin', html);
    }
    root.addEventListener('click', function(e){
      var b=e.target.closest('[data-act]'); if(!b)return;
      var act=b.getAttribute('data-act');
      if(act==='pick'){ sel=+b.getAttribute('data-i'); reThumbs(); reMain(); }
      else if(act==='del'){ e.stopPropagation(); imgs.splice(+b.getAttribute('data-i'),1); if(sel>=imgs.length)sel=Math.max(0,imgs.length-1); reThumbs(); reMain(); }
      else if(act==='setmain'){ imgs.forEach(function(x,i){x.main=(i===sel);}); reThumbs(); reMain(); }
      else if(act==='up'&&sel>0){ var t=imgs[sel];imgs[sel]=imgs[sel-1];imgs[sel-1]=t;sel--;reThumbs();reMain(); }
      else if(act==='down'&&sel<imgs.length-1){ var t2=imgs[sel];imgs[sel]=imgs[sel+1];imgs[sel+1]=t2;sel++;reThumbs();reMain(); }
      else if(act==='add'){ imgs.push({alt:'รูป '+(imgs.length+1)}); reThumbs(); }
      else if(act==='addvid'){ alert('อัปวิดีโอ (mock) หรือวาง YouTube URL → เก็บลิงก์ + poster'); }
      else if(act==='playvid'){ alert('เล่นวิดีโอ (mock)'); }
      else if(act==='apilink'){ alert('API GET /items/'+(o.entityId||'{item}')+'/media →\n{ images:[{url,thumb,main,order}], videos:[{url,poster,kind}] }\nเว็บ/e-commerce ดึง array นี้ render ตรงจาก CDN'); }
    });
  }

  global.swtRenderGallery=function(el,o){ inject(); o=o||{}; el.innerHTML=build(o); wire(el.firstElementChild, o); return el; };
})(window);
