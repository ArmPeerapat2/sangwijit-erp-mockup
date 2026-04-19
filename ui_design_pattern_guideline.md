# UI Design Pattern Guideline
## Sangwijit ERP Web Portal × Dynamics 365 Business Central

| | |
|---|---|
| Version | 1.0 (Initial) |
| วันที่สร้าง | เมษายน 2026 |
| ขอบเขต | 8 Modules \| 9 Shared Components \| 68 หน้าจอ \| 4 Phase |
| สถานะ | Phase 2 — Planning & Annotation (ยังไม่ Implementation) |

> เอกสารนี้รวม Design Pattern ทั้งหมดไว้ในที่เดียว สร้างจาก README.md, uxui_field_knowledge.docx และ component_fw_clean.docx ใช้เป็น Reference สำหรับทีม Dev และ Designer ก่อนเริ่ม Phase 3

---

## สารบัญ

1. [หลักการออกแบบ (Design Principles)](#1-หลักการออกแบบ)
2. [Page Layout — โครงสร้างหน้าจอมาตรฐาน](#2-page-layout)
3. [UI Patterns — รูปแบบ UI หลัก 5 ประเภท](#3-ui-patterns)
4. [Status System — สีและความหมาย](#4-status-system)
5. [ActionBar — ปุ่มตาม Mode และ Role](#5-actionbar)
6. [Shared Components SC1–SC9](#6-shared-components)
7. [RBAC — Field-Level Permission](#7-rbac)
8. [Document Status Flow ทุก Module](#8-document-status-flow)
9. [Error Handling & Toast Notification](#9-error-handling)
10. [AI Prompt Templates](#10-ai-prompt-templates)
11. [เอกสารที่ใช้ร่วมกัน](#11-เอกสารที่ใช้ร่วมกัน)
12. [Development Checklist](#12-development-checklist)

---

## 1. หลักการออกแบบ

ระบบยึดหลักการ 7 ข้อนี้ตลอดทุกหน้าจอ ทุก Module — ห้ามยกเว้น

| # | Principle | คำอธิบาย |
|---|-----------|---------|
| 1 | **Information Density** | แสดงข้อมูลสำคัญครบในจอเดียว — ไม่ต้อง Scroll เพื่อดูยอดรวมหรือ Status |
| 2 | **Minimal Clicks** | พิมพ์รหัสตรงถ้ารู้รหัส / ค้นหาถ้าไม่รู้ — เป้าหมาย: เปิดบิลได้ใน < 3 คลิก |
| 3 | **Progressive Disclosure** | รายละเอียดเพิ่มเติม (Tab จัดส่ง, อ้างอิง) แสดงเมื่อต้องการ ไม่แสดงทุกอย่างพร้อมกัน |
| 4 | **Consistent Layout** | โครงสร้างหน้าจอเดียวกันทุก Module — ใครใช้ Sales ได้แล้วย้ายไป Purchase จะคุ้นเคยทันที |
| 5 | **Keyboard Friendly** | Tab/Enter นำทางได้ครบทุก Field — รองรับ Power User ที่ไม่ใช้เมาส์ |
| 6 | **Bilingual Ready** | ทุก Field Label มีทั้งไทยและ English — ป้าย, Placeholder, Tooltip, Error Message |
| 7 | **Visual Hierarchy** | ข้อมูลสำคัญ (เลขที่เอกสาร, Status, ยอดรวม) เด่นชัดกว่าข้อมูลรอง — ใช้ Weight/Size/Color |

---

## 2. Page Layout

### 2.1 App Shell (กรอบหลักของระบบ)

| Zone | Component | หน้าที่ |
|------|-----------|--------|
| **Top Navigation** | AppNavbar | Logo, ชื่อผู้ใช้, Role Badge, การแจ้งเตือน, ออกจากระบบ |
| **Side Navigation** | AppSideNav | เมนูโมดูลตาม Role/Permission, Active State, Collapse |
| **Main Content** | slot: content | พื้นที่แสดง Page Content — Scroll อิสระ |
| **Global Toast** | AppToast | แจ้งเตือน Success / Error / Warning — Singleton |
| **Global Modal** | AppModal | Confirm Dialog กลางระบบ |

---

### 2.2 ERP Transaction Form — โครงสร้างหน้าจอเอกสาร

Pattern หลักสำหรับ Sales Invoice, PO, Transfer Order, Service Work Order และเอกสารธุรกรรมทุกประเภท

```
┌─────────────────────────────────────────────────────────────────────┐
│  Section 1  PAGE HEADER                                             │
│  เลขที่เอกสาร | StatusBadge (สี) | สาขา/คลัง | วันที่ | ผู้บันทึก     │
├─────────────────────────────────────────────────────────────────────┤
│  Section 2  DOCUMENT HEADER                                         │
│  กลุ่มเอกสาร | ประเภทราคา | พนักงานขาย | วันที่ออก | วันกำหนดส่ง     │
├─────────────────────────────────────────────────────────────────────┤
│  Section 3  PARTY (ลูกค้า / Vendor)                                 │
│  SC1 CustomerSearch หรือ Vendor Lookup                               │
│  → แสดง Credit Status, วงเงินคงเหลือ, กลุ่มราคาทันที                 │
├─────────────────────────────────────────────────────────────────────┤
│  Section 4  LINE ITEMS — Data Grid                                  │
│  SC2 ItemSearch + ตาราง Editable                                     │
│  สินค้า | จำนวน | ราคา | ส่วนลด | VAT | Serial                        │
├─────────────────────────────────────────────────────────────────────┤
│  Section 5  ADDITIONAL TABS                                         │
│  [จัดส่ง SC4] [หมายเหตุ] [อ้างอิง SC5] [มัดจำ SC6] [Serial SC8] [Log SC7] │
├─────────────────────────────────────────────────────────────────────┤
│  Section 6  SUMMARY FOOTER                                          │
│  ยอดรวม | ส่วนลด | ยอดก่อน VAT | VAT 7% | Grand Total | SC3 Payment  │
├─────────────────────────────────────────────────────────────────────┤
│  Section 7  ACTION BAR (Sticky Footer)                              │
│  [ยกเลิก] [บันทึก Draft] [ยืนยัน] [Post] [พิมพ์]  ← ซ่อน/แสดงตาม Role │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Mapping โครงสร้างตาม Module

| Section | Sales | Purchase | Warehouse | Service |
|---------|-------|----------|-----------|---------|
| Section 2 — เอกสาร | ลูกค้า + ราคากลุ่ม | เจ้าหนี้ Vendor | คลังต้นทาง → ปลายทาง | ลูกค้า + ใบงาน |
| Section 4 — Lines | สินค้า + ราคาขาย | สินค้า + ราคาซื้อ | สินค้า + Serial No. | อะไหล่ + ค่าแรง |
| Section 6 — Footer | ยอดขาย + VAT | ยอดซื้อ + WHT | จำนวนรวม Units | ค่าบริการรวม |

---

## 3. UI Patterns

### Pattern ที่ใช้ในระบบ

| Pattern | ใช้ที่ไหน | รายละเอียด |
|---------|----------|-----------|
| **ERP Transaction Form** | บิลขาย, PO, ใบโอน, ใบงานช่าง | Header → Lines → Footer — ห้ามข้าม Section |
| **Master-Detail** | SC1 CustomerSearch, SC2 ItemSearch, Master Config | เลือก Record บน → แสดงรายละเอียดล่างทันที |
| **Lookup Dialog** | เลือกสินค้า, เลือกลูกค้า, เลือก Vendor | Popup ค้นหา+เลือก — Enter/Double-click = Select — Fill Field อัตโนมัติ |
| **Data Grid (Editable)** | LINE ITEMS Section ทุกหน้าจอ | แก้ไขได้ใน Cell โดยตรง — Tab ไปช่องถัดไป — รองรับ 50–200 lines |
| **Tabbed Panel** | Section 5 ADDITIONAL TABS ทุกหน้าจอ | Tab มีข้อมูล → แสดง dot indicator — Tab บังคับกรอก → แสดง `*` |

### Lookup Dialog — Keyboard Spec

| Key | Action |
|-----|--------|
| `Esc` | ปิด Dialog |
| `Arrow Up / Down` | เลื่อน Highlight |
| `Enter` | Select รายการที่ Highlight |
| `Double-click` | Select รายการที่คลิก |

---

## 4. Status System

StatusBadge Component ใช้สีตามตารางนี้ทุกหน้าจอ — **ห้ามใช้สีอื่นนอกตาราง**

| Status Value | สี Badge | Hex | ใช้ใน | ความหมาย |
|---|---|---|---|---|
| `Draft` | เทา | `#BFBFBF` | ทุก Module | บันทึกร่างไว้ ยังไม่ยืนยัน — แก้ไขได้ |
| `PendingApproval` | ส้ม | `#C55A11` | Sales, Finance, Master | รออนุมัติวงเงิน/ส่วนลดพิเศษ — แสดง ApprovalBanner |
| `Confirmed` | น้ำเงิน | `#4472C4` | Sales, WH, PO | ยืนยันแล้ว รอยิง Serial / จัดส่ง — แก้ไขไม่ได้แล้ว |
| `PartialShipped` | ฟ้าอ่อน | `#70AD47` | Sales, WH | ส่งบางส่วนแล้ว — แสดงยอด Partial Qty |
| `Posted` | เขียว | `#375623` | ทุก Module | Post เข้า BC365 Ledger แล้ว — Read-Only ทั้งหน้า |
| `Cancelled` | แดง | `#C00000` | ทุก Module | ยกเลิกแล้ว — ดูได้อย่างเดียว ไม่สามารถแก้ไข |
| `Scheduled` | ม่วง | `#7030A0` | Promotion | กำหนดวันเปิดใช้งานไว้แล้ว ยังไม่ถึงวันเปิด |
| `Live / Active` | เขียวสด | `#00B050` | Promotion, Master | กำลังใช้งาน / มีผลแล้ว |
| `Expired / Deprecated` | น้ำตาล | `#843C0C` | Promotion, Master | หมดอายุ / ถูก Deprecate — ยังดูย้อนหลังได้ |

> **กฎ:** ห้าม Delete Master Data ที่มีการอ้างอิง — ให้เปลี่ยนเป็น `Deprecated` แทน เพื่อรักษา Audit Trail สำหรับ IPO Readiness

---

## 5. ActionBar

ActionBar เป็น **Sticky Footer** แสดงปุ่มอัตโนมัติตาม `mode` + `permission` — Dev ไม่ต้องเขียน if/else เอง

| mode | ปุ่มที่แสดง | Event ที่ emit |
|------|-----------|--------------|
| `create` | บันทึก Draft, ส่งอนุมัติ, ยกเลิก | `@save`, `@submit`, `@cancel` |
| `edit` | บันทึก, ยืนยัน (Confirm), ยกเลิกการแก้ไข | `@save`, `@confirm`, `@discard` |
| `view` | แก้ไข*, พิมพ์, ส่งอีเมล, Duplicate | `@edit`, `@print`, `@email`, `@duplicate` |
| `approve` | อนุมัติ, ปฏิเสธ (พร้อมช่องเหตุผล) | `@approve`, `@reject` |
| `post` | พิมพ์, สร้าง Shipment, สร้าง Credit Memo | `@print`, `@createShipment`, `@createCM` |

> `*` ปุ่มแก้ไข — แสดงเฉพาะ Role ที่มีสิทธิ์ ดูตาราง RBAC ใน Section 7

### ApprovalBanner

แสดงเมื่อ Document อยู่ใน `PendingApproval` ทั้งผู้ขอและผู้อนุมัติเห็น Banner เดียวกัน

| Prop | Type | Required | คำอธิบาย |
|------|------|----------|---------|
| `reason` | String | Required | เหตุผลที่ต้องอนุมัติ เช่น "วงเงินเกิน 50,000 บาท" |
| `requestedBy` | String | Required | ชื่อผู้ขอ |
| `requestedAt` | Date | Required | วันที่/เวลาส่งขออนุมัติ |
| `approver` | String | Optional | ชื่อผู้อนุมัติที่กำหนด |

---

## 6. Shared Components

Shared Components ต้องพัฒนาให้เสร็จก่อนพัฒนา Page ใดๆ — reuse ข้ามทุก Module

| SC | ชื่อ Component | Fields หลัก / หน้าที่ | ใช้ใน Module |
|----|--------------|---------------------|------------|
| **SC1** | CustomerSearch | รหัสลูกค้า, ชื่อ TH/EN, เบอร์, Email, เลขผู้เสียภาษี, วงเงิน/คงเหลือ, กลุ่มราคา, สถานะเครดิต, Quick-Create | Sales, Service, Finance |
| **SC2** | ItemSearch | รหัสสินค้า, ชื่อ TH/EN, ยี่ห้อ/รุ่น, Barcode/QR, ราคาตามกลุ่มลูกค้า, สต็อกแยกคลัง Real-time, Serial Flag, สินค้าทดแทน | Sales, WH, PO, Service |
| **SC3** | Payment Panel | ยอดสุทธิ, ยอดมัดจำที่หัก, ยอดคงเหลือ, VAT, ส่วนลดท้ายบิล, วิธีชำระ (เงินสด/โอน/เช็ค/บัตร/QR), Split Payment | Sales, Finance |
| **SC4** | Delivery & Installation | ที่อยู่จัดส่ง, ผู้รับ, เบอร์ผู้รับ, วันที่นัดส่ง, ช่วงเวลา, วิธีจัดส่ง, ต้องการติดตั้ง Y/N, ช่างที่รับผิดชอบ, Tracking No. | Sales, PO |
| **SC5** | Document Reference | อ้างอิงเอกสารต้นทาง, Document Chain, ดึงข้อมูลจาก Quote/SO/GRN มาเติม | ทุก Module |
| **SC6** | Deposit Panel | แสดงมัดจำที่ใช้ได้, เลือก/หักมัดจำ, ยอดมัดจำคงเหลือ | Sales, PO |
| **SC7** | Timeline / Audit Log | ประวัติเอกสาร, Log การเปลี่ยนแปลง, Comment, แนบไฟล์/รูป, Timestamp | ทุก Module |
| **SC8** | Serial Number | กรอก/Scan Serial, Validate ซ้ำ Real-time, แสดงเอกสารที่ใช้ Serial ซ้ำ, Block Confirm ถ้าไม่ครบ | Sales, WH, Service |
| **SC9** | Promo & Price | คำนวณราคา/โปรโมชั่น, Free Item, Accrual Hook, ส่วนลด Step (Phase 2) | Sales, Promotion |

### Component Usage Matrix

| Module | SC1 | SC2 | SC3 | SC4 | SC5 | SC6 | SC7 | SC8 | SC9 |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Sales | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Warehouse | — | Y | — | — | Y | — | Y | Y | — |
| Purchase | — | Y | Y | Y | Y | Y | Y | — | Y |
| Service | Y | Y | — | Y | Y | — | Y | Y | — |
| Finance | Y | — | Y | — | Y | — | Y | — | — |
| Promotion | — | Y | — | — | — | — | Y | — | Y |
| Master Config | — | — | — | — | — | — | Y | — | — |

---

## 7. RBAC

### 7.1 Field-Level Permission

| Field | ซ่อน (Hide) | อ่านอย่างเดียว (Read) | แก้ไขได้ (Edit) |
|-------|------------|---------------------|---------------|
| ราคาต้นทุน (Unit Cost) | Sales Staff | — | Sales Admin, Finance Manager |
| วงเงินเครดิต (Credit Limit) | Sales Staff (ยอดรวมดูได้) | Sales Staff (ยอดคงเหลือ) | Finance Manager, Admin |
| ส่วนลดพิเศษ (Extra Discount) | — | Sales Staff | Sales Admin, Approver |
| ราคาขาย (ถ้า Lock) | — | Sales Staff (ถ้า Locked) | Approver (ปลด Lock) |
| เหตุผลยกเลิก | — | Sales Staff | Sales Admin |

### 7.2 Action Permission Matrix

| Action | Sales Staff | Sales Admin | Finance | Approver | Auditor | Admin |
|--------|:-----------:|:-----------:|:-------:|:--------:|:-------:|:-----:|
| เปิดบิล / ใบเสนอราคา / ใบจอง | Y | Y | — | — | — | Y |
| แก้ไขก่อน Confirm | Y | Y | — | — | — | Y |
| Confirm เอกสาร | Y | Y | — | — | — | Y |
| Post Invoice ลง BC | — | Y | Y | — | — | Y |
| อนุมัติวงเงิน / Price Lock | — | — | — | Y | — | Y |
| ดูราคาต้นทุน | — | Y | Y | — | Y | Y |
| ออกใบลดหนี้ (Credit Memo) | — | Y | Y | — | — | Y |
| ยกเลิกเอกสาร | — | Y | — | — | — | Y |
| Export / Download รายงาน | Y | Y | Y | — | Y | Y |

### 7.3 กฎ RBAC หลัก

- **Maker ≠ Checker** — ห้าม Approve งานตัวเอง บังคับทุก Module ที่มี Approval
- **Field-Level Permission** — ราคาต้นทุน / วงเงินเครดิต → ซ่อนตาม Role
- **Route Guard** — ป้องกัน URL access ที่ไม่มีสิทธิ์
- **Data Scope** — Sales Staff เห็นเฉพาะสาขาตัวเอง
- ใช้ `usePermission()` composable — Components ตรวจสิทธิ์โดยไม่ hard-code Role

---

## 8. Document Status Flow

Status Flow ต้องสอดคล้องกับ BC365 Workflow เสมอ — Portal เปลี่ยน Status ผ่าน BC API

| Module | Status Flow |
|--------|------------|
| **Sales** | `Draft` → `Pending Approval` (ถ้ามี) → `Confirmed` → `Posted` |
| **Warehouse** | `Request` → `Approved` → `Shipped` → `Pending Receipt` → `Received` → `Posted` |
| **Purchase** | `Draft` → `Approved` → `Released` → `Received` → `Posted` → `Paid` |
| **Service** | `Open` → `Assigned` → `InProgress` → `WaitingParts` → `Completed` → `Closed` |
| **Claims** | `Received` → `Verified` → `Sent` → `Responded` → `Closed` |
| **Finance** | `Draft` → `Reviewed` → `Approved` → `Posted` / `Reconciled` |
| **Promotion/Price** | `Draft` → `Review` → `Approved` → `Scheduled` → `Live` → `Paused` / `Expired` |
| **Master Data** | `Draft` → `Review` → `Approved` → `Active` → `Deprecated` → `Archived` |
| **Accrual** | `Planned` → `Accruing` → `Claimed` → `Settled` |

---

## 9. Error Handling

### 9.1 Toast Notification

| ประเภท | สี | ตัวอย่างข้อความ |
|--------|---|--------------|
| **Success** | เขียว `#375623` | "บันทึกเอกสาร SI-2025-00123 สำเร็จ" |
| **Error** | แดง `#C00000` | "ไม่สามารถเชื่อมต่อ BC365 — กรุณาลองใหม่อีกครั้ง (Retry 3/3)" |
| **Warning** | ส้ม `#C55A11` | "วงเงินเครดิตเกิน 50,000 บาท — กรุณาส่งขออนุมัติก่อนยืนยัน" |
| **Info** | น้ำเงิน `#4472C4` | "โปรโมชั่น SUMMER2025 มีผลกับสินค้า 3 รายการในบิลนี้" |

### 9.2 Error Cases

| Code | เงื่อนไข | วิธีจัดการ |
|------|---------|---------|
| **E1** | BC365 API 5xx | Retry อัตโนมัติ 3 ครั้ง (1s, 2s, 4s) → Toast Error → บันทึก Error Log |
| **E2** | Serial Number ซ้ำ | Highlight Field แดง + แสดงเอกสารที่ใช้ Serial นั้น → Block Confirm จนกว่าจะแก้ไข |
| **E3** | Network Offline | Auto-save Draft ลง localStorage → Toast Warning → Sync เมื่อ Online กลับมา |
| **E4** | วงเงินเกิน Limit | ApprovalBanner ขึ้นทันที → Disable ปุ่ม Confirm → บังคับส่ง Approver |
| **E5** | สต็อกไม่เพียงพอ | แสดง Alert ใน Line Item → ไม่ Block (แต่ Warning) → Sales Admin ตัดสินใจ |
| **E6** | Duplicate Document | Check เลขที่เอกสารซ้ำก่อน POST → Toast Error ระบุเลขที่ที่ซ้ำ |

---

## 10. AI Prompt Templates

ใช้ Template เหล่านี้เมื่อสร้างหน้าจอผ่าน AI Code Generator (Loveable, Cursor, GitHub Copilot) เพื่อให้ Output ตรงกับ Design Pattern

### 10.1 Template: สร้างหน้าจอ Transaction Form ใหม่

```
สร้าง [ชื่อหน้าจอ] สำหรับ Sangwijit ERP Web Portal
Tech Stack: React + Tailwind CSS + TypeScript

Layout: ERP Transaction Form โครงสร้าง 7 Section:
  Section 1 PAGE HEADER: เลขที่เอกสาร + StatusBadge + สาขา + วันที่
  Section 2 DOC HEADER: [ระบุ Fields ที่ต้องการ]
  Section 3 PARTY: SC1 CustomerSearch / Vendor Lookup
  Section 4 LINE ITEMS: Editable Data Grid
  Section 5 TABS: จัดส่ง | หมายเหตุ | อ้างอิง | มัดจำ
  Section 6 SUMMARY: ยอดรวม + VAT 7% + Grand Total
  Section 7 ACTION BAR: Sticky Footer ปุ่มตาม mode

Shared Components ที่ใช้: [SC1, SC2, SC3, SC4, SC5, SC6, SC7, SC8, SC9]

StatusBadge colors:
  Draft = gray #BFBFBF
  PendingApproval = orange #C55A11
  Confirmed = blue #4472C4
  Posted = green #375623
  Cancelled = red #C00000

Bilingual: ทุก Label มีทั้งไทยและ English
RBAC: ซ่อน/แสดงปุ่มตาม role prop: [sales_staff | sales_admin | approver | finance]
```

### 10.2 Template: สร้าง Lookup Dialog

```
สร้าง Lookup Dialog สำหรับเลือก [ลูกค้า / สินค้า / Vendor]
- Search box ด้านบน (real-time filter)
- Data Grid แสดงผล [ระบุ Columns]
- กด Enter หรือ Double-click เพื่อ Select แล้วปิด Modal
- ส่ง event: onSelect(selectedItem)
- Keyboard: Esc = ปิด | Arrow Up/Down = เลื่อน | Enter = เลือก
```

### 10.3 Template: สร้าง Dashboard / Queue

```
สร้าง Queue Dashboard สำหรับ [Module]
- Summary Cards แถวบน: รอดำเนินการ / รออนุมัติ / เร่งด่วน
- Filter Bar: สาขา, วันที่, สถานะ, พนักงาน
- Data Table: เลขที่เอกสาร | ลูกค้า/Vendor | ยอดรวม | StatusBadge | Action
- Pagination: 20 รายการต่อหน้า
- Quick Action: คลิกแถว = เปิดเอกสาร
```

---

## 11. เอกสารที่ใช้ร่วมกัน

| ชื่อไฟล์ | ประเภท | ใช้เพื่อ |
|---------|-------|---------|
| `research.md` | Research | ภาพรวม Requirements, Open Questions, RBAC, Non-functional |
| `plan.md` | Planning | Task breakdown ทุก Phase, Checklist, Risk |
| `README.md` | Overview | Getting Started, Architecture Diagram, Component Matrix |
| `uxui_field_knowledge.docx` | UX/UI + Field Spec | Field Spec ทุกหน้าจอ 130+ Fields, SC Mapping ต่อหน้าจอ |
| `1_component_fw_clean.docx` | Component Architecture | Props/Events/State/API/Validation ของ SC1–SC9 |
| `sangwijit_reference_rev2.docx` | Business Reference | Workflow, Gap Analysis, Field Table Rev.3 (130 fields) |
| `2_dd_sales_phase1.docx` | Data Dictionary | Field Spec Phase 1 — Sales |
| `3_dd_wh_pur_phase2.docx` | Data Dictionary | Field Spec Phase 2 — Warehouse + Purchase |
| `4_dd_finance_phase3.docx` | Data Dictionary | Field Spec Phase 3 — Finance |
| `5_dd_svc_promo_master_phase4.docx` | Data Dictionary | Field Spec Phase 4 — Service, Claims, Promotion, Master |
| `sales-invoice-compact.html` | HTML Prototype | Sales Invoice ที่ผ่าน UAT ชุดแรกแล้ว — ใช้เป็น Reference Visual |
| `Workflow PDF (60+ ไฟล์)` | Workflow Diagram | Flow Portal ↔ BC365 แยกตาม Module / หน้าจอ |

### Document Chain — ลำดับการอ่านเอกสาร

1. `research.md` — เริ่มที่นี่เสมอ: ภาพรวม + Open Questions
2. `plan.md` — Task breakdown + สถานะปัจจุบัน + Blocked Items
3. `ui_design_pattern_guideline.md` (เอกสารนี้) — Design Pattern + UI Rules
4. `uxui_field_knowledge.docx` — Field Spec ทีละหน้าจอ
5. `1_component_fw_clean.docx` — Technical Spec SC1–SC9
6. Data Dictionary ตาม Phase — Field Detail สำหรับ Dev
7. Workflow PDF — Flow จริง + BC365 Mapping

---

## 12. Development Checklist

Checklist ก่อนเริ่ม Implement หน้าจอใดๆ — **ห้ามข้ามขั้นตอน**

```
[ ] อ่าน research.md + plan.md ตรวจสอบ Open Questions ที่เกี่ยวข้อง
    → ห้าม Implement ส่วนที่มี [?] จนกว่าจะได้คำตอบ

[ ] ดู Data Dictionary (dd_*.docx) ของหน้าจอนั้น — ครบทุก Field ที่ต้องแสดง

[ ] ตรวจสอบ Component Usage Matrix — SC ที่ยังไม่มีต้องพัฒนาก่อน Page

[ ] ดู Workflow Diagram (PDF) ของหน้าจอนั้น — ตรวจสอบ Status Flow และ BC365 Entity

[ ] ยืนยัน RBAC: Role ไหน Access ได้, Field ไหนต้องซ่อน, ปุ่มไหนต้อง Disable

[ ] พัฒนาตาม ERP Transaction Form Structure 7 Sections — ห้ามเปลี่ยน Section Order

[ ] ใช้ StatusBadge สีตาม Section 4 — ห้ามใช้สีอื่น

[ ] ใช้ ActionBar ตาม mode — ห้าม Hard-code ปุ่มเอง

[ ] ทุก Label มีทั้งไทยและ English

[ ] เขียน Unit Test — Coverage > 80%

[ ] Self-review ก่อน PR — TypeScript Strict, ESLint Airbnb, Prettier
```

> **Open Questions ที่ยัง Block อยู่ (ห้าม Implement):**
> Q1 Multi-Company BC | Q2 Promotion Engine Location | Q3 Promotion Conflict Priority | Q4 Deposit GL Account
> ดูรายละเอียดใน `research.md` Section 9

---

*Sangwijit Group © 2024–2026 | Proprietary — ห้ามเผยแพร่ภายนอก*
*Last Updated: เมษายน 2026*
