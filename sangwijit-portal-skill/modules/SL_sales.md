# SL — Sales Module Spec (งานขาย)

**Version:** 1.0 | **Phase:** P1 (ทุกเมนูหลัก) | **Module Code:** SL
**BC Entity หลัก:** salesOrders (Table 36/37), salesQuotes (6660/6661), customers (18)
**อ่าน Flowchart ก่อน:** `/Design Ai/Flow Design/Sales/Flow/` + `/Sales/Document/`

---

## 📋 Menu List

| รหัส | เมนู | Phase | BC Entity | หน้าจอ |
|---|---|---|---|---|
| SL-Q | Queue Dashboard (คิวขาย) | P1 | salesOrders + salesQuotes | รายการรอดำเนินการ |
| SL-1 | ใบเสนอราคา (Quotation) | P1 | salesQuotes (6660/6661) | List + Form |
| SL-2 | ใบสั่งจอง (Reservation) | P1 | salesOrders (36/37) | List + Form |
| SL-3 | ใบมัดจำ (Deposit) | P1 | Custom Prepayment | List + Form |
| SL-4 | บิลขาย / ขายสด (Invoice) | P1 | salesInvoices (112/113) | List + Form |
| SL-CN | ใบลดหนี้ขาย (Credit Memo) — เดิมรหัส SL-5 | P1 | creditMemos (114) | List + Form |
| SL-F1 | ขออนุมัติวงเงิน (Credit Approval) | P1 | customers (18) | Workflow Panel |

---

## SL-Q — Queue Dashboard (คิวขาย)

### วัตถุประสงค์
แสดงสถานะงานขายทั้งหมดที่ยังค้างอยู่ แยกตาม Status และ Assignee

### หน้าจอ Layout
```
┌─────────────────────────────────────────┐
│  PAGE HEADER: Queue ขาย | วันที่ | สาขา │
│  Filter: Status | พนักงาน | ช่วงวันที่   │
├─────────────────────────────────────────┤
│  Panel A: รอยืนยัน (Quotation → SO)     │
│  Panel B: รอจัดส่ง (Confirmed SO)        │
│  Panel C: รอรับเงิน (Pending Payment)    │
│  Panel D: รออนุมัติวงเงิน               │
└─────────────────────────────────────────┘
```

### SC ที่ใช้
- SC7 (Timeline) — แสดง Log ความเคลื่อนไหวแต่ละ Card

### RBAC
| Role | สิทธิ์ |
|---|---|
| Admin / Sales Manager | ดูทุก Assignee |
| Sales Staff | ดูเฉพาะงานของตัวเอง |
| Viewer | ดูอย่างเดียว |

### BC API
```
GET /salesOrders?$filter=status ne 'Posted'&$expand=salesOrderLines
GET /salesQuotes?$filter=status ne 'Closed'
GET /customers?$select=creditLimit,creditAmount
```

---

## SL-1 — ใบเสนอราคา (Quotation)

### Module Brief
```
Module:  SL-1 Quotation
Phase:   P1
BC:      salesQuotes (Header 6660, Line 6661)
Trigger: พนักงานขายสร้างเมื่อลูกค้าสอบถามราคา
Output:  ใบเสนอราคา PDF + บันทึกใน BC
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: ใบเสนอราคา | Status Badge (Draft/Pending/Confirmed/Expired)
Breadcrumb: งานขาย > ใบเสนอราคา > [เลขที่]
ActionBar: [Save Draft] [ส่งขออนุมัติ] [พิมพ์] [แปลงเป็นใบจอง]
```

**Section 2 — Doc Header**
```
เลขที่เสนอราคา  : Auto (Number Series)          | วันที่เสนอ   : Today
วันหมดอายุ      : Today + 30 วัน (Configurable)  | Branch       : User's Branch
อ้างอิง         : รหัส Inquiry / โทรศัพท์         | พนักงานขาย  : Current User
```

**Section 3 — Party (SC1)**
```
ลูกค้า  : SC1 CustomerSearch (retype ≥ 2 ตัว หรือ walk-in)
Auto-fill: กลุ่มราคา, วงเงิน, ที่อยู่ออกใบกำกับ
⚠️ ถ้า Customer Blocked → Warning ขึ้น, ต้องขออนุมัติก่อน (SL-F1)
```

**Section 4 — Line Items (SC2 + SC9)**
```
Columns: รหัสสินค้า | ชื่อสินค้า | จำนวน | UOM | ราคา/หน่วย | ส่วนลด% | รวม
SC2: ItemSearch พร้อม Barcode Scan
SC9: PromoPrice ดึงราคาตามกลุ่มลูกค้า + โปร ณ วันที่
Inline Edit: แก้ไขได้ตรง Row — ห้าม Popup
Bundle: รองรับ Bundle Item (UX8)
Show More: ซ่อน Field ไม่บ่อย (UX5): Cost, GP%, รหัสสาขา
```

**Section 5 — Tabs**
```
Tab [เงื่อนไข]: เงื่อนไขการชำระ, วิธีการจัดส่ง, หมายเหตุ
Tab [เอกสารอ้างอิง]: SC5 DocRefPanel (Inquiry, อีเมล, โทรศัพท์)
Tab [ประวัติ]: SC7 Timeline (Created → Sent → Accepted/Rejected)
```

**Section 6 — Summary**
```
ยอดก่อน VAT  | ส่วนลดท้ายบิล (%) | VAT 7% (ตาม UX7) | ยอดสุทธิ
VAT Options (UX7): [รวม VAT] [ไม่รวม VAT] [ไม่แสดง VAT]
```

**Section 7 — Action Bar (Sticky Bottom)**
```
Draft       : [Save] [Submit] [Delete]
Pending     : Maker=รอ | Approver=[Approve] [Reject]
Confirmed   : [แปลงเป็นใบจอง] [พิมพ์] [Duplicate] [ยกเลิก]
Expired     : [Duplicate] [View Only]
```

### Status Flow
```
Draft → รออนุมัติ (ถ้าวงเงินเกิน) → Confirmed → แปลงเป็น SO/Invoice
  ↓                                       ↓
หมดอายุ (Auto 30 วัน)               ยกเลิก
```

### SC ที่ใช้
SC1, SC2, SC5, SC7, SC9

### RBAC
| Function | Admin | Sales Mgr | Sales Staff | Warehouse | Finance |
|---|---|---|---|---|---|
| สร้าง Quote | ✅ | ✅ | ✅ | ❌ | ❌ |
| อนุมัติ Quote | ✅ | ✅ | ❌ | ❌ | ❌ |
| แก้ไขราคา | ✅ | ✅ | 🔍 Field Permission | ❌ | ❌ |
| พิมพ์ | ✅ | ✅ | ✅ | ❌ | ❌ |

### BC API
```
POST   /salesQuotes                        → สร้าง Quote ใหม่
PATCH  /salesQuotes/{id}                   → แก้ไข
GET    /salesQuotes/{id}?$expand=salesQuoteLines → ดูรายการ
POST   /salesQuotes/{id}/Microsoft.NAV.makeOrder → แปลงเป็น SO
DELETE /salesQuotes/{id}                   → ลบ (Draft เท่านั้น)
GET    /priceLists?customerId=&date=       → ราคาตามกลุ่ม
```

### Business Rules
- ใบเสนอราคาหมดอายุ Auto หลัง 30 วัน (Configurable ใน Config)
- Serial **ไม่ต้องระบุ** ที่ Quotation — บังคับที่ GRN ฝ่ายคลังเท่านั้น
- ถ้าลูกค้าเกินวงเงิน → ต้องผ่าน SL-F1 ก่อน Confirm
- แปลงเป็น SO ได้ 1 Quote → หลาย SO (กรณีส่งแบ่งงวด)

### Open Questions
- [B1] Promotion ซ้อนกันหลายโปร → Priority อย่างไร?
- ~~[B5] Credit Limit Tier~~ ✅ RESOLVED — ดู SL-F1 section

---

## SL-2 — ใบสั่งจอง (Reservation)

### Module Brief
```
Module:  SL-2 Reservation
Phase:   P1
BC:      salesOrders (Header 36, Line 37) — Status: Open
Trigger: ลูกค้าตกลงซื้อแต่ยังไม่ชำระหรือรอสินค้า
Output:  จองสต็อก + กำหนดวันส่ง
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: ใบสั่งจอง | Status Badge
ActionBar: [Save] [Confirm] [พิมพ์ใบจอง] [แปลงเป็นบิล]
```

**Section 2 — Doc Header**
```
เลขที่จอง   : Auto | วันที่จอง   : Today
วันที่ส่งสินค้า: Required (กำหนดวันส่ง)
อ้างอิง Quote: SC5 (ถ้ามาจาก SL-1)
```

**Section 3 — Party (SC1)**
```
เหมือน SL-1 + แสดง Credit Balance ก่อน Confirm
```

**Section 4 — Line Items (SC2 + SC8 + SC9)**
```
เหมือน SL-1 + Stock Check: แสดงสต็อกคงเหลือ Real-time
ถ้าสต็อกไม่พอ → Warning + แสดง ETA
Serial: ไม่บังคับที่นี่ — บังคับที่ WH Issue
```

**Section 5 — Tabs**
```
Tab [การชำระ]:  SC3 Payment + SC6 Deposit (รับมัดจำบางส่วน)
Tab [จัดส่ง]:   SC4 DeliveryPanel (ที่อยู่ + วันที่ + วิธี)
Tab [อ้างอิง]:  SC5 DocRefPanel ← Quote ต้นทาง
Tab [ประวัติ]:  SC7 Timeline
```

**Section 6 — Summary**
```
ยอดรวม | มัดจำที่รับแล้ว | ยอดคงค้าง | VAT
```

**Section 7 — Action Bar**
```
Draft     : [Save] [Confirm] [Delete]
Confirmed : [รับมัดจำเพิ่ม] [แปลงเป็นบิล] [ยกเลิก]
```

### Status Flow
```
Draft → รออนุมัติวงเงิน (ถ้าเกิน) → Confirmed → แปลงเป็น Invoice
                ↓                       ↓
            ปฏิเสธ               ยกเลิก (คืนสต็อก)
```

### Business Rules — Reservation (decision 2026-07-02 #7)
- **BC เป็นเจ้าของ reservation ledger** — Portal แค่ trigger: Confirm → reserve · Cancel/Expire → release ทันที (Portal ไม่เก็บ reservation เอง)
- **อายุใบจอง (auto-expire):** ระบุจำนวนวันเองได้ต่อใบ + dropdown ค่ามาตรฐาน (7/15/30 วัน · default กลางตั้งที่ CF Config) · ใกล้ครบกำหนด → banner เตือน + ปุ่มต่ออายุ/ยกเลิก · ครบแล้วระบบปล่อยยอดจองคืนสต๊อกอัตโนมัติ
- **Guard double-reserve:** สร้างใบจองแล้วสต๊อกไม่พอ → แสดง**ลิสต์ใบจองที่ถือของ** (เลขใบจอง · เซลล์ผู้จอง · จำนวน · วันหมดอายุ) + ปุ่ม "ขอถอนจอง" (notification ถึงเซลล์เจ้าของใบ) — ไม่ใช่ warning เฉย ๆ ต้อง actionable
- **WH-3 อ่าน reserved qty จาก BC ledger** — pick list แสดงคอลัมน์ "สต๊อก (จองไว้)" กันเบิกเกิน

### SC ที่ใช้
SC1, SC2, SC3, SC4, SC5, SC6, SC7, SC8, SC9

### RBAC
| Function | Admin | Sales Mgr | Sales Staff |
|---|---|---|---|
| สร้าง/แก้ไข | ✅ | ✅ | ✅ |
| อนุมัติวงเงิน | ✅ | ✅ | ❌ |
| ยกเลิกหลัง Confirm | ✅ | ✅ | ❌ |

### BC API
```
POST  /salesOrders                    → สร้าง SO (Status: Open)
PATCH /salesOrders/{id}               → แก้ไข
POST  /salesOrders/{id}/Microsoft.NAV.shipAndInvoice → แปลงเป็น Invoice
GET   /items/{id}/stockByLocation     → ตรวจสต็อก
```

---

## SL-3 — ใบมัดจำ (Deposit)

### Module Brief
```
Module:  SL-3 Deposit
Phase:   P1
BC:      Custom Prepayment API (ไม่มี Standard BC Endpoint)
Trigger: รับเงินมัดจำก่อนส่งสินค้า
Output:  ใบรับเงินมัดจำ (ออกเป็นบิล) + บันทึก GL
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: ใบมัดจำ | Status Badge
ActionBar: [Save] [Post] [พิมพ์ใบมัดจำ]
```

**Section 2 — Doc Header**
```
เลขที่มัดจำ : Auto | วันที่รับ : Today
อ้างอิงจอง  : SC5 ← เลขที่ใบจอง (SL-2) [Required]
```

**Section 3 — Party (SC1)**
```
ดึงมาจากใบจอง Auto-fill (ไม่ต้องเลือกซ้ำ)
```

**Section 4 — Line Items**
```
รายการ: "มัดจำสินค้าตามใบจอง [เลขที่]"
จำนวนเงินมัดจำ: ระบุเอง (บางส่วนหรือเต็ม)
```

**Section 5 — Tabs**
```
Tab [การชำระ]: SC3 PaymentPanel (เงินสด/โอน/เช็ค/บัตร)
Tab [ประวัติ]: SC7 Timeline
```

**Section 6 — Summary**
```
ยอดมัดจำ | วิธีชำระ | วันที่รับ
```

**Section 7 — Action Bar**
```
Draft: [Save] [Post] [Delete]
Posted: [พิมพ์] [View GL Entries]
```

### Status Flow
```
Draft → Posted → หักออกจากบิลขายอัตโนมัติ (SC6)
```

### SC ที่ใช้
SC1, SC3, SC5, SC6, SC7

### BC API
```
POST /prepaymentInvoices (Custom AL Extension)
GET  /salesOrders/{id}?$select=remainingAmount
POST /paymentJournals    → บันทึก GL รับเงิน
```

### Business Rules
- มัดจำ 1 ใบจอง → หลายใบมัดจำได้ (รับทีละงวด)
- SC6 จะ Auto-deduct ยอดมัดจำทั้งหมดเมื่อออกบิลขาย
- [B6] GL Account สำหรับมัดจำ → ต้องกำหนดใน Config

---

## SL-4 — บิลขาย / ขายสด (Sales Invoice)

### Module Brief
```
Module:  SL-4 Invoice
Phase:   P1
BC:      salesInvoices (Header 112, Line 113) หรือ salesOrders → Post
Trigger: ขายสด หรือ แปลงจากใบจอง
Output:  ใบกำกับภาษี / ใบเสร็จ + Post ไป BC Ledger
```

### ⚡ 5 ส่วนประกอบหลักของบิลขาย (Business Flow)

เมื่อเปิดบิลขาย ทั้ง 5 ส่วนทำงานพร้อมกันในหน้าเดียว:

```
┌──────────────────────────────────────────────────────────────────┐
│                        บิลขาย (SL-4)                             │
├─────────┬─────────┬───────────┬──────────┬──────────────────────┤
│ ① สินค้า │ ② ชำระ  │ ③ จัดส่ง/  │ ④ โปรฯ   │ ⑤ ใบกำกับภาษี      │
│ & สต็อก  │  เงิน   │  ติดตั้ง   │ อัตโนมัติ │   (ถ้าลูกค้าขอ)     │
└─────────┴─────────┴───────────┴──────────┴──────────────────────┘
```

**① สินค้า & สต็อก**
- เลือกสินค้า → ระบบกันสต็อกอัตโนมัติ (Reserve)
- แจ้งคลังเพื่อเบิกสินค้า (Warehouse Pick Request)
- ลูกค้ารับเอง → จบที่เคาน์เตอร์ / ต้องจัดส่ง → ไปข้อ ③

**② การรับชำระเงิน**
- เงินสด → บันทึกรายการรับเงินได้ทันที
- บัตรเครดิต/โอน/เช็ค/QR → บันทึกข้อมูลอ้างอิง (เลขอนุมัติ, Slip, Ref No.)
- เครดิต → ตรวจวงเงิน auto → เกิน → trigger SL-F1 Approval
- Split Payment → รับหลายวิธีต่อบิลได้

**③ จัดส่ง / ติดตั้ง** (ถ้าไม่รับเอง)
- อ้างอิงคิว & แผนจัดส่ง: สถานที่, ผู้ติดต่อ, เบอร์โทร, วันเวลาจัดส่ง
- ส่งงานเข้าคิว → ช่าง/พนักงานจัดส่ง
- แจ้งผ่านมือถือ (Mobile Notification → SV Module)
- ถ้าต้องติดตั้ง → Auto-create Service Work Order

**④ โปรโมชั่นอ้างอิง (Auto-Match)**
- เลือกสินค้าปุ๊บ → ระบบแสดงโปรฯ ที่ match เงื่อนไขอัตโนมัติ:
  - ช่องทางการขาย (ค้าปลีก/ค้าส่ง/ออนไลน์)
  - ช่วงเวลาขาย (วันที่เริ่ม-สิ้นสุดโปร)
  - สินค้า / หมวดสินค้า ที่ร่วมรายการ
  - สาขาที่ขาย
- ใช้ SC9 (SharedPromoPrice) + PM Module Cross-Reference
- Priority Number (B1): ซ้อนได้ ≤ 2 ชั้น, ชั้นที่ 3+ ต้องอนุมัติ

**⑤ ใบกำกับภาษี**
- ลูกค้าขอ → ออกได้ทันทีในจอเดียวกัน
- ส่งข้อมูลเข้าฐานข้อมูลภาษี (VAT Output) อัตโนมัติ
- e-Tax Invoice XML → ส่ง RD API หลัง Post (Phase 2)

---

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: บิลขาย | Status Badge (Draft/Pending/Posted)
ActionBar: [Save] [Submit] [Post Invoice] [พิมพ์] [Duplicate]
```

**Section 2 — Doc Header**
```
เลขที่บิล   : Auto (Tax Invoice No. — ต้องถูกต้อง e-Tax)
วันที่บิล   : Today | Branch   : Current User Branch
เลขที่ใบจอง : SC5 (ถ้าแปลงมา) | เลขที่ Quote : SC5
ประเภท VAT  : VAT Include / Exclude / None (UX7)
ประเภทการรับ: [รับเอง] / [จัดส่ง] / [จัดส่ง+ติดตั้ง] ← กำหนด Flow ③
```

**Section 3 — Party (SC1)**
```
ลูกค้า: SC1 | 3 Address Types (UX6):
  - ที่อยู่ออกใบกำกับภาษี
  - ที่อยู่จัดส่ง
  - ที่อยู่ตามบัตรปชช
เลขผู้เสียภาษี: Required สำหรับนิติบุคคล
ต้องการใบกำกับภาษี: [ใช่/ไม่] ← Toggle สำหรับ ⑤
```

**Section 4 — Line Items (SC2 + SC8 + SC9)** ← ① สินค้า + ④ โปรฯ
```
Barcode Scan: ✅ (UX2)
Serial: แสดง SC8 เมื่อ Serial Flag = true
  → ถ้าออกบิลไปก่อน ช่องยังว่าง → WH กรอก Serial ตอน Issue
Import/Export Serial CSV: ✅ (UX3)
Bundle Item: ✅ (UX8) — แสดง Component ใต้ Bundle Line
Inline Edit: ✅ (UX1)

🏷️ โปรโมชั่น Auto-Match (④):
  เลือกสินค้า → SC9 ดึงโปรฯ ที่ match ให้อัตโนมัติ
  แสดง Badge: [โปร: ลด 10%] [แถม X] [Bundle]
  พนักงานเลือก Apply / ข้าม ต่อรายการ
  ถ้าซ้อน > 2 ชั้น → ขออนุมัติ (B1 Priority Rule)

📦 กันสต็อก (①):
  เลือกสินค้า + ระบุจำนวน → กันสต็อกอัตโนมัติ (Reserve)
  แจ้งคลัง: สร้าง WH Pick Request → Warehouse Queue
  สต็อกไม่พอ → Warning + แสดง ETA / สาขาที่มี
```

**Section 5 — Tabs**
```
Tab [ชำระเงิน ②]: SC3 (เงินสด/โอน/เช็ค/บัตร/QR/เครดิต)
  - บันทึกข้อมูลอ้างอิง: เลขอนุมัติบัตร, Slip No., Bank Ref
  - Split Payment: เลือกหลายวิธีต่อบิล
  - เครดิต: ตรวจวงเงิน auto → เกิน → trigger SL-F1

Tab [มัดจำ]:   SC6 (หักมัดจำจาก SL-3 Auto)

Tab [จัดส่ง/ติดตั้ง ③]: SC4 (ที่อยู่ + ผู้ติดต่อ + เบอร์ + วันเวลา + วิธีส่ง)
  - คิวจัดส่ง: เลือกวัน/ช่วงเวลา จากคิวที่ว่าง
  - มอบหมาย: เลือกช่าง/พนักงานจัดส่ง → ลงคิว
  - แจ้งมือถือ: Push Notification → SV Module (Mobile App)
  - ถ้าติดตั้ง: Auto-create Service Work Order (SV-1)

Tab [ใบกำกับภาษี ⑤]: (แสดงเมื่อ Toggle = ใช่)
  - Preview ใบกำกับ: ชื่อ/ที่อยู่/เลขผู้เสียภาษี/รายการ/VAT
  - ออกใบกำกับ: กดพิมพ์ได้ทันที
  - Post → ส่ง VAT Output เข้าฐานข้อมูลภาษีอัตโนมัติ

Tab [อ้างอิง]: SC5 (Quote → จอง → บิล Chain) + QR Track (UX9)
Tab [ประวัติ]: SC7 Timeline
```

**Section 6 — Summary**
```
ยอดรวมสินค้า
- ส่วนลด โปรโมชั่น (④ Auto-Match)
- ส่วนลดท้ายบิล (%)
- มัดจำที่หักแล้ว (SC6)
+ VAT 7% (ถ้า Include)
= ยอดสุทธิ
แสดง: วิธีชำระ + จำนวนที่ชำระแต่ละวิธี (②)
```

**Section 7 — Action Bar**
```
Draft    : [Save] [Submit] [Delete]
Pending  : Maker=รอ | Approver=[Approve] [Reject]
Confirmed: [Post Invoice] [แก้ไข (ถ้า Role อนุญาต)] [Cancel]
Posted   : [พิมพ์] [พิมพ์ใบกำกับ ⑤] [Duplicate] [View GL Entries] [ออก Credit Memo]
```

### Status Flow
```
Draft → รออนุมัติวงเงิน (ถ้าเกิน) → Confirmed → Posted (BC Ledger)
             ↓                            ↓           ↓
         ปฏิเสธ                      ยกเลิก    → แจ้งคลังเบิก (①)
                                     (ต้อง CM)  → แจ้งจัดส่ง (③)
                                                → บันทึก VAT (⑤)
```

### Cross-Module Integration
```
SL-4 ────→ WH Module    : กันสต็อก + WH Pick Request (①)
SL-4 ────→ FI Module    : บันทึกรับเงิน + AR Entry (②)
SL-4 ────→ SV Module    : คิวจัดส่ง + Work Order ติดตั้ง (③)
SL-4 ────→ PM Module    : ดึงโปรฯ Auto-Match (④)
SL-4 ────→ AC/TX Module : VAT Output + e-Tax Invoice (⑤)
```

### SC ที่ใช้
SC1, SC2, SC3, SC4, SC5, SC6, SC7, SC8, SC9 ← **ใช้ทุก SC**

### RBAC
| Function | Admin | Sales Mgr | Sales Staff | Warehouse | Finance |
|---|---|---|---|---|---|
| สร้างบิล | ✅ | ✅ | ✅ | ❌ | ❌ |
| Post Invoice | ✅ | ✅ | ❌ | ❌ | ✅ |
| แก้ไขราคาต้นทุน | ✅ | ✅ | ❌ | ❌ | ❌ |
| ยกเลิกหลัง Post | ✅ | ❌ | ❌ | ❌ | ✅ |
| มอบหมายจัดส่ง (③) | ✅ | ✅ | ✅ | ✅ | ❌ |
| ดูต้นทุนสินค้า | ✅ | ✅ | ❌ | ❌ | ✅ |

### BC API
```
POST   /salesOrders → shipAndInvoice    → Post Invoice
GET    /salesInvoices/{id}              → ดู Posted Invoice
GET    /salesInvoices/{id}/pdfDocument  → ดาวน์โหลด PDF
POST   /customerPaymentJournals         → บันทึกรับเงิน (②)
GET    /items/{itemId}/stockByLocation  → ตรวจสต็อกก่อน Post (①)
POST   /warehousePickRequests           → แจ้งคลังเบิก (①)
GET    /promotions?channel=&date=&item= → ดึงโปรฯ Auto-Match (④)
POST   /vatEntries                      → บันทึก VAT Output (⑤)
```

### Business Rules
- **Serial ไม่บังคับที่บิลขาย** — บังคับที่ WH Issue (Rule จาก Sale.docx)
- ถ้า Post ไปแล้วแต่ต้องแก้ → ต้องออก Credit Memo (SL-CN) เท่านั้น
- QR Code บนใบเสร็จ → ลูกค้าดูสถานะจัดส่งได้ (UX9)
- e-Tax Invoice XML → ส่ง RD API หลัง Post (Phase 2)
- **① กันสต็อก**: เลือกสินค้า → Reserve ทันที → ยกเลิกบิล = คืนสต็อก
- **② Split Payment**: บิลเดียว → หลายวิธีชำระได้ ยอดรวมต้อง = ยอดสุทธิ
- **③ จัดส่ง/ติดตั้ง**: Post แล้วถ้ามีจัดส่ง → Auto-push คิวจัดส่ง + Notification มือถือ
- **④ โปรฯ Auto-Match**: SC9 แสดงโปรฯ ที่ match → ซ้อนได้ ≤ 2 ชั้น (B1 Rule)
- **⑤ ใบกำกับ**: ลูกค้าขอ = ออกทันที → VAT Output auto-post → ฐานข้อมูลภาษี
- **⑥ ที่อยู่ 2 บทบาท (decision 2026-07-02 #12)**: header มี 2 field แยกกันโดยเจตนา — **ที่อยู่ใบกำกับภาษี (Bill-to)** ต้องตรงทะเบียน VAT (ผิด = ใบกำกับใช้เครดิตภาษีไม่ได้) · **ที่อยู่จัดส่งสินค้า (Ship-to)** แก้อิสระได้ (หน้างาน/สาขา/ไซต์) · SV-6 + WH-3 อ่านจาก **Ship-to เท่านั้น** ห้ามอ่าน Bill-to · Ship-to ≠ Bill-to → แสดง badge "📍 ส่งของคนละที่กับที่อยู่ใบกำกับ" กันเข้าใจว่ากรอกผิด

### Flowchart Reference
```
Flow/04 Sales - Sales Shipment and Sales Invoice → Flow หลัก (รวมทุกส่วน)
Flow/08 Sales - Sales Shipment → Sub-flow เฉพาะส่วนจัดส่ง/ตัดสต็อก
Flow/09 Sales - Sales Invoice  → Sub-flow เฉพาะส่วนออกบิล/ใบกำกับ
```

---

## SL-CN — ใบลดหนี้ขาย (Credit Memo)

> **หมายเหตุรหัส (grill 2026-07-02 Q1):** spec เดิมใช้รหัส "SL-5" แต่ไฟล์จริงคือ `slcn-credit-memo-mockup.html` — canonical = **SL-CN** (คู่สมมาตรกับ PO-CN ฝั่งซื้อ) · รหัส SL-5 ปล่อยให้ CRM (archived Phase 2)

### Module Brief
```
Module:  SL-CN Credit Memo
Phase:   P1
BC:      creditMemos (Header 114)
Trigger: (1) Sales เปิดจากบิล — ราคาผิด / ส่วนลดพิเศษ / คืนสินค้า
         (2) คำขอจากงานเคลม SV — ผลจบเคลม "คืนเงิน/ลดหนี้" เท่านั้น
Output:  ใบลดหนี้ + ลด AR/VAT + เครดิตค้างใน Customer Ledger
```

### ทางเข้า 2 ทาง — ฟอร์มเดียว (Q2/Q3/Q8/Q9)
- **สายขาย:** Sales เปิดจาก SL-4 บิลขาย → เหตุผล: ราคาผิด / ส่วนลดพิเศษ / คืนสินค้า (ไม่เกี่ยวชำรุด)
- **สายเคลม:** SV จบงานเคลมผลลัพธ์ "คืนเงิน/ลดหนี้" → ส่ง**คำขอ**เข้า SL-Q กลุ่ม CN (badge "🛠️ จากเคลม SV") → Sales เปิดฟอร์ม prefill อ้างอิงงานเคลม + **เหตุผลล็อกเป็น "เคลม (จาก SV)" แก้ไม่ได้**
- ผลจบเคลมอื่นไม่ออก CN: ซ่อมเสร็จ = จบใน SV · **เปลี่ยนตัวใหม่ = จบใน SV/WH** (เบิกเครื่องใหม่ + ไล่ vendor ผ่าน CLM→PO-CN) ไม่แตะ AR

### โหมดการลดหนี้ 3 โหมด (ตาม mockup)
| โหมด | ยอดลด | ของคืน |
|---|---|---|
| ✏️ ปรับราคา | ส่วนต่างราคา | ไม่มี |
| 📦 คืนบางรายการ | ราคาเดิม × จำนวนคืน | มี — ระบุ Serial (SC8) |
| ↩️ คืนทั้งบิล | เต็มยอด | มี — ทั้งหมด |

### ERP Form 7 Sections

**Section 2 — Doc Header**
```
เลขที่ CN      : Auto | วันที่ CN : Today
อ้างอิงบิลขาย : SC5 [Required] ← ต้องระบุบิลต้นทาง
เหตุผล        : Dropdown (ราคาผิด / ส่วนลดพิเศษ / คืนสินค้า / เคลม (จาก SV) — ล็อกเมื่อมาจากคิว SV)
รูปแบบเอกสาร  : AUTO ตามบิลต้นทาง แก้ไม่ได้ (Q4) —
                บิลมีใบกำกับภาษี → "ใบลดหนี้/ใบกำกับภาษี" (ปรับ VAT Output)
                บิลไม่มีใบกำกับ  → "ใบลดหนี้"
```

**Section 4 — Line Items**
```
Copy มาจาก Invoice ต้นทาง (Auto-fill) → แก้ตามโหมด
ถ้าคืนสินค้า: ระบุ Serial ที่คืน (SC8)
```

### Status Flow (Q5/Q7)
```
Draft → รออนุมัติ (CF-2.6 ทุกใบ) → Approved → [gate: รอรับของคืน] → Posted
```

### BC API
```
POST  /salesCreditMemos                → สร้าง CM
PATCH /salesCreditMemos/{id}
POST  /salesCreditMemos/{id}/Microsoft.NAV.post → Post CM
```

### Business Rules (grill 2026-07-02 Q1-Q10)
1. **Link บิลต้นทางเสมอ** (SC5) — ไม่มีบิลอ้างอิง = สร้างไม่ได้
2. **อนุมัติทุกใบผ่าน CF-2.6 Approval Matrix** ตาม tier ยอดเงิน — ไม่มี threshold ยกเว้น (CN = ช่องทาง fraud คลาสสิก ซอยใบเล็กหนีไม่ได้) · Maker≠Checker
3. **ของก่อนเงินเท่านั้น (Q5):** โหมดคืนของ Post ได้ต่อเมื่อมีหลักฐานรับของคืนแล้ว — สายขาย = WH Return Receipt posted · สายเคลม = SV รับของตอน intake แล้ว (ใช้เป็นหลักฐานได้เลย ไม่รับซ้ำ) · ก่อนครบเงื่อนไข ปุ่ม Post disable "รอรับของคืน"
4. **เครดิตค้างใน AR ledger เสมอ (Q6):** CN จบหน้าที่ที่สร้างเครดิต balance — การใช้เครดิตเป็นขั้นแยกที่ FI: หักบิลถัดไป = คิว apply FI-1/FI-1Q · คืนเงินสด = Finance สร้างรายการจ่ายคืน + approval (เงินออกจริง) · **ห้าม CN trigger จ่ายเงินเอง**
5. **รูปแบบเอกสาร auto ตามบิลต้นทาง (Q4)** — ห้ามให้เลือกเอง กันออกผิดแบบ (บิลมี VAT แต่ออกใบลดหนี้ธรรมดา = VAT Output ไม่ถูกปรับ)
6. Post ไปแล้วแก้ไม่ได้ — ต้อง Reverse + สร้างใหม่ (BC เป็นเจ้าของ posting)

---

## SL-F1 — ขออนุมัติวงเงิน (Credit Approval)

### วัตถุประสงค์
เมื่อลูกค้ามียอด Outstanding เกิน Credit Limit หรือสถานะ Blocked → พนักงานต้องขออนุมัติก่อนดำเนินการต่อ

### Trigger Points
- SC1 ตรวจพบ: Outstanding > Credit Limit
- SC1 ตรวจพบ: Customer Status = Blocked
- Sales ต้องการเปิดบิลให้ลูกค้าที่ค้างชำระ

### Flow
```
พนักงานขายกดขออนุมัติ
    ↓
แสดง Panel: ยอดค้างชำระ, วงเงิน, ประวัติชำระ (SC7)
    ↓
ส่ง Notification → Finance Manager / Sales Manager
    ↓
Approve → เปิดบิลได้ชั่วคราว (กำหนดระยะเวลา)
Reject  → แจ้งพนักงาน, ล็อก Document
```

### หน้าจอ Approval Panel
```
ชื่อลูกค้า     | วงเงินที่อนุมัติ | วงเงินที่ใช้แล้ว | คงเหลือ
Outstanding   | Overdue(วัน)    | ประวัติชำระ 6 เดือน
เหตุผลขอเกิน  : [Input]
[ส่งขออนุมัติ]
```

### Credit Approval Tier ✅ **[B5] RESOLVED**
```
"เกินวงเงิน" = (ยอดสั่งซื้อใหม่ + AR ค้างเดิม) - Credit Limit ของลูกค้า

┌─────────────────┬──────────────┬──────────────┬─────────┐
│ เกินวงเงิน      │ ผู้อนุมัติ    │ Escalation   │ SLA     │
├─────────────────┼──────────────┼──────────────┼─────────┤
│ 0 - 50,000      │ Sales Mgr    │ Finance Mgr  │ 4 ชม.   │
│ 50,001 - 200,000│ Branch Mgr   │ Finance Mgr  │ 8 ชม.   │
│ 200,001-500,000 │ Finance Mgr  │ GM           │ 24 ชม.  │
│ > 500,000       │ GM           │ —            │ 24 ชม.  │
└─────────────────┴──────────────┴──────────────┴─────────┘

SLA สั้นกว่า PO เพราะลูกค้ารออยู่
Approve → เปิดวงเงินชั่วคราว (กำหนดวันหมดอายุ)
Reject → แจ้งพนักงาน + ล็อก Document
ตั้งค่าใน CF-7 Approval Matrix — Admin แก้ตัวเลขได้เอง
```

### RBAC
| Role | สิทธิ์ |
|---|---|
| Sales Staff | ขออนุมัติ (ส่ง Request) |
| Sales Manager | อนุมัติ (เกินไม่เกิน 50K) |
| Branch Manager | อนุมัติ (เกิน 50K-200K) |
| Finance Manager | อนุมัติ (เกิน 200K-500K) |
| GM | อนุมัติทุกระดับ |
| Admin | อนุมัติทุกระดับ |

### BC API
```
GET  /customers/{id}?$select=creditLimit,balanceDue,blocked
PATCH /customers/{id}  → อัปเดต Temporary Credit Limit (ถ้า Approve)
GET  /customerLedgerEntries?customerId=  → ดูประวัติ
```

---

## 📌 Sales Module — Business Rules รวม

1. **Serial Rule**: Serial Number ไม่บังคับที่ขาย — บังคับที่ WH Issue เท่านั้น
2. **Document Chain**: Quote → Reservation → Deposit → Invoice (SC5 Link ทุกขั้น)
3. **Credit Check**: SC1 ตรวจทุกครั้งก่อนสร้างเอกสาร
4. **VAT per Doc**: แต่ละบิลกำหนด VAT Option เองได้ (UX7)
5. **3 Addresses**: ลูกค้ามี 3 ที่อยู่ แยก Use Case (UX6)
6. **Inline Edit**: ห้าม Popup ทุกกรณีใน Line Items (UX1)
7. **Promotion**: SC9 คำนวณโปรให้อัตโนมัติตาม Date + Customer Group
8. **e-Tax**: Post Invoice → Auto-trigger XML Generator (Phase 2)

---

## 🗄️ BC Table Reference (Sales)

| เอกสาร | Table No. | Endpoint |
|---|---|---|
| Sales Quote Header | 6660 | /salesQuotes |
| Sales Quote Line | 6661 | /salesQuoteLines |
| Sales Order Header | 36 | /salesOrders |
| Sales Order Line | 37 | /salesOrderLines |
| Sales Invoice Header | 112 | /salesInvoices |
| Sales Invoice Line | 113 | /salesInvoiceLines |
| Sales Credit Memo | 114 | /salesCreditMemos |
| Customer | 18 | /customers |
| Customer Ledger | 21 | /customerLedgerEntries |
