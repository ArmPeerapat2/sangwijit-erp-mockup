# PM — Promotion & Pricing Module Spec

**Version:** 1.0  
**Phase:** P1 + P3  
**Module Code:** PM  
**Last Updated:** 2026-04-12

---

## Overview

The Promotion & Pricing module manages pricing strategies, discount schemes, and promotional accruals. It is the source of truth for all pricing decisions in the portal, feeding the shared component SC9 (PromoPrice) used across Sales and Service modules.

**Key Principle:** Portal connects to BC salesPriceLists and itemDiscountGroups; no local pricing database exists.

---

## BC Entities

| Entity | BC Table | Fields Used | Read/Write |
|--------|----------|-------------|-----------|
| Sales Price List | `Sales Price` (7002) | Item, Variant, Starting Date, Ending Date, Price, Unit of Measure | RW |
| Item Discount Group | `Item Discount Group` (462) | Code, Description | RW |
| Line Discount | `Sales Line Discount` (71) | Item, Qty. Range, Discount Type, Discount % | RW |
| Customer Discount Group | `Customer Discount Group` (100) | Customer, Discount Group | RW |
| Sales Header Archive | `Sales Header Archive` (109) | Document Type, No., Amount | R |

---

## Flowchart Reference

Flowchart files located in: `/Design Ai/Flow Design/Promotion/`
- `00-promotion-flow.pdf` — Main promotion application flow
- `01-pricing-hierarchy.pdf` — Price determination sequence
- `02-simulator-engine.pdf` — Simulator calculation logic

---

## Menu Structure & Module Specifications

### PM-Q: Dashboard ( Dashboard)

**Module Brief:**  
Real-time overview of active promotions, pricing performance, and simulator usage.

**Key Screens:**
- Active Promotions (top 10 by value)
- Price List Performance (by Item, by Customer Group)
- Simulator Daily Usage (count, avg calculations)
- Upcoming Expiry Alerts (expires within 7 days)

**ERP Form Sections:**  
N/A (Dashboard only)

**Status Flow:**  
N/A

**SC Components Used:**  
SC9 (PromoPrice read-only)

**RBAC:**

| Role | View | Edit | Delete | Approve |
|------|------|------|--------|---------|
| Sales Manager | ✓ | ✗ | ✗ | ✗ |
| Pricing Manager | ✓ | ✓ | ✗ | ✓ |
| System Admin | ✓ | ✓ | ✓ | ✓ |

**BC API Calls:**
```
GET /api/companies/{id}/salesPriceLists?$filter=startingDate le today and endingDate ge today
GET /api/companies/{id}/itemDiscountGroups
GET /api/companies/{id}/salesLineDiscounts?$filter=active eq true
```

**Business Rules:**
- Dashboard auto-refresh every 60 seconds
- Expiry warnings trigger at 7, 3, 1 days before end date
- Performance metrics calculated on posted sales orders only

---

### PM-1: Price List (ราคาขาย)

**Module Brief:**  
Maintain standard selling prices for items organized by price group and customer segment.

**Key Screens:**
1. **Price List Header** (Page Header)
   - Price List Code
   - Description (EN/TH)
   - Currency
   - Valid From / Valid To
   - Status (Draft → Confirmed → Posted)
   - Approval Status

2. **Price List Lines** (Line Items)
   - Item Code
   - Item Description
   - Unit of Measure
   - Quantity Bracket (From/To)
   - Standard Price
   - Cost Price (field-level hidden from Sales)
   - Price Group
   - Customer Group Filter
   - Effective From / To

3. **Approval & History** (Tabs)
   - Approval Chain status
   - Change History (who changed what when)

**ERP Form Sections:**
- Page Header: Code, Description, Valid Period, Status
- Doc Header: Price List Type (Standard/Seasonal/Promo)
- Party: Applicable To (All Customers / Customer Group / Specific Customer)
- Line Items: Item, Price, Customer Group, Qty Bracket
- Tabs: History, Approval
- Summary: Total SKUs, Effective Count, Status Summary
- Action Bar: Save, Submit, Approve, Post, Cancel

**Status Flow:**
```
Draft → Pending (Submitted) → Confirmed (Approved) → Posted → Cancelled
  ↓           ↓                  ↓                    ↓
  Edit      Reject              Reject            Revert
```

**SC Components Used:**
- SC2 (ItemSearch) — Item lookup in line items
- SC9 (PromoPrice) — feeds this module's prices

**RBAC:**

| Role | Create | Edit Draft | Submit | Approve | Post | Cancel |
|------|--------|-----------|--------|---------|------|--------|
| Sales | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Pricing Manager | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| System Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**BC API Calls:**
```
POST /api/companies/{id}/salesPriceLists
PATCH /api/companies/{id}/salesPriceLists/{id}
GET /api/companies/{id}/salesPriceLists?$expand=lines
POST /api/companies/{id}/salesPriceLists/{id}/lines
DELETE /api/companies/{id}/salesPriceLists/{id}
GET /api/companies/{id}/items?$filter=type eq 'Inventory' or type eq 'Service'
```

**Business Rules:**
- Cannot edit Posted price list (must create new one)
- Item cost price auto-populated from Item Master but field is hidden from Sales role
- Effective From date must be >= today
- Effective To date must be > Effective From date
- No overlapping active price lists for same customer group
- Posted price list generates GL entries via Posting Group (CF-4)

---

### PM-2: Promotion Scheme (กำหนดโปรโมชั่น)

**Module Brief:**  
Define promotional offers including discounts, bundles, and gift-with-purchase schemes. Applied on top of base prices.

**Key Screens:**
1. **Promotion Header** (Page Header)
   - Promotion Code (AUTO-GENERATE: PROMO-YYYY-MM-XXX)
   - Description (EN/TH)
   - Promotion Type (% Discount / Fixed Amount / Free Gift / Bundle / Buy X Get Y)
   - Valid From / To
   - Status (Draft → Confirmed → Live → Expired/Cancelled)
   - Priority (1-10, lower number = higher priority)

2. **Promotion Conditions** (Party Section)
   - Applicable To (All Items / Item Category / Specific Items)
   - Applicable To (All Customers / Customer Group / Specific Customers)
   - Minimum Order Qty / Amount
   - Frequency Cap (How many times per customer per period)

3. **Promotion Details** (Line Items — varies by type)
   
   **If % Discount:**
   - Item / Category
   - Discount % (0-100)
   - Max Discount Cap (in currency)
   
   **If Fixed Amount Discount:**
   - Item / Category
   - Discount Amount (in currency)
   - Min Qty to trigger
   
   **If Free Gift:**
   - Purchased Item / Category
   - Gift Item Code
   - Qty of Gift
   - Min Qty / Amount to trigger
   
   **If Bundle:**
   - Bundle Name
   - Bundle Items (multi-select)
   - Bundle Price (fixed)
   - Normal Individual Total Price (for display)
   - Discount % calculated
   
   **If Buy X Get Y:**
   - Buy Item
   - Buy Qty
   - Get Item
   - Get Qty
   - Free or Discounted

4. **Approval & Audit** (Tabs)
   - Status History
   - Change Log
   - Conflict Check (see Business Rules)

**ERP Form Sections:**
- Page Header: Code, Type, Valid Period, Status, Priority
- Doc Header: Description, Display Name (for POS/E-commerce)
- Party: Target Customer/Item groups
- Line Items: Promotion details (varies by type)
- Tabs: Conditions, History, Conflict Analysis
- Summary: Estimated Impact (# Items affected, avg discount %)
- Action Bar: Save, Activate, Deactivate, Expire, Cancel

**Status Flow:**
```
Draft → Confirmed → Live → Expired
  ↓        ↓         ↓
Cancel   Cancel    Cancel
```

**SC Components Used:**
- SC2 (ItemSearch) — item selection in promo lines
- SC1 (CustomerSearch) — customer group lookup
- SC9 (PromoPrice) — provides promotion data

**RBAC:**

| Role | Create | Edit Draft | Activate | Deactivate | Cancel |
|------|--------|-----------|----------|-----------|--------|
| Sales | ✓ | ✓ | ✗ | ✗ | ✗ |
| Promotion Manager | ✓ | ✓ | ✓ | ✓ | ✓ |
| System Admin | ✓ | ✓ | ✓ | ✓ | ✓ |

**BC API Calls:**
```
POST /api/companies/{id}/promotions (custom BC table)
PATCH /api/companies/{id}/promotions/{id}
GET /api/companies/{id}/promotions?$filter=status eq 'Live'
GET /api/companies/{id}/items?$filter=active eq true
GET /api/companies/{id}/customerGroups
POST /api/companies/{id}/promotions/{id}/activate
POST /api/companies/{id}/promotions/{id}/deactivate
```

**Business Rules:**
- Promotion Code auto-generated, not user-editable
- No overlapping Live promotions for same item+customer combination; see Conflict Priority rule
- **[B1] Promotion Conflict Priority:** TBD — Need clarification on how overlaps are resolved. Option A: First-created wins, Option B: Highest priority wins, Option C: Most-restrictive scope wins, Option D: Manual approval required?
- Live promotion cannot be edited; must deactivate old + create new
- Free Gift items cannot themselves be on discount in same period
- Buy X Get Y promotion: must have sufficient inventory of both items
- Promotion impact calculated and shown before activation (estimated units, revenue impact)
- Expired promotions auto-transitioned at end of Valid To date via batch job

---

### PM-3: Step Discount & Bundle (ส่วนลดขั้นบันได+สินค้าชุด)

**Module Brief:**  
Manage quantity-based tiered discounts and pre-configured product bundles. Simpler interface than PM-2 but covers most day-to-day promotions.

**Key Screens:**
1. **Step Discount Header** (Page Header)
   - Discount Scheme Code
   - Item / Category
   - Description
   - Effective Period
   - Status (Draft → Confirmed → Live)

2. **Discount Tiers** (Line Items)
   - From Qty
   - To Qty
   - Discount % OR Fixed Price
   - Display Order

3. **Bundle Configuration**
   - Bundle Name
   - SKU List (Item Code + Qty)
   - Bundle Price
   - Recommended Retail Price (for margin calculation)

**ERP Form Sections:**
- Page Header: Code, Item/Category, Period
- Line Items: Qty bracket + discount
- Tabs: Bundle Details, Usage History
- Summary: Most-used tier, avg discount given
- Action Bar: Save, Activate, Deactivate, Cancel

**Status Flow:**
```
Draft → Confirmed → Live → Expired/Cancelled
```

**SC Components Used:**
- SC2 (ItemSearch)
- SC9 (PromoPrice)

**RBAC:**

| Role | View | Create | Activate | Cancel |
|------|------|--------|----------|--------|
| Sales | ✓ | ✓ | ✗ | ✗ |
| Pricing Manager | ✓ | ✓ | ✓ | ✓ |
| System Admin | ✓ | ✓ | ✓ | ✓ |

**BC API Calls:**
```
GET /api/companies/{id}/stepDiscounts?$expand=tiers
POST /api/companies/{id}/stepDiscounts
PATCH /api/companies/{id}/stepDiscounts/{id}/tiers
GET /api/companies/{id}/bundles?$expand=items
POST /api/companies/{id}/bundles
```

**Business Rules:**
- Qty brackets must not overlap
- To Qty of tier N must equal From Qty of tier N+1 (continuous)
- Bundle items cannot include another bundle (no nesting)
- Bundle price must be < sum of individual prices (else no incentive)
- Step discount and promotion scheme are mutually exclusive per item in same period

---

### PM-4: Quota Management (โควต้าพนักงาน)

**Module Brief:**  
Set sales targets and commission rates per salesperson, tracked against promotion usage and discount budgets.

**Key Screens:**
1. **Sales Quota Header** (Page Header)
   - Employee Code / Salesperson
   - Period (Month/Quarter/Year)
   - Target Sales Amount (THB)
   - Target Unit Qty
   - Commission Type (% of Sales / Tiered Rate / Flat per Unit)

2. **Quota Tiers** (Line Items) — If Tiered
   - Sales Amount From/To
   - Commission Rate %
   - OR Flat Commission Amount

3. **Discount Budget** (Separate Tab)
   - Total Discount Allowance (%)
   - Total Discount Allowance (THB)
   - Used to Date
   - Remaining

4. **Performance Tracker** (Dashboard Tab)
   - YTD Sales vs Target
   - YTD Units vs Target
   - Total Discount Given (%)
   - Commissions Earned to Date

**ERP Form Sections:**
- Page Header: Employee, Period, Targets
- Doc Header: Commission Structure
- Party: Applicable to (specific salesperson or sales team)
- Line Items: Tier definitions (if applicable)
- Tabs: Performance, Discount Budget, History
- Summary: Achievement %, Commission amount
- Action Bar: Save, Activate, Calculate Commission, Cancel

**Status Flow:**
```
Draft → Confirmed → Active → Closed (at period end)
```

**SC Components Used:**
- None (Employee lookup from MD-4)

**RBAC:**

| Role | View | Create | Approve | Close |
|------|------|--------|---------|-------|
| Salesperson | ✓ Own | ✗ | ✗ | ✗ |
| Sales Manager | ✓ All | ✓ | ✓ | ✓ |
| Finance Manager | ✓ All | ✗ | ✗ | ✓ |
| System Admin | ✓ | ✓ | ✓ | ✓ |

**BC API Calls:**
```
GET /api/companies/{id}/employees?$filter=status eq 'Active'
POST /api/companies/{id}/salesQuotas
PATCH /api/companies/{id}/salesQuotas/{id}
GET /api/companies/{id}/salesQuotas/{id}?$expand=tiers,discountBudget
GET /api/companies/{id}/salesOrders?$filter=assignedTo eq '{employeeId}' and postingDate ge '{periodStart}'
POST /api/companies/{id}/salesQuotas/{id}/calculateCommission
```

**Business Rules:**
- Quota period must align with BC fiscal calendar
- Commission calculated at period close; locked after close
- Discount budget depletes as promotions are applied in orders
- If salesperson exceeds discount budget, system alerts Sales Manager (manual approval needed)
- Performance tracker pulls from posted Sales Orders only
- Commission payout flag set during Calculate action; triggers GL posting

---

### PM-5: Promotion Simulator (จำลองราคา)

**Module Brief:**  
Tool for salesperson to preview final selling price given specific items, customer, and quantity. Shows margin impact of applying different promotions.

**Key Screens:**
1. **Simulator Input** (Interactive form)
   - Customer Selection (SC1 CustomerSearch)
   - Item Selection (SC2 ItemSearch) — Can add multiple items
   - Qty per Item
   - Manual Promotion Selection (checkbox list of active promotions, including/excluding logic)
   - Apply Promo Step-by-Step or Show All Combinations

2. **Price Calculation Output**
   - Base Price (from PM-1 Price List)
   - Active Promotions Applied (sequence shown)
   - Discount Amount (THB)
   - Final Selling Price
   - Margin % (Final Price - Cost Price) / Final Price
   - Estimated Commission Impact

3. **Promotion Comparison Panel**
   - Side-by-side comparison of different promo combinations
   - Impact on Gross Profit per item
   - Impact on Customer Total Amount

4. **Save Quote Button**
   - Saves simulator output as Draft Sales Quote
   - Quote can later be converted to Sales Order

**ERP Form Sections:**
N/A — Special read-only interface, not an ERP document

**Status Flow:**
N/A

**SC Components Used:**
- SC1 (CustomerSearch)
- SC2 (ItemSearch)
- SC9 (PromoPrice) — reads all active promotions + price lists

**RBAC:**

| Role | Access | Can Save Quote |
|------|--------|----------------|
| Sales | ✓ | ✓ |
| Salesperson | ✓ | ✓ |
| Sales Manager | ✓ | ✓ |
| Other roles | ✗ | ✗ |

**BC API Calls:**
```
GET /api/companies/{id}/items?$filter=type eq 'Inventory' or type eq 'Service'
GET /api/companies/{id}/customers?$filter=blocked eq ''
GET /api/companies/{id}/salesPriceLists?$filter=status eq 'Posted'
GET /api/companies/{id}/promotions?$filter=status eq 'Live'
GET /api/companies/{id}/items/{id}?$select=costPrice,salesAccount
POST /api/companies/{id}/salesQuotes (to save simulator output)
```

**Business Rules:**
- Simulator shows prices in customer's currency
- Promotion sequence follows PM Priority rules (see PM-2)
- Margin calculation uses Item cost from Item Master (MD-1)
- Cost price shown only if user has finance role (field-level permission)
- Margin % < 10% triggers warning message (yellow highlight)
- Margin % < 0 triggers error (red highlight) — cannot save quote
- Saved Quote keeps snapshot of all prices + promos applied (for audit trail)
- Simulator resets when switching customer or clearing item list

---

### ~~PM-6: Sale-In Accrual~~ → ย้ายไป **PO-7** (Purchase Module)

> **เหตุผลที่ย้าย:** Sale-In Accrual (งบส่งเสริมการขายจากห้าง/Vendor) มีเจ้าภาพคือ **จัดซื้อ** เพราะเป็นคนเจรจา Trade Agreement
> 
> **Cross-View ใน Promotion:**
> PM-Q Dashboard แสดงสรุปงบส่งเสริมการขายแบบ Read-Only:
> - งบ Realized (รับเงินแล้ว) → ใช้คำนวณ True Margin ได้
> - งบ Accrued (ยังไม่ได้เอกสาร) → ใช้ประมาณการเท่านั้น ยังนำมาหักต้นทุนจริงไม่ได้
> 
> **ดู Spec เต็ม:** → `PO_purchase.md` → PO-7 Sale-In Accrual
> **Finance ดู:** → `FI_finance.md` → FI-8 Accrual Monitor

---

## Business Rules Summary

### Pricing Hierarchy & Determination

1. **Price Calculation Sequence** (applied in order):
   - Base: Item Standard Cost + Standard Markup = List Price
   - Step 1: Apply Customer-specific Price List (PM-1) — if exists, overrides List Price
   - Step 2: Apply Active Promotions (PM-2, PM-3, PM-4) by priority
   - Step 3: Apply Step Discounts (PM-3) if quantity threshold met
   - Step 4: Apply Free Gifts or Bundle price if applicable
   - Final Price = Result after all steps
   - **⚠️ VAT Golden Rule: ทุกขั้นตอนข้างบน คำนวณจากราคาก่อน VAT เสมอ → บวก VAT 7% เป็นขั้นสุดท้าย**

   **VAT Golden Rule (บังคับทุก Module):**
   ```
   ❌ ผิด: (ราคารวม VAT) - ส่วนลด = ราคาสุทธิ
   ✅ ถูก: (ราคาก่อน VAT) - ส่วนลด = ราคาสุทธิก่อน VAT → + VAT 7% = ราคาสุทธิรวม VAT
   
   ตัวอย่าง: สินค้าราคา 10,700 (รวม VAT)
   ❌ ผิด: 10,700 - 5% = 10,165
   ✅ ถูก: 10,000 (ก่อน VAT) - 5% = 9,500 → + VAT = 10,165 (บังเอิญตรง)
   
   แต่ถ้าส่วนลดหลายชั้น จะผิดเพี้ยนทันที:
   ❌ ผิด: 10,700 - 5% - 3% = 9,848.09
   ✅ ถูก: 10,000 - 5% = 9,500 - 3% = 9,215 → + VAT = 9,860.05
   ผลต่าง: ฿11.96 ต่อชิ้น — สะสมเดือนละหมื่นชิ้น = ขาดทุนเดือนละ ฿119,600
   ```

   **Net Cost Calculator (PM-5 Simulator เพิ่มฟังก์ชัน):**
   ```
   ต้นทุนตั้งต้น (Unit Cost ก่อน VAT)
   - Trade Discount (ส่วนลดจากห้าง)
   - Volume Discount (ส่วนลดตามปริมาณ)
   - Sell-in Benefit (จาก PO-7 ถ้ามี)
   ────────────────────────
   = ต้นทุนสุทธิ (Net Cost)
   + กำไรเป้าหมาย X%
   ────────────────────────
   = ราคาขายก่อน VAT
   + VAT 7%
   ────────────────────────
   = ราคาขายรวม VAT
   ```

   **Reverse Calculate Mode (PM-5):**
   ```
   Input:  ต้นทุนสุทธิ = ฿9,215 | กำไรเป้าหมาย = 15%
   Output: ราคาขายก่อน VAT = 9,215 ÷ (1 - 0.15) = ฿10,841
           ราคาขายรวม VAT = 10,841 × 1.07 = ฿11,600
           GP% ตรวจสอบ = (10,841 - 9,215) ÷ 10,841 = 15.00% ✅
   ```

2. **Promotion Conflict Resolution** ✅ **[B1] RESOLVED**
   - **วิธี: Priority Number + Stack ไม่เกิน 2 ชั้น**
   - แต่ละโปรมี Priority 1-10 (1 = สำคัญสุด) — Promo Manager กำหนด
   - **กรณีโปรซ้อนกัน (สินค้า + ลูกค้าเดียวกัน):**
     - Stack ได้สูงสุด 2 โปร (Priority สูงสุด 2 ตัว)
     - ลำดับ: ใช้โปร Priority สูงกว่าก่อน → ใช้โปรที่ 2 ต่อ (คำนวณจากราคาหลังโปรแรก)
     - ถ้ามีโปรที่ 3+ ซ้อนอีก → **ต้องอนุมัติ** จาก Sales Manager ก่อนใช้
   - **Safety Net:** หลัง Stack แล้ว GP% < 10% → 🟡 Warning | GP% < 0% → 🔴 Block ต้องอนุมัติ GM
   - **ตัวอย่าง:**
     ```
     แอร์ Daikin ราคา 10,000 (ก่อน VAT)
     โปร A (Priority 1): ลด 10% ทุกรุ่น → 10,000 × 0.90 = 9,000
     โปร B (Priority 3): ซื้อ 5+ ลดอีก 5% → 9,000 × 0.95 = 8,550
     → Stack 2 ชั้น OK ✅ → GP% = (8,550-7,500)/8,550 = 12.3% ✅
     
     โปร C (Priority 5): ลดเพิ่ม 3% → ชั้นที่ 3 ❌ ต้องอนุมัติก่อน
     ```

3. **Shared Component SC9 (PromoPrice)** Responsibility:
   - SC9 READS from PM module (all active Price Lists + Promotions)
   - SC9 is READ-ONLY for sales orders, quotes, service orders
   - SC9 computes final price using Pricing Hierarchy sequence
   - SC9 must be called on every line item in Sales/Service modules
   - SC9 caches prices for 5 minutes to reduce BC API calls

### Commission & Quota

4. **Salesperson Commission Calculation**:
   - Commission locked per month; recalculated only during month-close process
   - If salesperson exceeds discount budget (PM-4), system alerts Sales Manager
   - Sales Manager must approve excess discount in writing (audit trail required)
   - Commission NOT reduced if discount budget exceeded (separate issue)

5. **Discount Budget Tracking**:
   - PM-4 Quota sets % and THB limits per salesperson per period
   - Each promotion/discount applied in SO depletes budget
   - Real-time dashboard shows remaining budget
   - Budget resets on period boundary (per Quota period, not calendar month)

### Promotion Lifecycle

6. **Promotion Lifecycle Rules**:
   - Draft → Edit freely
   - Confirmed → Ready to go Live
   - Live → Cannot edit; must deactivate & create new
   - Expired → Auto-transitioned at Valid To datetime
   - Cancelled → Manual action; reason log required
   - Deactivated → Can be re-activated if still within Valid period

7. **Promotion Scope & Constraints**:
   - Promotion must specify Item scope (All / Category / Specific Items)
   - Promotion must specify Customer scope (All / Group / Specific)
   - If both are specific, it's the most restrictive combination
   - No two Live promotions can have identical Item + Customer scope in overlapping dates
   - If overlap detected at activation, system shows conflict warning; requires manager approval to override

### Pricing for Cost Analysis

8. **Cost Price Field (PM-1)**:
   - Auto-populated from Item Master (MD-1) Cost Price
   - Hidden from Sales role (field-level permission in CF-3)
   - Visible to Finance Manager & System Admin
   - Used for margin calculation in PM-5 Simulator
   - Not used in price determination (only for analysis)

9. **Margin Calculation**:
   - GP% = (Final Selling Price - Item Cost) / Final Selling Price × 100
   - PM-5 Simulator shows GP% for each line
   - GP% < 10% = Warning (yellow)
   - GP% < 0% = Error (red, cannot save quote)
   - GP% target = Industry standard TBD (ask Finance Manager)

### Accrual Management

10. **Sale-In Accrual Tracking → ย้ายไป PO-7 (Purchase Module)**:
    - เจ้าภาพ: จัดซื้อ (PO-7) — เจรจาและติดตาม Agreement
    - Finance เห็น Cross-View: FI-8 Accrual Monitor
    - Promotion เห็น Cross-View: PM-Q สรุปงบ Realized vs Accrued
    - ดู Spec เต็ม → `PO_purchase.md` → PO-7

### Audit & Compliance

11. **Audit Trail Requirements**:
    - All price changes logged with: User, Old Value, New Value, Timestamp, Reason
    - Promotion activations/deactivations require manager approval
    - Discount overrides (manual price adjustments) flagged and require approval
    - PO-7 accruals retained 5+ years for tax/audit
    - Monthly reconciliation report: Claimed vs Received accruals

12. **Data Quality Rules**:
    - Item must be active in Item Master (MD-1) to appear in promotions
    - Customer must be active in Customer Master (MD-2) to target
    - Promotion effective dates must be within fiscal period
    - No backdated promotions (Effective From ≥ today)
    - Bulk price list changes require staging + batch validation before posting

---

## BC Table Reference

| BC Table Name | BC Table # | Portal Use | Read/Write |
|---------------|-----------|-----------|-----------|
| Sales Price | 7002 | PM-1 Price Lists | RW |
| Sales Line Discount | 71 | PM-3 Step Discounts | RW |
| Item Discount Group | 462 | PM-2, PM-3 | RW |
| Customer Discount Group | 100 | PM-2 target groups | R |
| Item | 27 | Item lookups | R |
| Customer | 18 | Customer lookups | R |
| Sales Header | 36 | Commission calc (posted) | R |
| Item Unit of Measure | 5404 | Item UOM | R |
| General Ledger Entry | 17 | GL audit trail | R |
| Custom: Promotions | — | PM-2 Promotion Schemes | RW |
| Custom: Vendor Obligations | — | PO-7 (Cross-View in PM-Q) | R |

---

## Implementation Notes

- **Phase P1:** PM-Q, PM-1 (Price List), PM-2 basic (no conflict detection yet)
- **Phase P3:** PM-3 (Step Discount), PM-4 (Quota), PM-5 (Simulator), PM-2 conflict detection
- **PM-6 (Sale-In Accrual):** ย้ายไป PO-7 ใน Purchase Module แล้ว (ดู Cross-View ใน PM-Q)
- **API Rate Limiting:** BC API calls to Price Lists must be cached; see IA module for details
- **Field-Level Permissions:** Cost Price and GL Account fields require CF-3 role-based hiding
- **Localization:** All Thai field labels and descriptions included; Support EN+TH display names
- **Error Handling:** Invalid promotion date ranges, cost price < selling price, etc. must show user-friendly messages

---

**End of PM Module Spec**
