# Flow Redundancy Analysis — Sangwijit ERP Portal

> วิเคราะห์ความซ้ำซ้อน/overlap ของ flow ข้ามโมดูล (SL · PO · WH · SV · FI)
> **สถานะ: analysis เท่านั้น — ยังไม่แก้ code.** ทุกข้อสรุปเป็นข้อเสนอ ต้อง confirm ก่อน implement
> อ้างอิงจากไฟล์ mockup จริงที่ root + spec (`sangwijit-portal-skill/modules/*`) + decisions ใน `.agents/active.md`
> วันที่วิเคราะห์: 2026-07-01

---

## 1. Executive Summary

พบ overlap ทั้งหมด **19 รายการ** ครอบ 5 โมดูลหลัก แบ่งเป็น:

- **Resolved แล้ว 8 รายการ** (การตัดสินใจ lock ไว้แล้ว — เก็บไว้เป็น guardrail กัน regression)
- **Open ต้องตัดสิน 11 รายการ** (ก่อน handoff dev)

### Top open redundancy ที่ควรจัดการก่อน (เรียงตามผลกระทบ)

| # | Overlap | ทำไมเร่ง | recommendation สั้น |
|---|---|---|---|
| 1 | **Approval Matrix code ไม่ตรง (CF-2.6 vs CF-7)** | ทุกโมดูล (SL-F1, PO tier, FI-4/6/11/JV) พึ่ง matrix เดียว — รหัสไม่ตรง = cross-ref พังทั้งระบบ | pin canonical = **CF-2.6** (mockup ชนะ), แก้ CLAUDE.md/spec |
| 2 | **VAT ภ.พ.30 ซ้ำ 2 มุม (FI-7 vs FI-13)** | FI-13 Dual-Book ถูก defer (single-entity SWT, decision 2026-05-31) แต่ analysis ยัง treat active | **merge → เหลือ FI-7 มุมเดียว**, drop FI-13 per-Tag ในเฟสนี้ |
| 3 | **PO-7 accrual vs FI-8 Accrual Monitor** | Record Payment กดได้ 2 ฝั่ง → เสี่ยงบันทึกซ้ำ (FI-8 ยังไม่มีไฟล์ — ตัดสินก่อนสร้าง) | PO-7 = owner, FI-8 = read-only reconcile |
| 4 | **Stock reserve SL-2 vs WH-3 เบิกจริง** | reserve ค้าง/double-reserve ถ้ายกเลิก SO ไม่ปล่อยยอด | SL=reserve, WH-3=issue; เช็ค release เมื่อยกเลิก/หมดอายุ |
| 5 | **PO-7 Sell-out ↔ SL-4 Serial (handoff ยังไม่ปิด)** | Serial ไม่ได้กรอกที่ SL-4 (rule: กรอกที่ WH-3) — recovery calc รอ field ที่ไม่มีอยู่ | match serial จาก WH-3/itemLedgerEntries ไม่ใช่ SL-4 |
| 6 | **TR-Out/TR-In โผล่ 3 คิว (WH-1/2/3)** | รับซ้ำ/สร้างใบโอนซ้ำถ้าสถานะไม่ sync | WH-2=owner, WH-1=รับ, WH-3=route; sync In-Transit 1 ใบ 1 สถานะ |

### Resolved สำคัญ (guardrail — อย่า re-litigate)

- **GRN: PO-5 Finance GRN ถูกตัด** (commit a60b987) → WH-1 = ศูนย์รับเดียว, "รับครบ qty-based" = gate ปลด PO-6
- **AR/AP ledger owner** = เอกสารต้นทาง (SL-4/PO-6/SL-CN/PO-CN); FI = List→Match→Release→Print เท่านั้น
- **Vendor Claim**: CLM (SV, track) → PO-CN (post ตัด AP) จุดเดียว; ห้าม SV-4 ARI + PO-CN นับซ้ำ
- **CL-1 Claims (legacy)** = deprecated, defer P2; active path = CLM (claim = job-type ใน service-intake)

---

## 2. Flow Map ต่อ Module

### SL — Sales (งานขาย)
```
SL-1 ใบเสนอราคา (Draft→Confirmed, auto-expire 30d)
  └─[เกินวงเงิน/Blocked]→ SL-F1 อนุมัติวงเงิน (Maker≠Checker, tier ตาม CF-2.6)
  └─ makeOrder → SL-2 ใบจอง (จองกันสต๊อก → รอเบิก WH-3)
       └─[สต๊อกไม่พอ]→ ประเภทจอง "จองสั่งซื้อ" → PO-Q (out)
       └─ รับมัดจำ → SL-3 ใบมัดจำ (Post→Customer Ledger/GL, หักบิลอัตโนมัติ)
       └─ makeInvoice → SL-4 บิลขาย (Post→ตัดสต๊อก+AR+VAT Output)
            ├─① กันสต๊อก/แจ้งคลัง → WH-3 (out; Serial กรอกที่นี่)
            ├─② รับเงิน/ตั้งหนี้ AR → FI-1 (out)
            ├─③ จัดส่ง+ติดตั้ง → SV-6 (out, auto-trigger)
            ├─④ โปรฯ auto-match → PM/SL-6 (in)
            └─⑤ VAT Output → FI-7 (out)
       └─ คืน/ราคาผิด → SL-CN ใบลดหนี้ (อ้างอิงบิล required → ลด AR + WH Return)
```
**Doc หลัก:** SL-1, SL-2, SL-3, SL-4, SL-CN, SL-F1 · **Queue:** SL-Q (dashboard + jump WH-3/SV-6/PO-Q/FI-1)
**เกิน spec:** sl5-crm-followup, sl6-promotion-setup (ควรอยู่ PM), sl7-report

### PO — Purchase (จัดซื้อ)
```
PO-1 PR (trigger MOS/สต๊อกต่ำ) → PO-4 PO (อ้าง TA จาก PO-2)
  → WH-1 GRN (รับ+Serial+Bin; "รับครบ" = gate) ⚠️ PO-5 ถูกตัด redirect→WH-1
  → PO-6 AP Invoice (3-way match, Entity Tag, WHT auto) → FI-2 จ่าย (out)
Branches:
  PO-8 บิลฝาก (Credit Term ครบ/ของยังไม่ครบ → prepay, bypass GRN gate)
  PO-7 Trade Support (จาก PO-2; out→FI/PM, in←SL-4 serial) → ยอด Realized เข้า PO-6
  PO-CN ใบลดหนี้ (คืน/ลดราคา/เคลม; in←CLM → ตัด PO-6)
```
**Doc หลัก:** PO-1, PO-2 (ไฟล์ยังชื่อ rfq), PO-3, PO-4, PO-6, PO-7, PO-8, PO-CN · **Queue:** PO-Q
**Reference (ไม่อยู่ chain):** PO-2 Vendor Commitment (auto-apply Sell-in%/MOU/Free Goods)

### WH — Warehouse (คลัง)
```
WH-Q (KPI + CTA) → WH-1 / WH-3
WH-1 รับเข้า (จาก PO / PO-8 บิลฝาก / TR-In / RT คืน) → Post → [รับครบ qty] → PO-6 (out)
WH-2 โอน (TR-Out/In, In-Transit, Service-Stock, Promo-Stock, Return-Flow) → ship → WH-1 รับ
WH-3 เบิกออก 9 ประเภท (SL-4/SV-6/SV-3/SV-O/TR-Out/Promo/ADJ/RT-V) → Pick&Pack (Serial REQUIRED) → Post
WH-4 นับสต็อก (8 ประเภท) → variance → Post Adj → FI-13 GL Entry (out)
WH-R Stock Card (drill) · WH-NM Non-Move (alert Purchase Mgr ทุก 7 วัน)
```
**Doc หลัก:** WH-Q, WH-1..4, WH-R, WH-NM
**Serial rule:** ลงที่ WH-1 (รับ) + WH-3 (เบิก REQUIRED) — **ไม่บังคับที่ SL-4**

### SV — Service & Claims (บริการ + เคลม)
```
SV-1 รับเรื่อง (ซ่อม/ติดตั้ง/เคลม)
  └─[ประเมิน]→ SIR → SQT → กลับ SV-2
  → SV-2 มอบหมาย (เลือกช่าง+นัด, Pre-Parts)
       ├─ SV-3 เบิกอะไหล่ → WH-3 (out)
       └─ SV-O สั่งอะไหล่ → PO-4 → WH-1 (out)
  → SV-5 Job Card (ช่างบันทึกผล)
  → SV-4 ปิดงาน/QA — งานในประกัน: ตั้งหนี้ Vendor (ARI) + เปิด CLM
  → SV-7 ส่งลูกค้า (Customer Invoice เฉพาะนอก Comp → AR)
SV-6 จัดส่ง+ติดตั้ง (auto จาก SL-4 Delivery Flag; ยืนยัน Serial ตรง Invoice ก่อน Close)
CLM Vendor Claim (SLA 7d) → PO-CN โหมดเคลม → รอหักหนี้ → APCN ตัด PO-6
```
**Doc หลัก:** SV-Q, SV-1..7, SV-O, SIR, SQT, CLM · **legacy:** cl1-claims (deprecated)
**Billing:** ในประกัน→ARI(SV-4)→CLM→PO-CN; นอกประกัน→Customer Invoice(SV-7)

### FI — Finance (บัญชี/การเงิน)
```
FI-Q hub (AR/AP/Tax/WHT/JV/Close)
AR:  SL-4 เปิด AR → QR/bank → IA-Q → URC → FI-1Q Apply → FI-1 RV ปิดบิล
AP:  PO-6 ตั้งหนี้ → FI-2 (3-way match WH-1+PO-6, หัก WHT) → PV+WHT
Exp: PO-3 Vendor Invoice → FI-4 Expense+WHT → ภ.ง.ด.3/53
WHT: เกิดที่ FI-2/FI-4 → รวบรวม/Release/Print ที่ FI-12
Bank: FI-3 Recon (±3d auto-match, unmatched→JV)
VAT: SL-4 Output + PO-6 Input → FI-7 ภ.พ.30 (ยื่นวันที่ 15)
Dual-Book: FI-13 Entity Tag (⚠️ deferred single-entity SWT)
```
**Doc หลัก:** FI-Q, FI-1, FI-1Q, FI-2, FI-3, FI-4(Expense+WHT), FI-5(AR Audit), FI-7, FI-12, FI-13
**หลักการ:** FI = thin UI เหนือ BC — ไม่ออก ledger เอง, แค่ apply/pay/report
**spec-only (ยังไม่มีไฟล์):** FI-6 Credit Control, FI-8 Accrual, FI-9/10/11 Fixed Asset

---

## 3. Overlap Matrix

| # | Overlap | Modules | Kind | Sev | Status | Recommendation |
|---|---|---|---|---|---|---|
| 1 | GRN PO-5 ซ้ำ WH-1 | PO·WH | duplicate-work | high | ✅ resolved | merge — WH-1 รับ / PO-6 ตั้งหนี้ |
| 2 | PO-CN vs CLM (Vendor claim) | PO·SV | double-posting | med | ✅ resolved | clarify — CLM track / PO-CN post จุดเดียว |
| 3 | CL-1 legacy ทับ CLM | SV·PO | duplicate-work | med | ✅ resolved | keep-separate — CL-1 deprecated (P2) |
| 4 | จัดส่ง WH-3 vs SV-6 | SL·WH·SV | handoff-gap | med | ✅ resolved | clarify — SL-4→WH-3(Serial)→SV-6 |
| 5 | FI AR/AP vs SL/PO ledger owner | FI·SL·PO | unclear-owner | low | ✅ resolved | keep-separate — ต้นทางเป็นเจ้าของ ledger |
| 6 | มัดจำ SL-3 vs บิลฝาก PO-8 | SL·PO | naming | low | 🔴 open | clarify — pin glossary (รับ vs จ่าย) |
| 7 | Stock reserve SL-2 vs WH-3 | SL·WH | handoff-gap | med | 🔴 open | clarify — เช็ค release reservation |
| 8 | ภ.พ.30 ซ้ำ FI-7 vs FI-13 | FI | duplicate-work | med | ✅ resolved | merge — drop FI-13 per-Tag |
| 9 | WHT 3 ที่ FI-2/4/12 | FI | duplicate-work | low | 🔴 open | clarify — FI-12 = single release point |
| 10 | PO-7 accrual vs FI-8 Monitor | PO·FI | unclear-owner | med | 🔴 open | clarify — PO-7 owner, FI-8 read-only |
| 11 | PO-7 Sell-out ↔ SL-4 Serial | PO·SL | handoff-gap | med | 🔴 open | clarify — serial จาก WH-3/itemLedger |
| 12 | ที่อยู่จัดส่งซ้ำ SL-4 header/tab | SL | duplicate-work | low | 🔴 open | clarify — header = source เดียว |
| 13 | TR-Out/In 3 คิว WH-1/2/3 | WH | double-posting | med | 🔴 open | clarify — WH-2 owner, sync In-Transit |
| 14 | Approval Matrix CF-2.6 vs CF-7 | SL·PO·FI·CF | naming | med | 🔴 open | clarify — canonical = CF-2.6 |
| 15 | SL-5 code ชน (CN vs CRM) | SL | naming | low | 🔴 open | clarify — CN=SL-CN, ตัด/ย้าย excess |
| 16 | SV-4 ARI แสดงซ้ำ SV-7/CLM | SV·FI | double-posting | low | ✅ resolved | clarify — post ที่ SV-4 จุดเดียว |
| 17 | Doc-chain breadcrumb hard-code | SL·PO·WH·SV | duplicate-work | low | 🔴 open | clarify — รวมเข้า swt-link.js |

---

## 4. ความเห็นละเอียดต่อ Overlap (open + resolved สำคัญ)

> วิเคราะห์ 5 มุม: (ก) business process/owner · (ข) document/data flow · (ค) role/permission · (ง) accounting/GL · (จ) test coverage

### #14 Approval Matrix — CF-2.6 vs CF-7 [OPEN · med · แนะทำก่อน]
- **(ก) Owner:** CF module เป็นเจ้าของ matrix เดียว (tier/ผู้อนุมัติ/SLA/Maker≠Checker). ผู้บริโภค = SL-F1, PO credit tier, FI-4/FI-6/FI-11/JV
- **(ข) Data flow:** ไฟล์จริง SL-F1/FI อ้าง `cf26-approval-matrix-proposal` (build 2026-06-03) แต่ CLAUDE.md/spec เขียน CF-7 → cross-ref แตกเป็น 2 รหัส
- **(ค) Role:** ทุก approval step พึ่ง tier เดียวกัน; ถ้ารหัสไม่ตรง dev อาจ wire ผิด matrix → อนุมัติผิด tier
- **(ง) GL:** ไม่มี posting โดยตรง แต่ blocking gate ของ AP/JV/Override พึ่ง matrix — พังเงียบ
- **(จ) Test:** ยืนยัน SL-F1 กับ FI-4 ชี้ matrix instance เดียวกัน; รหัสใน footer/cross-link ตรงทุกหน้า
- **สรุป:** mockup ชนะ notes ตาม trust priority → **canonical = CF-2.6**, แก้ CLAUDE.md/spec + update ref ทุกจุด

### #8 ภ.พ.30 ซ้ำ FI-7 vs FI-13 [RESOLVED · merge]
- **(ก) Owner:** FI-7 = VAT report รวม; FI-13B = per-นิติบุคคล. Decision 2026-05-31: SWT single-entity → Dual-Book/Entity Tag **defer P2**
- **(ข) Data flow:** ทั้งคู่ดึง Output(SL-4)+Input(PO-6) คำนวณ ภ.พ.30 ซ้ำ 2 มุม (รวม vs per-Tag)
- **(ค) Role:** Finance Mgr/Tax Room; per-Tag view ไม่จำเป็นเมื่อมีนิติบุคคลเดียว
- **(ง) GL/VAT:** เสี่ยงคำนวณ ภ.พ.30 คนละเลขถ้า 2 หน้า logic ไม่ sync
- **(จ) Test:** FI-7 VAT selector = SWT only; ยืนยันไม่มี per-Tag path ในเฟสนี้
- **สรุป:** **เหลือ FI-7 มุมเดียว.** ⚠️ analysis FI ที่ยัง treat FI-13 active + Entity Tag เป็น business rule = **ล้าสมัย** เทียบ decision — ยืนยัน scope ก่อนออกแบบ FI-7

### #10 PO-7 accrual vs FI-8 Accrual Monitor [OPEN · med · ตัดสินก่อนสร้าง FI-8]
- **(ก) Owner:** PO-7 = เจ้าภาพ accrual (vendorObligations, commit→realized). FI-8 = read-only reconcile
- **(ข) Data flow:** FI-8 view ข้อมูลชุดเดียวกับ PO-7 (Accrued/ได้เอกสาร/รับเงิน/ค้าง + aging)
- **(ค) Role:** Record Payment กดได้ทั้ง PO-7 (Buyer/Purchase Mgr) และ FI-8 (Finance) → **ไม่ชัดใครกดจริง**
- **(ง) GL:** เสี่ยง double-record ถ้า 2 ฝั่งกด Record Payment โดยไม่มี lock ร่วม
- **(จ) Test:** กด Record Payment ที่ PO-7 → FI-8 ต้องเห็น status เปลี่ยน + ปุ่มถูก disable
- **สรุป:** **PO-7 = single owner** (สร้าง/เปลี่ยนสถานะ/record payment); FI-8 = read-only + aging follow-up. ถ้าคง 2 ฝั่ง ต้องมี lock. FI-8 ยังไม่มีไฟล์ — ตัดสินก่อนสร้าง

### #11 PO-7 Sell-out ↔ SL-4 Serial match [OPEN · med]
- **(ก) Owner:** PO-7 accumulate Sell-out recovery เมื่อขายออกจริง (match serial)
- **(ข) Data flow:** ⚠️ **conflict** — PO-7 รอ serial จาก SL-4 แต่ **Serial ไม่กรอกที่ SL-4** (rule: กรอกที่ WH-3 ตอนเบิก / itemLedgerEntries). Sell-out จึงค้างถาวร
- **(ค) Role:** Buyer เห็น recovery ค้างโดยไม่รู้ว่า data มาไม่ถึง
- **(ง) GL:** Realized ไม่เกิด → รายได้ rebate ตกหล่น (Other Income undercount)
- **(จ) Test:** ขาย SL-4 → เบิก WH-3 (ลง serial) → PO-7 ควร accumulate จาก itemLedger ไม่ใช่รอ SL-4 field
- **สรุป:** แก้ handoff — **match serial จาก WH-3 issue / itemLedgerEntries** (ผูก SL-4 invoice) ยืนยันแหล่ง serial ก่อน implement recovery calc

### #7 Stock reserve SL-2 vs WH-3 เบิกจริง [OPEN · med]
- **(ก) Owner:** SL = soft reserve (BC reservation, "จองกันสต๊อก"). WH-3 = physical issue จริง (ตัดสต๊อก+Serial)
- **(ข) Data flow:** SL-2 จอง → SL-4 Post "กันสต๊อก" → WH-3 Pick&Pack ตัดจริง. reserved qty ต้อง sync ให้ WH-3 เห็น
- **(ค) Role:** Sales จอง; WH เบิก — ถ้าไม่ sync WH เบิกทับยอดจอง
- **(ง) Stock:** ⚠️ **reserve ค้าง** ถ้ายกเลิก/หมดอายุ SL-2 ไม่ปล่อย reservation; **double-reserve** ถ้าจองซ้ำ
- **(จ) Test:** (1) ยกเลิก SL-2 → reservation ถูกปล่อย; (2) SL-2 หมดอายุ 30d → auto-release; (3) WH-3 เห็น reserved qty ตรง
- **สรุป:** SL=reserve, WH-3=issue. เช็ค release path เมื่อยกเลิก/หมดอายุ + sync reserved qty. BC เป็นเจ้าของ reservation ledger — Portal แค่ trigger

### #13 TR-Out/TR-In โผล่ 3 คิว (WH-1/2/3) [OPEN · med]
- **(ก) Owner:** WH-2 = เจ้าของใบโอน (สร้าง/ship/approve). WH-1 = ยืนยันรับปลายทาง. WH-3 "ขอโอน" = route ไป WH-2
- **(ข) Data flow:** 1 ใบโอนโผล่ 3 มุม (WH-2 sub-type, WH-1 Receive Queue TR-In, WH-3 Issue Queue TR-Out)
- **(ค) Role:** WH Staff ต้นทาง ship / ปลายทาง receive; Maker≠Checker (WH Mgr approve)
- **(ง) Stock:** ⚠️ **รับซ้ำ** ถ้า TR-In ยืนยัน 2 ครั้ง; **สร้างใบซ้ำ** ถ้า WH-3 สร้างเองแทน route. In-Transit ไม่นับสต๊อกทั้ง 2 คลัง
- **(จ) Test:** สร้าง TR ที่ WH-2 → ship → WH-1 รับ 1 ครั้ง → WH-3 "ขอโอน" ต้อง link ใบเดิม ไม่สร้างใหม่; ยืนยันรับซ้ำถูก block
- **สรุป:** WH-2=owner, WH-1=รับ, WH-3=route only. **sync สถานะ In-Transit: 1 ใบโอน 1 สถานะข้ามคิว**

### #6 มัดจำ SL-3 vs บิลฝาก PO-8 [OPEN · low · naming]
- **(ก) Owner:** SL-3 = Customer Deposit (AR, รับเงินล่วงหน้า). PO-8 = Vendor Prepayment (AP, จ่ายล่วงหน้า/ฝากของ)
- **(ข) Data flow:** คนละทิศ (รับ vs จ่าย) คนละ ledger — แต่ทั้งคู่แปล "deposit"
- **(ง) GL:** SL-3 → Customer Ledger (Cr); PO-8 → Advance/Bank (Dr). สลับ concept = post ผิดด้าน
- **(จ) Test:** ยืนยัน SL-3 หักออกจากบิลขาย, PO-8 settle กับ AP — ไม่ปนกัน
- **สรุป:** pin glossary — **SL-3 = "มัดจำรับ (Customer Deposit/AR)"**, **PO-8 = "บิลฝาก/เงินฝากซื้อ (Vendor Prepayment/AP)"**

### #9 WHT 3 ที่ (FI-2/FI-4/FI-12) [OPEN · low]
- **(ก) Owner:** FI-2 (หักตอนจ่าย AP) + FI-4 (ตอนบันทึก Expense) = **จุดเกิด**. FI-12 = ปลายทางรวบรวม+Release+Print
- **(ข) Data flow:** fi4-expense-wht รวม Expense+WHT; fi12-wht standalone List → overlap เรื่องออก certificate
- **(ง) GL:** ⚠️ เสี่ยง 2 หน้าออก WHT Certificate เดียวกันซ้ำ (ยอด ภ.ง.ด.เกิน)
- **(จ) Test:** WHT จาก FI-2 → โผล่ FI-12 pending → Release/Print ที่ FI-12 เท่านั้น; FI-4 ไม่ออก cert เอง
- **สรุป:** FI-2/FI-4 = เกิด WHT; **FI-12 = single release/print point.** ⚠️ naming: spec FI-4=JV แต่ไฟล์ fi4=Expense+WHT — reconcile

### #15 SL-5 code ชน (Credit Memo vs CRM) [OPEN · low]
- **(ข) Data flow:** spec SL-5=Credit Memo แต่ไฟล์จริง slcn-credit-memo=SL-CN (doc-chain ใช้จริง); sl5-crm-followup ใช้ SL-5 กับ CRM คนละเรื่อง
- **excess:** sl5-crm (ไม่มี flow), sl6-promotion-setup (misplaced ควร PM), sl7-report — เกิน spec
- **สรุป:** Credit Memo = **SL-CN** (ตาม doc-chain), เลิกใช้ SL-5 ซ้ำ. ตัดสินตัด/ย้าย/ตั้งรหัสใหม่ก่อน handoff

### #12 ที่อยู่จัดส่งซ้ำใน SL-4 header vs tab [OPEN · low intra-module]
- **(ข) Data flow:** ที่อยู่จัดส่งกรอก/แสดง 2 ที่ (Doc Header party + tab จัดส่ง) → เสี่ยงไม่ sync
- **(จ) Test:** แก้ที่อยู่ที่ header → tab จัดส่งอัปเดตตาม; ส่ง SV-6/WH-3 ใช้ที่อยู่ชุดเดียว
- **สรุป:** **header = source เดียว**, tab จัดส่ง = read-only/prefill

### #17 Doc-chain breadcrumb hard-code [OPEN · low tech-debt]
- **(ข) Data flow:** chain (QT→SO→DP→INV→CN) เขียน hard-code ซ้ำทุกไฟล์ → แก้เลข/ลำดับต้องแก้หลายไฟล์ เสี่ยง drift ข้ามโมดูล
- **สรุป:** มี `swt-link.js` (shared doc-linker) อยู่แล้ว — **รวม chain definition เข้าเป็น data-driven** single source. ไม่เร่ง แต่ทำก่อน handoff dev

### Resolved สำคัญ (guardrail)

**#1 GRN PO-5 ซ้ำ WH-1** — PO-5 ถูกตัด (a60b987), WH-1 = ศูนย์รับเดียว, "รับครบ qty-based" = gate ปลด PO-6. boundary lock 2026-06-07 (รับ=คลัง, จัดซื้อ=สั่ง+ตั้งหนี้). PO-5 เหลือใน `_archive/` — **อย่า treat เป็นหน้า active**

**#2 PO-CN vs CLM** — CLM(SV)=track/process (ไม่ออก doc ภาษี); PO-CN=เอกสารลดหนี้เดียวที่ post ตัด AP. "รอหักหนี้" = คิวกลางเชื่อม. **APCN ออกจาก PO-CN จุดเดียว** — ห้าม SV-4 ARI + PO-CN นับซ้ำ

**#4 จัดส่ง WH-3 vs SV-6** — SL-4→WH-3(เบิก+Serial REQUIRED)→SV-6(ติดตั้ง+เซ็น). SV-6 ยืนยัน Serial ตรง Invoice ก่อน Close. จุดเฝ้า: **sync สถานะ Serial ระหว่าง WH-3 กับ SV-6** ไม่ให้ยืนยันคนละชุด

**#5 FI ledger owner** — AR→SL-4, AP→PO-6, ARCN→SL-CN, APCN→PO-CN (decided 2026-05-29). FI = List→Match→Release→Print. Post/numbering/status = BC ผ่าน IA-Q

**#16 SV-4 ARI ซ้ำ SV-7/CLM** — ARI post ที่ SV-4 จุดเดียว (Checker≠ช่าง); SV-7/CLM = read-only reference. ห้าม 2 หน้าออกใบตั้งหนี้ตัวเดียวกัน

---

## 5. Test Cases ต่อ Overlap

> รูปแบบ: **Happy** · **Edge** · **⚠️ Inconsistency (จุดที่ overlap ทำให้พัง)**

### #14 Approval Matrix CF-2.6
- **Happy:** SL-F1 ส่งขออนุมัติวงเงิน → route ไป tier ตาม CF-2.6 → ผู้อนุมัติถูก tier เห็นในคิว
- **Edge:** Maker = Checker → ระบบ block (คนสร้างอนุมัติเองไม่ได้)
- **⚠️ Inconsistency:** FI-4 อ้าง CF-7, SL-F1 อ้าง CF-2.6 → **ถ้า wire คนละ instance** อนุมัติผิด tier/ผู้อนุมัติหาย. Expected: ทุกหน้าชี้ matrix เดียว

### #8 ภ.พ.30 FI-7 vs FI-13
- **Happy:** เดือนมีขาย 100k + ซื้อ 60k → FI-7 ภ.พ.30 = ภาษีขาย−ซื้อ ถูกต้อง
- **Edge:** บิล novat → ไม่เข้า Input VAT (PO-6 Entity Tag novat)
- **⚠️ Inconsistency:** FI-7 รวม vs FI-13B per-Tag คำนวณคนละเลข → Expected: **เหลือ FI-7 มุมเดียว** (SWT single-entity), FI-13 ไม่ควรมี path ในเฟสนี้

### #10 PO-7 vs FI-8 Record Payment
- **Happy:** PO-7 record payment rebate → status Realized → FI-8 เห็น read-only
- **Edge:** aging >90d → FI-8 flag follow-up ส่งจัดซื้อ
- **⚠️ Inconsistency:** กด Record Payment ที่ **PO-7 และ FI-8 พร้อมกัน** → double-record. Expected: FI-8 disable ปุ่ม (read-only) หรือ lock ร่วม

### #11 PO-7 Sell-out ↔ Serial
- **Happy:** ขาย SL-4 → เบิก WH-3 ลง serial → PO-7 accumulate Sell-out จาก itemLedger
- **Edge:** ขายบางส่วน → recovery accumulate ตาม qty ที่ออกจริง
- **⚠️ Inconsistency:** PO-7 รอ serial จาก **SL-4 field ที่ไม่มี** (serial อยู่ WH-3) → Sell-out ค้างถาวร, Realized = 0. Expected: match จาก WH-3/itemLedgerEntries

### #7 Stock reserve SL-2 vs WH-3
- **Happy:** SL-2 จอง 10 ชิ้น → WH-3 เห็น reserved 10 → เบิกได้ไม่ทับ
- **Edge:** สต๊อก 8 จอง 10 → WH-3 เตือน ส่งบางส่วน 8
- **⚠️ Inconsistency:** ยกเลิก SL-2 แต่ **reservation ไม่ปล่อย** → สต๊อกล็อกค้าง เบิกงานอื่นไม่ได้. Expected: cancel/expire → auto-release; ไม่ double-reserve

### #13 TR-Out/In 3 คิว
- **Happy:** WH-2 สร้าง TR → ship (In-Transit) → WH-1 ปลายทางรับ 1 ครั้ง → ปิด
- **Edge:** In-Transit → ไม่นับสต๊อกทั้ง 2 คลัง (ถูกต้อง)
- **⚠️ Inconsistency:** WH-1 ยืนยันรับ TR-In **2 ครั้ง** หรือ WH-3 "ขอโอน" สร้างใบใหม่แทน route → รับซ้ำ/ใบซ้ำ. Expected: 1 ใบโอน 1 สถานะข้ามคิว, block รับซ้ำ

### #2 PO-CN vs CLM (resolved — regression guard)
- **Happy:** CLM เคลม Vendor → spawn PO-CN → post APCN ตัด AP 1 ครั้ง
- **⚠️ Inconsistency:** ถ้า SV-4 ตั้ง ARI **และ** PO-CN post credit → นับซ้ำ. Expected: credit post จาก PO-CN จุดเดียว, SV-4/CLM read-only

### #6 มัดจำ SL-3 vs PO-8
- **Happy:** SL-3 รับมัดจำ 5k → หักออกจากบิล SL-4 อัตโนมัติ (Cr Customer)
- **⚠️ Inconsistency:** สลับ concept → PO-8 post ฝั่ง AR แทน AP. Expected: SL-3=AR(รับ), PO-8=AP(จ่าย) คนละด้าน GL

### #9 WHT FI-2/4/12
- **Happy:** จ่าย AP (FI-2) หัก WHT 3% → โผล่ FI-12 pending → Release/Print cert
- **⚠️ Inconsistency:** FI-4 **และ** FI-12 ต่างออก certificate เดียวกัน → ยอด ภ.ง.ด.เกิน. Expected: FI-12 = single release/print point

### #12 ที่อยู่จัดส่ง SL-4
- **Happy:** กรอกที่อยู่ที่ header → tab จัดส่ง + SV-6/WH-3 ใช้ชุดเดียว
- **⚠️ Inconsistency:** แก้ header ไม่ update tab → ส่งผิดที่อยู่. Expected: header=source, tab prefill/read-only

### #4 จัดส่ง WH-3 vs SV-6 (resolved — regression guard)
- **Happy:** SL-4 "จัดส่ง+ติดตั้ง" → WH-3 เบิก+ลง serial → SV-6 ยืนยัน serial ตรง Invoice → เซ็นรับ Close
- **⚠️ Inconsistency:** WH-3 ลง serial A, SV-6 ยืนยัน serial B → ส่งผิดเครื่อง. Expected: SV-6 อ่าน serial จาก WH-3, block ถ้าไม่ตรง

---

## 6. หมายเหตุ

- เอกสารนี้เป็น **analysis เท่านั้น — ยังไม่แก้ code ใด ๆ**
- ทุก recommendation เป็นข้อเสนอ ต้อง confirm ก่อน implement (โดยเฉพาะ #8 FI-13 defer + #14 CF code ที่กระทบ CLAUDE.md/spec)
- Trust priority: latest user instruction → codebase state → AGENTS.md → active.md → notes. **mockup ชนะ spec/notes** เมื่อขัดกัน (เช่น #14 CF-2.6, #15 SL-CN)
- ⚠️ ข้อควรระวังที่พบระหว่างวิเคราะห์: analysis FI ที่ treat **FI-13 Dual-Book/Entity Tag เป็น active + business rule = ล้าสมัย** เทียบ decision 2026-05-31 (SWT single-entity, defer P2). ต้องยืนยัน scope ก่อนออกแบบ FI-7
- ไม่มีโฟลเดอร์ `bc365/` ในโปรเจกต์ — mockup ทั้งหมดเป็น `*.html` ที่ root
