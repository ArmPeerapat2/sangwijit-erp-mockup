# plan.md — Sangwijit ERP Web Portal | Full Implementation Plan (Phase 1–4)
**อ่าน research.md ก่อนเสมอ | Don't implement until plan is approved**
_Version 2.0 | 2026-02-22_

---

## วิธีใช้ไฟล์นี้ (Workflow)

```
1. อ่านแผนทั้งหมด
2. พิมพ์ comment/ข้อท้วงติง ลงใน Section ที่เกี่ยวข้องโดยตรง
   format: > [COMMENT] ข้อความ — ชื่อ/วันที่
3. ส่งกลับให้ AI อัปเดตแผน
4. วนซ้ำจนกว่าแผนจะ approved ทุก section
5. เมื่อ approved → สั่ง "implement it all"
```

**สถานะแต่ละ Task:**
- `[ ]` ยังไม่ได้ทำ
- `[?]` รอตัดสินใจ / มี Open Question
- `[~]` กำลังทำ
- `[x]` เสร็จแล้ว
- `[!]` Blocked — ต้องแก้ก่อนดำเนินการได้

---

## Phase Overview

| Phase | โมดูล | เป้าหมาย | เงื่อนไข Go-Live |
|---|---|---|---|
| **Phase 1** | Sales, Warehouse, Purchase Basic, Price P1, Finance Basic, Master | Run ASAP | Master Data พร้อม + BC Sandbox ผ่าน |
| **Phase 2** | Step Discount/Bundle, Credit Memo Flow, Service Basic+Enhancement, Claims, Bank Recon, e-Tax Invoice, Mobile Group A (ช่าง) | Scale & Control | Phase 1 UAT ผ่าน |
| **Phase 3** | Finance Full, Promotion Full, Accrual Auto, Real-time, Service Notification+Perf, Marketplace (Shopee/Lazada) | Automate | Phase 2 Stable |
| **Phase 4** | Trade-in, Simulator, Advanced SLA, Mobile Group B (ผู้บริหาร), Marketplace Dashboard, BI/KPI Full, PDPA | Optimize | Phase 3 Stable |

---

## SECTION 0 — Pre-conditions (ทุก Phase ต้องผ่านก่อน)

### 0.1 Open Questions — ต้อง Resolve ก่อนเริ่ม

> [COMMENT]

| # | คำถาม | เจ้าของ | ต้องการ Phase | คำตอบ |
|---|---|---|---|---|
| T1 | Mobile: Native / PWA / Responsive Web? | Architect | P2 | ❓ |
| T2 | Offline Mode ช่าง: Sync ยังไง? | Architect | P2 | ❓ |
| T3 | GPS: Real-time หรือ Check-in/out? | Business | P2 | ❓ |
| T4 | Photo: Size/format/Storage (BC หรือ Azure Blob)? | Dev | P2 | ❓ |
| T5 | BC Extension: Standard หรือ Custom AL? กี่ตัว? | Dev | P1 | ❓ |
| T6 | Promotion Engine: คำนวณที่ Portal หรือ BC? | Architect | P1 | ❓ |
| T7 | Night Sync Job: Azure Function / Power Automate / Custom? | Dev | P1 | ❓ |
| T8 | E-Signature: Library อะไร? | Dev | P2 | ❓ |
| T9 | e-Tax Invoice: BC365 Standard Thailand Extension ครอบคลุมหรือต้อง Custom? | Dev | P2 | ❓ |
| T10 | Marketplace: Shopee/Lazada Partner Account พร้อมหรือยัง? Production Key ได้เมื่อไหร่? | Business | P3 | ❓ |
| T11 | Customer Notification: ใช้ SMS Provider หรือ LINE Notify? | Dev | P3 | ❓ |
| T12 | Stock Sync Marketplace: Real-time Push หรือ Batch ทุก X นาที? | Architect | P3 | ❓ |
| B1 | Promotion Conflict Priority: กำหนดยังไง? | Business | P1 | ❓ |
| B2 | Serial Policy: สินค้าตัวไหนบังคับ Serial? | Business | P1 | ❓ |
| B3 | Accrual Auto-Hook: Trigger ทันที Post GRN หรือ Batch? | Business | P1 | ❓ |
| B4 | ช่าง Outsource vs ช่างใน: Process ตั้งหนี้ต่างกันยังไง? | Business | P2 | ❓ |
| B5 | Credit Approval Tier 1/2/3: วงเงินแต่ละ Tier + Escalation? | Business | P1 | ❓ |
| B6 | Deposit: GL Account ที่ตัด? | Finance | P1 | ❓ |
| B7 | Commission PC: คำนวณรายบิล/เดือน? ผูก Promo หรือ Sales? | Business | P1 | ❓ |
| B8 | Bank Recon Tolerance: ± กี่วัน ± กี่บาท? | Finance | P2 | ❓ |
| B9 | SLA Service: แต่ละ Doc Type กี่ชั่วโมง? Working Hours? | Business | P2 | ❓ |
| B10 | WHT Certificate: Auto หรือ Manual? Format? | Finance | P1 | ❓ |
| D1 | Master Data จาก HERO พร้อมแค่ไหน? | Project | P1 | ❓ |
| D2 | Historical Data: ย้าย Transaction เก่าหรือแค่ Master? | Project | P1 | ❓ |
| D3 | GL / Cost Center / Posting Group Mapping ครบแล้ว? | Finance | P1 | ❓ |
| D4 | Number Series รูปแบบเลขที่เอกสารแต่ละประเภท? | Business | P1 | ❓ |
| D5 | Customer Group / Price Group: มีกี่กลุ่ม? รหัส? | Business | P1 | ❓ |

### 0.2 BC365 Environment

> [COMMENT]

- [ ] Sandbox BC365 พร้อมใช้
- [ ] Service Account สร้างแล้ว + สิทธิ์ API ครบ
- [ ] OAuth2 / API Key ได้รับแล้ว
- [ ] BC Extension Deploy บน Sandbox แล้ว
- [ ] Dry-Run Import Master Data บน Sandbox

### 0.3 BC Extension ที่ต้องพัฒนา

> [COMMENT]

| Extension | ใช้ใน | Phase | สถานะ |
|---|---|---|---|
| Promotion Engine (Price Rule + Conflict) | SC9, Sales, Promo | P1 | [?] ตรวจ Standard BC ก่อน |
| Accrual / Sale-in Tracking | Purchase GRN, Finance | P1 | [?] |
| Prepayment / Deposit | Sales Deposit | P1 | [?] |
| Purchase Requisition (PR) | Purchase | P1 | [?] Standard BC มี PR? |
| Service Order | Service | P2 | [?] |
| Warranty Tracking per Serial | Service, Claims | P2 | [?] |
| Trade-in Engine | Sales | P4 | [ ] |
| Promotion Simulator | Promo | P4 | [ ] |

---

## SECTION 1 — Shared Components (ทำก่อนทุก Phase)

> **กฎ:** SC ทุกตัวต้องผ่าน Unit Test ก่อนเริ่ม Page Component

### SC1 — SharedCustomerSearch

> [COMMENT]

**API:**
```
GET /customers?$filter=name eq '...' or code eq '...'
GET /customers/{id}    → credit + price group + block status
POST /customers        → Quick-Create (Draft)
```
Tasks:
- [ ] UI: ช่องค้นหา + ผลลัพธ์ + Credit Status Badge
- [ ] Logic: Real-time ≥ 2 ตัว, debounce 300ms
- [ ] Logic: Auto-fill header + trigger Price List load เมื่อเลือก
- [ ] Logic: Blocked → Warning + ขออนุมัติก่อนเปิดบิล
- [ ] Feature: Quick-Create Draft

### SC2 — SharedItemSearch

> [COMMENT]

**API:**
```
GET /items?$expand=itemVariants&$filter=...
GET /items/{id}/stockByLocation
GET /priceLists?customerId=&date=
```
Tasks:
- [ ] UI: ค้นหา + stock แยกคลัง + ราคา + สินค้าทดแทน
- [ ] Logic: Serial Flag → บังคับ SC8 เมื่อหยิบ
- [ ] Logic: Stock = 0 → เสนอสินค้าทดแทน

### SC3 — SharedPaymentPanel

> [COMMENT]

**API:** `GET /paymentMethods`, `POST /cashReceiptJournals`

Tasks:
- [ ] UI: Multi-method + เงินทอน Real-time
- [ ] Logic: รวม > วงเงิน → emit `approval:required`
- [?] Payment Method ที่ใช้จริงมีอะไรบ้าง?

### SC4 — SharedDeliveryPanel

> [COMMENT]

Tasks:
- [ ] UI: ที่อยู่ + วันที่ + วิธีจัดส่ง + Toggle ติดตั้ง
- [ ] API: `GET /customers/{id}` → default address

### SC5 — SharedDocRefPanel

> [COMMENT]

**Mapping Table:**
| docType ปัจจุบัน | ดึงได้จาก | Auto-fill |
|---|---|---|
| INVOICE | QUOTE, RESERVATION, DEPOSIT | items, customerId, delivery, depositRef |
| RESERVATION | QUOTE | items, customerId, priceList |
| PO | PR, RFQ | vendor, items, price |
| GRN | PO, TRANSFER | items, qtyExpected |
| AP_INVOICE | GRN, PO | vendor, items, amount |
| SERVICE | SALES_SHIPMENT | items, serial, customer |
| CLAIM | SERVICE | items, serial, warrantyStatus |

Tasks:
- [ ] UI: ค้นหาเอกสารต้นทาง ตาม docType
- [ ] Logic: Auto-fill + Partial Pull (เลือกบางบรรทัด)
- [ ] Logic: ครบทุก Mapping ตาม Table

### SC6 — SharedDepositPanel

> [COMMENT]

**API:** `GET /customerLedgerEntries?customerId=&type=prepayment&open=true`

Tasks:
- [ ] UI: แสดงมัดจำค้างของลูกค้า + ยอดคงเหลือ
- [ ] Logic: หักลบ → แสดงผลทันที
- [!] **Blocked:** GL Account Deposit (B6)

### SC7 — SharedTimeline

> [COMMENT]

**API:** `GET /auditLog?documentId=&documentType=`

Tasks:
- [ ] UI: Timeline แนวตั้ง — Who/When/What ทุก Event
- [ ] Logic: Poll 30 วินาที (P1) → WebSocket (P3)

### SC8 — SharedSerialPanel

> [COMMENT]

**API:**
```
PATCH /itemTrackingEntries     → register + validate
GET /itemTrackingEntries?serialNo=
```
Tasks:
- [ ] UI: Input + Scan + Batch CSV upload
- [ ] Logic: Validate ซ้ำ Real-time (session pool + BC365)
- [ ] Logic: ซ้ำ → Block + แสดง conflict serial

### SC9 — SharedPromoPrice

> [COMMENT]

**API:**
```
GET /priceLists?active=true&date=&customerGroup=
GET /promotionEntries?active=true&date=&itemId=
```
Tasks:
- [ ] Logic: คำนวณราคา / ส่วนลด / ของแถม Real-time
- [!] **Blocked:** Conflict Rule (B1)

---

## SECTION 2 — Phase 1: "Run ASAP"

### 2.1 Sales Module

> [COMMENT]

#### Sales Queue / Dashboard
**API:**
```
GET /salesQuotes?status=Approved
GET /salesOrders?shipOutstanding=true
GET /salesInvoices?status=pending
GET /customerLedgerEntries?type=prepayment&open=true
```
Tasks:
- [ ] UI: Queue Cards แยกประเภท + Filter สาขา/พนักงาน/วันที่
- [ ] SC: SC7

#### Sales Invoice
**API:** `POST /salesOrders`, `POST /salesInvoices/{id}/post`

Tasks:
- [ ] UI: SC1 + SC2 + SC3 + SC4 + SC5 + SC6 + SC7 + SC8 + SC9
- [ ] Logic: mode = create / edit / view / posted
- [ ] Logic: Serial ไม่บังคับตอนขาย
- [ ] Logic: เกินวงเงิน → ApprovalBanner + Block Post
- [ ] Logic: ภาษี — ออกใบกำกับบางบรรทัดได้
- [?] Lock Price Policy: เปิดหรือไม่?

#### Sales Quote
**API:** `POST /salesQuotes`, `POST /salesQuotes/{id}/makeOrder`

Tasks:
- [ ] UI: เหมือน Invoice ไม่มี Payment Panel
- [ ] Logic: Status Open → Pending Approval → Approved → Convert SO

#### Reservation
**API:** BC Reservation (Sales Line) + SO

Tasks:
- [ ] Logic: กันสต็อก Real-time เมื่อยืนยัน
- [ ] Logic: หมดอายุ → แจ้งเตือน / ขออนุมัติ

#### Deposit (มัดจำ)
Tasks:
- [ ] UI: บันทึกมัดจำ + ผูกลูกค้า
- [ ] UI: หักมัดจำใน Invoice (SC6)
- [!] **Blocked:** GL Account Deposit (B6)

#### Sales Credit Memo
**API:** `POST /salesCreditMemos`, `POST /{id}/post`

Tasks:
- [ ] UI: บังคับอ้างอิง Invoice (SC5)
- [ ] Logic: เหตุผล + แนบไฟล์ + ขออนุมัติ

---

### 2.2 Warehouse Module

> [COMMENT]

#### Warehouse Queue / Dashboard
**API:**
```
GET /purchaseOrders?status=Released&receiveOutstanding=true
GET /transferOrders?status=Released
GET /salesOrders?shipOutstanding=true
```
Tasks:
- [ ] UI: Queue แยก รอรับ PO / รอรับโอน / รอเบิก / รอโอน

#### GRN (รับสินค้า)
**API:** `POST /warehouseReceipts`, `PATCH /itemTrackingEntries`

Tasks:
- [ ] UI: SC2 + SC5 + SC8 + SC7
- [ ] Logic: Qty จริง > Qty PO → Warning + ยืนยัน Supervisor
- [ ] Logic: Warranty Date บังคับถ้า Item Warranty Flag = Yes
- [!] **Blocked:** Accrual Hook timing (B3)

#### Transfer Request
**API:** BC Transfer Order Draft หรือ Custom Extension

Tasks:
- [ ] UI: Staff สร้าง → Supervisor อนุมัติ
- [ ] Logic: Role Guard — Staff เห็นปุ่ม Direct Transfer เป็น Disabled

#### Transfer Order
**API:** `POST /transferShipments/{id}/ship`, `POST /transferReceipts/{id}/receive`

Tasks:
- [ ] Logic: Partial Ship/Receive — คงยอดค้าง
- [ ] Logic: Shipped → สร้างคิว Pending Receipt ปลายทางอัตโนมัติ

#### Sales Issue (เบิกตามบิล)
**API:** `POST /warehouseShipments`, `POST /{id}/post`

Tasks:
- [ ] UI: SC2 + SC8 (ยิง Serial ก่อนจ่าย)
- [ ] Logic: Stock ไม่พอ → เสนอสร้าง Transfer Request / Backorder
- [ ] Logic: ยืนยันเบิก → Post Shipment → Real-time กลับ Sales

#### Serial Entry หลังบิล
**API:** `PATCH /itemTrackingEntries` (batch)

Tasks:
- [ ] UI: ค้นหาบิล → รายการที่ไม่มี Serial → ยิงทีละรายการหรือ Batch CSV

#### Stock Count
**API:** `POST /physInventoryJournals`

Tasks:
- [ ] UI: Blind Count Mode — ซ่อนยอดระบบขณะนับ
- [ ] Logic: Post Adjustment → ต้องอนุมัติ Supervisor

---

### 2.3 Purchase Module

> [COMMENT]

#### Purchase Queue / Dashboard
**API:**
```
GET /purchaseRequisitions?status=Open
GET /purchaseOrders?status=PendingApproval
GET /purchaseOrders?receiveOutstanding=true
GET /purchaseInvoices?status=pending
GET /purchasePrices?expiringDays=30
```
Tasks:
- [ ] UI: Queue 5 กลุ่ม + Filter

#### PR (ใบขอซื้อ)
**API:** BC Standard หรือ Custom Extension (ตรวจสอบ T5)

Tasks:
- [ ] UI: SC2 + SC7
- [ ] Logic: Open → Approved → Converted to PO

#### RFQ (เสนอราคา)
**API:** `POST /purchaseQuotes`

Tasks:
- [ ] UI: ส่ง RFQ หลาย Vendor + เปรียบเทียบราคา + เลือก Winner
- [ ] Logic: อ้างอิงจาก PR (SC5)

#### PO (ใบสั่งซื้อ)
**API:** `POST /purchaseOrders`

Tasks:
- [ ] UI: SC2 + SC3 + SC5 + SC7
- [ ] Logic: ราคา PO ≠ Price List > 5% → Alert สีส้ม + ยืนยัน Buyer
- [ ] Logic: Draft → Approval → Released

#### AP Invoice (ตั้งหนี้)
**API:**
```
GET /purchaseOrders/{id}/threeWayMatch
POST /purchaseInvoices
POST /purchaseInvoices/{id}/post
```
Tasks:
- [ ] UI: 3-Way Match Panel (PO qty / GRN qty / Invoice qty + price)
- [ ] Logic: Match Fail → Block Post + แสดง Variance
- [ ] Logic: VAT/WHT Auto-calc

#### Vendor Onboard
**API:** `POST /vendors`

Tasks:
- [ ] UI: Maker-Checker Flow
- [ ] Logic: เลขภาษีซ้ำ → Block

#### Purchase Price List
**API:** `POST /purchasePrices`

Tasks:
- [ ] UI: Vendor / Brand / ช่วงเวลา / MOQ / Lead Time
- [ ] Logic: ราคาใกล้หมดอายุ (30 วัน) → Alert ใน Queue

---

### 2.4 Price Setting Phase 1

> [COMMENT]

#### Price List (Sales)
**API:** `POST /priceLists`

Tasks:
- [ ] UI: ช่วงเวลา + กลุ่มลูกค้า + Import CSV
- [ ] Logic: Overlap ช่วงเวลา + กลุ่มเดียวกัน → Warning ก่อน Approve
- [?] Customer Group มีกี่กลุ่ม? (D5)

#### Basic Promotion
**API:** `POST /promotionEntries`

Tasks:
- [ ] UI: ช่วงเวลา + กลุ่มลูกค้า + ประเภท (ลด% / ลดบาท / Free Item)
- [!] **Blocked:** Conflict Rule (B1)

#### Price Alert
**API:** `GET /priceLists?expiringSoon=true`

Tasks:
- [ ] Logic: แจ้งเตือนราคาจะเปลี่ยน → Notification + Badge

#### Accrual (Sale-in Hook)
**API:** Custom Extension — `POST /accrualEntries`

Tasks:
- [ ] Logic: GRN Post → สร้าง Accrual Entry อัตโนมัติ
- [!] **Blocked:** Extension (T5) + Timing (B3)

---

### 2.5 Finance Basic

> [COMMENT]

#### Finance Dashboard
Tasks:
- [ ] UI: AR/AP/Cash/Bank Summary + Drill-down

#### Cash Receive (รับเงิน)
**API:**
```
GET /customerLedgerEntries?customerId=&open=true
POST /cashReceiptJournals
POST /cashReceiptJournals/{id}/apply
```
Tasks:
- [ ] UI: SC1 + SC3 + SC5 + SC7
- [ ] Logic: Apply Receipt กับ Invoice → ปิด Entry

#### AP Payment (จ่ายเงิน)
**API:** `POST /paymentJournals`

Tasks:
- [ ] UI: เลือก AP ค้าง + วิธีจ่าย + WHT
- [ ] Logic: WHT Auto-calc ตาม Income Type
- [?] WHT Certificate format (B10)

#### AR / AP Aging
**API:** `GET /customerLedgerEntries?open=true`, `GET /vendorLedgerEntries?open=true`

Tasks:
- [ ] UI: Aging Bucket (ไม่ถึง / 1-30 / 31-60 / 60+ วัน)
- [ ] Logic: เกิน threshold → Block เปิดบิลใหม่

---

### 2.6 Master Config Phase 1

> [COMMENT]

**กฎทุก Master:** Maker-Checker | Block = No Transaction | ห้าม Delete → Deprecated

#### Item Master
**API:** `POST /items`, `PATCH /items/{id}`

Tasks:
- [ ] UI: รหัส/ชื่อ TH-EN, Brand, UOM, Serial Flag, Warranty Period
- [?] Serial Flag กลุ่มสินค้าไหนบ้าง (B2)

#### Customer Master
**API:** `POST /customers`

Tasks:
- [ ] UI: กลุ่มราคา, วงเงิน Credit, เงื่อนไขชำระ, Block
- [?] Customer Group (D5)

#### Vendor Master
**API:** `POST /vendors`

Tasks:
- [ ] UI: เลขภาษี, Rebate Category, ธนาคาร
- [ ] Logic: เลขภาษีซ้ำ → Block

#### Location & Bin
**API:** `POST /locations`, `POST /bins`

Tasks:
- [ ] UI: รหัสคลัง, ประเภท, ผู้รับผิดชอบ

#### Employee Master
**API:** `GET /employees`, `POST /employees`

Tasks:
- [ ] UI: รหัส, ทีม, Role, Skill, Commission Rate

---

## SECTION 3 — Phase 2: "Scale & Control"

> **เงื่อนไข:** Phase 1 UAT ผ่านก่อน

### 3.1 Step Discount / Bundle / Quota

> [COMMENT]

Tasks:
- [ ] UI: Step Discount ขั้นบันได (qty/amount threshold)
- [ ] UI: Bundle / Mix&Match
- [ ] UI: Quota / Limit ต่อลูกค้า
- [ ] Logic: SC9 รองรับ Step + Bundle

### 3.2 Credit Memo Request Flow

> [COMMENT]

**API:** `POST /salesCreditMemoRequests`, `POST /purchaseCreditMemos`

Tasks:
- [ ] UI: ขอ CN — เหตุผล + ไฟล์แนบ + Approval Flow
- [ ] Logic: AP CN ตัด Accrual อัตโนมัติ
- [ ] Logic: AR CN บังคับอ้างอิง Invoice

### 3.3 Service Center Basic (5 Steps)

> [COMMENT]

#### SV-1: Service Intake
**API:**
```
POST /serviceOrders
GET /itemLedgerEntries?serialNo=    → ตรวจ Warranty
```
Tasks:
- [ ] UI: SC1 + SC8 + SC7
- [ ] Logic: Document Type = Repair / Installation
- [ ] Logic: ตรวจ Warranty → In / Out / Release
- [ ] Logic: In Warranty → stamp Sales Quote No.

#### SV-2: Appointment & Assignment
**API:**
```
PATCH /serviceOrders/{id}/assign
GET /employees?role=technician&available=true
```
Tasks:
- [ ] UI: Date-Time Slot + ปฏิทินช่าง
- [ ] Logic: Technician Overlap → Block
- [ ] Logic: SC5 (อ้างอิง Service Intake)

#### SV-3: Parts Requisition & Work Order
**API:**
```
POST /salesOrders          → เปิด SO เพื่อเบิกอะไหล่
POST /salesShipments/{id}/post
POST /salesInvoices/{id}/post
```
Tasks:
- [ ] UI: SC2 + SC5
- [ ] Logic: เบิก → สร้าง SO → Sales Admin ทำต่อตาม Sales Flow
- [ ] Logic: พิมพ์ใบงานช่าง + ใบหยิบ + ใบแจ้งหนี้

#### SV-4: Technician Mobile
**API:**
```
POST /serviceOrders/{id}/start      → GPS + timestamp
POST /serviceOrders/{id}/complete   → Photos + GPS log
```
Tasks:
- [?] Mobile Platform (T1)
- [?] Offline Sync (T2)
- [ ] UI: รับงาน, GPS check-in/out, ถ่ายรูป, ลายเซ็นลูกค้า
- [ ] Logic: ช่างเห็นเฉพาะใบงานตัวเอง

#### SV-5: QA & Close Work Order
**API:**
```
POST /serviceOrders/{id}/close
POST /salesInvoices           → Out of Warranty
POST /purchaseInvoices        → ช่าง Outsource
```
Tasks:
- [ ] UI: QA Checklist — ต้องผ่าน **ทุกข้อ**
- [ ] Logic: In Warranty → เอกสารจ่ายค่าประกัน
- [?] ช่าง Outsource Process ตั้งหนี้ (B4)
- [ ] Logic: SLA met/miss → บันทึกผล

### 3.4 Claims Module

> [COMMENT]

#### CL-1: Claim Intake
**API:** `POST /serviceItems`, `GET /itemLedgerEntries?serialNo=`

Tasks:
- [ ] UI: SC1 + SC8 + SC5
- [ ] Logic: ตรวจ Warranty Date ก่อนรับเคลม

#### CL-2: Claim Verify
**API:** `PATCH /serviceItems/{id}/verify`

Tasks:
- [ ] UI: บันทึกผลตรวจ + ถ่ายรูป
- [ ] Logic: เปลี่ยน / ซ่อม / ปฏิเสธ

#### CL-3: Vendor Claim
**API:** `PATCH /serviceItems/{id}/claimVendor`

Tasks:
- [ ] UI: RMA + ติดตาม SLA countdown
- [ ] Logic: เกิน Response SLA → Auto-escalate + แจ้ง Purchasing

#### CL-4: Claim Close
**API:** `POST /purchaseCreditMemos` (Auto จาก Close)

Tasks:
- [ ] Logic: ปิดเคส → Finance เอกสาร AP CN / รับสินค้าทดแทน

### 3.5 Service Enhancements (เพิ่มเติม Phase 2)

> [COMMENT]

#### Customer Service Profile
**API:** `GET /customers/{id}`, `GET /serviceOrders?customerId=`, `GET /itemLedgerEntries?customerId=`

Tasks:
- [ ] UI: Tab "ประวัติลูกค้า" ใน Service Intake — แสดงประวัติซ่อมทั้งหมด + สินค้าที่ซื้อ + Warranty ที่เหลือ
- [ ] Logic: ดึงข้อมูล Serial ที่ลูกค้าเคยซื้อ → แสดงวันหมดประกัน

#### SLA Timer & Alert
**API:** `GET /serviceOrders/{id}` (SLA deadline field)

Tasks:
- [ ] UI: SLA Countdown Timer แสดงบนใบงาน + Queue Dashboard
- [ ] Logic: เกิน 80% SLA → Badge เหลือง, เกิน 100% → Badge แดง + Escalate อัตโนมัติไปยัง Supervisor
- [?] SLA แต่ละ Document Type กี่ชั่วโมง? (B9)

#### Service Dashboard
**API:** `GET /serviceOrders?status=&date=`, `GET /serviceOrders/summary`

Tasks:
- [ ] UI: KPI Cards — คิวค้าง, งานเสร็จวันนี้, First-Fix Rate, ยอดเคลม
- [ ] UI: Technician Utilization แยกช่าง/สาขา
- [ ] Logic: Filter ตาม Branch, Document Type, Technician

#### Mobile App — กลุ่ม A: Service Tech (เลื่อนขึ้นจาก Phase 4)
**API:**
```
GET /serviceOrders?assignedTo={employeeId}&date=today
POST /serviceOrders/{id}/start      → GPS + timestamp
POST /serviceOrders/{id}/complete   → Photos + GPS log + e-Signature
```
Tasks:
- [?] Platform: Native / PWA / Responsive Web? (T1)
- [?] Offline Mode strategy (T2)
- [ ] UI: คิวงานของช่างวันนี้ — Status / SLA Time / ที่อยู่ลูกค้า
- [ ] UI: GPS Check-in/out + บันทึก Timestamp
- [ ] UI: ถ่ายรูป Before/After + Upload
- [ ] UI: Scan Barcode เบิกอะไหล่
- [ ] UI: รับ e-Signature ลูกค้า (T8)
- [ ] Logic: ช่างเห็นเฉพาะงานที่ Assign ให้ตัวเอง

### 3.6 e-Tax Invoice (Thailand Compliance)

> [COMMENT]

#### e-Tax XML Generator
**API:** `GET /salesInvoices/{id}` → แปลงเป็น e-Tax XML

Tasks:
- [?] ตรวจสอบ BC365 Thailand Extension ก่อน (T9) — Standard ใช้ได้เลยหรือต้อง Custom?
- [ ] Logic: Post Invoice → trigger สร้าง XML ตาม RD Format อัตโนมัติ
- [ ] Logic: Validate XML structure ก่อน Sign

#### Digital Signature & RD Connector
Tasks:
- [ ] Setup Certificate จาก CA ที่ RD รับรอง
- [ ] Logic: Sign XML → ส่งไป RD API → รับ ACK กลับ
- [ ] Logic: ACK = Rejected → แจ้งเตือน + แสดงเหตุผล + Retry

#### e-Tax Status Tracker
Tasks:
- [ ] UI: แสดงสถานะต่อ Invoice — Pending / Sent / Accepted / Rejected
- [ ] UI: Rejected list + ปุ่ม Retry

#### WHT Certificate (e-Format)
Tasks:
- [ ] Logic: Auto-calc WHT ตาม Income Type (ง.ด.3 / ง.ด.53)
- [ ] UI: Export PDF + XML ตาม RD Standard
- [?] รูปแบบ WHT Certificate (B10)

### 3.7 Bank Reconciliation

> [COMMENT]

**API:**
```
POST /bankAccounts/{id}/importStatement
GET /bankAccountLedgerEntries
POST /bankAccounts/{id}/reconcile
```
Tasks:
- [ ] UI: Import Statement + Auto-Match + รายการไม่ Match
- [?] Tolerance ± วัน/บาท (B8)
- [ ] Logic: ไม่ Match → ระบุเหตุผลก่อน Post

### 3.6 Accrual Report

**API:** `GET /accrualEntries?vendorId=&period=`

Tasks:
- [ ] UI: Accrued vs Settled แยก Vendor/Brand/Period
- [ ] Logic: Threshold Alert → ยอดถึง X% → แจ้ง Purchasing

---

## SECTION 4 — Phase 3: "Automate & Optimize"

> **เงื่อนไข:** Phase 2 Stable

### 4.1 Finance Full

> [COMMENT]

#### General Journal (JV)
**API:**
```
POST /generalJournals
POST /generalJournals/{id}/post
POST /generalJournals/{id}/reverse
```
Tasks:
- [ ] UI: Maker-Checker — Maker ≠ Approver
- [ ] Logic: Accrual Reversal Date → Alert + Auto-Reverse
- [ ] Logic: Period Lock — Block Post ย้อนหลัง

#### Fixed Asset
**API:** `POST /fixedAssets`, `POST /fixedAssets/{id}/depreciate`, `POST /fixedAssets/{id}/dispose`

Tasks:
- [ ] UI: สร้าง / คิดค่าเสื่อม / ขาย / ทำลาย

#### Close Period / Year
**API:** `POST /accountingPeriods/{id}/close`

Tasks:
- [ ] UI: Checklist ก่อนปิดงวด — ทุกข้อ Pass ก่อนปิดได้
- [ ] Logic: Admin Only | Lock แล้ว Unlock ไม่ได้

#### VAT Report
**API:** `GET /vatEntries?period=`

Tasks:
- [ ] UI: Export ภ.พ.30 / ภ.พ.36 แยกงวด/สาขา

### 4.2 Promotion Full

> [COMMENT]

Tasks:
- [ ] UI: Conflict Rules Editor — ตั้ง Priority แบบ Visual
- [ ] Logic: Auto AP Credit Memo เมื่อ Accrual Claimed + Approved
- [ ] SC9: Step + Bundle + Quota ครบ

### 4.3 Service — Technician Performance & Customer Notification

> [COMMENT]

#### Technician Performance Report
**API:** `GET /serviceOrders?assignedTo=&period=`

Tasks:
- [ ] UI: รายงานช่างแต่ละคน — งานต่อวัน, เวลาเฉลี่ย, First-Fix Rate, SLA met/miss
- [ ] Logic: คำนวณ Job Incentive → ส่งข้อมูลกลับ BC (Employee Ledger)
- [ ] UI: เปรียบเทียบช่างในทีม + แยกสาขา

#### Customer Notification
**API:** SMS/LINE Notify External API

Tasks:
- [?] Provider: SMS Gateway หรือ LINE Notify? (T11)
- [ ] Logic: Status Change → Trigger Notification อัตโนมัติ
  - รับเรื่องแล้ว → "เราได้รับงานของคุณแล้ว รหัส: XXXX"
  - Assigned → "ช่าง [ชื่อ] จะไปหาคุณวันที่ [วัน] เวลา [เวลา]"
  - Completed → "งานเสร็จแล้ว กรุณาติดต่อรับสินค้า"
- [ ] UI: ตั้งค่า Template แจ้งเตือนในแต่ละ Status

### 4.4 Marketplace / Online Channel

> [COMMENT]

#### SKU Mapping Manager
Tasks:
- [ ] UI: ตาราง Map SKU Marketplace ↔ BC Item Code (Shopee, Lazada)
- [ ] Logic: ถ้า SKU ไม่ match → Alert + หยุดสร้าง SO จนกว่าจะ Map

#### Order Inbox
**API:** Shopee Open API / Lazada Open Platform API → Webhook/Polling

Tasks:
- [?] Partner Account และ Production Key พร้อมหรือยัง? (T10)
- [ ] UI: Order Inbox แยก Tab ตาม Platform + สถานะ (New / Processing / Shipped)
- [ ] Logic: Polling ทุก 5 นาที หรือ Webhook (แล้วแต่ Platform)
- [ ] Logic: Auto-create SO ใน BC ตาม mapping — Document Group = "Online", Channel = [Shopee/Lazada]
- [ ] Logic: สต็อกไม่พอ → Auto-cancel order + แจ้ง Platform + แจ้ง Sales Admin

#### Stock Sync
**API:** Push ไป Shopee/Lazada API เมื่อ Item Ledger เปลี่ยน

Tasks:
- [?] Sync แบบ Real-time หรือ Batch? (T12)
- [ ] Logic: เมื่อ Post GRN หรือ Shipment → Push สต็อกล่าสุดไป Marketplace
- [ ] Logic: สต็อก = 0 → Update ให้ Marketplace ปิดรับออเดอร์อัตโนมัติ

#### Shipping Tracking Update
Tasks:
- [ ] Logic: Post Shipment → รับ Tracking Number → ส่งกลับ Marketplace API อัตโนมัติ
- [ ] UI: แสดง Tracking Number ใน Order Inbox

### 4.3 Real-time & Infrastructure

> [COMMENT]

Tasks:
- [ ] WebSocket แทน Poll ใน SC7
- [ ] API Error Log Dashboard — Timestamp / Endpoint / Retry / Resolve
- [ ] Health Check — BC365 Connection Status
- [ ] Retry Queue — Auto-retry เมื่อ BC กลับมา

---

## SECTION 5 — Phase 4: "Optimize"

> **เงื่อนไข:** Phase 3 Stable

### 5.1 Trade-in Engine

> [COMMENT]

**API:** Custom Extension — `POST /tradeInOrders`

Tasks:
- [ ] UI: รับสินค้าเก่า + ประเมินราคา + หักลบในบิลขาย
- [ ] Logic: Return Order + Credit Entry อัตโนมัติ

### 5.2 Promotion Simulator

> [COMMENT]

Tasks:
- [ ] UI: ทดสอบโปรกับ Order จำลองก่อน Publish
- [ ] Logic: แสดง Projected Revenue / Cost impact

### 5.3 Advanced Service SLA Dashboard

> [COMMENT]

Tasks:
- [ ] UI: SLA met/miss rate แยก Technician/Type/Branch
- [ ] Logic: SLA Escalation Automation หลายชั้น

### 5.4 Mobile Mature — กลุ่ม B: ผู้บริหาร / Sales

> [COMMENT]

Tasks:
- [ ] Offline Sync: ทำงานได้ไม่มีสัญญาณ + Sync อัตโนมัติเมื่อออนไลน์
- [?] Platform สุดท้าย (T1, T2)
- [ ] UI: Executive Dashboard Mobile — ยอดขาย/สาขา/พนักงาน Real-time
- [ ] UI: Approve ข้ามโมดูล — Credit Limit, Discount พิเศษ, Transfer Request
- [ ] UI: Quick Stock Lookup — ดูสต็อกสินค้า/คลัง
- [ ] Logic: Push Notification สำหรับเอกสารรอ Approve

### 5.5 Marketplace Dashboard

> [COMMENT]

Tasks:
- [ ] UI: Dashboard รวม — ยอดขายแยก Platform (Shopee/Lazada/LINE)
- [ ] UI: สินค้า Top-Seller แยก Channel + Pending Orders
- [ ] UI: รายงาน Revenue vs Return แยก Marketplace
- [ ] Logic: เปรียบเทียบ Online vs Offline ยอดขาย

### 5.6 PDPA Framework

> [COMMENT]

> **หมายเหตุ:** Audit Log (SC7) และ No Sensitive Data in Log ต้องทำตั้งแต่ Phase 1

Tasks:
- [ ] UI: Consent Management — บันทึก/ถอน Consent ลูกค้า
- [ ] UI: Data Subject Rights — ลูกค้าขอดู/แก้ไข/ลบข้อมูล
- [ ] Logic: Data Breach Notification Flow — แจ้งผู้บริหาร + DPO อัตโนมัติ
- [ ] Logic: Data Retention Policy — Auto-archive ข้อมูลเมื่อครบกำหนด

### 5.7 BI / KPI Dashboard

> [COMMENT]

Tasks:
- [ ] Sales KPI: ยอด/พนักงาน/สาขา/ช่องทาง, Promo Usage, Commission
- [ ] Warehouse KPI: Stock Accuracy, Lead Time, Serial Error Rate
- [ ] Service KPI: SLA Rate, Technician Efficiency, Claim Resolution Time
- [ ] Finance KPI: AR/AP Aging, Accrued vs Settled, Cash Flow
- [ ] Online Channel KPI: ยอดขาย Marketplace แยก Platform, Return Rate

---

## SECTION 6 — RBAC Matrix

> [COMMENT]

| Action | Sales | Sales Admin | WH Staff | WH Super | Purchaser | SV Tech | SV Admin | AR | AP | Fin Mgr | Price Admin | Master Admin | Approver | Auditor | Admin |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| เปิดบิล/Quote/Reservation | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - | - | - | ✓ |
| Post Invoice | - | ✓ | - | - | - | - | - | - | - | ✓ | - | - | - | - | ✓ |
| อนุมัติวงเงิน/ส่วนลดพิเศษ | - | - | - | - | - | - | - | - | - | - | - | - | ✓ | - | ✓ |
| รับสินค้า GRN | - | - | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - | ✓ |
| อนุมัติ Transfer Request | - | - | - | ✓ | - | - | - | - | - | - | - | - | ✓ | - | ✓ |
| Direct Transfer | - | - | - | ✓ | - | - | - | - | - | - | - | - | - | - | ✓ |
| ยิง Serial | - | - | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - | ✓ |
| สร้าง / อนุมัติ PO | - | - | - | - | ✓ | - | - | - | - | - | - | - | ✓ | - | ✓ |
| ตั้งหนี้ AP Invoice | - | - | - | - | ✓ | - | - | - | ✓ | ✓ | - | - | - | - | ✓ |
| รับเงิน / ออกใบเสร็จ | - | - | - | - | - | - | - | ✓ | - | ✓ | - | - | - | - | ✓ |
| จ่ายเงิน Vendor | - | - | - | - | - | - | - | - | ✓ | ✓ | - | - | - | - | ✓ |
| บันทึก JV (Maker) | - | - | - | - | - | - | - | ✓ | ✓ | ✓ | - | - | - | - | ✓ |
| อนุมัติ JV (Checker) | - | - | - | - | - | - | - | - | - | ✓ | - | - | ✓ | - | ✓ |
| ปิดงวด / ปิดปี | - | - | - | - | - | - | - | - | - | - | - | - | - | - | ✓ |
| รับเรื่องบริการ / นัดหมาย | - | ✓ | - | - | - | - | ✓ | - | - | - | - | - | - | - | ✓ |
| รับงาน / ทำงาน Mobile | - | - | - | - | - | ✓ | - | - | - | - | - | - | - | - | ✓ |
| QA / ปิดงาน | - | - | - | - | - | - | ✓ | - | - | - | - | - | ✓ | - | ✓ |
| สร้าง / อนุมัติ Price List | - | - | - | - | - | - | - | - | - | - | ✓ | - | ✓ | - | ✓ |
| สร้าง Master (Draft) | - | - | - | - | - | - | - | - | - | - | - | ✓ | - | - | ✓ |
| อนุมัติ Master | - | - | - | - | - | - | - | - | - | - | - | - | ✓ | - | ✓ |
| ดูทุกอย่าง (Read-only) | - | - | - | - | - | - | - | - | - | - | - | - | - | ✓ | ✓ |

**Field-Level Rules:**
- ราคาต้นทุน → Sales Staff: ซ่อน
- วงเงินเครดิต → Sales Staff: อ่านอย่างเดียว
- WHT Rate → Finance เท่านั้นแก้ได้

---

## SECTION 7 — UAT Checklist

> [COMMENT]

### Phase 1

**Sales:**
- [ ] เปิดบิลจาก Quote → auto-fill ครบ
- [ ] เปิดบิลจาก Reservation → ตรวจจำนวน / หมดอายุ
- [ ] หักมัดจำ Deposit ที่ผูกลูกค้าถูกต้อง
- [ ] ราคาดึงตามกลุ่มลูกค้า + วันที่ออกบิล
- [ ] เกินวงเงิน → Block + ApprovalBanner
- [ ] Serial ไม่บังคับตอนขาย

**Warehouse:**
- [ ] GRN รับจาก PO — Qty Match / เกิน → Warning
- [ ] ยิง Serial ซ้ำ → Block ทันที
- [ ] Transfer Request → Approve → Transfer Order → Received ครบ
- [ ] Direct Transfer เฉพาะ Supervisor
- [ ] Stock Count Blind Mode → ส่วนต่างแสดงหลัง Submit

**Purchase:**
- [ ] PR → PO → GRN → AP Invoice ครบ Flow
- [ ] 3-Way Match ราคาเกิน Tolerance → Block Post
- [ ] Vendor ใหม่: Maker-Checker ผ่านก่อนใช้ได้
- [ ] Accrual Entry สร้างอัตโนมัติหลัง Post GRN

**Price:**
- [ ] Price List Active ตามช่วงเวลา + กลุ่มลูกค้า
- [ ] Overlap Alert ก่อน Approve
- [ ] Invoice ดึงราคาจาก Active Price List

**Finance:**
- [ ] รับเงิน → Apply Invoice → AR ลดถูกต้อง
- [ ] จ่ายเงิน → WHT Auto-calc
- [ ] AR Aging แสดงถูกต้องทุก Bucket

### Phase 2

- [ ] Service 5 Steps ครบ Flow (SV-1 → SV-5)
- [ ] QA Checklist: ข้อเดียวล้มเหลว → Block ปิดงาน
- [ ] Claim Flow: รับเรื่อง → ส่ง Vendor → ปิดเคส → AP CN
- [ ] SLA Alert: เกิน Deadline → Badge แดง + Escalate
- [ ] Step Discount / Bundle คำนวณถูกต้อง
- [ ] Bank Recon: Auto-Match + Post

### Phase 3

- [ ] JV Maker ≠ Checker — Block ถ้า Approve ตัวเอง
- [ ] Period Lock: ห้าม Post ย้อนหลัง
- [ ] Close Period Checklist: ทุกข้อ Pass ก่อนปิดได้
- [ ] Accrual Reversal Alert เมื่อถึงวันกำหนด
- [ ] Auto AP CN จาก Accrual Claim

---

## SECTION 8 — Risk Register

> [COMMENT]

| Risk | ระดับ | Phase | Mitigation |
|---|---|---|---|
| BC Extension ล่าช้า | สูง | P1 | Spec Extension พร้อมกับ Frontend ทันที |
| Master Data ไม่พร้อม Go-Live | สูง | P1 | Dry-Run Sandbox ก่อน 2 สัปดาห์ |
| Promotion Conflict Rule ไม่ชัด | กลาง | P1 | Lock Rule ก่อน Start SC9 |
| Performance SC9 (200 lines) | กลาง | P1 | Load Test ก่อน UAT |
| Mobile Offline Sync ซับซ้อน | สูง | P2 | PoC Offline-first ก่อน Start SV-4 |
| SLA Rule ยังไม่กำหนด | กลาง | P2 | Lock SLA Config ก่อน Start SV-1 |
| WHT Certificate format | ต่ำ | P1 | ยืนยัน format กับ Finance ก่อน Build |
| User ไม่คุ้นระบบใหม่ | กลาง | P1 | Pilot 1 สาขาก่อน Rollout |

---

## Approval Status

| Section | Phase | Status | Approved by | Date |
|---|---|---|---|---|
| 0 — Pre-conditions | All | ⏳ รอ | — | — |
| 1 — Shared Components | All | ⏳ รอ | — | — |
| 2.1 Sales | P1 | ⏳ รอ | — | — |
| 2.2 Warehouse | P1 | ⏳ รอ | — | — |
| 2.3 Purchase | P1 | ⏳ รอ | — | — |
| 2.4 Price P1 | P1 | ⏳ รอ | — | — |
| 2.5 Finance Basic | P1 | ⏳ รอ | — | — |
| 2.6 Master P1 | P1 | ⏳ รอ | — | — |
| 3 — Phase 2 | P2 | ⏳ รอ | — | — |
| 4 — Phase 3 | P3 | ⏳ รอ | — | — |
| 5 — Phase 4 | P4 | ⏳ รอ | — | — |
| 6 — RBAC Matrix | All | ⏳ รอ | — | — |
| 7 — UAT Checklist | All | ⏳ รอ | — | — |
| 8 — Risk Register | All | ⏳ รอ | — | — |

---

_แก้ไขไฟล์นี้โดยตรง → พิมพ์ [COMMENT] ลงในส่วนที่ต้องการ → ส่งกลับให้ AI อัปเดต_
_วนซ้ำจนทุก Section = Approved → สั่ง "implement it all"_
