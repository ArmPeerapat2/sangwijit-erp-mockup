# PO — Purchase Module Spec (งานจัดซื้อ)

**Version:** 1.0 | **Phase:** P1 | **Module Code:** PO
**BC Entity หลัก:** purchaseOrders (38/39), purchaseInvoices (122/123), vendors (23)
**อ่าน Flowchart ก่อน:** `/Design Ai/Flow Design/Purchase/Flow/` + `/Purchase/Document/`

---

## 📋 Menu List

| รหัส | เมนู | Phase | BC Entity | หน้าจอ |
|---|---|---|---|---|
| PO-Q | Queue Dashboard (คิวจัดซื้อ) | P1 | purchaseOrders | รายการรอดำเนินการ |
| PO-1 | ใบขอซื้อ PR (Purchase Requisition) | P1 | Custom / purchaseRequests | List + Form |
| PO-2 | ขอราคา / เปรียบเทียบราคา (RFQ) | P1 | purchaseQuotes | List + Form + Compare |
| PO-3 | ลงทะเบียน Vendor (Vendor Onboarding) | P1 | vendors (23) | Form |
| PO-4 | ใบสั่งซื้อ PO (Purchase Order) | P1 | purchaseOrders (38/39) | List + Form |
| PO-5 | รับสินค้า GRN (Goods Receipt Note) | P1 | purchaseReceipts | List + Form |
| PO-6 | ตั้งหนี้เจ้าหนี้ AP Invoice | P1 | purchaseInvoices (122/123) | List + Form |
| PO-7 | งบส่งเสริมการขาย Sale-In Accrual | P1 | Custom: vendorObligations | List + Form + Dashboard |
| PO-8 | PO บิลฝาก (Deposit Bill / Prepayment) | P1 | purchaseOrders + generalJournalLines | Form |

> **หมายเหตุ:** PO-7 Sale-In Accrual = งบที่ห้าง/Vendor สัญญาจะให้ (rebate, display fee, co-op ads)
> เจ้าภาพ = จัดซื้อ (เจรจา Agreement) แต่ Finance + Promotion เห็น Read-Only Cross-View

---

## PO-Q — Queue Dashboard (คิวจัดซื้อ)

### Layout
```
┌─────────────────────────────────────────────┐
│  PAGE HEADER: คิวจัดซื้อ | สาขา | วันที่    │
│  Filter: Status | Buyer | Vendor | วันที่    │
├─────────────────────────────────────────────┤
│  Panel A: PR รออนุมัติ                       │
│  Panel B: RFQ รอเปรียบเทียบ                  │
│  Panel C: PO รอ Vendor ยืนยัน               │
│  Panel D: GRN รอตรวจรับ (ETA วันนี้)        │
│  Panel E: AP Invoice รอวางบิล               │
└─────────────────────────────────────────────┘
```

### SC ที่ใช้
- SC7 (Timeline) — แสดง Log ต่อ Document

### RBAC
| Role | สิทธิ์ |
|---|---|
| Admin / Purchase Manager | ดูทุก Buyer |
| Buyer | ดูเฉพาะงานของตัวเอง |
| Warehouse | ดูเฉพาะ Panel D (GRN) |
| Finance | ดูเฉพาะ Panel E (AP Invoice) |

---

## PO-1 — ใบขอซื้อ PR (Purchase Requisition)

### Module Brief
```
Module:  PO-1 Purchase Requisition
Phase:   P1
BC:      Custom PR Table (หรือ purchaseRequests ถ้า BC Extension มี)
Trigger: แผนก/คลังต้องการสั่งสินค้า
Output:  PR ที่อนุมัติแล้ว → ส่งต่อให้ Buyer เปิด RFQ/PO
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: ใบขอซื้อ | Status Badge (Draft/รออนุมัติ/อนุมัติ/ปฏิเสธ)
ActionBar: [Save] [Submit] [พิมพ์]
```

**Section 2 — Doc Header**
```
เลขที่ PR    : Auto | วันที่ขอ   : Today
แผนกที่ขอ   : Auto (User's Dept) | ต้องการภายใน : Date Required
เหตุผลที่ขอ  : Dropdown (สต็อกต่ำ / ลูกค้าสั่งพิเศษ / ทดแทนชำรุด / อื่น ๆ)
```

**Section 3 — Party**
```
ผู้ขอ    : Auto (Current User + Department)
Approver : Auto-assign ตาม Department Approval Matrix
```

**Section 4 — Line Items (SC2)**
```
SC2 ItemSearch: ค้นหาสินค้าที่ต้องการ
Columns: รหัสสินค้า | ชื่อ | จำนวนขอ | UOM | สต็อกปัจจุบัน | หมายเหตุ
สต็อกปัจจุบัน: แสดง Real-time จาก BC (เตือนถ้ามีพอ)
Suggested Vendor: แสดง Vendor ที่เคยซื้อสินค้านี้ (จาก Item Card)
```

**Section 5 — Tabs**
```
Tab [อ้างอิง]: SC5 DocRefPanel (อ้างอิง Sale Order ที่สั่งพิเศษ ถ้ามี)
Tab [ประวัติ]: SC7 Timeline
```

**Section 6 — Summary**
```
จำนวนรายการ | ประมาณการมูลค่า (ถ้ามีราคาใน Item)
```

**Section 7 — Action Bar**
```
Draft      : [Save] [Submit] [Delete]
รออนุมัติ  : Maker=รอ | Approver=[Approve] [Reject with Reason]
อนุมัติ   : [แปลงเป็น PO (ตรง)] [ส่งให้ Buyer ทำ RFQ] [View Only]
ปฏิเสธ   : [View Reason] [แก้ไขและส่งใหม่]
```

### Status Flow
```
Draft → รออนุมัติ → อนุมัติแล้ว → แปลงเป็น PO/RFQ
            ↓
        ปฏิเสธ → Draft (แก้ไข/ส่งใหม่)
```

### RBAC
| Function | Admin | Purchase Mgr | Buyer | Department Head | Warehouse |
|---|---|---|---|---|---|
| สร้าง PR | ✅ | ✅ | ✅ | ✅ | ✅ |
| อนุมัติ PR | ✅ | ✅ | ❌ | ✅ (แผนกตัวเอง) | ❌ |
| แปลงเป็น PO | ✅ | ✅ | ✅ | ❌ | ❌ |

### BC API
```
POST /purchaseRequests (Custom)         → สร้าง PR
GET  /items/{id}/stockByLocation        → ดูสต็อก
GET  /itemVendors?itemNo=               → Suggested Vendor
```

---

## PO-2 — ขอราคา / เปรียบเทียบราคา (RFQ)

### Module Brief
```
Module:  PO-2 RFQ & Price Compare
Phase:   P1
BC:      purchaseQuotes
Trigger: หลัง PR อนุมัติ หรือ Buyer ต้องการเปรียบเทียบก่อนสั่ง
Output:  ราคาที่ดีที่สุด → สร้าง PO
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: ขอราคา / เปรียบเทียบราคา | Status Badge
ActionBar: [Save] [ส่ง RFQ ให้ Vendor] [Compare View] [แปลงเป็น PO]
```

**Section 2 — Doc Header**
```
เลขที่ RFQ  : Auto | วันที่ขอ  : Today
อ้างอิง PR  : SC5 ← เลขที่ PR (ถ้ามี)
กำหนดตอบกลับ: Date (Vendor ต้องตอบภายใน)
```

**Section 3 — Party**
```
Vendor List: เลือกหลาย Vendor (เปรียบเทียบพร้อมกัน)
Vendor Search: SC-style — ค้นหาตามชื่อ/รหัส/หมวดสินค้า
```

**Section 4 — Line Items (SC2)**
```
รายการสินค้าจาก PR (Auto-fill)
Columns: สินค้า | จำนวน | UOM | ราคา Vendor A | ราคา Vendor B | ราคา Vendor C
Inline Edit: ใส่ราคาที่ Vendor ตอบกลับ
```

**หน้า Compare View (พิเศษ)**
```
┌────────────────────────────────────────────────────────┐
│ สินค้า       │ Vendor A   │ Vendor B   │ Vendor C      │
│ Item 001     │ 1,200/ชิ้น │ 1,150/ชิ้น │ 1,300/ชิ้น   │
│ Item 002     │ 500/ชิ้น  │ -          │ 480/ชิ้น      │
│ รวม          │ 1,700      │ -          │ 1,780         │
│              │ ← เลือก   │            │               │
└────────────────────────────────────────────────────────┘
ปุ่ม: [เลือก Vendor A] [เลือกแต่ละ Line จาก Vendor ต่างกัน]
```

**Section 5 — Tabs**
```
Tab [อ้างอิง]: SC5 → PR ต้นทาง
Tab [ประวัติ]: SC7 Timeline (ส่ง RFQ → รับราคา → เปรียบเทียบ → เลือก)
```

### Status Flow
```
Draft → ส่ง RFQ → รอราคา → ได้ราคาครบ → เปรียบเทียบ → เลือก Vendor → แปลงเป็น PO
```

### BC API
```
POST /purchaseQuotes                         → สร้าง RFQ per Vendor
GET  /purchaseQuotes?vendorId=&itemNo=       → ดูราคาเก่า
POST /purchaseQuotes/{id}/Microsoft.NAV.makeOrder → แปลงเป็น PO
```

---

## PO-3 — ลงทะเบียน Vendor (Vendor Onboarding)

### Module Brief
```
Module:  PO-3 Vendor Onboarding
Phase:   P1
BC:      vendors (Table 23)
Trigger: มี Vendor ใหม่ต้องการทำธุรกรรม
Output:  Vendor Card ใน BC พร้อมใช้งาน
```

### ERP Form

**ข้อมูลพื้นฐาน**
```
รหัส Vendor    : Auto | ชื่อบริษัท TH/EN : Required
ประเภท         : บุคคล / นิติบุคคล | เลขผู้เสียภาษี: Required
ที่อยู่         : ที่อยู่ใบกำกับ / ที่อยู่จัดส่ง
เบอร์โทร / Email: Required
```

**เงื่อนไขการค้า**
```
เงื่อนไขชำระ  : NET 30 / NET 60 / Cash (Dropdown)
สกุลเงิน       : THB (Default)
วิธีชำระ       : โอนธนาคาร / เช็ค
บัญชีธนาคาร   : ชื่อธนาคาร, เลขบัญชี, สาขา
WHT Category   : ภ.ง.ด.3 / ภ.ง.ด.53 / ไม่หัก (สำหรับ AP Payment)
```

**เอกสาร KYC**
```
หนังสือรับรองบริษัท, ภ.พ.20, บัตรตัวแทน (Upload File)
```

### Status Flow
```
Draft → รออนุมัติ (Finance) → Active → ใช้ได้ทุก Module
                ↓
            ปฏิเสธ → แก้ไข
```

### BC API
```
POST  /vendors               → สร้าง Vendor ใหม่
PATCH /vendors/{id}          → แก้ไข
GET   /vendors?$filter=...   → ค้นหา
```

---

## PO-4 — ใบสั่งซื้อ PO (Purchase Order)

### Module Brief
```
Module:  PO-4 Purchase Order
Phase:   P1
BC:      purchaseOrders (Header 38, Line 39)
Trigger: หลัง PR อนุมัติ + เลือก Vendor แล้ว (จาก RFQ หรือตรง)
Output:  PO ส่งให้ Vendor + จองงบประมาณใน BC
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: ใบสั่งซื้อ | Status Badge (Draft/รออนุมัติ/Open/Partially Received/Closed)
ActionBar: [Save] [Submit] [ส่ง PO ให้ Vendor (Email/Print)] [ยกเลิก]
```

**Section 2 — Doc Header**
```
เลขที่ PO       : Auto | วันที่สั่ง    : Today
กำหนดส่ง        : Required (Expected Delivery Date)
อ้างอิง PR/RFQ  : SC5 (ถ้ามาจาก PR หรือ RFQ)
เงื่อนไขชำระ   : Auto-fill จาก Vendor Card
```

**Section 3 — Party**
```
Vendor Search: ค้นหา Vendor ที่ Active แล้ว
Auto-fill: เงื่อนไขชำระ, ที่อยู่, WHT Category, สกุลเงิน
```

**Section 4 — Line Items (SC2)**
```
SC2 ItemSearch + ราคา Vendor
Columns: รหัสสินค้า | ชื่อ | จำนวน | UOM | ราคา/หน่วย | ส่วนลด% | VAT | รวม
ราคาแนะนำ: Auto-fill จาก Vendor Price List (ถ้ามี)
```

**Section 5 — Tabs**
```
Tab [รับสินค้า]:  แสดงประวัติการรับ (Partially Received %)
Tab [ตั้งหนี้]:   AP Invoice ที่เชื่อมแล้ว
Tab [อ้างอิง]:   SC5 → PR → RFQ → PO Chain
Tab [ประวัติ]:   SC7 Timeline
```

**Section 6 — Summary**
```
ยอดก่อน VAT | VAT 7% | ยอดรวม | รับแล้ว % | ยอดค้าง
```

**Section 7 — Action Bar**
```
Draft      : [Save] [Submit] [Delete]
รออนุมัติ  : Maker=รอ | Approver=[Approve] [Reject]
Open       : [ส่ง PO Email] [พิมพ์] [บันทึกรับสินค้า (GRN)] [ยกเลิก]
Partial    : [รับสินค้าเพิ่ม] [Close PO (รับบางส่วน)]
Closed     : [View Only] [ดู Invoice]
```

### Status Flow
```
Draft → รออนุมัติ → Open → Partially Received → Fully Received → รอวางบิล → ปิดรายการ
           ↓                                                            ↓
       ปฏิเสธ                                                     ยกเลิก
```

### RBAC
| Function | Admin | Purchase Mgr | Buyer | Finance | Warehouse |
|---|---|---|---|---|---|
| สร้าง PO | ✅ | ✅ | ✅ | ❌ | ❌ |
| อนุมัติ PO | ✅ | ✅ | ❌ | ❌ | ❌ |
| ปิด PO (บางส่วน) | ✅ | ✅ | ✅ | ❌ | ❌ |
| ดู Cost | ✅ | ✅ | ✅ | ✅ | ❌ |

### BC API
```
POST  /purchaseOrders                               → สร้าง PO
PATCH /purchaseOrders/{id}                          → แก้ไข
GET   /purchaseOrders/{id}?$expand=purchaseOrderLines
POST  /purchaseOrders/{id}/Microsoft.NAV.receive    → รับสินค้า
POST  /purchaseOrders/{id}/Microsoft.NAV.invoice    → ตั้งหนี้
```

---

## PO-5 — รับสินค้า GRN (Goods Receipt Note)

### Module Brief
```
Module:  PO-5 GRN (Purchase)
Phase:   P1
BC:      purchaseReceipts (Table 120/121) — ผลจาก Post PO Receive
Trigger: สินค้าถึงคลัง — Warehouse ยืนยันรับ
Output:  สินค้าเข้าสต็อก BC + เพิ่ม Item Ledger Entry
```

### หมายเหตุ
> GRN ใน Purchase Module = ยืนยันว่ารับสินค้าจาก Vendor
> GRN ใน Warehouse Module (WH-2) = ลงทะเบียน Serial + จัดวาง Bin

**ทั้ง 2 ต้องทำ: Purchase GRN (ตั้งหนี้) + WH GRN (ลง Serial)**

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: บันทึกรับสินค้า | Status Badge
ActionBar: [Save] [Post GRN] [พิมพ์ GRN]
```

**Section 2 — Doc Header**
```
เลขที่ GRN     : Auto | วันที่รับ    : Today
อ้างอิง PO     : SC5 [Required] ← PO เลขที่เท่าไหร่
ผู้ส่งสินค้า   : ชื่อคนส่ง / ทะเบียนรถ
```

**Section 3 — Party**
```
Vendor: Auto-fill จาก PO
```

**Section 4 — Line Items (SC2 + SC8)**
```
Copy มาจาก PO Line (Auto-fill)
จำนวนรับจริง: แก้ไขได้ (ถ้ารับไม่ครบ)
SC8 Serial Panel: กรอก Serial ของสินค้าที่รับ (ถ้า Item มี Serial Flag)
Barcode Scan: ✅ สำหรับ Serial No.
Import Serial CSV: ✅ (UX3)
ตรวจสอบ: จำนวนรับ vs จำนวนสั่ง → Warning ถ้าเกิน
```

**Section 5 — Tabs**
```
Tab [คุณภาพ]:  Pass/Fail per Line (QC Check — optional)
Tab [อ้างอิง]: SC5 → PO → GRN Chain
Tab [ประวัติ]: SC7 Timeline
```

**Section 7 — Action Bar**
```
Draft  : [Save] [Post GRN] [Delete]
Posted : [พิมพ์ GRN] [ตั้งหนี้ AP Invoice] [View Stock Entry]
```

### Status Flow
```
Draft → Posted (สินค้าเข้า BC Stock) → Vendor ส่งใบแจ้งหนี้ → ตั้งหนี้ AP
```

### BC API
```
POST /purchaseOrders/{id}/Microsoft.NAV.receive  → Post GRN
GET  /purchaseReceipts?purchaseOrderId=           → ดู GRN History
GET  /itemLedgerEntries?entryType='Purchase'      → ดู Stock Entry
PATCH /itemSerialNumbers                          → บันทึก Serial
```

### Business Rules
- รับสินค้าเกิน PO → Warning + ต้องอนุมัติก่อน Post
- ถ้ารับน้อยกว่า PO → PO Status = Partially Received
- Serial ต้องครบทุกชิ้นก่อน Post GRN (ถ้า Item มี Serial Flag)
- GRN Posted → Auto-trigger WH-2 (Warehouse ลง Bin Location)

---

## PO-6 — ตั้งหนี้เจ้าหนี้ AP Invoice

### Module Brief
```
Module:  PO-6 AP Invoice
Phase:   P1
BC:      purchaseInvoices (Header 122, Line 123)
Trigger: Vendor ส่งใบแจ้งหนี้ หลังจาก GRN Posted
Output:  ตั้งหนี้ใน BC + เพิ่ม Vendor Ledger Entry
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: ตั้งหนี้เจ้าหนี้ | Status Badge
ActionBar: [Save] [Post AP Invoice] [พิมพ์]
```

**Section 2 — Doc Header**
```
เลขที่ AP Invoice  : Auto | วันที่ตั้งหนี้  : Today
เลขที่ใบแจ้งหนี้ Vendor: [Input] (เลขที่ Vendor ออก — Required)
อ้างอิง GRN/PO    : SC5 [Required]
กำหนดชำระ         : Auto-fill (วันที่รับ + Credit Term จาก Vendor)
```

**Section 3 — Party**
```
Vendor: Auto-fill จาก GRN
WHT Category: Auto-fill จาก Vendor Card (ภ.ง.ด.3 / 53 / ไม่หัก)
```

**Section 4 — Line Items**
```
Copy มาจาก GRN (Auto-fill)
ตรวจสอบ: ราคาใน AP Invoice vs ราคาใน PO → Highlight ถ้าต่างกัน
ส่วนลดพิเศษ: แก้ไขได้ถ้า Vendor ให้ส่วนลดเพิ่ม
```

**Section 5 — Tabs**
```
Tab [การชำระ]:  แผน Payment Schedule (ถ้าแบ่งงวด)
Tab [อ้างอิง]:  SC5 → PO → GRN → AP Chain
Tab [ภาษี]:    WHT Amount, VAT Amount per Line
Tab [ประวัติ]:  SC7 Timeline
```

**Section 6 — Summary**
```
ยอดสินค้า | VAT Input | WHT หัก ณ ที่จ่าย | ยอดสุทธิที่ต้องจ่าย
```

**Section 7 — Action Bar**
```
Draft  : [Save] [Post AP Invoice] [Delete]
Posted : [จ่ายเงิน (→ AP Payment)] [พิมพ์] [View Vendor Ledger]
```

### Status Flow
```
Draft → Post → ค้างชำระ → จ่ายแล้ว (AP Payment) → ปิดรายการ
```

### RBAC
| Function | Admin | Purchase Mgr | Buyer | Finance | Accountant |
|---|---|---|---|---|---|
| สร้าง AP Invoice | ✅ | ✅ | ❌ | ✅ | ✅ |
| Post AP Invoice | ✅ | ❌ | ❌ | ✅ | ✅ |
| ดูยอดค้าง Vendor | ✅ | ✅ | ✅ | ✅ | ✅ |
| จ่ายเงิน (AP Payment) | ✅ | ❌ | ❌ | ✅ | ❌ |

### BC API
```
POST /purchaseInvoices                              → สร้าง AP Invoice
POST /purchaseInvoices/{id}/Microsoft.NAV.post      → Post
GET  /vendorLedgerEntries?vendorId=                 → ดูประวัติ Vendor
POST /vendorPaymentJournals                         → จ่ายเงิน (Phase 2)
```

### Business Rules
- **3-Way Match**: ตรวจ PO vs GRN vs AP Invoice ก่อน Post
- ราคาต่างจาก PO เกิน 5% → Alert + ต้องอนุมัติพิเศษ
- WHT หัก ณ ที่จ่าย: คำนวณ Auto ตาม Category ใน Vendor Card
- AP Invoice 1 ใบ → อ้างอิงหลาย GRN ได้ (กรณี Vendor รวมใบ)

---

## PO-7 — งบส่งเสริมการขาย Sale-In Accrual

### Module Brief
```
Module:  PO-7 Sale-In Accrual (Vendor Obligation)
Phase:   P1
BC:      Custom Table: vendorObligations
Trigger: จัดซื้อเจรจา Trade Agreement กับห้าง/Vendor ได้
Output:  บันทึกหนี้ที่ห้างสัญญาจะจ่าย → ติดตามจนรับเงินจริง
```

### Concept: สถานะ Accrual
```
Agreement Signed → ตั้งหนี้ (Accrued) → ได้ CN/Invoice จากห้าง → รับเงิน (Realized)
     จัดซื้อสร้าง      บัญชีเห็น           บัญชี book จริง        การเงินรับ
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: งบส่งเสริมการขาย | Status Badge (Draft/Accrued/Doc Received/Realized/Cancelled)
ActionBar: [Save] [Submit] [Attach Document]
```

**Section 2 — Doc Header**
```
เลขที่ Accrual  : Auto (ACC-YYYY-MM-XXX)
ประเภทงบ       : Dropdown (Volume Rebate / Display Fee / Co-op Advertising / Cash Discount / อื่น ๆ)
อ้างอิง Agreement: เลขที่ Trade Agreement กับห้าง
Vendor/ห้าง     : SC ค้นหา Vendor (จาก MD-3)
งวด Claim       : From Date - To Date
จำนวนเงินตาม Agreement: THB
```

**Section 3 — Party**
```
ห้าง/Vendor: Auto-fill จาก Agreement
ผู้รับผิดชอบ (Buyer): Auto (Current User / assigned)
```

**Section 4 — Line Items**
```
รายละเอียดงบ:
คำอธิบาย | ประเภท (Rebate/Fee/Ads) | จำนวนตาม Agreement | จำนวนได้รับจริง | ผลต่าง
เอกสารอ้างอิง: เลข CN/Invoice จากห้าง (กรอกตอนได้เอกสาร)
แนบเอกสาร: Upload ไฟล์ Agreement / CN / Statement จากห้าง
```

**Section 5 — Tabs**
```
Tab [Agreement]: รายละเอียด Trade Agreement ต้นทาง
Tab [เอกสารจากห้าง]: Attached CN/Invoice/Statement
Tab [GL Impact]: บัญชีที่ book (Read-Only — เห็นเฉพาะ Finance)
Tab [ประวัติ]: SC7 Timeline (ใครทำอะไรเมื่อไหร่)
```

**Section 6 — Summary**
```
ยอดตาม Agreement | ยอดได้เอกสารแล้ว | ยอดรับเงินแล้ว | ยอดค้าง
```

**Section 7 — Action Bar**
```
Draft     : [Save] [Submit for Accrual]
Accrued   : [Attach CN/Invoice] [Update Amount]
Doc Received: [Confirm Amount] [Send to Finance for Payment]
Realized  : [View Only] [Export]
Cancelled : [View Reason]
```

### Status Flow
```
Draft → Accrued (บัญชีรับรู้หนี้) → Doc Received (ได้เอกสารจากห้าง) → Realized (รับเงินแล้ว)
  ↓          ↓                           ↓
Cancel    Cancel                      Adjust (ยอดไม่ตรง → แก้ไข + อนุมัติ)
```

### Cross-View (ผู้ใช้ข้ามแผนก)

**Finance Cross-View** → แสดงใน FI-Q Dashboard + FI-8 Accrual Monitor
```
┌─────────────────────────────────────────────────────────┐
│  Accrual Monitor (Read-Only)                            │
│  ห้าง/Vendor | ยอด Accrued | ได้เอกสาร | รับเงิน | ค้าง │
│  HomePro    | 500,000    | 300,000  | 200,000 | 300K  │
│  Power Buy  | 200,000    | 200,000  | 200,000 | 0     │
│  Thai Watsadu| 150,000   | 0        | 0       | 150K  │
│  ─────────────────────────────────────────────────────  │
│  สถานะ: 🟢 ได้เอกสารครบ  🟡 รอเอกสาร  🔴 เกิน 90 วัน  │
└─────────────────────────────────────────────────────────┘
```

**Promotion Cross-View** → แสดงใน PM-Q Dashboard
```
สรุปงบที่ใช้ได้:
- งบ Realized (รับเงินแล้ว): ใช้คำนวณ True Margin ได้เลย
- งบ Accrued (ยังไม่ได้เอกสาร): ใช้ประมาณการ แต่ยังนำมาหักต้นทุนจริงไม่ได้
```

### RBAC
| Function | Admin | Purchase Mgr | Buyer | Finance Mgr | Accountant | Promo Mgr |
|---|---|---|---|---|---|---|
| สร้าง Accrual | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| แก้ไข/อัปเดต | ✅ | ✅ | ✅ (ของตัวเอง) | ❌ | ❌ | ❌ |
| Attach เอกสาร | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Confirm & Send to Finance | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Record Payment (Realized) | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| ดู Cross-View (Read-Only) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ดู GL Impact | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |

### BC API
```
POST /vendorObligations (Custom)                    → สร้าง Accrual
PATCH /vendorObligations/{id}                       → อัปเดต
GET  /vendorObligations?$filter=status eq 'Accrued' → ดูรายการค้าง
GET  /vendorObligations?vendorId=                   → ดูตาม Vendor
POST /vendorObligations/{id}/attachDocument         → แนบ CN/Invoice
POST /vendorObligations/{id}/realize                → บันทึกรับเงิน
GET  /generalLedgerEntries?$filter=sourceType eq 'VendorObligation' → GL
```

### Business Rules
1. **ห้ามซ้ำ**: เลข Agreement + งวด + ประเภทงบ ต้องไม่ซ้ำ
2. **ยอดไม่ตรง**: ถ้ายอดรับจริง < ยอด Agreement เกิน 10% → Flag สอบสวน
3. **Aging Alert**: Accrued เกิน 90 วันยังไม่ได้เอกสาร → 🔴 Alert ถึง Purchase Mgr + Finance
4. **GL Posting**: Accrued → Dr. Accrued Revenue / Cr. Vendor Obligation Liability
5. **Realized**: Reverse Accrual + Dr. Bank / Cr. Revenue (หรือ offset CN)
6. **เก็บข้อมูล**: 5 ปี (ตาม PDPA + ภาษี)
7. **Monthly Recon**: Finance ต้อง reconcile Accrual vs รับจริง ทุกเดือน
8. **⚠️ Rebate ≠ Discount Rule (บังคับ):**
   - Rebate / Volume Bonus ที่ได้จาก Supplier **ห้ามนำไปดั๊มพ์เป็นส่วนลดราคาขาย**
   - ต้อง book เข้า GL Account แยก → "Other Income — Vendor Rebate" (ตาม CF-4 Posting Group)
   - เหตุผล: Rebate = กำไรสุทธิของบริษัท ไม่ใช่เงินอุดหนุนลูกค้า
   - ถ้าต้องการนำ Rebate มาสนับสนุนราคาขาย → ต้องผ่านอนุมัติ GM + บันทึก JV แยก

### ออกแบบรองรับ (Phase ถัดไป — ยังไม่ implement)

**Sell-out Trigger:**
```
เมื่อ Sales Invoice (SL-4) Post → ตรวจว่า Item อยู่ใน Agreement ไหน
ถ้าใช่ → Auto-accumulate ยอด Sell-out ใน PO-7 Agreement Target
ใช้สำหรับ: Agreement ที่มีเงื่อนไข "จ่ายตอนขายออก" (Sell-through Benefit)
```

**Rebate/MOU Target Tracking:**
```
Agreement Target: ยอดเป้า ฿5,000,000
Actual Cumulative: ฿3,200,000 (64%)
Alert at: 80% → แจ้งจัดซื้อเตรียม Claim
Alert at: 100% → แจ้งจัดซื้อ Claim ทันที
```

**CN Offset (ใช้ CN หักยอด AP):**
```
เมื่อ PO-7 สถานะ = Doc Received (ได้ CN จากห้าง)
→ Link CN ไปที่ FI-2 AP Payment
→ เลือก "หักจาก CN" แทนจ่ายเงินสด/โอน
→ ยอดจ่ายจริง = AP Invoice - CN Amount
```

---

## PO-8 — PO บิลฝาก (Deposit Bill / Prepayment before Full Delivery)

### Module Brief
```
Module:  PO-8 PO Deposit Bill (บิลฝาก)
Phase:   P1
BC:      purchaseOrders (38/39), purchaseInvoices (122/123), generalJournalLines (81)
Trigger: Credit Term ครบกำหนด แต่สินค้ายังรับไม่ครบ → ต้องจ่ายเงินก่อน
Output:  จ่ายเงินล่วงหน้า (Prepayment) + ทยอยรับของ + Settle เมื่อครบ
Flowchart: Purchase/Flow/06 - Deposit bill (PO บิลฝาก)
```

### Business Case
```
ตัวอย่าง:
  PO สั่งซื้อ 100 เครื่อง ราคา ฿1,000,000 | Credit Term 30 วัน
  วันที่ 15: รับสินค้า 60 เครื่อง (Partial GRN)
  วันที่ 30: ครบ Credit Term → ต้องจ่ายเงินแล้ว แม้ของยังมาไม่ครบ
  วันที่ 45: รับสินค้าอีก 40 เครื่อง (ครบ)
  → ต้องมีกลไก "จ่ายก่อน → ทยอยรับ → Settle"
```

### 2 สถานการณ์ (จาก Flowchart)

**สถานการณ์ A: ดิวถึง + ยังไม่รับของเลย**
```
PO (Approved) → ดิวชำระ → คีย์รายการ G/L
  Dr: Advance Payment (เงินจ่ายล่วงหน้า)
  Cr: Bank / Cash
  + G/L ขาหักออกจากสินค้า (Accrued Liability)
→ Post → รอรับสินค้าตามรอบส่ง
→ เมื่อรับของ: Post Receive → ตัดยอด Advance กับ Invoice
```

**สถานการณ์ B: ดิวถึง + รับของบางส่วนแล้ว**
```
PO (Approved) → รับของบางส่วน (Flow 04/05) → Posted Purchase Receipt + Invoice (บางส่วน)
→ ดิวชำระ → Post Invoice สำหรับส่วนที่เหลือ
  ถ้า Post Invoice ผ่าน → จบ (Posted Purchase Invoice + Receipt)
  ถ้า Post Invoice ไม่ผ่าน (ของยังไม่มา) → คีย์ G/L ตั้งเจ้าหนี้ + จ่ายเงิน
→ เมื่อรับของครบ: Post G/L + Item ที่รับตามรอบส่ง → Settle
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: PO บิลฝาก | Status Badge (Draft/Prepaid/Partial Received/Settled)
ActionBar: [บันทึกจ่ายล่วงหน้า] [พิมพ์] [ดู PO ต้นทาง]
```

**Section 2 — Doc Header**
```
เลขที่บิลฝาก   : Auto
วันที่จ่าย     : Today (ดิวชำระ)
อ้างอิง PO     : SC5 [Required] ← PO ต้นทาง
สถานการณ์      : [A: ยังไม่รับของ] / [B: รับบางส่วนแล้ว]
```

**Section 3 — Party**
```
Vendor: Auto-fill จาก PO
แสดง: Credit Term | Due Date | วันที่สั่งซื้อ | จำนวนวันเกินกำหนด
```

**Section 4 — Line Items**
```
Copy จาก PO Lines:
รหัสสินค้า | ชื่อ | สั่งซื้อ | รับแล้ว | ค้างรับ | ราคา | ยอดจ่าย

สถานการณ์ A: ยอดจ่าย = ยอดเต็ม PO
สถานการณ์ B: ยอดจ่าย = ยอดค้างที่ยังไม่ได้ตั้ง Invoice
```

**Section 5 — Tabs**
```
Tab [การชำระ]: วิธีจ่าย (โอน/เช็ค), บัญชีธนาคาร, Ref No.
Tab [ประวัติรับของ]: GRN ที่ Post แล้ว + จำนวน per line
Tab [G/L Entries]: รายการ GL ที่ book ไว้ (Dr/Cr)
Tab [อ้างอิง]: SC5 → PO → GRN → Invoice Chain
Tab [ประวัติ]: SC7 Timeline
```

**Section 6 — Summary**
```
ยอด PO ทั้งหมด | จ่ายแล้ว (Invoice Posted) | ยอดจ่ายครั้งนี้ (Prepay) | ค้างรับของ
```

**Section 7 — Action Bar**
```
Draft     : [Save] [Post Prepayment] [Delete]
Prepaid   : [บันทึกรับสินค้า] [ดู GL] [Print]
Partial   : [รับของเพิ่ม] [Settle]
Settled   : [View Only] [ดู GL Chain]
```

### Status Flow
```
PO Approved → Due Date ถึง
  ├─ Scenario A: Post Prepayment (จ่ายเต็ม) → Prepaid → ทยอยรับของ → Settled
  └─ Scenario B: Post Invoice (บางส่วน) → ค้าง → Post Prepay ส่วนที่เหลือ → ทยอยรับ → Settled
```

### RBAC
| Function | Admin | Purchase Mgr | Buyer | Finance |
|---|---|---|---|---|
| สร้างบิลฝาก | ✅ | ✅ | ✅ | ❌ |
| Post Prepayment | ✅ | ✅ | ❌ | ✅ |
| Settle (ตัดยอด) | ✅ | ✅ | ❌ | ✅ |
| ดู GL Entries | ✅ | ✅ | ❌ | ✅ |

### BC API
```
GET  /purchaseOrders/{id}?$expand=purchaseOrderLines   → ดู PO + Lines
GET  /purchaseReceipts?purchaseOrderId=                → ดู GRN History
POST /generalJournalLines                               → คีย์ G/L (Prepayment)
POST /journals/{id}/Microsoft.NAV.post                  → Post G/L
POST /purchaseOrders/{id}/Microsoft.NAV.receive         → รับสินค้าเพิ่ม
POST /purchaseOrders/{id}/Microsoft.NAV.invoice          → ตั้งหนี้ (Settle)
```

### Business Rules
- **Trigger**: Due Date ถึง + PO Status ยังไม่ Fully Received → แสดง Alert ใน PO-Q Dashboard
- **GL Posting**: Prepayment ต้อง book Dr: Advance to Vendor (Asset) / Cr: Bank
- **Settle**: เมื่อรับของครบ → Auto-reverse Advance + Post Purchase Invoice ปกติ
- **3-Way Match**: ยังต้องตรวจ PO vs GRN vs Invoice แม้จ่ายล่วงหน้า
- **Aging Alert**: บิลฝากที่ค้างรับ > 60 วัน → Alert ส่งถึง Purchase Mgr + Finance Mgr
- **Link กับ FI-2**: ยอด Prepaid จะแสดงใน AP Payment เป็น "จ่ายแล้ว (Advance)" ไม่ต้องจ่ายซ้ำ

---

## 📌 Purchase Module — Business Rules รวม

1. **PR → RFQ → PO → GRN → AP**: ทุกขั้นต้อง Link กัน (SC5)
2. **3-Way Match**: PO vs GRN vs Invoice ต้องตรงก่อน Post AP
3. **Vendor WHT**: Auto-apply ตาม Category ทุก AP Invoice
4. **Serial at GRN**: ต้องลง Serial ครบก่อน Post GRN
5. **GRN Over-receive**: ต้องอนุมัติถ้ารับเกิน PO
6. **Sale-In Accrual (PO-7)**: เจ้าภาพอยู่ Purchase — Finance/Promotion เห็น Cross-View
7. **Vendor Onboarding**: ต้องผ่าน Finance Approve ก่อนใช้งานได้
8. **PO Deposit Bill (PO-8)**: ดิวถึง + ของยังไม่ครบ → จ่ายก่อน → Settle ทีหลัง

---

## 🗄️ BC Table Reference (Purchase)

| เอกสาร | Table No. | Endpoint |
|---|---|---|
| Vendor | 23 | /vendors |
| Purchase Header (PO) | 38 | /purchaseOrders |
| Purchase Line | 39 | /purchaseOrderLines |
| Purchase Receipt Header | 120 | /purchaseReceipts |
| Purchase Receipt Line | 121 | /purchaseReceiptLines |
| Purchase Invoice Header | 122 | /purchaseInvoices |
| Purchase Invoice Line | 123 | /purchaseInvoiceLines |
| Vendor Ledger Entry | 25 | /vendorLedgerEntries |
| Item Vendor | 99 | /itemVendors |
