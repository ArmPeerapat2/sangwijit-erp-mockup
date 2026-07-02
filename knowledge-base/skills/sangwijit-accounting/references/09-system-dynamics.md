# ระบบบัญชี: Microsoft Dynamics 365 Business Central (Q4/2568)

> **สถานะ:** Draft v1 — ร่างตาม best-practice  
> Implementation target: Q4/2568  
> Field ที่มี `[TBD]` รอทีม IT + บัญชี + Partner กำหนดร่วมกัน

---

## 1. BC365 คืออะไร

Microsoft Dynamics 365 Business Central (BC365) เป็น cloud ERP ที่แสงวิจิตรจะใช้แทน Hero ครอบคลุม:

- **Finance** — GL, AP, AR, Bank, Fixed Asset, Tax
- **Supply Chain** — Items, PO, Sales, Inventory, Warehouse
- **Project** — Job, Time sheet, Resource
- **HR** (ขั้นต้น) — Employee master
- **Power BI** สำหรับ reporting
- **REST API (OData v4)** สำหรับ integrate กับ Portal

**Edition:** `[TBD — Premium / Essentials]`  
**Deployment:** `[TBD — Online SaaS / On-Premise]`  
**Partner:** `[TBD — บริษัท implementation partner]`  
**จำนวน license:** `[TBD]` Full User + `[TBD]` Team Member

---

## 2. โครงสร้างโมดูลใน BC365

| โมดูล | ใช้ทำอะไร | Portal Module ที่ mirror |
|---|---|---|
| General Ledger | ผังบัญชี, JV, งบ | FI-5, FI-10 |
| Receivables | AR Invoice, รับชำระ | FI-1 |
| Payables | AP Invoice, จ่ายชำระ | FI-2 |
| Bank Management | Bank Rec | FI-3 |
| Fixed Assets | ทรัพย์สิน, ค่าเสื่อม | FI-11 (Phase 2) |
| VAT Management | VAT ซื้อ/ขาย, ภ.ง.ด. | FI-4 |
| Sales | Quotation, SO, Invoice | SL-1, SL-2, SL-F3 |
| Purchase | PR, PO, GRN | PO-1, PO-2, PO-3 |
| Inventory | Item, Stock, Transfer | WH-1, WH-3 |
| Warehouse | Put-away, Pick, Count | WH-2, WH-4 |
| Service | Service Order | SV-1 |
| Human Resources | Employee master | MD-4 |

---

## 3. สถาปัตยกรรมระหว่าง Portal ↔ BC365

```
┌──────────────────────────────┐
│   Dynamic Web Portal (UX)    │ ← พนักงานใช้งานจริงที่นี่
│   HTML + inline CSS + JS     │
└──────────────┬───────────────┘
               │ OData v4 API
               │ (OAuth 2.0)
               ↓
┌──────────────────────────────┐
│  Microsoft Dynamics BC365    │ ← system of record ของบัญชี
│  (Finance / Posting / Report)│
└──────────────┬───────────────┘
               │
               ↓
          Power BI / Excel

Principle: Portal = UX layer, BC365 = Finance engine
```

ดู `/portal/04-bc365-integration.md` สำหรับ API spec ครบ

---

## 4. Dual-Book Architecture ใน BC365

แสงวิจิตรมี 4 นิติบุคคล (SWT/SWE/VMN/WPS) แต่บาง transaction ต้อง tag หลายเล่ม

| ชั้น | ชื่อ | ทำอะไร | BC365 Feature |
|---|---|---|---|
| CF-9 | Entity Tagging | tag transaction ด้วย entity dimension | Dimension / Dimension Value |
| FI-13A | Book A (Statutory) | book หลักส่งสรรพากร | Posting with Dimension A |
| FI-13B | Book B (Management) | book บริหาร แสดง actual economic | Posting with Dimension B |

**BC365 Setup ที่ต้องทำ:**

- สร้าง Dimension ชื่อ `ENTITY` มี 4 values: SWT, SWE, VMN, WPS
- สร้าง Dimension ชื่อ `BOOK` มี 2 values: A (statutory), B (management)
- Dimension mandatory ทุก posting
- Permission Set: ใครเข้าเห็น Book B ได้

---

## 5. ภาษีไทย (Thailand Localization)

BC365 ไม่มี Thai localization ออกจากกล่อง ต้องใช้:

- **Thailand Tax Extension** `[TBD — ของ Partner ไหน]`
- หรือ custom build

ต้องครอบคลุม:

| ประเภท | BC365 Native | Thai Custom |
|---|---|---|
| VAT 7% ซื้อ | ✅ | ✅ |
| VAT 7% ขาย | ✅ | ✅ |
| หัก ณ ที่จ่าย ภ.ง.ด.3 (บุคคล) | ❌ | ต้อง custom |
| หัก ณ ที่จ่าย ภ.ง.ด.53 (นิติ) | ❌ | ต้อง custom |
| WHT Certificate (50 ทวิ) | ❌ | ต้อง custom |
| ภ.พ.30 | ❌ | ต้อง custom |
| Buddhist Era on document | ❌ | ต้อง custom |

---

## 6. Flow งาน AP ใน BC365

```
Vendor ส่ง Invoice
  ↓
Portal: FI-2 → scan/key + attach PDF
  ↓ (API POST)
BC365: Create Purchase Invoice (unposted)
  ↓
ตรวจ 3-way match (PO + GRN + Invoice) ← กฎ B5
  ↓
Approval workflow (Portal → BC365 state)
  ↓
BC365: Post Purchase Invoice
  ↓
Payment Journal → เลือก invoice ที่ครบกำหนด
  ↓
Post + Export payment file (ถ้ามี)
  ↓
Bank Rec
```

---

## 7. Flow งาน AR ใน BC365

```
Portal: SL-2 → สร้าง SO
  ↓ Credit check (R rule) via CF-2.6 → BC365 customer credit limit
  ↓ (API POST)
BC365: Sales Order (released)
  ↓
WH-2 GRN → BC365: Warehouse Shipment / Posted Shipment
  ↓
BC365: Post Sales Invoice (+ ใบกำกับภาษี)
  ↓ + VAT ขาย + GL entries + Dimension ENTITY + BOOK
  ↓
ลูกค้าจ่าย → Portal: FI-1 บันทึกรับชำระ
  ↓ (API POST)
BC365: Cash Receipt Journal → Apply to Invoice → Post
  ↓
Bank Rec
```

---

## 8. รายงาน Financial ที่ต้อง setup

| รายงาน | BC365 Feature | ต้อง Customize |
|---|---|---|
| งบทดลอง | Trial Balance | ภาษาไทย + พ.ศ. |
| งบกำไรขาดทุน | Account Schedule: Income Statement | ฟอร์แมตตามกรมพัฒน์ |
| งบดุล | Account Schedule: Balance Sheet | ฟอร์แมตตามกรมพัฒน์ |
| AR Aging | Customer - Aging | เพิ่ม bucket ตาม R rule |
| AP Aging | Vendor - Aging | มาตรฐาน OK |
| VAT ซื้อ/ขาย | VAT Statement | ต้อง custom เป็น ภ.พ.30 |
| Cash Flow | Cash Flow Forecast | ใช้ได้ |

**Power BI Dashboard:** `[TBD — ทีม BI เตรียม]`

---

## 9. Data Migration (Cutover)

### Master Data (ทำก่อน cutover)

- [ ] Chart of Accounts (COA) — mapping Hero → BC365
- [ ] Customer master (แยก active / inactive)
- [ ] Vendor master
- [ ] Item master
- [ ] Employee master
- [ ] Bank master
- [ ] Dimension values (ENTITY x 4, BOOK x 2, DEPT, …)
- [ ] Tax Posting Setup (VAT 7%)

### Opening Balance (วัน cutover)

- [ ] GL opening balance รายบัญชี × รายนิติบุคคล
- [ ] Open AR invoice รายใบ
- [ ] Open AP invoice รายใบ
- [ ] Open Inventory (qty + cost)
- [ ] Fixed Asset (cost, accumulated depreciation, NBV)
- [ ] Open Bank reconciling items

**Cutover date:** `[TBD]`

### Historical Data

- **เก็บใน Hero**: ข้อมูล 5+ ปี ใช้ read-only  
- **ไม่ migrate**: transaction history (ใหญ่เกิน + ไม่จำเป็น)

---

## 10. Parallel Run

- **ระยะเวลา:** `[TBD — แนะนำ 2-3 เดือน]`
- **Scope:** บัญชี + AR + AP + Bank + ปิดงวด
- **Target match:** 99%+ ระหว่าง Hero vs BC365
- **กำหนด tolerance:** `[TBD — เช่น ±100 บาท/เดือน]`

---

## 11. Training

| กลุ่ม | ระยะเวลา | เนื้อหา |
|---|---|---|
| Key User (Finance) | `[TBD]` ชม. | ครบทุกโมดูล + customization + reporting |
| End User (AR/AP/GL) | `[TBD]` ชม. | เฉพาะ flow ของตนเอง |
| Portal User (ทั่วไป) | `[TBD]` ชม. | ใช้แค่ UI Portal ไม่ต้องเข้า BC365 ตรง |
| IT Admin | `[TBD]` ชม. | Permission, Backup, Extension mgmt |

---

## 12. Key Business Rule ที่ต้อง config ใน BC365

| Rule | BC365 Config |
|---|---|
| **V — VAT Golden Rule** | VAT Posting Setup + Line Discount ก่อน VAT calc |
| **B1 — Sale-In Accrual** | Accrual posting schedule (Cronus pattern) |
| **B5 — 3-Way Match** | Require Receive + Invoice match; enable tolerance |
| **R — Credit Tier** | Customer Credit Limit + Payment Terms + Posting Group |
| **M — Non-Move** | Item Categories + Inventory Aging + custom report |
| **D — Dual-Book** | Dimension mandatory + permission per BOOK value |
| **F — Floor Price** | Item Card + Min Unit Price + Sales Line validation |

---

## 13. Security / RBAC

ใช้ Permission Set + User Group ของ BC365 ต้อง map กับ 9 roles ใน Portal (`/portal/04-bc365-integration.md`  RBAC)

ข้อควรระวัง:

- **Book B** (management book) → จำกัดเฉพาะ finance manager + owner
- **Post + Approve** → ห้ามเป็นคนเดียวกัน (SOD)
- **Modify Posted Entries** → block ทุก role ยกเว้น super admin

---

## 14. Go-Live Checklist

- [ ] Data migration complete + reconciled
- [ ] Master + Opening balance validated (2 สัปดาห์ ก่อน)
- [ ] Thai extension installed + tested
- [ ] Power BI Dashboard live
- [ ] User training done + quiz pass
- [ ] Parallel run 2-3 รอบ match
- [ ] Portal ↔ BC365 API live + token rotation ready
- [ ] Backup + Disaster Recovery ทดสอบแล้ว
- [ ] Support SLA กับ Partner พร้อม

**Go-Live:** `[TBD — Q4/2568]`  
**Hypercare:** `[TBD — 4-6 สัปดาห์หลัง go-live]`

---

## 15. สิ่งที่ต้องเตรียมก่อน Go-Live (สรุปเดิม)

- Data Migration: COA, Open AR/AP, Fixed Assets, Master Data ✅ (ขยายแล้วใน  9)
- Training: Key User `[TBD]` ชม. / End User `[TBD]` ชม. ✅ ( 11)
- Parallel Run: `[TBD]` สัปดาห์ก่อน Cut-over ✅ ( 10)

---

> **หมายเหตุ:** ไฟล์นี้เป็น framework ร่าง ให้ IT + Partner + ทีมบัญชีร่วมกำหนด `[TBD]` ให้ชัดก่อน Q3/2568 เพื่อทัน Go-Live Q4/2568
