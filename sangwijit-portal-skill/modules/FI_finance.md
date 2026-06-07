# FI — Finance Module Spec (งานการเงิน/บัญชี)

**Version:** 1.0 | **Phase:** P1 (Basic) + P2 (Expense/Credit) + P3 (Full)
**Module Code:** FI
**BC Entity หลัก:** customerLedgerEntries (21), vendorLedgerEntries (25), bankAccLedgerEntries (274), genJournalLines (81)
**อ่าน Flowchart ก่อน:** `/Design Ai/Flow Design/Finance/Flow/` + `/Account/Flow/` + `/Finance/Document/` + `/Account/Document/`

---

## 📋 Menu List

| รหัส | เมนู | Phase | BC Entity | หน้าจอ |
|---|---|---|---|---|
| FI-Q | Finance Dashboard | P1 | Multiple | Summary Cards + Aging |
| FI-1 | ประกบบิลลูกหนี้ AR (AR Receipt & Match) | P1 | customerLedgerEntries (21) | List + Form |
| FI-1Q | Apply Queue — รายการเงินเข้ารอจัดสรร (URC) | P1 | bankAccountReconciliations + customerLedgerEntries | Queue List |
| FI-2 | ตัดหนี้เจ้าหนี้ AP Payment | P1 | vendorLedgerEntries (25) | List + Form |
| FI-3 | กระทบยอดธนาคาร (Bank Reconciliation) | P1 | bankAccLedgerEntries (274) | Form |
| FI-4 | บันทึกรายการทั่วไป JV (Journal Voucher) | P1 | genJournalLines (81) | Form |
| FI-5 | ค่าใช้จ่าย & ใบสำคัญจ่าย (Expense Voucher) | **P2** | paymentJournals | List + Form |
| FI-6 | บริหารวงเงินลูกหนี้ (Credit Control) | **P2** | customerLedgerEntries | Dashboard |
| FI-7 | รายงานภาษีขาย/ภาษีซื้อ (ภ.พ.30) | P1 | vatEntries (254) | List + Release + Print |
| FI-8 | Accrual Monitor (Cross-View จาก PO-7) | P1 | vendorObligations (Read-Only) | Dashboard |
| FI-9 | สินทรัพย์ถาวร — สร้าง & ค่าเสื่อม (Fixed Asset) | **P2** | fixedAssets (5600) | List + Card |
| FI-10 | สินทรัพย์ถาวร — ขาย (FA Disposal) | **P2** | salesOrders + fixedAssets | Form |
| FI-11 | สินทรัพย์ถาวร — ทำลาย/สูญหาย (FA Write-Off) | **P2** | faJournalLines (5621) | Form |
| FI-12 | ภาษีหัก ณ ที่จ่าย WHT | P1 | Custom WHT + vendorPaymentJournals | List + Print |
| FI-13 | บัญชี 2 เล่ม Dual-Book (Consolidated + Tax) | **P3** | Multi-Company + Consolidation | Dashboard + Report |

---

## FI-Q — Finance Dashboard

### Layout
```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER: Finance Dashboard | เดือน | สาขา           │
├──────────────┬──────────────┬──────────────┬─────────────┤
│  AR ค้างรับ  │  AP ค้างจ่าย │  เงินสดย่อย  │ Bank Balance│
│  ฿2.4M      │  ฿1.8M      │  ฿50K        │  ฿12.3M    │
├──────────────┴──────────────┴──────────────┴─────────────┤
│  Aging AR: 0-30 วัน | 31-60 | 61-90 | >90 (สีเหลือง/แดง)│
│  Aging AP: รายการที่ครบกำหนดจ่ายภายใน 7 วัน             │
│  Pending Approval: เอกสารรออนุมัติทั้งหมด                │
└──────────────────────────────────────────────────────────┘
```

### BC API
```
GET /customerLedgerEntries?$filter=open eq true → AR Outstanding
GET /vendorLedgerEntries?$filter=open eq true   → AP Outstanding
GET /bankAccLedgerEntries?$top=50               → Bank Balance
```

---

## FI-1 — ประกบบิลลูกหนี้ AR (AR Receipt & Match)

### Module Brief
```
Module:  FI-1 AR Receipt
Phase:   P1
BC:      customerLedgerEntries (21), customerPaymentJournals
Trigger: ลูกค้าชำระเงิน → Finance รับและประกบกับ Invoice
         (1) Manual — โอนตรง/เช็ค/เงินสด → Finance กรอก FI-1 เอง
         (2) Auto-feed — ลูกค้าสแกน QR (Ref1 = รหัสลูกค้า) → bank
             statement → IA-Q sync → สร้าง URC (Unapplied Receipt)
             → เข้า FI-1Q Apply Queue → Auto-apply ตาม Ref1 หรือ
             เปิด FI-1 prefill
Output:  ปิด AR Entry ใน BC Ledger (customerLedgerEntries)
```

### ERP Form 7 Sections

**Section 2 — Doc Header**
```
เลขที่รับเงิน  : Auto | วันที่รับ    : Today
วิธีรับเงิน   : เงินสด / โอนธนาคาร / เช็ค
เลขที่เช็ค/Ref: ถ้าโอน/เช็ค
บัญชีธนาคาร  : ธนาคารที่รับ
```

**Section 3 — Party (SC1)**
```
ลูกค้า: SC1 CustomerSearch
Auto-show: ยอด AR ค้างทั้งหมด + Aging
```

**Section 4 — Line Items (Invoice Matching)**
```
แสดงรายการ Invoice ที่ยังค้างอยู่ของลูกค้า:
เลขที่ Invoice | วันที่ | ยอดรวม | ยอดค้าง | เลือกประกบ ✅

การประกบ:
- ประกบทั้งหมด: กด Apply All
- ประกบบางส่วน: ใส่จำนวนที่ประกบ
- ส่วนลดเงินสด (Cash Discount): ถ้ามี Early Payment Term
```

**Section 5 — Tabs**
```
Tab [สรุป]: ยอดรับ vs ยอดประกบ vs ยอดคงเหลือ (ถ้ามีส่วนต่าง)
Tab [ประวัติ]: SC7 Timeline
```

**Section 6 — Summary**
```
ยอดรับเงิน | ยอดประกบ Invoice | ส่วนลดเงินสด | ยอดคงเหลือ (Unapplied)
```

**Section 7 — Action Bar**
```
Draft  : [Save] [Post AR Receipt]
Posted : [พิมพ์ใบเสร็จ] [View Ledger Entry]
```

### Status Flow
```
Draft → Post → Invoice ปิด (Closed) / ยอดลด (Partial)
```

### RBAC
| Function | Admin | Finance Mgr | Accountant | Sales |
|---|---|---|---|---|
| สร้าง AR Receipt | ✅ | ✅ | ✅ | ❌ |
| Post | ✅ | ✅ | ✅ | ❌ |
| ดู AR Aging | ✅ | ✅ | ✅ | 🔍 (ลูกค้าตัวเอง) |

### BC API
```
GET  /customerLedgerEntries?customerId=&open=true   → Invoice ค้าง
POST /customerPaymentJournals                        → บันทึกรับเงิน
POST /customerPaymentJournal/{id}/Microsoft.NAV.post → Post AR
```

---

## FI-1Q — Apply Queue (รายการรอจัดสรรเข้า AR)

### Module Brief
```
Module:  FI-1Q AR Apply Queue
Phase:   P1
BC:      bankAccountReconciliations, customerLedgerEntries
Trigger: Bank Statement import (ลูกค้าโอน/สแกน QR) →
         สร้าง URC (Unapplied Receipt) ใน BC →
         แสดงในคิวนี้ให้ AR จัดสรร
Output:  เลือกบิลตัดหนี้ → ส่งต่อ FI-1 post RV → ปิด invoice
Doc:     URC-YYMM-#### (Unapplied Receipt, เข้าคิว)
         RV-YYMM-#### (เกิดหลัง apply, BC post)
```

### Page Layout — Queue view
```
Summary bar: วันนี้ N รายการ · Auto-ready X · Partial Y · Unmatched Z
Hero action: "N รายการพร้อม Auto-apply — 1-click ปิดหมด"
Filter: วันที่ / ธนาคาร / วิธี / scope tab / search (Ref1 / ชื่อ)
Table columns:
  วันที่ | ธนาคาร+Ref | ยอดเข้า | Ref1 (รหัสลูกค้า) | ลูกค้า+ค้าง |
  แมตช์บิลเปิด | สถานะ | Suggest | Action
Bulk bar (sticky bottom): เลือกแล้ว N · ยอด ฿XXX · [Auto-apply selected]
```

### 3 Categories ของ Row
| สถานะ | เงื่อนไข | Action |
|---|---|---|
| 🟢 **Auto-ready** | Ref1 ตรงลูกค้า + ยอดตรง open invoice | `[Auto-apply]` 1 คลิก → BC post RV อัตโนมัติ |
| 🟡 **Partial** | Ref1 ตรง · ยอดไม่ตรงบิลเดียว (FIFO/เกิน/หลายบิล) | `[จัดสรรเอง →]` เปิด FI-1 prefill ลูกค้า+ยอด, AR เลือกบิล |
| 🔴 **Unmatched** | Ref1 ผิด/ไม่มี หรือยอดเข้าก่อนบิล (advance) | `[เลือกลูกค้า]` / `[บันทึกเป็น Deposit]` |

### Flow Chain
```
Customer scan QR (Ref1=CustCode)
   ↓
Bank receives (SCB/KBank/BBL + TXN ref)
   ↓
IA-Q BC Sync (bank statement import, batch/webhook)
   ↓
URC-YYMM-#### created in BC (Unapplied Receipt)
   ↓
FI-1Q Apply Queue shows row
   ↓
[Auto-apply] — BC post RV + close INV → green
[จัดสรรเอง] — open FI-1 prefilled → AR picks invoices → Save+Post
[เลือกลูกค้า] — AR fixes Ref1 → re-check match
```

### RBAC
| Function | Admin | Finance Mgr | Accountant | Sales |
|---|---|---|---|---|
| ดู Apply Queue | ✅ | ✅ | ✅ | ❌ |
| Auto-apply (match 100%) | ✅ | ✅ | ✅ | ❌ |
| Manual apply / แก้ Ref1 | ✅ | ✅ | ✅ | ❌ |

### BC API
```
GET  /bankAccountReconciliations?status=unmatched    → URC รอจัดสรร
POST /bankAccountReconciliation/{id}/apply           → ลงทะเบียน apply
GET  /customerLedgerEntries?customerId=&open=true    → บิลเปิดของลูกค้า
POST /customerPaymentJournals + /post                → post RV ปิดบิล
```

### Linked pages
- FI-Q (Finance Queue) → AR card มีลิงก์ "📥 N รอจัดสรร"
- FI-1 (AR Receive) → topbar button "📥 Apply Queue N"
- IA-Q (BC Sync Monitor) → Bank Statement import feed

---

## FI-2 — ตัดหนี้เจ้าหนี้ AP Payment

### Module Brief
```
Module:  FI-2 AP Payment
Phase:   P1
BC:      vendorPaymentJournals, vendorLedgerEntries (25)
Trigger: ครบกำหนดจ่าย Vendor → Finance จ่ายและประกบ
Output:  ปิด AP Entry + บันทึก Bank ออก
```

### ERP Form 7 Sections

**Section 2 — Doc Header**
```
เลขที่จ่าย     : Auto | วันที่จ่าย  : Today
วิธีจ่าย       : โอนธนาคาร / เช็ค / เงินสด
บัญชีธนาคาร   : บัญชีที่จ่ายออก
เลขที่เช็ค     : ถ้าจ่ายด้วยเช็ค
```

**Section 3 — Party**
```
Vendor Search: ค้นหา Vendor ที่มี AP ค้าง
Auto-show: AP ค้างทั้งหมด + ครบกำหนดแล้ว
WHT Category: Auto-fill (จาก Vendor Card)
```

**Section 4 — Line Items (Invoice Matching)**
```
รายการ AP Invoice ค้าง:
เลขที่ | วันที่ Invoice | กำหนดชำระ | ยอดค้าง | WHT | เลือก ✅

WHT หัก ณ ที่จ่าย: Auto-calculate ตาม Category
ยอดจ่ายจริง = ยอด AP - WHT
```

**Section 5 — Tabs**
```
Tab [WHT Summary]: ภ.ง.ด.3/53 สรุปต่อ Vendor
Tab [ประวัติ]: SC7
```

**Section 6 — Summary**
```
ยอด AP | WHT หัก | ยอดโอน/เช็คจริง
```

### BC API
```
GET  /vendorLedgerEntries?vendorId=&open=true      → AP ค้าง
POST /vendorPaymentJournals                         → จ่าย
POST /vendorPaymentJournals/{id}/Microsoft.NAV.post → Post AP Payment
```

---

## FI-3 — กระทบยอดธนาคาร (Bank Reconciliation)

### Module Brief
```
Module:  FI-3 Bank Reconciliation
Phase:   P1
BC:      bankAccReconciliations, bankAccLedgerEntries (274)
Trigger: รายเดือน — กระทบ Statement ธนาคาร vs BC
Output:  ยืนยันยอดธนาคารถูกต้อง + Post Recon
```

### หน้าจอ Layout
```
┌────────────────────────────────────────────────────────────┐
│  Bank Recon | ธนาคาร | เดือน                               │
├──────────────────────┬─────────────────────────────────────┤
│  Statement ธนาคาร    │  รายการใน BC                        │
│  (Import CSV/Manual) │  (Auto-load จาก BC)                 │
│  ─────────────────── │  ─────────────────────────────────  │
│  วันที่ | Debit |Cr  │  วันที่ | Ref | Amount | Match ✅   │
│  01/04  |  5000 |    │  01/04  | PV001 | 5000 | ✅ Match   │
│  03/04  |       |3000│  03/04  | AR Receipt | 3000 | ✅    │
│  05/04  |  2000 |    │  ??? → ไม่พบใน BC (Unmatched)      │
└──────────────────────┴─────────────────────────────────────┘
│  ยอด Statement: 50,000 | ยอด BC: 49,500 | ผลต่าง: 500     │
│  [Auto-Match] [Manual Match] [Post Recon] [Export]         │
```

### Business Rules
- Auto-match: Match ตาม Amount + วันที่ ± 3 วัน
- Unmatched → สร้าง JV ปรับปรุง (FI-4) ก่อน Post Recon
- ต้องทำทุกบัญชี ทุกเดือน ก่อนปิดงวด (Lock Period · BC365)

### BC API
```
GET  /bankAccLedgerEntries?bankAccountNo=&postingDate= → BC รายการ
POST /bankAccReconciliations                            → สร้าง Recon
POST /bankAccReconciliations/{id}/Microsoft.NAV.post   → Post Recon
```

---

## FI-4 — บันทึกรายการทั่วไป JV (Journal Voucher)

### Module Brief
```
Module:  FI-4 Journal Voucher
Phase:   P1
BC:      generalJournalBatches, genJournalLines (81)
Trigger: ปรับปรุงรายการ / Accrual / ค่าเสื่อม / รายการพิเศษ
Output:  GL Entry ใน BC
```

### ERP Form

**Section 2 — Doc Header**
```
เลขที่ JV     : Auto | วันที่       : Today
ประเภท JV    : Accrual / ปรับปรุง / โอน GL / อื่น ๆ
Batch Name   : ชื่อ Journal Batch ใน BC
```

**Section 4 — Line Items**
```
บรรทัด: บัญชี GL | คำอธิบาย | Dr | Cr | Dimension (แผนก/สาขา)
ต้องสมดุล: Dr = Cr ก่อน Post
Template: เลือก JV Template ที่บันทึกไว้ล่วงหน้า
```

**Section 7 — Action Bar**
```
Draft  : [Save] [Check Balance] [Post JV]
Posted : [View GL Entries] [Reverse JV]
```

### BC API
```
POST /generalJournalLines                             → สร้าง JV Line
POST /journals/{id}/Microsoft.NAV.post               → Post JV
```

---

## FI-5 — ค่าใช้จ่าย & ใบสำคัญจ่าย (Expense Voucher) — Phase 2

### Module Brief
```
Module:  FI-5 Expense & Payment Voucher
Phase:   P2
BC:      paymentJournals, genJournalLines (81)
Trigger: มีค่าใช้จ่ายทั่วไปที่ไม่ผ่าน AP/PO (ค่าน้ำ ค่าไฟ ค่าเดินทาง ฯลฯ)
Output:  ใบสำคัญจ่าย + GL บันทึก + Bank ออก
```

### ERP Form 7 Sections

**Section 2 — Doc Header**
```
เลขที่ PV       : Auto | วันที่จ่าย   : Today
ประเภทค่าใช้จ่าย: Dropdown (ค่าน้ำมัน/ค่าเดินทาง/ค่าอาหาร/ค่าซ่อมแซม/อื่น ๆ)
```

**Section 3 — Party**
```
ผู้รับเงิน: Vendor / พนักงาน (Employee)
WHT: ตาม Category ของผู้รับ
```

**Section 4 — Line Items**
```
รายการค่าใช้จ่าย:
คำอธิบาย | GL Account | Amount | VAT Flag | Dimension
```

**Section 5 — Tabs**
```
Tab [ชำระ]: SC3 (โอน/เช็ค/เงินสด)
Tab [เอกสาร]: แนบใบเสร็จ / สลิปโอน
Tab [ประวัติ]: SC7
```

### Status Flow
```
Draft → รออนุมัติ → อนุมัติ → จ่ายแล้ว → Post GL → ปิด
```

### BC API
```
POST /paymentJournals   → บันทึกจ่าย
POST /generalJournalLines → GL Entry
```

---

## FI-6 — บริหารวงเงินลูกหนี้ (Credit Control Dashboard) — Phase 2

### วัตถุประสงค์
ติดตามลูกหนี้ที่มีความเสี่ยง: เกินวงเงิน / เกินกำหนดชำระ / ประวัติการจ่ายแย่

### หน้าจอ Dashboard
```
┌────────────────────────────────────────────────────────────┐
│  Credit Control | สาขา | วันที่                           │
├─────────┬──────────┬──────────┬──────────┬────────────────┤
│ ชื่อลูกค้า│วงเงิน   │ค้างอยู่ │เกินวงเงิน│ Overdue (วัน) │
│ ABC Co  │ 500,000 │ 480,000 │ -20,000  │ 45 วัน 🔴     │
│ XYZ Co  │ 200,000 │ 180,000 │ 0        │ 15 วัน 🟡     │
└─────────┴──────────┴──────────┴──────────┴────────────────┘
Actions per Row:
[Hold] [Send Notice] [ขออนุมัติ Override] [ดูประวัติ]
```

### Alert Rules
- Outstanding > Credit Limit → 🔴 ล็อก ต้องขออนุมัติ (SL-F1)
- Overdue > 30 วัน → 🟡 Warning + Auto Email/LINE
- Overdue > 60 วัน → 🔴 Hold อัตโนมัติ

### BC API
```
GET /customerLedgerEntries?open=true             → Outstanding
GET /customers?$select=creditLimit,balanceDue    → วงเงิน + ค้าง
PATCH /customers/{id}                            → Update Blocked/Credit
```

---

## FI-7 — รายงานภาษีขาย/ภาษีซื้อ (ภ.พ.30) — Phase 1

> ดู ADR-0002. FI-7 = **รายงาน VAT เท่านั้น**. "ปิดงวด / Lock Period" = **cut-to-BC** (BC365 owns; flows Account/08 Close Period, /09 Close Year) — ไม่ใช่หน้า Portal.

### Flow (Account/Flow/06 — อยู่ใน BC365 lane, Portal เป็น thin UI)
```
1. Login → ดึง Posted Sales/Purchase Invoice (ที่มี VAT) ผ่าน API (Get VAT Data)
2. รายงานภาษีขาย (Output VAT register) | รายงานภาษีซื้อ (Input VAT register)
   — เลือกนิติบุคคล + งวดภาษี
3. กด Release → ล็อกรายงานแต่ละฝั่ง
4. Print รายงานภาษีขาย / ภาษีซื้อ
5. สรุป ภ.พ.30 = ภาษีขาย − ภาษีซื้อ → ยื่นภายในวันที่ 15 ของเดือนถัดไป
```
(กระทบยอด BC vs ยอดยื่นจริง = นอก flow · ไม่ใช่ scope หน้านี้)

### BC API
```
GET  /vatEntries?$filter=companyTag eq '{tag}'&period= → VAT รายงาน (ขาย/ซื้อ)
POST /vatReports/{id}/release                          → Release (ล็อก)
GET  /vatReports/{id}/print                            → พิมพ์รายงาน
GET  /vatSummary?companyTag=&period=                   → สรุป ภ.พ.30
```

---

## FI-8 — Accrual Monitor (Cross-View จาก PO-7) — Read-Only

### วัตถุประสงค์
ให้ Finance เห็นภาพรวมงบส่งเสริมการขายที่ห้าง/Vendor สัญญาจะจ่าย
**ข้อมูลต้นทาง: PO-7 Sale-In Accrual (Purchase Module เป็นเจ้าภาพ)**

### หน้าจอ Dashboard
```
┌──────────────────────────────────────────────────────────────┐
│  Accrual Monitor | Filter: ห้าง | งวด | สถานะ               │
├──────────┬───────────┬───────────┬───────────┬──────────────┤
│ ห้าง/Vendor│ ตาม Agree │ ได้เอกสาร│ รับเงินแล้ว│ ค้าง        │
│ HomePro   │ 500,000  │ 300,000  │ 200,000  │ 300,000 🟡   │
│ Power Buy │ 200,000  │ 200,000  │ 200,000  │ 0 🟢         │
│ Watsadu   │ 150,000  │ 0        │ 0        │ 150,000 🔴   │
├──────────┴───────────┴───────────┴───────────┴──────────────┤
│ สรุป: Accrued รวม ฿850K | ได้เอกสาร ฿500K | รับจริง ฿400K │
│ ค้างรวม: ฿450K                                              │
│ 🟢 ครบ  🟡 รอเอกสาร (<90d)  🔴 เกิน 90 วัน                │
└──────────────────────────────────────────────────────────────┘
```

### การใช้งานโดย Finance
- **ปิดงวด (Lock Period · BC365)**: ต้อง reconcile Accrual ทุกรายการก่อนปิด
- **GL Impact**: ดู Dr/Cr ที่ book ไว้ per Accrual
- **Aging Alert**: เกิน 90 วันไม่ได้เอกสาร → Finance ต้อง follow up กับจัดซื้อ

### RBAC
| Role | ดู Dashboard | ดู GL Detail | Record Payment | Export |
|---|---|---|---|---|
| Finance Mgr | ✅ | ✅ | ✅ | ✅ |
| Accountant | ✅ | ✅ | ✅ | ✅ |
| Purchase Mgr | ✅ (ดูสรุป) | ❌ | ❌ | ✅ |
| Others | ❌ | ❌ | ❌ | ❌ |

### BC API (Read from PO-7 data)
```
GET /vendorObligations?$filter=status ne 'Cancelled'  → ดูทั้งหมด
GET /vendorObligations?$filter=status eq 'Accrued' and accrualDate le adddays(today,-90) → Aging Alert
GET /generalLedgerEntries?$filter=sourceType eq 'VendorObligation' → GL Detail
```

### หมายเหตุ
> FI-8 เป็น **Read-Only View** ข้อมูลมาจาก PO-7
> การสร้าง/แก้ไข Accrual → ไปที่ PO-7 (Purchase Module)
> การ Record Payment → ทำได้ทั้งจาก PO-7 (Purchase confirm) หรือ FI-8 (Finance record)

---

## FI-9 — สร้างสินทรัพย์ถาวร & รันค่าเสื่อม (Fixed Asset — Create & Depreciation)

### Module Brief
```
Module:  FI-9 Fixed Asset Create & Depreciation
Phase:   P2
BC:      fixedAssets (Table 5600), faDepreciationBooks (5612), faJournalLines (5621)
Trigger: ซื้อ/รับสินทรัพย์ถาวรใหม่ หรือ ถึงกำหนดรันค่าเสื่อมรายเดือน
Output:  ทะเบียนสินทรัพย์ + GL Entry ค่าเสื่อมราคา
Flowchart: Account/Flow/10 - Fixed Asset สร้างและรันค่าเสื่อม
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: ทะเบียนสินทรัพย์ถาวร | Status Badge (Active/Disposed/Inactive)
ActionBar: [สร้างใหม่] [รันค่าเสื่อม] [พิมพ์ทะเบียน] [Export]
View Mode: [List View] [Card View]
```

**Section 2 — Doc Header (Asset Card)**
```
รหัสสินทรัพย์  : Auto (FA No. Series)
ชื่อสินทรัพย์  : Required (TH/EN)
ประเภท FA     : Dropdown (อาคาร/เครื่องจักร/อุปกรณ์สำนักงาน/ยานพาหนะ/IT/อื่นๆ)
สถานที่        : สาขา / แผนก (Dimension)
ผู้รับผิดชอบ   : Employee (ถ้ามี)
```

**Section 3 — Depreciation Info**
```
มูลค่าที่ได้มา         : Required (Acquisition Cost)
วันที่ได้มา            : Required (Acquisition Date)
วิธีคิดค่าเสื่อม       : เส้นตรง (Straight-Line) / ลดลงทวีคูณ (Declining)
จำนวนปีคิดค่าเสื่อม   : Required (เช่น 5 ปี, 10 ปี, 20 ปี)
มูลค่าซาก             : Default 0 (Salvage Value)
วันที่เริ่มรันค่าเสื่อม : Required (Depreciation Starting Date)
```

**Section 4 — Depreciation Schedule (Auto-calculated)**
```
ตาราง: เดือน | ค่าเสื่อมประจำเดือน | ค่าเสื่อมสะสม | มูลค่าตามบัญชี (NBV)
แสดง Bar Chart: NBV ลดลงตามเวลา
```

**Section 5 — Tabs**
```
Tab [ข้อมูลเพิ่มเติม]: หมายเลข Serial, ยี่ห้อ/รุ่น, เลขที่ PO อ้างอิง, รูปถ่าย
Tab [ประวัติ GL]: รายการ GL ที่ Post แล้ว (Acquisition + Depreciation)
Tab [ประวัติ]: SC7 Timeline (สร้าง → รันค่าเสื่อม → ขาย/ทำลาย)
```

**Section 7 — Action Bar**
```
Active  : [แก้ไข] [รันค่าเสื่อม] [ขาย → FI-10] [ทำลาย → FI-11]
Disposed: [View Only] [ดู GL]
```

### รันค่าเสื่อม (Calculate Depreciation) — Batch Process
```
Flow (จาก Flowchart):
1. Login → เลือก "รันค่าเสื่อม"
2. เลือกงวด (เดือน/ปี) + Depreciation Book
3. สร้างใหม่ หรือ รันจากของเดิม
4. Calculate Depreciation → Preview รายการ
5. Post to GL → บันทึกค่าเสื่อมเข้า GL

กดรันรายเดือน (Auto-schedule ได้ใน Phase 3)
```

### Status Flow
```
Draft → Active (Post Acquisition) → Depreciation Running (Monthly)
                                        ↓
                        Fully Depreciated (NBV = Salvage)
                                        ↓
                        Disposed (ขาย FI-10 / ทำลาย FI-11)
```

### RBAC
| Function | Admin | Finance Mgr | Accountant | Others |
|---|---|---|---|---|
| สร้าง FA Card | ✅ | ✅ | ✅ | ❌ |
| แก้ไขมูลค่า | ✅ | ✅ | ❌ | ❌ |
| รันค่าเสื่อม | ✅ | ✅ | ✅ | ❌ |
| Post GL | ✅ | ✅ | ✅ | ❌ |
| ดูทะเบียน | ✅ | ✅ | ✅ | 🔍 (สาขาตัวเอง) |

### BC API
```
GET    /fixedAssets                              → รายการ FA ทั้งหมด
POST   /fixedAssets                              → สร้าง FA ใหม่
PATCH  /fixedAssets/{id}                         → แก้ไข
GET    /fixedAssets/{id}?$expand=depreciationBook → ดูข้อมูลค่าเสื่อม
POST   /faJournalLines                           → สร้างรายการค่าเสื่อม
POST   /faJournals/{id}/Microsoft.NAV.post       → Post ค่าเสื่อมเข้า GL
```

---

## FI-10 — ขายสินทรัพย์ถาวร (Fixed Asset — Disposal by Sale)

### Module Brief
```
Module:  FI-10 FA Disposal (Sale)
Phase:   P2
BC:      salesOrders (36/37) + fixedAssets (5600)
Trigger: ขายสินทรัพย์ที่ไม่ใช้แล้ว
Output:  บันทึกรายได้จากการขาย + ตัดสินทรัพย์ออก + GL Entry (กำไร/ขาดทุนจากการจำหน่าย)
Flowchart: Account/Flow/11 - Fixed Asset ขายสินทรัพย์
```

### Flow (จาก Flowchart)
```
1. Login → สร้าง Sales Order (เลือกสินทรัพย์ที่จะขาย)
2. ระบุราคาขาย + ผู้ซื้อ
3. Post Ship and Invoice
4. บันทึกรายได้และตัดสินทรัพย์ (Post to GL)
   → Dr: เงินสด/ลูกหนี้, Cr: สินทรัพย์ + กำไร(ขาดทุน)จากการจำหน่าย
```

### ERP Form
```
Section 2 — Doc Header:
  เลขที่ขาย FA   : Auto
  สินทรัพย์      : เลือกจากทะเบียน (FI-9) — แสดง NBV ปัจจุบัน
  ราคาขาย       : Input (เปรียบเทียบกับ NBV → แสดงกำไร/ขาดทุน)
  ผู้ซื้อ        : ลูกค้า / บุคคลภายนอก

Section 6 — Summary:
  มูลค่าที่ได้มา | ค่าเสื่อมสะสม | NBV | ราคาขาย | กำไร(ขาดทุน)
```

### Status Flow
```
Draft → Confirmed → Post Ship & Invoice → FA Status = Disposed
```

### BC API
```
POST /salesOrders (Type = Fixed Asset)    → สร้าง Sales Order
POST /salesOrders/{id}/shipAndInvoice     → Post
→ Auto: GL บันทึกรายได้ + ตัด FA + คำนวณ Gain/Loss
```

---

## FI-11 — ทำลาย/สูญหาย สินทรัพย์ (Fixed Asset — Write-Off)

### Module Brief
```
Module:  FI-11 FA Write-Off
Phase:   P2
BC:      faJournalLines (5621) + fixedAssets (5600)
Trigger: สินทรัพย์เสียหายซ่อมไม่ได้ / สูญหาย / หมดอายุการใช้งาน
Output:  ตัดสินทรัพย์ออก + GL Entry (ขาดทุนจากการตัดจำหน่าย)
Flowchart: Account/Flow/12 - Fixed Asset ทำลายและสูญหาย
```

### Flow (จาก Flowchart)
```
1. Login → Fixed Asset G/L Journal
2. เลือกสินทรัพย์ที่จะทำลาย/สูญหาย
3. ระบุเหตุผล: ทำลาย / สูญหาย / หมดอายุ
4. Post to G/L
   → Dr: ขาดทุนจากการตัดจำหน่าย, Cr: สินทรัพย์ (ตัด NBV ทั้งหมด)
```

### ERP Form
```
Section 2 — Doc Header:
  เลขที่ Write-Off : Auto
  สินทรัพย์       : เลือกจากทะเบียน (FI-9) — แสดง NBV
  ประเภท          : Dropdown (ทำลาย / สูญหาย / หมดอายุ)
  เหตุผล          : Text (Required)
  เอกสารแนบ       : รูปถ่ายหลักฐาน / บันทึกตำรวจ (กรณีสูญหาย)
  ผู้อนุมัติ       : Required (Finance Mgr ขึ้นไป)

Section 6 — Summary:
  มูลค่าที่ได้มา | ค่าเสื่อมสะสม | NBV ที่ตัด | GL Account
```

### Status Flow
```
Draft → รออนุมัติ → Approved → Post GL → FA Status = Disposed
```

### RBAC
| Function | Admin | Finance Mgr | Accountant |
|---|---|---|---|
| สร้าง Write-Off | ✅ | ✅ | ✅ |
| อนุมัติ | ✅ | ✅ | ❌ |
| Post GL | ✅ | ✅ | ❌ |

### BC API
```
POST /faJournalLines (FA Posting Type = Disposal) → สร้างรายการตัดจำหน่าย
POST /faJournals/{id}/Microsoft.NAV.post           → Post to GL
PATCH /fixedAssets/{id} → Status = Disposed
```

---

## FI-12 — ภาษีหัก ณ ที่จ่าย WHT (Withholding Tax)

### Module Brief
```
Module:  FI-12 WHT
Phase:   P1
BC:      Custom WHT Table (AL Extension) + vendorPaymentJournals
Trigger: จ่ายเงินเจ้าหนี้ (FI-2 AP Payment) → ระบบคำนวณ WHT อัตโนมัติ
Output:  WHT Certificate (หนังสือรับรอง หัก ณ ที่จ่าย) + ภ.ง.ด.3/53
Flowchart: Account/Flow/07 - WHT
```

### Flow (จาก Flowchart)
```
Flow หลัก:
1. Login → WHT List (ดึงข้อมูล WHT จาก Payment Journal)
2. ตรวจสอบรายการ WHT ที่ค้าง
3. กด Release → Lock รายการ
4. Print WHT Certificate (หนังสือรับรอง)

Flow เชื่อมกับ FI-2 AP Payment:
  FI-2 จ่ายเจ้าหนี้ → Auto-calculate WHT ตาม Vendor Category
  → สร้างรายการ WHT อัตโนมัติ → เข้า WHT List
```

### หน้าจอ WHT List
```
┌──────────────────────────────────────────────────────────────────┐
│  WHT List | Filter: เดือน | ประเภท (ภ.ง.ด.3/53) | สถานะ        │
├──────────┬──────────┬──────────┬────────┬────────┬──────────────┤
│ เลขที่   │ วันที่จ่าย│ Vendor   │ ยอดจ่าย │ WHT %  │ WHT Amount  │
│ WHT-001  │ 01/04/26 │ ABC Co   │ 50,000 │ 3%     │ 1,500       │
│ WHT-002  │ 03/04/26 │ XYZ Ltd  │ 100,000│ 3%     │ 3,000       │
├──────────┴──────────┴──────────┴────────┴────────┴──────────────┤
│ สรุป: รายการทั้งหมด 25 | WHT รวม ฿45,000 | Released 20 | Pending 5│
│ [Release Selected] [Print WHT] [Export ภ.ง.ด.3] [Export ภ.ง.ด.53]│
└──────────────────────────────────────────────────────────────────┘
```

### WHT Certificate (หนังสือรับรอง)
```
ข้อมูลที่พิมพ์:
  - ผู้จ่ายเงิน: ชื่อบริษัท, เลขผู้เสียภาษี, ที่อยู่
  - ผู้รับเงิน (Vendor): ชื่อ, เลขผู้เสียภาษี, ที่อยู่
  - ประเภทเงินได้: ค่าบริการ / ค่าเช่า / ค่าขนส่ง / อื่นๆ
  - จำนวนเงินที่จ่าย, อัตราภาษี (%), จำนวนภาษีที่หัก
  - วันเดือนปี
  Format: ตามแบบฟอร์มสรรพากร
```

### ภ.ง.ด.3 / ภ.ง.ด.53 Report
```
สร้างไฟล์สรุปรายเดือน:
  ภ.ง.ด.3  → หักจากบุคคลธรรมดา
  ภ.ง.ด.53 → หักจากนิติบุคคล
  Group by: เดือน → Vendor → รายการ
  Export: PDF + CSV (สำหรับยื่นออนไลน์ RD)
```

### Status Flow
```
Auto-Created (จาก FI-2) → Pending → Released → Printed
                                        ↓
                                  ยื่น ภ.ง.ด. (Monthly)
```

### RBAC
| Function | Admin | Finance Mgr | Accountant | Others |
|---|---|---|---|---|
| ดู WHT List | ✅ | ✅ | ✅ | ❌ |
| Release | ✅ | ✅ | ✅ | ❌ |
| Print WHT | ✅ | ✅ | ✅ | ❌ |
| Export ภ.ง.ด. | ✅ | ✅ | ✅ | ❌ |
| แก้ไข WHT | ✅ | ✅ | ❌ | ❌ |

### BC API
```
GET  /whtEntries?$filter=period eq '2026-04'          → WHT รายเดือน
GET  /whtEntries?$filter=vendorId eq '{id}'            → WHT per Vendor
POST /whtEntries/{id}/release                          → Release (Lock)
GET  /whtEntries/{id}/certificate                      → Print WHT Certificate
GET  /whtEntries?$filter=type eq 'PND3'&period=        → ภ.ง.ด.3
GET  /whtEntries?$filter=type eq 'PND53'&period=       → ภ.ง.ด.53
```

### Business Rules
- WHT คำนวณอัตโนมัติจาก FI-2 AP Payment ตาม Vendor WHT Category
- อัตราภาษี: 1% (ค่าขนส่ง), 2% (ค่าโฆษณา), 3% (ค่าบริการ/ค่าเช่า), 5% (ค่าจ้างทำของ)
- Vendor ที่เป็น **บุคคลธรรมดา** → ภ.ง.ด.3 / **นิติบุคคล** → ภ.ง.ด.53
- ต้อง Release ก่อนสิ้นเดือน เพื่อพิมพ์และยื่นภายในวันที่ 7 ของเดือนถัดไป
- WHT ที่ Release แล้ว → ห้ามแก้ไข (ต้อง Reverse + สร้างใหม่)

---

## 📌 Finance Module — Business Rules รวม

1. **3-Way Match AR**: Invoice → Receipt → Bank Statement ต้องตรงกัน
2. **WHT Auto**: ทุก AP Payment คำนวณ WHT อัตโนมัติตาม Vendor Category
3. **Bank Recon Monthly**: ต้องทำก่อน Period Close ทุกเดือน
4. **Credit Alert**: SC1 ดึง Credit Status ทุกครั้งก่อนเปิดบิล
5. **Maker ≠ Checker**: ผู้สร้าง JV ≠ ผู้ Approve เสมอ
6. **Period Lock**: หลังปิดงวด → ห้าม Post ย้อนหลัง (ต้อง Reopen Period ผ่าน Admin)
7. **Fixed Asset Depreciation**: รันค่าเสื่อมรายเดือน → Post GL ก่อนปิดงวด (Lock Period · BC365)
8. **FA Disposal**: ขาย (FI-10) หรือ ทำลาย (FI-11) → ต้องมีอนุมัติ Finance Mgr
9. **WHT Auto-Calculate**: FI-2 จ่าย Vendor → Auto WHT ตาม Category → เข้า WHT List (FI-12)
10. **WHT Deadline**: Release + ยื่น ภ.ง.ด. ภายในวันที่ 7 ของเดือนถัดไป
11. **Dual-Book (FI-13)**: Consolidated (บริหาร) vs Tax (สรรพากร) ต้อง reconcile กันทุกงวด

---

## FI-13 — บัญชี 2 เล่ม Dual-Book (ห้องหลัก + ห้องภาษี)

### Module Brief
```
Module:  FI-13 Dual-Book Accounting
Phase:   P3
BC:      Single Main Company + Dimension Tag (Entity Code) + genJournalLines (81)
Trigger: ปิดงวดรายเดือน → กรองข้อมูลจากห้องหลัก → โอนไปห้องภาษี
Output:  (1) ห้องหลัก = งบบริหารรวม (2) ห้องภาษี = งบแยกนิติบุคคลส่งสรรพากร
Flowchart: Data Transfer/01-06 (6 ไฟล์)
```

### Business Case — ระบบจริงของแสงวิจิตร
```
⚠️ ไม่ใช่ Standard Consolidation (รวม 4 BC Companies)
⚠️ เป็นระบบ "ห้องหลัก → กรอง Tag → ห้องภาษี" (Single DB + Dimension Filter)

ห้องหลัก (Main Room) = ฐานข้อมูลเดียว บันทึกทุกรายการรวม ทุกนิติบุคคล
  → ผู้บริหารดูภาพรวมจริง (เห็นทั้ง VAT + noVAT + ทุกบริษัท)

ห้องภาษี (Tax Room) = ห้องแยกต่อนิติบุคคล
  → รับข้อมูลที่กรอง+โอนมาจากห้องหลัก
  → สำหรับยื่นสรรพากร (ภาษีซื้อ-ภาษีขาย per นิติบุคคล)
```

### Entity Tag System (Configurable)
```
ทุกบิลซื้อจะถูก Tag ตาม "ชื่อบริษัทที่ Vendor ออกใบกำกับให้":

┌──────┬─────────────────────────────────┬─────────────────┐
│ Tag  │ นิติบุคคล                        │ ตัวอย่าง         │
├──────┼─────────────────────────────────┼─────────────────┤
│ 1    │ บจก. แสงวิจิตร เทรดดิ้ง (SWT)   │ บิลซื้อในนาม SWT│
│ 2    │ บจก. แสงวิจิตร อีเลคทริค (SWE)  │ บิลซื้อในนาม SWE│
│ 3    │ บจก. วีพาวเวอร์ (WPS)           │ บิลซื้อในนาม WPS│
│ ...  │ (เพิ่มได้ตามจำนวนนิติบุคคลจริง)   │ Admin Config    │
│ novat│ ไม่มีใบกำกับภาษี                 │ Vendor ออกให้ไม่ได้│
└──────┴─────────────────────────────────┴─────────────────┘

⚙️ Tag ไม่จำกัดจำนวน — Admin กำหนดใน Config (CF Module)
```

### 2 ห้อง (Sub-Modules)

#### FI-13A — ห้องหลัก (Main Room — บริหาร)
```
วัตถุประสงค์: ฐานข้อมูลจริง บันทึกทุกรายการซื้อ-ขาย ทุกนิติบุคคล รวมกัน
ผู้ใช้: ผู้บริหาร, ผู้จัดการบัญชี

ข้อมูลที่อยู่ในห้องหลัก:
  ✅ บิลซื้อทั้งหมด (Tag 1/2/3/.../novat)
  ✅ บิลขายทั้งหมด (ทั้งที่ลูกค้าขอ+ไม่ขอใบกำกับ)
  ✅ รายรับ-รายจ่ายทั้งหมด
  ✅ สต็อกสินค้ารวม

หน้าจอ:
┌──────────────────────────────────────────────────────────────────┐
│  ห้องหลัก (Main Room) | เดือน | ปี                               │
├──────────────────────────────────────────────────────────────────┤
│  Summary Cards:                                                   │
│  [ยอดซื้อรวม ฿XX] [ยอดขายรวม ฿XX] [กำไรรวม ฿XX]                │
├──────────────────────────────────────────────────────────────────┤
│  Filter: Tag [All ▾] | ประเภท [ซื้อ/ขาย ▾] | สถานะ [โอนแล้ว/ยังไม่โอน ▾]│
├──────┬──────────┬──────────┬──────┬──────────┬──────┬───────────┤
│ เลขที่│ วันที่    │ คู่ค้า    │ ยอด  │ VAT     │ Tag  │ สถานะโอน  │
│ PV001│ 01/04/26 │ Daikin   │ 500K │ 35K     │ 1    │ ✅ โอนแล้ว│
│ PV002│ 02/04/26 │ ร้านXX   │ 5K   │ —       │novat │ ⬜ ไม่โอน │
│ IV001│ 03/04/26 │ ลูกค้าA  │ 80K  │ 5.6K    │ —    │ ✅ โอนแล้ว│
│ IV002│ 04/04/26 │ Walk-in  │ 15K  │ —       │ —    │ ⬜ รอบิลทิ้ง│
├──────┴──────────┴──────────┴──────┴──────────┴──────┴───────────┤
│ [เลือกรายการ] [โอนไปห้องภาษี] [สร้างบิลทิ้ง] [Export]          │
└──────────────────────────────────────────────────────────────────┘
```

#### FI-13B — ห้องภาษี (Tax Room — สรรพากร)
```
วัตถุประสงค์: รับข้อมูลที่กรองแล้วจากห้องหลัก สำหรับยื่นภาษีแต่ละนิติบุคคล
ผู้ใช้: ห้องภาษี (Tax Accountant)

ข้อมูลที่โอนมา:
  ฝั่งซื้อ (ภาษีซื้อ):
    ✅ บิลซื้อที่ Tag ตรงกับนิติบุคคลนี้ (เช่น Tag 1 → ห้อง SWT)
    ❌ novat ไม่โอน (หรือโอนแยกบัญชีไม่มี VAT)

  ฝั่งขาย (ภาษีขาย):
    ✅ บิลขายที่ลูกค้าขอใบกำกับภาษี (ออกในนามนิติบุคคลนี้)
    ✅ "บิลทิ้ง" — ครอบคลุมรายการที่ลูกค้าไม่ขอใบกำกับ

หน้าจอ:
┌──────────────────────────────────────────────────────────────────┐
│  ห้องภาษี | นิติบุคคล: [SWT - แสงวิจิตรเทรดดิ้ง ▾] | เดือน     │
├──────────────────────────────────────────────────────────────────┤
│  ภาษีซื้อ (Input VAT):                                          │
│  รายการบิลซื้อ Tag 1 ที่โอนมา: 45 รายการ | VAT รวม ฿320,000    │
├──────────────────────────────────────────────────────────────────┤
│  ภาษีขาย (Output VAT):                                          │
│  ใบกำกับที่ออก: 120 รายการ | VAT รวม ฿480,000                   │
│  บิลทิ้ง: 5 รายการ | VAT รวม ฿15,000                            │
├──────────────────────────────────────────────────────────────────┤
│  สรุป: ภาษีขาย ฿495,000 - ภาษีซื้อ ฿320,000 = ต้องจ่าย ฿175,000│
│  [ตรวจสอบรายการ] [Adjust] [Preview ภ.พ.30] [Export] [ยื่นภาษี] │
└──────────────────────────────────────────────────────────────────┘
```

### "บิลทิ้ง" — Sales VAT Catch-Up Invoice
```
เมื่อลูกค้าไม่ขอใบกำกับภาษี → ห้องภาษียังต้องแสดงรายได้ให้ครบ
→ สร้าง "บิลทิ้ง" เพื่อออกใบกำกับครอบคลุมยอดที่เหลือ

วิธีสร้างบิลทิ้ง:
  1. เลือกรายการขายที่ยังไม่มีใบกำกับจากห้องหลัก
  2. เลือกวิธี: [รวมยอดเป็นบิลเดียว] หรือ [แยกทีละรายการ]
  3. ชื่อลูกค้า: ใช้ชื่อจริง หรือ ชื่ออื่น (เช่น "ลูกค้าทั่วไป")
  4. ราคา: ใช้ราคาจริง หรือ Adjust ราคาได้
  5. Post → ออกใบกำกับภาษี → เข้า Output VAT ของนิติบุคคลนั้น

หน้าจอ สร้างบิลทิ้ง:
┌──────────────────────────────────────────────────────┐
│  สร้างบิลทิ้ง | นิติบุคคล: SWT | เดือน: เม.ย. 2026  │
├──────────────────────────────────────────────────────┤
│  รายการขายที่ยังไม่มีใบกำกับ:                         │
│  ☑ IV002 Walk-in ฿15,000                             │
│  ☑ IV005 Walk-in ฿8,500                              │
│  ☑ IV009 ลูกค้าB ฿22,000                            │
├──────────────────────────────────────────────────────┤
│  วิธีออกบิล: (●) รวมยอด ( ) แยกทีละรายการ            │
│  ชื่อลูกค้าบนบิล: [ลูกค้าทั่วไป    ▾] หรือพิมพ์เอง  │
│  ยอดรวม: ฿45,500                                     │
│  Adjust ราคา: [✅ อนุญาต] → แก้ไขได้ก่อน Post        │
│  VAT 7%: ฿3,185                                      │
├──────────────────────────────────────────────────────┤
│  [Preview บิล] [Post บิลทิ้ง] [Cancel]               │
└──────────────────────────────────────────────────────┘
```

### Data Transfer Flow (จาก Flowchart 6 ไฟล์)
```
6 ไฟล์ Data Transfer = กลไก "กรอง + โอน" จากห้องหลัก → ห้องภาษี:

  01 Sales Process         → โอนบิลขายที่มีใบกำกับ + บิลทิ้ง
  02 Sales Credit Memo     → โอนใบลดหนี้ขาย
  03 Cash Receipt Journal  → โอนรายรับเงิน (ที่ match กับบิลที่โอน)
  04 Purchase Process      → โอนบิลซื้อตาม Tag นิติบุคคล (ไม่รวม novat)
  05 Purchase Credit Memo  → โอนใบลดหนี้ซื้อ
  06 Payment Journal       → โอนรายจ่ายเงิน (ที่ match กับบิลที่โอน)

Flow: ห้องหลัก → เลือก Tag/Filter → Preview → Confirm โอน → ห้องภาษี
```

### Tag ณ จุดบันทึก (เมื่อไหร่ Tag?)
```
ฝั่งซื้อ: PO-6 ตั้งหนี้ AP Invoice → ฟิลด์ "Entity Tag" (1/2/3/.../novat) [Required]
  → Vendor ออกใบกำกับในชื่อบริษัทไหน = Tag นั้น
  → Vendor ออกให้ไม่ได้ = novat

ฝั่งขาย: SL-4 บิลขาย → ฟิลด์ "ออกใบกำกับ" (ใช่/ไม่)
  → ถ้าใช่ → ระบุนิติบุคคลที่ออก (1/2/3/...)
  → ถ้าไม่ → รอ "บิลทิ้ง" ในห้องภาษีภายหลัง
```

### Status Flow
```
ห้องหลัก:
  บันทึกรายการ (Auto Tag) → รอโอน → เลือกโอน → โอนแล้ว

ห้องภาษี:
  รับโอน → ตรวจสอบ → Adjust (ถ้าจำเป็น) → สร้างบิลทิ้ง (ถ้ามี)
  → Preview ภ.พ.30 → Approved → ยื่นสรรพากร
```

### RBAC
| Function | Admin | Finance Mgr | Accountant | GM | Tax Room |
|---|---|---|---|---|---|
| ดูห้องหลัก | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tag Entity (ตอนตั้งหนี้) | ✅ | ✅ | ✅ | ❌ | ❌ |
| เลือกโอนไปห้องภาษี | ✅ | ✅ | ✅ | ❌ | ✅ |
| สร้างบิลทิ้ง | ✅ | ✅ | ❌ | ❌ | ✅ |
| Adjust ราคาบิลทิ้ง | ✅ | ✅ | ❌ | ❌ | ✅ |
| Approve ภ.พ.30 | ✅ | ✅ | ❌ | ✅ | ❌ |
| Export/ยื่นภาษี | ✅ | ✅ | ❌ | ❌ | ✅ |
| Config Entity Tag | ✅ | ❌ | ❌ | ❌ | ❌ |

### BC API
```
GET  /purchaseInvoices?$filter=entityTag eq '1'&period=    → บิลซื้อ Tag 1
GET  /purchaseInvoices?$filter=entityTag eq 'novat'        → บิลซื้อ novat
GET  /salesInvoices?$filter=taxInvoiceIssued eq true        → บิลขายที่ออกใบกำกับ
GET  /salesInvoices?$filter=taxInvoiceIssued eq false       → บิลขายรอบิลทิ้ง
POST /dataTransferJournals                                  → สร้างรายการโอน
POST /dataTransferJournals/{id}/post                        → Post โอนเข้าห้องภาษี
POST /catchUpInvoices                                       → สร้างบิลทิ้ง
GET  /vatEntries?companyTag=&period=                        → ภาษีซื้อ-ขาย per นิติบุคคล
GET  /vatSummary?companyTag=&period=                        → สรุป ภ.พ.30
```

### Business Rules
- **Entity Tag Required**: ทุกบิลซื้อ (PO-6) ต้องระบุ Tag ก่อน Post — ห้ามปล่อยว่าง
- **novat**: บิลที่ไม่มี VAT → ไม่โอนไปห้องภาษี (หรือโอนแยกบัญชีค่าใช้จ่าย)
- **บิลทิ้ง**: ต้องสร้างก่อนปิดงวดภาษีรายเดือน (ภายในวันที่ 15 ของเดือนถัดไป)
- **Adjust**: บิลทิ้งปรับราคาได้ แต่ต้องมี Log + เหตุผล (Audit Trail)
- **ชื่อบนบิลทิ้ง**: ใช้ชื่อลูกค้าจริง, ชื่อบริษัทอื่น, หรือ "ลูกค้าทั่วไป" → เลือกได้
- **Configurable Tags**: จำนวน Tag ไม่จำกัด — Admin เพิ่ม/แก้ไขได้ใน CF Module
- **ห้ามโอนซ้ำ**: รายการที่โอนไปห้องภาษีแล้ว → Lock ห้ามโอนอีก
- **Reconcile**: ยอดห้องหลัก = ผลรวมยอดทุกห้องภาษี + novat + รายการที่ยังไม่โอน
- **ภ.พ.30**: ยื่นภายในวันที่ 15 ของเดือนถัดไป (ภาษีขาย - ภาษีซื้อ)
- **Audit Trail**: ทุก Transfer + Adjust + บิลทิ้ง ต้องมี Log ว่าใครทำ + เมื่อไหร่ + เหตุผล

### Open Questions
- ~~[C1]~~ ✅ RESOLVED — ใช้ฐานข้อมูลเดียว (ห้องหลัก) + Tag แยกนิติบุคคล ไม่ต้อง Map COA
- ~~[C2]~~ ✅ RESOLVED — ไม่ใช้ Intercompany Threshold เพราะเป็น Single DB + Tag Filter

---

## 🗄️ BC Table Reference (Finance)

| เอกสาร | Table No. | Endpoint |
|---|---|---|
| Customer Ledger Entry | 21 | /customerLedgerEntries |
| Vendor Ledger Entry | 25 | /vendorLedgerEntries |
| Bank Account Ledger | 274 | /bankAccLedgerEntries |
| Gen. Journal Line | 81 | /generalJournalLines |
| VAT Entry | 254 | /vatEntries |
| Bank Acc. Reconciliation | 273 | /bankAccReconciliations |
| Fixed Asset | 5600 | /fixedAssets |
| FA Depreciation Book | 5612 | /faDepreciationBooks |
| FA Journal Line | 5621 | /faJournalLines |
| WHT Entry | Custom | /whtEntries (AL Extension) |
