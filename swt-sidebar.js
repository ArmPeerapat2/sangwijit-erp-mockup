/* ════════════════════════════════════════════════════════════════
   swt-sidebar.js — Shared Unified Sidebar (canonical · single source)
   ใช้:  <script src="swt-sidebar.js"></script>  (ลบ inline <aside class="swt-sb"> + CSS .swt-sb ออก)
   self-contained: inject CSS + markup เอง
   - auto-active: ตรวจชื่อไฟล์ปัจจุบัน → ใส่ swt-active + เปิด group ของมัน
   - ติดดาว ✦: เพิ่มชื่อไฟล์ใน DONE[] ที่เดียว → ขึ้นทุกหน้าอัตโนมัติ
   - .main{margin-left:240px} ยังอยู่ในแต่ละหน้า (layout offset)
   ════════════════════════════════════════════════════════════════ */
(function(){
  /* ✦ หน้าที่ build/rebuild เสร็จตาม Form Build Pattern — แก้ที่นี่ที่เดียว */
  var DONE = [
    'slq-sales-queue-mockup.html','sl1-quotation-mockup.html','sl2-reservation-mockup.html',
    'sl3-deposit-mockup.html','sl4-invoice-mockup.html','slcn-credit-memo-mockup.html',
    'po1-purchase-request-mockup.html','po4-purchase-order-mockup.html','sc3-vendor-search-mockup.html',
    'wh1-grn-mockup.html'
  ];

  /* nav data — canonical (เปลี่ยนเมนูที่นี่ที่เดียว) */
  var GROUPS = [
    {ico:'🏠', label:'Overview', links:[
      ['IDX','index.html','Master Index'],['PMI','portal-mockup-index.html','Portal Mockup Index'],
      ['ARCH','sangwijit-portal-architecture.html','Architecture'],['SPEC','dev-handoff-spec.html','Dev Handoff']]},
    {ico:'💼', label:'งานขาย (SL)', links:[
      ['SL-Q','slq-sales-queue-mockup.html','คิวงานขาย'],['SL-1','sl1-quotation-mockup.html','ใบเสนอราคา'],
      ['SL-2','sl2-reservation-mockup.html','ใบจอง'],['SL-3','sl3-deposit-mockup.html','ใบมัดจำ'],
      ['SL-4','sl4-invoice-mockup.html','บิลขาย/Invoice'],['SL-CN','slcn-credit-memo-mockup.html','ใบลดหนี้'],
      ['SL-5','sl5-crm-followup-mockup.html','CRM Follow-up'],['SL-6','sl6-promotion-setup-mockup.html','โปรโมชั่น'],
      ['SL-7','sl7-sales-report-mockup.html','รายงานยอดขาย'],['SL-F1','slf1-credit-approval-mockup.html','อนุมัติวงเงิน'],
      ['PM-5','pm5-vat-simulator-mockup.html','VAT Simulator'],['CM-1','cm1-commission-mockup.html','Commission'],
      ['CL-1','cl1-claims-mockup.html','Claims']]},
    {ico:'📦', label:'คลังสินค้า (WH)', links:[
      ['WH-Q','wh-queue-mockup.html','Dashboard'],['WH-1','wh1-grn-mockup.html','ใบรับสินค้า (GRN)'],
      ['WH-2','wh2-stock-transfer-mockup.html','คิวโอนย้ายสต็อก'],['WH-3','wh3-sales-issue-mockup.html','คิวเบิกสินค้า'],
      ['WH-4','wh4-stock-count-mockup.html','คิวนับสต็อก'],['WH-R','wh-r-stock-card-mockup.html','Stock Card'],
      ['WH-NM','wh-nm-non-move-report-mockup.html','สินค้าไม่เคลื่อนไหว']]},
    {ico:'🛒', label:'จัดซื้อ (PO)', links:[
      ['PO-Q','poq-purchase-queue-mockup.html','Purchase Queue'],['PO-1','po1-purchase-request-mockup.html','ใบขอสั่งซื้อ (PR)'],
      ['PO-2','po2-rfq-mockup.html','Trade Agreement / Vendor'],['PO-3','po3-vendor-onboarding-mockup.html','Vendor Onboarding'],
      ['PO-4','po4-purchase-order-mockup.html','ใบสั่งซื้อ (PO)'],['PO-5','po5-finance-grn-mockup.html','Finance GRN'],
      ['PO-6','po6-ap-invoice-mockup.html','ใบวางบิล Vendor'],['PO-7','po7-rebate-dashboard.html','Rebate Dashboard'],
      ['PO-8','po8-deposit-bill-mockup.html','บิลฝาก (Deposit)']]},
    {ico:'💵', label:'บัญชี/การเงิน', links:[
      ['FI-Q','fiq-finance-queue-mockup.html','คิวงานการเงิน'],['FI-1','fi1-ar-receive-mockup.html','รับชำระ AR'],
      ['FI-1Q','fi1q-apply-queue-mockup.html','Apply Queue'],['FI-2','fi2-ap-payment-mockup.html','จ่ายชำระ AP'],
      ['FI-3','fi3-bank-reconciliation-mockup.html','กระทบยอดธนาคาร'],['FI-7','fi7-vat-report-mockup.html','รายงานภาษีขาย/ซื้อ'],
      ['FI-12','fi12-wht-mockup.html','WHT (ภ.ง.ด.3/53)'],['FI-4','fi4-expense-wht-mockup.html','ค่าใช้จ่าย/WHT'],
      ['FI-5','fi5-ar-audit-mockup.html','ตรวจสอบ AR'],['FI-13','fi13-dual-book-mockup.html','Dual-Book/Entity Tag'],
      ['TR-1','tr1-treasury-mockup.html','Treasury']]},
    {ico:'🔗', label:'Integration (IA)', links:[
      ['IA-Q','iaq-bc-sync-monitor-mockup.html','BC Sync Monitor']]},
    {ico:'🔧', label:'บริการ (SV)', links:[
      ['SV-Q','sv-q-service-queue-mockup.html','คิวงานซ่อม'],['SV-1','sv1-service-intake-mockup.html','ใบรับงานซ่อม'],
      ['SIR','sir-site-inspection-mockup.html','ใบประเมินหน้างาน'],['SQT','sqt-service-quotation-mockup.html','ใบเสนอราคางานบริการ'],
      ['SV-2','sv2-service-assignment-mockup.html','ใบมอบหมายงาน'],['SV-5','sv5-job-card-mockup.html','Job Card ช่าง'],
      ['SV-3','sv3-spare-part-issue-mockup.html','เบิกอะไหล่ (สต็อก)'],['SV-O','sv-order-parts-request-mockup.html','สั่งอะไหล่'],
      ['SV-4','sv4-service-close-mockup.html','ใบรับจากงานซ่อม'],['SV-7','sv7-service-delivery-mockup.html','ส่งงานลูกค้า'],
      ['CLM','clm-vendor-claim-mockup.html','ใบเคลม Vendor'],['SV-6','sv6-delivery-install-mockup.html','จัดส่ง & ติดตั้ง']]},
    {ico:'🚚', label:'ส่ง/รายงาน/อนุมัติ', links:[
      ['AP-1','ap1-approval-center-mockup.html','ศูนย์อนุมัติ'],['EX-1','ex1-executive-dashboard-mockup.html','Executive Dashboard'],
      ['RP-1','rp1-report-center-mockup.html','Report Center']]},
    {ico:'⚙️', label:'ตั้งค่าระบบ (CF)', links:[
      ['CF-1','cf1-rbac-permission-mockup.html','สิทธิ์ RBAC'],['CF-2','cf2-config-hub-mockup.html','Config Hub'],
      ['CF-2.1','cf2-1-tax-setup-mockup.html','ภาษี (Tax)'],['CF-2.2','cf2-2-number-series-mockup.html','Running No.'],
      ['CF-2.5','cf2-5-tech-template-mockup.html','Template ช่าง'],['CF-2.6','cf2-6-approval-matrix-mockup.html','Approval Matrix'],
      ['CF-2.7','cf2-7-doc-template-mockup.html','Doc Template'],['CF-2.9','cf2-9-general-parameter-mockup.html','ค่าตั้งต้น']]},
    {ico:'📚', label:'Master Data (MD)', links:[
      ['MD-1','md1-item-master-mockup-v3.html','ทะเบียนสินค้า'],['MD-2','md2-customer-master-mockup-v3.html','ทะเบียนลูกค้า'],
      ['MD-3','md3-vendor-master-mockup-v3.html','ทะเบียน Vendor'],['MD-4','md4-employee-master-mockup-v3.html','ทะเบียนพนักงาน'],
      ['MD-5','md5-branch-warehouse-mockup-v3.html','สาขา & คลัง']]},
    {ico:'🧩', label:'Shared Components', links:[
      ['SC-1','sc1-customer-search-mockup.html','ค้นหาลูกค้า'],['SC-2','sc2-item-search-mockup.html','ค้นหาสินค้า'],
      ['SC-3','sc3-vendor-search-mockup.html','ค้นหาเจ้าหนี้'],['SC-7','sc7-timeline-mockup.html','Timeline']]}
  ];

  var CSS = `
  .swt-sb,.swt-sb *{box-sizing:border-box}
  .swt-sb{position:fixed;left:0;top:0;width:240px;height:100vh;background:#1E3A5F;color:#D1D5DB;overflow-y:auto;padding:14px 10px 32px;z-index:500;font-family:'Inter','Noto Sans Thai',sans-serif;font-size:13px;line-height:1.4}
  .swt-sb::-webkit-scrollbar{width:6px}
  .swt-sb::-webkit-scrollbar-thumb{background:#334E70;border-radius:3px}
  .swt-sb-brand{display:flex;align-items:center;gap:9px;padding:4px 8px 14px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:12px}
  .swt-sb-logo{width:34px;height:34px;border-radius:9px;background:#2563EB;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800;color:#fff;flex-shrink:0}
  .swt-sb-brand h1{font-size:12px;font-weight:700;color:#fff;letter-spacing:-0.2px;margin:0}
  .swt-sb-brand p{font-size:10px;color:#94A3B8;margin:1px 0 0}
  .swt-sb-search{position:relative;margin:0 4px 12px}
  .swt-sb-search input{width:100%;padding:7px 10px 7px 28px;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:#fff;font-size:12px;font-family:inherit;outline:none}
  .swt-sb-search input::placeholder{color:#6B7F99}
  .swt-sb-search input:focus{border-color:#2563EB;background:rgba(37,99,235,0.1)}
  .swt-sb-search::before{content:"🔍";position:absolute;left:9px;top:7px;font-size:10px;opacity:0.55}
  .swt-sb-home{display:flex;align-items:center;gap:6px;padding:7px 10px;border-radius:6px;text-decoration:none;color:#9CA3AF;font-size:11px;margin:0 4px 10px;background:rgba(255,255,255,0.05);transition:all 0.15s}
  .swt-sb-home:hover{background:rgba(255,255,255,0.12);color:#fff}
  .swt-sb details{margin:1px 0}
  .swt-sb details>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:6px;padding:7px 9px;border-radius:6px;font-size:10.5px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em;user-select:none;margin:0 2px}
  .swt-sb details>summary::-webkit-details-marker{display:none}
  .swt-sb details>summary:hover{background:rgba(255,255,255,0.06);color:#fff}
  .swt-sb-ico{font-size:13px;width:17px;text-align:center;flex-shrink:0}
  .swt-sb-lbl{flex:1}
  .swt-sb-cnt{font-size:9px;font-weight:600;background:rgba(255,255,255,0.08);color:#CBD5E1;padding:1px 5px;border-radius:9px;letter-spacing:0}
  .swt-sb-chv{font-size:8px;color:#6B7F99;transition:transform 0.2s}
  .swt-sb details[open]>summary .swt-sb-chv{transform:rotate(180deg)}
  .swt-sb-links{padding:1px 0 4px 6px}
  .swt-sb-links a{display:flex;align-items:center;gap:6px;padding:5px 9px;border-radius:5px;text-decoration:none;color:#D1D5DB;font-size:11.5px;margin:1px 0;transition:all 0.1s;line-height:1.3}
  .swt-sb-links a:hover{background:rgba(255,255,255,0.08);color:#fff}
  .swt-sb-links a .c{font-family:'Inter',monospace;font-size:9.5px;font-weight:700;color:#94A3B8;min-width:36px;flex-shrink:0}
  .swt-sb-links a:hover .c{color:#60A5FA}
  .swt-sb-links a.swt-active{background:#2563EB;color:#fff;font-weight:600}
  .swt-sb-links a.swt-active .c{color:#BFDBFE}
  .swt-sb-links a.done::after{content:"✦";color:#34D399;margin-left:auto;font-size:11px}
  .swt-sb-links a.swt-active.done::after{color:#A7F3D0}
  `;

  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function render(){
    var cur = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var doneSet = {}; DONE.forEach(function(d){doneSet[d.toLowerCase()]=1;});
    var html = '<aside class="swt-sb" id="swtSb">'
      + '<div class="swt-sb-brand"><div class="swt-sb-logo">ส</div><div><h1>Sangwijit ERP</h1><p>Web Portal · v3.0</p></div></div>'
      + '<div class="swt-sb-search"><input placeholder="ค้นหาเมนู…" oninput="swtSbFilter(this.value)"></div>'
      + '<a class="swt-sb-home" href="index.html">🏠 Master Index</a>';
    GROUPS.forEach(function(g){
      var hasActive = g.links.some(function(l){return l[1].toLowerCase()===cur;});
      html += '<details'+(hasActive?' open':'')+'><summary><span class="swt-sb-ico">'+g.ico+'</span>'
        + '<span class="swt-sb-lbl">'+esc(g.label)+'</span><span class="swt-sb-cnt">'+g.links.length+'</span>'
        + '<span class="swt-sb-chv">▼</span></summary><div class="swt-sb-links">';
      g.links.forEach(function(l){
        var code=l[0], href=l[1], text=l[2];
        var cls=[]; if(href.toLowerCase()===cur)cls.push('swt-active'); if(doneSet[href.toLowerCase()])cls.push('done');
        html += '<a href="'+href+'"'+(cls.length?' class="'+cls.join(' ')+'"':'')+'>'
          + '<span class="c">'+esc(code)+'</span>'+esc(text)+'</a>';
      });
      html += '</div></details>';
    });
    html += '</aside>';
    return html;
  }

  function inject(){
    if(document.getElementById('swtSb')) return; /* กัน inject ซ้ำ */
    var st=document.createElement('style'); st.id='swt-sb-style'; st.textContent=CSS; document.head.appendChild(st);
    var wrap=document.createElement('div'); wrap.innerHTML=render();
    document.body.insertBefore(wrap.firstChild, document.body.firstChild);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',inject); else inject();

  /* filter เมนูตามคำค้น */
  window.swtSbFilter=function(v){
    v=(v||'').toLowerCase();
    var links=document.querySelectorAll('#swtSb .swt-sb-links a');
    for(var i=0;i<links.length;i++){links[i].style.display = links[i].textContent.toLowerCase().indexOf(v)>-1?'':'none';}
  };
})();
