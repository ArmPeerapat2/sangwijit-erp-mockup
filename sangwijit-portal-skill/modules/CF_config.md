# CF — System Config Module Spec (ตั้งค่าระบบ)

**Version:** 2.0  
**Phase:** P1  
**Module Code:** CF  
**Last Updated:** 2026-04-12

---

## Overview

System Config (CF) contains admin-only settings that define how the portal and BC operate. These are rarely changed after initial setup.

**Key Distinction:**
- **CF (System Config):** Admin-only; system-level parameters; rarely change
- **MD (Master Data):** User-created business entities (items, customers, employees); changes frequently

**Access Control:** CF module visible ONLY to System Admin role. All other roles are hidden CF entirely.

---

## 🎯 Grill A — Config Design Decisions (2026-07-06 · A1-A3 · A4 parked)

**หลักการรวม:** พอร์ทัลถือเฉพาะ config ที่ BC ไม่มี/ต้องต่อเอง · ที่ BC ถือ (บัญชี/posting/integration) = mirror read-only

**A1 · บริษัท + ค่าเริ่มต้น** — 2 ชั้น: BC mirror read-only + ค่าเริ่มต้นพอร์ทัลแก้ได้ (อ่าน Options บางตัวมาปรับพฤติกรรม: อนุมัติก่อนพิมพ์→gate ปุ่มพิมพ์ · เช็คในมือ→credit check) · 2 ระดับ: บริษัท(admin: ฟอร์มพิมพ์·แจ้งเตือน) + ผู้ใช้(ธีม/หนาแน่น/pin/ช่องทาง) · **สาขา default = ดึงจาก user management** · แจ้งเตือน route ตามสิทธิ์/role · ฟอร์มพิมพ์ default ดึงจาก CF-2.7 Doc Template

**A2 · Master data** — พอร์ทัลถือเฉพาะ **UI master** (ประเภทบัตร+%ชาร์จ→sc-payment · สถานะสีลูกค้า · **เหตุผลปรับสต็อก WH-5** [ผูกทิศ+ผังบัญชี] · doc template) · accounting master (กลุ่ม/ประเภท/ยี่ห้อ→dimension/posting group) = **BC ถือ · dropdown cache+refresh · เพิ่มใหม่ลิงก์ BC** · **shared component `swt-master-editor(el,{title,columns,fields,data})`** (list-detail schema-driven · nested optional) ใช้ซ้ำทุก portal-owned master

**A3 · API ธนาคาร** — inbound statement + QR เท่านั้น (read-only · ไม่ย้ายเงิน · outbound = เฟส 2) · **credential/เชื่อม = ตั้งที่ BC · พอร์ทัลแสดงสถานะ read-only** (list ธนาคาร/บัญชี/นิติ + badge เชื่อม/หลุด + sync ล่าสุด + ปุ่ม manual sync) · หลายบัญชี · **manual sync + คนจับคู่เอง** (ไม่ auto-match · statement→FI-1Q ให้คน match) · เห็นตาม RBAC (การเงิน)

**A4 · โอนข้ามบริษัท→ห้องภาษี (1.6.3 · Dual-Book 4 นิติ)** — ✅ **grilled (Q1-Q4 · build = Phase 2 กับ Entity Tag)**
- **Q1** BC ทำโอน/multi-company + 6 ไฟล์ภาษีหมด · พอร์ทัลแค่ ① ติด Entity Tag บนเอกสาร ② แสดงสถานะโอน read-only
- **Q2** tag: ขาย(SL-4) auto by branch · ซื้อ(PO-6) dropdown บังคับ · จ่าย(FI-2) auto · **gate ไม่มี tag = Post ไม่ได้** (กันข้อมูลตกห้องภาษี)
- **Q3** **เอกสารแยกกันอิสระเต็มสาย** (แต่ละนิติ = PO→รับ→ตั้งหนี้→จ่าย แยกใบ · ไม่รวมแล้วแตก) → พอร์ทัลไม่ต้องทำ UI แตกเอกสารพิเศษ
- **Q4** สต็อก: **กายภาพรวม (22) พอร์ทัลโชว์อันนี้** · บัญชีแยกนิติ (SWT 17=10vat+7novat · SWE 5) = **BC ถือ ledger** · พอร์ทัลไม่ทำ stock แยกนิติ (กันทำบัญชีซ้อน BC)
- **โมเดล:** doc-level tag (เอกสารเป็นตัวแยก · ไม่ใช่ line-level) · novat = อยู่ห้องหลัก ไม่โอน · ห้องภาษี = คนละ BC database · ⚠️ risk: ขายเกินสต็อกนิติ (แต่กายภาพยังมี) → BC ต้องเช็ค = เหตุผล defer Phase 2

**Build:** #1 `swt-master-editor` + หน้าตั้งค่า Master (ปิด TODO WH-5) → #2 หน้า Config บริษัท+ค่าเริ่มต้น → #3 หน้าสถานะธนาคาร · ref `_reference/ConfigMasterData-catalog.md`

---

## Menu Structure & Module Specifications

### CF-1: Tax Setup (VAT+WHT / ตั้งค่าภาษี)

**Module Brief:**  
Define tax rates (VAT, WHT) and tax codes used across the portal.

**Key Settings:**

| Setting | Type | Mandatory | Notes |
|---------|------|-----------|-------|
| **VAT (Value Added Tax)** | | | |
| VAT Code | Text(5) | ✓ | E.g., "VAT-7", "VAT-10", "VAT-EX" |
| VAT Rate (%) | Decimal | ✓ | 0 / 7 / 10 / etc. |
| VAT GL Account (Liability) | Lookup | ✓ | GL account for VAT payable |
| VAT GL Account (Input) | Lookup | ✓ | GL account for VAT input deductible |
| Effective From | Date | ✓ | Date tax rate becomes active |
| Effective To | Date | ✗ | If tax rate expires |
| Description | Text(100) | ✓ | E.g., "Standard VAT 7%" |
| **Withholding Tax (WHT)** | | | |
| WHT Code | Text(5) | ✓ | E.g., "WHT-3", "WHT-5", "WHT-1" |
| WHT Rate (%) | Decimal | ✓ | 1 / 3 / 5 / etc. |
| WHT Category | Lookup | ✓ | Service / Supplies / Equipment / etc. |
| WHT GL Account (Payable) | Lookup | ✓ | GL account for WHT payable to tax authority |
| WHT GL Account (Expense) | Lookup | ✓ | GL account to debit when WHT paid |
| Withholding Entity | Lookup | ✓ | Company entity that withholds (e.g., "Sangwijit Ltd.") |
| Effective From | Date | ✓ | |
| Effective To | Date | ✗ | |
| Description | Text(100) | ✓ | |
| **Tax Exemption** | | | |
| Exemption Code | Text(10) | ✓ | E.g., "EXEMPT-EXPORT", "EXEMPT-GOVT" |
| Exemption Type | Choice | ✓ | Export / Government / Non-profit / Other |
| VAT Exempt | Boolean | ✓ | True = no VAT charged |
| WHT Exempt | Boolean | ✓ | True = no WHT deducted |
| Description | Text(200) | ✓ | Reason for exemption |
| Effective From | Date | ✓ | |
| Effective To | Date | ✗ | |

**Access Control:**
- View: System Admin only
- Edit: System Admin only
- Change Log: Tracked; System Admin can view history

**BC API Calls:**
```
GET /api/companies/{id}/taxSetup
POST /api/companies/{id}/taxCodes
PATCH /api/companies/{id}/taxCodes/{id}
GET /api/companies/{id}/whtCategories
POST /api/companies/{id}/whtCategories
GET /api/companies/{id}/generalLedgerAccounts?$filter=type eq 'Tax'
```

**Business Rules:**
- VAT rate changes must not conflict with posted documents (future-dated changes only)
- WHT GL accounts must be on Balance Sheet (Liability + Expense accounts)
- Tax rate can have Effective To date for historical tracking
- Default VAT rate (7%) should be set for all new items unless specified
- Exemption codes pre-defined per government agency (not created ad-hoc)
- GL account changes require Finance Manager review before applying to existing documents

---

### CF-2: Number Series (เลขที่เอกสาร)

**Module Brief:**  
Define document numbering formats for all transaction types (Sales Order, Purchase Order, etc.).

**Key Settings:**

| Document Type | Prefix | Format | Next Number | Manual Override | Notes |
|---------------|--------|--------|-------------|-----------------|-------|
| Sales Order (SO) | SO- | SO-{YYYY}-{MM}-{XXXXX} | 12345 | Allowed | E.g., SO-2026-04-00001 |
| Purchase Order (PO) | PO- | PO-{YYYY}-{MM}-{XXXXX} | 6789 | Allowed | E.g., PO-2026-04-00001 |
| Goods Receipt (GRN) | GRN- | GRN-{YYYY}-{MM}-{XXXXX} | 3210 | Not Allowed | Linked to PO; auto-generated |
| Sales Invoice (SI) | SI- | SI-{YYYY}-{MM}-{XXXXX} | 54321 | Allowed (audit) | Tax-registered number |
| Purchase Invoice (PI) | PI- | PI-{YYYY}{MM}{XXXXX} | 10001 | Not Allowed | Matches vendor invoice |
| Service Order (SVC) | SVC- | SVC-{YYYY}-{XXXXX} | 8765 | Allowed | Field service job |
| Service Invoice (SVCI) | SVCI- | SVCI-{YYYY}-{XXXXX} | 4321 | Allowed | Service billing |
| Quotation (QUOTE) | QUOTE- | QUOTE-{YY}{MM}{XXXXX} | 1000 | Allowed | Non-binding |
| Credit Memo (CM) | CM- | CM-{YYYY}-{MM}-{XXXXX} | 500 | Allowed (Finance only) | Customer refund |
| Debit Memo (DM) | DM- | DM-{YYYY}-{MM}-{XXXXX} | 250 | Allowed (Finance only) | Vendor claim |
| Internal Transfer (IT) | IT- | IT-{YYYY}-{MM}-{XXXXX} | 2000 | Not Allowed | Warehouse movement |
| Delivery Note (DN) | DN- | DN-{YYYY}-{MM}-{XXXXX} | 3000 | Not Allowed | Linked to SO |
| Stock Adjustment (ADJ) | ADJ- | ADJ-{YYYY}-{MM}-{XXXXX} | 100 | Not Allowed | Inventory variance |
| Accrual Claim (ACC) | ACC- | ACC-{YYYY}-{MM}-{XXXXX} | 1 | Not Allowed | PO-7 Sale-In Accrual |

**Access Control:**
- View: System Admin, Finance Manager
- Edit: System Admin only
- Manual Override: Specific roles for manual numbering (SO, PI, CM, DM require supervisor approval if overridden)

**BC API Calls:**
```
GET /api/companies/{id}/numberSeries
PATCH /api/companies/{id}/numberSeries/{documentType}/nextNumber
GET /api/companies/{id}/numberSeries/{documentType}
POST /api/companies/{id}/numberSeries/{documentType}/getNextNumber
```

**Business Rules:**
- Each document type must have a unique prefix
- Format tokens: {YYYY}=4-digit year, {YY}=2-digit year, {MM}=2-digit month, {XXXXX}=sequential number
- Manual override for SO, PI, CM, DM must be audit-logged and requires supervisor approval
- GRN, DN, IT, ADJ, ACC are auto-generated (no manual override)
- Number sequence cannot be reset or restarted (ensures uniqueness)
- If Next Number reaches max (e.g., 99999), system alerts admin to reset prefix/format
- Historical numbers archived for 10+ years (tax/legal requirement)
- Duplicate number prevention: system checks all posted documents before assigning

---

### CF-3: User & Role Management (RBAC / ผู้ใช้งานและสิทธิ์)

**Module Brief:**  
Define portal user accounts, roles, and field-level permissions. Nine core roles defined; matrix of 28 functions.

**9 Core Roles:**

| Role | Department | Typical User | Base Permissions |
|------|-----------|--------------|-----------------|
| **System Admin** | IT / Admin | IT Manager | Full access; CF module visible; all APIs; override authority |
| **Finance Manager** | Finance | Finance Head | AR, AP, GL posting, reports, tax setup (CF view-only), cost price visibility |
| **Accounting Officer** | Finance | Accountant | GL posting, invoice approval, payment processing; no deletion authority |
| **Sales Manager** | Sales | Sales Head | SO creation, customer management, pricing review, quota approval; can override price |
| **Salesperson** | Sales | Sales Rep | SO creation (own), customer lookup, simulator, quote; NO pricing change |
| **Procurement Manager** | Procurement | Buyer | PO creation, vendor management, RFQ; GRN approval |
| **Warehouse Manager** | Warehouse | WH Head | GRN receipt, inventory moves, bin management, stock count; SO fulfillment |
| **Service Manager** | Service | Service Head | Service order assignment, technician routing, service invoice approval |
| **Service Technician** | Service | Field Tech | View assigned service orders, log work hours, record completion; read-only customer data |

**28 Core Functions:**

| Function | Code | Roles Allowed |
|----------|------|-----------------|
| View Dashboard | DASH-R | All |
| Create/Edit Customer (MD-2) | CUST-CUD | Sales Mgr, System Admin |
| Create/Edit Item (MD-1) | ITEM-CUD | Procurement Mgr, Finance Mgr, System Admin |
| Create Sales Order (SO) | SO-C | Salesperson, Sales Mgr, System Admin |
| Edit Sales Order Draft (SO) | SO-E-DRAFT | Salesperson, Sales Mgr, System Admin |
| Edit Sales Order Confirmed (SO) | SO-E-CONF | Sales Mgr, System Admin only |
| Submit Sales Order (SO) | SO-SUBMIT | Salesperson, Sales Mgr, System Admin |
| Approve Sales Order (SO) | SO-APPROVE | Sales Mgr, System Admin (per amount limit CF-2.6) |
| Cancel Sales Order (SO) | SO-CANCEL | Sales Mgr, System Admin |
| View Sales Order Pricing (SO) | SO-PRICE-VIEW | All (SO creator/owner see own; Mgr see all) |
| Override Price in Sales Order (SO) | SO-PRICE-OVERRIDE | Sales Mgr, System Admin (audit logged) |
| Create Purchase Order (PO) | PO-C | Procurement Mgr, System Admin |
| Approve Purchase Order (PO) | PO-APPROVE | Procurement Mgr, Finance Mgr, System Admin (per amount CF-2.6) |
| Receive Goods (GRN) | GRN-RECEIVE | Warehouse Mgr, System Admin |
| Approve GRN (GRN) | GRN-APPROVE | Procurement Mgr, Warehouse Mgr, System Admin |
| Create Service Order (SVC) | SVC-C | Service Mgr, System Admin |
| Assign Technician (SVC) | SVC-ASSIGN | Service Mgr, System Admin |
| Record Service Completion (SVC) | SVC-COMPLETE | Service Technician, Service Mgr, System Admin |
| Approve Service Invoice (SVCI) | SVCI-APPROVE | Service Mgr, Finance Mgr, System Admin |
| View Pricing & Cost (PRICE-VIEW) | Salesperson (own), Sales Mgr, Finance Mgr, System Admin |
| View Cost Price (COST-VIEW) | Finance Mgr, System Admin only |
| Approve Payment (AP/AR) | PAY-APPROVE | Finance Mgr, Accounting Officer, System Admin (per amount CF-2.6) |
| Post Journal Entry (GL) | JE-POST | Accounting Officer, Finance Mgr, System Admin |
| Generate Reports | REPORT-GEN | Finance Mgr, Sales Mgr, Procurement Mgr, Warehouse Mgr, System Admin |
| Manage Users & Roles (CF-3) | RBAC-ADMIN | System Admin only |
| Manage Tax Setup (CF-1) | TAX-ADMIN | System Admin, Finance Mgr (view-only) |
| Manage Approval Matrix (CF-2.6) | APPROVE-ADMIN | System Admin, Finance Mgr (view-only) |
| Manage Document Templates (CF-8) | TEMPLATE-ADMIN | System Admin, Finance Mgr |
| Access Audit Logs (IA-2) | AUDIT-VIEW | System Admin, Finance Mgr (own company only) |

**Field-Level Permissions (Examples):**

| Field | Visible To | Editable By | Notes |
|-------|-----------|------------|-------|
| Item.CostPrice | Finance Mgr, System Admin | System Admin, Finance Mgr | Hidden from Sales role |
| Customer.CreditLimit | Finance Mgr, Sales Mgr, System Admin | Finance Mgr, System Admin | Hidden from Salesperson |
| Customer.TaxID | Finance Mgr, System Admin, KYC Officer | System Admin | Hidden from general Sales |
| Vendor.BankAccount | Finance Mgr, System Admin | Finance Mgr, System Admin | Hidden from Procurement (except approval) |
| SO.ManualDiscountAmount | Sales Mgr, System Admin | Sales Mgr, System Admin | Salesperson cannot manually discount; uses promotions only |
| PO.ReceivingWarehouse | Warehouse Mgr, Procurement Mgr, System Admin | Procurement Mgr, System Admin | Read-only for Warehouse Mgr |
| GL.AccountCode | Finance Mgr, System Admin | System Admin | Read-only for Accounting Officer |

**RBAC Matrix Summary:**
```
9 Roles × 28 Functions = 252 permission cells
Each cell: Allowed (✓) / Not Allowed (✗) / Conditional per CF-2.6 (◐)
```

**Principle: Maker ≠ Checker**
- **Maker:** User who creates/initiates document
- **Checker:** User who approves/posts document
- Cannot be same person for financial control (segregation of duties)

**Example:**
- Salesperson CREATES Sales Order (SO-C)
- Salesperson SUBMITS Sales Order (SO-SUBMIT)
- Sales Manager APPROVES Sales Order (SO-APPROVE) ← Must be different person
- Sales Manager cannot approve own orders

**Access Control:**
- View RBAC Matrix: System Admin only
- Edit User Role: System Admin only
- Edit Field Permission: System Admin only
- User Setup/Deactivate: System Admin only

**BC API Calls:**
```
GET /api/companies/{id}/users
POST /api/companies/{id}/users
PATCH /api/companies/{id}/users/{id}/role
GET /api/companies/{id}/roles
POST /api/companies/{id}/roles
GET /api/companies/{id}/permissions?role={roleCode}
GET /api/companies/{id}/fieldPermissions?role={roleCode}&table={tableCode}
POST /api/companies/{id}/auditLog?function={functionCode}
```

**Business Rules:**
- User account must link to BC employee (MD-4) for salary/commission tracking
- User cannot be created without employee ID
- Role change requires password re-entry (security prompt)
- User login tracked; failed attempts logged (5 strikes = account lockout 1 hour)
- Session timeout: 30 min inactivity (GDPR / security standard)
- Password policy: Min 12 chars, 1 uppercase, 1 number, 1 special char, expires every 90 days
- Multi-factor authentication (2FA) recommended for Finance Mgr, System Admin
- Users deactivated on termination date (MD-4 Termination Date synced)
- Field-level permission hierarchy: System Admin > Role > Field-specific (lower level overrides higher)

---

### CF-4: Posting Groups & GL Configuration (GL ตั้งค่า)

**Module Brief:**  
Map inventory/customer/vendor posting groups to GL accounts for automatic journal entry posting.

**Item Posting Group:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Posting Group Code | Text(20) | ✓ | E.g., "INVENTORY", "SERVICE", "FIXED-ASSET" |
| Description | Text(100) | ✓ | |
| Inventory Account (Balance Sheet) | Lookup | ✓ | GL account for inventory valuation |
| Cost of Goods Sold (COGS) | Lookup | ✓ | GL account for COGS expense |
| Sales Revenue Account | Lookup | ✓ | GL account for sales revenue |
| Purchase Expense Account | Lookup | ✓ | GL account for purchase expense |
| Accrued Expense Account (for PO receipt before invoice) | Lookup | ✓ | AP accrual account |
| Discount Allowed Account | Lookup | ✗ | GL account for sales discounts given |
| Discount Received Account | Lookup | ✗ | GL account for purchase discounts received |
| Accrual Income Account (for promotions) | Lookup | ✗ | Used by PO-7 Sale-In Accrual |

**Customer Posting Group:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Posting Group Code | Text(20) | ✓ | E.g., "RETAIL", "WHOLESALE", "EXPORT" |
| Description | Text(100) | ✓ | |
| Accounts Receivable Account | Lookup | ✓ | AR control account |
| Receivables Discount Account | Lookup | ✗ | Early payment discount |
| Finance Charge Account (for late payment) | Lookup | ✗ | Interest/penalty on overdue |
| Sales Tax Payable Account | Lookup | ✓ | VAT liability (from CF-1) |

**Vendor Posting Group:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Posting Group Code | Text(20) | ✓ | E.g., "LOCAL-SUPPLIER", "IMPORT-SUPPLIER" |
| Description | Text(100) | ✓ | |
| Accounts Payable Account | Lookup | ✓ | AP control account |
| Payables Discount Account | Lookup | ✗ | Early payment discount |
| Finance Charge Account (for late payment) | Lookup | ✗ | Interest penalty |
| Withholding Tax Payable Account | Lookup | ✓ | WHT liability (from CF-1) |
| Purchase Tax Deductible Account | Lookup | ✓ | VAT input (from CF-1) |

**Access Control:**
- View: Finance Mgr, System Admin
- Edit: System Admin only
- GL Account Validation: Must exist in Chart of Accounts (GL master)

**BC API Calls:**
```
GET /api/companies/{id}/postingGroups/item
POST /api/companies/{id}/postingGroups/item
PATCH /api/companies/{id}/postingGroups/item/{code}
GET /api/companies/{id}/postingGroups/customer
GET /api/companies/{id}/postingGroups/vendor
GET /api/companies/{id}/chartOfAccounts?$filter=accountType eq 'Asset' or accountType eq 'Liability'
```

**Business Rules:**
- GL account must have matching currency (THB, USD, etc.)
- GL account must be in same company as posting group
- Cannot delete posting group if items/customers/vendors are linked
- Posting group change only allowed for items with zero balance
- GL account numbers must follow company's chart of accounts structure
- Intercompany transactions: separate posting groups if multi-company setup
- Test posting groups before deploying to production

---

### CF-5: WH Bin Policy (นโยบายคลัง)

**Module Brief:**  
Define warehouse bin organization rules and inventory management policies.

**Key Settings:**

| Setting | Type | Options | Notes |
|---------|------|---------|-------|
| **Bin Naming Convention** | | | |
| Bin Code Format | Choice | Sequential / Zone-Row-Bin / Custom | E.g., "A-01-001", "BIN-001" |
| Bin Sequence | Choice | Zone-based / Manual | |
| Zone Definition | Lookup | Multiple zones | e.g., Zone A=Incoming, B=Storage, C=Picking, D=Shipping |
| **Bin Allocation Policy** | | | |
| Item Category → Zone | Mapping | Bulk/Heavy → Zone A, Small/Fast-moving → Zone C | |
| FIFO Rule | Boolean | True / False | First-In-First-Out for expiry/aging control |
| Serial Tracking | Boolean | True / False | Mandatory serial/lot number per bin |
| Mixed SKU per Bin | Choice | Yes / No / Restricted | Can bin hold multiple items? |
| Min/Max Inventory per Bin | Rules | Item-specific | Alert when below min; cap at max |
| **Picking Rules** | | | |
| Pick Strategy | Choice | FIFO / LIFO / Nearest Bin / Zone-optimal | |
| Batch Picking | Boolean | True / False | Consolidate multiple orders |
| Wave Planning | Boolean | True / False | Group orders by delivery zone |
| Cross-docking Allowed | Boolean | True / False | Skip bin storage; direct to shipment |
| **Stock Count Policy** | | | |
| Cycle Count Frequency | Choice | Daily / Weekly / Monthly | Per warehouse (MD-5) |
| Count Method | Choice | Full Count / Cycle Count / Spot Check | |
| Count Tolerance (%) | Decimal | 2-5% variance allowed | |
| Variance Threshold | Currency | >= amount → require investigation | |

**Access Control:**
- View: Warehouse Mgr, System Admin
- Edit: System Admin only
- Apply Policy: Warehouse Mgr (reads policy to execute)

**BC API Calls:**
```
GET /api/companies/{id}/binPolicies
POST /api/companies/{id}/binPolicies
PATCH /api/companies/{id}/binPolicies/{id}
GET /api/companies/{id}/warehouses/{id}/zoneConfig
GET /api/companies/{id}/binPolicy/{id}/rules?itemCategory={category}
```

**Business Rules:**
- Bin policy assigned to warehouse (MD-5: Bin Policy Enabled + Bin Policy Code)
- FIFO rule enforced if item has Serial Tracking enabled
- Picking strategy optimized for cost + speed (mgmt decision)
- Variance tolerance auto-flags discrepancies for physical recount
- Cycle count schedule generated monthly from this policy
- Cross-docking requires expedited shipment approval

---

### CF-6: Technician Template (ค่าแรงช่าง)

**Module Brief:**  
Define service labor rates for different technician levels and service types.

**Key Settings:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| **Service Type** | | | |
| Service Type Code | Text(20) | ✓ | Installation / Repair / Inspection / Maintenance / Training |
| Description | Text(100) | ✓ | |
| Estimated Duration (Hours) | Number | ✓ | Std labor hours (e.g., 2 hrs for basic install) |
| **Technician Level** | | | |
| Level Code | Text(10) | ✓ | Apprentice / Junior / Senior / Master |
| Level Description | Text(100) | ✓ | |
| **Labor Rate Matrix** | | | |
| Service Type + Tech Level | Lookup pair | ✓ | Each combination has a rate |
| Hourly Rate (THB) | Currency | ✓ | Base labor cost per hour |
| Overtime Rate (%) | Decimal | ✓ | % uplift after standard hours (e.g., 150% for OT) |
| Travel Cost (per km) | Currency | ✗ | Travel reimbursement rate |
| Minimum Charge (Hours) | Number | ✓ | Minimum billable hours (e.g., 1 hour min) |
| Effective From | Date | ✓ | Rate activation date |
| Effective To | Date | ✗ | Rate expiration |

**Example Matrix:**
```
Service: Installation
  - Apprentice: 300 THB/hr, OT 150%, Travel 5 THB/km
  - Junior: 500 THB/hr, OT 150%, Travel 5 THB/km
  - Senior: 800 THB/hr, OT 150%, Travel 5 THB/km
  - Master: 1200 THB/hr, OT 150%, Travel 5 THB/km

Service: Repair
  - Apprentice: 250 THB/hr, OT 150%, Travel 5 THB/km
  - Junior: 450 THB/hr, OT 150%, Travel 5 THB/km
  - Senior: 700 THB/hr, OT 150%, Travel 5 THB/km
  - Master: 1000 THB/hr, OT 150%, Travel 5 THB/km
```

**Access Control:**
- View: Service Mgr, Finance Mgr, System Admin
- Edit: System Admin, Finance Mgr (requires approval)
- Rate Changes: Finance Mgr approval required; effective date future-only

**BC API Calls:**
```
GET /api/companies/{id}/technicianTemplates
POST /api/companies/{id}/technicianTemplates
PATCH /api/companies/{id}/technicianTemplates/{id}
GET /api/companies/{id}/technicianRates?serviceType={type}&techLevel={level}
```

**Business Rules:**
- Rate increases limited to <= 10% per year (cost control)
- Travel cost applies if customer location > 5 km from branch
- Overtime calculated on daily > 8 hrs, weekly > 40 hrs
- Minimum charge applied to all service jobs (e.g., 1 hr minimum = 300 THB for Apprentice)
- Service invoice calculation: (Hours Used × Rate) + (Distance × Travel Cost), minimum charge applies
- Old rates archived; historical billing uses rate from service date

---

### CF-2.6: Approval Matrix (ผู้อนุมัติ)

> **หมายเหตุรหัส:** "CF-7" เป็นรหัสเก่าของหน้านี้ที่ใช้ใน spec ก่อน 2026-06-03 ก่อนตั้งชื่อไฟล์ mockup เป็น `cf2-6-approval-matrix-mockup.html` — ไม่ใช่หน้าแยก เป็นหน้าเดียวกันแค่เปลี่ยนรหัส. Canonical = **CF-2.6** (decision 2026-07-02)

**Module Brief:**  
Define document approval routing based on document type + amount threshold. Critical for Maker ≠ Checker segregation.

**Key Settings:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| **Approval Rule** | | | |
| Rule ID | Text(20) | ✓ | Auto-generated; e.g., "APR-001" |
| Document Type | Lookup | ✓ | SO / PO / GRN / SI / SVCI / CM / DM / JE / etc. |
| Amount Tier From | Currency | ✓ | Lower bound (THB) |
| Amount Tier To | Currency | ✓ | Upper bound (THB); "999999999" = unlimited |
| Required Approver Role | Lookup | ✓ | Sales Mgr / Procurement Mgr / Finance Mgr / System Admin |
| Approver Count | Number | ✓ | How many approvals required (1 or 2) |
| Approval Sequence | Choice | Sequential / Parallel | Sequential = A then B; Parallel = A and B simultaneously |
| Escalation Level | Number | ✓ | If rejected, escalate to level+1 (see escalation matrix) |
| Escalation Approver | Lookup | ✓ | Escalation role if initial approver rejects |
| **Escalation Matrix** | | | |
| Level 1 Approver | Lookup | ✓ | E.g., Sales Mgr |
| Level 2 Approver (Escalation) | Lookup | ✓ | E.g., Director / CFO |
| Level 3 Approver (Final) | Lookup | ✓ | E.g., CEO / Board |
| Max Rejection Count | Number | ✓ | Auto-escalate after N rejections (e.g., 2) |
| Email Notification | Boolean | ✓ | True = email approver when pending |
| Reminder Frequency | Choice | None / Daily / Every 3 days | Auto-reminder to pending approver |
| SLA (Hours) | Number | ✓ | Approval must complete within N hours; escalate if exceeded |

**Example Approval Matrix:**

```
Document: Sales Order
┌────────────┬──────────────┬─────────────────┬──────────────┬─────────┐
│ Amount     │ Approver 1   │ Approver 2      │ Escalation   │ SLA (h) │
├────────────┼──────────────┼─────────────────┼──────────────┼─────────┤
│ 0-50K      │ Sales Mgr    │ —               │ —            │ 24      │
│ 50K-500K   │ Sales Mgr    │ Finance Mgr     │ Director     │ 24      │
│ 500K-2M    │ Finance Mgr  │ Director        │ CEO          │ 48      │
│ >2M        │ Director     │ CEO             │ Board        │ 72      │
└────────────┴──────────────┴─────────────────┴──────────────┴─────────┘

Document: Purchase Order
┌────────────┬──────────────┬─────────────────┬──────────────┬─────────┐
│ Amount     │ Approver 1   │ Approver 2      │ Escalation   │ SLA (h) │
├────────────┼──────────────┼─────────────────┼──────────────┼─────────┤
│ 0-100K     │ Procurement  │ —               │ —            │ 24      │
│ 100K-500K  │ Procurement  │ Finance Mgr     │ Director     │ 24      │
│ 500K-2M    │ Finance Mgr  │ Director        │ CEO          │ 48      │
│ >2M        │ Director     │ CEO             │ Board        │ 72      │
└────────────┴──────────────┴─────────────────┴──────────────┴─────────┘

Document: Credit Override — ขาย (SL-F1: ลูกค้าเกินวงเงินเครดิต)
┌─────────────────┬──────────────┬─────────────────┬──────────────┬─────────┐
│ เกินวงเงิน      │ Approver 1   │ Approver 2      │ Escalation   │ SLA (h) │
├─────────────────┼──────────────┼─────────────────┼──────────────┼─────────┤
│ 0-50K           │ Sales Mgr    │ —               │ Finance Mgr  │ 4       │
│ 50K-200K        │ Branch Mgr   │ —               │ Finance Mgr  │ 8       │
│ 200K-500K       │ Finance Mgr  │ —               │ GM           │ 24      │
│ >500K           │ GM           │ —               │ —            │ 24      │
└─────────────────┴──────────────┴─────────────────┴──────────────┴─────────┘
หมายเหตุ: "เกินวงเงิน" = ยอดสั่งซื้อใหม่ + AR ค้างเดิม - Credit Limit ของลูกค้า
SLA สั้นกว่าปกติ เพราะลูกค้ารออยู่หน้าร้าน/โทรมา

Document: Purchase Order (PO Approval)
┌────────────┬──────────────┬─────────────────┬──────────────┬─────────┐
│ Amount     │ Approver 1   │ Approver 2      │ Escalation   │ SLA (h) │
├────────────┼──────────────┼─────────────────┼──────────────┼─────────┤
│ 0-100K     │ Purchase Mgr │ —               │ —            │ 24      │
│ 100K-500K  │ Finance Mgr  │ —               │ GM           │ 24      │
│ 500K-1M    │ GM           │ —               │ —            │ 48      │
│ >1M        │ GM           │ Board           │ —            │ 72      │
└────────────┴──────────────┴─────────────────┴──────────────┴─────────┘

Document: Service Invoice
┌────────────┬──────────────┬─────────────────┬──────────────┬─────────┐
│ Amount     │ Approver 1   │ Approver 2      │ Escalation   │ SLA (h) │
├────────────┼──────────────┼─────────────────┼──────────────┼─────────┤
│ 0-50K      │ Service Mgr  │ —               │ —            │ 24      │
│ 50K-200K   │ Service Mgr  │ Finance Mgr     │ Director     │ 24      │
│ >200K      │ Finance Mgr  │ Director        │ CEO          │ 48      │
└────────────┴──────────────┴─────────────────┴──────────────┴─────────┘
```

**Access Control:**
- View: Finance Mgr, System Admin
- Edit: System Admin only
- Approval enforcement: Automatic; system checks before posting

**BC API Calls:**
```
GET /api/companies/{id}/approvalMatrix?documentType={type}&amount={amount}
POST /api/companies/{id}/approvalMatrix
PATCH /api/companies/{id}/approvalMatrix/{id}
GET /api/companies/{id}/approvalPending?approver={userId}
POST /api/companies/{id}/approvals/{id}/approve
POST /api/companies/{id}/approvals/{id}/reject
GET /api/companies/{id}/approvalHistory?documentId={id}
```

**Business Rules:**
- Approval rule auto-matched when document amount determined
- Approver cannot be document creator (Maker ≠ Checker enforced)
- System auto-routes approval to matching approver (via CF-3 RBAC)
- If approver unavailable (on leave), escalate to Level 2 (auto-escalate flag)
- Rejection triggers email to creator with reason; document reverts to Draft
- After N rejections (default 2), auto-escalate to Level 2 without waiting
- SLA expiry: System sends auto-reminder every 12 hours; escalate to Level 2 if SLA exceeded
- Approval chain enforced sequentially (A approves, then B approves)
- Email notification includes: Document preview, amount, approver name, SLA deadline
- Audit trail: All approvals logged with timestamp + approver name + comments
- Cannot post document without all required approvals

---

### CF-8: Document Template (แม่แบบเอกสาร)

**Module Brief:**  
Define email and PDF templates for documents (invoices, quotes, delivery notes, etc.).

**Email Template:**

| Setting | Type | Mandatory | Notes |
|---------|------|-----------|-------|
| Template Code | Text(20) | ✓ | E.g., "EMAIL-SO-CONFIRM" |
| Document Type | Lookup | ✓ | SO / SI / PO / etc. |
| Template Name | Text(100) | ✓ | User-friendly name |
| Email Subject | Text(200) | ✓ | Can include tokens: {DocNo}, {CustomerName}, {Amount} |
| Email Body (HTML) | Long Text | ✓ | Rich HTML with tokens and conditional blocks |
| Email CC | Text(500) | ✗ | Additional recipients; comma-separated |
| Email BCC | Text(500) | ✗ | Hidden recipients |
| Attachment | Choice | None / PDF / ZIP | Whether to attach document PDF |
| Signature Block | Lookup | ✓ | Default signature (e.g., "Sales Dept Signature") |
| Language | Choice | EN / TH / Both | For multi-language support |
| Active | Boolean | ✓ | True = use this template |

**PDF Template:**

| Setting | Type | Mandatory | Notes |
|---------|------|-----------|-------|
| Template Code | Text(20) | ✓ | E.g., "PDF-SI-INVOICE" |
| Document Type | Lookup | ✓ | SO / SI / PO / GRN / SVCI / etc. |
| Template Name | Text(100) | ✓ | User-friendly name |
| Template File (RDLC/XLSX) | File | ✓ | Report definition or Excel template |
| Language | Choice | EN / TH / Both | Language-specific layout |
| Page Size | Choice | A4 / Letter / A5 | Paper size |
| Orientation | Choice | Portrait / Landscape | |
| Logo URL | Text(200) | ✓ | Company logo image |
| Header Text | Text(500) | ✗ | Header content (company name, etc.) |
| Footer Text | Text(500) | ✗ | Footer content (page no, date, etc.) |
| Include Signature Block | Boolean | ✓ | Signature lines at bottom |
| Include QR Code | Boolean | ✗ | QR code linking to document URL |
| Color Scheme | Lookup | ✓ | Company colors (optional) |
| Active | Boolean | ✓ | True = use this template |

**Example Email Template — Sales Order Confirmation (TH):**
```
Subject: คำสั่งซื้อ #{DocNo} ได้รับการยืนยันแล้ว

Body:
เรียน {CustomerName}

ขอบคุณสำหรับการสั่งซื้อ เอกสารอ้างอิง {DocNo} 
วันที่สั่ง: {OrderDate}
วันที่คาดว่าจะส่งมอบ: {DeliveryDate}
จำนวนเงิน: {TotalAmount} บาท

รายละเอียดการส่งมอบ:
{DeliveryAddress}

หากมีคำถาม โปรดติดต่อ {SalesPersonName} ที่ {SalesPersonPhone}

ขอบคุณ
ทีมขาย
Sangwijit Co., Ltd.
```

**Access Control:**
- View: All roles (read-only)
- Edit: System Admin, Finance Mgr (requires testing before deploy)
- Test Template: Email to self before approving

**BC API Calls:**
```
GET /api/companies/{id}/emailTemplates
POST /api/companies/{id}/emailTemplates
PATCH /api/companies/{id}/emailTemplates/{id}
GET /api/companies/{id}/pdfTemplates
POST /api/companies/{id}/pdfTemplates
POST /api/companies/{id}/documents/{id}/preview (test render)
POST /api/companies/{id}/documents/{id}/send (send via email)
```

**Business Rules:**
- Template tokens: {DocNo}, {CustomerName}, {Amount}, {Date}, {DeliveryDate}, {SalesPersonName}, {SalesPersonPhone}, etc.
- Conditional blocks: IF/THEN syntax (e.g., IF Amount > 500K THEN "Requires 2 approvals")
- Template must be tested before activation (preview in portal)
- Email template must include unsubscribe link (PDPA requirement)
- PDF template must include company logo, tax ID, and legal information
- Multi-language templates: same template code, language variant (e.g., "EMAIL-SO-CONFIRM-EN" vs. "EMAIL-SO-CONFIRM-TH")
- Email template can be overridden per customer (opt-out option)
- PDF template must produce valid tax documents per Thai law (tax ID, invoice #, etc.)

---

### CF-9: Entity Tag Configuration (ตั้งค่า Tag นิติบุคคล — บัญชี 2 เล่ม)

**Module Brief:**  
กำหนด Entity Tag ที่ใช้แยกข้อมูลบัญชีไปยังห้องภาษีแต่ละนิติบุคคล ใช้กับ FI-13 Dual-Book System

**Key Concept:**  
- ฐานข้อมูลหลัก (ห้องจริง) เก็บข้อมูลทุกบริษัทรวมกัน
- Entity Tag ติดไว้ที่ Transaction ตอนบันทึก เพื่อกรองเข้าห้องภาษีแต่ละนิติบุคคล
- Tag สามารถเพิ่มได้ไม่จำกัด (configurable)

**Entity Tag Master:**

| Field | Data Type | Mandatory | Notes |
|-------|-----------|-----------|-------|
| Tag Code | Text(10) | ✓ | E.g., "1", "2", "3", "novat" |
| Tag Name | Text(100) | ✓ | ชื่อนิติบุคคล เช่น "บจก.แสงวิจิตร", "บจก.แสงวิจิตร อิเลคทริค" |
| Tax ID | Text(13) | ✓ (ยกเว้น novat) | เลขประจำตัวผู้เสียภาษี 13 หลัก |
| Branch No. | Text(5) | ✗ | สาขาที่ (00000 = สำนักงานใหญ่) |
| Entity Type | Choice | ✓ | Legal Entity / Non-VAT |
| Tax Room Name | Text(100) | ✓ (ยกเว้น novat) | ชื่อห้องภาษีที่ Tag นี้จะถูกกรองไป |
| Active | Boolean | ✓ | True = ใช้งานอยู่ |
| Sort Order | Number | ✓ | ลำดับการแสดงผลใน Dropdown |
| Description | Text(200) | ✗ | หมายเหตุ |

**Special Tag: "novat"**

| Setting | Value | Notes |
|---------|-------|-------|
| Tag Code | novat | สำหรับ Vendor ที่ไม่มีใบกำกับภาษี |
| Entity Type | Non-VAT | ไม่โอนเข้าห้องภาษีใด |
| Tax Room | — (null) | อยู่แค่ห้องหลัก ไม่โอน |
| Use Case | Vendor ออก Tax Invoice ไม่ได้ | ค่าขนส่ง, ค่าแรงรายวัน, ฯลฯ |

**Tag Assignment Rules (จุดที่ต้องเลือก Tag):**

| Transaction | Module | When | How |
|-------------|--------|------|-----|
| AP Invoice (ซื้อ) | PO-6 | บันทึกตั้งหนี้ | Dropdown เลือก Entity Tag (บังคับ) |
| AP Payment (จ่าย) | FI-2 | จ่ายเจ้าหนี้ | Auto-fill จาก PO-6; แก้ไขได้ |
| Sales Tax Invoice (ขาย) | SL-4 | ออกใบกำกับภาษี | Auto = Tag ของสาขาที่ขาย |
| บิลทิ้ง (Catch-Up) | FI-13 | ออกบิลเก็บตก | เลือก Tag ปลายทาง |

**Data Transfer Configuration:**

| Setting | Data Type | Mandatory | Notes |
|---------|-----------|-----------|-------|
| Auto Transfer | Boolean | ✓ | True = โอนอัตโนมัติเมื่อ Post / False = รอ Manual |
| Transfer Schedule | Choice | ✓ (ถ้า Auto) | Real-time / Daily / Weekly / Monthly |
| Transfer Approval | Boolean | ✓ | True = ต้องอนุมัติก่อนโอน |
| Transfer Approver | Lookup | ✓ (ถ้า Approval) | Role ที่อนุมัติการโอน |

**6 Data Files ที่โอนเข้าห้องภาษี:**

| File | Description | Source | Filter |
|------|-------------|--------|--------|
| ภาษีซื้อ (Input VAT) | รายการ VAT จากการซื้อ | PO-6 AP Invoice | Entity Tag = target |
| ภาษีขาย (Output VAT) | รายการ VAT จากการขาย | SL-4 Sales Invoice | Entity Tag = target |
| ภ.พ.30 | สรุปภาษีมูลค่าเพิ่มรายเดือน | Calculated | (Output - Input) per tag |
| ภ.ง.ด.3 | WHT บุคคลธรรมดา | FI-12 WHT | Entity Tag = target |
| ภ.ง.ด.53 | WHT นิติบุคคล | FI-12 WHT | Entity Tag = target |
| ภ.ง.ด.1 | ภาษีเงินได้พนักงาน | Payroll (external) | Entity = company |

**Example Entity Tags (กลุ่มแสงวิจิตร):**
```
Tag 1 → บจก.แสงวิจิตร เทรดดิ้ง (SWT) → ห้องภาษี SWT
Tag 2 → บจก.แสงวิจิตร อิเลคทริค (SWE) → ห้องภาษี SWE
Tag 3 → บจก.วีเอ็มเอ็น (VMN) → ห้องภาษี VMN
Tag 4 → บจก.ดับเบิ้ลยูพีเอส (WPS) → ห้องภาษี WPS
novat → ไม่มีใบกำกับภาษี → อยู่แค่ห้องหลัก
```

**Access Control:**
- View: Finance Mgr, Accounting Officer, System Admin
- Edit Tag Master: System Admin only
- Assign Tag (PO-6): Accounting Officer, Procurement Mgr
- Transfer Data: Finance Mgr, System Admin
- Approve Transfer: Finance Mgr

**BC API Calls:**
```
GET /api/companies/{id}/entityTags                     → ดึง Tag ทั้งหมด
POST /api/companies/{id}/entityTags                    → สร้าง Tag ใหม่
PATCH /api/companies/{id}/entityTags/{code}            → แก้ไข Tag
GET /api/companies/{id}/entityTags/{code}/entries       → ดึง Transaction ตาม Tag
POST /api/companies/{id}/taxRoom/{tagCode}/transfer     → โอนข้อมูลเข้าห้องภาษี
GET /api/companies/{id}/taxRoom/{tagCode}/summary       → สรุปห้องภาษี
```

**Business Rules:**
- Entity Tag บังคับเลือกที่ PO-6 (AP Invoice) — ห้ามบันทึกโดยไม่มี Tag
- Tag "novat" ไม่โอนเข้าห้องภาษีใด — อยู่แค่ห้องหลักเพื่อการบริหาร
- Tag ที่ Active = false ห้ามเลือกในเอกสารใหม่ แต่เอกสารเก่ายังแสดงได้
- ห้ามลบ Tag ที่มี Transaction อ้างอิง (Soft delete only)
- การโอนข้อมูลเข้าห้องภาษี = Copy ไม่ใช่ Move (ห้องหลักยังเห็นทุกรายการ)
- เมื่อมีการเพิ่ม Tag ใหม่ ต้องสร้าง Tax Room ใหม่อัตโนมัติ
- Audit Log: ทุกการเปลี่ยนแปลง Tag ต้อง Log (SC7)
- Tax Room data เป็น Read-only — แก้ไขได้เฉพาะที่ห้องหลัก แล้วโอนใหม่

---

## Important Notice

**⚠️ WARNING: หา้มเปลี่ยน CF โดยไม่แจ้ง Developer — อาจกระทบทุก Module**

System Config changes (CF-1 through CF-8) affect the entire portal and all modules. Before making ANY changes:

1. **Notify the Development Team** — Email/message required
2. **Get Approval** — Finance Manager + System Admin approval
3. **Schedule Change** — Off-business hours if possible (avoid production disruption)
4. **Test First** — Always test in Staging environment before Production
5. **Backup Configuration** — Export current settings before change
6. **Document Change** — Change log entry with rationale + approver sign-off
7. **Communicate Impact** — Email all affected users (e.g., "VAT rate change effective 2026-05-01")

**Changes That Require Extra Caution:**
- CF-1 (Tax Setup): Affects all invoicing + GL posting
- CF-2 (Number Series): Affects document numbering; cannot be undone
- CF-3 (RBAC): Affects user access; lockout risk
- CF-4 (Posting Groups): Affects GL accounting; reconciliation impact
- CF-2.6 (Approval Matrix): Affects approval workflows; document stuck risk
- CF-9 (Entity Tag): Affects Dual-Book system; wrong tag = wrong tax room

**Rollback Plan:**
- Keep 3 prior versions of each config
- Schedule rollback within 24 hours if issues detected
- Test rollback procedure in Staging first

---

## BC Table Reference

| BC Table Name | BC Table # | Portal Use | Key Fields |
|---------------|-----------|-----------|-----------|
| Tax Setup | Custom | CF-1 | Tax Code, Rate, GL Account |
| General Ledger Account | 15 | CF-4 | No., Name, Account Type |
| Posting Group (Item) | 252 | CF-4 | Code, COGS Account, Sales Account |
| Posting Group (Customer) | 92 | CF-4 | Code, AR Account, VAT Account |
| Posting Group (Vendor) | 93 | CF-4 | Code, AP Account, WHT Account |
| User | Custom | CF-3 | User ID, Role, Employee Link |
| Approval Entry | 454 | CF-2.6 | Document Type, Approver, Status |
| Entity Tag | Custom | CF-9 | Tag Code, Entity Name, Tax ID, Tax Room |
| Tax Room | Custom | CF-9/FI-13 | Tag Code, Period, Input VAT, Output VAT |

---

## Implementation Notes

- **Phase P1:** All CF modules (CF-1 through CF-9)
- **Initial Setup:** Requires Finance Manager + System Admin 2-3 days
- **Template Localization:** Both EN+TH versions required for documents
- **Change Management:** Documented process essential; auditing critical
- **Training:** All admins must complete CF module training before production go-live
- **Monitoring:** Regular CF change audits (monthly) via IA-2 Error Log

---

**End of CF Module Spec**
