# 04 — BC365 Integration

> **Scope:** การเชื่อม Portal กับ Microsoft Dynamics 365 Business Central
> **ใช้เมื่อ:** วางแผน phase / map ฟิลด์ / แก้ integration issue

---

## 1. หลักคิด Portal vs BC365

```
  ┌──────────────────┐                  ┌──────────────────────┐
  │    PORTAL        │  ──── API ────→  │  BC365 (SaaS cloud)  │
  │  (System of      │                  │  System of Record    │
  │   Engagement)    │  ←─── API ────── │  (ต้นทางข้อมูลจริง)   │
  │                  │                  │                       │
  │  - UI ที่ user   │                  │  - Database           │
  │    เห็น         │                  │  - Workflow engine    │
  │  - Validation    │                  │  - Ledger             │
  │    layer         │                  │  - Report             │
  │  - Workflow UX   │                  │                       │
  └──────────────────┘                  └──────────────────────┘
```

**หลักการสำคัญ:**

1. **BC365 = ความจริง** — ข้อมูลสุดท้ายอยู่ใน BC
2. **Portal = UX layer** — ทำเฉพาะ UI, validation, workflow orchestration
3. **ห้าม duplicate data** — Portal ไม่เก็บข้อมูลซ้ำกับ BC (เก็บแค่ cache + state)
4. **ทุก transaction เข้า BC ทาง API** — ไม่ bypass ไปเขียน DB ตรง

---

## 2. BC365 Entity Mapping

### 2.1 Master Data

| Portal Module | BC Entity | หมายเหตุ |
|--------------|-----------|---------|
| MD-1 Item Master | `Item` | Attributes → Item Attribute |
| MD-2 Customer | `Customer` | Dimension → สาขา |
| MD-3 Vendor | `Vendor` | + Vendor Agreement extension |
| MD-4 Employee | `Employee` + `Salesperson/Purchaser` | 2 entities ต้อง sync |
| MD-5 Branch & WH | `Location` + `Dimension Value` | ใช้ Location เป็น warehouse |
| MD-6 Price List | `Price List` / `Customer Price Group` | BC v22+ |

### 2.2 Sales (SL)

| Portal Module | BC Entity |
|--------------|-----------|
| SL-1 Quotation | `Sales Quote` |
| SL-2 Reservation | `Sales Order` (status=Open) |
| SL-3 Deposit | `Sales Deposit` (custom) + `Cust. Ledger Entry` |
| SL-4 Invoice | `Sales Invoice` + `Posted Sales Invoice` |
| SL-5 Credit Memo | `Sales Credit Memo` |
| CM-1 Commission | `Commission Entry` (custom table) |
| CL-1~3 Claims | `Sales Return Order` (mapped) + custom claim status |

### 2.3 Purchase (PO)

| Portal Module | BC Entity |
|--------------|-----------|
| PO-1 PR | `Purchase Quote` (as requisition) |
| PO-2 RFQ | (Custom) ต่อยอดจาก Purchase Quote |
| PO-4 PO | `Purchase Order` |
| PO-5 GRN | `Posted Purch. Receipt` |
| PO-6 AP Invoice | `Purchase Invoice` + `Posted Purch. Invoice` |
| PO-7 Sale-In Accrual | (Custom) + `G/L Entry` |
| PO-8 Deposit Bill | `Vendor Deposit` (custom) |

### 2.4 Warehouse (WH)

| Portal Module | BC Entity |
|--------------|-----------|
| WH-1 GRN Receive | `Warehouse Receipt` → `Posted Receipt` |
| WH-2 Transfer | `Transfer Order` → `Posted Transfer Shipment/Receipt` |
| WH-3 Stock Count | `Phys. Inventory Journal` |
| WH-R Goods Issue | `Warehouse Shipment` → `Posted Shipment` |
| WH-NM Non-Move | (Report) query `Item Ledger Entry` |

### 2.5 Finance (FI)

| Portal Module | BC Entity |
|--------------|-----------|
| FI-1 AR Receipt | `Cash Receipt Journal` → `Cust. Ledger Entry` |
| FI-2 AP Payment | `Payment Journal` → `Vendor Ledger Entry` |
| FI-3 Bank Rec | `Bank Acc. Reconciliation` |
| FI-4 Journal | `General Journal` |
| FI-7 Period Close | `Accounting Period` + `Close Income Statement` |
| FI-8 Accrual | (Custom) + `Deferral Template` |
| FI-9~11 Fixed Asset | `Fixed Asset` + `FA Depreciation Book` + `FA Ledger Entry` |
| FI-12 WHT | (Custom table) + `G/L Entry` |
| FI-13A/B Dual-Book | (Custom) 2 ชุด G/L Entry (หลัก + ภาษี) |

### 2.6 Config (CF)

| Portal Module | BC Entity |
|--------------|-----------|
| CF-1 RBAC | `User` + `User Group` + `Permission Set` |
| CF-2.1 Tax Setup | `Tax Group` + `VAT Posting Setup` |
| CF-2.2 Number Series | `No. Series` + `No. Series Line` |
| CF-2.6 Approval Matrix | `Approval Template` + (custom extension) |
| CF-9 Entity Tag | (Custom table) — global dimension |

---

## 3. Phase Plan (Integration Timing)

### Phase 1 — Core Transactions (Q3 2569)

**Scope:**
- Portal ↔ BC Master Data (read-only sync to portal cache)
- SL-1 ~ SL-4 (Quote → Invoice)
- PO-4 ~ PO-6 (PO → GRN → AP Invoice)
- WH-1 ~ WH-3 (Receive, Transfer, Count)
- FI-1, FI-2 (AR, AP)

**API Priority:**
- `POST /items` (read item master)
- `POST /customers`, `POST /vendors`
- `POST /salesQuotes`, `/salesOrders`, `/salesInvoices`
- `POST /purchaseOrders`, `/purchaseInvoices`
- `POST /journals/{id}/journalLines`

**Not yet:**
- Workflow (manual approval in portal, post หลัง)
- Real-time sync (batch job ทุก 15 นาที)

### Phase 2 — Extended Modules (Q4 2569)

**Add:**
- Full sync real-time (webhook + polling fallback)
- SV-1 ~ SV-5 Service flow
- CL-1~3 Claims
- FI-3 Bank Rec, FI-4 Journal
- Credit Control (FI-6) + Credit Approval workflow
- Fixed Asset FI-9 ~ FI-11

### Phase 3 — Closing & Compliance (Q1 2570)

**Add:**
- FI-7 Period Close (orchestrate BC close from portal)
- FI-12 WHT auto-calc + ภ.ง.ด.3/53 generate
- FI-13 Dual-Book (Entity Tag → 2nd ledger)
- e-Tax Invoice (Thai RD format)
- e-Filing (ภ.พ.30)

### Phase 4 — BI / Mobile (Q2-Q3 2570)

**Add:**
- Management Dashboard (aggregate from multiple BC companies)
- Mobile app — offline-first with sync
- Power BI embed (แทน custom dashboard บางตัว)

### Phase 5 — E-Commerce (2571)

**Add:**
- B2B Customer Portal
- Marketplace connector (Lazada, Shopee API → BC Sales Order)
- Public REST API (vendor integration)

---

## 4. API Architecture (ที่คาดหมาย)

```
  Portal (Browser)
      │
      ▼
  Portal API Gateway  (Next.js API routes / FastAPI)
      │
      ├─→ BC365 OData API  (OAuth 2.0)
      │
      ├─→ Custom tables (PostgreSQL)  — Claims, Commission, etc.
      │
      ├─→ Cache layer (Redis)
      │
      └─→ Event Bus (BC webhooks → Portal state)
```

**Auth Flow:**
- User login → Azure AD / Entra ID → OAuth token
- Portal service account → BC via OAuth 2.0 Client Credentials
- Token refresh handled by portal backend

---

## 5. Dual-Book Architecture (D Rule)

**ปัญหา:** กลุ่มแสงวิจิตรมี 4 นิติบุคคล — SWT, SWE, VMN, WPS — ต้องมีงบการเงินแยก **แต่** การซื้อ/ขายจริงปนกัน (ห้างออก Invoice นาม SWT, stock ใช้ใน SWE)

**Solution: Entity Tag + Dual-Book**

```
CF-9 Entity Tag
     │
     ▼
  ทุก AP Invoice (PO-6) ต้องติด Tag:
     - Tag "1" → SWT
     - Tag "2" → SWE
     - Tag "3" → VMN
     - Tag "novat" → ไม่เข้า VAT (เช่น ของเบ็ดเตล็ด)
     │
     ▼
FI-13A "ห้องหลัก"     FI-13B "ห้องภาษี"
(Operational)          (Tax Reporting)
     │                       │
     ▼                       ▼
  BC Company 1          BC Company 2 (โอนตาม Tag)
  (รวมทุก entity)        (แยกตาม Tag)
```

**Implementation:**
- BC365 ใช้ **Dimension** = `ENTITY_TAG`
- Posted entries ทุก record มี dimension value
- Portal FI-13B job: query by dimension → generate report แยกนิติ
- VAT return (ภ.พ.30) → แยกตาม BC Company (ใน B ห้อง)

---

## 6. Authentication & Authorization (RBAC)

### 9 Roles (CF-3)

| Role | BC Permission Set | Portal Access |
|------|-------------------|--------------|
| Admin | SUPER | ทุกหน้า |
| Accountant | D365 ACCOUNTING | FI-* + MD read |
| AP Clerk | D365 ACCOUNTING | FI-2, PO-6 read |
| AR Clerk | D365 ACCOUNTING | FI-1, SL-* |
| Sales | D365 SALES DOC | SL-* + CM-1 self |
| Purchaser | D365 PURCH DOC | PO-* |
| Warehouse | D365 LOCATIONS | WH-* |
| Service Tech | (custom) | SV-* + CL-* |
| Executive | D365 READ | EX-* + RP-* read |

**Cross-Company:** Exec/Admin เห็น multi-company, role อื่นเห็นเฉพาะ company ของตัว

---

## 7. Data Sync Strategy

| Entity | Strategy | ความถี่ |
|--------|---------|--------|
| Master Data (MD-*) | Pull + cache | Hourly batch |
| Transactions ใหม่ (SL/PO) | Push ทันทีเมื่อ Post | Real-time |
| Status update | Webhook จาก BC | Real-time |
| Reports | Query ตรง BC | On-demand |
| Stock level | Cache 5 นาที | Polling |

---

## 8. Error Handling & Retry

**IA-2 Error Log & Retry:**
- ทุก API call log ลง custom table
- Failed → retry 3 ครั้ง (exponential backoff)
- Permanent fail → escalate queue + email admin
- Duplicate detection ด้วย `idempotencyKey` (portal generate)

---

## 9. Testing Approach (P1+)

- **Mock BC** — ใช้ BC Sandbox environment
- **Test Company** ใน BC — แยก COMPANY_TEST_SWT, COMPANY_TEST_SWE
- **Integration test** — post transaction ใน portal → assert ใน BC
- **Rollback test** — แก้ transaction ใน portal → reverse ใน BC ต้องทำได้

---

## 10. Reference Resources

- BC365 OData API: https://learn.microsoft.com/dynamics365/business-central/dev-itpro/
- BC Connect Apps: `aka.ms/bcconnectapps`
- Thai localization (WHT, VAT): Microsoft Partner — Thai localization pack
- Architecture doc อื่น: `/Design Ai/sangwijit-portal-architecture.html`
