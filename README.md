# Sangwijit ERP Web Portal

## Dynamics 365 Business Central Integration

[![Phase](https://img.shields.io/badge/Current%20Phase-1%20Run%20ASAP-blue)]()
[![Modules](https://img.shields.io/badge/Modules-8-green)]()
[![Screens](https://img.shields.io/badge/Total%20Screens-66-orange)]()

---

## 📋 สารบัญ

- [ภาพรวมโปรเจค](#-ภาพรวมโปรเจค)
- [สถาปัตยกรรมระบบ](#-สถาปัตยกรรมระบบ)
- [โมดูลและเฟสการพัฒนา](#-โมดูลและเฟสการพัฒนา)
- [Design Patterns](#-design-patterns)
- [Shared Components](#-shared-components)
- [Development Workflow](#-development-workflow)
- [โครงสร้างไฟล์เอกสาร](#-โครงสร้างไฟล์เอกสาร)
- [RBAC & Permissions](#-rbac--permissions)
- [BC365 API Integration](#-bc365-api-integration)
- [Coding Standards](#-coding-standards)
- [Getting Started](#-getting-started)

---

## 🎯 ภาพรวมโปรเจค

### วัตถุประสงค์

พัฒนา Web Portal สำหรับธุรกิจเครื่องใช้ไฟฟ้า **สังวิจิตร** ครอบคลุมทั้งขายส่ง ขายปลีก ออนไลน์ และส่งออก โดยเชื่อมต่อกับ **Dynamics 365 Business Central** ผ่าน API

### เป้าหมายหลัก

| เป้าหมาย | รายละเอียด |
|---------|-----------|
| **รวมศูนย์** | รวม 8 โมดูลหลักไว้ใน Portal เดียว |
| **ลด License** | ย้าย Transactional Work มาที่ Portal ใช้ Service Account เรียก BC |
| **เพิ่มคุณภาพ** | Data Quality, Audit Trail, ลด Lead Time |
| **Bilingual** | รองรับภาษาไทย-อังกฤษทุกหน้าจอ |

### แผนกที่เกี่ยวข้อง

```
ขายส่ง | ขายปลีก | ส่งออก | ออนไลน์ | คลัง | บัญชี | ศูนย์บริการ | บุคคล
```

---

## 🏗 สถาปัตยกรรมระบบ

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEB PORTAL                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  Sales  │ │Warehouse│ │Purchase │ │ Service │ │ Finance │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
│       └───────────┴───────────┼───────────┴───────────┘         │
│                               │                                 │
│                    ┌──────────▼──────────┐                      │
│                    │   API Service Layer │                      │
│                    │  (Service Account)  │                      │
│                    └──────────┬──────────┘                      │
└───────────────────────────────┼─────────────────────────────────┘
                                │ REST API
                    ┌───────────▼───────────┐
                    │  Dynamics 365 BC      │
                    │  (System of Record)   │
                    │  • GL / Ledger        │
                    │  • Posting            │
                    │  • Master Data        │
                    └───────────────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  COMPONENT LAYERS                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ PAGE LAYER                                               │   │
│  │ SalesInvoicePage, POPage, TransferPage, ServicePage...   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ LAYOUT LAYER                                             │   │
│  │ AppShell, PageHeader, ActionBar, SectionCard             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ SHARED COMPONENTS (SC1-SC9)                              │   │
│  │ CustomerSearch, ItemSearch, Payment, Delivery...         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ BASE COMPONENTS                                          │   │
│  │ BaseInput, BaseSelect, BaseModal, BaseTable, BaseButton  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ API SERVICE LAYER                                        │   │
│  │ salesService, customerService, itemService, bcApiClient  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 โมดูลและเฟสการพัฒนา

### Phase Overview

| Phase | ชื่อ | เป้าหมาย | โมดูล | จำนวนหน้าจอ |
|-------|-----|---------|------|------------|
| **1** | Run ASAP | ใช้งานได้เร็วที่สุด | Sales, Warehouse, Purchase, Price P1, Finance Basic, Master | 34 |
| **2** | Scale & Control | ขยายและควบคุม | Service, Claims, Step Discount, Credit Memo, Bank Recon | 15 |
| **3** | Automate | อัตโนมัติ | Finance Full, Promo Full, Accrual Auto, BI | 14 |
| **4** | Optimize | ปรับปรุง | Trade-in, Simulator, Advanced SLA, Mobile Mature | 5 |

### Module Dependency

```
                    ┌─────────────┐
                    │   Master    │  ◄── ต้องทำก่อน
                    │   Config    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────┐       ┌──────────┐       ┌──────────┐
   │  Sales  │       │ Purchase │       │ Service  │
   └────┬────┘       └────┬─────┘       └────┬─────┘
        │                 │                  │
        ▼                 ▼                  ▼
   ┌─────────┐       ┌──────────┐       ┌──────────┐
   │Warehouse│◄──────│   GRN    │       │  Claims  │
   └────┬────┘       └────┬─────┘       └────┬─────┘
        │                 │                  │
        └────────┬────────┴──────────────────┘
                 ▼
           ┌──────────┐
           │ Finance  │  ◄── ทำหลังสุด
           └──────────┘
```

### Phase 1 — Screens Detail

<details>
<summary><b>Sales Module (7 หน้าจอ)</b></summary>

| หน้าจอ | BC Entity | Status Flow |
|--------|-----------|-------------|
| Queue / Dashboard | salesOrders, salesInvoices | - |
| Sales Invoice | salesOrders → salesInvoices | Draft → Confirmed → Posted |
| Sales Quote | salesQuotes | Draft → Sent → Accepted/Rejected |
| Reservation | salesOrders (Type=Order) | Draft → Reserved → Converted |
| Deposit | prepayments | Draft → Confirmed → Applied |
| Credit Memo | salesCreditMemos | Draft → Approved → Posted |
| Shipment | salesShipments | Pending → Shipped → Posted |

</details>

<details>
<summary><b>Warehouse Module (7 หน้าจอ)</b></summary>

| หน้าจอ | BC Entity | Status Flow |
|--------|-----------|-------------|
| Queue / Dashboard | transferOrders, purchaseOrders | - |
| Goods Receipt (GRN) | postedPurchaseReceipts | Draft → Confirmed → Posted |
| Transfer Request | transferOrders | Draft → Submitted → Approved |
| Transfer Order | transferShipments | Draft → Approved → Shipped → Received |
| Sales Issue | salesShipments | Pending → Picked → Shipped |
| Serial Entry | itemTrackingEntries | - |
| Stock Count | physInventoryJournal | Draft → Counted → Adjusted |

</details>

<details>
<summary><b>Purchase Module (7 หน้าจอ)</b></summary>

| หน้าจอ | BC Entity | Status Flow |
|--------|-----------|-------------|
| Queue / Dashboard | purchaseOrders, vendors | - |
| Vendor Onboarding | vendors | Draft → Review → Approved |
| Purchase Requisition | purchaseRequisitions | Draft → Approved → Converted |
| RFQ & Compare | purchaseQuotes | Open → Bidding → Awarded |
| Purchase Order | purchaseOrders | Draft → Approved → Released → Received |
| AP Invoice | purchaseInvoices | Draft → Matched → Posted |
| Deposit Bill | vendorPrepayments | Draft → Confirmed → Applied |

</details>

---

## 🎨 Design Patterns

### หลักการออกแบบ 7 ข้อ

| # | Principle | คำอธิบาย |
|---|-----------|---------|
| 1 | **Information Density** | แสดงข้อมูลสำคัญครบในจอเดียว |
| 2 | **Minimal Clicks** | พิมพ์รหัสตรงถ้ารู้, ค้นหาถ้าไม่รู้ |
| 3 | **Progressive Disclosure** | รายละเอียดเพิ่มเติมแสดงเมื่อต้องการ |
| 4 | **Consistent Layout** | โครงสร้างเดียวกันทุกโมดูล |
| 5 | **Keyboard Friendly** | Tab/Enter นำทางได้ครบ |
| 6 | **Bilingual Ready** | รองรับไทย/English ทุกฟิลด์ |
| 7 | **Visual Hierarchy** | ข้อมูลสำคัญเด่นชัด |

### Pattern ที่ใช้ในระบบ

| Pattern | ใช้ที่ไหน | รายละเอียด |
|---------|----------|-----------|
| **ERP Transaction Form** | บิลขาย, PO, ใบโอน | Header → Lines → Footer |
| **Master-Detail** | ค้นหาสินค้า/ลูกค้า | เลือกบน → แสดงรายละเอียดล่าง |
| **Lookup Dialog** | เลือกข้อมูลอ้างอิง | Popup ค้นหาและเลือก |
| **Data Grid** | รายการสินค้า | ตาราง Editable หลายแถว |
| **Tabbed Panel** | รายละเอียดเพิ่มเติม | สลับมุมมอง Tab |

### ERP Transaction Form Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  1. PAGE HEADER — เลขที่เอกสาร, สถานะ, สาขา, วันที่              │
├─────────────────────────────────────────────────────────────────┤
│  2. DOCUMENT HEADER — กลุ่มเอกสาร, ประเภทราคา, พนักงานขาย        │
├─────────────────────────────────────────────────────────────────┤
│  3. CUSTOMER/VENDOR — Lookup + Credit Status                   │
├─────────────────────────────────────────────────────────────────┤
│  4. LINE ITEMS — Data Grid รายการสินค้า                         │
├─────────────────────────────────────────────────────────────────┤
│  5. ADDITIONAL TABS — จัดส่ง | หมายเหตุ | อ้างอิง | มัดจำ         │
├─────────────────────────────────────────────────────────────────┤
│  6. SUMMARY FOOTER — ยอดรวม, ส่วนลด, VAT, Grand Total           │
├─────────────────────────────────────────────────────────────────┤
│  7. ACTION BAR — [ยกเลิก] [บันทึก] [ยืนยัน] [พิมพ์]              │
└─────────────────────────────────────────────────────────────────┘
```

### Pattern นี้ใช้ได้กับทุกโมดูล

| Section | Sales | Purchase | Warehouse | Service |
|---------|-------|----------|-----------|---------|
| Section 2 | ลูกค้า | เจ้าหนี้ | คลังต้นทาง→ปลายทาง | ลูกค้า |
| Section 4 | สินค้า+ราคาขาย | สินค้า+ราคาซื้อ | สินค้า+Serial | อะไหล่+ค่าแรง |
| Section 6 | ยอดขาย+VAT | ยอดซื้อ+WHT | จำนวนรวม | ค่าบริการ |

---

## 🧩 Shared Components

### 9 Shared Components (SC1-SC9)

| รหัส | ชื่อ | หน้าที่ | ใช้ในโมดูล |
|------|-----|-------|-----------|
| **SC1** | CustomerSearch | ค้นหา/เลือกลูกค้า, Quick-Create, แสดงเครดิต | Sales, Service, Finance |
| **SC2** | ItemSearch | ค้นหาสินค้า, สต็อก real-time, สินค้าทดแทน | Sales, WH, PO, Service |
| **SC3** | Payment | เลือกวิธีชำระ, Split Payment, เงินทอน | Sales, Finance |
| **SC4** | Delivery | ที่อยู่จัดส่ง, วันนัดส่ง, ติดตั้ง Y/N | Sales, PO |
| **SC5** | DocReference | อ้างอิงเอกสารต้นทาง, Document Chain | ทุกโมดูล |
| **SC6** | Deposit | แสดง/เลือก/หักมัดจำ | Sales, PO |
| **SC7** | Timeline | ประวัติเอกสาร, Log, Comment, แนบไฟล์ | ทุกโมดูล |
| **SC8** | SerialNumber | กรอก/scan Serial, validate ซ้ำ | Sales, WH, Service |
| **SC9** | PromoPrice | คำนวณราคา/โปร, Accrual hook | Sales, Promo |

### Component Usage Matrix

| Module | SC1 | SC2 | SC3 | SC4 | SC5 | SC6 | SC7 | SC8 | SC9 |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Sales | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Warehouse | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Purchase | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Service | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Finance | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Promotion | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Master | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## 🔄 Development Workflow

### 3-Phase Development Method

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   PHASE 1       │     │   PHASE 2       │     │   PHASE 3       │
│   RESEARCH      │────▶│   PLANNING      │────▶│   IMPLEMENT     │
│                 │     │                 │     │                 │
│ • อ่านเอกสาร      │     │ • Task breakdown│     │ • Develop       │
│ • วิเคราะห์ Gap   │     │ • Review plan   │     │ • Test          │
│ • สร้าง research │     │ • Approve       │     │ • UAT           │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Task Status Legend

| Status | Symbol | ความหมาย |
|--------|--------|---------|
| Todo | `[ ]` | ยังไม่ได้ทำ |
| Blocked | `[?]` | รอตัดสินใจ / มี Open Question |
| In Progress | `[~]` | กำลังทำ |
| Done | `[x]` | เสร็จแล้ว |
| Blocked Critical | `[!]` | Blocked — ต้องแก้ก่อน |

### Git Branch Strategy

```
main
 └── develop
      ├── feature/sales-invoice
      ├── feature/sc1-customer-search
      ├── feature/warehouse-grn
      └── hotfix/xxx
```

### Commit Message Format

```
<type>(<scope>): <subject>

feat(sales): add invoice creation form
fix(sc2): resolve stock calculation bug
docs(readme): update component diagram
refactor(api): simplify BC365 client
```

---

## 📁 โครงสร้างไฟล์เอกสาร

### Project Knowledge Files

| ไฟล์ | ประเภท | เนื้อหา |
|------|-------|--------|
| `research.md` | Research | สรุป Requirements, Open Questions, RBAC, Non-functional |
| `plan.md` | Planning | Task breakdown ทุก Phase, Checklist, Risk |
| `ui_design_pattern_guideline.md` | Design | UI Patterns, Prompt Templates |

### Specification Documents

| ไฟล์ | ประเภท | เนื้อหา |
|------|-------|--------|
| `uxui_field_knowledge.docx` | UX/UI | Field Spec ทุกหน้าจอ, SC Mapping |
| `component_fw_clean.docx` | Architecture | Props/Events/State/API ของ SC1-SC9 |
| `sangwijit_reference_rev2.docx` | Business | Workflow, Gap Analysis, Field Table |

### Data Dictionary (by Phase)

| ไฟล์ | Phase | โมดูล |
|------|-------|------|
| `dd_sales_phase1.docx` | 1 | Sales |
| `dd_wh_pur_phase2.docx` | 2 | Warehouse, Purchase |
| `dd_finance_phase3.docx` | 3 | Finance |
| `dd_svc_promo_master_phase4.docx` | 4 | Service, Promotion, Master |

### Legacy System Reference

| ไฟล์ | เนื้อหา |
|------|--------|
| `old_system_knowledge_base.docx` | สรุประบบเดิม HERO/TPM ทุกแผนก |

### Developer Workflow Diagrams (PDF)

```
/project
├── 00_Sales__Queues__Dashboard.pdf
├── 01_Sales__Sales_Quote.pdf
├── 02_Sales__Sales_Order.pdf
├── ...
├── 00_Warehouse__Dashboard.pdf
├── 01_Warehouse__Transfer_Order.pdf
├── ...
└── 00_Purchase__Dashboard.pdf
```

---

## 🔐 RBAC & Permissions

### Role Matrix

| Role | Sales | WH | Purchase | Service | Finance | Promo | Master |
|------|:-----:|:--:|:--------:|:-------:|:-------:|:-----:|:------:|
| Sales Staff | ✏️ | 👁 | ❌ | ❌ | ❌ | 👁 | ❌ |
| Sales Admin | ✅ | 👁 | ❌ | ❌ | ❌ | 👁 | ❌ |
| WH Staff | 👁 | ✏️ | 👁 | ❌ | ❌ | ❌ | ❌ |
| WH Supervisor | 👁 | ✅ | 👁 | ❌ | ❌ | ❌ | ❌ |
| Purchaser | ❌ | 👁 | ✏️ | ❌ | ❌ | 👁 | ❌ |
| Service Tech | ❌ | ❌ | ❌ | ✏️ | ❌ | ❌ | ❌ |
| Service Admin | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| AR Staff | 👁 | ❌ | ❌ | ❌ | ✏️AR | ❌ | ❌ |
| AP Staff | ❌ | ❌ | 👁 | ❌ | ✏️AP | ❌ | ❌ |
| Finance Manager | 👁 | 👁 | 👁 | 👁 | ✅ | 👁 | ❌ |
| Price Admin | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Master Admin | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Approver | 🔑 | 🔑 | 🔑 | 🔑 | 🔑 | 🔑 | 🔑 |
| Auditor | 👁 | 👁 | 👁 | 👁 | 👁 | 👁 | 👁 |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend:** ✅ Full | ✏️ Create/Edit | 👁 View | 🔑 Approve | ❌ No Access

### Permission Rules

| Rule | รายละเอียด |
|------|-----------|
| **Maker ≠ Checker** | ห้าม Approve งานตัวเอง (บังคับทุกโมดูลที่มี Approval) |
| **Field-Level** | ราคาต้นทุน / วงเงินเครดิต → ซ่อนตาม Role |
| **Route Guard** | ป้องกัน URL access ที่ไม่มีสิทธิ์ |
| **Data Scope** | Sales Staff เห็นเฉพาะสาขาตัวเอง |

---

## 🔗 BC365 API Integration

### API Endpoints (ตัวอย่าง)

| Entity | Endpoint | Methods |
|--------|----------|---------|
| Customers | `/api/v2.0/customers` | GET, POST, PATCH |
| Items | `/api/v2.0/items` | GET, POST, PATCH |
| Sales Orders | `/api/v2.0/salesOrders` | GET, POST, PATCH, DELETE |
| Sales Invoices | `/api/v2.0/salesInvoices` | GET, POST |
| Purchase Orders | `/api/v2.0/purchaseOrders` | GET, POST, PATCH |
| Transfer Orders | `/api/v2.0/transferOrders` | GET, POST, PATCH |
| Item Ledger | `/api/v2.0/itemLedgerEntries` | GET |
| General Journal | `/api/v2.0/generalJournals` | GET, POST |

### Integration Strategy

```
Portal (Frontend)
       │
       ▼
API Service Layer ◄─── Retry Queue / Error Handler
       │
       ▼
BC365 REST API ◄─── Service Account (ลด License)
       │
       ▼
BC365 Database (System of Record)
```

### BC Extensions Required

| Extension | ใช้ใน | Phase |
|-----------|------|-------|
| Promotion Engine | SC9, Sales, Promo | 1 |
| Accrual Tracking | Purchase, Finance | 1 |
| Prepayment/Deposit | Sales | 1 |
| Service Order | Service | 2 |
| Warranty Tracking | Service, Claims | 2 |

---

## 📝 Coding Standards

### Naming Conventions

| Layer | Format | ตัวอย่าง |
|-------|--------|---------|
| Page Component | PascalCase + Page | `SalesInvoicePage.vue` |
| Shared Component | Shared + PascalCase | `SharedCustomerSearch.vue` |
| Base Component | Base + PascalCase | `BaseInput.vue` |
| API Service | camelCase + Service | `salesOrderService.ts` |
| Store/State | camelCase + Store | `salesStore.ts` |

### File Structure

```
/src
├── /pages
│   ├── /sales
│   │   ├── SalesInvoicePage.vue
│   │   ├── QuotationPage.vue
│   │   └── ...
│   ├── /warehouse
│   ├── /purchase
│   └── ...
├── /components
│   ├── /shared
│   │   ├── SharedCustomerSearch.vue (SC1)
│   │   ├── SharedItemSearch.vue (SC2)
│   │   └── ...
│   ├── /base
│   │   ├── BaseInput.vue
│   │   ├── BaseTable.vue
│   │   └── ...
│   └── /layout
│       ├── AppShell.vue
│       ├── PageHeader.vue
│       └── ActionBar.vue
├── /services
│   ├── bcApiClient.ts
│   ├── salesService.ts
│   ├── customerService.ts
│   └── ...
├── /stores
│   ├── salesStore.ts
│   ├── userStore.ts
│   └── ...
├── /types
│   ├── sales.types.ts
│   ├── customer.types.ts
│   └── ...
└── /utils
    ├── formatters.ts
    ├── validators.ts
    └── ...
```

### Code Quality Rules

> ⚠️ **เป็น target stack ของ production (Phase 2+) — ยังไม่มีใน repo ตอนนี้.** เฟส mockup ปัจจุบันเป็น static HTML ล้วน ไม่มี TypeScript/ESLint/Jest ให้รัน. dev เฟสนี้ verify ด้วยการเปิดเบราว์เซอร์ดูหน้าจริง (ดู [`dev-start.html`](dev-start.html))

| Rule | รายละเอียด |
|------|-----------|
| TypeScript | Strict mode, No any |
| ESLint | Airbnb + Vue3 rules |
| Prettier | Auto format on save |
| Unit Test | Jest, Coverage > 80% |
| E2E Test | Cypress/Playwright |

---

## 🚀 Getting Started

> 🚀 **เริ่มที่นี่:** เปิด [`dev-start.html`](dev-start.html) — คู่มือ onboarding + ลำดับการอ่านทั้งหมดสำหรับ dev ใหม่

### Prerequisites

- เว็บเบราว์เซอร์ (Chrome / Edge) — เปิด mockup ได้เลย
- Git — repo อยู่บน OneDrive แต่ **GitHub คือ source of truth**
- **ไม่ต้องใช้ Node.js / npm** — โปรเจกต์นี้เป็น **static HTML mockup** ไม่มี build system / package manager / test runner

### เปิดดู & เริ่มงาน

```bash
# ดึงของล่าสุดก่อนเริ่มเสมอ
git pull

# เปิดดูระบบ — ดับเบิลคลิกไฟล์ หรือ (Windows)
start index.html

# แก้ mockup = เปิดไฟล์ *.html แก้ในตัว → เซฟ → refresh เบราว์เซอร์ (ไม่มี dev server)
# ของกลางอยู่ที่ swt-*.js / swt-patterns.css (แก้ที่เดียวกระทบทุกหน้า)

# จบงาน — ทยอย commit + push ให้อีกเครื่อง/GitHub เห็น
git add -A ; git commit -m "…" ; git push
```

> ℹ️ **Phase 1 ยังไม่ wire BC365** — mockup ทำงานแบบ static ล้วน (ยังไม่มี `.env` / API / service account). ส่วน BC365 API ด้านบนคือแผนสำหรับ Phase ต่อไป

### Before Development

1. **อ่านเอกสารก่อนเสมอ**
   - `research.md` — ภาพรวม, Open Questions
   - `plan.md` — Task breakdown
   - `ui_design_pattern_guideline.md` — Design patterns

2. **ตรวจสอบ Open Questions**
   - ดู Section 9 ใน `research.md`
   - ห้าม implement ส่วนที่มี `[?]` จนกว่าจะได้คำตอบ

3. **ใช้ Shared Components**
   - ตรวจสอบว่ามี SC ที่ต้องใช้หรือยัง
   - ถ้ายังไม่มี → พัฒนา SC ก่อน Page

### Development Checklist

```markdown
[ ] อ่าน research.md + plan.md
[ ] ตรวจสอบ Open Questions ที่เกี่ยวข้อง
[ ] ดู Data Dictionary ของหน้าจอนั้น
[ ] ตรวจสอบ Shared Components ที่ต้องใช้
[ ] ดู Workflow Diagram (PDF)
[ ] พัฒนาตาม Design Pattern
[ ] เปิดเบราว์เซอร์ตรวจหน้าจริง (ไม่มี test runner — verify by observation)
[ ] ถ้าแตะ shared component → เช็ค chain regression
[ ] Self-review ก่อน commit/push
```

---

## 📞 Contact & Support

| Role | Contact |
|------|---------|
| Project Owner | [Peerapat] |
| Tech Lead | [TBD] |
| BC365 Consultant | [TBD] |

---

## 📄 License

Proprietary - Sangwijit Group © 2024-2026

---

*Last Updated: 2026-02-23*
