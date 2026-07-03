# PO — Purchase Module Spec (งานจัดซื้อ)

**Version:** 2.2 | **Updated:** 2026-04-26 | **Phase:** P1 | **Module Code:** PO

> **v2.2 changes (per user 2026-04-26):**
> - **PO-2 Vendor Commitment = 1 record per type** · ไม่รวม 4 types ในใบเดียว
> - **1 item / 1 vendor มี VC หลายตัวพร้อมกันได้** (เช่น LG TT10 = 2 MOU + 1 Sell-in + 1 Sell-out + 1 Co-op = 5 records)
> - **Co-op variants:** (a) fixed budget — งบจัด event 10K · (b) triggered — ซื้อสะสม 100K → ได้ marketing budget 2K
> - **VC numbering:** `VC-{TYPE}-{YYMM}-{seq}` (เช่น `VC-MOU-2604-001`, `VC-SI-2604-002`)
>
> **v2.1 baseline (2026-04-25):**
> - Trade Promotion = **4 types** (Sell-thru ตัดออก · ไม่ใช้งานจริง)
> - **Scope** per type (รายหมวด / รายรุ่น / event)
> - **"ตั้งหนี้" semantic fix:** PO-2/PO-7 = **บันทึกข้อตกลงงบ (Vendor Commitment)** · ไม่มีผลภาษี · เซลล์เซ็นรับทราบ · แยกจาก PO-6 (AP Invoice) ที่มีผลภาษี
> - **MOS Order Rule** (≤2 critical, ≤4 OK)
> - **MD-1 Item Card cross-ref** (drill-down target จาก line items)
**BC Entity หลัก:** purchaseOrders (38/39), purchaseInvoices (122/123), vendors (23)
**อ่าน Flowchart ก่อน:** `/Design Ai/Flow Design/Purchase/Flow/` + `/Purchase/Document/`

**Source merge (2026-04-25):**
- v1.0: PO module spec (BC API + ERP Form 7 sections + RBAC + status flow)
- Obsidian vault: `C:\Users\arm99\OneDrive\claude\ArmWiki\ArmWiki\Purchasing\00-Index.md`
  - VAT Trap 4 Variants · Trade Promotion 5 Types · CN Audit Protocol · Purchasing JD-KPI · Buyer to Space Manager

---

## 🧠 Section A — Business Knowhow (อ่านก่อนออกแบบหน้า)

### A1. VAT Trap — 4 Variants ของส่วนลด

**โจทย์มาตรฐาน:** ต้นทุน 120 บาท · VAT 7% · ส่วนลด 20 บาท หรือ 20% × บนบิล หรือ หลังบิล

| Case | รูปแบบ | จังหวะ | สูตร | Cost |
|:---:|---|---|---|:---:|
| 1 | 20 บาท | หลังบิล (CN) | `(120 + 8.4) − 20` | **108.40** |
| 2 | 20 บาท | บนบิล | `(120 − 20) × 1.07` | **107.00** |
| 3 | 20% | หลังบิล (CN) | `(120 + 8.4) − (120 × 20%)` | **104.40** |
| 4 | **20% บนบิล** ⭐ | บนบิล | `(120 − 24) × 1.07` | **102.72** |

**Saving Case 1 → Case 4 = 5.68 บาท / 120 = 4.7% ของราคา**

**4 กฎทอง:**
1. **% ดีกว่าบาท** — % คิดจาก base 120 → ลดได้ 24 (เซลพยายามให้บาทเพราะ "ดูเยอะ")
2. **บนบิลดีกว่าหลังบิล** — VAT คิดจากฐานน้อยลง = เซฟ VAT 7% ของส่วนลด
3. **เซลชอบเสนอ Case 1, 3** (หลังบิล) — KPI ขายดี + ระยะใช้เงินยาว
4. **ฝ่ายจัดซื้อต้องบี้ Case 4** ทุกครั้ง · fallback Case 2 ก่อนยอม Case 3

**Trap ที่ผิด ม.79/3:**
- ❌ เอายอด inc-VAT มาคิดส่วนลด: `128.4 × 0.80 = 102.72` (ผลเท่ากันโดยบังเอิญ · ฐาน VAT ผิด → audit reject)
- ✅ Case 4 ถูก: ลด% บนบิล `96 × 1.07 = 102.72` (ฐาน VAT = 96 ตามกฎหมาย)

### A2. Trade Promotion — 4 ประเภทงบสนับสนุนคู่ค้า

> **v2.1 update:** เปลี่ยนจาก 5 → **4 ประเภท** · ตัด **Sell-thru** ออก (ไม่ใช้งานจริง · ไม่ต้องเก็บ Phase 2)

| # | ประเภท | เกิดเมื่อไหร่ | บันทึกแบบ | **Scope** | Recovery Target |
|:---:|---|---|---|---|---|
| 1 | **MOU** (Rebate) | ซื้อถึงเป้า สิ้นปี/ไตรมาส | ไตรมาส/ปี = 1 ครั้ง | **รายหมวดสินค้า** (เช่น ซักผ้า · ซักผ้า+ตู้เย็น) | ≥95% |
| 2 | **Sell-in** ⭐ | ส่วนลดทันทีตอนเปิด PO | ตามรายการซื้อ ต่อรอบ/เดือน/ไตรมาส | **รายหมวด หรือ รายรุ่น** (ซักผ้ารุ่น tt10) | 100% |
| 3 | **Sell-out** | จ่ายเมื่อขายออกสำเร็จหลังขายลูกค้า | ตามรายการซื้อ ต่อรอบ/เดือน/ไตรมาส | รายหมวด หรือ รายรุ่น | ≥85% |
| 4 | **Co-op** | งบจัด Event/ใบปลิวตามแคมเปญ | ตามตกลง | **Event/แคมเปญ** (เช่น งานเลี้ยง 10K · ลานกิจกรรม 20K · ใบปลิว) | ≥90% |

**Cycle เก็บคืน 3 ขั้น:**
1. **บันทึกข้อตกลงงบ (Vendor Commitment)** — ระบุเป้า/%/จังหวะรับ/document trail · เซลล์เซ็นรับทราบเป็นหลักฐาน · ⚠️ **ไม่มีผลทางภาษี** (ดู A6)
2. **Execution** — Sell-in หักทันที (Case 4) · MOU ติดตามยอดสะสมต่อหมวด · Co-op เก็บหลักฐาน event · Sell-out serial match
3. **Claim** — ส่งหลักฐาน → ได้ CN → Offset กับ AP จริง (ตอนนี้จะมีผลทางภาษีแล้ว) · ถ้าไม่ส่ง CN → **STOP NEW PO** (ดู A3)

### A3. CN Audit Protocol — 3 Categories

**กฎเหล็ก:** ❌ ห้ามตกลงด้วยวาจา · ✅ ทุกผลประโยชน์ต้องลงนามใน Standard Agreement Form

**3 Categories ของ CN:**
| Cat | คือ CN จาก | Trigger | ตัวอย่าง |
|---|---|---|---|
| **(1) คืนสินค้า** | Return/Defect | ส่งคืน vendor | สินค้าชำรุด, สั่งผิด, return |
| **(2) MOU/Rebate** | ผลประโยชน์ตามสัญญาซื้อ | ถึงเป้า MOU | Rebate Step Tier 2% |
| **(3) กิจกรรมพิเศษ** | Trade Support | งบ Co-op/Sell-in/Sell-out/Sell-thru | Co-op งานเปิดสาขา |

**SOP — ตรวจ CN ก่อนส่ง AP:**
1. Identify Category (1/2/3) → tag ในระบบ
2. Match กับ Agreement reference number
3. คำนวณยอดให้ถูก (VAT Case 4)
4. Forward AP เพื่อ Offset
5. Sanction Trigger ถ้าไม่มา

**Audit Checklist 7 ข้อ:**
- [ ] Category ระบุชัด (1/2/3)?
- [ ] มี Agreement reference number?
- [ ] ยอดเงิน + VAT ตรงสัญญา?
- [ ] Date issue ภายใน lead time?
- [ ] Document supporting ครบ?
- [ ] Tax invoice format ถูกต้อง?
- [ ] Offset กับ AP แล้ว?

**Sanction Flow:**
| Day | Action |
|---|---|
| 0 | Reminder (email/Line) |
| +7 | โทรตามผู้บริหาร vendor + ขึ้น Outstanding |
| +15 | Escalate ผจก.บัญชี + Formal Letter |
| +30 | ⚠️ **STOP NEW PO** — ระงับการสั่งซื้อใหม่ทุกประเภทจนกว่าจะได้ CN ครบ |

**Ageing Strategy 30/45/60 (Stock Movement):**
| Day | Action |
|---|---|
| 15 | เช็ค PSI/MOS — ของไม่เดิน → สัญญาณเซล |
| 30 | ส่งสัญญาณเตือนคู่ค้าเป็นลายลักษณ์ |
| 45 | บังคับ Sell-out หรือโปรโมชั่น |
| 60 | เคลียร์ออกให้จบก่อน Credit Term ครบ |

> **Cash Cycle:** ใช้เงินคู่ค้า ไม่ใช่เงินเรา — ของต้องขายหมดก่อน Credit Term ครบ

**Root Cause 5 ข้อ ก่อนใช้งบ Incentive:**
1. Visibility — ลูกค้าเห็นไหม?
2. Display — แกะกล่องโชว์?
3. Price Tag — ป้ายถูก/ดึงดูด?
4. Knowledge — พนักงานรู้จักสินค้า?
5. Last Resort — ค่อยอัด commission รายตัว ("อัด commission = ทางเลือกสุดท้าย")

### A4. Purchasing JD + KPI

**Purpose:** ซื้อราคาต่ำสุด คุณภาพตามสเปก ตรงเวลา + บริหารคู่ค้าให้รับผิดชอบ Stock Movement + Trade Support
**Modern Trade Mindset:** Buyer → **Space & Service Manager** — เปลี่ยนค่าเช่า/บริการเป็นกำไรสุทธิ

**หน้าที่หลัก 10 ข้อ:**
1. บริหาร Master Stock + คำนวณ Min/Max ด้วย MOS + PSI
2. **เจรจา 5 ประเภทงบสนับสนุน** (MOU, Co-op, Sell-in, Sell-out, Sell-thru)
3. ออก PO + Entity Tag ถูก + VAT Case 4
4. ติดตาม Vendor — ส่งของตรง, คุณภาพ, เอกสาร
5. **Vendor Obligation Tracking** — Rebate, Co-op, Sell-out, CN
6. **Non-move Management** — ageing 30/45/60 + บี้คู่ค้า
7. **CN Audit** — ตรวจ CN ก่อนส่ง AP (3 categories)
8. ตรวจปรับป้ายราคาในสาขา (กรณี Retail)
9. Vendor Evaluation รายไตรมาส
10. Risk Management — STOP PO ถ้า vendor ไม่ส่ง CN

**KPIs (Weight 100%):**
| # | KPI | Weight | Target | Mode |
|---|---|---|---|---|
| 1 | Cost Saving vs Budget | 20% | ≥3% | Higher |
| 2 | **Trade Support Recovery Rate** ⭐ | 20% | ≥90% | Higher |
| 3 | On-time Delivery จาก Vendor | 15% | ≥95% | Higher |
| 4 | Inventory Turnover | 15% | ≥6 รอบ/ปี | Higher |
| 5 | **Non-move Stock เจรจาได้** ⭐ | 10% | ≥70% | Higher |
| 6 | Vendor Obligation Report Timeliness | 10% | 100% | Higher |
| 7 | CN Audit Accuracy | 5% | ≥98% | Higher |
| 8 | VAT Compliance (Case 4) | 5% | ≥95% | Higher |

> **Critical KPIs:** #2 + #5 = 30% รวม — เกี่ยวเงินคืนตรง ถ้าตก = บริษัทแบกเอง

**Composite Score:** A (4.5-5.0 · Bonus 1) · B (3.5-4.4 · Bonus 2) · C (2.5-3.4 · Coach 1Q) · D (<2.5 · PIP 30/60/90)

**Mindset Test (คัด candidate):**
- Q1: ราคา 120+VAT 7% — ลด 20% หลังบิล vs บนบิล อันไหนดีกว่า? → บนบิล (Case 4 = 102.72)
- Q2: สินค้า ageing 60 วัน ทำยังไง? → บี้คู่ค้าทำ Sell-out + ขู่ระงับ PO (ไม่ใช่ลดราคาตัวเอง)
- Q3: คู่ค้าตอบ "เดี๋ยวค่อยทำ CN" → ขอเป็นลายลักษณ์ + กำหนด deadline + warn sanction

### A5. MOS Order Rule (per user 2026-04-25)

**Formula:**
```
MOS = สต๊อกในมือ ÷ (ยอดขาย 2 เดือน ÷ 2)
    = เดือนที่ของจะอยู่กับเรา (Months of Stock)
```

**Order rule (gating):**
| MOS | Status | Action |
|---|---|---|
| **≤ 2 เดือน** | 🔴 Critical | **ต้องสั่ง** — auto-trigger PR alert |
| **≤ 4 เดือน** | 🟡 OK to order | สั่งได้ตามดุลยพินิจ Buyer |
| **> 4 เดือน** | 🟢 Sufficient | **ห้ามสั่งเพิ่ม** (block PR · over-stock risk) |

**ใช้กับ:**
- **PO-1 (PR):** alert badge ตอน add line item · ถ้า MOS > 4 → warn user ก่อน submit
- **PO-Q (Queue):** Panel "MOS Critical (≤2)" — list item ที่ต้องสั่งด่วน
- **MD-1 (Item Card):** indicator field "MOS ปัจจุบัน · X.X เดือน" + recommendation
- **WH-NM (Non-move report):** cross-ref MOS > 4 = Non-move candidate

### A6. "ตั้งหนี้" Semantic Fix (per user 2026-04-25)

> **Critical:** "ตั้งหนี้" มี 2 ความหมายต่างกัน — ห้ามสับสน

| | **บันทึกข้อตกลงงบ (Vendor Commitment)** | **ตั้งหนี้เจ้าหนี้ AP Invoice** |
|---|---|---|
| **หน้า** | PO-2 (Trade Agreement) · PO-7 (Trade Support Tracking) | PO-6 (AP Invoice) |
| **ผลทางภาษี** | ❌ **ไม่มี** | ✅ มี (AP entry · WHT · VAT) |
| **เอกสาร** | "เอกสารยืนยัน" ระหว่างร้าน + เซลล์เซ็นรับทราบ | Tax Invoice จาก Vendor |
| **GL Impact** | — (Phase 2 อาจ accrue) | Dr. Inventory · Cr. AP |
| **ใช้ตอน** | อ้างอิงเงื่อนไข · คำนวณราคาขาย · trade promo recovery | จ่ายเงินจริง |
| **ผูกกับ** | สินค้า/หมวด/Vendor/period | Vendor invoice ที่อ้าง GRN |

**คำเรียกที่ถูก:**
- ✅ "บันทึกข้อตกลงงบ" / "Vendor Commitment" / "ลง Promo Booking" (PO-2, PO-7)
- ✅ "ตั้งหนี้ AP" / "ตั้งหนี้เจ้าหนี้" / "Post AP Invoice" (PO-6)
- ❌ "ตั้งหนี้" เปล่าๆ → context-dependent · ระบุชัดทุกครั้ง

---

## 📋 Section B — Menu List

| รหัส | เมนู | Phase | BC Entity | หน้าจอ | Mockup สถานะ |
|---|---|---|---|---|---|
| PO-Q | Queue Dashboard (คิวจัดซื้อ) | P1 | purchaseOrders | รายการรอดำเนินการ | ✅ มี · ยังไม่ปรับ sl-4 |
| PO-1 | ใบขอซื้อ PR (Purchase Requisition) | P1 | Custom / purchaseRequests | List + Form | ✅ ปรับ sl-4 + Doc Chain แล้ว |
| **PO-2** | **บันทึกข้อตกลงงบ (Vendor Commitment)** ⚠️ | P1 | Custom: vendorCommitments | Form | ✅ ปรับเป็น Vendor Commitment (เดิม spec = RFQ · v2.1 rename จาก Trade Agreement) |
| **PO-3** | Vendor Onboarding (simple form) ⚠️ | P1 | vendors (23) | Form | ❌ ยังไม่มีไฟล์ · per pivot: no KYC, simple |
| PO-4 | ใบสั่งซื้อ PO (Purchase Order) | P1 | purchaseOrders (38/39) | List + Form | ✅ มี · ยังไม่ปรับ sl-4 |
| **PO-5** | รับสินค้า GRN — ทยอยรับ + full-receive gate ⚠️ | P1 | purchaseReceipts | List + Form | ✅ มี · audit ค้าง ทยอยรับ |
| PO-6 | ตั้งหนี้เจ้าหนี้ AP Invoice | P1 | purchaseInvoices (122/123) | List + Form | ✅ ปรับ sl-4 + Doc Chain + mode toggle (Normal/Deposit) |
| PO-7 | Trade Support 5 Types Tracking | P1 | Custom: vendorObligations | List + Form + Dashboard | ✅ มี (Rebate Dashboard) · ขาด Form view 5 types |
| **PO-8** | สั่งซื้อสินค้าฝาก (Deposit Bill / Prepayment · ชื่อเดิม "บิลฝาก" — rename 2026-07-02 #6) ⚠️ | P1 | purchaseOrders + generalJournalLines | Form | ❌ ยังไม่มีไฟล์ · per pivot focus |

> **⚠️ Drift จาก v1.0 (per pivot 2026-04-23/25):**
> - **PO-2:** เปลี่ยน scope จาก RFQ → Trade Agreement (RFQ ไม่ได้ใช้)
> - **PO-3:** ตัด KYC heavy ออก · simple create form, no Finance approval (low priority)
> - **PO-5:** เพิ่ม "ทยอยรับ + full-receive detector" — เป็น gate ของ PO-6
> - **PO-7:** ขยายจาก Rebate-only → 5 Trade Promotion Types
> - **PO-8:** focus ใหม่ตาม pivot · ทดแทน RFQ ใน roadmap

---

## PO-Q — Queue Dashboard (คิวจัดซื้อ)

### Layout
```
┌─────────────────────────────────────────────┐
│  PAGE HEADER: คิวจัดซื้อ | สาขา | วันที่    │
│  Filter: Status | Buyer | Vendor | วันที่    │
├─────────────────────────────────────────────┤
│  Panel 0: ⚠️ MOS Critical (≤ 2 เดือน) ⭐ NEW │
│  Panel A: PR รออนุมัติ                       │
│  Panel B: Vendor Commitment ใกล้หมดอายุ      │
│  Panel C: PO รอ Vendor ยืนยัน               │
│  Panel D: GRN รอตรวจรับ (ETA วันนี้)        │
│  Panel E: AP Invoice รอวางบิล (รวม PO-8)    │
│  Panel F: CN Outstanding (Sanction Day-0/7/15/30) │
└─────────────────────────────────────────────┘
```

### Panel 0 — MOS Critical (per A5)
- Auto-list items ที่ MOS ≤ 2 เดือน → แดง (ต้องสั่ง)
- ถัดมา MOS ≤ 4 เดือน → เหลือง (สั่งได้)
- Action: คลิก → สร้าง PR auto-fill items (jump PO-1)

### SC ที่ใช้
- SC7 (Timeline) — Log per Document
- Sanction Flag — แสดง Day-15 → Day-30 STOP-NEW-PO warning

### RBAC
| Role | สิทธิ์ |
|---|---|
| Admin / Purchase Manager | ดูทุก Buyer + Sanction Panel |
| Buyer | ดูเฉพาะงานของตัวเอง |
| Warehouse | ดูเฉพาะ Panel D (GRN) |
| Finance | ดูเฉพาะ Panel E (AP Invoice) + Panel F (CN) |

---

## PO-1 — ใบขอซื้อ PR (Purchase Requisition)

### Module Brief
```
Module:  PO-1 Purchase Requisition
Phase:   P1
BC:      Custom PR Table (หรือ purchaseRequests ถ้า BC Extension มี)
Trigger: แผนก/คลังต้องการสั่งสินค้า
Output:  PR ที่อนุมัติแล้ว → ส่งต่อให้ Buyer เปิด PO
```

### ERP Form 7 Sections

**Section 1 — Page Header** (sl-4: main-header + saab)
**Section 2 — Vendor Card | Buyer & PR Meta Card** (sl-1 pattern · 2-col)
- Vendor Card: รหัส·ชื่อ + เบอร์·เลขภาษี + credit-line (AP คงค้าง · PO Active · Tier · CN status) + addr-chip
- Buyer & PR Meta Card: บริษัท·คลัง + ผู้ขอ·วันที่ + ต้องการรับ + เครดิต + เหตุผลที่ขอ (dropdown)
**Section 3 — Line Items (SC2)** — ค้นหาสินค้า + **แสดง MOS real-time** (per A5)
- Column: SKU (clickable → MD-1) · ชื่อ · **PSI · MOS** · ขอสั่ง · UOM · คลัง · ราคา/หน่วย · มูลค่า
- **MOS color code:** 🔴 ≤ 2 (critical) · 🟡 ≤ 4 (OK) · 🟢 > 4 (block · warn)
- SKU = clickable link → MD-1 Item Card (drill-down ดูทุน · ประวัติราคา · Vendor Commitment)
- ❌ **ไม่ใส่** ตาราง "ประวัติต้นทุน" หรือ "Approval Chain" inline (per feedback 2026-04-25 — drill MD-1 + status-strip)
**Section 4 — Tabs** — [อ้างอิง SC5] · [ประวัติ SC7]
**Section 5 — Summary + Action Bar** — Save/Submit/Approve/Reject/Convert to PO

### Business Rules (PO-1 specific)
- **MOS Order Rule (A5):** เพิ่ม line item ที่ MOS > 4 → warn + require justification ก่อน submit
- **Cost & Pricing drill-down:** กดที่ SKU ใน line item → MD-1 Item Card (ดู STNPR · ประวัติราคา · ราคาขาย 5 tiers)
- **Vendor Commitment auto-apply:** ถ้า Vendor มี active Commitment (PO-2) → auto-fetch Sell-in% / MOU progress / Free Goods → apply ใน line items

### Status Flow
```
Draft → รออนุมัติ → อนุมัติแล้ว → แปลงเป็น PO
            ↓
        ปฏิเสธ → Draft (แก้ไข/ส่งใหม่)
```

### RBAC
| Function | Admin | Purchase Mgr | Buyer | Department Head | Warehouse |
|---|---|---|---|---|---|
| สร้าง PR | ✅ | ✅ | ✅ | ✅ | ✅ |
| อนุมัติ PR | ✅ | ✅ | ❌ | ✅ (แผนกตัวเอง) | ❌ |
| แปลงเป็น PO | ✅ | ✅ | ✅ | ❌ | ❌ |

### BC API
```
POST /purchaseRequests (Custom)         → สร้าง PR
GET  /items/{id}/stockByLocation        → ดูสต็อก
GET  /itemVendors?itemNo=               → Suggested Vendor
GET  /tradeAgreements?vendorId=&period= → ดึง TA progress (ใหม่)
```

---

## PO-2 — บันทึกข้อตกลงงบ (Vendor Commitment) ⚠️ v2.1 RENAME (per user 2026-04-25)

> **Drift Note v2.1:**
> - v1.0: RFQ + Vendor Compare (ไม่ใช้)
> - v2.0: Trade Agreement (เปลี่ยน scope)
> - **v2.1:** Rename → "บันทึกข้อตกลงงบ" / "Vendor Commitment" — สื่อชัดว่า**ไม่มีผลภาษี** (ดู A6) · เป็น "เอกสารยืนยัน + เซลล์เซ็นรับทราบ" ไม่ใช่ AP entry

### Module Brief
```
Module:  PO-2 Vendor Commitment (บันทึกข้อตกลงงบ)
Phase:   P1
BC:      Custom: vendorCommitments (extension)
Trigger: จัดซื้อตกลงเงื่อนไข Trade Promotion 4 types กับ Vendor
Output:  Commitment record ที่ถูกอ้างอิงจาก PR/PO/AP/PO-7
         ⚠️ ไม่มีผลทางภาษี · ใช้คำนวณราคาขาย + Recovery Tracking เท่านั้น
```

### View Structure (per v2.2)

**2 Views:** 📋 Form view (single VC record) | 📊 List view (all VC for vendor · filter by type/period/status)

### Form View — Sections (per type)

**Common (ทุก type):**
- **Vendor Card | Agreement Meta Card** (sl-1 pattern · 2-col compact)
- **PO-2.2 Type Selector** — segmented 4 buttons (MOU/Sell-in/Sell-out/Co-op) · เลือกประเภทตอน create
- **PO-2.1b Evidence Level (grill 2026-07-04 · รับปาก/verbal)** — ladder 3 ขั้นใน meta card: 🗣️ **รับปาก** (verbal · ยังไม่มีเอกสาร) → 📄 **มีเอกสาร** (สแกน/เมล ยังไม่เซ็น) → ✍️ **เซ็นแล้ว** (เซลล์ Vendor เซ็น → Active)
  - แต่ละขั้น **แนบสแกน/ภาพหลักฐาน** ที่ช่อง "เอกสารแนบ" (มีอยู่แล้ว): รับปาก=บันทึกการคุย · เอกสาร=สแกนไฟล์/เมล · เซ็น=สแกนสัญญาเซ็น
  - **รับปาก accrue ได้ แต่ flag 🟡 เสี่ยง** · PO-7 realize แสดง confidence ต่อ commitment (finance/FI-8 เห็นก่อน realize) · *ทุก accrual ต้องชี้กลับหลักฐานได้ กัน rebate ลอย/ทวงไม่ได้*
- **PO-2.4 Recovery Tracking** — ใช้ใน N PO · ยอดสิทธิ์ · เก็บคืนได้ · Recovery Rate vs Target
- **PO-2.5 Approval + เซลล์เซ็น Vendor** — Approval chain ภายใน + signature ของเซลล์ Vendor (ดู A6 · ไม่มีผลภาษี)
- **PO-2.6 Linked Documents** — PR/PO/AP ที่ใช้ VC นี้

**PO-2.3 Detail (เปลี่ยนตาม type):**

#### Type ① MOU (รายหมวด)
- หมวดสินค้า (multi-select · เช่น ซักผ้า + ตู้เย็น)
- เป้ายอดสะสม per category หรือ combined
- **Tier table** T1/T2/T3/T4 (ยอด → Rebate% + Bonus)
- Period: Quarterly / Yearly · From-To
- VAT Case: 🟡 Case 3 (CN หลังบิล · มาตรฐานคู่ค้า)

#### Type ② Sell-in ⭐ (รายหมวด/รุ่น)
- Scope: SKU หรือ หมวด (เช่น LG-WT-TT10 · ซักผ้า)
- จำนวนซื้อขั้นต่ำ (lot trigger) · ราคา/หน่วย
- Promotion: **Ontop% (Case 4 บนบิล)** + ส่วนลดบาท + Free Goods (เช่น 25 แถม 1)
- Effective period (จาก-ถึง · short window)
- VAT Case: 🟢 Case 4 (best practice)

#### Type ③ Sell-out (รายหมวด/รุ่น)
- Scope: SKU หรือ หมวด
- ส่วนลด/หน่วย เมื่อขายออกสำเร็จ (เช่น ฿200/ตัว)
- **Serial match condition** — ผูก **SL-4 invoice เป็นหลัก** แต่แหล่ง serial จริง = **BC itemLedgerEntries** (serial ลงที่ WH-2 เบิกออกตอน post shipment — SL-4 ไม่มี field serial ตาม rule "Serial บังคับที่ WH Issue") · match path: itemLedgerEntry → Posted Shipment → SL-4 Invoice (decision 2026-07-02 #11)
- **Exception ไม่มีบิลอ้างอิง:** serial ที่เบิกออกแต่หา SL-4 ผูกไม่เจอ → แสดง tab แยก "Serial ไม่มีบิลอ้างอิง" + ปุ่ม "ผูกบิลย้อนหลัง" — ห้ามปล่อยเงียบ (rebate ตกหล่นโดยไม่มีใครรู้)
- **Status ต่อ serial:** ✅ Matched · ⏳ Pending shipment (รอเบิก) · ❌ No invoice ref
- Effective period
- VAT Case: 🟢 Case 4 (CN หลังขายออก)

#### Type ④ Co-op (Event/แคมเปญ)
- **Sub-type:**
  - 🔵 **Fixed** — Event name + งบตายตัว + วันที่จัด + use case (เช่น งานเลี้ยงลูกค้า ฿10K)
  - 🟣 **Triggered** — เป้ายอดซื้อสะสม + งบที่ปลดล็อค + use case (เช่น 100K → 2K marketing)
- หมวดที่นับ (multi)
- VAT Case: 🟡 Case 3 (CN หลังเอกสาร event)

### List View — Layout

```
┌────────────────────────────────────────────────────────┐
│ Filter: Type · Period · Status · Search SKU/หมวด      │
├────────────────────────────────────────────────────────┤
│ VC No.        │Type │Scope         │เงื่อนไข│มูลค่า│Status│
│ VC-MOU-001    │🟢MOU│ซักผ้า+ตู้เย็น │T2 3%   │~60K  │🔥68% │
│ VC-MOU-002    │🟢MOU│ตู้เย็น+...    │2.5%   │~37K  │🔥42% │
│ VC-SI-005 ⭐  │🔵SI │LG TT10 (รุ่น) │4.5% บนบิล│88K  │✓Active│
│ VC-SO-008     │🟡SO │LG TT10 (รุ่น) │฿200/ตัว│~20K  │รอ data│
│ VC-CO-012     │🟣Co │LG หมวด       │100K→2K│2K    │✓ผ่าน │
└────────────────────────────────────────────────────────┘
```

### VC Numbering

`VC-{TYPE}-{YYMM}-{seq}` เช่น:
- `VC-MOU-2604-001` (MOU เดือน เม.ย. 26 ใบที่ 1)
- `VC-SI-2604-005` (Sell-in)
- `VC-SO-2604-008` (Sell-out)
- `VC-CO-2604-012` (Co-op)

### Status Flow
```
Draft → รอเซลล์เซ็นรับทราบ → Active (ในรอบ) → Expired
                  ↓
              Cancelled (โดย MD)
```

### Doc Chain
**ไม่มี** — Vendor Commitment = master/setup · ไม่อยู่ใน transaction chain · กลับกัน Commitment นี้ถูก**อ้างอิงจาก** PR/PO/AP

### Business Rules
- **A6 Semantic:** ⚠️ **ไม่มีผลทางภาษี** · เป็น "เอกสารยืนยัน + เซลล์เซ็นรับทราบ" — ห้ามสับสนกับ AP Invoice (PO-6)
- **VAT Trap A1 (Case 4):** ทุก Sell-in ต้องระบุ "% บนบิล" · MOU/Sell-out ใช้ Case 3 (CN หลังบิล) ตามมาตรฐานคู่ค้า
- **Sanction (A3):** ถ้า Vendor ไม่ส่ง CN ตาม Schedule → trigger Day-30 STOP NEW PO
- **MOU Threshold:** ห้ามตั้ง threshold สูงเกินจริงจน over-commit (Non-move risk)
- **Scope rule (per type):** MOU = หมวด · Sell-in/out = หมวด/รุ่น · Co-op = event/แคมเปญ
- **เซลล์ Signature Required:** ทุก Commitment ต้องมีเซลล์ของ Vendor เซ็นรับทราบก่อน Active

### BC API
```
POST  /vendorCommitments (Custom)            → สร้าง Commitment
PATCH /vendorCommitments/{id}                → แก้ไข
GET   /vendorCommitments?vendorId=&active=true → ดึงสำหรับ PR/PO/MD-1 calculation
GET   /vendorCommitments/{id}/linkedDocs     → ดู PR/PO/AP/PO-7 ที่ใช้ Commitment นี้
POST  /vendorCommitments/{id}/sign           → เซลล์เซ็นรับทราบ → Active
```

---

## PO-3 — Vendor Onboarding (Simple Form) ⚠️ SIMPLIFIED (per pivot)

> **Drift Note:** v1.0 spec มี KYC docs upload + Finance Approval · per pivot: low priority, ไม่ต้องซีเรียส
> Simple create-only form · การแก้ไขใช้สิทธิ์แยก (ไม่อยู่ใน scope หน้านี้)

### Module Brief
```
Module:  PO-3 Vendor Onboarding (Simple)
Phase:   P1
BC:      vendors (Table 23)
Trigger: มี Vendor ใหม่ต้องการทำธุรกรรม
Output:  Vendor Card ใน BC พร้อมใช้งาน (basic info)
```

### ERP Form

**ข้อมูลพื้นฐาน**
- รหัส Vendor (Auto) · ชื่อบริษัท TH/EN · ประเภท (บุคคล/นิติ)
- เลขผู้เสียภาษี · ที่อยู่ใบกำกับ + จัดส่ง · เบอร์ + Email

**เงื่อนไขการค้า**
- เงื่อนไขชำระ (Dropdown: NET 30 / 60 / Cash)
- สกุลเงิน (Default THB)
- บัญชีธนาคาร · WHT Category (ภ.ง.ด.3 / 53 / ไม่หัก)

**~~เอกสาร KYC~~** — ตัดออก per pivot

### Status Flow (Simplified)
```
Create → Active (ใช้ได้ทันที)
```

### BC API
```
POST  /vendors               → สร้าง Vendor
PATCH /vendors/{id}          → แก้ไข (ใช้สิทธิ์แยก)
GET   /vendors?$filter=...   → ค้นหา
```

---

## PO-4 — ใบสั่งซื้อ PO (Purchase Order)

### Module Brief
```
Module:  PO-4 Purchase Order
Phase:   P1
BC:      purchaseOrders (Header 38, Line 39)
Trigger: หลัง PR อนุมัติ + เลือก Vendor + อ้างอิง Trade Agreement (ถ้ามี)
Output:  PO ส่งให้ Vendor + จองงบประมาณใน BC
```

### ERP Form 7 Sections

**Section 1 — Page Header** (sl-4: main-header + saab)
**Section 2 — Doc Header** — PO No · วันที่สั่ง · กำหนดส่ง · อ้างอิง PR + Trade Agreement (TA) · เงื่อนไขชำระ
**Section 3 — Party** — Vendor (Active) + Auto-fill credit/address/WHT
**Section 4 — Line Items** — SC2 + ราคาแนะนำจาก TA (Vendor Price List + Rebate/Free Goods auto-apply)
**Section 5 — Tabs**
- [รับสินค้า] — ประวัติการรับ (Partially Received %)
- [ตั้งหนี้] — AP Invoice ที่เชื่อมแล้ว
- [TA Progress] ⭐ NEW — แสดง impact ของ PO นี้ต่อ Tier ของ Vendor
- [อ้างอิง SC5] — PR → TA → PO chain
- [ประวัติ SC7]
**Section 6 — Summary** — ยอดก่อน VAT · VAT 7% · ยอดรวม · รับแล้ว % · ยอดค้าง
**Section 7 — Action Bar** — Save/Submit/Approve/Send PO/Receive/Close/Cancel

### Status Flow
```
Draft → รออนุมัติ → Open → Partially Received → Fully Received → รอวางบิล → ปิดรายการ
           ↓                                                            ↓
       ปฏิเสธ                                                     ยกเลิก
```

### RBAC
| Function | Admin | Purchase Mgr | Buyer | Finance | Warehouse |
|---|---|---|---|---|---|
| สร้าง PO | ✅ | ✅ | ✅ | ❌ | ❌ |
| อนุมัติ PO | ✅ | ✅ | ❌ | ❌ | ❌ |
| ปิด PO (บางส่วน) | ✅ | ✅ | ✅ | ❌ | ❌ |
| ดู Cost | ✅ | ✅ | ✅ | ✅ | ❌ |

### BC API
```
POST  /purchaseOrders                               → สร้าง PO
PATCH /purchaseOrders/{id}                          → แก้ไข
GET   /purchaseOrders/{id}?$expand=purchaseOrderLines
POST  /purchaseOrders/{id}/Microsoft.NAV.receive    → รับสินค้า
POST  /purchaseOrders/{id}/Microsoft.NAV.invoice    → ตั้งหนี้
GET   /tradeAgreements?vendorId=&active=true        → ดึง TA สำหรับ auto-apply discount
```

---

## PO-5 — รับสินค้า GRN (Goods Receipt Note) ⚠️ AUDIT (per pivot)

> **Drift Note:** ต้องมี **"ทยอยรับ + full-receive detector"** — เป็น gate ให้ PO-6 (ตั้งหนี้)
> User คือคลังหรือแคชเชียร์สาขา (ขึ้นกับมอบหมาย/สิทธิ์)

### Module Brief
```
Module:  PO-5 GRN (Purchase)
Phase:   P1
BC:      purchaseReceipts (Table 120/121)
Trigger: สินค้าถึงคลัง — Warehouse ยืนยันรับ
Output:  สินค้าเข้าสต็อก BC + เพิ่ม Item Ledger Entry + (เมื่อ full-receive) unlock PO-6 ตั้งหนี้
```

### หมายเหตุ
> GRN ใน Purchase Module = ยืนยันว่ารับสินค้าจาก Vendor
> GRN ใน Warehouse Module (WH-1) = ลงทะเบียน Serial + จัดวาง Bin
> **ทั้ง 2 ต้องทำ:** Purchase GRN (ตั้งหนี้) + WH GRN (ลง Serial)

### ERP Form 7 Sections

**Section 1 — Page Header** (sl-4: main-header + saab)
**Section 2 — Doc Header** — GRN No · วันที่รับ · อ้างอิง PO (Required) · ผู้ส่ง/ทะเบียนรถ
**Section 3 — Party** — Vendor (Auto-fill จาก PO)
**Section 4 — Line Items (SC2 + SC8 Serial Panel)**
- Copy จาก PO Line · จำนวนรับจริง (แก้ได้)
- **ทยอยรับ:** จำนวนรับครั้งนี้ · จำนวนรับสะสม · จำนวนค้างรับ
- SC8 Serial Panel + Barcode Scan + Import Serial CSV
- **Full-receive detector** (NEW) — เมื่อ qty รับ = qty PO ทั้งหมด → flag `is_full_received=true` → unlock PO-6
**Section 5 — Tabs**
- [คุณภาพ QC] — Pass/Fail per Line
- [อ้างอิง SC5] — PO → GRN chain
- [ประวัติ SC7]
**Section 6 — Summary** — Receive count this round · Cumulative received % · Remaining
**Section 7 — Action Bar**
- Draft: Save / Post GRN / Delete
- Posted (Partial): พิมพ์ GRN / รอรับเพิ่ม
- Posted (Full): ✅ unlock PO-6 ตั้งหนี้ AP

### Status Flow
```
Draft → Posted Partial (ทยอยรับ · is_full_received=false)
           ↓
       รับเพิ่ม → Posted Full (is_full_received=true) → unlock PO-6
           ↓
       (alternative) ใช้ PO-8 บิลฝาก → ตั้งหนี้ก่อนรับครบ
```

### Business Rules
- รับสินค้าเกิน PO → Warning + ต้องอนุมัติก่อน Post
- รับน้อยกว่า PO → PO Status = Partially Received · `is_full_received=false`
- Serial ต้องครบทุกชิ้นก่อน Post GRN (ถ้า Item มี Serial Flag)
- GRN Posted → Auto-trigger WH-1 (ลง Bin Location)
- **Full-receive gate:** เมื่อ cumulative qty = PO qty → set flag → PO-6 detect → enable "ตั้งหนี้ AP"
- **Bypass via PO-8:** ถ้าใช้ PO-8 บิลฝาก สามารถข้ามได้

### BC API
```
POST /purchaseOrders/{id}/Microsoft.NAV.receive  → Post GRN
GET  /purchaseReceipts?purchaseOrderId=          → ดู GRN History (cumulative)
GET  /itemLedgerEntries?entryType='Purchase'     → ดู Stock Entry
PATCH /itemSerialNumbers                         → บันทึก Serial
GET  /purchaseOrders/{id}/receiveStatus          → ดู is_full_received flag
```

---

## PO-6 — ตั้งหนี้เจ้าหนี้ AP Invoice (มี Mode Toggle Normal/Deposit)

### Module Brief
```
Module:  PO-6 AP Invoice
Phase:   P1
BC:      purchaseInvoices (Header 122, Line 123)
Trigger: Vendor ส่งใบแจ้งหนี้ หลัง GRN Full Posted (Normal) หรือ ก่อนรับครบ (Deposit/PO-8)
Output:  ตั้งหนี้ใน BC + เพิ่ม Vendor Ledger Entry
```

### Mode Toggle (NEW per pivot)
- **🟢 รับครบปกติ (Normal):** ต้อง GRN full-received ก่อนตั้งหนี้
- **🟣 บิลฝาก (Deposit):** ข้าม PO-5 · อ้างอิง PO-8 advance bill · 2-Way Match (PO + Invoice) แทน 3-Way

### ERP Form 7 Sections

**Section 1 — Main Header (sl-4)** + Status Strip (SC11 pills + 3-Way Match block)
**Section 2 — Mode Bar** ⭐ NEW — segmented toggle Normal/Deposit + Demo + Entity Tag (FI-13)
**Section 3 — Doc Header** — AP Invoice No · วันที่ตั้งหนี้ · เลข Invoice ของ Vendor · อ้างอิง GRN (Normal) / PO-8 Advance (Deposit) · กำหนดชำระ
**Section 4 — Party** — Vendor + WHT Category (Auto)
**Section 5 — Line Items (3-Way Match Detail)** — PO Qty · GRN Qty · Invoice Qty · ราคา PO · ราคา Invoice · ผล Match
**Section 6 — Tabs** — Payment Schedule · อ้างอิง SC5 · ภาษี · ประวัติ SC7
**Section 7 — Summary + Action Bar** — ยอดสุทธิ + Save/Post/Pay

### Gate Logic (Critical)
```
if mode == 'normal' and not GRN.is_full_received:
    DISABLE "บันทึก AP" + show alert "รับสินค้ายังไม่ครบบิล"
    suggest: → PO-5 Finance GRN (ทยอยรับต่อ) หรือ → PO-8 (โหมดบิลฝาก)
```

### Status Flow
```
Draft → Post → ค้างชำระ → จ่ายแล้ว (FI-2 AP Payment) → ปิดรายการ
```

### RBAC
| Function | Admin | Purchase Mgr | Finance | Accountant |
|---|---|---|---|---|
| สร้าง AP Invoice | ✅ | ✅ | ✅ | ✅ |
| Post AP Invoice | ✅ | ❌ | ✅ | ✅ |
| Switch Mode (Normal/Deposit) | ✅ | ✅ | ✅ | ❌ |
| จ่ายเงิน (AP Payment) | ✅ | ❌ | ✅ | ❌ |

### BC API
```
POST /purchaseInvoices                              → สร้าง AP Invoice (Normal)
POST /generalJournalLines                           → สร้าง AP Invoice (Deposit · จาก PO-8)
POST /purchaseInvoices/{id}/Microsoft.NAV.post      → Post
GET  /vendorLedgerEntries?vendorId=                 → ดูประวัติ
GET  /purchaseOrders/{id}/receiveStatus             → ตรวจ full-receive ก่อน enable post
```

### Business Rules
- **3-Way Match (Normal):** PO vs GRN vs Invoice ต้องตรง
- **2-Way Match (Deposit):** PO-8 Advance vs Invoice
- ราคาต่างจาก PO เกิน 5% → Alert + อนุมัติพิเศษ
- WHT Auto ตาม Vendor Category
- AP Invoice 1 ใบ → อ้างอิงหลาย GRN ได้ (Vendor รวมใบ)
- **Gate:** ใช้ Normal mode + GRN ไม่ครบ → block

---

## PO-7 — Trade Support 4 Types Tracking (v2.1 update)

> **Drift Note v2.1:**
> - v2.0: 5 Trade Promotion Types (รวม Sell-thru)
> - **v2.1:** **4 Types** (ตัด Sell-thru ออก ตาม A2 v2.1)
> - **A6 Semantic:** "Accrual" = บันทึกข้อตกลงงบ · ⚠️ ไม่มี GL impact ตอน "Accrued" · GL impact เกิดเมื่อ "Realized" (ได้ CN/Invoice) → forward เข้า PO-6 AP → Offset

### Module Brief
```
Module:  PO-7 Trade Support Tracking (Vendor Commitment Tracking)
Phase:   P1
BC:      Custom Table: vendorCommitmentClaims
Trigger: บันทึกงบที่จะได้รับ (จาก PO-2 Vendor Commitment) → ติดตามจนได้ CN
Output:  Recovery Rate per type · Accrual ledger · CN forward to AP
```

### Concept: 4 Trade Support Types (per A2 v2.1)
- **① MOU** (≥95%) — รายหมวด · ซื้อถึงเป้า รายไตรมาส/ปี
- **② Sell-in** (100%) ⭐ — รายหมวด/รายรุ่น · หักทันที Case 4 บนบิล
- **③ Sell-out** (≥85%) — รายหมวด/รายรุ่น · จ่ายเมื่อขายออกสำเร็จ (serial/SL-4 match)
- **④ Co-op** (≥90%) — Event/แคมเปญ · งบ Event + ใบปลิว

### ERP Form 7 Sections

**Section 1 — Page Header** (sl-4) + Status Badge (Draft/Accrued/Doc Received/Realized/Cancelled)
**Section 2 — Doc Header** — Accrual No · ประเภทงบ (5 types dropdown) · อ้างอิง Trade Agreement (PO-2) · Vendor · งวด Claim
**Section 3 — Party** — Vendor (Auto-fill จาก TA) + Buyer
**Section 4 — Line Items** — รายละเอียด · จำนวนตาม Agreement · จำนวนได้รับจริง · ผลต่าง · เลข CN/Invoice อ้างอิง · Upload เอกสาร
**Section 5 — Tabs**
- [Agreement] — รายละเอียด Trade Agreement ต้นทาง
- [เอกสารจากห้าง] — Attached CN/Invoice/Statement
- [Sanction Status] ⭐ NEW — Day-0/7/15/30 alert
- [GL Impact] — บัญชีที่ book (Read-Only · เห็นเฉพาะ Finance)
- [ประวัติ SC7]
**Section 6 — Summary** — ยอดตาม Agreement · ได้เอกสารแล้ว · รับเงินแล้ว · ค้าง
**Section 7 — Action Bar** — Save/Submit/Attach/Confirm/Send to Finance

### Cross-View
**Finance** (FI-Q / FI-8 Accrual Monitor) — **read-only เท่านั้น**: ห้าง/Vendor · Accrued · ได้เอกสาร · รับเงิน · ค้าง · Aging color (30/60/90/120d) · drill เข้า PO-7 ได้ · ปุ่มเดียวที่มี = "Follow-up/ส่งทวง" (notification ไป Purchase Mgr) — **ห้ามมีปุ่ม Record Payment/จ่ายเงิน** (decision 2026-07-02 #10)
**Promotion** (PM-Q) — งบ Realized (ใช้ True Margin ได้) vs Accrued (ประมาณการ)

### Status Flow
```
Draft → Accrued (บัญชีรับรู้หนี้) → Doc Received (ได้เอกสารจากห้าง) → Realized (รับเงินแล้ว)
  ↓          ↓                           ↓
Cancel    Cancel                      Adjust (ยอดไม่ตรง → แก้ไข + อนุมัติ)
```

### RBAC
| Function | Admin | Purchase Mgr | Buyer | Finance Mgr | Accountant | Promo Mgr |
|---|---|---|---|---|---|---|
| สร้าง Accrual | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Attach เอกสาร | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Confirm & Send | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Record Payment | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Cross-View Read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ดู GL Impact | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |

### BC API
```
POST /vendorObligations (Custom)                    → สร้าง Accrual
PATCH /vendorObligations/{id}                       → อัปเดต
GET  /vendorObligations?type=&status=               → filter ตามประเภท + สถานะ
POST /vendorObligations/{id}/attachDocument         → แนบ CN/Invoice
POST /vendorObligations/{id}/realize                → บันทึกรับเงิน
GET  /vendorObligations/sanctionStatus?vendorId=    → Day-0/7/15/30 (ใหม่)
```

### Business Rules (รวม + ใหม่จาก A1-A3)
1. **ห้ามซ้ำ:** เลข Agreement + งวด + ประเภทงบ ต้องไม่ซ้ำ
2. **VAT Trap (A1):** Sell-in ต้องคำนวณ Case 4 (% บนบิล) เท่านั้น · ห้ามรับ Case 1, 3 (หลังบิล) เป็น default
3. **Yods ไม่ตรง:** ถ้ายอดรับจริง < Agreement เกิน 10% → Flag สอบสวน
4. **Aging Alert (A3):** Accrued เกิน 30 วันยังไม่ได้เอกสาร → Day-0 reminder · 60 วัน → Day-30 STOP NEW PO
5. **GL Posting:** Accrued → Dr. Accrued Revenue / Cr. Vendor Obligation Liability
6. **Realized:** Reverse Accrual + Dr. Bank / Cr. Revenue (หรือ offset CN)
7. **Monthly Recon:** Finance reconcile Accrual vs รับจริง ทุกเดือน
8. **⚠️ Rebate ≠ Discount Rule:** Rebate book เข้า "Other Income — Vendor Rebate" (CF-4) · ห้ามดั๊มพ์เป็นส่วนลดราคาขาย
9. **CN Audit (A3):** ทุก CN ต้องระบุ Category (1/2/3) + match Agreement + audit checklist 7 ข้อ ก่อน forward AP
10. **Sanction (A3):** Day-30 ไม่ส่ง CN → STOP NEW PO automatic
11. **🔒 Single Payment Point (decision 2026-07-02 #10):** Record Payment / Confirm & Realize กดได้ที่หน้า **PO-7 เท่านั้น** (เปลี่ยน Committed→Realized + post GL ทันที) · FI-8 Accrual Monitor = read-only aging view + Follow-up notification — ห้าม dev สร้างปุ่มจ่ายใน FI-8 ภายหลัง (กัน GL double-record)

### Phase 2 (รองรับ — ยังไม่ implement)

**Sell-out / Sell-thru Trigger:**
```
Sell-out: SL-4 Post → match Item Serial vs Agreement → Auto-accumulate
Sell-thru: รับ Distribution Report จาก dealer → Manual upload + match
```

**MOU Target Tracking:**
```
Agreement Target: ฿5,000,000
Actual Cumulative: ฿3,200,000 (64%)
Alert at: 80% → เตรียม Claim · 100% → Claim ทันที
```

**CN Offset:**
```
PO-7 Doc Received → Link CN ไปที่ FI-2 AP Payment → "หักจาก CN" แทนจ่ายเงินสด
```

---

## PO-8 — สั่งซื้อสินค้าฝาก (Deposit Bill / Prepayment) ⚠️ NEW BUILD (per pivot focus)

> **หมายเหตุชื่อ (decision 2026-07-02 #6):** ชื่อทางการ = **"สั่งซื้อสินค้าฝาก"** (เดิมเรียก "บิลฝาก") — เปลี่ยนเพื่อกันชนกับ SL-3 ใบมัดจำ ฝั่งขาย (ทั้งคู่แปลว่า deposit) · shorthand "บิลฝาก" ในเนื้อ flow ฝั่งซื้อยังใช้ได้ · **naming convention:** ชื่อที่เสี่ยงชนข้ามโมดูล ให้ใส่ prefix ฝั่งงาน เช่น "ขาย มัดจำ" / "ซื้อ มัดจำ"

### Module Brief
```
Module:  PO-8 สั่งซื้อสินค้าฝาก (Deposit Bill)
Phase:   P1
BC:      purchaseOrders (38/39), purchaseInvoices (122/123), generalJournalLines (81)
Trigger: Credit Term ครบกำหนด แต่สินค้ายังรับไม่ครบ → ต้องจ่ายก่อน
Output:  จ่ายล่วงหน้า (Prepayment) + ทยอยรับของ + Settle เมื่อครบ
Flow:    Purchase/Flow/06 - Deposit bill (PO บิลฝาก)
```

### Business Case
```
PO 100 เครื่อง ฿1,000,000 · Credit 30 วัน
วันที่ 15: รับ 60 (Partial GRN)
วันที่ 30: ครบ Credit → ต้องจ่ายแม้ของยังไม่ครบ
วันที่ 45: รับอีก 40 (ครบ)
→ "จ่ายก่อน → ทยอยรับ → Settle"
```

### 2 สถานการณ์
**A: ดิวถึง + ยังไม่รับเลย**
```
PO Approved → ดิวชำระ → คีย์ G/L (Dr: Advance / Cr: Bank) → Post → รอรับสินค้าตามรอบส่ง
→ รับของ → Post Receive → ตัดยอด Advance กับ Invoice
```

**B: ดิวถึง + รับบางส่วนแล้ว**
```
PO Approved → รับบางส่วน + Invoice บางส่วน → ดิวถึง
→ Post Invoice ส่วนที่เหลือ
  ผ่าน → จบ
  ไม่ผ่าน (ของยังไม่มา) → คีย์ G/L ตั้งเจ้าหนี้ + จ่ายเงิน
→ รับครบ → Post G/L + Item → Settle
```

### ERP Form 7 Sections

**Section 1 — Page Header** (sl-4)
**Section 2 — Doc Header** — เลขบิลฝาก · วันที่จ่าย (Due Date) · อ้างอิง PO · สถานการณ์ (A/B toggle)
**Section 3 — Party** — Vendor (Auto) + แสดง Credit Term + Due Date + วันเกินกำหนด
**Section 4 — Line Items** — Copy PO Lines · สั่งซื้อ · รับแล้ว · ค้างรับ · ราคา · ยอดจ่าย
**Section 5 — Tabs**
- [การชำระ] — วิธี/บัญชี/Ref No.
- [ประวัติรับของ] — GRN ที่ Post + qty per line
- [G/L Entries] — รายการ Dr/Cr ที่ book
- [อ้างอิง SC5] — PO → GRN → Invoice chain
- [ประวัติ SC7]
**Section 6 — Summary** — ยอด PO ทั้งหมด · จ่ายแล้ว (Invoice Posted) · ยอดจ่ายครั้งนี้ (Prepay) · ค้างรับของ
**Section 7 — Action Bar** — Save/Post Prepayment/รับเพิ่ม/Settle/View GL

### Status Flow
```
PO Approved → Due Date ถึง
  ├─ Scenario A: Post Prepayment (จ่ายเต็ม) → Prepaid → ทยอยรับของ → Settled
  └─ Scenario B: Post Invoice (บางส่วน) → ค้าง → Post Prepay ส่วนที่เหลือ → ทยอยรับ → Settled
```

### RBAC
| Function | Admin | Purchase Mgr | Buyer | Finance |
|---|---|---|---|---|
| สร้างบิลฝาก | ✅ | ✅ | ✅ | ❌ |
| Post Prepayment | ✅ | ✅ | ❌ | ✅ |
| Settle | ✅ | ✅ | ❌ | ✅ |
| ดู GL | ✅ | ✅ | ❌ | ✅ |

### BC API
```
GET  /purchaseOrders/{id}?$expand=purchaseOrderLines   → ดู PO + Lines
GET  /purchaseReceipts?purchaseOrderId=                → ดู GRN History
POST /generalJournalLines                              → คีย์ G/L (Prepayment)
POST /journals/{id}/Microsoft.NAV.post                 → Post G/L
POST /purchaseOrders/{id}/Microsoft.NAV.receive        → รับสินค้าเพิ่ม
POST /purchaseOrders/{id}/Microsoft.NAV.invoice        → ตั้งหนี้ (Settle)
```

### Business Rules
- **Trigger:** Due Date ถึง + PO ยังไม่ Fully Received → Alert ใน PO-Q
- **GL Posting:** Prepayment book Dr: Advance to Vendor (Asset) / Cr: Bank
- **Settle:** รับครบ → Auto-reverse Advance + Post Purchase Invoice ปกติ
- **3-Way Match:** ยังต้องตรวจ PO vs GRN vs Invoice แม้จ่ายล่วงหน้า
- **Aging:** บิลฝาก > 60 วันค้างรับ → Alert ผจก.จัดซื้อ + Finance
- **Link FI-2:** ยอด Prepaid แสดงใน AP Payment เป็น "จ่ายแล้ว (Advance)" ไม่จ่ายซ้ำ

---

## 📌 Section C — Business Rules รวม (Purchase Module)

**Document Chain:**
1. **PR → PO → GRN → AP** ทุกขั้น Link กัน (SC5)
2. **3-Way Match:** PO vs GRN vs Invoice ต้องตรงก่อน Post AP
3. **Vendor WHT:** Auto-apply ตาม Category ทุก AP Invoice

**GRN:**
4. **Serial at GRN:** ต้องลง Serial ครบก่อน Post (ถ้า Item มี Serial Flag)
5. **GRN Over-receive:** ต้องอนุมัติถ้ารับเกิน PO
6. **Full-receive Gate (NEW):** PO-5 cumulative qty = PO qty → unlock PO-6 ตั้งหนี้

**VAT & Discount (จาก A1):**
7. **Case 4 (% บนบิล) เป็น default ทุก PO** — ห้ามรับ Case 1/3 (หลังบิล) โดยไม่อนุมัติ
8. **VAT Trap audit:** ฐาน VAT ต้องคิดจากราคาหลังหักส่วนลด (ตาม ม.79/3)

**Trade Support (จาก A2):**
9. **5 Types ต้องแยก** ใน PO-7 (MOU/Co-op/Sell-in/Sell-out/Sell-thru) — ห้ามรวมเป็น "Marketing Fee"
10. **Sale-In Accrual (PO-7):** เจ้าภาพอยู่ Purchase · Finance/Promotion เห็น Cross-View
11. **Rebate ≠ Discount Rule:** book เข้า GL "Other Income — Vendor Rebate" · ห้ามดั๊มพ์ส่วนลดราคาขาย

**CN & Sanction (จาก A3):**
12. **CN Audit Checklist 7 ข้อ** ทุกใบ ก่อน forward AP
13. **Sanction Day-30 STOP NEW PO** ถ้า Vendor ไม่ส่ง CN ตามกำหนด (กฎเหล็ก)
14. **Ageing 30/45/60** สำหรับ Stock Movement — บี้คู่ค้าทำ Sell-out ก่อน Credit Term ครบ

**Vendor:**
15. **Vendor Onboarding (PO-3):** simple form per pivot · KYC ตัดออก
16. **Trade Agreement (PO-2):** master/setup ที่ถูกอ้างอิงจาก PR/PO/AP/PO-7

**Deposit Bill:**
17. **PO-8 บิลฝาก:** ดิวถึง + ของยังไม่ครบ → จ่ายก่อน → Settle ทีหลัง · 2 scenarios A/B

---

## 🔗 Section C2 — MD-1 Item Card Cross-Reference (NEW v2.1)

> **Critical:** PO module หลายหน้า drill ลง MD-1 Item Card · MD-1 ต้องมี tabs/data ตามนี้

### MD-1 Tabs ที่ PO module ต้องการ

| Tab | เนื้อหา | ใช้จากหน้าไหน |
|---|---|---|
| **ภาพรวม** | สรุป item · category · brand · UOM · MOS ปัจจุบัน + status | PO-Q, PO-1, MD-1 list |
| **ต้นทุน** | STNPR ปัจจุบัน · cost breakdown · trend chart | PO-1 (drill จาก SKU) · PO-6 |
| **ราคาขาย** | 5-tier price matrix (SRP / 1-4 / 0) + GP% per tier · auto-calc + manual override · scheduled future price | MD-1, SL-1/2/3/4 ตอน quote |
| **โปรโมชั่น** | Vendor Commitment (PO-2) ที่ active กับ item นี้ · 4 types ปัจจุบัน + อนาคต | PO-1, PO-7 |
| **ประวัติการกำหนดราคา** ⭐ | Append-only log: วันที่ · ใบรับ · Vendor promo code · Ontop% (Case indicator) · Free goods · ส่วนลดบาท · STNPR ก่อน → หลัง · Δ% | PO-1 (drill), audit |
| **SRP / Benchmark** | SRP · ราคาออนไลน์ (Lazada/Shopee/Power Buy/HomePro) · ราคาคู่แข่ง | Pricing decision |

### Price-Setting Logic (per user 2026-04-25)

```
1. Buy event:
   Admin add row ใน "ประวัติการกำหนดราคา" (append-only)
   → Vendor promo + Ontop% + Free goods + ส่วนลดบาท
   → ระบบคำนวณ STNPR ใหม่ (weighted avg ของ batch ที่จะเข้า)

2. Auto-calc selling price:
   ราคา[tier] = STNPR × (1 + GP%[tier]) → ปัดเศษตามกฎ tier
   - GP% เป็น input จาก admin (ฟ้า) ต่อ tier
   - ราคา auto แสดงใน "ครีม" (read-only)

3. Manual override:
   Admin override ราคาในช่อง "ส้มเข้ม" → แทน auto-calc
   → ระบบ reverse-calc GP% จริง
   → record ใน history log

4. Scheduled future price:
   Admin set "effective date" ในอนาคต → ราคาขายปัจจุบันยังไม่เปลี่ยน
   → เปลี่ยนอัตโนมัติเมื่อถึงวัน

5. Multi-channel:
   ราคาขายแยกตาม channel: ขายส่ง / ปลีก / ออนไลน์ / ช่องอื่น
   → channel master ใน CF-2 หรือ MD-1
```

### Field Color Coding (ตาม legacy reference + design standard)

| Color | บทบาท | CSS hint |
|---|---|---|
| 🟡 Yellow | Input (กรอกเอง) | bg `#FEF3C7` border `#FCD34D` |
| 🟦 Cyan | GP% / % input | bg `#CFFAFE` border `#06B6D4` |
| 🟠 Cream | Auto-calculated price (read-only · ปัดเศษ) | bg `#FFEDD5` border `#FB923C` |
| 🟧 Dark Orange | Manual override price | bg `#FED7AA` border `#EA580C` |
| 📜 Append log | History (no edit/delete · only insert) | bg `#F8FAFC` border-left `#7C3AED` |

---

## 🗄️ Section D — BC Table Reference (Purchase)

| เอกสาร | Table No. | Endpoint |
|---|---|---|
| Vendor | 23 | /vendors |
| Purchase Header (PO) | 38 | /purchaseOrders |
| Purchase Line | 39 | /purchaseOrderLines |
| Purchase Receipt Header | 120 | /purchaseReceipts |
| Purchase Receipt Line | 121 | /purchaseReceiptLines |
| Purchase Invoice Header | 122 | /purchaseInvoices |
| Purchase Invoice Line | 123 | /purchaseInvoiceLines |
| Vendor Ledger Entry | 25 | /vendorLedgerEntries |
| Item Vendor | 99 | /itemVendors |
| General Journal Line | 81 | /generalJournalLines (PO-8) |
| **Trade Agreement (Custom)** | — | /tradeAgreements (PO-2) |
| **Vendor Obligation (Custom)** | — | /vendorObligations (PO-7) |

---

## 📚 Source Notes (Obsidian Vault — sync 2026-04-25)

- `ArmWiki/Purchasing/00-Index.md` — MOC index
- `ArmWiki/Purchasing/VAT Trap 4 Variants.md` → Section A1
- `ArmWiki/Purchasing/Trade Promotion Types.md` → Section A2
- `ArmWiki/Purchasing/CN Audit Protocol.md` → Section A3
- `ArmWiki/Purchasing/Purchasing JD-KPI.md` → Section A4
- `ArmWiki/Purchasing/Buyer to Space Manager.md` (TBD)

**Sync rule:** ถ้ามี update ใน Obsidian vault → อ่าน vault ก่อน · sync เข้าไฟล์นี้ · log ใน `.agents/active.md`
