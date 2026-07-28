/* ════════════════════════════════════════════════════════════════
   swt-sidebar.js — Shared Unified Sidebar (canonical · single source)
   ใช้:  <script src="swt-sidebar.js"></script>  (ลบ inline <aside class="swt-sb"> + CSS .swt-sb ออก)
   self-contained: inject CSS + markup เอง
   - auto-active: ตรวจชื่อไฟล์ปัจจุบัน → ใส่ swt-active + เปิด group ของมัน
   - ติดดาว ✦: เพิ่มชื่อไฟล์ใน DONE[] ที่เดียว → ขึ้นทุกหน้าอัตโนมัติ
   - .main{margin-left:240px} ยังอยู่ในแต่ละหน้า (layout offset)
   - ใน iframe/popup (picker · doc popup) → ไม่ render sidebar + ล้าง margin-left:240px
   ════════════════════════════════════════════════════════════════ */
(function(){
  /* ✦ หน้าที่ build/rebuild เสร็จตาม Form Build Pattern — แก้ที่นี่ที่เดียว */
  var DONE = [
    'slq-sales-queue-mockup.html','sl1-quotation-mockup.html','sl2-reservation-mockup.html',
    'sl3-deposit-mockup.html','sl4-invoice-mockup.html','slcn-credit-memo-mockup.html',
    'po1-purchase-request-mockup.html','po2-rfq-mockup.html','po4-purchase-order-mockup.html','sc3-vendor-search-mockup.html',
    'wh1-receive-mockup.html','po6-ap-invoice-mockup.html','po-cn-credit-note-mockup.html',
    'po7-rebate-dashboard.html','po8-deposit-bill-mockup.html',
    'fi2-ap-payment-mockup.html','fi1-ar-receive-mockup.html',
    'poq-purchase-queue-mockup.html',
    'fiq-finance-queue-mockup.html','fiq-finance-queue-mockup.html',
    'wh2-issue-mockup.html',
    'wh4-count-mockup.html','wh3-transfer-mockup.html',
    'wh-q1-receive-queue-mockup.html','wh-q2-issue-queue-mockup.html',
    'wh2r-issue-request-mockup.html','wh3r-transfer-request-mockup.html','wh4r-count-prep-mockup.html',
    'fi1q-apply-queue-mockup.html',
    'slf1-credit-approval-mockup.html',
    'sv1-service-intake-mockup.html','sv-q-service-queue-mockup.html',
    'sv2-service-assignment-mockup.html','sv3-spare-part-issue-mockup.html',
    'sv4-service-close-mockup.html','sv5-job-card-mockup.html',
    'sv7-service-delivery-mockup.html','sv6-delivery-install-mockup.html',
    'sv-order-parts-request-mockup.html','clm-vendor-claim-mockup.html',
    'sv-ma-contract-mockup.html',

    'md3-vendor-master-mockup-v3.html','md2-customer-master-mockup-v3.html',
    'md1-item-master-mockup-v3.html','md4-employee-master-mockup-v3.html',
    'cf1-rbac-permission-mockup.html',
    'md5-branch-warehouse-mockup-v3.html','md5-branch-warehouse-mockup-v3.html',
    'cf2-1-tax-setup-mockup.html',
    'sqt-service-quotation-mockup.html',
    'sc2-item-search-mockup.html',
    'cf2-6-approval-matrix-mockup.html',
    'cf2-7-doc-template-mockup.html',

    /* ─── เพิ่ม 2026-07-21 · งาน grill+build รอบใหญ่ (ตรวจแล้วทุกไฟล์) ─── */
    'ex1-executive-dashboard-mockup.html','rp1-report-center-mockup.html','fi3-bank-reconciliation-mockup.html','fi7-vat-report-mockup.html','cf2-config-hub-mockup.html','cf-master-settings-mockup.html','iaq-bc-sync-monitor-mockup.html','cf2-5-tech-template-mockup.html','sc1-customer-search-mockup.html','sc7-timeline-mockup.html','sc-shared-catalog-mockup.html',   /* reconcile 07-28: built แต่ tracker ค้าง */
    'pm1-price-list-mockup.html','pm5-price-simulator-mockup.html',
    'pm2-promotion-mockup.html',          /* แหล่งงบ · ขั้นบันได · ตรวจกำไร · โปรฯ ชนกัน */
    'pm4-promo-quota-mockup.html',        /* ใหม่ — โควต้าโปรฯ งบแบรนด์/เพดานบริษัท */
    'pmq-promo-dashboard-mockup.html',    /* ใหม่ — โปรฯ ที่รันอยู่ */
    'cm1-commission-mockup.html',         /* คอมมิชชั่น 2 ฟิลด์ + เงื่อนไขเก็บเงินครบ */
    'wh5-stock-adjustment-mockup.html',   /* ผังเหตุผล → บัญชี 7 เหตุผล */
    'wh-r-stock-card-mockup.html',        /* ซ่อมไฟล์ + คลังพิเศษ + กติกากันนับซ้ำ */
    'wh-svc-center-mockup.html',          /* ซากคืนแบรนด์ + ตัดจำหน่ายเครื่องตกค้าง */
    'fi4-expense-wht-mockup.html',        /* VAT รายบรรทัด + ตัดปุ่มภาษีซ้ำ */
    'fi12-wht-mockup.html',               /* อัตราภาษีหัก ณ ที่จ่าย ตารางกลาง */
    'ap1-approval-center-mockup.html',    /* 4 กลุ่มอนุมัติ + ขอบเขตสิทธิ์ + จ่ายเงิน */
    'cf-company-settings-mockup.html',    /* ถัวเฉลี่ยเคลื่อนที่ + SWT บริษัทเดียว */
    'cf2-2-number-series-mockup.html'     /* เลขรันแยกตามสาขา */
  ];

  /* ── Mode & Role (เพิ่ม 2026-07-25 · UX restructure) ──────────
     URL params:
       ?dev          → แสดง dev-only groups (Overview, SC)
       ?role=sales   → filter เมนูตาม role
     default: production + admin (เห็นทุก operational group)
     ─────────────────────────────────────────────────────────── */
  var MODE = location.search.indexOf('dev')>-1 ? 'dev' : 'production';
  var ROLE = (function(){ var m=location.search.match(/role=(\w+)/); return m?m[1]:'admin'; })();
  var ROLE_GROUPS = {
    sales:    ['ศูนย์กลางระบบ','งานขาย (SL)','ราคา & โปรโมชั่น (PM)','Master Data (MD)'],
    warehouse:['ศูนย์กลางระบบ','จัดซื้อ (PO)','คลังสินค้า (WH)','Master Data (MD)'],
    finance:  ['ศูนย์กลางระบบ','จัดซื้อ (PO)','บัญชี/การเงิน (FI)','Master Data (MD)'],
    service:  ['ศูนย์กลางระบบ','บริการ (SV)','คลังสินค้า (WH)','Master Data (MD)'],
    tech:     ['ศูนย์กลางระบบ','บริการ (SV)'],
    admin:    null
  };

  /* nav data — canonical (เปลี่ยนเมนูที่นี่ที่เดียว)
     links item: [code, href, label, marker?]
     marker: 'new' | 'old'
     ── restructured 2026-07-25: ย้ายรายงาน→RP-1, แยก PM, reorder groups ──
  */
  var GROUPS = [
    /* ── ศูนย์กลาง (cross-module · อยู่บนสุด) ── */
    {ico:'🚦', label:'ศูนย์กลางระบบ', links:[
      ['EX-1','ex1-executive-dashboard-mockup.html','EX-1 Dashboard ผู้บริหาร','old'],
      ['AP-1','ap1-approval-center-mockup.html','AP-1 ศูนย์อนุมัติกลาง','old'],
      ['RP-1','rp1-report-center-mockup.html','RP-1 Report Center','old'],
      ['SLF1','slf1-credit-approval-mockup.html','SL-F1 อนุมัติวงเงินขาย','old']]},

    /* ── งานขาย (SL) — 7 items · ย้าย PM→group ใหม่ · ย้ายรายงาน→RP-1 ── */
    {ico:'💼', label:'งานขาย (SL)', links:[
      ['SL-Q','slq-sales-queue-mockup.html','SL-Q คิวงานขาย','old'],
      ['SL-1','sl1-quotation-mockup.html','SL-1 ใบเสนอราคา','new'],
      ['SL-2','sl2-reservation-mockup.html','SL-2 ใบจอง','old'],
      ['SL-3','sl3-deposit-mockup.html','SL-3 ใบมัดจำ','old'],
      ['SL-4','sl4-invoice-mockup.html','SL-4 บิลขาย','old'],
      ['SLCN','slcn-credit-memo-mockup.html','SL-CN ใบลดหนี้','old'],
      ['CM-1','cm1-commission-mockup.html','CM-1 Commission','old']]},

    /* ── ราคา & โปรโมชั่น (PM) — แยกจาก SL เพราะเป็น domain ต่างกัน ── */
    {ico:'💰', label:'ราคา & โปรโมชั่น (PM)', links:[
      ['PM-1','pm1-price-list-mockup.html','PM-1 รายการราคา','new'],
      ['PM-2','pm2-promotion-mockup.html','PM-2 ตั้งโปรโมชั่น','new'],
      ['PM-4','pm4-promo-quota-mockup.html','PM-4 โควต้าโปรโมชั่น','new'],
      ['PM-Q','pmq-promo-dashboard-mockup.html','PM-Q โปรฯ ที่รันอยู่','new'],
      ['PM-5','pm5-price-simulator-mockup.html','PM-5 จำลองราคาขาย','new']]},

    /* ── จัดซื้อ (PO) — 7 items · ย้ายรายงาน→RP-1 ── */
    {ico:'🛒', label:'จัดซื้อ (PO)', links:[
      ['PO-Q','poq-purchase-queue-mockup.html','PO-Q Purchase Queue','old'],
      ['PO-1','po1-purchase-request-mockup.html','PO-1 ใบขอสั่งซื้อ (PR)','old'],
      ['PO-2','po2-rfq-mockup.html','PO-2 Trade Agreement / Vendor','old'],
      ['PO-4','po4-purchase-order-mockup.html','PO-4 ใบสั่งซื้อ (PO)','old'],
      ['PO-7','po7-rebate-dashboard.html','PO-7 ส่งเสริมการขาย (Rebate)','old'],
      ['PO-8','po8-deposit-bill-mockup.html','PO-8 บิลฝาก (Deposit)','old'],
      ['POCN','po-cn-credit-note-mockup.html','PO-CN ใบลดหนี้เจ้าหนี้','old']]},

    /* ── คลังสินค้า (WH) — 10 items · ย้ายรายงาน→RP-1 ── */
    {ico:'📦', label:'คลังสินค้า (WH)', links:[
      ['WHQ1','wh-q1-receive-queue-mockup.html','WH-Q1 คิวรับสินค้า','new'],
      ['WHQ2','wh-q2-issue-queue-mockup.html','WH-Q2 คิวเบิกสินค้า','new'],
      ['WH-1','wh1-receive-mockup.html','WH-1 ใบรับสินค้า','old'],
      ['WH-2','wh2-issue-mockup.html','WH-2 ใบเบิกสินค้า','old'],
      ['WH2R','wh2r-issue-request-mockup.html','WH-2R ใบขอเบิก','new'],
      ['WH-3','wh3-transfer-mockup.html','WH-3 ใบโอนสินค้า','old'],
      ['WH3R','wh3r-transfer-request-mockup.html','WH-3R ใบขอโอน','new'],
      ['WH-4','wh4-count-mockup.html','WH-4 ใบนับสินค้า','old'],
      ['WH4R','wh4r-count-prep-mockup.html','WH-4R ใบเตรียมนับ','new'],
      ['WH-5','wh5-stock-adjustment-mockup.html','WH-5 ปรับ/ตัดจำหน่ายสต็อก','new']]},

    /* ── บัญชี/การเงิน (FI) — 10 items · PO-6→FI-6 · ย้ายรายงาน→RP-1 ── */
    {ico:'💵', label:'บัญชี/การเงิน (FI)', links:[
      ['FIQAR','fiq-finance-queue-mockup.html','FI-Q-AR คิวลูกหนี้','old'],
      ['FIQAP','fiq-finance-queue-mockup.html','FI-Q-AP คิวเจ้าหนี้','old'],
      ['FI-1','fi1-ar-receive-mockup.html','FI-1 รับชำระลูกหนี้ (AR)','old'],
      ['FI1Q','fi1q-apply-queue-mockup.html','FI-1Q คิว Apply','new'],
      ['FI-2','fi2-ap-payment-mockup.html','FI-2 จ่ายชำระเจ้าหนี้ (AP)','old'],
      ['FI-6','po6-ap-invoice-mockup.html','FI-6 ใบตั้งหนี้เจ้าหนี้ (AP)','old'],
      ['FI-3','fi3-bank-reconciliation-mockup.html','FI-3 กระทบยอดธนาคาร','old'],
      ['FI-7','fi7-vat-report-mockup.html','FI-7 รายงานภาษีขาย/ซื้อ','old'],
      ['FI-4','fi4-expense-wht-mockup.html','FI-4 ค่าใช้จ่าย/WHT','old'],
      ['FI12','fi12-wht-mockup.html','FI-12 WHT (ภ.ง.ด.3/53)','old']]},

    /* ── บริการ (SV) — 13 items · ย้ายรายงาน→RP-1 · ย้ายตั้งค่า→CF ── */
    {ico:'🔧', label:'บริการ (SV)', links:[
      ['SV-Q','sv-q-service-queue-mockup.html','SV-Q คิวงานซ่อม','new'],
      ['SV-1','sv1-service-intake-mockup.html','SV-1 ใบรับงานซ่อม','new'],
      ['SV-2','sv2-service-assignment-mockup.html','SV-2 ใบมอบหมายช่าง','new'],
      ['SV-3','sv3-spare-part-issue-mockup.html','SV-3 เบิกอะไหล่','new'],
      ['SVOR','sv-order-parts-request-mockup.html','SV-Order สั่งอะไหล่นอกประกัน','new'],
      ['SV-5','sv5-job-card-mockup.html','SV-5 Job Card','new'],
      ['SV-4','sv4-service-close-mockup.html','SV-4 ปิดงาน/QA + บิล','new'],
      ['SV-6','sv6-delivery-install-mockup.html','SV-6 ส่ง+ติดตั้ง','new'],
      ['SV-7','sv7-service-delivery-mockup.html','SV-7 ส่งงานคืนลูกค้า','new'],
      ['SQT','sqt-service-quotation-mockup.html','SV-SQT เสนอราคางานบริการ','new'],
      ['CLM','clm-vendor-claim-mockup.html','CLM ใบเคลม Vendor','new'],
      ['SVWH','wh-svc-center-mockup.html','คลังศูนย์ซ่อม','new'],
      ['SVMA','sv-ma-contract-mockup.html','สัญญาดูแลรายปี MA','new']]},

    /* ── Master Data (MD) — ไม่เปลี่ยน ── */
    {ico:'📚', label:'Master Data (MD)', links:[
      ['MD-1','md1-item-master-mockup-v3.html','MD-1 ทะเบียนสินค้า (BC365)','new'],
      ['MD-2','md2-customer-master-mockup-v3.html','MD-2 ทะเบียนลูกค้า','new'],
      ['MD-3','md3-vendor-master-mockup-v3.html','MD-3 ทะเบียน Vendor','new'],
      ['MD-4','md4-employee-master-mockup-v3.html','MD-4 ทะเบียนพนักงาน','new'],
      ['MD5a','md5-branch-warehouse-mockup-v3.html','MD-5a ทะเบียนสาขา','new'],
      ['MD5b','md5-branch-warehouse-mockup-v3.html','MD-5b ทะเบียนคลัง','new']]},

    /* ── ตั้งค่าระบบ (CF) — admin only · รวม IA + SV config ── */
    {ico:'⚙️', label:'ตั้งค่าระบบ (CF)', links:[
      ['CF-1','cf1-rbac-permission-mockup.html','CF-1 ทะเบียนตำแหน่ง (RBAC)','new'],
      ['CF-2','cf2-config-hub-mockup.html','CF-2 Config Hub','old'],
      ['CF-3','cf-master-settings-mockup.html','CF-3 Payment Hub','new'],
      ['CF-5','cf-company-settings-mockup.html','CF-5 Bank Master','new'],
      ['IA-Q','iaq-bc-sync-monitor-mockup.html','IA-Q BC Sync Monitor','old'],
      ['CFCO','cf-company-settings-mockup.html','CF ตั้งค่าบริษัท','new'],
      ['CFMS','cf-master-settings-mockup.html','CF ตั้งค่า Master','new'],
      ['CF21','cf2-1-tax-setup-mockup.html','CF-2.1 Tax Setup','new'],
      ['CF22','cf2-2-number-series-mockup.html','CF-2.2 Running No.','old'],
      ['CF25','cf2-5-tech-template-mockup.html','CF-2.5 Template ช่าง','old'],
      ['CF26','cf2-6-approval-matrix-mockup.html','CF-2.6 Approval Matrix','new'],
      ['CF27','cf2-7-doc-template-mockup.html','CF-2.7 Doc Template','new'],
      ['CF29','cf2-9-general-parameter-mockup.html','CF-2.9 ค่าตั้งต้น','old'],
      ['SVCK','cf-master-settings-mockup.html','CF เช็คลิสต์ ล้าง/ตรวจ (from SV)','new'],
      ['SVSLA','cf-master-settings-mockup.html','CF ตั้งค่า SLA (from SV)','new']]},

    /* ── dev-only groups (ซ่อนใน production · เปิดด้วย ?dev) ── */
    {ico:'🏠', label:'Overview', devOnly:true, links:[
      ['IDX','index.html','Master Index','old'],
      ['FLOW','module-flow-overview.html','🗺️ Module Flow Overview','new'],
      ['ARCH','sangwijit-portal-architecture.html','Architecture','old'],
      ['SPEC','dev-handoff-spec.html','Dev Handoff','old']]},
    {ico:'🧩', label:'Shared Components (SC)', devOnly:true, links:[
      ['SCCT','sc-shared-catalog-mockup.html','SC-CAT SC Catalog','old'],
      ['SC-1','sc1-customer-search-mockup.html','SC-1 ค้นหาลูกค้า','old'],
      ['SC-2','sc2-item-search-mockup.html','SC-2 ค้นหาสินค้า','new'],
      ['SC-3','sc3-vendor-search-mockup.html','SC-3 ค้นหาเจ้าหนี้','old'],
      ['SC-7','sc7-timeline-mockup.html','SC-7 Timeline','old']]}
  ];

  var CSS = `
  .swt-sb,.swt-sb *{box-sizing:border-box}
  .swt-sb{position:fixed;left:0;top:0;width:240px;height:100vh;background:#1E3A5F;color:#D1D5DB;overflow-y:auto;overflow-x:hidden;transition:width .16s ease;padding:14px 10px 32px;z-index:500;font-family:'Inter','Noto Sans Thai',sans-serif;font-size:13px;line-height:1.4}
  /* ย่อ (mini) — icon rail 56px · ซ่อน label เหลือไอคอน/โค้ด · กด 📌 เพื่อกางเต็ม
     (เอา hover-peek ออก — เดิมพอคลิกปุ่มในแถบ เมาส์ยัง hover เลยเด้งกลับ 240px = เหมือนถอดหมุดไม่ได้) */
  body.sb-mini .swt-sb{width:56px;padding-left:6px;padding-right:6px}
  body.sb-mini .swt-sb-brand{justify-content:center;padding:4px 0 12px;gap:0}
  body.sb-mini .swt-sb-logo,body.sb-mini .swt-sb-brand>div:not(.swt-sb-logo){display:none}
  body.sb-mini .swt-sb-search,body.sb-mini .swt-sb-tools,body.sb-mini .swt-sb-div{display:none}
  body.sb-mini .swt-sb-home{font-size:0;justify-content:center;padding:7px 4px}
  body.sb-mini .swt-sb-home::before{content:"🏠";font-size:14px}
  body.sb-mini .swt-sb details>summary{justify-content:center;padding:7px 2px;gap:0}
  body.sb-mini .swt-sb-lbl,body.sb-mini .swt-sb-cnt,body.sb-mini .swt-sb-chv{display:none}
  body.sb-mini .swt-sb-links{padding-left:0}
  body.sb-mini .swt-sb-links a{justify-content:center;padding:5px 1px;gap:0}
  body.sb-mini .swt-sb-links a .t,body.sb-mini .swt-sb-links a .m,body.sb-mini .swt-sb-links a .d,body.sb-mini .swt-sb-links a .u{display:none}
  body.sb-mini .swt-sb-links a .c{min-width:0;text-align:center;font-size:9px}
  .swt-sb-collapse{margin-left:auto;background:rgba(255,255,255,0.08);border:none;color:#94A3B8;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:15px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:inherit;line-height:1}
  .swt-sb-collapse:hover{background:rgba(255,255,255,0.18);color:#fff}
  .swt-sb-collapse.on{background:#2563EB;color:#fff}
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
  .swt-sb-tools{display:flex;gap:6px;align-items:center;justify-content:space-between;margin:0 4px 10px}
  .swt-sb-legend{display:flex;gap:6px;align-items:center;margin:0}
  .swt-sb-legend span{font-size:9px;font-weight:700;padding:1px 6px;border-radius:999px}
  .swt-sb-legend .o{background:rgba(16,185,129,0.18);color:#6EE7B7}
  .swt-sb-legend .n{background:rgba(59,130,246,0.18);color:#BFDBFE}
  .swt-sb-toggle{border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.06);color:#E5E7EB;border-radius:999px;padding:2px 8px;font-size:9.5px;font-weight:700;cursor:pointer;font-family:inherit}
  .swt-sb-toggle:hover{background:rgba(255,255,255,0.14);color:#fff}
  .swt-sb-toggle.on{background:rgba(52,211,153,0.2);border-color:rgba(52,211,153,0.5);color:#A7F3D0}
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
  .swt-sb-links a .t{flex:1;min-width:0}
  .swt-sb-links a:hover .c{color:#60A5FA}
  .swt-sb-links a.swt-active{background:#2563EB;color:#fff;font-weight:600}
  .swt-sb-links a.swt-active .c{color:#BFDBFE}
  .swt-sb-links a .m{font-size:9px;font-weight:700;padding:1px 6px;border-radius:999px;line-height:1.5;flex-shrink:0}
  .swt-sb-links a .m-old{background:rgba(16,185,129,0.18);color:#6EE7B7}
  .swt-sb-links a .m-new{background:rgba(59,130,246,0.18);color:#BFDBFE}
  .swt-sb-links a.swt-active .m-old{background:rgba(16,185,129,0.24);color:#D1FAE5}
  .swt-sb-links a.swt-active .m-new{background:rgba(96,165,250,0.24);color:#DBEAFE}
  .swt-sb-links a .d{margin-left:2px;color:#34D399;font-size:11px;flex-shrink:0}
  .swt-sb-links a.swt-active .d{color:#A7F3D0}
  /* ○ = ยังไม่เสร็จ (คู่กับ ✦ = เสร็จแล้ว) — เพิ่ม 2026-07-21 ให้เห็นทั้ง 2 สถานะ */
  .swt-sb-links a .u{margin-left:2px;color:#64748B;font-size:11px;flex-shrink:0}
  .swt-sb-links a.swt-active .u{color:#94A3B8}
  .swt-sb.swt-done-only .swt-sb-links a:not(.is-done){display:none!important}
  .swt-sb-div{font-size:8.5px;font-weight:700;color:#6B7F99;text-transform:uppercase;letter-spacing:.04em;padding:5px 9px 2px;margin-top:3px;border-top:1px dashed rgba(255,255,255,0.12);display:flex;align-items:center;gap:5px}
  .swt-sb-div::before{content:"🗄️"}
  .swt-sb.swt-done-only .swt-sb-div{display:none!important}
  `;

  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function render(){
    var cur = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var doneSet = {}; DONE.forEach(function(d){doneSet[d.toLowerCase()]=1;});
    var activeUsed = false;
    var html = '<aside class="swt-sb" id="swtSb">'
      + '<div class="swt-sb-brand"><div class="swt-sb-logo">ส</div><div><h1>Sangwijit ERP</h1><p>Web Portal · v3.0</p></div><button type="button" id="swtSbCollapse" class="swt-sb-collapse on" onclick="swtSbToggleMini()" title="ปักหมุดอยู่ — กดเพื่อย่อ">📌</button></div>'
      + '<div class="swt-sb-search"><input placeholder="ค้นหาเมนู…" oninput="swtSbFilter(this.value)"></div>'
      + '<div class="swt-sb-tools"><div class="swt-sb-legend"><span class="o">เก่า</span><span class="n">ใหม่</span></div><button type="button" id="swtSbToggleDone" class="swt-sb-toggle" onclick="swtSbToggleDoneOnly()" aria-pressed="false">ซ่อนไม่มี✦</button></div>'
      + '<a class="swt-sb-home" href="index.html">🏠 Master Index</a>';
    GROUPS.forEach(function(g){
      if(g.devOnly && MODE!=='dev') return;
      var rg = ROLE_GROUPS[ROLE];
      if(rg && rg.indexOf(g.label)===-1) return;
      var hasActive = g.links.some(function(l){return !activeUsed && l[1].toLowerCase().split('/').pop()===cur;});
      html += '<details'+(hasActive?' open':'')+'><summary><span class="swt-sb-ico">'+g.ico+'</span>'
        + '<span class="swt-sb-lbl">'+esc(g.label)+'</span><span class="swt-sb-cnt">'+g.links.length+'</span>'
        + '<span class="swt-sb-chv">▼</span></summary><div class="swt-sb-links">';
      var doneHtml='', oldHtml='';
      g.links.forEach(function(l){
        var code=l[0], href=l[1], text=l[2], marker=((l[3]==='new'||doneSet[l[1].toLowerCase()])?'new':'old');
        var cls=[];
        var isActive = (!activeUsed && href.toLowerCase().split('/').pop()===cur);
        if(isActive){ cls.push('swt-active'); activeUsed = true; }
        var markerText=(marker==='new'?'ใหม่':'เก่า');
        var markerCls=(marker==='new'?'m-new':'m-old');
        var done=!!doneSet[href.toLowerCase()];
        if(done) cls.push('is-done');
        var a = '<a href="'+href+'"'+(cls.length?' class="'+cls.join(' ')+'"':'')+'>'
          + '<span class="c">'+esc(code)+'</span>'
          + '<span class="t">'+esc(text)+'</span>'
          + '<span class="m '+markerCls+'">'+markerText+'</span>'
          + (done?'<span class="d" title="เสร็จแล้ว — ตรวจแล้ว">✦</span>':'<span class="u" title="ยังไม่เสร็จ / รอ rebuild">○</span>')
          + '</a>';
        if(done) doneHtml+=a; else oldHtml+=a;   /* แยก ✦ (ใช้งาน) / เก่า (รอ rebuild) ในแต่ละกลุ่ม */
      });
      html += doneHtml;
      if(doneHtml && oldHtml) html += '<div class="swt-sb-div">รอ rebuild</div>';
      html += oldHtml;
      html += '</div></details>';
    });
    html += '</aside>';
    return html;
  }

  /* อยู่ใน iframe/popup ไหม (picker · doc popup) → ไม่ต้องมี sidebar */
  function inIframe(){ try{ return window.self !== window.top; }catch(e){ return true; } }

  /* embed mode: ซ่อน sidebar + ล้าง margin-left:240px (class offset ต่างกันรายหน้า → scan computed) */
  function stripForEmbed(){
    var es=document.createElement('style'); es.id='swt-sb-embed';
    es.textContent='.swt-sb{display:none!important}'; document.head.appendChild(es);
    try{
      var all=document.body.getElementsByTagName('*');
      for(var i=0;i<all.length;i++){ if(getComputedStyle(all[i]).marginLeft==='240px') all[i].style.marginLeft='0'; }
    }catch(e){}
  }

  var DONE_ONLY_KEY = 'swtSbDoneOnly';
  function getDoneOnly(){ try{ return localStorage.getItem(DONE_ONLY_KEY)==='1'; }catch(e){ return false; } }
  function setDoneOnly(v){ try{ localStorage.setItem(DONE_ONLY_KEY, v?'1':'0'); }catch(e){} }
  function refreshGroupVisibility(){
    var sb=document.getElementById('swtSb'); if(!sb) return;
    var doneOnly=sb.classList.contains('swt-done-only');
    var groups=sb.querySelectorAll('details');
    for(var i=0;i<groups.length;i++){
      var links=groups[i].querySelectorAll('.swt-sb-links a');
      var visible=0;
      for(var j=0;j<links.length;j++){
        var passDone = !doneOnly || links[j].classList.contains('is-done');
        var passFilter = links[j].style.display!=='none';
        if(passDone && passFilter){ visible++; }
      }
      groups[i].style.display = visible>0 ? '' : 'none';
    }
  }
  function applyDoneOnly(v){
    var sb=document.getElementById('swtSb'); if(!sb) return;
    if(v) sb.classList.add('swt-done-only'); else sb.classList.remove('swt-done-only');
    var btn=document.getElementById('swtSbToggleDone');
    if(btn){
      btn.textContent = v ? 'แสดงทั้งหมด' : 'ซ่อนไม่มี✦';
      btn.classList.toggle('on', !!v);
      btn.setAttribute('aria-pressed', v?'true':'false');
    }
    refreshGroupVisibility();
  }
  window.swtSbToggleDoneOnly = function(){
    var v = !getDoneOnly(); setDoneOnly(v); applyDoneOnly(v);
  };
  window.swtSbFilter = function(q){
    q = (q||'').trim().toLowerCase();
    var sb = document.getElementById('swtSb'); if(!sb) return;
    sb.querySelectorAll('.swt-sb-links a').forEach(function(a){
      a.style.display = (!q || a.textContent.toLowerCase().indexOf(q)>-1) ? '' : 'none';
    });
    refreshGroupVisibility();
  };
  /* ย่อ/ปักหมุด sidebar — mini 56px + ขยาย content · จำสถานะทุกหน้า */
  var MINI_KEY = 'swtSbMini';
  function getMini(){ try{ return localStorage.getItem(MINI_KEY)==='1'; }catch(e){ return false; } }
  function applyMini(on){
    document.body.classList.toggle('sb-mini', on);
    try{
      var all = document.body.getElementsByTagName('*');
      for(var i=0;i<all.length;i++){
        var el = all[i];
        if(on){ if(getComputedStyle(el).marginLeft==='240px'){ el.setAttribute('data-sbml','1'); el.style.marginLeft='56px'; } }
        else if(el.getAttribute('data-sbml')){ el.style.marginLeft=''; el.removeAttribute('data-sbml'); }
      }
    }catch(e){}
    var b = document.getElementById('swtSbCollapse');
    if(b){ b.textContent = '📌'; b.classList.toggle('on', !on); b.title = on?'ย่ออยู่ — กดเพื่อปักหมุด (กางเต็ม)':'ปักหมุดอยู่ — กดเพื่อย่อ'; }
    try{ localStorage.setItem(MINI_KEY, on?'1':'0'); }catch(e){}
  }
  window.swtSbToggleMini = function(){ applyMini(!getMini()); };

  document.addEventListener('DOMContentLoaded', function(){
    if(inIframe()){ stripForEmbed(); return; }
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var tmp = document.createElement('div'); tmp.innerHTML = render();
    document.body.insertBefore(tmp.firstChild, document.body.firstChild);
    applyDoneOnly(getDoneOnly());
    applyMini(getMini());
  });
})();