# MD — Master Data Module Spec (ข้อมูลหลัก)

**Version:** 1.0  
**Phase:** P1  
**Module Code:** MD  
**Last Updated:** 2026-04-12

---

## Overview

The Master Data module manages reference data (items, customers, vendors, employees, locations) that are created and maintained by business users. This is distinct from System Config (CF module), which is admin-only setup of system parameters.

**Key Principle:** Master Data = User-created business entities. System Config = Admin system setup (rarely changes).

**Portal Role:** Portal provides user-friendly UI for creating/editing master data; all data syncs to BC via REST API.

---

## BC Entities & Field Counts

| Entity | BC Table | Portal Cardinality | Fields | Read/Write |
|--------|----------|------------------|--------|-----------|
| Item Master | `Item` (27) | ~10,000 items | 80+ fields; Portal uses 25 key fields | RW |
| Customer Master | `Customer` (18) | ~5,000 customers | 90+ fields; Portal uses 35 key fields | RW |
| Vendor Master | `Vendor` (23) | ~2,000 vendors | 85+ fields; Portal uses 30 key fields | RW |
| Employee Master | `Employee` (custom) | ~500 employees | 40+ fields; Portal uses 25 key fields | RW |
| Location Master | `Location` (14) + Warehouse extensions | ~100 locations | 50+ fields; Portal uses 20 key fields | RW |

---

## Menu Structure & Module Specifications

### MD-1: Item Master (สินค้า)

**Module Brief:**  
Create and maintain inventory items, services, and configurable products. Central reference for all sales, purchase, and warehouse operations.

**Key Fields:**

| Field | Data Type | Mandatory | Searchable | Notes |
|-------|-----------|-----------|-----------|-------|
| Item Code | Text(20) | ✓ | ✓ | User-defined or auto-generate; unique |
| Description (EN) | Text(100) | ✓ | ✓ | English name for system |
| Description (TH) | Text(100) | ✓ | ✓ | Thai name for local display |
| Item Category | Lookup | ✓ | ✓ | Links to Item Category table |
| Item Type | Choice | ✓ | — | Inventory / Service / Fixed Asset / Non-Inventory |
| Unit of Measure (Base) | Lookup | ✓ | — | PCS / BOX / SET / KG / etc. (from UOM table) |
| Alternative UOM | Lookup | ✗ | — | For alternate purchasing/selling UOM |
| Serial Number Tracking | Boolean | ✓ | — | True = Serial #, Lot # required on each receipt |
| Barcode | Text(50) | ✗ | ✓ | EAN-13 or custom internal barcode |
| Barcode Type | Choice | ✗ | — | EAN-13 / UPC / QR / Custom |
| Cost Price (Standard) | Currency | ✓ if Inventory | — | Hidden from Sales role; visible to Finance |
| Reorder Point | Number | ✓ if Inventory | — | Min qty to trigger purchase order |
| Reorder Qty | Number | ✓ if Inventory | — | Standard order qty when reordering |
| Lead Time (Days) | Number | ✗ | — | Supplier lead time estimate |
| Inventory Posting Group | Lookup | ✓ | — | Determines GL accounts (CF-4 Posting Group) |
| Revenue Posting Group | Lookup | ✓ | — | GL account for sales revenue |
| Item Discount Group | Lookup | ✗ | — | For bulk discount applicability (PM module) |
| Tax Category | Lookup | ✗ | — | VAT rate (7% / 10% / Exempt / etc.) |
| Supplier Code (Primary) | Lookup | ✗ | — | Default vendor for replenishment |
| Active | Boolean | ✓ | — | True = available in transactions; False = archived |
| Effective From | Date | ✗ | — | Item availability start date |
| Effective To | Date | ✗ | — | Item discontinuation date |
| Manufacturer Code | Text(20) | ✗ | — | MPN (Manufacturer Part Number) |
| Weight (KG) | Decimal | ✗ | — | For shipping calculation |
| Dimension (L×W×H cm) | Text | ✗ | — | For warehouse bin allocation |
| Image URL | Text | ✗ | — | Product image for POS/E-commerce |
| Short Description | Text(500) | ✗ | — | For POS/marketplace display |
| Long Description | Text(2000) | ✗ | — | Detailed product description |
| Warranty Period (Months) | Number | ✗ | — | Default warranty if applicable |
| Country of Origin | Lookup | ✗ | — | For customs/duty calculation |

**Create/Edit Workflow:**
- **Who Can Create:** Warehouse Manager, Inventory Manager, System Admin
- **Who Can Edit:** Warehouse Manager, Inventory Manager (Draft items); System Admin (all)
- **Approval Required:** No; created items become active immediately
- **Archived:** Set Active=False; old records retained for history

**Key Business Rules:**
- Item Code must be unique; cannot be reused even if item is archived
- Cost Price field hidden from Sales role via field-level permission (CF-3)
- Serial Tracking flag = True → Barcode becomes required
- If Effective To date < today, item auto-marked as inactive (batch job, nightly)
- Item cannot be deleted; must archive (set Active = False)
- Changing Item Category or Posting Group: only allowed if item has zero current inventory
- Supplier code change triggers notification to Purchase Manager (audit log)

**Status:**
- Active (can transact) / Inactive (archived, read-only)

**Related Components:**
- SC2 (ItemSearch) — uses Item Master data
- SC8 (SerialPanel) — for serial/lot tracking
- PM module — uses Item for price lists & promotions
- PO module — uses Item for purchase orders
- SO module — uses Item for sales orders
- WH module — uses Item for inventory management

**BC API Calls:**
```
POST /api/companies/{id}/items
PATCH /api/companies/{id}/items/{id}
GET /api/companies/{id}/items?$filter=active eq true&$orderby=description
GET /api/companies/{id}/items?$search={searchTerm}
GET /api/companies/{id}/items/{id}?$expand=category,uom,postingGroup
GET /api/companies/{id}/itemCategories
GET /api/companies/{id}/unitsOfMeasure
GET /api/companies/{id}/itemDiscountGroups
PATCH /api/companies/{id}/items/{id}?$select=active,effectiveTo (for status update)
```

**Important Field-Level Permissions (CF-3 config):**
- Cost Price: Hidden from Sales, Salesperson roles; visible to Finance Manager, Admin
- Inventory Posting Group: Read-only for non-admin
- Lead Time: Visible to Procurement only

---

### MD-2: Customer Master (ลูกค้า)

**Module Brief:**  
Register and manage customer information including KYC (Know Your Customer), credit limits, address types, and customer classifications.

**Key Fields — Identification & KYC:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Customer No. | Text(20) | ✓ | User-defined or auto-generate; unique |
| Name (EN) | Text(100) | ✓ | Legal name in English |
| Name (TH) | Text(100) | ✓ | Legal name in Thai |
| Customer Type | Choice | ✓ | Individual / Company / Government / Non-Profit |
| Tax ID (เลขประจำตัวผู้เสียภาษีอากร) | Text(13) | ✓ | Thai tax registration number |
| ID Type | Choice | ✓ | Thai ID Card / Passport / Company Registration / Other |
| ID Number | Text(30) | ✓ | National ID or equivalent |
| ID Expiry Date | Date | ✓ | KYC compliance |
| Date of Birth | Date | ✗ | For individual customers |
| Business Registration No. | Text(30) | ✗ | For company customers |
| Business Sector | Lookup | ✗ | Restaurant / Retail / Hospital / Manufacturing / etc. |
| Contact Person Name | Text(100) | ✗ | Primary contact name |
| Contact Person Phone | Text(20) | ✗ | Direct phone |
| Contact Person Email | Text(100) | ✗ | Direct email |

**Key Fields — Address & Location:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Primary Address | Text(500) | ✓ | Billing address |
| Primary Address Postal Code | Text(10) | ✓ | For VAT compliance |
| Primary Address Province | Lookup | ✓ | Thai province list |
| Delivery Address | Text(500) | ✓ | Shipping address (may differ) |
| Delivery Postal Code | Text(10) | ✓ | |
| Delivery Province | Lookup | ✓ | |
| Tax Invoice Address | Text(500) | ✓ | Legally required address for tax doc |
| Tax Invoice Postal Code | Text(10) | ✓ | |
| Tax Invoice Province | Lookup | ✓ | |

**Key Fields — Credit & Business Terms:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Credit Limit (THB) | Currency | ✓ | Maximum outstanding balance |
| Currency Code | Choice | ✓ | THB / USD / etc. |
| Price Group | Lookup | ✓ | Links to Price List variant |
| Customer Discount Group | Lookup | ✗ | For bulk discount programs |
| Customer Classification | Choice | ✓ | Wholesale / Retail / Distributor / Internal |
| Payment Terms | Lookup | ✓ | Net 30 / COD / Advance / 2/10 Net 30 / etc. |
| Default Payment Method | Choice | ✗ | Bank Transfer / Credit Card / Cash / Check |
| Bank Account (for credit note) | Text(50) | ✗ | For refund purposes |
| Blocked | Boolean | ✓ | False=Active, True=Blocked (no new orders) |
| Block Reason | Text(200) | ✗ | If Blocked=True; e.g., "Delinquent payment" |
| Active | Boolean | ✓ | Soft delete |

**Key Fields — Compliance & Marketing:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Email (Primary) | Text(100) | ✓ | For invoices, communication |
| Email (Secondary) | Text(100) | ✗ | Alternative email |
| Phone | Text(20) | ✓ | Primary phone |
| Fax | Text(20) | ✗ | Fax number if applicable |
| Tax Exemption Code | Lookup | ✗ | VAT exemption reason (if applicable) |
| Withholding Tax (WHT) Applicable | Boolean | ✗ | Deduct WHT on payments |
| WHT Rate (%) | Decimal | ✗ | Default WHT % per CF-1 (Tax Setup) |
| Marketing Consent | Boolean | ✗ | PDPA: opt-in for marketing emails |
| Data Sharing Consent | Boolean | ✗ | PDPA: consent for data sharing |
| Language Preference | Choice | ✗ | EN / TH (for document language) |
| CRM ID | Text(50) | ✗ | Link to external CRM if applicable |

**Create/Edit Workflow:**
- **Who Can Create:** Sales, Sales Manager, System Admin (no approval required)
- **Who Can Edit:** Sales (own region if assigned), Sales Manager (all), System Admin
- **KYC Validation:** ID number + Tax ID must be validated (cross-check with BC)
- **Credit Limit Changes:** Increases >10% require Sales Manager approval
- **Blocked Status Changes:** Require Sales Manager or Finance Manager

**Status Flow:**
- New (Draft) → Active (can transact) → Blocked (no new orders, pay existing) → Inactive (archived)

**Important Business Rules:**
- Customer No. must be unique; cannot be reused
- Tax ID uniqueness enforced (no duplicate tax IDs allowed)
- Primary Address, Delivery Address, and Tax Invoice Address must all be filled (Thai business requirement)
- If Credit Limit = 0, customer must pay COD (Cash on Delivery)
- If Blocked = True, system prevents new SO creation (error message)
- Address changes require re-verification if customer's tax rate changes
- Payment Terms on customer must match available terms in CF-1
- Email field used for document distribution (e-invoice)
- Active=False (archived customer) cannot be used in new transactions
- Customer cannot be deleted; must be archived

**Related Components:**
- SC1 (CustomerSearch) — uses Customer Master data
- SC3 (PaymentPanel) — payment terms, credit limit
- PM module — applies customer-specific price lists
- SO module — customer lookup
- AR module — credit limit check, payment terms
- IA module — API sync monitoring

**BC API Calls:**
```
POST /api/companies/{id}/customers
PATCH /api/companies/{id}/customers/{id}
GET /api/companies/{id}/customers?$filter=blocked eq false&$orderby=name
GET /api/companies/{id}/customers?$search={searchTerm}
GET /api/companies/{id}/customers/{id}?$expand=priceGroup,discountGroup,paymentTerms
GET /api/companies/{id}/priceGroups
GET /api/companies/{id}/customerDiscountGroups
GET /api/companies/{id}/paymentTerms
GET /api/companies/{id}/taxRates
PATCH /api/companies/{id}/customers/{id}/block (to update Blocked status)
GET /api/companies/{id}/postCode?$filter=code eq '{code}' (validate postal code)
```

**Field-Level Permissions (CF-3):**
- Tax ID: Visible to Finance/Admin only (PII sensitivity)
- Credit Limit: Hidden from Sales role; visible to Finance Manager, Admin
- Bank Account: Hidden from Sales; visible to Finance, Admin
- ID Number: Hidden from general Sales; visible to Finance, Admin, KYC officer
- Withholding Tax Rate: Read-only for non-admin

---

### MD-3: Vendor Master (ผู้จำหน่าย)

**Module Brief:**  
Register and manage suppliers with payment terms, bank details, WHT classification, and vendor ratings.

**Key Fields — Identification & Contact:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Vendor No. | Text(20) | ✓ | User-defined or auto-generate; unique |
| Name (EN) | Text(100) | ✓ | Vendor legal name |
| Name (TH) | Text(100) | ✓ | Thai name if applicable |
| Vendor Type | Choice | ✓ | Direct Supplier / Distributor / Service Provider |
| Tax ID | Text(13) | ✓ | Vendor's tax registration |
| Contact Person | Text(100) | ✓ | Primary contact name |
| Contact Phone | Text(20) | ✓ | Direct phone |
| Contact Email | Text(100) | ✓ | Direct email |
| Website | Text(200) | ✗ | Vendor website URL |

**Key Fields — Address & Terms:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Address | Text(500) | ✓ | Business address |
| Postal Code | Text(10) | ✓ | |
| Province | Lookup | ✓ | Thai province |
| Country | Lookup | ✓ | Default: Thailand |
| Payment Terms | Lookup | ✓ | Net 30 / COD / 2/10 Net 30 / Advance / etc. |
| Currency | Choice | ✓ | THB / USD / etc. |
| Default Item Category (Specialty) | Lookup | ✗ | Primary product category supplied |
| Delivery Lead Time (Days) | Number | ✓ | Standard delivery days |
| Minimum Order Value | Currency | ✗ | Minimum PO value if applicable |

**Key Fields — Payment & Financial:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Bank Name | Text(100) | ✓ | Vendor's bank |
| Bank Account Number | Text(30) | ✓ | Vendor's account for payment |
| Bank Account Holder | Text(100) | ✓ | Account owner name |
| SWIFT Code | Text(20) | ✗ | For international payments |
| Withholding Tax Applicable | Boolean | ✓ | Is WHT deducted on payments? |
| WHT Category | Lookup | ✓ | % Category (3% / 5% / 1% / etc. per CF-1) |
| Tax Exemption Code | Lookup | ✗ | If tax-exempt supplier |

**Key Fields — Classification & Compliance:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Preferred Vendor | Boolean | ✗ | Priority in PO creation |
| Vendor Rating | Choice | ✓ | A (Excellent) / B (Good) / C (Acceptable) / D (Poor) |
| Blocked | Boolean | ✓ | False=Active, True=Blocked (no new PO) |
| Block Reason | Text(200) | ✗ | If Blocked=True |
| Active | Boolean | ✓ | Soft delete flag |
| Certifications | Text(500) | ✗ | ISO / HALAL / etc. |
| Documents Verified | Boolean | ✓ | Tax ID, Bank Account verified by Finance |
| Verification Date | Date | ✗ | When documents were last verified |

**Create/Edit Workflow:**
- **Who Can Create:** Procurement Manager, System Admin
- **Who Can Edit:** Procurement Manager, Finance (for bank details), System Admin
- **Bank Detail Changes:** Require Procurement Manager + Finance Manager approval
- **Verification:** Finance must verify Tax ID + Bank Account before paying

**Status Flow:**
- New (Draft) → Active → Blocked (no new PO) → Inactive (archived)

**Important Business Rules:**
- Vendor No. must be unique
- Tax ID uniqueness enforced
- Bank Account and Account Holder name must match (validate with PO module)
- If Blocked = True, system prevents new PO creation
- WHT Category must align with tax rate in CF-1
- Vendor Rating drives procurement prioritization:
  - A Rating: Preferred in RFQ process
  - C/D Rating: Manual approval required for large PO
- Payment Terms on vendor must be available in CF-1
- Documents Verified = True before first payment (GL posting requires this)
- Vendor cannot be deleted; must be archived (set Active = False)
- Bank details changes flagged for 3-way match audit before payment

**Related Components:**
- PO module — vendor lookup, payment terms, WHT deduction
- AP (Accounts Payable) — vendor master integration
- IA module — API sync

**BC API Calls:**
```
POST /api/companies/{id}/vendors
PATCH /api/companies/{id}/vendors/{id}
GET /api/companies/{id}/vendors?$filter=blocked eq false&$orderby=name
GET /api/companies/{id}/vendors?$search={searchTerm}
GET /api/companies/{id}/vendors/{id}?$expand=paymentTerms,whtCategory
GET /api/companies/{id}/paymentTerms
GET /api/companies/{id}/taxRates
PATCH /api/companies/{id}/vendors/{id}/updateVerification
GET /api/companies/{id}/vendors?$filter=rating eq 'A' (for RFQ filtering)
```

**Field-Level Permissions (CF-3):**
- Bank Account: Hidden from non-Finance roles; visible to Finance, Admin
- Bank Account Holder: Visible to Finance, Admin only
- Documents Verified: Visible to Finance, Procurement, Admin
- Verification Date: Visible to Finance, Procurement, Admin

**Grill V — decisions (2026-07 · mockup `md3-vendor-master-mockup-v3.html`):**
- **Parity กับ MD-2** (ลูกค้า) — fit-100vh · profile card + 5 tabs · quick-create banner
- **Dup-check เชิงรุกด้วยเลขผู้เสียภาษี** — พิมพ์ Tax ID → เตือนทันทีถ้าซ้ำ vendor เดิม (กันเปิดซ้ำ **ก่อน** submit ไม่ใช่รอ BC reject)
- **Field 4 เลเยอร์** (marker เดียวกับ MD-2):
  - 🟢 **API v2.0** — create/update ผ่าน standard endpoint ได้เต็ม
  - 🔵 **dimension-table** — กลุ่ม/มิติ → `defaultDimensions` entity (ไม่ทำ master ซ้ำในพอร์ทัล)
  - 🟠 **custom SWT** — table ext + custom API page ใหม่: **สาขาภาษี (TaxBranch)** · คำนำหน้าไทย · **PersonType** · rebate
  - ⚠️ **"เครดิตวัน" = Payment Terms (FK)** ไม่ใช่ตัวเลข → แปลงก่อน bind
- **แท็บเอกสาร = roll-up read** (ไม่ใช่ upload ที่ master) — ไฟล์แนบจริงฝังที่ **transaction** (Onboarding/PO) ผ่าน SC13 · master แค่ดึงมาแสดงรวม (ดู MD-Media / Grill M)

---

### MD-Media: รูปสินค้า & เอกสารแนบ (Grill M · SC12/SC13)

> แยกตาม **จุดแนบ (attach point)** — decision Grill M: **รูปสินค้าฝังที่ master · เอกสารฝังที่ transaction** (ไม่รวมเป็น component เดียว)

**SC12 SharedGallery — รูป/วิดีโอสินค้า (master-level):**
- ฝังที่ **MD-1 Item Master** · main image + thumbnails + reorder + วิดีโอ (อัปไฟล์/YouTube)
- Storage: ไฟล์จริง → **Azure Blob (public CDN)** → reuse ทำหน้าเว็บขายต่อได้ · BC/portal เก็บแค่ URL/reference (**ไม่เก็บ binary ใน BC**)
- Impl: `swt-gallery.js` — `swtRenderGallery(el,{images,videos})`

**SC13 SharedAttach — เอกสารแนบ (transaction-level):**
- ฝังที่ **transaction**: Onboarding ลูกค้า/ผู้ขาย, PO, WH-5 (ไม่ใช่ master)
- เอกสาร: หนังสือจดทะเบียน, สัญญา MOU, ภ.พ.20, รูปหลักฐาน
- ควบคุมต่อจุดแนบ (config): version (ไม่ทับของเก่า) · audit (ใคร upload/ดู/download) · RBAC · signed URL หมดอายุ — **สัญญา/ภาษี=ครบ · รูปหลักฐาน=เบา**
- Storage: **Azure Blob (private)** · เปิดผ่าน signed URL (SAS · เช็ค RBAC ก่อนออก token)
- Impl: `swt-attach.js` — `swtRenderAttach(el,{docs,config})` · master ดึงมาแสดงแบบ **roll-up read** (เช่น แท็บเอกสารใน MD-3)

---

### MD-4: Employee Master (พนักงาน) — NEW in Portal

**Module Brief:**  
Manage employee records for commission tracking, sales assignment, technician skills, and workflow routing.

**Key Fields:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Employee No. | Text(20) | ✓ | Unique; from HR system or auto-generated |
| First Name (EN) | Text(50) | ✓ | English name |
| Last Name (EN) | Text(50) | ✓ | English surname |
| First Name (TH) | Text(50) | ✓ | Thai name |
| Last Name (TH) | Text(50) | ✓ | Thai surname |
| Email | Text(100) | ✓ | Corporate email (unique) |
| Phone | Text(20) | ✓ | Office/mobile number |
| Department | Lookup | ✓ | Sales / Service / Warehouse / Admin / etc. |
| Position | Lookup | ✓ | Job title (Sales Manager, Technician, etc.) |
| Manager Code | Lookup | ✓ | Reports to (for approval routing) |
| Branch Code | Lookup | ✓ | Assigned branch (MD-5) |
| Cost Center | Lookup | ✗ | For GL posting allocation |
| Commission Type | Choice | ✗ | % of Sales / Flat Amount / Tiered / None |
| Commission Rate (%) | Decimal | ✗ | Default commission % (PM module overrides) |
| Service Technician | Boolean | ✗ | True = can assign service jobs |
| Technician Skills | Multi-select | ✗ | Installation / Repair / Inspection / etc. |
| Salesperson | Boolean | ✗ | True = can own sales orders |
| Sales Territory | Lookup | ✗ | Geographic or customer-based territory |
| User Account Link | Lookup | ✓ | Links to CF-3 Portal login account |
| Active | Boolean | ✓ | False = cannot be assigned to transactions |
| Hire Date | Date | ✓ | Employee start date |
| Termination Date | Date | ✗ | If employee left |

**Create/Edit Workflow:**
- **Who Can Create:** HR Manager, System Admin
- **Who Can Edit:** HR Manager, Department Manager (own employees), System Admin
- **Activation:** Employee becomes available for assignment once Active=True and User Account Link is set

**Important Business Rules:**
- Employee No. must be unique; cannot be reused
- Email must be unique across portal
- Department assignment affects module access (via RBAC in CF-3)
- Manager Code creates approval hierarchy (used in CF-2.6 Approval Matrix)
- Commission Rate can be overridden per quota period in PM-4
- Termination Date, once set, triggers system to mark Active=False
- Service Technician=True requires at least one Technician Skill selected
- Salesperson=True requires Sales Territory assignment
- User Account Link (CF-3) must exist before employee can access portal

**Related Components:**
- CF-3 (RBAC) — User account linking
- CF-2.6 (Approval Matrix) — Manager code for routing
- PM-4 (Quota) — Commission tracking
- Service module — Technician assignment
- SO module — Salesperson assignment
- Commission module — Commission calculation

**BC API Calls:**
```
POST /api/companies/{id}/employees
PATCH /api/companies/{id}/employees/{id}
GET /api/companies/{id}/employees?$filter=active eq true&$orderby=lastName
GET /api/companies/{id}/employees/{id}?$expand=department,position,manager,branch
GET /api/companies/{id}/departments
GET /api/companies/{id}/positions
GET /api/companies/{id}/branches
GET /api/companies/{id}/salesTerritories
```

**Field-Level Permissions (CF-3):**
- Commission Rate: Visible to Finance, HR, Admin; hidden from employee's own view (unless authorized)
- Termination Date: Visible to HR, Admin; read-only for others
- Technician Skills: Visible to Service Manager, Admin

---

### MD-5: Branch & Warehouse Master (สาขาและคลัง) — NEW in Portal

**Module Brief:**  
Define organization's branches and warehouses for location-based filtering across all modules. Used for multi-warehouse, multi-branch support.

**Branch Fields:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Branch Code | Text(10) | ✓ | Unique; e.g., "BKK01", "CNX01" |
| Branch Name (EN) | Text(100) | ✓ | English name |
| Branch Name (TH) | Text(100) | ✓ | Thai name |
| Address | Text(500) | ✓ | Branch street address |
| Postal Code | Text(10) | ✓ | |
| Province | Lookup | ✓ | Thai province |
| Phone | Text(20) | ✓ | Branch main phone |
| Email | Text(100) | ✓ | Branch email |
| Manager (Employee) | Lookup | ✓ | Branch manager (MD-4) |
| Type | Choice | ✓ | Headquarters / Sales Office / Warehouse / Service Center |
| Region | Lookup | ✓ | For sales hierarchy (Central / North / Northeast / South) |
| Active | Boolean | ✓ | False = no new transactions assigned |

**Warehouse Fields:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Warehouse Code | Text(10) | ✓ | Unique; e.g., "WH001", "WH002" |
| Warehouse Name | Text(100) | ✓ | Name or location description |
| Parent Branch | Lookup | ✓ | Assigned to branch (MD-5) |
| Address | Text(500) | ✗ | If warehouse has separate address |
| Warehouse Manager | Lookup | ✓ | Manager (MD-4) |
| Type | Choice | ✓ | Central / Regional / Hub / Spoke |
| Bin Policy Enabled | Boolean | ✓ | True = use WH Bin Policy (CF-5) |
| Bin Policy Code | Lookup | ✗ | Links to CF-5 policy config |
| Stock Counting Frequency | Choice | ✓ | Daily / Weekly / Monthly (for cycle count) |
| Max Capacity (Units) | Number | ✗ | For capacity planning |
| Active | Boolean | ✓ | False = no longer in use |
| Linked Locations (Internal) | Multi-select | ✗ | Drop points, receiving docks, etc. |

**Create/Edit Workflow:**
- **Who Can Create:** Operations Manager, System Admin
- **Who Can Edit:** Operations Manager, Branch Manager (own branch), System Admin
- **Warehouse Changes:** Affecting inventory location require WH Manager + Finance review

**Important Business Rules:**
- Branch Code and Warehouse Code must be unique
- Warehouse must be linked to exactly one Branch
- Branch Manager must be active employee in MD-4
- If Bin Policy Enabled = True, Bin Policy Code must be configured in CF-5
- Changing Warehouse Parent Branch not allowed if warehouse holds inventory
- Branch cannot be deleted; must be archived (Active = False)
- Warehouse cannot be deleted; must be archived
- WH module uses Warehouse Code for inventory location tracking
- SO module uses Branch Code for delivery location filtering
- PO module may default to nearest warehouse per branch

**Related Components:**
- WH module — Warehouse inventory management
- SO module — Branch selection for delivery
- PO module — Warehouse receiving location
- CF-5 (WH Bin Policy) — Warehouse bin configuration
- MD-4 (Employee) — Manager lookups

**BC API Calls:**
```
POST /api/companies/{id}/branches
PATCH /api/companies/{id}/branches/{id}
GET /api/companies/{id}/branches?$filter=active eq true&$orderby=name
GET /api/companies/{id}/warehouses?$filter=parentBranch eq '{branchCode}'
POST /api/companies/{id}/warehouses
PATCH /api/companies/{id}/warehouses/{id}
GET /api/companies/{id}/warehouses/{id}?$expand=parentBranch,binPolicy
GET /api/companies/{id}/regions
```

**Field-Level Permissions (CF-3):**
- Manager Code: Visible to all; used for assignment
- Bin Policy: Visible to WH, Admin only

---

### MD-6: Price List / Standard Rates (ราคามาตรฐาน)

**Module Brief:**  
Maintain standard base prices that serve as reference for cost-based pricing and markup calculations. Distinct from promotional prices (PM-1).

**Key Fields:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Price List Code | Text(20) | ✓ | Unique identifier |
| Description | Text(100) | ✓ | Purpose (e.g., "Standard Retail", "Wholesale Base") |
| Effective From | Date | ✓ | Activation date |
| Effective To | Date | ✓ | Expiration date |
| Base Currency | Choice | ✓ | THB / USD / etc. |
| Status | Choice | ✓ | Draft / Confirmed / Active / Expired |
| Item Code | Lookup | ✓ | Item reference |
| Standard Price | Currency | ✓ | Base selling price per UOM |
| Markup % | Decimal | ✗ | Cost + Markup = Standard Price (for reference) |
| UOM | Lookup | ✓ | Unit of measure for this price |
| Quantity Tier From | Number | ✗ | Qty bracket (if applicable) |
| Quantity Tier To | Number | ✗ | Qty bracket (if applicable) |
| Applicable To | Choice | ✓ | All Customers / Specific Group / Specific Customer |
| Target Customer | Lookup | ✗ | If Applicable To = Specific |
| Approval Status | Choice | ✓ | Pending / Approved / Rejected |

**Create/Edit Workflow:**
- **Who Can Create:** Finance Manager, Pricing Manager, System Admin
- **Who Can Edit:** Pricing Manager (Draft), System Admin (all)
- **Approval:** Finance Manager approval required before Activation

**Important Business Rules:**
- Cannot edit Active price list (must create new one)
- Effective From date ≥ today
- Effective To > Effective From
- Standard Price is reference only; actual SO pricing may differ (affected by PM module)
- If Markup % is entered, system calculates: Standard Price = Cost Price + (Cost Price × Markup %)
- Expired price lists auto-transitioned after Effective To date (batch job)

**Related Components:**
- PM-1 (Price List) — promotional pricing
- Item Master (MD-1) — cost price reference
- PM-5 (Simulator) — uses standard price as baseline

**BC API Calls:**
```
GET /api/companies/{id}/standardPrices?$filter=status eq 'Active'
POST /api/companies/{id}/standardPrices
PATCH /api/companies/{id}/standardPrices/{id}
GET /api/companies/{id}/standardPrices/{id}?$expand=item,uom
```

---

## Business Rules Summary

### Item Master (MD-1)

1. **Item Code Uniqueness:** Cannot be reused; archived items retain their code in history
2. **Serial Tracking Activation:** If enabled, Barcode becomes mandatory; SC8 (SerialPanel) required on all transactions
3. **Cost Price Visibility:** Field-level hidden from Sales role; calculated field updated when Item cost changes in BC
4. **Reorder Logic:** If inventory falls below Reorder Point, auto-alert to Procurement (WH module)
5. **Effective Dates:** Item auto-deactivated if Effective To < today (batch job, nightly)
6. **Posting Groups:** Linked to GL accounts (CF-4); cannot change if item has transaction history
7. **Barcode Type:** EAN-13 validation rules enforced; QR codes stored as-is
8. **Archiving:** Active=False; all read-only except admin can re-activate

### Customer Master (MD-2)

9. **KYC Validation:** Tax ID must pass format + length validation; ID number cross-checked if integrated with government DB
10. **Address Types:** Three mandatory address types (Billing, Delivery, Tax Invoice) required for all Thai customers
11. **Credit Limit:** Zero credit limit means COD (Cash on Delivery) only; blocks credit terms
12. **Blocked Status:** If True, SO creation blocked with error message "Customer Blocked: [reason]"
13. **Price Group Assignment:** Links to PM-1 price list variant; affects SO pricing
14. **Discount Group:** Links to bulk discount programs; auto-applied on SO line items
15. **Email Field:** Used for e-invoice distribution; opt-in consent tracked (MD-2: Marketing Consent)
16. **Historical Data:** Active=False customer cannot be reused; must archive

### Vendor Master (MD-3)

17. **Vendor Rating:** A/B/C/D rating drives RFQ prioritization; C/D requires special approval for large PO
18. **WHT Classification:** Tied to tax rate in CF-1; auto-deducted from PO payment
19. **Bank Account Verification:** Finance must verify before first payment (Documents Verified=True)
20. **Payment Terms:** Must match available terms in CF-1; overridable per PO if negotiated
21. **Minimum Order Value:** If set, system warns if PO < minimum
22. **Delivery Lead Time:** Used for PO due date calculation (PO date + lead time = expected GRN date)
23. **Blocked Status:** If True, new PO creation blocked; existing POs can be paid normally
24. **Preferred Vendor Flag:** Used in RFQ/PO auto-matching logic

### Employee Master (MD-4)

25. **Department Link:** Affects CF-3 role assignment; employee automatically inherits department-level permissions
26. **Manager Code:** Creates approval hierarchy (used in CF-2.6 Approval Matrix for routing documents)
27. **Commission Type:** Stored here; PM-4 Quota can override per period
28. **Technician Skills:** Multi-select; Service module filters by skill when assigning jobs
29. **Sales Territory:** Mandatory if Salesperson=True; drives SO assignment filtering
30. **User Account Link:** Must be set before employee can access portal; links to CF-3 login account
31. **Termination Date:** Once set, system marks Active=False; historical records retained
32. **Service Technician Role:** If True, employee appears in Service module technician picker; must have ≥1 skill

### Branch & Warehouse (MD-5)

33. **Branch-Warehouse Relationship:** One-to-many; warehouse must belong to exactly one branch
34. **Bin Policy Link:** If Bin Policy Enabled=True, CF-5 policy must be configured
35. **Location Hierarchy:** Used for multi-level approval routing (branch-level vs. company-level)
36. **Warehouse Type:** Affects inventory replenishment rules (Hub = central distribution, Spoke = sales point)
37. **Region Assignment:** Used for sales hierarchy filtering (sales reports by region)
38. **Stock Counting Frequency:** Drives cycle count schedule for WH module
39. **Active Flag:** False = no new transactions; existing transactions use last-known-active warehouse

### Price List Standard (MD-6)

40. **Status Progression:** Draft → Confirmed → Active → Expired (manual transition for Draft→Confirmed; auto for Expired)
41. **Effective Dates:** Overlapping active price lists allowed (newer one takes precedence)
42. **Quantity Tiers:** Optional; if specified, price applied only to orders within qty range
43. **Approval Workflow:** Finance Manager must approve before Activation

---

## BC Table Reference

| BC Table Name | BC Table # | Portal Use | Key Fields |
|---------------|-----------|-----------|-----------|
| Item | 27 | MD-1 | Item No., Description, Unit of Measure, Cost, Barcode, Serial, Category |
| Item Category | 5722 | MD-1 | Code, Description |
| Item Unit of Measure | 5404 | MD-1 | Item No., Code, Qty. per Unit of Measure |
| Item Discount Group | 462 | MD-2 | Code, Description |
| Customer | 18 | MD-2 | No., Name, Tax ID, Address, Credit Limit, Blocked, Price Group |
| Shipping Agent | 291 | MD-2 | (If customer linked to shipping agent) |
| Vendor | 23 | MD-3 | No., Name, Tax ID, Address, Payment Terms, Blocked |
| Employee | 5200 | MD-4 | No., First Name, Last Name, Email, Department, Position, Manager |
| Location | 14 | MD-5 (Branch) | Code, Name, Address, Phone, Manager |
| Warehouse | 12 (BC) + custom extension | MD-5 (WH) | Code, Name, Location, Bin Policy, Manager |
| Sales Price | 7002 | MD-6 | Item No., Variant Code, Starting Date, Ending Date, Price |

---

## Implementation Notes

- **Phase P1:** All MD modules included; core master data setup
- **Field-Level Permissions:** Cost Price (MD-1), Tax ID (MD-2), Bank Account (MD-3) require CF-3 config
- **Localization:** All modules support EN+TH labels and descriptions
- **Import/Export:** Bulk item/customer import via CSV (Phase P1+); approval matrix required
- **Archiving:** Records set to Active=False, never hard-deleted (audit trail)
- **API Rate Limiting:** Avoid bulk GET requests without $top limit (see IA module)
- **Barcode Generation:** GTIN-13 format validation; allow custom codes with admin override
- **PDPA Compliance:** Email consent, ID number security, data retention policies per CF (System Config)

---

**End of MD Module Spec**
