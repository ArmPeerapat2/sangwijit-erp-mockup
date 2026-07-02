# File Status Audit — Sangwijit ERP Portal (2026-07-02)

> สรุปสถานะไฟล์ทั้งหมด: ตัวไหนเสร็จ / ตัวไหนต้องทำต่อ / ตัวไหนเก่าไม่ใช้แล้ว
> แหล่ง: swt-sidebar.js (73 nav) + reconcile-mockup-vs-flow-matrix + active.md DONE + งาน session 2026-07-02 + BC scope audit
> **นับ:** root .html = 79 · _archive = 32 · nav (sidebar+hub) = 73 · orphan(non-nav ที่ถูกต้อง) = 7

## Legend
- ✅ **DONE** — build บน _form-template · current · ใช้งานได้
- 🔧 **ต้องทำต่อ** — มีหน้าแล้ว แต่ต้อง rebuild/recode/polish
- 📋 **Reference-only** — เก็บเป็น reference · cut-to-BC (ไม่ build เป็น Portal)
- ⏸️ **Phase 2 / defer** — มีหน้าแล้วแต่ไม่ใช่ focus ตอนนี้
- 🔴 **Gap** — flow มี แต่ยังไม่มีหน้า
- 📦 **Archived** — ย้าย _archive แล้ว (เก่า/ไม่ใช้)

---

## 1. SL — งานขาย (7 หน้า · ✅ ครบ)

| รหัส | ไฟล์ | สถานะ | หมายเหตุ |
|---|---|---|---|
| SL-Q | slq-sales-queue-mockup | ✅ | คิวขาย · session เพิ่มกลุ่ม CN "รอออกใบจากเคลม SV" |
| SL-1 | sl1-quotation-mockup | ✅ | |
| SL-2 | sl2-reservation-mockup | ✅ | session เพิ่ม auto-expire + guard double-reserve |
| SL-3 | sl3-deposit-mockup | ✅ | session เพิ่ม badge "ขาย มัดจำ" |
| SL-4 | sl4-invoice-mockup | ✅ | session แยก Bill-to/Ship-to |
| SL-CN | slcn-credit-memo-mockup | ✅ | session refine 5 จุด (grill Q1-Q10) |
| SL-F1 | slf1-credit-approval-mockup | ✅ | ผูก CF-2.6 |

## 2. PO — จัดซื้อ (9 หน้า · ✅ ส่วนใหญ่ · 2 ต้องทำต่อ)

| รหัส | ไฟล์ | สถานะ | หมายเหตุ |
|---|---|---|---|
| PO-Q | poq-purchase-queue-mockup | ✅ | |
| PO-1 | po1-purchase-request-mockup | ✅ | |
| PO-2 | po2-rfq-mockup | 🔧 | backlog: redo เป็น Vendor Commitment (Sell-in/Rebate/Co-op) |
| PO-3 | po3-vendor-onboarding-mockup | ✅ | |
| PO-4 | po4-purchase-order-mockup | ✅ | |
| PO-6 | po6-ap-invoice-mockup | ✅ | อยู่เมนู FI · picker ดึงรายการอ้างอิง |
| PO-7 | po7-rebate-dashboard | ✅ | session: single-payment point |
| PO-8 | po8-deposit-bill-mockup | 🔧 | session rename "สั่งซื้อสินค้าฝาก" · ยังต้องทำ Deposit Pool (เรียกออกหลายปลายทาง) |
| PO-CN | po-cn-credit-note-mockup | ✅ | ใบลดหนี้ซื้อ |

## 3. WH — คลัง (7 หน้า · ✅ ครบ)

| รหัส | ไฟล์ | สถานะ | หมายเหตุ |
|---|---|---|---|
| WH-Q | wh-queue-mockup | ✅ | |
| WH-1 | wh1-grn-mockup | ✅ | session: กันรับซ้ำ (idempotent) + TR-In note |
| WH-2 | wh2-stock-transfer-mockup | ✅ | session: owner ใบโอน |
| WH-3 | wh3-sales-issue-mockup | ✅ | session: คอลัมน์สต๊อก(จองไว้) + ขอโอน→WH-2 |
| WH-4 | wh4-stock-count-mockup | ✅ | |
| WH-R | wh-r-stock-card-mockup | ✅ | report |
| WH-NM | wh-nm-non-move-report-mockup | ✅ | report |

## 4. FI — การเงิน/บัญชี (ผสม)

| รหัส | ไฟล์ | สถานะ | หมายเหตุ |
|---|---|---|---|
| FI-Q | fiq-finance-queue-mockup | ✅ | |
| FI-1 | fi1-ar-receive-mockup | ✅ | รับชำระ AR |
| FI-1Q | fi1q-apply-queue-mockup | ✅ | คิว apply เครดิต/QR |
| **FI-2** | fi2-ap-payment-mockup | 🔧 **NEXT** | จ่าย AP — ต้อง rebuild บน _form-template · ปิด chain procure-to-pay · +approval gate +WHT link (FI-12) |
| FI-3 | fi3-bank-reconciliation-mockup | ✅ | ~95% · เหลือ polish label |
| FI-7 | fi7-vat-report-mockup | ✅ | ภ.พ.30 |
| FI-12 | fi12-wht-mockup | ✅ | session: เรท dropdown + รวม pending |
| FI-4 | fi4-expense-wht-mockup | 🔧 | ค่าใช้จ่าย+WHT · session ถอดปุ่ม cert · ยัง pending recode ชื่อ (matrix: fi4→FI-5) |
| FI-5 | fi5-ar-audit-mockup | ⚠️ **candidate archive** | matrix ✂️ excess — ไม่มี flow · re-scope→FI-6 หรือยุบเข้า FI-Q |
| FI-13 | fi13-dual-book-mockup | ⏸️ defer | นอก scope SWT single-entity |
| TR-1 | tr1-treasury-mockup | ⏸️ | Treasury · ตรวจ scope P1/P2 |

## 5. CF — ตั้งค่าระบบ (ผสม Portal/BC)

| รหัส | ไฟล์ | สถานะ | หมายเหตุ |
|---|---|---|---|
| CF-1 | cf1-rbac-permission-mockup | ✅ | RBAC |
| CF-2 | cf2-config-hub-mockup | ✅ | Config Hub · 8 card |
| CF-2.2 | cf2-2-number-series-mockup | ✅ | Portal-managed (ADR-0004) |
| CF-2.5 | cf2-5-tech-template-mockup | ✅ | Portal owns |
| CF-2.6 | cf2-6-approval-matrix-mockup | ✅ | session: canonical (CF-7 = alias เก่า) |
| CF-2.7 | cf2-7-doc-template-mockup | ✅ | Portal owns |
| CF-2.1 | cf2-1-tax-setup-mockup | 📋 cut-to-BC | reference เท่านั้น |
| CF-2.9 | cf2-9-general-parameter-mockup | 📋 cut-to-BC | reference เท่านั้น |

## 6. MD — Master Data (5 หน้า · ✅ ครบ · +2 gap)

| รหัส | ไฟล์ | สถานะ |
|---|---|---|
| MD-1..5 | md1-item / md2-customer / md3-vendor / md4-employee / md5-branch-warehouse (v3) | ✅ ครบ |
| MD-6/7 | Sales/Purchase Price List | 🔴 gap — ยังไม่มีหน้า |

## 7. SV — บริการ (12 หน้า · ⏸️ Phase 2 · ต้อง rebuild ตาม grill)

> ทั้งกลุ่ม Phase 2 · **มีหน้าแล้วแต่ grill 2026-07-02 กำหนด rebuild B1-B10** (แยก job type 5 ตัว · resolution A-E · parts return · billing 2 บิล · ฯลฯ) — ดู `svc-claim-jobtype-spec.md §11`

| รหัส | ไฟล์ | สถานะ |
|---|---|---|
| SV-Q | sv-q-service-queue-mockup | ⏸️ P2 · +รายงานช่าง(B8) |
| SV-1 | sv1-service-intake-mockup | ⏸️ P2 · rebuild B1/B2 (job type 5 + A-E) |
| SV-2 | sv2-service-assignment-mockup | ⏸️ P2 |
| SV-3 | sv3-spare-part-issue-mockup | ⏸️ P2 · เบิกอะไหล่สต็อก |
| SV-O | sv-order-parts-request-mockup | ⏸️ P2 · สั่งอะไหล่นอกประกัน |
| SV-4 | sv4-service-close-mockup | ⏸️ P2 · rebuild B4 (billing 2 บิล) |
| SV-5 | sv5-job-card-mockup | ⏸️ P2 |
| SV-7 | sv7-service-delivery-mockup | ⏸️ P2 |
| SV-6 | sv6-delivery-install-mockup (+2 sub) | ⏸️ P2 · session: Ship-to note |
| CLM | clm-vendor-claim-mockup | ⏸️ P2 · เคลมสินค้า ① → PO-CN |
| SIR | sir-site-inspection-mockup | ⏸️ P2 · ตรวจ scope |
| SQT | sqt-service-quotation-mockup | ⏸️ P2 · ตรวจ scope (matrix เคย ✂️ excess) |

## 8. SC — Shared Components (4 หน้า · ✅)

| รหัส | ไฟล์ | สถานะ |
|---|---|---|
| SC-1/2/3/7 | sc1-customer-search / sc2-item-search / sc3-vendor-search / sc7-timeline | ✅ ครบ |

## 9. Cross-module / Dashboard / อื่น ๆ

| รหัส | ไฟล์ | สถานะ | หมายเหตุ |
|---|---|---|---|
| PM-5 | pm5-vat-simulator-mockup | ✅ | VAT Golden Rule sandbox |
| CM-1 | cm1-commission-mockup | ✅ | ค่าคอม · session ผูกรายงานช่าง SV |
| AP-1 | ap1-approval-center-mockup | ✅ | ศูนย์อนุมัติ |
| RP-1 | rp1-report-center-mockup | ✅ | Report Center |
| EX-1 | ex1-executive-dashboard-mockup | ⏸️ | Exec dashboard (P2/P3) |
| IA-Q | iaq-bc-sync-monitor-mockup | ⏸️ | Integration (P2/P3) |

## 10. Non-nav (ถูกต้อง · ไม่ใช่หน้าเมนู)

| ไฟล์ | บทบาท |
|---|---|
| _form-template.html | เทมเพลตกลาง (build ทุกฟอร์มจากตัวนี้) |
| login-mockup.html | หน้า login |
| notification-center-mockup.html | ศูนย์แจ้งเตือน (ผ่าน bell) |
| user-profile-mockup.html | โปรไฟล์ (ผ่าน avatar) |
| sc10-map-picker-mockup.html | shared: ปักหมุดแผนที่ (SV-6 เรียก) |
| sv6-1-booking-modal-mockup.html | SV-6 sub: booking modal |
| sv6-print-templates-mockup.html | SV-6 sub: print templates |
| index.html / portal-mockup-index.html | hub รวมลิงก์ |
| sangwijit-portal-architecture.html / dev-handoff-spec.html | เอกสารสถาปัตย์/handoff |

---

## 11. ⚠️ Candidates ต้องแยกเก็บเป็น "เก่า/ไม่ใช้" (รอ user ตัดสิน)

หน้าที่ยังอยู่ใน nav แต่ audit ชี้ว่าอาจตัด — **ยังไม่ archive · ต้อง confirm ก่อน:**

| หน้า | เหตุผล | ทางเลือก |
|---|---|---|
| FI-5 fi5-ar-audit | matrix ✂️ excess (ไม่มี flow) | re-scope→FI-6 credit control / ยุบเข้า FI-Q / archive |
| FI-13 fi13-dual-book | นอก scope SWT single-entity | keep เป็น reference / archive (defer P3) |
| SQT sqt-service-quotation | matrix เคย ✂️ excess | ยืนยันตอน SV rebuild (P2) |
| SIR sir-site-inspection | ตรวจ scope | ยืนยันตอน SV rebuild (P2) |
| TR-1 tr1-treasury | ไม่มีใน matrix เดิม | ตรวจ scope P1/P2 |

## 12. ✅ Archived แล้ว (32 ไฟล์ใน _archive/ — เก่า/ไม่ใช้ · ยืนยันแล้ว)

session 2026-07-02 archive: sl5-crm · sl6-promotion · sl7-report · cl1-claims
ก่อนหน้า: po5-finance-grn · fi3-tax-reconciliation · sv4-warranty-check · sv2-service-invoice + old version (`_archive/mockup-versions/`) + cf dated snapshots

---

## 13. 🔴 Gaps (flow มี · ยังไม่มีหน้า — backlog สร้างใหม่)

| หน้า | flow |
|---|---|
| MD-6 Sales Price List | Master |
| MD-7 Purchase Price List | Master (ผูก Promotion/01) |
| PM-Q / PM-1 Promotion dashboard/price | Promotion 00/01 (P2) |

---

## สรุปตัวเลข

- **✅ เสร็จ (current):** ~48 หน้า (SL 7 · PO 7 · WH 7 · FI 7 · CF 6 · MD 5 · SC 4 · cross 5)
- **🔧 ต้องทำต่อ:** FI-2 (next · ปิด chain) · PO-2 redo · PO-8 Deposit Pool · FI-4 recode
- **⏸️ Phase 2:** SV 12 หน้า (rebuild B1-B10) · EX-1 · IA-Q
- **⚠️ รอตัดสิน archive:** FI-5 · FI-13 · SQT · SIR · TR-1 (5 หน้า)
- **🔴 Gap:** MD-6/7 · PM dashboard (สร้างใหม่)
- **📦 Archived แล้ว:** 32 ไฟล์
