# 05 — Page Catalog (สถานะทุกหน้า + ประวัติ archive)

> **regenerated 2026-07-24 จาก `swt-sidebar.js` (= source of truth)** — แทนของเดิมที่ค้างยุคเก่า (ยังอ้าง SL-5/6/7, SM ที่เลิกใช้)
> สถานะดึงจาก `DONE[]` ใน sidebar · **✦ เสร็จ · ○ ยังไม่เสร็จ · ◐ stub**
> **83 หน้าจริง: ✦ 61 · ○ 21 · ◐ 1** (113 เมนู — บางเมนูใช้ไฟล์ร่วมกัน เช่น รายงานทุกโมดูล → `rp1-report-center`)
> ⚠️ กฎ: แก้ sidebar เมื่อไร → regen ไฟล์นี้ (อย่าแก้มือให้ drift ซ้ำ) · วันที่ = ค.ศ. (ตาม decision 2026-04-16)

---

## 🧭 นำทาง / สถาปัตยกรรม (ไม่ใช่หน้าโมดูล)
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| IDX | Master Index | index.html | — เครื่องมือ |
| FLOW | Module Flow Overview (spine + per-module + ✦) | module-flow-overview.html | — แผนที่ |
| ARCH | Architecture | sangwijit-portal-architecture.html | — doc |
| SPEC | Dev Handoff | dev-handoff-spec.html | — doc |

## 💰 SL — งานขาย
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| SL-Q | คิวงานขาย | slq-sales-queue-mockup.html | ✦ |
| SL-1 | ใบเสนอราคา (Unified · Item+Service+Charge) | sl1-quotation-mockup.html | ✦ |
| SL-2 | ใบจอง | sl2-reservation-mockup.html | ✦ |
| SL-3 | ใบมัดจำ | sl3-deposit-mockup.html | ✦ |
| SL-4 | บิลขาย | sl4-invoice-mockup.html | ✦ |
| SL-CN | ใบลดหนี้ขาย | slcn-credit-memo-mockup.html | ✦ |
| SL-F1 | อนุมัติวงเงินขาย | slf1-credit-approval-mockup.html | ✦ |
| CM-1 | Commission | cm1-commission-mockup.html | ✦ |
| SL-R (SLR1-5) | รายงานขาย 5 มุม | rp1-report-center-mockup.html | ○ (ชี้ report center) |

## 🎁 PM — โปรโมชั่น & ราคา
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| PM-1 | รายการราคา (Price List) | pm1-price-list-mockup.html | ○ |
| PM-2 | ตั้งโปรโมชั่น (6 แบบ · dynamic) | pm2-promotion-mockup.html | ✦ |
| PM-4 | โควต้าโปรโมชั่น (งบแบรนด์/เพดานบริษัท) | pm4-promo-quota-mockup.html | ✦ |
| PM-5 | จำลองราคาขาย (ราคา+กำไร+โปร) | pm5-price-simulator-mockup.html | ○ |
| PM-Q | โปรโมชั่นที่รันอยู่ | pmq-promo-dashboard-mockup.html | ✦ |

## 🛒 PO — งานจัดซื้อ
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| PO-Q | Purchase Queue | poq-purchase-queue-mockup.html | ✦ |
| PO-1 | ใบขอสั่งซื้อ (PR) | po1-purchase-request-mockup.html | ✦ |
| PO-2 | Trade Agreement / Vendor | po2-rfq-mockup.html | ✦ |
| PO-4 | ใบสั่งซื้อ (PO) | po4-purchase-order-mockup.html | ✦ |
| PO-6 | ใบตั้งหนี้เจ้าหนี้ (AP) | po6-ap-invoice-mockup.html | ✦ |
| PO-7 | ส่งเสริมการขาย (Rebate) | po7-rebate-dashboard.html | ✦ |
| PO-8 | บิลฝาก (Deposit) | po8-deposit-bill-mockup.html | ✦ |
| PO-CN | ใบลดหนี้เจ้าหนี้ | po-cn-credit-note-mockup.html | ✦ |
| PO-R (POR1-4) | รายงานจัดซื้อ 4 มุม | rp1-report-center-mockup.html | ○ (ชี้ report center) |

## 📦 WH — งานคลังสินค้า
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| WH-Q1 | คิวรับสินค้า | wh-q1-receive-queue-mockup.html | ✦ |
| WH-Q2 | คิวเบิกสินค้า | wh-q2-issue-queue-mockup.html | ✦ |
| WH-1 | ใบรับสินค้า | wh1-receive-mockup.html | ✦ |
| WH-2 | ใบเบิกสินค้า | wh2-issue-mockup.html | ✦ |
| WH-2R | ใบขอเบิก | wh2r-issue-request-mockup.html | ✦ |
| WH-3 | ใบโอนสินค้า | wh3-transfer-mockup.html | ✦ |
| WH-3R | ใบขอโอน | wh3r-transfer-request-mockup.html | ✦ |
| WH-4 | ใบนับสินค้า | wh4-count-mockup.html | ✦ |
| WH-4R | ใบเตรียมนับ | wh4r-count-prep-mockup.html | ✦ |
| WH-5 | ปรับ/ตัดจำหน่ายสต็อก | wh5-stock-adjustment-mockup.html | ✦ |
| WH-R (WHR1-2) | Stock Card / คงเหลือ / ความเคลื่อนไหว | wh-r-stock-card-mockup.html | ✦ |
| WH-NM | สินค้าไม่เคลื่อนไหว | wh-nm-non-move-report-mockup.html | ○ |
| WHR3 | รายงานอายุสินค้า | rp1-report-center-mockup.html | ○ (ชี้ report center) |

## 🏦 FI — บัญชี / การเงิน
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| FI-Q (AR/AP) | คิวลูกหนี้ / เจ้าหนี้ | fiq-finance-queue-mockup.html | ✦ |
| FI-1 | รับชำระลูกหนี้ (AR) | fi1-ar-receive-mockup.html | ✦ |
| FI-1Q | คิว Apply | fi1q-apply-queue-mockup.html | ✦ |
| FI-2 | จ่ายชำระเจ้าหนี้ (AP) | fi2-ap-payment-mockup.html | ✦ |
| FI-3 | กระทบยอดธนาคาร | fi3-bank-reconciliation-mockup.html | ○ |
| FI-4 | ค่าใช้จ่าย / WHT | fi4-expense-wht-mockup.html | ✦ |
| FI-7 | รายงานภาษีขาย/ซื้อ | fi7-vat-report-mockup.html | ○ |
| FI-12 | WHT (ภ.ง.ด.3/53) | fi12-wht-mockup.html | ✦ |
| FIR1-3 | รายงานการเงิน (Aging / กระแสเงินสด / รับ-จ่ายวัน) | rp1-report-center-mockup.html | ○ (ชี้ report center) |

## 🔧 SV — งานบริการ + เคลม
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| SV-Q | คิวงานซ่อม (dashboard ช่าง) | sv-q-service-queue-mockup.html | ✦ |
| SV-1 | ใบรับงานซ่อม (5 job types) | sv1-service-intake-mockup.html | ✦ |
| SV-2 | ใบมอบหมายช่าง | sv2-service-assignment-mockup.html | ✦ |
| SV-3 | เบิกอะไหล่ (จากสต็อก) | sv3-spare-part-issue-mockup.html | ✦ |
| SV-Order | สั่งอะไหล่นอกประกัน (spawn PO) | sv-order-parts-request-mockup.html | ✦ |
| SV-4 | ปิดงาน/QA + บิล (payer/ARI) | sv4-service-close-mockup.html | ✦ |
| SV-5 | Job Card (ช่างบันทึกงาน) | sv5-job-card-mockup.html | ✦ |
| SV-6 | ส่ง+ติดตั้ง (ของขาย) | sv6-delivery-install-mockup.html | ✦ |
| SV-7 | ส่งงานคืนลูกค้า | sv7-service-delivery-mockup.html | ✦ |
| SV-SQT | เสนอราคางานบริการ | sqt-service-quotation-mockup.html | ✦ |
| CLM | ใบเคลม Vendor (product claim) | clm-vendor-claim-mockup.html | ✦ |
| SVWH | คลังศูนย์ซ่อม (6 bins) | wh-svc-center-mockup.html | ✦ |
| SVTC | สรุปงานช่าง → ค่าแรง/คอม | cm1-commission-mockup.html | ✦ (ชี้ CM-1) |
| SVPD | เอกสารบริการที่โพสต์แล้ว | sv-q-service-queue-mockup.html | ✦ (ชี้ SV-Q) |
| SVMA | สัญญาดูแลรายปี MA | sv-ma-contract-mockup.html | ○ |
| SVMB | 📱 หน้าจอมือถือช่างภาคสนาม | sv-tech-mobile-mockup.html | ○ |
| SVCK / SVSLA | เช็คลิสต์ล้าง-ตรวจ / ตั้งค่า SLA | cf-master-settings-mockup.html | ○ (ชี้ master settings) |
| SV-R (SVR1-4) | รายงานบริการ 4 มุม | rp1-report-center-mockup.html | ○ (ชี้ report center) |

## 🗂️ MD — ข้อมูลหลัก
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| MD-1 | ทะเบียนสินค้า (BC365) | md1-item-master-mockup-v3.html | ✦ |
| MD-2 | ทะเบียนลูกค้า | md2-customer-master-mockup-v3.html | ✦ |
| MD-3 | ทะเบียน Vendor | md3-vendor-master-mockup-v3.html | ✦ |
| MD-4 | ทะเบียนพนักงาน | md4-employee-master-mockup-v3.html | ✦ |
| MD-5a/b | ทะเบียนสาขา / คลัง | md5-branch-warehouse-mockup-v3.html | ✦ |

## ⚙️ CF — ตั้งค่าระบบ
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| CF-1 | สิทธิ์ผู้ใช้ (กลุ่มสิทธิ์การใช้งาน + RBAC) | cf1-rbac-permission-mockup.html | ✦ |
| CF-2 | Config Hub | cf2-config-hub-mockup.html | ○ |
| CF-2.1 | Tax Setup (VAT + WHT Thai loc) | cf2-1-tax-setup-mockup.html | ✦ |
| CF-2.2 | Running No. | cf2-2-number-series-mockup.html | ✦ |
| CF-2.5 | Template ช่าง | cf2-5-tech-template-mockup.html | ○ |
| CF-2.6 | Approval Matrix (12 WF · 6 tabs) | cf2-6-approval-matrix-mockup.html | ✦ |
| CF-2.7 | Doc Template (22 doc · 3-pane) | cf2-7-doc-template-mockup.html | ✦ |
| CF-2.9 | ค่าตั้งต้น | cf2-9-general-parameter-mockup.html | ○ |
| CF-CO | ตั้งค่าบริษัท + ค่าเริ่มต้น | cf-company-settings-mockup.html | ✦ |
| CF-MS | ตั้งค่า Master (บัตร·สี·เหตุผลสต็อก·position·income·rebate) | cf-master-settings-mockup.html | ○ |
| CF-3 | Payment Hub (stub) | cf-master-settings-mockup.html | ◐ stub (ชี้ master settings) |
| CF-5 | Bank Master (stub) | cf-company-settings-mockup.html | ◐ stub (ชี้ company settings) |

## 🧩 SC — Shared Components
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| SC-CAT | SC Catalog คู่มือ+ทด API | sc-shared-catalog-mockup.html | ○ |
| SC-1 | ค้นหาลูกค้า | sc1-customer-search-mockup.html | ○ |
| SC-2 | ค้นหาสินค้า (v2 · 3-type · 8-tab · 6 stock cols · FX) | sc2-item-search-mockup.html | ✦ |
| SC-3 | ค้นหาเจ้าหนี้ | sc3-vendor-search-mockup.html | ✦ |
| SC-7 | Timeline | sc7-timeline-mockup.html | ○ |

## 📊 อื่น ๆ (อนุมัติ · ผู้บริหาร · Integration · Report)
| รหัส | ชื่อ | ไฟล์ | สถานะ |
|---|---|---|---|
| AP-1 | ศูนย์อนุมัติกลาง | ap1-approval-center-mockup.html | ✦ |
| EX-1 | Dashboard ผู้บริหาร | ex1-executive-dashboard-mockup.html | ○ |
| RP-1 | Report Center (แม่ · ทุกโมดูลชี้มาที่นี่) | rp1-report-center-mockup.html | ○ |
| IA-Q | BC Sync Monitor | iaq-bc-sync-monitor-mockup.html | ○ |

---

## 🗄️ ประวัติหน้าที่ยกเลิก / เก็บเข้า archive (อ้างอิง)

> รวบจาก `_archive/README.md` + `.agents/active.md` + git · **เก็บไว้เป็นประวัติว่าเปลี่ยนเพราะอะไร** ไม่ใช่รายการงานค้าง
> ป้าย: ✂️ ตัดทิ้ง · 🔗 ยุบรวม · 🏷️ ย้าย/เปลี่ยนเลข · 📄 เวอร์ชันเก่า/สาธิต

| หน้า (รหัส / ชื่อเดิม) | ไฟล์ใน `_archive/` | วันที่ | เหตุผล / แทนที่ด้วยอะไร |
|---|---|---|---|
| SV-2 ใบแจ้งหนี้ศูนย์บริการ | sv2-service-invoice-mockup.html | 2026-04-23 | ✂️ ใช้บิลขายตัวเดียวกับงานขายได้ → SL-4 บิลขาย |
| SV-4 ตรวจประกัน | sv4-warranty-check-mockup.html | 2026-04-23 | 🔗 ยุบเป็นส่วนของการรับงาน → SV-1 รับงานบริการ |
| FI-3 กระทบยอดภาษี | fi3-tax-reconciliation-mockup.html | 2026-06-07 | ✂️ BC มีรายงานภาษีไทย (VAT/WHT) ครบ → ระบบ BC |
| SM-1 วางแผนช่องสินค้า (SKU slot) | sm1-sku-slot-planner-mockup.html | 2026-06-07 | ✂️ ยกเลิกทั้งกลุ่ม SM — ยังไม่ถึงเฟสที่ต้องใช้ |
| SM-2 ตรวจสุขภาพ SKU | sm2-sku-health-mockup.html | 2026-06-07 | ✂️ ยกเลิกทั้งกลุ่ม SM |
| SM-3 รายงานผู้ขาย | sm3-vendor-report-mockup.html | 2026-06-07 | ✂️ ยกเลิกทั้งกลุ่ม SM |
| PO-5 ใบรับสินค้าฝั่งบัญชี (Finance GRN) | po5-finance-grn-mockup.html | 2026-06-08 | ✂️ **ตัดถาวร** (ยืนยันซ้ำ 21 ก.ค.) — ซ้ำกับใบรับของคลัง เสี่ยงนับสต็อก 2 รอบ → WH-1 |
| SL-6 ตั้งโปรโมชั่น | sl6-promotion-setup-mockup.html | 2026-07-02 | 🏷️ ย้ายไปกลุ่มโปรโมชั่น → PM-2 |
| CL-1 เคลมรวม (ลูกค้า+ผู้ขาย) | cl1-claims-mockup.html | 2026-07-02 | 🔗 แยก 2 หน้าคนละคู่สัญญา → CLM (แบรนด์) + เคลมลูกค้าในสายบริการ |
| แผนภาพงานทั้งระบบ (flow-workflow-map) | flow-workflow-map-2026-07-04.html | 2026-07-04 | 📄 มีเวอร์ชันใหม่กว่า → module-flow-overview.html (single source) |
| WH-2↔WH-3 สลับเลข (โอน/เบิก) | wh2-issue-pickingqueue · wh3-transfer-queue -2026-07-03 | 2026-07-03 | 🏷️ สลับเลข WH-2↔WH-3 + แยกคิวหยิบ → wh2-issue · wh3-transfer |
| SL-5 ติดตามลูกค้า (CRM follow-up) | sl5-crm-followup-mockup-2026-07-12.html | 2026-07-12 | ✂️ ตัดตอนรวมหน้า → MD-2 ทะเบียนลูกค้า |
| SL-7 รายงานยอดขาย | sl7-sales-report-mockup-2026-07-12.html | 2026-07-12 | 🔗 ยุบเข้าศูนย์รายงาน → กลุ่ม RP |
| PO-3 ขึ้นทะเบียนผู้ขายใหม่ | po3-vendor-onboarding-mockup-2026-07-12.html | 2026-07-12 | ✂️ ทำในทะเบียนผู้ขายได้เลย → MD-3 |
| FI-5 ตรวจสอบลูกหนี้ (AR audit) | fi5-ar-audit-mockup-2026-07-12.html | 2026-07-12 | ✂️ ตัดตอนรวมหน้า → หน้าลูกหนี้หลัก + รายงาน BC |
| FI-13 บัญชีคู่ (Dual-Book) | fi13-dual-book-mockup-2026-07-12.html | 2026-07-12 | ✂️ BC แยกบริษัทให้อยู่แล้ว → ระบบ BC (Company/Dimension) |
| TR-1 ประมาณการกระแสเงินสด (Treasury) | tr1-treasury-mockup-2026-07-12.html | 2026-07-12 | ✂️ BC มี Cash Flow Forecast → ระบบ BC |
| SIR ใบประเมินหน้างาน | sir-site-inspection-mockup-2026-07-12.html | 2026-07-12 | 🔗 ยุบเป็นฟอร์มในแอปช่าง + ใบเสนอราคาบริการ → SVMB + SV-SQT |
| MD-6 ทะเบียนเครื่องลูกค้า (Service Item) | md6-service-item-mockup-2026-07-12.html | 2026-07-12 | ✂️ อ่านจาก BC (Item Ledger + Serial) พอ → ระบบ BC |
| PM-5 เครื่องคำนวณ VAT ทดลอง | pm5-vat-simulator-mockup-2026-07-12.html | 2026-07-12 | ✂️ ไม่ได้ใช้จริง |
| CF-3 ศูนย์รวมการชำระเงิน | cf3-payment-hub-mockup-2026-07-12.html | 2026-07-12 | ✂️ โครงเปล่า ไม่มีเนื้อหา (เหลือ stub ชี้ master settings) |
| CF-5 ทะเบียนธนาคาร | cf5-bank-master-mockup-2026-07-12.html | 2026-07-12 | ✂️ โครงเปล่า · ตั้งที่ BC → ระบบ BC (Bank Account) |
| CF สถานะเชื่อมต่อธนาคาร | cf-bank-status-mockup-2026-07-12.html | 2026-07-12 | 🔗 ยุบเป็นแท็บ 5 ของตั้งค่าบริษัท → cf-company-settings |
| WH-Q คิวงานคลังรวม | wh-q-dashboard-mockup-2026-07-12.html | 2026-07-12 | 🔗 แยก 2 คิวตามทิศทาง → WH-Q1 (ของเข้า) + WH-Q2 (ของออก) |
| SV-6 แม่แบบใบจัดส่ง/ใบงานช่าง | sv6-print-templates-mockup-2026-07-12.html | 2026-07-12 | 🔗 ยุบเข้าแม่แบบเอกสารกลาง → CF-2.7 |
| SV เช็คลิสต์ล้าง/ตรวจเช็ค | sv-checklist-template-mockup-2026-07-12.html | 2026-07-12 | 🔗 ยุบเข้าแม่แบบงานช่าง → CF-2.5 |
| SV ตั้งค่าเวลามาตรฐาน (SLA) | sv-sla-config-mockup-2026-07-12.html | 2026-07-12 | 🔗 ยุบเข้าแม่แบบงานช่าง → CF-2.5 |
| SV สรุปงานช่าง → ค่าแรง/คอม | sv-tech-report-mockup-2026-07-12.html | 2026-07-12 | 🔗 ยุบเข้าค่าคอมมิชชั่น → CM-1 |
| SV เอกสารบริการที่โพสต์แล้ว | sv-posted-docs-mockup-2026-07-12.html | 2026-07-12 | ✂️ ดูจาก BC ตรงได้ → ระบบ BC (Posted Documents) |
| SC ตัวอย่างแกลเลอรี/แนบไฟล์ | sc-media-demo-mockup-2026-07-21.html | 2026-07-21 | 📄 หน้าสาธิต ไม่มีใครลิงก์ → sc-shared-catalog |
| SC ตัวอย่างรับชำระเงิน | sc-payment-mockup-2026-07-21.html | 2026-07-21 | 📄 หน้าสาธิต ไม่มีใครลิงก์ → sc-shared-catalog |

**หมายเหตุ (ไม่นับเป็นหน้ายกเลิก):**
- **สำเนาก่อนแก้** (ตัวจริงชื่อเดิมยังใช้อยู่): `sl1-4/slq -2026-06-06`, `po1/4/6 -2026-06-07`, `po6 -2026-06-08`, `po7-rebate -2026-06-08`, `wh1-grn -2026-06-07` (rename→wh1-receive), `cf2-config-hub`, `cf2-7-doc-template -2026-06-04`, `sc1-customer-search`, `_form-template` — ไม่ได้ถูกยกเลิก
- **รุ่นทะเบียนเก่า:** `_archive/mockup-versions/` — md1(v1,v2)/md2-5 (ตัวจริงลงท้าย `-v3`)
- **ไฟล์เสีย:** `poq-…-CORRUPT-2026-07-13.html.bak` (กู้แล้ว · ตัวจริง poq-purchase-queue-mockup.html)
- **สแนปช็อต:** `renumber-snapshot-2026-06-14.tgz` (สำรองก่อนสลับเลข WH)
- **โฟลเดอร์ว่าง:** `replaced-by-bc365/` · `replaced-by-original-sc2/` (ลบทิ้งได้)
- **แหล่งบริบทเต็ม:** `_archive/README.md` (5 ป้ายเหตุผล) · `.agents/active.md` · `.agents/topics/consolidation-plan-2026-07.md` · `.agents/topics/wh-renumber-plan.md`
