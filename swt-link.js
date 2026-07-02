/* ============================================================
 * swt-link.js — Sangwijit Portal universal doc linker + timeline + global search
 * Drop-in: <script src="swt-link.js" defer></script>
 *
 * Provides:
 *   1. Auto-link any doc no. like "INV-2604-0023" → opens module page
 *   2. window.swtRenderTimeline(mountId, title, items[]) — embed SC-7 timeline
 *   3. window.swtRenderBreadcrumb(chain[]) — sticky doc-chain breadcrumb under topbar
 *   4. Global search palette — hotkey `/` or Ctrl+K, ESC to close
 *
 * Item shape for timeline:
 *   { action: 'สร้างใบเสนอราคา', time: '2026-04-01 10:22',
 *     sub: 'อ้างอิง QT-2604-0015', color: 'green' }   // green | blue | amber | gray
 *
 * Opt-out: add class "swt-no-link" to any container to skip scanning inside it.
 * ============================================================ */
(function () {
  'use strict';

  // ── Doc-prefix → module page ──────────────────────────────
  var DOC_MAP = {
    // Sales
    QT: 'bc365/sl1-quotation-mockup.html',
    QUO: 'bc365/sl1-quotation-mockup.html',
    RES: 'sl2-reservation-mockup.html',
    DPS: 'sl3-deposit-mockup.html',
    DEP: 'sl3-deposit-mockup.html',
    SO: 'sl4-invoice-mockup.html',
    INV: 'sl4-invoice-mockup.html',
    BIL: 'sl4-invoice-mockup.html',
    CRM: 'sl5-crm-followup-mockup.html',
    PROMO: 'bc365/pm1-promotion-mockup.html',
    CRD: 'slf1-credit-approval-mockup.html',
    CRA: 'slf1-credit-approval-mockup.html',
    // Purchase
    PR: 'po1-purchase-request-mockup.html',
    RFQ: 'po2-rfq-mockup.html',
    PO: 'po4-purchase-order-mockup.html',
    VBL: 'po3-vendor-onboarding-mockup.html',
    VINV: 'po3-vendor-onboarding-mockup.html',
    REB: 'po7-rebate-dashboard.html',
    // Warehouse
    GRN: 'wh1-receive-mockup.html',
    REC: 'wh1-receive-mockup.html',
    TRN: 'wh3-transfer-mockup.html',
    TRF: 'wh3-transfer-mockup.html',
    STK: 'wh4-count-mockup.html',
    CNT: 'wh4-count-mockup.html',
    GIS: 'wh-q2-issue-queue-mockup.html',
    ISS: 'wh-q2-issue-queue-mockup.html',
    // Service
    SVC: 'bc365/service-board-mockup.html',
    SVQ: 'bc365/service-board-mockup.html',
    SIR: 'sir-site-inspection-mockup.html',
    SQT: 'bc365/sv-sqt-quotation-mockup.html',
    SIN: 'bc365/service-posted-docs-mockup.html',
    SPR: 'bc365/service-parts-claim-mockup.html',
    WAR: 'bc365/service-intake-mockup.html',
    JOB: 'bc365/service-tech-mobile-mockup.html',
    // Finance
    RV: 'fi1-ar-receive-mockup.html',
    PAY: 'fi2-ap-payment-mockup.html',
    PV: 'fi2-ap-payment-mockup.html',
    TAX: 'fi7-vat-report-mockup.html',
    VAT: 'fi7-vat-report-mockup.html',
    BR: 'fi3-bank-reconciliation-mockup.html',
    EXP: 'fi4-expense-wht-mockup.html',
    WHT: 'fi12-wht-mockup.html',
    JV: 'fi13-dual-book-mockup.html',
    URC: 'fi1q-apply-queue-mockup.html',
    UAR: 'fi1q-apply-queue-mockup.html',
    // Delivery / Approval / etc.
    DLV: 'bc365/service-posted-docs-mockup.html',
    DEL: 'bc365/service-posted-docs-mockup.html',
    APV: 'ap1-approval-center-mockup.html',
    CLM: 'clm-vendor-claim-mockup.html',
    COM: 'cm1-commission-mockup.html'
  };

  // Pattern: PREFIX-YYYY-#### or PREFIX-YYMM-####
  var RE = /\b([A-Z]{2,5})-(\d{4})-(\d{3,5})\b/g;

  function urlFor(prefix) {
    return DOC_MAP[prefix.toUpperCase()] || null;
  }

  // ── Inject styles once ───────────────────────────────────
  var STYLE = [
    'a.swt-doc-link{color:#2563EB;font-weight:600;text-decoration:none;border-bottom:1px dashed rgba(37,99,235,0.45);cursor:pointer;transition:all .12s}',
    'a.swt-doc-link:hover{background:rgba(37,99,235,0.08);border-bottom-style:solid;padding:0 3px;margin:0 -3px;border-radius:3px}',
    'a.swt-doc-link::after{content:" ↗";font-size:0.85em;opacity:0.55;font-weight:400}',

    '.swt-tl-card{background:#fff;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;margin:24px 0;font-family:Inter,"Noto Sans Thai",sans-serif}',
    'details.swt-tl-card[open]>.swt-tl-wrap{display:block}',
    'details.swt-tl-card:not([open])>.swt-tl-wrap{display:none}',
    '.swt-tl-head{display:flex;align-items:center;gap:10px;padding:14px 22px;border-bottom:1px solid #F3F4F6;background:#FAFBFC}',
    'summary.swt-tl-head{cursor:pointer;user-select:none;list-style:none}',
    'summary.swt-tl-head::-webkit-details-marker{display:none}',
    'summary.swt-tl-head:hover{background:#F1F5F9}',
    'details.swt-tl-card:not([open]) summary.swt-tl-head{border-bottom:none}',
    '.swt-tl-chev{font-size:11px;color:#6B7280;transition:transform 0.15s;display:inline-block}',
    'details.swt-tl-card[open] .swt-tl-chev{transform:rotate(90deg)}',
    '.swt-tl-count{font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:10px;background:#EFF6FF;color:#1D4ED8;letter-spacing:0.03em}',
    '.swt-tl-title{font-size:13px;font-weight:600;color:#374151;flex:1}',
    '.swt-tl-tag{font-size:10px;font-weight:600;padding:2px 8px;border-radius:10px;background:rgba(124,58,237,0.1);color:#7C3AED;letter-spacing:0.04em}',
    '.swt-tl-meta{font-size:11px;color:#9CA3AF}',
    '.swt-tl-wrap{padding:22px 22px 8px}',
    '.swt-tl{display:flex;flex-direction:column}',
    '.swt-tl-item{display:flex;gap:14px}',
    '.swt-tl-left{display:flex;flex-direction:column;align-items:center;width:14px;flex-shrink:0}',
    '.swt-tl-dot{width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px currentColor;margin-top:4px;flex-shrink:0}',
    '.swt-tl-dot.green{color:#10B981;background:#10B981}',
    '.swt-tl-dot.blue{color:#2563EB;background:#2563EB}',
    '.swt-tl-dot.amber{color:#F59E0B;background:#F59E0B}',
    '.swt-tl-dot.gray{color:#9CA3AF;background:#9CA3AF}',
    '.swt-tl-dot.red{color:#EF4444;background:#EF4444}',
    '.swt-tl-line{width:2px;flex:1;background:#E5E7EB;min-height:18px;margin:4px 0}',
    '.swt-tl-body{flex:1;padding-bottom:18px}',
    '.swt-tl-act{font-size:13px;font-weight:600;color:#111827}',
    '.swt-tl-time{font-size:11px;color:#9CA3AF;font-weight:400;margin-left:6px}',
    '.swt-tl-sub{font-size:12px;color:#6B7280;margin-top:4px;line-height:1.55}',

    /* Doc-chain breadcrumb */
    '.swt-bc{display:flex;align-items:center;gap:0;padding:8px 24px;background:linear-gradient(180deg,#F8FAFC,#F1F5F9);border-bottom:1px solid #E2E8F0;font-family:Inter,"Noto Sans Thai",sans-serif;flex-wrap:wrap;row-gap:6px}',
    '.swt-bc-label{font-size:10px;font-weight:700;color:#7C3AED;text-transform:uppercase;letter-spacing:0.06em;margin-right:10px;display:flex;align-items:center;gap:4px}',
    '.swt-bc-label::before{content:"⛓";font-size:11px}',
    '.swt-bc-item{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:6px;border:1px solid #E2E8F0;background:#fff;text-decoration:none;font-size:12px;color:#374151;transition:all .12s;line-height:1.3;white-space:nowrap}',
    '.swt-bc-item:hover{border-color:#93C5FD;background:#EFF6FF;color:#1D4ED8;transform:translateY(-1px);box-shadow:0 1px 4px rgba(37,99,235,0.12)}',
    '.swt-bc-item.current{background:#2563EB;border-color:#2563EB;color:#fff;font-weight:600;cursor:default;box-shadow:0 1px 6px rgba(37,99,235,0.35)}',
    '.swt-bc-item.current:hover{transform:none;background:#2563EB}',
    '.swt-bc-item.pending{background:#F8FAFC;border-style:dashed;color:#94A3B8;cursor:default}',
    '.swt-bc-item.pending:hover{transform:none;background:#F8FAFC;border-color:#E2E8F0;color:#94A3B8;box-shadow:none}',
    '.swt-bc-type{font-size:9.5px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em}',
    '.swt-bc-item.current .swt-bc-type{color:#BFDBFE}',
    '.swt-bc-item:hover .swt-bc-type{color:#60A5FA}',
    '.swt-bc-no{font-weight:600;font-size:12px}',
    '.swt-bc-arrow{margin:0 4px;color:#CBD5E1;font-size:13px;user-select:none}',

    /* Global search palette */
    '.swt-gs-backdrop{position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:9998;display:none;backdrop-filter:blur(2px)}',
    '.swt-gs-backdrop.open{display:block}',
    '.swt-gs-modal{position:fixed;top:80px;left:50%;transform:translateX(-50%);width:640px;max-width:calc(100vw - 32px);max-height:calc(100vh - 120px);background:#fff;border-radius:14px;box-shadow:0 24px 64px rgba(0,0,0,0.3),0 4px 16px rgba(0,0,0,0.15);z-index:9999;display:none;flex-direction:column;font-family:Inter,"Noto Sans Thai",sans-serif;overflow:hidden}',
    '.swt-gs-modal.open{display:flex}',
    '.swt-gs-input-wrap{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid #F1F5F9}',
    '.swt-gs-icon{font-size:18px;color:#94A3B8}',
    '.swt-gs-input{flex:1;border:none;outline:none;font-size:16px;color:#111827;font-family:inherit;background:transparent}',
    '.swt-gs-input::placeholder{color:#94A3B8}',
    '.swt-gs-kbd{font-size:10px;font-weight:600;background:#F1F5F9;color:#64748B;padding:3px 7px;border-radius:4px;border:1px solid #E2E8F0;font-family:Inter,monospace}',
    '.swt-gs-results{flex:1;overflow-y:auto;padding:8px 0}',
    '.swt-gs-empty{padding:32px 20px;text-align:center;color:#94A3B8;font-size:13px}',
    '.swt-gs-group{padding:6px 0}',
    '.swt-gs-group-label{padding:6px 20px 4px;font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;display:flex;align-items:center;gap:6px}',
    '.swt-gs-group-cnt{background:#F1F5F9;color:#64748B;padding:1px 6px;border-radius:8px;font-size:9px;letter-spacing:0}',
    '.swt-gs-item{display:flex;align-items:center;gap:12px;padding:9px 20px;cursor:pointer;text-decoration:none;color:inherit;border-left:3px solid transparent;transition:background .08s}',
    '.swt-gs-item:hover,.swt-gs-item.active{background:#EFF6FF;border-left-color:#2563EB}',
    '.swt-gs-item-ic{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;background:#F1F5F9;color:#64748B}',
    '.swt-gs-item.active .swt-gs-item-ic{background:#DBEAFE;color:#2563EB}',
    '.swt-gs-item-body{flex:1;min-width:0}',
    '.swt-gs-item-title{font-size:13px;font-weight:600;color:#111827;line-height:1.3;display:flex;align-items:center;gap:6px}',
    '.swt-gs-item-sub{font-size:11.5px;color:#64748B;margin-top:2px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.swt-gs-item-tag{font-size:9.5px;font-weight:700;color:#7C3AED;background:rgba(124,58,237,0.08);padding:1px 6px;border-radius:4px;letter-spacing:0.04em}',
    '.swt-gs-item-arrow{color:#CBD5E1;font-size:13px;flex-shrink:0}',
    '.swt-gs-item.active .swt-gs-item-arrow{color:#2563EB}',
    '.swt-gs-footer{display:flex;gap:14px;padding:10px 20px;border-top:1px solid #F1F5F9;background:#FAFBFC;font-size:11px;color:#64748B}',
    '.swt-gs-foot-key{display:inline-flex;align-items:center;gap:4px}',
    '.swt-gs-foot-key b{font-family:Inter,monospace;background:#fff;border:1px solid #E2E8F0;border-radius:3px;padding:1px 5px;font-size:10px;color:#475569;font-weight:600}',
    '.swt-gs-mark{background:rgba(250,204,21,0.4);color:inherit;padding:0 1px;border-radius:2px;font-weight:700}',

    /* Search combo (textbox + button) — header customer/vendor + line add-row */
    '.swt-search-combo{display:flex;gap:6px;align-items:stretch}',
    '.swt-search-combo input[type="text"]{flex:1;padding:7px 10px;border:1px solid #CBD5E1;border-radius:6px;font-size:13px;font-family:inherit;color:#111827;background:#fff;outline:none;min-width:0;transition:border-color .12s,box-shadow .12s}',
    '.swt-search-combo input[type="text"]:focus{border-color:#2563EB;box-shadow:0 0 0 3px rgba(37,99,235,0.12)}',
    '.swt-search-combo .swt-search-btn{padding:0 12px;border:1px solid #2563EB;background:#2563EB;color:#fff;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;transition:background .12s}',
    '.swt-search-combo .swt-search-btn:hover{background:#1D4ED8}',

    /* Line-editable input / select — for qty / price / unit / warehouse cells */
    '.line-input,.line-select{width:100%;padding:5px 7px;border:1px solid #E2E8F0;border-radius:4px;font-size:13px;font-family:inherit;background:#fff;color:#111827;outline:none;box-sizing:border-box;transition:border-color .12s,box-shadow .12s}',
    '.line-input:hover,.line-select:hover{border-color:#93C5FD}',
    '.line-input:focus,.line-select:focus{border-color:#2563EB;box-shadow:0 0 0 2px rgba(37,99,235,0.15)}',
    '.line-input.num{text-align:right}',
    '.line-input.qty{min-width:60px;max-width:80px}',
    '.line-input.price{min-width:80px}',
    '.line-select{cursor:pointer;min-width:90px}',

    /* Barcode scan button + modal */
    '.swt-search-combo .swt-scan-btn{padding:0 12px;border:1px solid #10B981;background:#10B981;color:#fff;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;transition:background .12s}',
    '.swt-search-combo .swt-scan-btn:hover{background:#059669}',
    '.swt-bc-backdrop{position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:9998;display:none;backdrop-filter:blur(2px)}',
    '.swt-bc-backdrop.open{display:block}',
    '.swt-bc-modal{position:fixed;top:80px;left:50%;transform:translateX(-50%);width:440px;max-width:calc(100vw - 32px);background:#fff;border-radius:14px;box-shadow:0 24px 64px rgba(0,0,0,0.3),0 4px 16px rgba(0,0,0,0.15);z-index:9999;display:none;font-family:Inter,"Noto Sans Thai",sans-serif;overflow:hidden}',
    '.swt-bc-modal.open{display:block}',
    '.swt-bc-head{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#111827}',
    '.swt-bc-close{background:none;border:none;font-size:18px;cursor:pointer;color:#9CA3AF;padding:4px 8px;font-family:inherit}',
    '.swt-bc-close:hover{color:#111827}',
    '.swt-bc-body{padding:24px 20px;text-align:center}',
    '.swt-bc-view{position:relative;width:320px;height:200px;margin:0 auto;background:#0F172A;border-radius:12px;overflow:hidden}',
    '.swt-bc-cam{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#64748B;font-size:11px;letter-spacing:0.05em}',
    '.swt-bc-view::before,.swt-bc-view::after{content:"";position:absolute;width:30px;height:30px;border:3px solid #10B981}',
    '.swt-bc-view::before{top:14px;left:14px;border-right:none;border-bottom:none;border-top-left-radius:4px}',
    '.swt-bc-view::after{top:14px;right:14px;border-left:none;border-bottom:none;border-top-right-radius:4px}',
    '.swt-bc-corners::before,.swt-bc-corners::after{content:"";position:absolute;width:30px;height:30px;border:3px solid #10B981}',
    '.swt-bc-corners::before{bottom:14px;left:14px;border-right:none;border-top:none;border-bottom-left-radius:4px}',
    '.swt-bc-corners::after{bottom:14px;right:14px;border-left:none;border-top:none;border-bottom-right-radius:4px}',
    '.swt-bc-line{position:absolute;left:16px;right:16px;height:2px;background:#EF4444;box-shadow:0 0 8px #EF4444,0 0 16px rgba(239,68,68,0.5);top:18px;animation:swtBcScan 1.4s ease-in-out infinite alternate}',
    '@keyframes swtBcScan{from{top:20px}to{top:calc(100% - 22px)}}',
    '.swt-bc-modal.done .swt-bc-line{display:none}',
    '.swt-bc-modal.done .swt-bc-view{background:#052E2A;transition:background .2s}',
    '.swt-bc-status{margin-top:18px;font-size:13px;color:#374151;min-height:18px}',
    '.swt-bc-status b{color:#059669;font-weight:700;font-family:Inter,monospace;background:#ECFDF5;padding:2px 8px;border-radius:4px;margin-left:4px}',
    '.swt-bc-foot{padding:12px 20px;border-top:1px solid #F1F5F9;background:#FAFBFC;display:flex;gap:8px;justify-content:flex-end}',
    '.swt-bc-foot .swt-bc-btn{padding:7px 14px;border:1px solid #D1D5DB;background:#fff;border-radius:6px;font-size:13px;font-family:inherit;cursor:pointer;color:#374151;font-weight:500}',
    '.swt-bc-foot .swt-bc-btn.primary{background:#2563EB;border-color:#2563EB;color:#fff}',
    '.swt-bc-foot .swt-bc-btn:hover{background:#F1F5F9}',
    '.swt-bc-foot .swt-bc-btn.primary:hover{background:#1D4ED8}',

    /* Promo notice banner + pill system (opt-in via click) */
    '.promo-notice{display:flex;align-items:center;gap:10px;padding:10px 14px;background:linear-gradient(90deg,#FEF3C7,#FDE68A);border:1px solid #F59E0B;border-left:4px solid #F59E0B;border-radius:8px;font-size:13px;color:#78350F;margin-bottom:12px;flex-wrap:wrap}',
    '.promo-notice b{color:#92400E}',
    '.promo-notice .promo-counter{margin-left:auto;background:#fff;border:1px solid #FCD34D;padding:3px 10px;border-radius:14px;font-size:12px;font-weight:700;color:#92400E}',
    '.promo-pills{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}',
    '.promo-pill{font-size:10.5px;font-weight:600;padding:2px 8px;border-radius:10px;line-height:1.35;display:inline-flex;align-items:center;gap:3px;white-space:nowrap;cursor:pointer;transition:all .12s;user-select:none;border:1px solid transparent}',
    '.promo-pill:hover{transform:translateY(-1px);box-shadow:0 2px 4px rgba(0,0,0,0.08)}',
    /* Available (default) = ghost/dashed */
    '.promo-pill.available{background:#fff;color:#6B7280;border:1px dashed #CBD5E1;opacity:0.88}',
    '.promo-pill.available::before{content:"＋";margin-right:2px;color:#9CA3AF;font-weight:700}',
    '.promo-pill.available:hover{border-color:#94A3B8;background:#F8FAFC;opacity:1}',
    /* Applied = solid colored (by category) */
    '.promo-pill.applied::before{content:"✓";margin-right:2px;font-weight:700}',
    '.promo-pill.applied.sale{background:#FEF3C7;color:#92400E;border-color:#FCD34D}',
    '.promo-pill.applied.gift{background:#D1FAE5;color:#065F46;border-color:#6EE7B7}',
    '.promo-pill.applied.points{background:#DBEAFE;color:#1E40AF;border-color:#93C5FD}',
    '.promo-pill.applied.bundle{background:#EDE9FE;color:#5B21B6;border-color:#C4B5FD}',
    '.promo-pill.applied.rebate{background:#FCE7F3;color:#9D174D;border-color:#F9A8D4}',

    /* Customer QR modal */
    '.swt-qr-btn-inline{padding:0 12px;border:1px solid #7C3AED;background:#7C3AED;color:#fff;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;transition:background .12s}',
    '.swt-qr-btn-inline:hover{background:#6D28D9}',
    '.swt-qr-backdrop{position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:9998;display:none;backdrop-filter:blur(2px)}',
    '.swt-qr-backdrop.open{display:block}',
    '.swt-qr-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:460px;max-width:calc(100vw - 32px);max-height:calc(100vh - 48px);overflow-y:auto;background:#fff;border-radius:14px;box-shadow:0 24px 64px rgba(0,0,0,0.3),0 4px 16px rgba(0,0,0,0.15);z-index:9999;display:none;font-family:Inter,"Noto Sans Thai",sans-serif}',
    '.swt-qr-modal.open{display:block}',
    '.swt-qr-head{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#111827}',
    '.swt-qr-close{background:none;border:none;font-size:18px;cursor:pointer;color:#9CA3AF;padding:4px 8px;font-family:inherit}',
    '.swt-qr-close:hover{color:#111827}',
    '.swt-qr-body{padding:18px 20px}',
    '.swt-qr-picker{margin-bottom:14px}',
    '.swt-qr-picker label{display:block;font-size:11px;font-weight:600;color:#6B7280;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.04em}',
    '.swt-qr-picker select{width:100%;padding:7px 10px;border:1px solid #CBD5E1;border-radius:6px;font-size:13px;font-family:inherit;color:#111827;background:#fff;outline:none;cursor:pointer}',
    '.swt-qr-picker select:focus{border-color:#2563EB;box-shadow:0 0 0 3px rgba(37,99,235,0.12)}',
    '.swt-qr-card{background:linear-gradient(135deg,#F5F3FF,#EDE9FE);border:1px solid #DDD6FE;border-radius:12px;padding:16px;text-align:center}',
    '.swt-qr-brand{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:11px}',
    '.swt-qr-brand-th{font-weight:700;color:#5B21B6;letter-spacing:0.03em}',
    '.swt-qr-brand-biller{color:#6B7280;font-family:Inter,monospace}',
    '.swt-qr-image-wrap{display:inline-block;padding:10px;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(91,33,182,0.12)}',
    '.swt-qr-image-wrap img{display:block;width:200px;height:200px}',
    '.swt-qr-cust-info{margin-top:12px}',
    '.swt-qr-cust-name{font-size:14px;font-weight:600;color:#111827}',
    '.swt-qr-cust-meta{font-size:11.5px;color:#6B7280;margin-top:2px;font-family:Inter,monospace}',
    '.swt-qr-ref-grid{margin-top:14px;display:flex;flex-direction:column;gap:6px;background:#FAFBFC;border:1px solid #F1F5F9;border-radius:8px;padding:10px 12px}',
    '.swt-qr-ref-row{display:flex;align-items:center;gap:10px;font-size:12px}',
    '.swt-qr-ref-label{font-weight:700;color:#7C3AED;min-width:48px;font-size:10.5px;letter-spacing:0.04em}',
    '.swt-qr-ref-val{font-family:Inter,monospace;font-weight:600;color:#111827;background:#fff;border:1px solid #E5E7EB;padding:2px 8px;border-radius:4px}',
    '.swt-qr-ref-hint{color:#9CA3AF;font-size:11px;margin-left:auto}',
    '.swt-qr-amt{margin-top:14px}',
    '.swt-qr-amt>label{display:block;font-size:11px;font-weight:600;color:#6B7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em}',
    '.swt-qr-amt-row{display:flex;flex-direction:column;gap:6px}',
    '.swt-qr-amt-opt{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid #E5E7EB;border-radius:6px;cursor:pointer;font-size:13px;color:#374151;transition:all .12s}',
    '.swt-qr-amt-opt:hover{border-color:#C4B5FD;background:#FAF5FF}',
    '.swt-qr-amt-opt.checked{border-color:#7C3AED;background:#F5F3FF}',
    '.swt-qr-amt-opt input[type="radio"]{accent-color:#7C3AED}',
    '.swt-qr-amt-opt b{color:#059669;font-family:Inter,monospace;font-weight:700;margin-left:4px}',
    '.swt-qr-amt-opt input[type="number"]{margin-left:auto;width:110px;padding:4px 8px;border:1px solid #CBD5E1;border-radius:4px;font-size:12px;font-family:Inter,monospace;text-align:right;outline:none}',
    '.swt-qr-amt-opt input[type="number"]:disabled{background:#F1F5F9;color:#9CA3AF;cursor:not-allowed}',
    '.swt-qr-amt-opt input[type="number"]:focus{border-color:#7C3AED;box-shadow:0 0 0 2px rgba(124,58,237,0.15)}',
    '.swt-qr-hint{margin-top:12px;padding:10px 12px;background:#EFF6FF;border-left:3px solid #2563EB;border-radius:4px;font-size:11.5px;color:#1E40AF;line-height:1.55}',
    '.swt-qr-foot{display:flex;gap:8px;padding:12px 20px;border-top:1px solid #F1F5F9;background:#FAFBFC;flex-wrap:wrap}',
    '.swt-qr-foot .swt-qr-btn{padding:7px 12px;border:1px solid #D1D5DB;background:#fff;border-radius:6px;font-size:12.5px;font-family:inherit;cursor:pointer;color:#374151;font-weight:500;transition:all .12s}',
    '.swt-qr-foot .swt-qr-btn:hover{background:#F1F5F9;border-color:#9CA3AF}',
    '.swt-qr-foot .swt-qr-btn.primary{background:#06C755;border-color:#06C755;color:#fff}',
    '.swt-qr-foot .swt-qr-btn.primary:hover{background:#05B04C}',
    '.swt-qr-foot .swt-qr-btn.close{margin-left:auto}',

    /* Invoice QR card — inline on invoice/deposit pages */
    '.swt-inv-qr{background:linear-gradient(135deg,#F5F3FF,#EDE9FE);border:1px solid #DDD6FE;border-radius:10px;padding:12px 14px;margin-top:14px;font-family:Inter,"Noto Sans Thai",sans-serif;box-shadow:0 1px 3px rgba(91,33,182,0.08)}',
    '.swt-invq-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px dashed #C4B5FD}',
    '.swt-invq-title{font-size:12px;font-weight:700;color:#5B21B6;letter-spacing:0.02em}',
    '.swt-invq-biller{font-size:10px;color:#6B7280;font-family:Inter,monospace;font-weight:600}',
    '.swt-invq-body{display:flex;gap:12px;align-items:flex-start}',
    '.swt-invq-img-wrap{padding:6px;background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(91,33,182,0.1);flex-shrink:0}',
    '.swt-invq-img-wrap img{display:block;width:140px;height:140px}',
    '.swt-invq-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;font-size:11.5px}',
    '.swt-invq-row{display:flex;align-items:center;gap:8px;line-height:1.3}',
    '.swt-invq-lbl{font-size:9.5px;font-weight:700;color:#7C3AED;letter-spacing:0.05em;min-width:36px}',
    '.swt-invq-val{font-weight:600;color:#111827;word-break:break-all}',
    '.swt-invq-val.mono{font-family:Inter,monospace;font-size:11px;background:#fff;border:1px solid #E5E7EB;padding:1px 6px;border-radius:3px}',
    '.swt-invq-row.amt{margin-top:4px;padding-top:6px;border-top:1px dashed #C4B5FD}',
    '.swt-invq-val.amt-val{font-size:15px;color:#059669;font-family:Inter,monospace;font-variant-numeric:tabular-nums}',
    '.swt-invq-foot{display:flex;align-items:center;gap:6px;margin-top:10px;padding-top:8px;border-top:1px dashed #C4B5FD;flex-wrap:wrap}',
    '.swt-invq-btn{padding:4px 9px;border:1px solid #C4B5FD;background:#fff;border-radius:4px;font-size:10.5px;font-family:inherit;cursor:pointer;color:#5B21B6;font-weight:600;transition:all .12s}',
    '.swt-invq-btn:hover{background:#7C3AED;color:#fff;border-color:#7C3AED}',
    '.swt-invq-hint{font-size:10px;color:#6B7280;margin-left:auto;line-height:1.3}',
    '@media print{.swt-inv-qr{break-inside:avoid;background:#fff;border:1px solid #000;box-shadow:none}.swt-invq-foot{display:none}.swt-invq-head{border-bottom:1px solid #000}}'
  ].join('');

  function injectStyle() {
    if (document.getElementById('swt-link-style')) return;
    var s = document.createElement('style');
    s.id = 'swt-link-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  // ── Doc-no scanner ───────────────────────────────────────
  function shouldSkip(parent) {
    if (!parent || !parent.tagName) return true;
    var tag = parent.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'A' ||
        tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'OPTION' ||
        tag === 'BUTTON' || tag === 'SUMMARY') return true;
    if (parent.closest && parent.closest('.swt-sb,.swt-no-link,a,button,input,textarea')) return true;
    return false;
  }

  function scanTextNode(node) {
    var txt = node.nodeValue;
    if (!txt) return;
    RE.lastIndex = 0;
    if (!RE.test(txt)) return;
    RE.lastIndex = 0;

    var frag = document.createDocumentFragment();
    var last = 0, m, made = 0;
    while ((m = RE.exec(txt)) !== null) {
      var url = urlFor(m[1]);
      if (!url) continue;
      if (m.index > last) frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
      var a = document.createElement('a');
      a.href = url;
      a.className = 'swt-doc-link';
      a.title = 'เปิด ' + m[0] + ' (' + url + ')';
      a.textContent = m[0];
      frag.appendChild(a);
      last = m.index + m[0].length;
      made++;
    }
    if (!made) return;
    if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }

  function scan(root) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return shouldSkip(n.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(scanTextNode);
  }

  // ── Public timeline renderer ─────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  window.swtRenderTimeline = function (mountId, title, items, opts) {
    var c = document.getElementById(mountId);
    if (!c) return;
    opts = opts || {};
    var count = (items || []).length;
    // Collapsible mode: render as <details>. Default opens unless opts.collapsed === true
    var useDetails = (opts.collapsed === true || opts.collapsed === false);
    var openAttr = (opts.collapsed === true) ? '' : ' open';
    var openTag = useDetails ? ('<details class="swt-tl-card"' + openAttr + '>') : '<div class="swt-tl-card">';
    var closeTag = useDetails ? '</details>' : '</div>';
    var headTag = useDetails ? 'summary' : 'div';

    var html = openTag + '<' + headTag + ' class="swt-tl-head' + (useDetails ? ' collapsible' : '') + '">' +
               (useDetails ? '<span class="swt-tl-chev">▸</span>' : '') +
               '<span class="swt-tl-title">' + esc(title || 'Activity Timeline') + '</span>' +
               (useDetails ? '<span class="swt-tl-count">' + count + ' รายการ</span>' : '') +
               (opts.meta ? '<span class="swt-tl-meta">' + esc(opts.meta) + '</span>' : '') +
               '<span class="swt-tl-tag">SC-7 TIMELINE</span></' + headTag + '>' +
               '<div class="swt-tl-wrap"><div class="swt-tl">';
    (items || []).forEach(function (it, i) {
      var color = (it.color || 'gray').toLowerCase();
      var last = i === items.length - 1;
      // sub allows raw HTML so doc-no inside it gets re-scanned and links survive
      html += '<div class="swt-tl-item"><div class="swt-tl-left">' +
              '<div class="swt-tl-dot ' + esc(color) + '"></div>' +
              (last ? '' : '<div class="swt-tl-line"></div>') +
              '</div><div class="swt-tl-body"><div class="swt-tl-act">' +
              esc(it.action || '') +
              (it.time ? '<span class="swt-tl-time">· ' + esc(it.time) + '</span>' : '') +
              '</div>' +
              (it.sub ? '<div class="swt-tl-sub">' + esc(it.sub) + '</div>' : '') +
              '</div></div>';
    });
    html += '</div></div>' + closeTag;
    c.innerHTML = html;
    scan(c); // re-scan so doc-no inside subs become links
  };

  window.swtScanLinks = scan;

  // ── Doc-chain breadcrumb ─────────────────────────────────
  // chain item: { type:'PR', no:'PR-2604-0019', label:'ใบขอซื้อ',
  //               current:false, pending:false, href?:'override.html' }
  window.swtRenderBreadcrumb = function (chain, opts) {
    if (!Array.isArray(chain) || !chain.length) return;
    opts = opts || {};

    // Find insertion point: right after the page's .topbar
    var anchor = document.querySelector(opts.after || '.topbar');
    var bar = document.createElement('div');
    bar.className = 'swt-bc';
    bar.id = 'swt-bc-bar';

    var html = '<span class="swt-bc-label">Doc Chain</span>';
    chain.forEach(function (it, i) {
      if (i > 0) html += '<span class="swt-bc-arrow">›</span>';
      var cls = 'swt-bc-item';
      if (it.current) cls += ' current';
      if (it.pending) cls += ' pending';
      var prefix = (it.no || '').split('-')[0] || it.type || '';
      var href = it.href || (it.no ? (DOC_MAP[prefix.toUpperCase()] || '#') : '#');
      var tag = (it.current || it.pending || !it.no) ? 'span' : 'a';
      var hrefAttr = (tag === 'a') ? ' href="' + esc(href) + '"' : '';
      var titleAttr = it.no ? ' title="' + esc((it.label || '') + ' — ' + it.no) + '"' : '';
      html += '<' + tag + ' class="' + cls + '"' + hrefAttr + titleAttr + '>' +
              '<span class="swt-bc-type">' + esc(it.type || prefix) + '</span>' +
              '<span class="swt-bc-no">' + esc(it.no || it.label || '—') + '</span>' +
              (it.label && it.no ? '<span style="color:inherit;opacity:0.7;font-size:11px">· ' + esc(it.label) + '</span>' : '') +
              '</' + tag + '>';
    });
    bar.innerHTML = html;

    // Replace existing bar if re-rendered
    var existing = document.getElementById('swt-bc-bar');
    if (existing) existing.parentNode.removeChild(existing);

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(bar, anchor.nextSibling);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
  };

  // ── Convenience: auto-create mount + render ──────────────
  var _mountSeq = 0;
  window.swtAppendTimeline = function (title, items, opts) {
    opts = opts || {};
    var sel = opts.into || '.page, .main-content, main.main, .main, .app, .app-container';
    var target = document.querySelector(sel) || document.body;
    var mount = document.createElement('div');
    mount.id = 'swt-tl-mount-' + (++_mountSeq);
    mount.style.cssText = 'padding:0 32px 32px;max-width:1280px;margin:0 auto';
    target.appendChild(mount);
    window.swtRenderTimeline(mount.id, title, items, opts);
    return mount.id;
  };

  // ── Global Search palette ────────────────────────────────
  // Mock data — would come from BC365 API in production
  var MOCK_CUSTOMERS = [
    { name: 'บจก.รุ่งเรืองพาณิชย์', code: 'C-00125', tier: 'Gold', credit: '500,000' },
    { name: 'บจก.สยามอุตสาหกรรม', code: 'C-00088', tier: 'Platinum', credit: '2,000,000' },
    { name: 'หจก.เจริญทรัพย์', code: 'C-00342', tier: 'Silver', credit: '200,000' },
    { name: 'บจก.ไทยเทคโนโลยี', code: 'C-00211', tier: 'Gold', credit: '800,000' },
    { name: 'นาย วิชัย ใจดี', code: 'C-00567', tier: 'Bronze', credit: '50,000' },
    { name: 'บจก.มหาชัยกรุ๊ป', code: 'C-00099', tier: 'Platinum', credit: '3,500,000' },
    { name: 'บจก.อมรชัยพาณิชย์', code: 'C-00256', tier: 'Gold', credit: '650,000' }
  ];
  var MOCK_ITEMS = [
    { name: 'แอร์ Daikin Inverter 12000 BTU', code: 'AC-DAI-12K-INV', stock: 24, unit: 'เครื่อง' },
    { name: 'ปั๊มน้ำ Mitsubishi 250W', code: 'PMP-MIT-250W', stock: 8, unit: 'ตัว' },
    { name: 'ตู้เย็น Samsung 2 ประตู 14Q', code: 'REF-SAM-14Q-2D', stock: 12, unit: 'เครื่อง' },
    { name: 'พัดลมตั้งโต๊ะ Hatari 16"', code: 'FAN-HAT-16T', stock: 87, unit: 'ตัว' },
    { name: 'ไมโครเวฟ Toshiba 25L', code: 'MWO-TOS-25L', stock: 5, unit: 'เครื่อง' },
    { name: 'เครื่องซักผ้า LG 9 กก.', code: 'WSH-LG-9KG', stock: 0, unit: 'เครื่อง' },
    { name: 'หม้อหุงข้าว Sharp 1.8L', code: 'RC-SHA-1.8L', stock: 42, unit: 'ใบ' }
  ];

  function fuzzy(needle, hay) {
    if (!needle) return 0;
    needle = needle.toLowerCase();
    hay = hay.toLowerCase();
    if (hay === needle) return 100;
    if (hay.indexOf(needle) === 0) return 90;
    if (hay.indexOf(needle) > -1) return 70;
    // simple subsequence match
    var i = 0, j = 0, hits = 0;
    while (i < hay.length && j < needle.length) {
      if (hay[i] === needle[j]) { hits++; j++; }
      i++;
    }
    return j === needle.length ? 30 + Math.round(hits * 20 / needle.length) : 0;
  }

  function highlight(text, q) {
    if (!q) return esc(text);
    var t = String(text);
    var idx = t.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return esc(t);
    return esc(t.slice(0, idx)) +
           '<span class="swt-gs-mark">' + esc(t.slice(idx, idx + q.length)) + '</span>' +
           esc(t.slice(idx + q.length));
  }

  // Build page index from sidebar (auto-injected on every page)
  function buildPageIndex() {
    var pages = [];
    document.querySelectorAll('.swt-sb-links a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      var code = (a.querySelector('.c') || {}).textContent || '';
      var label = a.textContent.replace(code, '').trim();
      if (!href || !label) return;
      pages.push({ code: code.trim(), label: label, href: href });
    });
    return pages;
  }

  function search(q) {
    q = (q || '').trim();
    var groups = [];

    // 1. Doc no. exact match (e.g. "PO-2604-0034")
    var m = q.match(/^([A-Za-z]{2,5})-?(\d{4})?-?(\d{0,5})$/);
    if (m && m[1]) {
      var prefix = m[1].toUpperCase();
      var url = DOC_MAP[prefix];
      if (url) {
        var fullNo = q.toUpperCase().match(/^[A-Z]{2,5}-\d{4}-\d{3,5}$/);
        groups.push({
          label: 'เปิดเอกสาร', icon: '📄', items: [{
            title: fullNo ? q.toUpperCase() : (prefix + '-???'),
            sub: 'เปิดหน้า ' + url + ' (' + prefix + ')',
            tag: prefix, icon: '📄', href: url
          }]
        });
      }
    }

    // 2. Pages (always show top matches)
    var pageHits = buildPageIndex().map(function (p) {
      var sc = Math.max(fuzzy(q, p.label), fuzzy(q, p.code));
      return { p: p, sc: sc };
    }).filter(function (x) { return q ? x.sc > 0 : true; })
      .sort(function (a, b) { return b.sc - a.sc; })
      .slice(0, q ? 6 : 8);
    if (pageHits.length) {
      groups.push({
        label: 'หน้า / เมนู', icon: '🧭', items: pageHits.map(function (x) {
          return {
            title: x.p.label, sub: x.p.href, tag: x.p.code,
            icon: '📋', href: x.p.href, _hl: q
          };
        })
      });
    }

    // 3. Customers
    if (q) {
      var custHits = MOCK_CUSTOMERS.map(function (c) {
        var sc = Math.max(fuzzy(q, c.name), fuzzy(q, c.code));
        return { c: c, sc: sc };
      }).filter(function (x) { return x.sc > 0; })
        .sort(function (a, b) { return b.sc - a.sc; }).slice(0, 4);
      if (custHits.length) {
        groups.push({
          label: 'ลูกค้า', icon: '👥', items: custHits.map(function (x) {
            return {
              title: x.c.name, sub: x.c.code + ' · Tier ' + x.c.tier + ' · วงเงิน ' + x.c.credit,
              tag: 'MD-2', icon: '👤', href: 'md2-customer-master-mockup-v3.html', _hl: q
            };
          })
        });
      }

      // 4. Items
      var itemHits = MOCK_ITEMS.map(function (i) {
        var sc = Math.max(fuzzy(q, i.name), fuzzy(q, i.code));
        return { i: i, sc: sc };
      }).filter(function (x) { return x.sc > 0; })
        .sort(function (a, b) { return b.sc - a.sc; }).slice(0, 4);
      if (itemHits.length) {
        groups.push({
          label: 'สินค้า', icon: '📦', items: itemHits.map(function (x) {
            return {
              title: x.i.name,
              sub: x.i.code + ' · คงเหลือ ' + x.i.stock + ' ' + x.i.unit + (x.i.stock === 0 ? ' ⚠️' : ''),
              tag: 'MD-1', icon: '📦', href: 'bc365/item-master-mockup.html', _hl: q
            };
          })
        });
      }
    }

    return groups;
  }

  var GS = { open: false, q: '', items: [], active: 0 };

  function gsRender() {
    var groups = search(GS.q);
    GS.items = [];
    groups.forEach(function (g) { g.items.forEach(function (it) { GS.items.push(it); }); });
    if (GS.active >= GS.items.length) GS.active = Math.max(0, GS.items.length - 1);

    var resultsEl = document.getElementById('swt-gs-results');
    if (!resultsEl) return;

    if (!groups.length) {
      resultsEl.innerHTML = '<div class="swt-gs-empty">' +
        (GS.q ? 'ไม่พบ "' + esc(GS.q) + '"<br><span style="font-size:11px;opacity:0.7">ลองพิมพ์ Doc No. (เช่น PO-2604-0034) · ชื่อเมนู · ลูกค้า · สินค้า</span>'
              : 'พิมพ์เพื่อค้นหา · เริ่มด้วย Doc No., ชื่อเมนู, ลูกค้า, หรือสินค้า') +
        '</div>';
      return;
    }

    var idx = 0, html = '';
    groups.forEach(function (g) {
      html += '<div class="swt-gs-group"><div class="swt-gs-group-label"><span>' + esc(g.icon || '') + '</span><span>' + esc(g.label) + '</span><span class="swt-gs-group-cnt">' + g.items.length + '</span></div>';
      g.items.forEach(function (it) {
        var isActive = idx === GS.active;
        var hl = it._hl;
        html += '<a class="swt-gs-item' + (isActive ? ' active' : '') + '" href="' + esc(it.href) + '" data-idx="' + idx + '">' +
                '<div class="swt-gs-item-ic">' + esc(it.icon || '•') + '</div>' +
                '<div class="swt-gs-item-body"><div class="swt-gs-item-title">' +
                (it.tag ? '<span class="swt-gs-item-tag">' + esc(it.tag) + '</span>' : '') +
                '<span>' + (hl ? highlight(it.title, hl) : esc(it.title)) + '</span></div>' +
                '<div class="swt-gs-item-sub">' + esc(it.sub || '') + '</div></div>' +
                '<div class="swt-gs-item-arrow">↵</div></a>';
        idx++;
      });
      html += '</div>';
    });
    resultsEl.innerHTML = html;

    // Auto-scroll active into view
    var act = resultsEl.querySelector('.swt-gs-item.active');
    if (act && act.scrollIntoView) act.scrollIntoView({ block: 'nearest' });
  }

  function gsOpen() {
    if (GS.open) return;
    GS.open = true; GS.active = 0;
    document.getElementById('swt-gs-backdrop').classList.add('open');
    document.getElementById('swt-gs-modal').classList.add('open');
    var input = document.getElementById('swt-gs-input');
    input.value = GS.q || '';
    setTimeout(function () { input.focus(); input.select(); }, 0);
    gsRender();
  }
  function gsClose() {
    if (!GS.open) return;
    GS.open = false;
    document.getElementById('swt-gs-backdrop').classList.remove('open');
    document.getElementById('swt-gs-modal').classList.remove('open');
  }
  function gsActivate(i) {
    var url = GS.items[i] && GS.items[i].href;
    if (url) location.href = url;
  }

  function mountSearchUI() {
    if (document.getElementById('swt-gs-modal')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="swt-gs-backdrop" id="swt-gs-backdrop"></div>' +
      '<div class="swt-gs-modal" id="swt-gs-modal" role="dialog" aria-label="Global search">' +
      '  <div class="swt-gs-input-wrap">' +
      '    <span class="swt-gs-icon">🔍</span>' +
      '    <input class="swt-gs-input" id="swt-gs-input" type="text" placeholder="ค้นหา Doc No., เมนู, ลูกค้า, สินค้า…" autocomplete="off" spellcheck="false">' +
      '    <span class="swt-gs-kbd">ESC</span>' +
      '  </div>' +
      '  <div class="swt-gs-results" id="swt-gs-results"></div>' +
      '  <div class="swt-gs-footer">' +
      '    <span class="swt-gs-foot-key"><b>↑↓</b> เลื่อน</span>' +
      '    <span class="swt-gs-foot-key"><b>↵</b> เปิด</span>' +
      '    <span class="swt-gs-foot-key"><b>ESC</b> ปิด</span>' +
      '    <span style="margin-left:auto;opacity:0.7">เปิดด้วย <b style="font-family:monospace;background:#fff;border:1px solid #E2E8F0;border-radius:3px;padding:1px 5px">/</b> หรือ <b style="font-family:monospace;background:#fff;border:1px solid #E2E8F0;border-radius:3px;padding:1px 5px">Ctrl+K</b></span>' +
      '  </div>' +
      '</div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    var input = document.getElementById('swt-gs-input');
    input.addEventListener('input', function (e) {
      GS.q = e.target.value; GS.active = 0; gsRender();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); GS.active = Math.min(GS.items.length - 1, GS.active + 1); gsRender(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); GS.active = Math.max(0, GS.active - 1); gsRender(); }
      else if (e.key === 'Enter') { e.preventDefault(); gsActivate(GS.active); }
      else if (e.key === 'Escape') { e.preventDefault(); gsClose(); }
    });
    document.getElementById('swt-gs-backdrop').addEventListener('click', gsClose);
    document.getElementById('swt-gs-results').addEventListener('click', function (e) {
      var item = e.target.closest('.swt-gs-item');
      if (!item) return;
      // let normal anchor navigation happen
    });

    // Hotkeys: `/` and Ctrl+K (skip if typing in field)
    document.addEventListener('keydown', function (e) {
      var t = e.target;
      var inField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.key === '/' && !inField) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        gsOpen();
      }
    });
  }

  window.swtOpenSearch = gsOpen;

  // ── Barcode scan modal (mock camera) ──────────────────────
  var _bcTarget = null;
  var _bcTimer = null;
  var MOCK_BARCODE_SKUS = [
    'DAI-FTKM35', 'MIT-MSYGN18', 'SAM-AR13TY', 'CU-PIPE-3M',
    'REF-GAS-R32-1KG', 'DAI-FTKM24', 'MIT-MSYGN12', 'LG-WSH-9KG'
  ];

  function mountBarcodeModal() {
    if (document.getElementById('swt-bc-modal')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="swt-bc-backdrop" id="swt-bc-backdrop"></div>' +
      '<div class="swt-bc-modal" id="swt-bc-modal" role="dialog" aria-label="Barcode scan">' +
      '  <div class="swt-bc-head">' +
      '    <span>📷 สแกนบาร์โค้ด</span>' +
      '    <button class="swt-bc-close" id="swt-bc-close-btn">✕</button>' +
      '  </div>' +
      '  <div class="swt-bc-body">' +
      '    <div class="swt-bc-view">' +
      '      <div class="swt-bc-cam">📹 CAMERA FEED (mockup)</div>' +
      '      <div class="swt-bc-corners"></div>' +
      '      <div class="swt-bc-line"></div>' +
      '    </div>' +
      '    <div class="swt-bc-status" id="swt-bc-status">จ่อบาร์โค้ดในกรอบเพื่อสแกน...</div>' +
      '  </div>' +
      '  <div class="swt-bc-foot">' +
      '    <button class="swt-bc-btn" id="swt-bc-cancel-btn">ยกเลิก</button>' +
      '    <button class="swt-bc-btn primary" id="swt-bc-manual-btn">กรอกเอง</button>' +
      '  </div>' +
      '</div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    document.getElementById('swt-bc-close-btn').addEventListener('click', closeBarcode);
    document.getElementById('swt-bc-cancel-btn').addEventListener('click', closeBarcode);
    document.getElementById('swt-bc-backdrop').addEventListener('click', closeBarcode);
    document.getElementById('swt-bc-manual-btn').addEventListener('click', function () {
      closeBarcode();
      if (_bcTarget) { _bcTarget.focus(); }
    });
  }

  function openBarcode(inputEl) {
    mountBarcodeModal();
    _bcTarget = inputEl || null;
    var modal = document.getElementById('swt-bc-modal');
    modal.classList.remove('done');
    modal.classList.add('open');
    document.getElementById('swt-bc-backdrop').classList.add('open');
    document.getElementById('swt-bc-status').textContent = 'จ่อบาร์โค้ดในกรอบเพื่อสแกน...';
    clearTimeout(_bcTimer);
    // Simulate detection after 1.6s
    _bcTimer = setTimeout(function () {
      var sku = MOCK_BARCODE_SKUS[Math.floor(Math.random() * MOCK_BARCODE_SKUS.length)];
      modal.classList.add('done');
      document.getElementById('swt-bc-status').innerHTML = '✅ พบบาร์โค้ด:<b>' + esc(sku) + '</b>';
      // After short delay, fill target + open item search modal
      _bcTimer = setTimeout(function () {
        if (_bcTarget) { _bcTarget.value = sku; }
        closeBarcode();
        if (window.openItemSearch) window.openItemSearch();
      }, 850);
    }, 1600);
  }

  function closeBarcode() {
    clearTimeout(_bcTimer);
    var modal = document.getElementById('swt-bc-modal');
    var bd = document.getElementById('swt-bc-backdrop');
    if (modal) modal.classList.remove('open');
    if (bd) bd.classList.remove('open');
  }

  window.swtOpenBarcode = openBarcode;
  window.swtCloseBarcode = closeBarcode;

  // ── Customer QR Payment modal ─────────────────────────────
  var MOCK_OUTSTANDING = {
    'C-00125': 125400,
    'C-00088': 850000,
    'C-00342': 42300,
    'C-00211': 210500,
    'C-00567': 8900,
    'C-00099': 1250000,
    'C-00256': 395200
  };
  var SWT_BILLER_ID = '099-4-12345-6';
  var QR_CURRENT = { code: null, amountMode: 'open', customAmount: 0 };

  function custByCode(code) {
    for (var i = 0; i < MOCK_CUSTOMERS.length; i++) {
      if (MOCK_CUSTOMERS[i].code === code) return MOCK_CUSTOMERS[i];
    }
    return null;
  }

  function fmtMoney(n) {
    n = Number(n) || 0;
    return '฿' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function yymm() {
    var d = new Date();
    var yy = String(d.getFullYear()).slice(-2);
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    return yy + mm;
  }

  function buildQrPayload(code, amount) {
    // Mockup: URL-based QR (production: replace with EMVCo PromptPay string from BC API)
    var url = 'https://pay.sangwijit.co.th/c/' + encodeURIComponent(code) + '?ref2=' + yymm();
    if (amount && amount > 0) url += '&amt=' + amount.toFixed(2);
    return url;
  }

  function qrImgSrc(payload) {
    return 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=' +
           encodeURIComponent(payload);
  }

  function mountQrModal() {
    if (document.getElementById('swt-qr-modal')) return;
    var opts = MOCK_CUSTOMERS.map(function (c) {
      return '<option value="' + esc(c.code) + '">' + esc(c.name) + ' (' + esc(c.code) + ')</option>';
    }).join('');
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="swt-qr-backdrop" id="swt-qr-backdrop"></div>' +
      '<div class="swt-qr-modal" id="swt-qr-modal" role="dialog" aria-label="Customer payment QR">' +
      '  <div class="swt-qr-head">' +
      '    <span>📱 QR ชำระเงิน (รหัสลูกค้า)</span>' +
      '    <button class="swt-qr-close" id="swt-qr-close-btn">✕</button>' +
      '  </div>' +
      '  <div class="swt-qr-body">' +
      '    <div class="swt-qr-picker">' +
      '      <label>ลูกค้า</label>' +
      '      <select id="swt-qr-cust-sel">' + opts + '</select>' +
      '    </div>' +
      '    <div class="swt-qr-card">' +
      '      <div class="swt-qr-brand">' +
      '        <span class="swt-qr-brand-th">🇹🇭 Thai QR Payment</span>' +
      '        <span class="swt-qr-brand-biller">Biller ' + SWT_BILLER_ID + ' · SWT</span>' +
      '      </div>' +
      '      <div class="swt-qr-image-wrap"><img id="swt-qr-img" alt="Customer QR"></div>' +
      '      <div class="swt-qr-cust-info">' +
      '        <div class="swt-qr-cust-name" id="swt-qr-cust-name">—</div>' +
      '        <div class="swt-qr-cust-meta" id="swt-qr-cust-meta">—</div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="swt-qr-ref-grid">' +
      '      <div class="swt-qr-ref-row"><span class="swt-qr-ref-label">REF 1</span><span class="swt-qr-ref-val" id="swt-qr-ref1">—</span><span class="swt-qr-ref-hint">รหัสลูกค้า</span></div>' +
      '      <div class="swt-qr-ref-row"><span class="swt-qr-ref-label">REF 2</span><span class="swt-qr-ref-val">' + yymm() + '</span><span class="swt-qr-ref-hint">งวด YYMM</span></div>' +
      '    </div>' +
      '    <div class="swt-qr-amt">' +
      '      <label>ยอดใน QR</label>' +
      '      <div class="swt-qr-amt-row">' +
      '        <label class="swt-qr-amt-opt checked"><input type="radio" name="swt-qr-amt" value="open" checked><span>ว่าง · ให้ลูกค้ากรอกยอดเอง</span></label>' +
      '        <label class="swt-qr-amt-opt"><input type="radio" name="swt-qr-amt" value="outstanding"><span>ยอดค้างรวม <b id="swt-qr-outstanding">—</b></span></label>' +
      '        <label class="swt-qr-amt-opt"><input type="radio" name="swt-qr-amt" value="custom"><span>ระบุยอด</span><input type="number" id="swt-qr-amt-custom" placeholder="0.00" disabled step="0.01"></label>' +
      '      </div>' +
      '    </div>' +
      '    <div class="swt-qr-hint">💡 ลูกค้าแสกนผ่าน Mobile Banking → เงินเข้าบัญชี SWT พร้อม <b>Ref 1 = รหัสลูกค้า</b> → ระบบนำเข้า <b>FI-1 Apply Queue</b> ให้ AR ตัดหนี้ (FIFO หรือเลือก invoice เอง)</div>' +
      '  </div>' +
      '  <div class="swt-qr-foot">' +
      '    <button class="swt-qr-btn" id="swt-qr-dl">📥 PNG</button>' +
      '    <button class="swt-qr-btn" id="swt-qr-copy">📋 คัดลอกลิงก์</button>' +
      '    <button class="swt-qr-btn primary" id="swt-qr-line">💬 ส่ง LINE</button>' +
      '    <button class="swt-qr-btn close" id="swt-qr-close-btn2">ปิด</button>' +
      '  </div>' +
      '</div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    document.getElementById('swt-qr-close-btn').addEventListener('click', closeCustomerQR);
    document.getElementById('swt-qr-close-btn2').addEventListener('click', closeCustomerQR);
    document.getElementById('swt-qr-backdrop').addEventListener('click', closeCustomerQR);
    document.getElementById('swt-qr-cust-sel').addEventListener('change', function (e) {
      QR_CURRENT.code = e.target.value;
      refreshQr();
    });
    document.querySelectorAll('input[name="swt-qr-amt"]').forEach(function (r) {
      r.addEventListener('change', function () {
        QR_CURRENT.amountMode = r.value;
        document.querySelectorAll('.swt-qr-amt-opt').forEach(function (o) { o.classList.remove('checked'); });
        r.closest('.swt-qr-amt-opt').classList.add('checked');
        var custom = document.getElementById('swt-qr-amt-custom');
        custom.disabled = r.value !== 'custom';
        if (r.value === 'custom') custom.focus();
        refreshQr();
      });
    });
    document.getElementById('swt-qr-amt-custom').addEventListener('input', function (e) {
      QR_CURRENT.customAmount = Number(e.target.value) || 0;
      refreshQr();
    });
    document.getElementById('swt-qr-dl').addEventListener('click', function () {
      var a = document.createElement('a');
      a.href = document.getElementById('swt-qr-img').src;
      a.download = 'QR-' + (QR_CURRENT.code || 'customer') + '.png';
      a.target = '_blank';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
    document.getElementById('swt-qr-copy').addEventListener('click', function () {
      var payload = currentPayload();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(payload).then(function () {
          var btn = document.getElementById('swt-qr-copy');
          var orig = btn.innerHTML;
          btn.innerHTML = '✅ คัดลอกแล้ว';
          setTimeout(function () { btn.innerHTML = orig; }, 1400);
        });
      } else {
        window.prompt('คัดลอกลิงก์นี้:', payload);
      }
    });
    document.getElementById('swt-qr-line').addEventListener('click', function () {
      var cust = custByCode(QR_CURRENT.code);
      var payload = currentPayload();
      var amt = qrAmount();
      var msg = 'สวัสดีครับ ' + (cust ? cust.name : '') +
                '\nยอดค้างชำระ ณ วันที่ ' + new Date().toLocaleDateString('en-GB') +
                (amt > 0 ? ' = ' + fmtMoney(amt) : '') +
                '\nแสกน QR เพื่อชำระเงิน: ' + payload +
                '\n(Ref 1 = ' + QR_CURRENT.code + ')';
      var url = 'https://line.me/R/msg/text/?' + encodeURIComponent(msg);
      window.open(url, '_blank');
    });
  }

  function qrAmount() {
    if (QR_CURRENT.amountMode === 'outstanding') return MOCK_OUTSTANDING[QR_CURRENT.code] || 0;
    if (QR_CURRENT.amountMode === 'custom') return QR_CURRENT.customAmount || 0;
    return 0;
  }

  function currentPayload() {
    return buildQrPayload(QR_CURRENT.code || 'UNKNOWN', qrAmount());
  }

  function refreshQr() {
    var cust = custByCode(QR_CURRENT.code);
    var outstanding = MOCK_OUTSTANDING[QR_CURRENT.code] || 0;
    document.getElementById('swt-qr-cust-name').textContent = cust ? cust.name : '—';
    document.getElementById('swt-qr-cust-meta').textContent = cust ? (cust.code + ' · Tier ' + cust.tier + ' · วงเงิน ' + cust.credit) : '—';
    document.getElementById('swt-qr-ref1').textContent = QR_CURRENT.code || '—';
    document.getElementById('swt-qr-outstanding').textContent = fmtMoney(outstanding);
    document.getElementById('swt-qr-img').src = qrImgSrc(currentPayload());
  }

  function openCustomerQR(code, opts) {
    mountQrModal();
    opts = opts || {};
    if (!code && MOCK_CUSTOMERS.length) code = MOCK_CUSTOMERS[0].code;
    QR_CURRENT.code = code;
    QR_CURRENT.amountMode = opts.amountMode || 'open';
    QR_CURRENT.customAmount = opts.amount || 0;
    var sel = document.getElementById('swt-qr-cust-sel');
    if (sel) sel.value = code;
    document.querySelectorAll('input[name="swt-qr-amt"]').forEach(function (r) {
      r.checked = (r.value === QR_CURRENT.amountMode);
    });
    document.querySelectorAll('.swt-qr-amt-opt').forEach(function (o) {
      o.classList.toggle('checked', o.querySelector('input').checked);
    });
    var custom = document.getElementById('swt-qr-amt-custom');
    custom.disabled = QR_CURRENT.amountMode !== 'custom';
    custom.value = opts.amount ? String(opts.amount) : '';
    refreshQr();
    document.getElementById('swt-qr-backdrop').classList.add('open');
    document.getElementById('swt-qr-modal').classList.add('open');
  }

  function closeCustomerQR() {
    var m = document.getElementById('swt-qr-modal');
    var b = document.getElementById('swt-qr-backdrop');
    if (m) m.classList.remove('open');
    if (b) b.classList.remove('open');
  }

  window.swtOpenCustomerQR = openCustomerQR;
  window.swtCloseCustomerQR = closeCustomerQR;

  // ── Invoice QR (ชั้น 2 — ตัดจากเลขที่บิล) ─────────────────
  // Inline card (always visible on invoice/deposit page + print view)
  // opts: { docNo, amount, custCode, custName, dueDate, title, payHint }
  window.swtRenderInvoiceQR = function (mountId, opts) {
    var c = document.getElementById(mountId);
    if (!c) return;
    opts = opts || {};
    var docNo = opts.docNo || 'INV-0000-0000';
    var amount = Number(opts.amount) || 0;
    var custCode = opts.custCode || '';
    var title = opts.title || '💠 Thai QR ชำระเงิน';
    var payload = 'https://pay.sangwijit.co.th/d/' + encodeURIComponent(docNo) +
                  (custCode ? '?c=' + encodeURIComponent(custCode) : '') +
                  (amount > 0 ? (custCode ? '&' : '?') + 'amt=' + amount.toFixed(2) : '');
    var imgSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=' + encodeURIComponent(payload);
    var amtStr = fmtMoney(amount);
    c.className = 'swt-inv-qr';
    c.innerHTML =
      '<div class="swt-invq-head">' +
      '  <span class="swt-invq-title">' + esc(title) + '</span>' +
      '  <span class="swt-invq-biller">Biller ' + SWT_BILLER_ID + '</span>' +
      '</div>' +
      '<div class="swt-invq-body">' +
      '  <div class="swt-invq-img-wrap"><img alt="Invoice QR" src="' + imgSrc + '"></div>' +
      '  <div class="swt-invq-info">' +
      '    <div class="swt-invq-row"><span class="swt-invq-lbl">REF 1</span><span class="swt-invq-val mono">' + esc(docNo) + '</span></div>' +
      (custCode ? '    <div class="swt-invq-row"><span class="swt-invq-lbl">REF 2</span><span class="swt-invq-val mono">' + esc(custCode) + '</span></div>' : '') +
      '    <div class="swt-invq-row amt"><span class="swt-invq-lbl">ยอด</span><span class="swt-invq-val amt-val">' + amtStr + '</span></div>' +
      (opts.dueDate ? '    <div class="swt-invq-row"><span class="swt-invq-lbl">ครบ</span><span class="swt-invq-val">' + esc(opts.dueDate) + '</span></div>' : '') +
      '  </div>' +
      '</div>' +
      '<div class="swt-invq-foot">' +
      '  <button class="swt-invq-btn" onclick="(function(a){var x=document.createElement(\'a\');x.href=a;x.download=\'QR-' + esc(docNo) + '.png\';x.target=\'_blank\';document.body.appendChild(x);x.click();document.body.removeChild(x);})(\'' + imgSrc + '\')">📥 PNG</button>' +
      '  <button class="swt-invq-btn" data-swt-invq-copy="' + esc(payload) + '">📋 Copy</button>' +
      '  <span class="swt-invq-hint">' + esc(opts.payHint || 'ลูกค้าแสกนผ่าน Mobile Banking') + '</span>' +
      '</div>';
    var btn = c.querySelector('[data-swt-invq-copy]');
    if (btn) btn.addEventListener('click', function () {
      var p = btn.getAttribute('data-swt-invq-copy');
      if (navigator.clipboard) navigator.clipboard.writeText(p).then(function () {
        var orig = btn.innerHTML; btn.innerHTML = '✅ Copied';
        setTimeout(function () { btn.innerHTML = orig; }, 1200);
      });
      else window.prompt('คัดลอกลิงก์:', p);
    });
  };

  // ── Promo counter — updates any `.promo-counter` element on page ──
  function updatePromoCounters() {
    var all = document.querySelectorAll('.promo-pill').length;
    var applied = document.querySelectorAll('.promo-pill.applied').length;
    document.querySelectorAll('.promo-counter').forEach(function (c) {
      c.innerHTML = '<b>' + applied + '</b> / ' + all + ' ใช้แล้ว';
    });
  }
  window.swtUpdatePromoCounters = updatePromoCounters;

  // ── Header search + line-input wiring ─────────────────────
  function wireSearchCombo() {
    // Customer/Vendor button in header → open global search palette
    document.querySelectorAll('[data-customer-search],[data-vendor-search]').forEach(function (el) {
      if (el.dataset.swtCsBound) return;
      el.dataset.swtCsBound = '1';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.swtOpenSearch) {
          window.swtOpenSearch();
        } else {
          window.open('sc1-customer-search-mockup.html', '_blank');
        }
      });
    });
    // Auto-inject Customer QR button next to every [data-customer-search]
    document.querySelectorAll('[data-customer-search]').forEach(function (btn) {
      var combo = btn.closest('.swt-search-combo');
      if (!combo) return;
      if (combo.querySelector('[data-customer-qr]')) return;
      var qr = document.createElement('button');
      qr.type = 'button';
      qr.className = 'swt-qr-btn-inline';
      qr.setAttribute('data-customer-qr', '');
      qr.setAttribute('title', 'QR ชำระเงิน (รหัสลูกค้า)');
      qr.innerHTML = '📱 QR';
      combo.appendChild(qr);
      qr.addEventListener('click', function (e) {
        e.preventDefault();
        var input = combo.querySelector('input[type="text"]');
        var code = null;
        if (input && input.value) {
          var m = input.value.match(/C-\d{5}/);
          if (m) code = m[0];
        }
        openCustomerQR(code);
      });
    });
    // Line-item textbox → Enter opens SC-2 item modal
    document.querySelectorAll('input.swt-item-input').forEach(function (inp) {
      if (inp.dataset.swtIiBound) return;
      inp.dataset.swtIiBound = '1';
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (window.openItemSearch) window.openItemSearch();
        }
      });
    });
    // Auto-inject barcode scan button into every swt-search-combo that has .swt-item-input
    document.querySelectorAll('input.swt-item-input').forEach(function (inp) {
      var combo = inp.closest('.swt-search-combo');
      if (!combo) return;
      if (combo.querySelector('[data-barcode-scan]')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swt-scan-btn';
      btn.setAttribute('data-barcode-scan', '');
      btn.setAttribute('title', 'สแกนบาร์โค้ด (Alt+B)');
      btn.innerHTML = '📷 สแกน';
      combo.appendChild(btn);
    });
    // Wire barcode scan buttons
    document.querySelectorAll('[data-barcode-scan]').forEach(function (el) {
      if (el.dataset.swtBcBound) return;
      el.dataset.swtBcBound = '1';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var combo = el.closest('.swt-search-combo');
        var input = combo ? combo.querySelector('input.swt-item-input') : null;
        openBarcode(input);
      });
    });
    // Promo pill click → toggle applied/available
    document.querySelectorAll('.promo-pill').forEach(function (el) {
      if (el.dataset.swtPpBound) return;
      el.dataset.swtPpBound = '1';
      // Default state: available (unless explicitly .applied)
      if (!el.classList.contains('applied') && !el.classList.contains('available')) {
        el.classList.add('available');
      }
      el.addEventListener('click', function (e) {
        e.preventDefault();
        el.classList.toggle('applied');
        el.classList.toggle('available');
        updatePromoCounters();
      });
    });
    updatePromoCounters();
    // Alt+B global hotkey
    if (!window._swtBcKeyBound) {
      window._swtBcKeyBound = true;
      document.addEventListener('keydown', function (e) {
        if (e.altKey && (e.key === 'b' || e.key === 'B')) {
          e.preventDefault();
          var firstInput = document.querySelector('input.swt-item-input');
          openBarcode(firstInput);
        }
        if (e.key === 'Escape') {
          var modal = document.getElementById('swt-bc-modal');
          if (modal && modal.classList.contains('open')) closeBarcode();
        }
      });
    }
  }

  // ── SC-19 BC Field Tooltip ────────────────────────────────
  var BC_FIELDS = {
    'Customer No.': 'customers?$select=number,displayName',
    'Vendor No.': 'vendors?$select=number,displayName',
    'Item No.': 'items?$select=number,displayName',
    'Quantity': 'salesLines.quantity',
    'Unit Price': 'salesLines.unitPrice',
    'Amount': 'salesLines.amountIncludingVAT',
    'Posting Date': 'header.postingDate',
    'Due Date': 'header.dueDate'
  };

  window.swtBcTooltip = function (fieldEl, bcFieldName, opts) {
    opts = opts || {};
    if (!fieldEl || !bcFieldName) return;
    var host = fieldEl.parentElement || fieldEl;
    if (host.querySelector('.swt-bc-tip')) return;
    var tip = document.createElement('span');
    tip.className = 'swt-bc-tip';
    tip.title = '';
    tip.textContent = '?';
    tip.setAttribute('aria-label', 'BC field: ' + bcFieldName);
    tip.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;margin-left:4px;border-radius:50%;background:#EFF6FF;color:#2563EB;font-size:10px;font-weight:800;cursor:help;vertical-align:middle';
    var path = opts.odataPath || BC_FIELDS[bcFieldName] || bcFieldName;
    tip.addEventListener('mouseenter', function () {
      tip.title = 'BC: ' + bcFieldName + '\nOData: ' + path;
    });
    if (host.querySelector('label')) host.querySelector('label').appendChild(tip);
    else host.insertBefore(tip, fieldEl.nextSibling);
    return tip;
  };

  window.swtBcTooltipEnable = function (root, enabled) {
    root = root || document;
    root.querySelectorAll('.swt-bc-tip').forEach(function (t) {
      t.style.display = enabled === false ? 'none' : 'inline-flex';
    });
  };

  // ── Boot ──────────────────────────────────────────────────
  function boot() {
    injectStyle();
    scan(document.body);
    mountSearchUI();
    wireSearchCombo();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot