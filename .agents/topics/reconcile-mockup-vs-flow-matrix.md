# Reconcile Matrix — Mockup ↔ Flow Design (consolidated)

> **Deliverable ของข้อ ก** (ออดิต Mockup↔Flow ที่ค้างอยู่). รวม 8 กลุ่มโมดูลเป็น matrix เดียวที่ actionable.
> Canonical = `Flow Design/` (84 PDF) + `sangwijit-portal-skill/` spec (ADR-0001). Mockup ที่ code/scope เพี้ยน = แก้ที่ mockup.
> เริ่ม 2026-05-30 · ต่อยอดจาก reconciliation audit (2026-05-29) + finance-flow-understanding (user-confirmed).

## Legend (verdict)
- ✅ **match** — flow มีหน้า, code ถูก, scope ตรง → ไม่ต้องแตะ
- 🔧 **rename/recode** — หน้ามี แต่ code/title เพี้ยน → เปลี่ยนเลข/ชื่อ
- 🔀 **misplaced** — หน้าอยู่ผิด module → ย้าย
- ➕ **merge** — หลายไฟล์ควรรวมเป็นหน้าเดียว
- 🔴 **gap** — flow มี แต่ไม่มีหน้า → สร้างใหม่
- ✂️ **excess** — หน้ามี แต่ไม่มี flow รองรับ → ตัด หรือ ต้องเพิ่ม flow ก่อน

## Confidence
- **C** = confirmed (user ยืนยัน หรือ ตรงกับ topic ที่ confirm แล้ว)
- **A** = audit-derived (จาก reconciliation 2026-05-29 + inventory · ความเชื่อมั่นสูง)
- **V** = ต้องเปิด PDF ยืนยัน scope ก่อนลงมือแก้ (flow-first gate)

---

## A. Canonical flow inventory (สรุป)

| กลุ่มโฟลเดอร์ | Flow PDF | Document PDF | หมายเหตุ |
|---|---|---|---|
| Account | 12 (AR/ARCN/AP/APCN/GJ/VAT/WHT/Close×2/FixedAsset×3) | 10 | **ต้นทางเอกสาร** — เจ้าของจริงคือ SL/PO ไม่ใช่ FI |
| Finance | 3 (Cash Receive/Payment/Bank Recon) | 2 | FI module แท้ = รับ/จ่าย/กระทบยอด |
| Sales | 10 (00-09) | 7 | |
| Purchase | 7 (00-06) | 3 | |
| Warehouse Inventory | 3 (00-02) | 2 | |
| Master | 7 | — | รวม Sales/Purchase Price List |
| Promotion | 3 (00-02) | — | |
| Service | 7 (00-06, มี 06 ซ้ำ 2 เวอร์ชัน) | — | Phase 2 |
| Data Transfer | 6 | — | = FI-13 Dual-Book 6 legs |
| **รวม** | **~58 flow** | **24 doc** | 84 PDF |

---

## B. Finance + Account  *(สถานะ: C — user confirm 2026-05-29)*

> รายละเอียดเต็ม + mermaid อยู่ใน `.agents/topics/finance-flow-understanding.md`. สรุป action:

| Flow (canonical) | หน้าที่ถูก (spec) | ไฟล์ปัจจุบัน | verdict | action | P | conf |
|---|---|---|---|---|---|---|
| Finance/01 Cash Receive | FI-1 | fi1-ar-receive | ✅ | — | P1 | C |
| (auto-match QR/bank) | FI-1Q | fi1q-apply-queue | ✅ | — | P1 | C |
| Finance/02 Payment | FI-2 | fi2-ap-payment | 🔧 | โชว์ Approval gate (→ap1) + ลิงก์ WHT print (FI-12) | P1 | C |
| Finance/03 Bank Recon | FI-3 | — (fi3 ถูก tax ยึด) | 🔴 gap | **สร้าง FI-3 Bank Recon** (กำลังทำ) | P1 | C |
| Account/05 General Journal | FI-4 | — (fi4 ถูก expense ยึด) | 🔴 | **cut-to-BC** (ตัดสินแล้ว: ไม่ทำหน้า Portal) | P1 | C |
| (Expense Voucher) | FI-5 | fi4-expense-wht | 🔧 | re-code fi4→FI-5, แยกงาน WHT ออก | P2 | C |
| Account/06 Sales/Purchase VAT | FI-7 | fi3-tax-reconciliation | 🔧 | re-code fi3→FI-7 (ภ.พ.30) · spec เขียน P3 ผิด → แก้ spec เป็น P1 | P1 | C |
| Account/07 WHT | FI-12 | กระจาย fi3+fi4 | 🔴 | **รวมเป็นหน้าเดียว** FI-12 WHT List (ภ.ง.ด.3/53) | P1 | C |
| Data Transfer ×6 | FI-13 | fi13-dual-book | 🔧 | เสริม transfer engine + row type CN/receipt/payment | P3 | C |
| (Credit Control) | FI-6 | fi5-ar-audit | ✂️ | re-scope→FI-6 หรือยุบเข้า fiq (ไม่มี flow) | P2 | A |
| Account/08,09 Close Period/Year | — | — | — | BC-direct (ไม่ทำหน้า) | — | A |
| Account/10-12 Fixed Asset | FI-9? | — | 🔴/defer | รอ confirm ว่า SWT มี FA หรือไม่ | P2 | V |

**Account ต้นทางเอกสาร (เจ้าของจริง = SL/PO):**
| Account flow | เจ้าของ | ไฟล์ | verdict |
|---|---|---|---|
| AR (01) post บิลขาย | SL-4 | sl4-invoice | ✅ |
| AP (03) บิลซื้อ | PO-6 + ap1 | po6-ap-invoice | ✅ |
| ARCN (02) ใบลดหนี้ขาย | **SL-CN** (ใหม่) | — | 🔴 gap |
| APCN (04) ใบลดหนี้ซื้อ | **PO-CN** (ใหม่) | — | 🔴 gap |

---

## C. Sales  *(สถานะ: A — ต้องเปิด PDF ยืนยัน mapping flow 02/03/06/08 ก่อนแก้)*

| Flow (canonical) | หน้าที่ถูก | ไฟล์ปัจจุบัน | verdict | action | P | conf |
|---|---|---|---|---|---|---|
| 00 Queues & Dashboard | SL-Q | slq-sales-queue | ✅ | — | P1 | A |
| 01 Sales Quote | SL-1 | sl1-quotation | ✅ | — | P1 | A |
| 02 SO from Quote / 03 Sales Order | SL-2 | sl2-reservation | ✅/🔧 | ยืนยันว่า sl2 ครอบทั้ง flow 02+03 (จอง=SO) | P1 | V |
| 05 Deposit create / 06 Deposit deduct | SL-3 | sl3-deposit | ✅/🔧 | ยืนยัน sl3 ครอบทั้ง create+deduction | P1 | V |
| 04 Shipment & Invoice / 09 Sales Invoice | SL-4 | sl4-invoice | ✅ | — | P1 | A |
| 08 Sales Shipment (pick/ship) | WH-3 | wh3-sales-issue | ✅ | boundary: ตัดของ=WH-3 · ตั้งหนี้=SL-4 | P1 | V |
| **07 Sales Credit Memo** | **SL-CN** | — | 🔴 gap | **สร้างใหม่** (Credit Note doc มี 2 ฉบับ: มี/ไม่มีใบกำกับภาษี) | P1 | A |
| — (ไม่มี flow) | — | sl5-crm-followup | ✂️ excess | ตัด หรือ ดัน Phase 2 CRM (ไม่มี flow รองรับ) | P2 | A |
| Promotion (ผิด module) | PM | sl6-promotion-setup | 🔀 misplaced | ย้ายเข้า Promotion module | P1 | A |
| — (Credit gate) | SL-F1 | slf1-credit-approval | ✅ | keep · cross-module กับ CF-7 Approval Matrix | P1 | A |
| — (report) | RP? | sl7-sales-report | ✂️/🔀 | ไม่มี flow report เฉพาะ → ยุบเข้า RP-1 หรือ tie กับ dashboard | P2 | V |

---

## D. Purchase + Warehouse  *(สถานะ: A — กลุ่มที่สะอาดสุด)*

**Purchase:**
| Flow | หน้า | ไฟล์ | verdict | action | P | conf |
|---|---|---|---|---|---|---|
| 00 Dashboard | PO-Q | poq-purchase-queue | ✅ | — | P1 | A |
| 01 Vendor | PO-3 | po3-vendor-onboarding | ✅ | — | P1 | A |
| 02 PR | PO-1 | po1-purchase-request | ✅ | — | P1 | A |
| 03 PO | PO-4 | po4-purchase-order | ✅ | — | P1 | A |
| 04 Receipt | PO-5 / WH-1 | po5-finance-grn / wh1-grn | ✅ | boundary: ตั้งหนี้-รับ=PO-5 · คลังรับเข้า=WH-1 (ระบุชัดในหน้า) | P1 | V |
| 05 Invoice (ตั้งหนี้+ภาษี) | PO-6 | po6-ap-invoice | ✅ | — | P1 | A |
| 06 Deposit bill | PO-8 | po8-deposit-bill | ✅ | — | P1 | A |
| (RFQ — เสริม) | PO-2 | po2-rfq | ✅ | — | P1 | A |
| (Rebate — เสริม) | PO-7 | po7-rebate-dashboard | ✅ | — | P2 | A |
| **APCN ใบลดหนี้ซื้อ** | **PO-CN** | — | 🔴 gap | สร้างใหม่ (มี Approval · ดู Account/04) | P1 | A |

**Warehouse:**
| Flow | หน้า | ไฟล์ | verdict | action | P | conf |
|---|---|---|---|---|---|---|
| 00 Dashboard | WH-Q | wh-queue | ✅ | — | P1 | A |
| 01 Transfer Order | WH-2 | wh2-stock-transfer | ✅ | — | P1 | A |
| 02 Stock Counting | WH-4 | wh4-stock-count | ✅ | — | P1 | A |
| (GRN รับเข้า) | WH-1 | wh1-grn | ✅ | retitle ตรวจให้ตรง flow Receipt | P1 | A |
| (Sales Issue) | WH-3 | wh3-sales-issue | ✅ | — | P1 | A |
| (Stock Card — report) | WH-R | wh-r-stock-card | ✅ | report · ไม่มี flow เฉพาะ (ยอมรับ) | P2 | A |
| (Non-Move — report) | WH-NM | wh-nm-non-move-report | ✅ | report · ไม่มี flow เฉพาะ (ยอมรับ) | P2 | A |

---

## E. Master + Promotion  *(สถานะ: A/V)*

**Master (7 flow):**
| Master flow | หน้า | ไฟล์ | verdict | action | P | conf |
|---|---|---|---|---|---|---|
| Item | MD-1 | md1-item-master-v3 | ✅ | — | P1 | A |
| Customer | MD-2 | md2-customer-master-v3 | ✅ | — | P1 | A |
| Vendor | MD-3 | md3-vendor-master-v3 | ✅ | — | P1 | A |
| Employee | MD-4 | md4-employee-master-v3 | ✅ | — | P1 | A |
| Location and Bin | MD-5 | md5-branch-warehouse-v3 | ✅ | — | P1 | A |
| **Sales Price List** | **MD-6?** | — | 🔴 gap | สร้าง master ราคาขาย | P1 | A |
| **Purchase Price List** | **MD-7?** | — | 🔴 gap | สร้าง master ราคาซื้อ (ผูก Promotion/01) | P1 | A |
| — (ไม่มี flow) | — | sm1-sku-slot-planner | ✂️ excess | ไม่มี flow → ตัด/เพิ่ม flow ก่อน | P2 | A |
| — (ไม่มี flow) | — | sm2-sku-health | ✂️ excess | ไม่มี flow → ตัด/เพิ่ม flow ก่อน | P2 | A |
| — (ผิด/Vendor Portal) | — | sm3-vendor-report | 🔀 | ดัน Phase 2 Vendor Portal | P2 | A |

**Promotion (3 flow):**
| Promotion flow | หน้า | ไฟล์ | verdict | action | P | conf |
|---|---|---|---|---|---|---|
| 00 Dashboard | PM-Q? | — | 🔴/V | ตรวจว่ามี dashboard หรือยัง | P2 | V |
| 01 Price List (ฐานราคา+สัญญา) | PM-1? | — (ผูก MD price list) | 🔴/V | ความสัมพันธ์กับ Master Price List ต้องชัด | P2 | V |
| 02 Promotion & Accrual Claim | PM | sl6-promotion-setup (ย้ายมา) + pm5-vat-simulator | ➕/🔀 | รวมงาน promo ที่กระจาย (pm/sl6/po/cm) เข้า PM module | P2 | V |
| — | PM-5 | pm5-vat-simulator | ✅ | keep (VAT Golden Rule sandbox) | P2 | A |

---

## F. Service + Claims  *(สถานะ: Phase 2 — summarize only, ยังไม่ execute)*

> รกที่สุด (14 หน้า/7 flow) แต่ deferred P2. สรุป verdict ไว้ ไม่ลงมือ:
- **Duplicate:** sv7↔sv4 (ปิดงาน) · cl1↔clm (เคลม) → ต้องตัดสิน boundary
- **Merge:** sv6-1-booking-modal + sv6-print-templates → เข้า sv6
- Service/Flow 00-06 → SV-Q/1/2/5/3/4/7 (+ SIR/SQT/CLM expansion 2026-04-27) — โครงตรง flow 4-step + claim loop
- 06 มี PDF ซ้ำ 2 เวอร์ชัน → ยึดเวอร์ชันล่าสุด (ต้องเทียบ)
- **อย่าแตะจนกว่า Finance/Sales/PO-WH cleanup จะจบ** (ADR order)

---

## G. Action backlog (รวม · เรียงตาม P)

### 🔴 P1 Gaps (สร้างใหม่ — สำคัญสุด)
1. **FI-3 Bank Reconciliation** *(กำลังทำ)*
2. **FI-12 WHT List** (รวม ภ.ง.ด.3/53)
3. **SL-CN Sales Credit Memo** (flow 07)
4. **PO-CN Purchase Credit Memo** (Account/04, มี Approval)
5. **MD-6 Sales Price List + MD-7 Purchase Price List** (master)

### 🔧 P1 Recode/Rename
6. fi3 → FI-7 (VAT/ภ.พ.30) · fi4 → FI-5 (Expense)
7. FI-2 โชว์ Approval gate + WHT link
8. แก้ spec FI-7 P3 → P1

### 🔀 P1 Move
9. sl6-promotion-setup → Promotion module

### ✂️ P2 Excess/Re-scope (ตัด หรือ เพิ่ม flow ก่อน)
10. sl5-crm · fi5-ar-audit(→FI-6) · sm1 · sm2 · sm3(→P2 Vendor Portal) · sl7(→RP-1)

### cut-to-BC (ยืนยันแล้ว ไม่ทำหน้า)
- FI-4 General Journal · Close Period/Year

---

## H. ลำดับลงมือ (ตาม active.md, flow-first gate ทุกหน้า)
1. **Finance** [กำลังทำ] — FI-3 → recode fi3/fi4 → FI-12 → FI-2 approval → fi5 re-scope → FI-13 engine
2. **Sales** — SL-CN (gap) → ย้าย sl6 → ตัด/ดัน sl5,sl7
3. **Purchase/Warehouse** — PO-CN (gap) → retitle wh1 → ยืนยัน boundary PO-5/WH-1
4. **Master** — MD-6/MD-7 price list → จัดการ sm1/2/3
5. **Promotion** — รวมงาน promo กระจาย (ผูก price list)
6. **Service/Claims** — P2, defer

> **กฎ:** ทุกหน้าที่จะแก้/สร้าง = (1) แสดง flow ให้เห็นตรงกัน → (2) confirm → (3) ค่อย edit. ห้าม batch หลายหน้า. รายการ **V** ต้องเปิด PDF ยืนยัน scope ก่อน design.

---

## I. Decisions log
- **2026-05-30 · FI-7 (ADR-0002):** FI-7 = **รายงานภาษีขาย/ภาษีซื้อ → ภ.พ.30 เท่านั้น · P1** (ยึด flow Account/06). "ปิดงวด/Lock Period" = **cut-to-BC** (มี flow 08/09, BC lane). WHT แยกเป็น FI-12. → recode `fi3-tax-reconciliation` → FI-7 + retitle + แก้ spec FI_finance.md. CONTEXT.md เพิ่ม term: VAT Report / Period Close / WHT List. **สถานะ: ✅ EXECUTED 2026-05-30** — สร้าง `fi7-vat-report-mockup.html` (VAT register) + `fi12-wht-mockup.html` (WHT List) · archive `fi3-tax-reconciliation` → `_archive/` · sidebar rollout 73 ไฟล์ + index.html (nav+cards+KPI) · collision FI-3 ซ้อนเคลียร์.
- **2026-05-30 · FI-3 Bank Recon:** หน้า `fi3-bank-reconciliation` ตรง flow Finance/03 แล้ว (~95%) — ไม่ใช่ gap. active.md "กำลังทำ" ล้าสมัย. เหลือ polish: visible section label `FI-3.N`.
