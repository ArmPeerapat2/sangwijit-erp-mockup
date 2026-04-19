# research.md — Sangwijit ERP Web Portal × Dynamics 365 BC
**Source of Truth | อ่านไฟล์นี้ก่อนทำงานทุกครั้ง**
_Last updated: 2026-02-22 | Version 1.0_

---

## 0. วิธีใช้ไฟล์นี้

```
ก่อนทำงานใด ๆ → อ่าน Section 1–4 ให้จบ
ก่อนออกแบบหน้าจอ → อ่าน Section 3 (Modules) + Section 5 (Shared Components)
ก่อนเขียน API → อ่าน Section 6 (BC365 Integration)
ก่อนวางแผน → อ่าน Section 7 (Open Questions) ก่อนเสมอ
```

---

## 1. Project Overview

| รายการ | รายละเอียด |
|---|---|
| **ชื่อโปรเจก** | Sangwijit Operation Web Portal |
| **เป้าหมาย** | Web Portal เชื่อม Dynamics 365 Business Central ผ่าน API |
| **ธุรกิจ** | เครื่องใช้ไฟฟ้า — ค้าส่ง ค้าปลีก ออนไลน์ ส่งออก |
| **ระบบเดิม** | HERO / TPM Hero (Legacy) → กำลัง Migrate |
| **Backend** | Dynamics 365 Business Central (System of Record) |
| **Frontend** | Web Portal (React/Vue + Tailwind CSS) |
| **กลยุทธ์ License** | ใช้ Service Account เดียวเรียก BC API — ลด User License |
| **ภาษา** | Bilingual: ไทย (หลัก) + English (field names/technical) |

### แผนกที่เกี่ยวข้อง
| แผนก | ใช้โมดูล |
|---|---|
| ขายส่ง / ขายปลีก | Sales |
| ส่งออก / ออนไลน์ | Sales (ช่องทางพิเศษ) |
| คลัง | Warehouse |
| บัญชี | Finance |
| ศูนย์บริการ | Service + Claims |
| บุคคล | Master (Employee) |
| จัดซื้อ | Purchase |
| สินเชื่อ | ไม่ได้ใช้ระบบ (Out of Scope) |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────┐
│                  WEB PORTAL                     │
│  (React/Vue · Tailwind · Shared Components)     │
│                                                 │
│  Sales │ WH │ Purchase │ Service │ Finance │... │
└──────────────────────┬──────────────────────────┘
                       │ REST API (Service Account)
                       │ debounce / retry / queue
┌──────────────────────▼──────────────────────────┐
│           DYNAMICS 365 BUSINESS CENTRAL         │
│   (System of Record — บัญชี / Ledger / Post)    │
│                                                 │
│  Standard BC + Custom Extension (Promo/Accrual) │
└─────────────────────────────────────────────────┘
```

### หลักการสำคัญ
- **Portal = Front** → รับ Input, Validate, แสดงผล, จัดการ Workflow
- **BC365 = Back** → Post บัญชี, สร้าง Ledger Entry, System of Record
- **Portal ไม่เก็บข้อมูลถาวร** → ทุกอย่าง Sync กับ BC ผ่าน API
- **Retry/Queue** → ถ้า BC ช้าหรือล่ม Portal ต้องทำ Retry และมี Job sync กลางคืน

### Flow Legend (จาก PDF ของ Developer)
| เส้น | ความหมาย |
|---|---|
| → เส้นทึบ | กระบวนการทำงาน (Happy Path) |
| - - → เส้นประ | การส่งข้อมูลผ่าน API |
| - - → สีแดง | Process ที่ไม่ทราบแน่ชัด ณ ปัจจุบัน **(ต้องหารือ)** |
| …→ เส้นจุด | Process Auto ที่ระบบทำรายการ |

---

## 3. Modules — สรุปทุกโมดูล

### 3.1 Sales (งานขาย)

**เอกสารที่ออกได้:**
| เอกสาร | BC Entity | หมายเหตุ |
|---|---|---|
| Sales Quote (ใบเสนอราคา) | salesQuotes | Status: Open → Pending Approval → Approved |
| Sales Order / ใบจอง | salesOrders | แยก Document Number ขายปลีก vs ขายส่ง |
| Item Reservation (จองสินค้า) | Reservation (Sales Line) | ผูกกับ SO — กันสต็อก Real-time |
| Deposit / มัดจำ | Customer Ledger Entry | หักได้เฉพาะมัดจำที่ผูกลูกค้าและยังไม่ถูกใช้ |
| Sales Invoice | salesInvoices | ต้องผ่าน Shipment ก่อน Post |
| Sales Shipment | transferOrders / warehouseRequests | ตัดสต็อกผ่าน Shipment — Serial ยิงที่คลัง |
| Sales Credit Memo (ใบลดหนี้) | salesCreditMemos | บังคับอ้างอิง Invoice ต้นฉบับ |

**Business Rules สำคัญ:**
- Quote → Invoice: ดึงราคาตามวันที่ออก Invoice (หรือ Lock Price ถ้าเปิด Policy)
- Reservation → Invoice: ห้ามออกบิลเกินจำนวนจอง / หมดอายุจอง
- Serial: **ไม่บังคับตอนขาย** — **บังคับตอนคลังเบิก/จัดส่ง**
- เครดิต: ถ้ายอดเกินวงเงิน → ต้องส่ง Approver ก่อนออกใบกำกับ
- ภาษี: รองรับออกใบกำกับบางบรรทัด (ไม่บังคับออกทุกบรรทัด)

**Status Flow:**
```
Draft → Pending Approval (ถ้ามี) → Confirmed → Posted
```

**Roles:**
- Sales Staff: สร้าง/แก้ Draft, ดึง Quote/Reservation, ผูกมัดจำ, ส่งอนุมัติ
- Approver: อนุมัติเครดิต/ส่วนลด/ราคาพิเศษ
- Warehouse: เห็นคิวรอเบิก, ยิง Serial ตอนเบิก
- Finance/AR: รับชำระ, บันทึกมัดจำ/หักมัดจำ, ออกใบกำกับ

---

### 3.2 Warehouse (คลังสินค้า)

**เอกสารหลัก:**
| เอกสาร | Flow |
|---|---|
| GRN (รับสินค้า) | จาก PO หรือ Transfer — ระบุจำนวนจริง + ยิง Serial |
| Transfer Request (คำขอโอน) | Staff สร้าง → Supervisor อนุมัติ → สร้าง Transfer Order |
| Transfer Order (โอนสินค้า) | Direct (สิทธิ์พิเศษ) หรืออ้างอิง Request — Partial ได้ |
| Sales Issue (เบิกตามบิลขาย) | รับงานจาก SO อัตโนมัติ — กันสต็อกทันที — ยิง Serial ก่อนจ่าย |
| Serial Entry หลังบิล | ใส่ Serial ภายหลัง — Batch scan / upload CSV |
| Stock Count (ตรวจนับ) | Blind Count (ซ่อนยอดระบบ) — Post Adjustment ต้องอนุมัติ |

**Business Rules สำคัญ:**
- ยิง Serial → Validate ซ้ำ Real-time ทั้ง Session + BC365 พร้อมกัน
- GRN เกินจำนวน PO → Warning + ต้องยืนยัน Supervisor
- Transfer โดยไม่มี Request → เฉพาะ WH Supervisor เท่านั้น
- QC Hold → Block เบิก/โอนทุกกรณี
- เมื่อ Shipped → สร้างคิว Pending Receipt ที่คลังปลายทางอัตโนมัติ

**Status Flow:**
```
Request → Approved → Shipped → Pending Receipt → Received → Posted
```

---

### 3.3 Purchase (จัดซื้อ)

**เอกสารหลัก:**
```
PR (ใบขอซื้อ) → RFQ (เสนอราคา) → PO → GRN → AP Invoice → Payment
```

**Business Rules สำคัญ:**
- 3-Way Match: PO qty / GRN qty / Invoice qty ต้องตรง — Block Post ถ้า Fail
- ราคา PO ต่างจาก Purchase Price List > 5% → Alert สีส้ม ต้องยืนยัน Buyer
- Vendor ใหม่: Draft → Review → Approved ก่อนใช้งาน (Maker-Checker)
- Accrual Auto-Hook: Post GRN ที่ผูก Promotion → สร้าง Accrual Entry อัตโนมัติ
- เลขผู้เสียภาษี Vendor ซ้ำ → Block สร้าง Vendor ใหม่

**Status Flow:**
```
PR: Draft → Submitted → Approved → Converted
PO: Draft → Approval → Released → Partially/Fully Received → Closed
AP Invoice: Draft → Matched → Approved → Posted → Paid
Promo/Accrual: Planned → Live → Accruing → Claimed → Settled
```

---

### 3.4 Service Center (ศูนย์บริการ) — 5 ขั้นตอน

**5-Step Service Flow:**
| Step | หน้าจอ (PDF) | สิ่งที่เกิด |
|---|---|---|
| SV-1 | Service Intake (Repair/Installation) | รับเรื่อง, เช็ค Warranty ผ่าน Serial + Item Ledger |
| SV-2 | Appointment & Assignment | นัดหมาย Date-Time, มอบหมายช่าง (ตรวจ Overlap) |
| SV-3 | Parts Requisition & Work Order | เบิกอะไหล่ → สร้าง Sales Order → Post Shipment/Invoice |
| SV-4 | Technician Mobile (Work Order) | รับงาน, GPS check-in/out, ถ่ายรูป, ลายเซ็นลูกค้า |
| SV-5 | QA & Close Work Order | ตรวจรับงาน QA Checklist → ปิดงาน → เอกสาร Finance |

**Document Types:** Repair | Installation
**Warranty Status:** In Warranty | Out of Warranty | Release

**Business Rules สำคัญ:**
- SLA Auto-Alert: เกิน SLA Deadline → Badge แดง + Escalate Supervisor
- QA Checklist: ต้องผ่าน **ทุกข้อ** ก่อนปิดงาน — ล้มเหลวแม้ข้อเดียว Block ปิดงาน
- ช่างเห็นเฉพาะใบงานตัวเอง
- การเบิกอะไหล่ผ่าน Sales Order → Sales Admin ทำ Process ต่อตาม Sales Flow
- ปิดงาน: Warranty = In Warranty → ต้องออกเอกสารจ่าย (เงินค่าจ้าง/ค่าประกันรายปี)
- ปิดงาน: ช่าง Outsource → แจ้งบัญชีเพื่อตั้งหนี้

**Status Flow:**
```
Open → Assigned → InProgress → WaitingParts → Completed → Closed
```

**Service Enhancements (เพิ่มเติม — เปรียบเทียบ Reference ERP):**

| Feature | รายละเอียด | Phase |
|---|---|---|
| **Customer Service Profile** | ดูประวัติการซ่อมทั้งหมดของลูกค้า, สินค้าที่ซื้อ + warranty ที่เหลือ | Phase 2 |
| **SLA Timer & Alert** | นับเวลาตั้งแต่รับเรื่อง → Badge แดงเมื่อใกล้เกิน SLA → Escalate อัตโนมัติ | Phase 2 |
| **Service Dashboard** | คิวงานค้าง, First-Fix Rate, ยอดเคลม, Technician Utilization แยกสาขา | Phase 2 |
| **Technician Performance** | งานต่อวัน, เวลาเฉลี่ยต่องาน, ค่าแรง Job Incentive ผูก Employee | Phase 3 |
| **Customer Notification** | SMS/LINE Notify แจ้งสถานะ (รับแล้ว / กำลังซ่อม / เสร็จแล้ว / นัดส่ง) | Phase 3 |

---

### 3.5 Claims (เคลม)

**4-Step Claim Flow:**
```
รับเรื่อง (CL-1) → ตรวจสอบ Defect (CL-2) → ส่งเคลม Vendor (CL-3) → ปิดเคส (CL-4)
```

**ประเภทเคลม:** DOA | In Warranty | Out of Warranty | Goodwill

**Business Rules:**
- Warranty Check: ตรวจ Serial กับ itemLedger — แสดงวันซื้อ + วันหมดประกัน
- ส่ง Vendor แล้วเกิน Response SLA → Auto-escalate + แจ้ง Purchasing
- ปิดเคส → เชื่อม Finance สร้างเอกสาร AP CN อัตโนมัติ

**Status Flow:**
```
Received → Verified → Sent to Supplier → Responded → Closed
```

---

### 3.6 Finance & Accounting

**เอกสารหลัก:**
| กลุ่ม | เอกสาร |
|---|---|
| AR | รับเงิน, ลูกหนี้ Aging, AR Credit Memo |
| AP | จ่ายเงิน + WHT, เจ้าหนี้, AP Credit Memo |
| Journal | JV ทั่วไป, Accrual, Reversal |
| Bank | กระทบยอดธนาคาร (Import Statement + Auto-Match) |
| Fixed Asset | สร้าง, คิดค่าเสื่อม, ขาย, ทำลาย |
| Period | ปิดงวด, ปิดปี |
| Tax | VAT Report (ภ.พ.30), WHT Certificate |

**Business Rules สำคัญ:**
- Maker-Checker: JV ทุกประเภท — Maker ไม่สามารถ Approve งานตัวเองได้
- Period Lock: ห้าม Post ย้อนหลังใน Period ที่ปิดแล้ว
- AR CN / AP CN: บังคับอ้างอิง Invoice ต้นฉบับ — ห้ามออก CN ลอย
- Auto WHT: คำนวณอัตโนมัติตาม Income Type เมื่อเลือก Payment Type
- Bank Recon: Auto-Match ตาม Amount + Date ± 3 วัน
- Accrual Reversal Alert: เมื่อถึงวันกำหนด Reverse → แจ้งเตือน + Email

**Status Flow:**
```
Draft → Reviewed → Approved → Posted/Reconciled
```

---

### 3.7 Promotion & Price Setting

**เฟส 1 (ทำก่อน):**
- Time-bound Price List, Basic Discount/Free Item, Price Alert, Sale-out Hook (Accrual)
- แบ่งกลุ่มราคา: พนักงาน / สาขา / ลูกค้า, Commission PC

**เฟส 2:**
- Step Discount, Bundle/Mix&Match, Quota/Limit, Conflict Rules

**เฟส 3:**
- Trade-in, Simulator, Auto AP Credit Memo

**Business Rules สำคัญ:**
- Promotion Priority Conflict: Priority สูงสุด Win — ไม่ Stack โปร (ยกเว้นกำหนดชัดเจน)
- Price List Overlap: กลุ่มลูกค้าเดียวกัน, ช่วงเวลาซ้อน → Warning ก่อน Approve
- Accrual Threshold Alert: ยอดสะสมถึง X% ของเป้า → แจ้ง Purchasing เตรียม Claim

**Status Flow:**
```
Draft → Review → Approved → Scheduled → Live → Paused/Expired
Accrual: Planned → Accruing → Claimed → Settled
```

---

### 3.8 Master Config

**Master Data ทั้งหมด:**
| Master | BC Entity | Workflow |
|---|---|---|
| Item | items | Draft → Review → Approved → Active/Inactive |
| Customer | customers | Draft → Review → Approved → Active |
| Vendor | vendors | Draft → Review → Approved → Active |
| Location & Bin | locations, bins | Draft → Review → Active |
| Employee | employees | Draft → Review → Active |
| Price List | priceLists | Draft → Review → Approved → Active |
| Tax / Payment / WHT | vatEntries, paymentTerms | Draft → Review → Active |

**กฎสำคัญ:**
- **ห้าม Delete** Master ที่มีการอ้างอิง → เปลี่ยนเป็น Deprecated แทน
- **No Delete Policy**: ยังอ้างอิงย้อนหลังได้หลัง Deprecated
- Maker-Checker ทุก Master Type
- Block = Yes → ไม่สามารถทำ Transaction ได้ (Customer/Vendor/Item)

---

### 3.9 HRM / Payroll — Framework Integration (Portal Layer Only)

> **หมายเหตุ:** ไม่สร้าง HR UI เอง — ใช้ BC365 HR Module เป็น Backend, Portal เชื่อมเฉพาะจุดที่จำเป็น

| Integration Point | รายละเอียด | ใช้ใน Module | Phase |
|---|---|---|---|
| **Employee Directory** | ดึง Employee List จาก BC → ใช้ assign ช่าง/พนักงานขาย | Service, Sales | Phase 1 |
| **Leave Status** | ดึงวันลา/วันหยุดพนักงาน → ใช้ในการ schedule ช่าง | Service SV-2 | Phase 2 |
| **Commission Hook** | ผูก Sales Invoice → Employee ID → ส่งข้อมูลกลับ BC สำหรับคำนวณ commission | Sales, Promo | Phase 2 |
| **Skill/Role Tag** | Filter ช่างตาม Skill (ติดตั้ง / ซ่อม / แอร์) | Service SV-2 | Phase 2 |

**BC365 API ที่ใช้:**
```
GET /employees?role=technician&available=true    → รายชื่อช่างว่าง
GET /employees/{id}/leaveEntries?date=           → ตรวจวันลา
GET /employees/{id}                              → ข้อมูล + Skill Tag
```

---

### 3.10 Mobile App — 2 กลุ่มผู้ใช้

**กลุ่ม A — ช่างบริการ (Service Tech) — ควรขึ้น Phase 2**

| Feature | รายละเอียด |
|---|---|
| คิวงาน | ดูใบงานที่ assign ให้ตัวเอง แยกวัน/สถานะ |
| อัพสถานะงาน | On the way / เริ่มงาน / รอชิ้นส่วน / เสร็จแล้ว |
| GPS Check-in/out | บันทึก Location + Timestamp ทุก Step |
| เบิกอะไหล่ | Scan Barcode → สร้าง Parts Requisition |
| ถ่ายรูป | Before/After Photo upload → ผูกกับ Work Order |
| รับ e-Signature | ลูกค้าเซ็นรับงานบนหน้าจอ |

**กลุ่ม B — ผู้บริหาร / Sales (Phase 3-4)**

| Feature | รายละเอียด |
|---|---|
| Dashboard KPI | ยอดขาย/สาขา/พนักงาน Real-time |
| อนุมัติเอกสาร | Approve Credit Limit, Discount พิเศษ, Transfer Request |
| ดูสต็อก | ตรวจสอบสินค้า/คลังแบบ Quick Lookup |

**Open Questions:**
- T1: Platform = Native App (iOS/Android) / PWA / Responsive Web?
- T2: Offline Mode สำหรับช่าง — Sync Strategy?

**Status Flow (Mobile Service):**
```
Receive Job → On the Way → GPS Check-in → In Progress → Complete (Photo + Sign) → Submit
```

---

### 3.11 e-Tax Invoice (XML) — Thailand Compliance (บังคับ)

> **สำคัญ:** พ.ร.บ. ระบบภาษีอิเล็กทรอนิกส์กำหนดให้ธุรกิจขนาดใหญ่ต้องออกใบกำกับภาษีอิเล็กทรอนิกส์ ต้องวางกรอบตั้งแต่ Phase 2

**Flow:**
```
Portal สร้าง Sales Invoice → BC Post → Portal สร้าง e-Tax XML → Digital Sign → ส่ง RD API → รับ ACK
```

| Component | รายละเอียด | Phase |
|---|---|---|
| **e-Tax XML Generator** | แปลง Sales Invoice → XML ตาม RD Format (e-Invoice v1.0) | Phase 2 |
| **Digital Signature** | Sign XML ด้วย Certificate จาก CA ที่ RD รับรอง | Phase 2 |
| **RD API Connector** | ส่ง XML → Revenue Dept Portal อัตโนมัติ, รับ ACK กลับ | Phase 2 |
| **e-Tax Status Tracker** | แสดงสถานะ: Pending / Sent / Accepted / Rejected + Retry | Phase 2 |
| **WHT Certificate (e-Format)** | ภ.ง.ด.3 / ภ.ง.ด.53 → export XML/PDF ตาม RD Standard | Phase 2-3 |
| **e-Filing Dashboard** | สรุปยอด VAT / WHT ที่ยื่นแล้ว, pending, rejected แยกงวด | Phase 3 |

**หมายเหตุ:** BC365 มี e-Invoice Extension สำหรับ Thailand อยู่แล้ว — ต้องตรวจก่อนว่า Standard ครอบคลุมหรือต้อง Custom (T5)

**Status Flow:**
```
Invoice Posted → XML Generated → Signed → Sent to RD → ACK Received (Accepted / Rejected)
```

---

### 3.12 Marketplace / Online Channel — POS-style Menu

> **แนวคิด:** เพิ่มเป็น Tab "ออนไลน์" ใน Sales Module ไม่แยกหน้า — รับ Order จาก Shopee/Lazada แล้ว map เป็น Sales Order ใน BC ตาม flow เดิม

**โครงสร้างเมนู Sales:**
```
Sales Module
├── ขายส่ง  (เดิม)
├── ขายปลีก (เดิม)
└── ออนไลน์ ← เมนูใหม่
    ├── Shopee
    ├── Lazada
    └── LINE Shopping (Future)
```

**Flow:**
```
Marketplace Webhook/Polling → Portal รับ Order → Auto Map SKU → สร้าง Sales Order ใน BC
     ↓
คลัง รับคิว → เบิก/จัดส่ง → Update Tracking กลับ Marketplace → Order Completed
```

| Feature | รายละเอียด | Phase |
|---|---|---|
| **Order Inbox** | รับ Order จาก Shopee/Lazada (Webhook หรือ Polling 5 นาที) | Phase 3 |
| **Auto SKU Mapping** | Map Product SKU Marketplace → BC Item Code | Phase 3 |
| **Auto Create SO** | สร้าง Sales Order ใน BC อัตโนมัติ กำหนด Channel = Online | Phase 3 |
| **Stock Sync** | อัพเดทสต็อก BC → Push ไป Marketplace ทุกครั้งที่สต็อกเปลี่ยน | Phase 3 |
| **Shipping Update** | รับ Tracking Number หลัง Post Shipment → ส่งกลับ Marketplace | Phase 3 |
| **Marketplace Dashboard** | ยอดขายแยก Platform, สินค้า Top-Seller, Pending Orders | Phase 4 |

**Business Rules:**
- Order จาก Marketplace → Document Group = "Online" ใน BC (แยก Number Series)
- Auto-cancel: ถ้าสต็อกไม่พอเมื่อรับ Order → แจ้ง Platform อัตโนมัติ + แจ้ง Sales Admin
- ราคา Marketplace ≠ Price List → ใช้ราคา Marketplace เป็น Override (ไม่ผ่าน SC9)

**หมายเหตุ:** ต้องสมัคร Shopee/Lazada Open API Partner ก่อน — ควรเริ่มกระบวนการตั้งแต่ Phase 1-2 เพื่อให้ได้ Production Key ทันใช้ Phase 3

**Status Flow:**
```
Received → Mapped → SO Created → WH Queued → Shipped → Tracking Updated → Completed
```

---

### 3.13 PDPA — กรอบเบื้องต้น (Phase 4)

> ต้องมี 2 อย่างตั้งแต่ Phase 1 เพื่อหลีกเลี่ยงปัญหาในภายหลัง:
> - **Audit Log** (SC7 Timeline) — บันทึก who/what/when ทุก action ✅ มีอยู่แล้ว
> - **ห้ามแสดงข้อมูล Sensitive** ในหน้า Log / Error Message

| Feature | Phase |
|---|---|
| Consent Management (รับ/ถอน consent ลูกค้า) | Phase 4 |
| Data Subject Rights — ขอดู/แก้ไข/ลบข้อมูล | Phase 4 |
| Data Breach Notification Flow | Phase 4 |
| Data Retention Policy — Auto-archive หลัง X ปี | Phase 4 |

---

## 4. Document Status Summary (ทุกโมดูล)

```
Sales:      Draft → Pending Approval → Confirmed → Posted
Warehouse:  Request → Approved → Shipped → Pending Receipt → Received → Posted
Purchase:   Draft → Approved → Released → Received → Posted → Paid
Service:    Open → Assigned → InProgress → WaitingParts → Completed → Closed
Claims:     Received → Verified → Sent → Responded → Closed
Finance:    Draft → Reviewed → Approved → Posted/Reconciled
Price/Promo: Draft → Review → Approved → Scheduled → Live → Expired
Master:     Draft → Review → Approved → Active → Deprecated → Archived
Accrual:    Planned → Accruing → Claimed → Settled
```

---

## 5. Shared Components (SC1–SC9)

> **กฎ:** Dev ต้องเรียก Shared Component แทนการเขียนซ้ำ

| # | ชื่อ Component | ใช้ใน | พฤติกรรมสำคัญ |
|---|---|---|---|
| SC1 | SharedCustomerSearch | Sales, Service, Finance | Real-time ≥ 2 ตัวอักษร, แสดง Credit Status, Quick-Create Draft |
| SC2 | SharedItemSearch | Sales, WH, Purchase, Service | ค้นหาสินค้า + สต็อก Real-time แยกคลัง + ราคาตามกลุ่มลูกค้า |
| SC3 | SharedPaymentPanel | Sales, Purchase, Finance | Multi-method, เงินทอน, เกินวงเงิน → emit approval:required |
| SC4 | SharedDeliveryPanel | Sales | ที่อยู่จัดส่ง, วันที่, วิธีจัดส่ง, ติดตั้ง toggle |
| SC5 | SharedDocRefPanel | ทุกโมดูล | ดึงเอกสารต้นทาง (Quote/Reservation/PO ฯลฯ) auto-fill, Partial Pull |
| SC6 | SharedDepositPanel | Sales | กรองมัดจำตามลูกค้า, หักลบ, แสดงยอดคงเหลือ |
| SC7 | SharedTimeline | ทุกโมดูล | Audit Trail — ทุก Status Change, ทุก Action บันทึกครบ |
| SC8 | SharedSerialPanel | WH, Service, Claims | Scan/Manual input, validate ซ้ำ Real-time, Batch mode |
| SC9 | SharedPromoPrice | Sales, Promotion | คำนวณราคา/โปร Real-time, Priority Conflict Resolution |

### Shared Component Usage Matrix
| หน้าจอ | SC1 | SC2 | SC3 | SC4 | SC5 | SC6 | SC7 | SC8 | SC9 |
|---|---|---|---|---|---|---|---|---|---|
| Sales Invoice | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sales Queue | - | - | - | - | - | - | ✓ | - | - |
| GRN | - | ✓ | - | - | ✓ | - | ✓ | ✓ | - |
| Transfer Order | - | ✓ | - | - | ✓ | - | ✓ | ✓ | - |
| PO | - | ✓ | ✓ | - | ✓ | - | ✓ | - | - |
| AP Invoice | - | - | ✓ | - | ✓ | - | ✓ | - | - |
| Service Intake | ✓ | - | - | - | - | - | ✓ | ✓ | - |
| Cash Receive | ✓ | - | ✓ | - | ✓ | - | ✓ | - | - |
| Price List | - | ✓ | - | - | - | - | ✓ | - | ✓ |

---

## 6. BC365 API Integration

### API Strategy
- Portal เป็น Front → เรียก BC API ผ่าน Service Account เดียว
- Debounce: 300ms สำหรับ Search
- Retry/Queue: ถ้า BC ช้าหรือ Error → Retry + Job sync กลางคืน
- Error Log: Timestamp, Endpoint, HTTP Status, Retry Count

### Key Endpoints ต่อโมดูล

**Sales:**
```
GET  /customers?$filter=...              → ค้นหาลูกค้า
GET  /customers/{id}                    → detail + credit
GET  /items?$expand=itemVariants        → ค้นหาสินค้า + stock
GET  /priceLists?customerId=&date=      → ราคา + โปร
POST /salesOrders                       → สร้าง SO
POST /salesInvoices/{id}/post           → Post บัญชี
POST /salesCreditMemos                  → ใบลดหนี้
```

**Warehouse:**
```
GET  /purchaseOrders?status=Released    → Queue รอรับ PO
GET  /items/{id}/itemLedgerEntries      → เช็คสต็อก
POST /warehouseReceipts                 → Post GRN
POST /transferShipments/{id}/ship       → โอนออก
POST /transferReceipts/{id}/receive     → รับโอน
PATCH /itemTrackingEntries              → ยิง Serial (validate ซ้ำ)
```

**Purchase:**
```
GET  /purchasePrices?vendorId=&date=    → ราคาซื้อ ณ วันที่
POST /purchaseOrders                    → สร้าง PO
POST /purchaseInvoices                  → ตั้งหนี้ AP
GET  /purchaseOrders/{id}/threeWayMatch → ตรวจ 3-Way Match
```

**Service:**
```
POST /serviceOrders                     → สร้างใบงาน
PATCH /serviceOrders/{id}/assign        → มอบหมายช่าง
POST /serviceOrders/{id}/complete       → ช่างกด Complete + GPS/Photos
POST /serviceOrders/{id}/close          → ปิดงาน + สร้าง Financial docs
GET  /itemLedgerEntries?serialNo=       → ตรวจ Warranty
```

**Finance:**
```
GET  /customerLedgerEntries?open=true   → AR Open Entries
GET  /vendorLedgerEntries?open=true     → AP Open Entries
POST /cashReceiptJournals               → รับเงิน
POST /paymentJournals                   → จ่ายเงิน + WHT
POST /generalJournals                   → JV / Accrual
POST /bankAccounts/{id}/reconcile       → Bank Recon
POST /accountingPeriods/{id}/close      → ปิดงวด
```

### BC Extension ที่ต้องพัฒนาเพิ่ม (Custom)
- Promotion Engine (Price List + Rule Engine)
- Accrual / Sale-in Tracking
- Service Order (ถ้า Standard BC ไม่รองรับ)
- Warranty Tracking ต่อ Serial

---

## 7. RBAC — สิทธิ์หลัก (ข้ามโมดูล)

| Role | โมดูลที่เข้าถึง |
|---|---|
| Sales Staff | Sales (สร้าง/แก้ Draft) |
| Sales Admin | Sales (ทุกฟังก์ชัน รวม Post) |
| WH Staff | Warehouse (รับ/เบิก/โอน/Serial) |
| WH Supervisor | Warehouse (ทุกฟังก์ชัน รวม Direct Transfer/Adjust) |
| Purchaser | Purchase (PR/PO/GR/AP) |
| Service Tech | Service (รับงาน/ทำงาน/Mobile) |
| Service Admin | Service (จัดคิว/อนุมัติ/ปิดงาน/QA) |
| AR Staff | Finance (รับเงิน/AR) |
| AP Staff | Finance (จ่ายเงิน/AP/ตั้งหนี้) |
| Finance Manager | Finance (ทุกฟังก์ชัน รวม JV/BankRecon) |
| Price Admin | Promotion/Price List |
| Master Admin | Master Config ทั้งหมด |
| Approver | อนุมัติข้ามโมดูล (ตาม Approval Matrix) |
| Auditor | ดูอย่างเดียว ทุกโมดูล |
| Admin | ทุกอย่าง รวม System Config / RBAC |

**กฎ RBAC:**
- Field-Level Permission: ราคาต้นทุน / วงเงินเครดิต → ซ่อนตาม Role
- Maker ≠ Checker: ห้าม Approve งานตัวเอง (บังคับทุกโมดูลที่มี Approval)
- Route Guard: ป้องกัน URL access ที่ไม่มีสิทธิ์

---

## 8. เอกสารอ้างอิงในโปรเจก

| ไฟล์ | ประเภท | ใช้เพื่อ |
|---|---|---|
| `uxui_field_knowledge.docx` | UX/UI + Field Spec | รู้ว่าหน้าจอไหนมีฟิลด์อะไร, SC ไหนใช้ที่ไหน |
| `component_fw_complete.docx` | Component Architecture | Props/Events/State/API/Validation ของ SC1-SC9 + Phase 1-4 |
| `sangwijit_reference_rev2.docx` | Business Reference | Workflow, Gap Analysis, Field Table Rev.3 (130 fields) |
| `Field_Table_Complete_Rev3.docx` | Field Dictionary | 130 fields ครบทุกโมดูล พร้อม Shared Component mapping |
| `Shared_Components.docx` | SC Specification | รายละเอียด SC1-SC9 ฝั่ง Business/UX |
| `*.pdf (Developer Design)` | Workflow Diagrams | Flow จริงที่ Dev ออกแบบ — แยกตามโมดูล/หน้าจอ |
| `sales-invoice-compact.html` | HTML Prototype | ตัวอย่าง Sales Invoice ที่ผ่าน UAT ชุดแรกแล้ว |
| `dd_sales_phase1.docx` | Data Dictionary | Field Spec Phase 1 (Sales) |
| `dd_wh_pur_phase2.docx` | Data Dictionary | Field Spec Phase 2 (Warehouse + Purchase) |
| `dd_finance_phase3.docx` | Data Dictionary | Field Spec Phase 3 (Finance) |
| `dd_svc_promo_master_phase4.docx` | Data Dictionary | Field Spec Phase 4 (Service/Claims/Promotion/Master) |

---

## 9. Open Questions — ยังต้องตัดสินใจ

> **⚠️ ห้าม Implement ส่วนที่มีเครื่องหมาย ❓ จนกว่าจะได้คำตอบ**

### 9.1 Technical Decisions

| # | คำถาม | Impact |
|---|---|---|
| T1 | Mobile App: Native App / PWA / Responsive Web? | Service Tech (SV-4) ใช้ Mobile ทำงาน |
| T2 | Offline Mode: ช่างทำงานได้เมื่อไม่มีสัญญาณ? Sync ยังไง? | Service Mobile |
| T3 | GPS Tracking: Real-time หรือ Check-in/out เท่านั้น? | Service SV-4 |
| T4 | Photo Upload: ขนาด / format / storage (BC หรือ Azure Blob)? | Service + Claims |
| T5 | BC Extension: ใช้ Standard Extension หรือ Custom AL? กี่ตัว? | Promo, Accrual, Service |
| T6 | Promotion Engine: คำนวณที่ Portal หรือ BC? | SC9 + Performance |
| T7 | Night Sync Job: ใช้ Azure Function / Power Automate / Custom? | Reliability |
| T8 | E-Signature ลูกค้า: ใช้ Library อะไร? | Service QA Close (SV-5) |
| T9 | e-Tax Invoice: ใช้ BC365 Standard Thailand Extension หรือ Custom? | e-Tax Phase 2 |
| T10 | Marketplace API: Shopee/Lazada Partner Account พร้อมหรือยัง? Production Key ได้เมื่อไหร่? | Marketplace Phase 3 |
| T11 | Customer Notification: SMS Provider (Twilio/True/AIS) หรือ LINE Notify? | Service Phase 3 |
| T12 | Stock Sync Marketplace: Push real-time หรือ Batch (ทุก X นาที)? | Marketplace Phase 3 |

### 9.2 Business Rule Decisions

| # | คำถาม | Impact |
|---|---|---|
| B1 | Promotion Conflict: Priority กำหนดยังไง? ใครตั้ง? | SC9 Core Logic |
| B2 | Serial Policy: สินค้าตัวไหนบังคับ Serial บ้าง? Flag ใน Item Master? | WH + Service |
| B3 | Accrual Auto-Hook: Trigger ทันที Post GRN หรือ Batch กลางคืน? | Purchase + Finance |
| B4 | ช่าง Outsource vs ช่างใน: Process ตั้งหนี้ต่างกันยังไง? | Service SV-5 + AP |
| B5 | Credit Approval: Tier 1/2/3 วงเงินเท่าไหร่ แต่ละ Tier? Escalation? | Sales + Approver |
| B6 | Deposit: ล็อกเงินมัดจำในระบบยังไง? ตัด GL Account ไหน? | Sales + Finance |
| B7 | Commission PC: คำนวณรายบิล/รายเดือน? ผูกกับ Promo หรือ Sales? | Promo Phase 1 |
| B8 | Bank Recon Tolerance: ± กี่วัน ± กี่บาท สำหรับ Auto-Match? | Finance |
| B9 | SLA Service: แต่ละ Document Type กี่ชั่วโมง? Working Hours? | Service + Claims |
| B10 | WHT Certificate: ออกอัตโนมัติหรือ Manual? Format มาตรฐาน? | Finance AP |

### 9.3 Data & Migration Decisions

| # | คำถาม | Impact |
|---|---|---|
| D1 | Master Data จาก HERO พร้อมแค่ไหน? Item/Customer/Vendor? | Go-Live |
| D2 | Historical Data: ย้าย Transaction เก่าหรือแค่ Master? | BC Setup |
| D3 | GL Account / Cost Center / Posting Group: Mapping ครบแล้ว? | Finance Go-Live |
| D4 | Number Series: รูปแบบเลขที่เอกสารแต่ละประเภท? | ทุกโมดูล |
| D5 | Customer Group / Price Group: มีกี่กลุ่ม? รหัสคืออะไร? | Sales + Promo |

---

## 10. Module Dependency (ต้องทำก่อน-หลัง)

```
Master Config
    └─► Sales ──────────────────────────────────► Finance/AR
    │       └─► Warehouse (Issue/Serial)          ▲
    └─► Purchase ──► Warehouse (GRN) ────────────► Finance/AP
    │       └─► Promotion (Accrual)               ▲
    └─► Service ──────────────────────────────────┘
            └─► Claims ──► Finance (AP CN)
```

**Phase Priority:**
```
Phase 1 (Run ASAP):  Sales + Warehouse + Purchase Basic + Price List + Finance Basic
Phase 2 (Scale):     Step Discount/Bundle, Credit Memo Flow, Service Basic, Claims
Phase 3 (Automate):  Auto Accrual→AP CM, Service SLA Dashboard, BI/KPI
```

---

## 11. Non-Functional Requirements

| ด้าน | ข้อกำหนด |
|---|---|
| Performance | คำนวณราคา/โปร Real-time ≤ 2 วินาที ต่อใบที่มี 50–200 รายการ |
| Reliability | Retry + Queue เมื่อ BC ช้า, Job sync กลางคืน |
| Security | RBAC, Field-Level Permission, Audit Log ครบ |
| Observability | Error Log, API Trace, Health Check Dashboard |
| Bilingual | ทุกหน้าจอรองรับ ไทย-อังกฤษ |
| Mobile | Service Module ต้องใช้งานบนมือถือได้ (Responsive/PWA/Native TBD) |

---

## 12. Out of Scope / Phased Later

| รายการ | สถานะ | หมายเหตุ |
|---|---|---|
| WMS ชั้นลึก (Bin-directed put/pick, Wave/Zone) | Phase ถัดไป | เพิ่มเมื่อ WH ขยาย |
| HR/Payroll เต็มระบบ | Out of Scope | ใช้ BC365 HR Module, Portal เชื่อมเฉพาะ Employee Directory + Commission Hook |
| Manufacturing / MRP | Out of Scope | ธุรกิจเครื่องใช้ไฟฟ้าไม่มีสายการผลิต |
| Promotion Engine ขั้นสูง | Phase 2–3 | Step/Bundle/Quota/Simulator |
| สินเชื่อ (Credit Department) | Out of Scope | ไม่ใช้ระบบ |
| E-Commerce Frontend (Storefront) | Out of Scope | ไม่สร้าง Storefront — เชื่อม Marketplace API เท่านั้น (Phase 3) |
| Marketplace API (Shopee/Lazada) | Phase 3 | เพิ่มเป็น Tab "ออนไลน์" ใน Sales Module |
| PDPA Full Framework | Phase 4 | Audit Log (SC7) ต้องมีตั้งแต่ Phase 1 |
| AI Chatbot / Assistant | Future | ไม่อยู่ใน roadmap ปัจจุบัน |
| BI / Analytics Full | Phase 3 | Quick KPI Card ใน Dashboard ทำได้ตั้งแต่ Phase 1 |

---

_ไฟล์นี้ต้องอัปเดตทุกครั้งที่ตัดสินใจเรื่องใน Section 9 (Open Questions)_
_เมื่ออัปเดต → แก้วันที่ที่ Header และเพิ่ม Version_
