---
created: 2026-04-21
status: analysis-doc
scope: PO (Purchase) + WH (Warehouse) modules
purpose: ประเมินว่า mockup ปัจจุบันครอบ spec แค่ไหน และ KPI ไหนที่ยังเก็บไม่ได้
source_spec:
  - sangwijit-portal-skill/modules/PO_purchase.md
  - sangwijit-portal-skill/modules/WH_warehouse.md
---

# PO + WH — Gap Matrix + KPI Mapping

เอกสารนี้เทียบ **spec ใน skill** vs **mockup ที่ build แล้ว** และ map แต่ละ gap ไปยัง **KPI ที่จะเก็บได้/ไม่ได้** เพื่อเป็นฐานตัดสินใจว่าจะปิด gap ไหนก่อน

---

## 1. Gap Matrix — Purchase (PO)

| Skill ID | ชื่อในสป็ค | ไฟล์ mockup ปัจจุบัน | สถานะ | ปัญหา |
|---|---|---|---|---|
| PO-Q | Queue Dashboard | `poq-purchase-queue-mockup.html` | ✅ ครบ | — |
| PO-1 | Purchase Requisition (PR) | `po1-purchase-request-mockup.html` | ✅ ครบ | — |
| PO-2 | RFQ & Price Compare | `po2-rfq-mockup.html` | ✅ ครบ | — |
| **PO-3** | **Vendor Onboarding** | ❌ (ไฟล์ `po6-ap-invoice-mockup.html` ดันเป็น AP Invoice) | 🔴 **ผิดแมป** | ชื่อไฟล์ `po3` ถูกใช้โดย PO-6 — Vendor Onboarding ยังไม่ถูกสร้าง |
| PO-4 | Purchase Order | `po4-purchase-order-mockup.html` | ✅ ครบ | — |
| **PO-5** | **GRN (Finance/Buyer side)** | ❌ (มีแต่ WH GRN ใน `wh1`) | 🔴 **ขาด** | spec ระบุว่า PO-5 (Finance) กับ WH-1 (WH ลง Serial) ต้องแยกคู่กัน |
| PO-6 | AP Invoice | `po6-ap-invoice-mockup.html` | ⚠️ เลขไฟล์เพี้ยน | content ถูก แต่ filename ควรเป็น `po6-*` |
| PO-7 | Sale-In Accrual / Rebate | `po7-rebate-dashboard.html` | ✅ ครบ (ชื่อย่อ PO-R) | filename ไม่มีเลข — ควรเป็น `po7-*` |
| **PO-8** | **Deposit Bill (บิลฝาก)** | ❌ | 🔴 **ขาด** | ไม่มี mockup เลย |

**สรุป PO:** spec 9 หน้า — built 6 หน้า (ตรง) + 1 หน้า (ชื่อไฟล์ผิด) + 2 หน้า **ขาดจริง** (PO-3, PO-5, PO-8)

---

## 2. Gap Matrix — Warehouse (WH)

| Skill ID | ชื่อในสป็ค | ไฟล์ mockup ปัจจุบัน | สถานะ | ปัญหา |
|---|---|---|---|---|
| WH-Q | Queue Dashboard | `wh-queue-mockup.html` | ✅ ครบ | — |
| WH-1 | GRN + Transfer Receipt | `wh1-grn-mockup.html` | ✅ ครบ | — |
| WH-2 | Stock Transfer | `wh2-stock-transfer-mockup.html` | ✅ ครบ | — |
| WH-3 | Sales Issue (เบิกขาย) | `wh3-sales-issue-mockup.html` | ⚠️ เลขไฟล์เพี้ยน | ใช้ชื่อ `whr-` แทน `wh3-` |
| WH-4 | Physical Inventory Count | `wh4-stock-count-mockup.html` | ⚠️ เลขไฟล์เพี้ยน | ใช้ `wh3-` แทน `wh4-` (ชนกับ WH-3!) |
| **WH-R** | **Stock Card / รายงานสต็อก** | ❌ | 🔴 **ขาด** | ไม่มี mockup |
| **WH-NM** | **Non-Move Report** | ❌ | 🔴 **ขาด** | spec ละเอียดครบ (Threshold 🟡🔴⚫, Tab เทียบสาขา, บันทึก Action) แต่ยังไม่ render |

**สรุป WH:** spec 7 หน้า — built 3 หน้า (ตรง) + 2 หน้า (ชื่อไฟล์เพี้ยน) + 2 หน้า **ขาดจริง** (WH-R, WH-NM)

**Naming collision ที่ต้องแก้ด่วน:** `wh3-` ถูกใช้โดย Stock Count แต่ spec บอกว่า WH-3 คือ Sales Issue — ถ้าไม่แก้ จะงงทั้งทีม dev และ BC mapping

---

## 3. KPI Mapping

เชื่อม KPI ที่ purchasing/warehouse มาตรฐานเขาเก็บกัน → mockup ไหนเป็นแหล่งข้อมูล → ขาดอะไรถ้า gap ยังอยู่

### 3.1 Purchase KPIs

| # | KPI | สูตร | Data Source | ขาดอะไร |
|---|---|---|---|---|
| P1 | **PR → PO Cycle Time** | avg(PO.submitDate − PR.approveDate) | PO-1 + PO-4 Timeline | ✅ timestamp พร้อม · ❌ **หน้ารวม KPI ยังไม่มี** |
| P2 | **PO Approval Lead Time** | avg(PO.approveDate − PO.submitDate) | PO-4 Timeline + SL-F1 | ✅ มี · ❌ dashboard ขาด |
| P3 | **Vendor On-Time Delivery Rate** | GRN.postDate ≤ PO.expectedDate / total GRN | PO-4 + WH-1 | ⚠️ ต้อง link GRN ↔ PO expected date |
| P4 | **Vendor Price Accuracy** | \|PO.price − Invoice.price\|/PO.price | PO-4 + PO-6 | ✅ มี 3-Way Match ใน spec · ❌ ยังไม่ visualize |
| P5 | **3-Way Match Accuracy** | % Invoice ที่ match PO + GRN ไม่ต้อง override | PO-4 + PO-5 + PO-6 | 🔴 **blocked — PO-5 ยังไม่มี** |
| P6 | **Vendor Onboarding SLA** | วันที่ Vendor Active − วันที่ submit | PO-3 | 🔴 **blocked — PO-3 ยังไม่มี** |
| P7 | **KYC Compliance Rate** | % Vendor Active ที่มีเอกสาร KYC ครบ | PO-3 | 🔴 **blocked — PO-3 ยังไม่มี** |
| P8 | **Advance Settlement Lead Time** | avg(Settle Date − Prepay Date) | PO-8 | 🔴 **blocked — PO-8 ยังไม่มี** |
| P9 | **Credit Term Breach Count** | นับ PO ที่ Due Date ถึงแต่ยังรับไม่ครบ | PO-4 + PO-8 | 🔴 **blocked — PO-8 ยังไม่มี** |
| P10 | **Rebate Realization Rate** | Realized / Accrued × 100% | PO-7 | ✅ มี · ⚠️ ยังไม่ highlight rate เป็น KPI |
| P11 | **Rebate Target Achievement** | Actual Sell-out / Agreement Target | PO-7 (+ SL data) | ⚠️ spec รองรับ Sell-out trigger — ยังไม่ wire |
| P12 | **PR Rejection Rate** | Rejected PR / Total PR | PO-1 | ✅ มี status · ❌ ไม่มี rollup view |
| P13 | **RFQ Vendor Participation** | Vendor ที่ตอบ / Vendor ที่ส่ง RFQ | PO-2 | ✅ มี · ❌ dashboard ขาด |
| P14 | **GRN Over-receive Rate** | GRN ที่เกิน PO / Total GRN | PO-5 + WH-1 | 🔴 **blocked — PO-5 ยังไม่มี** |

### 3.2 Warehouse KPIs

| # | KPI | สูตร | Data Source | ขาดอะไร |
|---|---|---|---|---|
| W1 | **GRN SLA Compliance** (≤ 4h) | % GRN ที่ post ≤ 4h หลัง vendor ส่ง | WH-1 Timeline | ✅ timestamp มี · ❌ **rollup dashboard ขาด** |
| W2 | **Sales Issue SLA** (≤ 2h) | % Issue ที่ post ≤ 2h หลัง SO confirm | WH-3 (whr) Timeline | ✅ มี · ❌ dashboard ขาด |
| W3 | **Transfer SLA** (≤ 1 day) | % Transfer ที่ ship ≤ 1 วัน | WH-2 Timeline | ✅ มี · ❌ dashboard ขาด |
| W4 | **Serial Mismatch Rate** | Serial ที่ reject ตอน Post / Total | WH-1 + WH-3 | ⚠️ spec validate ตอน post · ❌ ไม่มี log count |
| W5 | **Inventory Accuracy** | 1 − \|Count variance\|/BC stock | WH-4 (wh3) | ✅ มี · ❌ ไม่มี trend chart |
| W6 | **Dead Stock Ratio** | Dead Stock value / Total inventory value | WH-NM | 🔴 **blocked — WH-NM ยังไม่มี** |
| W7 | **Inventory Aging Distribution** | % stock แบ่งตาม bucket (0-30/31-60/61-90/>90 วัน) | WH-NM + WH-R | 🔴 **blocked — ทั้ง 2 ยังไม่มี** |
| W8 | **Inventory Turnover** | COGS (สินค้าออก) / Avg inventory | WH-R Stock Card | 🔴 **blocked — WH-R ยังไม่มี** |
| W9 | **Stock Movement Velocity** | จำนวน movement/เดือน per SKU | WH-R | 🔴 **blocked — WH-R ยังไม่มี** |
| W10 | **QC Pass Rate** | Line ที่ QC Pass / Total line | WH-1 QC tab | ✅ spec มี QC flag · ❌ ไม่มี rollup |
| W11 | **Bin Utilization** | Bin ที่ใช้ / Total bin | MD-5 + WH-1/2/3 | ⚠️ spec มี Bin · ❌ ไม่มี dashboard |
| W12 | **เงินจมในคลัง (Credit Term Breach)** | มูลค่าของที่ยังไม่ขาย + ดิว Vendor เลยแล้ว | WH-NM (คอลัมน์ "เหลือก่อนดิว") | 🔴 **blocked — WH-NM ยังไม่มี** |
| W13 | **Stock Out Event Count** | SO ที่ขายไม่ได้เพราะสต็อกไม่พอ | WH-3 + MD-1 | ⚠️ ต้องเพิ่ม log ตอน Issue fail |

---

## 4. Priority Matrix

### 4.1 ตรึง Gap ตามผลกระทบต่อ KPI

| Priority | Gap | KPI ที่ปลด | Effort | ตรงสเกลของสป็ค |
|---|---|---|---|---|
| **P0 Critical** | WH-NM Non-Move Report | W6, W7, W12 (Dead Stock, Aging, เงินจม) | **~1 วัน** (spec ละเอียดมาก พร้อม render) | ✅ ละเอียดเกือบ 100% |
| **P0 Critical** | PO-5 Finance GRN | P5, P14 (3-Way Match, Over-receive) | ~0.5 วัน (เกือบเหมือน WH-1) | ✅ ละเอียด |
| **P1 High** | PO-8 Deposit Bill | P8, P9 (Advance-Settle, Credit Term Breach) | ~1 วัน | ✅ ละเอียด (2 scenarios ชัด) |
| **P1 High** | PO-3 Vendor Onboarding | P6, P7 (Onboarding SLA, KYC) | ~0.5 วัน (form เดี่ยว) | ✅ ละเอียด |
| **P2 Medium** | WH-R Stock Card | W7, W8, W9 (Aging, Turnover, Velocity) | ~0.5 วัน (report view) | ⚠️ spec สั้น — ต้องเสริม |
| **P2 Medium** | PO-KPI Dashboard (หน้าใหม่) | P1, P2, P3, P4, P10, P12, P13 (rollup) | ~1 วัน | ❌ ไม่มีใน spec — ต้อง design |
| **P2 Medium** | WH-KPI Dashboard (หน้าใหม่) | W1, W2, W3, W4, W10, W11 (rollup) | ~1 วัน | ❌ ไม่มีใน spec — ต้อง design |
| **P3 Low** | Rename ไฟล์ให้ตรง spec | — (cleanup) | ~0.5 วัน | — |

**รวม effort ปิด gap ทั้งหมด: ~6 วันทำงาน**

### 4.2 Dependency

```
PO-5 Finance GRN ───┐
                    ├─→ ปลด KPI "3-Way Match" (P5)
PO-6 AP Invoice ────┘       (PO-6 มีแล้ว แต่ filename เพี้ยน)

WH-NM ─── ใช้ itemLedgerEntries เดียวกับ WH-R ─── ควรทำพร้อมกัน

PO-KPI Dashboard ─── รอ PO-3, PO-5, PO-8 เสร็จก่อน ─── built P2

WH-KPI Dashboard ─── รอ WH-NM, WH-R เสร็จก่อน ─── built P2
```

---

## 5. สิ่งที่ KPI Dashboard ควรมี (ถ้าตัดสินใจทำ)

### 5.1 PO-KPI Dashboard — Layout ที่แนะนำ

```
┌────────────────────────────────────────────────────┐
│  PURCHASE KPI DASHBOARD   [เดือน ▾] [สาขา ▾]       │
├────────────────────────────────────────────────────┤
│  Card Row:                                         │
│  ┌────┬────┬────┬────┬────┐                        │
│  │PR→PO│Appr│3-Way│Rebate│Vendor│                  │
│  │2.1d │4h  │98%  │64%  │A:94%  │                  │
│  └────┴────┴────┴────┴────┘                        │
├────────────────────────────────────────────────────┤
│  Chart: Vendor On-Time Delivery Trend (6 mo)       │
├────────────────────────────────────────────────────┤
│  Table: Top 5 Vendor by Spend + Score              │
├────────────────────────────────────────────────────┤
│  Alert: Credit Term Breach (PO-8), Over-receive    │
└────────────────────────────────────────────────────┘
```

### 5.2 WH-KPI Dashboard — Layout ที่แนะนำ

```
┌────────────────────────────────────────────────────┐
│  WAREHOUSE KPI DASHBOARD  [เดือน ▾] [คลัง ▾]        │
├────────────────────────────────────────────────────┤
│  SLA Row:                                          │
│  GRN 4h: 96%  │ Issue 2h: 89% │ Transfer 1d: 92%   │
├────────────────────────────────────────────────────┤
│  Card: Dead Stock ฿0.9M (22 SKU)  [→ WH-NM]        │
│  Card: Aging 90+ วัน (11%)       [→ WH-R]           │
├────────────────────────────────────────────────────┤
│  Chart: Inventory Turnover Trend                   │
├────────────────────────────────────────────────────┤
│  Table: Serial Mismatch Log (last 30d)             │
└────────────────────────────────────────────────────┘
```

---

## 6. ข้อสังเกต — สิ่งที่ spec ดี และสิ่งที่ยังอ่อน

### ✅ spec แข็ง
- WH-NM ละเอียดระดับ render ได้เลย (มี threshold config · summary cards · table · tabs · alert template · BC API ครบ)
- PO-8 scenario A/B ชัด · GL posting ระบุตรง
- RBAC matrix ครบทุก module
- BC API endpoints ระบุครบ (ไม่ต้อง research เพิ่ม)

### ⚠️ spec อ่อน (ควรเสริมก่อน build KPI layer)
- **ไม่มีสป็ค KPI Dashboard** — spec เป็น transaction-centric ไม่มี reporting layer
- **Timestamp schema ไม่ชัด** — แต่ละ status transition ต้องมี `changed_at` + `changed_by` ไหม? (ต้องเพิ่มใน `swt-link.js` Timeline API)
- **WH-R Stock Card** — spec แค่ 10 บรรทัด · ต้องออกแบบ Aging bucket + Velocity เอง
- **KPI target/threshold** — ไม่มีที่เก็บค่า target (เช่น SLA 4h, On-Time 95%) → ต้องเพิ่มใน CF-2.9 หรือสร้าง CF-KPI ใหม่

---

## 7. คำแนะนำสุดท้าย (สำหรับ decision)

**ถ้าเป้าหมายคือ "KPI visibility ให้ผู้บริหาร":**
→ ทำ **P0 + P2 dashboard** ข้ามได้: WH-NM → WH-KPI Dashboard, PO-5 → PO-KPI Dashboard
→ Effort ~4 วัน ปิด KPI ที่ critical ส่วนใหญ่

**ถ้าเป้าหมายคือ "ให้ spec ครบก่อนส่ง dev":**
→ ทำ **P0 + P1** ก่อน (ปิดทุก gap ที่ block KPI): 5 หน้า ~4 วัน
→ KPI Dashboard ยกไว้ Phase 1.5

**ถ้าเป้าหมายคือ "cleanup ก่อน เพื่อไม่ให้ confuse dev":**
→ ทำ **P3 rename** ก่อน (0.5 วัน) แล้วค่อยตัดสินใจ build gap

---

## Appendix — อ้างอิงเร็ว

- spec: `sangwijit-portal-skill/modules/PO_purchase.md` (9 modules)
- spec: `sangwijit-portal-skill/modules/WH_warehouse.md` (7 modules)
- mockup folder: `C:/Design Ai/` (root level *.html)
- design standards: `knowledge-base/portal/*.md`
- Flow diagrams: `Flow Design/Purchase/Flow/*.pdf`, `Flow Design/Warehouse Inventory/Flow/*.pdf`
