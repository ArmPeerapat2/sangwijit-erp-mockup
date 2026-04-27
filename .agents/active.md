---
updated_at: "2026-04-27T22:00:00+07:00"
status: "active"
current_focus: "Phase 1 closeout (Tier-C polish) → Phase 2: Brand CI rollout (SWE only · #184898 + #F37721 + Sukhumvit · ใช้กับงานใหม่ตั้งแต่ตอนนี้)"
branch: "main"
project_type: "frontend-mockup (HTML + docs)"
---

## Phase 1 Closeout (2026-04-27 evening)

- **Tier-C polish ✅ DONE 2026-04-27 (evening)**:
  - **BC Direct banner** added to 3 cut-to-BC pages: CF-2.1 Tax Setup · CF-2.2 Number Series · CF-2.9 General Parameter — banner สีแดงระบุชัดว่าใช้ BC365 ตรง · mockup เก็บเป็น reference เท่านั้น · ระบุ BC path
  - **Deprecate portal-mockup-index.html** = ไฟล์หายแล้ว (rename/merge เป็น index.html ตั้งแต่ก่อนหน้า) · skip
  - Sidebar edge cases (modal/login/print/sc10/sv7/sv6 — 5-6 ไฟล์ที่ rollout ไม่ครบ): ปกติเป็นหน้าที่ no/cut-down sidebar · pre-existing pattern · ไม่ใช่ scope แก้

## Phase 2 Plan: Brand CI Rollout (SWE-only)

- **Decision 2026-04-27:** ใช้ Sangwijit Design CI (skill at `~/OneDrive/claude/ArmWiki/sangwijit-design/`) กับ **งานใหม่หลังจากนี้ทุกชิ้น**
- **Scope correction:** CI ครอบคลุม **SWE (แสงวิจิตรการไฟฟ้า · ค้าปลีก) เท่านั้น** · SWT/VMN/WPS ยังไม่มี logo · ต้องถามก่อนใช้
- **Locked specs (SWE):**
  - 🔵 Brand Blue: `#184898` (RGB 24/72/152)
  - 🟠 Brand Orange: `#F37721`
  - Font: **Sukhumvit** (TH+EN single font · fallback `Sukhumvit Set, IBM Plex Sans Thai, Sarabun`)
  - Tagline: "เพื่อนแท้ ไว้ใจได้"
- **Existing 80+ mockups:** leave as-is (Tailwind `#2563EB` + Inter+Noto Sans Thai · sidebar `#1E3A5F`) — ห้าม batch refactor unless requested
- **Multi-entity caveat:** ERP mockups ส่วนใหญ่เป็น multi-entity (Dual-Book Tag 1/2/3/novat) ไม่ใช่ SWE-only · การ apply CI SWE กับ ERP ทั้งระบบจะไม่เหมาะ · รอ master brand CI

# Active Context

## Objective
ออกแบบ Frontend ERP Web Portal (Sangwijit Group) เหนือ Dynamics 365 Business Central — สร้าง HTML mockup ครบทุกหน้า, เตรียม handoff ให้ทีม dev

## Current State (2026-04-27 — latest)

- **SV Phase 3 SIR/SQT/CLM expansion ✅ NEW 2026-04-27** — ขยาย flow ให้รองรับงานที่ต้องประเมินหน้างาน + งานเคลม Vendor
  - **3 หน้าใหม่:**
    - `sir-site-inspection-mockup.html` — ใบประเมินหน้างาน (Site Inspection Report) · 5-section: ข้อมูลลูกค้า · งานที่ต้องประเมิน · รายการประเมิน + รูป + ประมาณค่า · ข้อจำกัดหน้างาน · Hand-off → SQT
    - `sqt-service-quotation-mockup.html` — ใบเสนอราคางานบริการ · ผู้จัดการ markup · ส่งลูกค้า · รอยืนยัน → SV-2
    - `clm-vendor-claim-mockup.html` — ใบเคลม Vendor (post-warranty) · ส่งเคลมแบรนด์ · ติดตามผล · รับเงิน/ของแทน → ตั้ง APCN ตัด ARI ของ SV-4 · 6-step status pills
  - **Flow เพิ่ม:** SV-1 → **(ถ้าต้องประเมินหน้างาน) → SIR → SQT → ลูกค้ายืนยัน** → SV-2 → SV-5 → SV-3/SV-O → SV-4 → SV-7 · ส่วน CLM แยก loop จาก SV-4 (post-close) → APCN
  - **Branch optional ใน SV-1:** เพิ่มปุ่ม `🔍 ขอประเมินหน้างาน (SIR)` (secondary) คู่กับ `→ ส่งต่อ SV-2` (primary) · Timeline แทรก step "ประเมินหน้างาน (ถ้าจำเป็น)"
  - **Sidebar rollout:** 75 ไฟล์ (Python regex block replace · count 9 → 12) · เพิ่ม SIR/SQT/CLM · reorder ตาม flow (SV-5 ก่อน SV-3) · 5 ไฟล์ตกหล่น (modal/login/print/sc10 — ไม่มี sidebar SV)
  - **index.html:** Service section 8 → 11 cards · sidebar nav 8 → 11 entries · KPI hero 66 → 80 pages · subtitle อัพเดต
  - **CLM footer fix:** แก้ copy-paste leftover (ปุ่ม "ส่งต่อ SQT" → "ตั้ง APCN + ปิดเคลม")
  - **Pending:**
    - Verify SIR/SQT vs `ui_design_pattern_guideline.md` (7-section ERP form, status hex, bilingual)
    - Wire reverse links: SV-4 → CLM (button "🎫 เปิดเคลม Vendor" สำหรับงานในประกัน), SQT → SV-2 (auto-spawn)
    - ทบทวน BC365 mapping ของ SIR/SQT/CLM (Portal-owned 100% ตาม pattern SV)
- **AP Invoice chain audit ✅ DONE 2026-04-27** — PO-6/PO-5/PO-8 audit pass · features ครบ
  - PO-6 (AP Invoice · ใบวางบิล Vendor): gate "รับครบก่อนตั้งหนี้" + 2-mode toggle (Normal 3-Way / Deposit 2-Way) + auto-switch via `#mode=deposit` deep-link
  - PO-5 (Finance GRN · ใบรับสินค้าตั้งหนี้): partial receive + cumulative tracking + full-receive detector + forward CTA "→ PO-6" (เพิ่งเพิ่ม) · text-link → PO-8 (ครบ Credit Term)
  - PO-8 (Deposit Bill · บิลฝาก): "⏭ Settle (ของครบ)" deep-link → PO-6#mode=deposit
  - Per-line ref refactor: PO-4 "ชื่อสินค้า · PR ref · VC" → "ชื่อสินค้า" + column dedicated "เลขที่อ้างอิง" ขวาสุด · ย้าย ref จาก PR (po1) → SL-4 (INV-26-0042 drop-ship pattern)
  - SL-4 ก็ refactor ตาม pattern เดียวกัน (column "เลขที่อ้างอิง" ขวาสุด · ย้าย ref จาก inline)
  - PO-4 References section "📎 เอกสารอ้างอิง": inline body section → popup modal pattern (เหมือน SL-4 mDocRef) · trigger card + summary stats + ปุ่ม "🔗 ดูรายละเอียด" → modal มี PSI Report + PO-8 Deposit เนื้อหาเดิมครบ
- **WH-Q/WH-1/WH-3 Refactor ✅ NEW 2026-04-27 (later)** — split queue role per page · Q1=a (ลบจาก WH-Q) + Q2=b (ลบ form WH-1)
  - **WH-1 (Warehouse Receive Queue · คิวรอรับสินค้า):** ลบ form (S2-S7: doc-header + vendor-info + line items + tabs + summary + sticky-action) ออก · เป็น list page เต็มตัว · KPI 4 cards + 8 sub-filter chips (PO · PO-8 · TR-In · RT-Good · RT-Defective · RT-SV · RT-V · ADJ-In) + queue table 8 rows · click row → Detail modal (SL-4 pattern · gradient main-header + status pills + party card + line items + footer)
  - **WH-3 (Warehouse Issue Queue · คิวเบิกสินค้า):** ลบ queue table เก่า (6 rows) · ใส่ใหม่ 9 rows + 8 sub-filter chips (SL-4 · SV-6 · TR-Out · SV-3 · SV-O · Promo · ADJ-Out · RT-V Out) · เก็บ Tab 2 (Pick & Pack) + Tab 3 (History) ไว้ · click row → Detail modal เดียวกับ WH-1
  - **WH-Q (Warehouse Dashboard):** ลบ 2 sections (Receive + Issue queues) ออก · เก็บ KPI summary + filter bar · เพิ่ม CTA cards 2 ใบ (gradient blue → WH-1 รับ · gradient pink → WH-3 เบิก) + Quick links bar (WH-2/WH-4/WH-R/WH-NM) · ลบ JS chip + modal (ไม่ใช้แล้ว)
  - **Sidebar relabel 75 ไฟล์:** WH-Q "คิวรับสินค้า" → "Dashboard" · WH-1 "ใบรับสินค้า (GRN)" → "คิวรอรับสินค้า" · WH-3 "เบิกสินค้า" → "คิวเบิกสินค้า"
  - **index.html:** sidebar nav labels + WH cards (3 cards updated content) + 1 card descriptions
- **WH Module Reports ✅ NEW 2026-04-27 (earlier)** — ปิด WH module
  - WH-NM (Warehouse Non-Movement Report · รายงานสินค้าไม่เคลื่อนไหว): audit pass · features ครบ (threshold settings · category override · filter · ledger · branch breakdown · auto-alert) · ไม่ต้องแก้
  - WH-R (Warehouse Stock Card · รายงานสต็อกการ์ด): **NEW** — 7 sections ใหม่
    - WH-R-1 ตัวกรอง (SKU + สาขา + ช่วงเวลา + brand)
    - WH-R-2 Item Info card (SKU header + cost layers + sell price + stock)
    - WH-R-3 KPI strip 5 cards (Open · In · Out · Closing · MOS)
    - WH-R-4 Movement Ledger (16 transactions · GRN/Sales/TR-In/TR-Out/SVC/ADJ + cumulative balance + Moving Average cost)
    - WH-R-5 Branch Breakdown (4 สาขา + MOS + status)
    - WH-R-6 FIFO Cost Layers (4 lots · weighted avg cross-check)
    - WH-R-7 Sales Velocity Comparison (30/60/90 วัน + MOS recommendation)
  - **Sidebar rollout 73 ไฟล์** (WH count 5 → 7) · 6 edge cases (modal/login/print/sc10/sv7/sv6 — handle แยก)
  - **index.html:** WH section 5 → 7 cards · sidebar nav 5 → 7 entries · KPI hero 80 → 81 pages
- **Feedback rule new:** [Expand abbreviations](feedback_abbreviation_expansion.md) — ทุกครั้งที่พิมพ์ตัวย่อในข้อความตอบ user ต้องใส่ชื่อเต็มในวงเล็บประกอบ
- **Phase 1 mockup status:** 81 pages ทั้งหมด · AP Invoice chain ปิด · WH module ปิด · เหลือ low-priority polish (sidebar edge cases · spec docs)

- **PIVOT 2026-04-23 22:00 — Path 2 scope simplified + focus shift → AP Invoice (PO-6)**
  - **User clarifications ยืนยัน:**
    - **PO-3 Vendor Onboarding** = สร้าง Vendor ใหม่ (กรอกข้อมูล) · **ไม่ใช้ KYC** · create-only — การแก้ไขต้องใช้สิทธิ์ (ไม่อยู่ใน scope หน้านี้) · ไม่ซีเรียส · สร้างได้เลย
    - **PO-5 Finance GRN** = รับสินค้า โดย user = คลัง หรือ แคชเชียร์สาขา (ขึ้นกับมอบหมาย/สิทธิ์) · **ทยอยรับได้** (order 10 · รับก่อน 2 ตัว OK) · **เงื่อนไขตั้งหนี้: ต้องรับครบบิลก่อน** ถึงจะตั้งหนี้ได้ (ยกเว้นเข้าเงื่อนไข PO-8 บิลฝาก)
    - **PO-8 Deposit Bill** = **ข้ามขั้น PO-5** · รับการวางบิล/จ่ายชำระก่อน · สินค้ายังอยู่กับบริษัท (ฝากของ) · ทยอยรับสินค้าผ่าน PO-5 · ต้อง**ไล่ตาม flow เอกสาร**
    - **WH-R + WH-NM** = กลุ่ม**รายงาน** (ไม่เร่ง) · ดึงจากประวัติรับเข้า + ประวัติสินค้า + คงเหลือ + ประวัติขาย เปรียบเทียบ
  - **NEW FOCUS:** กระบวนการตั้งหนี้ (AP Invoice · PO-6) — ลำดับสำคัญกว่า Path 2 เดิม
    - flow: PO-5 (รับครบ) → PO-6 AP Invoice | PO-8 (บิลฝาก) → PO-5 ทยอยรับ → settle
    - PO-6 mockup มีอยู่แล้ว — ต้อง audit ว่า UX ตรง flow นี้ไหม (gate "รับครบ" · link PO-8 advance · 3-Way Match)
  - **Pending decision:** `/plan-mockup` skill setup — user ถามแนวทาง 3 option (skill / memory / ทั้งคู่) ยังไม่ตัดสินใจ — คาดเริ่ม conversation หน้า
  - **Build order ใหม่ (revise):** audit PO-6 flow ก่อน → PO-5 (รับสินค้า + gate) → PO-8 (ฝากของ + advance) → PO-3 (simple form) → WH-R/WH-NM (reports · low priority)

- **SV Module Phase 2 Refinement ✅ NEW 2026-04-23 (evening)** — ปรับโครงตาม user workflow จริง (4 ขั้น + SV-Order)
  - **User's 4-step workflow:** (1) ใบรับงานซ่อม · (2) ใบมอบหมายงาน · (3) ใบรับจากงานซ่อม (admin pricing) · (4) ส่งงานลูกค้า + ปิดงาน
  - **NEW builds (3 pages):**
    - `sv2-service-assignment-mockup.html` — ใบมอบหมายงาน (เดิมรวมอยู่ใน SV-1) · 6 tabs: เลือกช่าง/นัด/เบิก-สั่งอะไหล่ล่วงหน้า/แจ้งลูกค้า+ช่าง/อ้างอิง/timeline · 3 tech cards
    - `sv-order-parts-request-mockup.html` — สั่งอะไหล่ (ใหม่ทั้งหมด) · state chain 5 ขั้น: สั่ง → จ่ายเงิน → รอรับอะไหล่ → นัดหมาย → รอส่งอะไหล่เก่าคืน · ผูก Job+Customer+Serial · spawn PO-4
    - `sv7-service-delivery-mockup.html` — ส่งงานลูกค้า + ปิดงาน (แยกจาก SV-4) · customer signature + Rating + QR PromptPay + Invoice preview · ปิดงานระหว่างเรา-ลูกค้า
  - **Refactor (3 pages):**
    - `sv1-service-intake-mockup.html` — ตัดส่วน "นัดหมายช่าง" ออก (ย้าย SV-2) · Tab "ความสะดวกลูกค้า" (preferences only) · action → ส่งต่อ SV-2
    - `sv3-spare-part-issue-mockup.html` — Redesign ตาม `ui_design_pattern_guideline.md` · 7-section ERP form · status hex (`#BFBFBF`/`#C55A11`/`#4472C4`/`#375623`) · bilingual TH/EN labels · 4 tabs
    - `sv4-service-close-mockup.html` — เปลี่ยนเป็น "ใบรับจากงานซ่อม" (admin pricing+warranty adj) · **Tab Vendor Billing (Q2=A)** · Customer side เป็น preview · action → ส่งต่อ SV-7
  - **Light touch:** `sv5-job-card-mockup.html` — เพิ่ม state link ไป SV-3/SV-Order + state flow alert · action → SV-4
  - **SV-Order vs อื่น:** ไม่ซ้ำ · SV-3 = เบิกจาก**สต็อก** · SV-Order = **สั่งใหม่** (spawn PO-4 · รับผ่าน WH-1 GRN)
  - **Sidebar rollout:** 67 files (Python regex block replacement · idempotent) · 9 SV entries: SV-Q/1/2/5/3/O/4/7/6
  - **index.html:** Service section 5→8 cards · meta + sidebar updated
  - **Commit prior:** `ddc4d8b` feat(sv): Phase 1 SV loop closure
- **SV Module Loop Closure ✅ 2026-04-23 (morning) — superseded by evening refinement above**
  - **Rename + Archive:**
    - `sv1-service-queue-mockup.html` → `sv-q-service-queue-mockup.html` (เนื้อหาจริง = Queue Dashboard)
    - `sv2-service-invoice-mockup.html` → `_archive/` (Service Invoice logic ย้ายเข้า SV-4 ตาม Q3=B)
    - `sv4-warranty-check-mockup.html` → `_archive/` (**ไม่ใช้** — ทีมเช็คประกัน manual กับ Vendor · Q2 decision)
  - **NEW 2 pages built:**
    - `sv1-service-intake-mockup.html` — ERP Form 7 sections: Doc header · Customer · Product+Serial · Warranty toggle (3 options) · Appointment/Photo/Ref/Timeline tabs · ประมาณค่า · **ไม่มี auto warranty check** (manual field)
    - `sv4-service-close-mockup.html` — Close/QA + Invoice merged: Job ref · QA Checklist 6 ข้อ · Before/After photos · Digital signature 2 เซ็น + Rating · **Billing mode dual** (🏢 Vendor / 👤 ลูกค้า split summary) · BC Sync post
  - **Spec ambiguity resolved (Q1=A):** SV-2 Mobile Job Card ตัดออก — sv5 Desktop Job Card cover ทั้งหมด
  - **Sidebar rollout:** 69 ไฟล์ updated (2-pass Python script) · 6 SV entries ใน group บริการ: SV-Q · SV-1 (NEW) · SV-3 · SV-4 (NEW) · SV-5 · SV-6
  - **index.html:** Service section (5 cards · count 5 pages) + sidebar nav updated
  - **dev-handoff-spec.html:** SV table + file list updated
- **PO/WH Rename Cleanup ✅ 2026-04-21** — ปรับเลข mockup ให้ตรง `sangwijit-portal-skill` spec
  - `po3-vendor-invoice-mockup.html` → `po6-ap-invoice-mockup.html` (เดิมผิดแมป — จริงๆ คือ PO-6 AP Invoice)
  - `po-rebate-dashboard.html` → `po7-rebate-dashboard.html`
  - `whr-goods-issue-mockup.html` → `wh3-sales-issue-mockup.html` (spec: WH-3 = Sales Issue)
  - `wh3-stock-count-mockup.html` → `wh4-stock-count-mockup.html` (spec: WH-4 = Physical Count)
  - Updated: 73 .html files + swt-link.js + 3 .md docs (filename refs + sidebar code labels + titles + breadcrumbs + stale `PO-Rebate` → `PO-7`)
  - _archive/ ไม่แตะ
- **Gap + KPI Matrix ✅ NEW 2026-04-21** — `.agents/topics/po-wh-gap-kpi-matrix.md` เทียบ spec vs mockup (PO 9 + WH 7), map 27 KPI, Priority P0-P3
- **Next (revised 2026-04-23 22:00 — focus = ตั้งหนี้ flow):**
  1. Audit PO-6 AP Invoice (มีอยู่แล้ว) ว่า gate "รับครบก่อนตั้งหนี้" + link PO-8 มีหรือยัง
  2. Build PO-5 Finance GRN (ทยอยรับ + full-receive detector)
  3. Build PO-8 Deposit Bill (ข้าม PO-5 · bill first · flow เอกสารไล่ตาม Flow Design PDF)
  4. Build PO-3 Vendor Onboarding (simple form · no KYC · create-only)
  5. (Low priority) WH-R Stock Card + WH-NM Non-Move Report — รายงาน · ดึงข้อมูลรวม

## SV Module — Final Structure (post 2026-04-23 Phase 2 refinement)
| รหัส | ไฟล์ | บทบาท | State หลัก |
|---|---|---|---|
| SV-Q | `sv-q-service-queue-mockup.html` | Queue dashboard (ทุกสถานะ) | filter ตาม state |
| **SV-1** | `sv1-service-intake-mockup.html` | ใบรับงานซ่อม (รับเรื่อง · ประมาณการ) | `รอมอบหมาย` |
| **SV-2** 🆕 | `sv2-service-assignment-mockup.html` | ใบมอบหมายงาน (Admin เลือกช่าง+นัด) | `รอมอบหมาย → มอบหมายแล้ว` |
| SV-5 | `sv5-job-card-mockup.html` | Job Card ช่าง (กรอกอาการ+แก้ไข) | `งานช่าง → ส่งงาน/รออะไหล่/รอสั่งอะไหล่` |
| SV-3 | `sv3-spare-part-issue-mockup.html` | เบิกอะไหล่จาก**สต็อก** | `PendingApproval → Issued` |
| **SV-Order** 🆕 | `sv-order-parts-request-mockup.html` | **สั่งอะไหล่** (ไม่มีในสต็อก · spawn PO-4) | `สั่ง → จ่าย → รอรับ → นัด → คืนของเก่า` |
| **SV-4** (refactored) | `sv4-service-close-mockup.html` | ใบรับสินค้าจากงานซ่อม (admin pricing + Vendor billing) | `รอส่งคืนลูกค้า` |
| **SV-7** 🆕 | `sv7-service-delivery-mockup.html` | ส่งงานลูกค้า (เซ็น+QR+Invoice+ปิดงาน) | `ปิดงาน (เรา-ลูกค้า)` |
| SV-6 | `sv6-delivery-install-mockup.html` + 2 sub | Delivery & Install (งานติดตั้งสินค้าใหม่ · แยก loop) | — |
| CL-1/2/3 | `cl1-claims-mockup.html` (CL-2/3 ยังไม่มี) | ⏳ Phase 2 deferred (BC365 audit) | — |

### Design guide compliance (2026-04-23)
- ใหม่ทั้ง 3 ไฟล์ + SV-3 redesign: 7-section ERP form pattern · status-badge hex `#BFBFBF/#C55A11/#4472C4/#375623/#C00000/#00B050` · bilingual `label + .en` · sticky `.footer-actions` · SC5 doc-chain · SC7 timeline tab · numeric `.num` class
- Reference: `ui_design_pattern_guideline.md` (ผู้ใช้สั่ง Q1 · 402 บรรทัด)

## Previous Focus (2026-04-19)
- **Payment QR 2 ชั้น ✅ NEW 2026-04-19** — Tier-A 5 ใน `swt-link.js` (~260 บรรทัดเพิ่ม)
  - **ชั้น 1 — Customer QR (modal)** — ปุ่มม่วง `📱 QR` auto-inject ข้างทุก `[data-customer-search]` (9 หน้า: SL-1/2/3/4, SV-2/3, WHR + MD-2 combo)
    - Modal: picker · Biller ID (099-4-12345-6) · Ref1 = รหัสลูกค้า · Ref2 = YYMM · amount mode (ว่าง/ค้างรวม/ระบุ) · PNG / Copy / ส่ง LINE
  - **ชั้น 2 — Invoice QR (inline card)** — helper `swtRenderInvoiceQR()` · ฝังใน SL-3 (มัดจำ ฿30,000) + SL-4 (ยอดคงเหลือ ฿24,385)
    - Ref1 = เลขที่บิล · Ref2 = CustCode · ยอด fix
    - `@media print` — เก็บ QR พิมพ์บนกระดาษได้ clean (hide ปุ่ม, border ดำ)
  - Payload mockup = URL (`pay.sangwijit.co.th/c/...` หรือ `/d/...`); prod → EMVCo PromptPay ผ่าน BC API
  - Sidebar rollout FI-1Q entry ✅ — 65 ไฟล์ได้ entry ใหม่ (Python script idempotent)
- **FI-1Q Apply Queue ✅ NEW 2026-04-19** — หน้าใหม่ `fi1q-apply-queue-mockup.html` (+หน้าใหม่ที่ 66)
  - 3 categories: 🟢 Auto-ready (Ref1+ยอดตรงเป๊ะ 1-click) · 🟡 Partial (FIFO/เกินยอด/ปิดหลายบิล) · 🔴 Unmatched (Ref1 ผิด/ไม่มี/advance ก่อนบิล)
  - Link จาก FI-Q (AR card: "📥 23 รอจัดสรร") + FI-1 topbar ("📥 Apply Queue 23")
  - DOC_MAP `URC` / `UAR` → fi1q · doc-chain: QR → URC → RV → INV
  - Flow: ลูกค้าสแกน QR → เงินเข้าบัญชี → IA-Q sync bank statement → สร้าง URC → เข้าคิวนี้ → Auto-apply หรือจัดสรรเอง → BC post RV ปิด AR
- **Tier-A 1+2+3+4 ✅** — `swt-link.js` shared component (~430 บรรทัด)
  - **Universal Doc Linker** — ทุกข้อความที่ตรง pattern `PREFIX-YYYY-####` (QT/SO/INV/PO/GRN/RV/JOB/RFQ/CRD/...) จะกลายเป็นลิงก์อัตโนมัติ
  - **Embedded SC-7 Timeline + Breadcrumb** — ฝังใน **16 หน้า transaction**:
    - งานขาย: SL-1, SL-2, SL-3, SL-4, SL-F1
    - จัดซื้อ: PO-1, PO-2, PO-3, PO-4
    - คลัง: WH-1, WH-2, WHR
    - บริการ: SV-1, SV-2
    - การเงิน: FI-1, FI-2
  - **Cross-module Doc-Chain Breadcrumb** — bar ใต้ topbar, current/pending/jump states
  - **Global Search palette** — hotkey `/` หรือ `Ctrl+K` · ค้น Doc No. + เมนู + mock customers/items · arrow keys
  - **Rolled out 65 หน้า** ✅ NEW 2026-04-17 — ทุก HTML root file มี `<script src="swt-link.js">` แล้ว (Python loop, idempotent)
- **Add-Item Standardization ✅ 2026-04-17 + ขยาย 2026-04-18** — Pattern: ถ้าหน้าใดเพิ่มสินค้าได้ ใช้ icon 🔍 + attribute `data-item-search` → auto-wire ของ SC-2 modal ผูก `openItemSearch()` ให้อัตโนมัติ
  - เปลี่ยน `+`/`➕` → 🔍 ใน 5 ไฟล์ (sl4 add-row, sl6 promo, wh2 transfer, poq queue, sv3 spare-part)
  - **เพิ่ม `<tr class="swt-add-line">` ใต้ tbody ใน 8 ตารางใหม่** ✅ 2026-04-18: sl1, sl2, po1, po4, wh1, whr (1 ตาราง each) · sv2 (2 ตาราง). PO-1 ใช้ header "SKU/PSI/ขอสั่ง" — audit รอบแรกเลยไม่จับ, แก้แล้ว
  - **รวม 13 หน้าที่กด 🔍 เปิด SC-2 modal ได้** — sl1, sl2, sl4, sl6, po1, po4, poq, wh1, wh2, whr, sv2, sv3 และอื่นๆ ที่มี data-item-search
- **Line-editable + Search-Combo Pattern ✅ NEW 2026-04-18** — ทุก transaction page ที่มี line item:
  - **Header:** ลูกค้า/Vendor field แรก เป็น `<div class="swt-search-combo">` (textbox + ปุ่ม 🔍) · attr `data-customer-search` / `data-vendor-search` → เปิด global palette
  - **Line items:** จำนวน (input number class=line-input qty), หน่วย (select class=line-select), ราคา (input text class=line-input price), คลัง (select class=line-select) — editable ได้ทุก row
  - **Add-row:** `<tr class="swt-add-line">` เปลี่ยนเป็น swt-search-combo (textbox + ปุ่ม 🔍 ค้นหาสินค้า · Enter key ก็เปิด modal)
  - **Shared CSS + JS:** ย้ายเข้า `swt-link.js` แล้ว (ไม่ต้อง inline ในแต่ละไฟล์)
  - **หน้าที่ rollout:** SL-1/2/3/4, PO-1/3/4, WH-1/2, WHR, SV-2/3 (11 หน้า) · โอนย้าย (WH-2) ไม่มีราคา, มี FROM/TO คลังอยู่แล้ว
- **Tier-B ✅ NEW 2026-04-17**
  - **PO-2 RFQ / Vendor Compare** — เปรียบ 3 vendor side-by-side (ราคา/lead time/payment/QC/rebate), score 0-100, line-item compare, award → สร้าง PO + route ผ่าน CF-2.6
  - **SL-F1 Credit Approval** — แยกจาก AP-1; queue เฉพาะ SL ที่เกินวงเงิน/ลูกค้าค้าง · credit gauge + AR aging + workflow tier 1→2→3 · enforce Maker ≠ Checker
  - sidebar nav อัปเดตทุกไฟล์: SL group 11→12 entries, PO group 5→6 entries
  - DOC_MAP เพิ่ม `RFQ`, `CRD`, `CRA`
- **index.html** (master index v2.0) — sidebar collapse 13 groups · live search · BC365 matrix · 64 pages
- **Unified sidebar rolled out** → ทุกหน้า mockup ใช้ sidebar เดียวกัน (auto-inject ด้วย Python script, idempotent)
- **Tier-1 new mockups (2026-04-17)** — 4 หน้าใหม่ปิด gap critical:
  - **FI-13 Dual-Book / Entity Tag** ✅ NEW — Tag 1/2/3/novat allocation · ห้องหลัก+ห้องภาษี · ภพ.30 แยกบริษัท
  - **IA-Q BC Sync Monitor** ✅ NEW — Entity sync grid · Live feed · Error queue · Batch schedule
  - **PM-5 VAT Simulator** ✅ NEW — Golden Rule sandbox · ถูก vs ผิด side-by-side · Discount vs Rebate
  - **FI-Q Finance Queue** ✅ NEW — 6 queue cards (AR/AP/Tax/WHT/JV/Close) · Aging · SLA
- Portal Index v1.5 (ก่อนหน้า) → 60 หน้า + ของรอบนี้ 4 = 64 หน้า + FI-1Q (2026-04-19) = **66 หน้า**
- **CF-2.5 Tech Template** — 5 tabs (Job Type / Checklist / อุปกรณ์ / เวลา&ทักษะ / Safety) ✅
- **MD-2 Customer v3** — 6 details + split layout + sub-tabs ✅
- **MD-3 Vendor v3** — 6 details + Trade Agreement 4 sub-tabs ✅
- **MD-4 Employee v3** — 6 details + leave sub-tabs + KPI ✅
- **MD-5 Warehouse v3** — branch cards + 6 details + bin layout ✅
- **BC365 Audit** — ตรวจครบ 39 หน้า จัด 4 กลุ่ม ✅
- MD-1 v3 / CF-2 Hub / CF-2.6 / CF-2.7 / etc. — ✅ เสร็จก่อนหน้า

## Decisions Confirmed
- **CF-2 Structure**: Option C = Hub + sub-pages (ปรับหลัง audit)
- **CF-2.4 Bin Policy** → อยู่ CF-2 (เพราะเป็น config ไม่ใช่ transaction)
- **CF-2.5 Tech Template** → อยู่ CF-2 (🟢 BC ไม่มี — ทำเอง)
- **CF-2.7 Doc Template** → ทำเองใน Portal 100% (🟢 BC ไม่มี)
- **CF-2.9 General System Parameter** → เพิ่มเป็นข้อที่ 9 (global)
- **Date format** → ใช้ ค.ศ. (YY = 26) ไม่ใช่ พ.ศ.
- **Running reset** → ทุกเดือน (YYMM เปลี่ยน → running กลับ 0001)
- **หลักการ**: แยก Config (admin-only) ออกจาก Transaction (staff)

### BC365 Audit Decision (2026-04-16)
- 🔴 **ตัด 5 หน้า (ใช้ BC ตรง)**: CF-2.1 Tax, CF-2.2 Number Series, CF-2.3 Posting & GL, CF-2.4 Bin Policy, CF-2.9 General Parameter
  - เหตุผล: BC มี built-in ครบ, ทำ Portal ซ้ำ = double maintenance + sync risk
  - mockup ที่ทำแล้วเก็บเป็น reference "ตั้งค่าที่ BC หน้าไหน"
- 🟡 **18 หน้า Portal เป็น UI layer**: เรียก BC API, ไม่ duplicate logic
- 🟢 **21 หน้า Portal ทำเอง 100%**: BC ไม่มีฟังก์ชันนี้
- ⚠️ **เลื่อน Phase 2**: CL-1 Claims, SM-3 Vendor Portal, CF-2.8 Entity Tag

### BC365 Mapping — SV Phase 3 expansion (2026-04-27)
- 🟢 **SIR ใบประเมินหน้างาน** = Portal-owned 100% — BC ไม่มี Site Inspection Report concept · เป็น process ภายในของศูนย์บริการก่อน quote
- 🟢 **SQT ใบเสนอราคางานบริการ** = Portal-owned 100% — BC Service Quote มี (Service Module) แต่ Portal ทำเองเพราะ markup logic + customer confirmation flow ของ Sangwijit เป็น custom (มัดจำ 50% + Apply Queue + LINE delivery)
- 🟡 **CLM ใบเคลม Vendor** = UI layer + BC posting hybrid — Portal track Vendor claim status (async 7 days) + ตั้ง APCN ผ่าน BC API · APCN posting + GL effect = BC owns · CLM ≠ CL-1 (ลูกค้าเคลมเข้ามา · Phase 2 deferred) — CLM = post-warranty service ที่ Sangwijit เคลมต่อแบรนด์
- **ผลรวม:** Portal-owned 21 → 23 (+ SIR + SQT) · UI layer 18 → 19 (+ CLM)

## Blockers
- ❌ ไม่มี blocker ปัจจุบัน

## Next Action (Priority Order — หลัง Tier-1 build)
1. ~~CF-2.5 Tech Template~~ ✅
2. ~~MD-2/3/4/5 v3~~ ✅
3. ~~index.html + unified sidebar~~ ✅
4. ~~Tier-1 mockups (FI-13 / IA-Q / PM-5 / FI-Q)~~ ✅
5. ~~Tier-A 1+2 (Universal Doc Linker + Embedded Timeline 6 หน้า)~~ ✅ 2026-04-17
6. ~~Tier-A 3 (Cross-module Doc-Chain Breadcrumb)~~ ✅ 2026-04-17
7. ~~Tier-A 4 (Global Search palette + hotkey)~~ ✅ 2026-04-17
8. ~~Tier-A rollout — `swt-link.js` 65 หน้า~~ ✅ 2026-04-17
9. ~~Tier-B PO-2 RFQ + SL-F1 Credit Approval~~ ✅ 2026-04-17
10. ~~Customer QR + FI-1Q Apply Queue~~ ✅ 2026-04-19
11. ~~Sidebar rollout FI-1Q entry~~ ✅ 2026-04-19 (65 ไฟล์)
12. ~~Invoice QR ชั้น 2 (SL-3/SL-4)~~ ✅ 2026-04-19
13. **ขยาย Invoice QR** — ฝังบน SV-2 (บริการ), PO-3 (vendor invoice reverse? — optional)
14. **Tier-A rollout เพิ่ม** — ขยาย `swt-link.js` ไปอีก ~30 หน้า (แค่ใส่ `<script src>` 1 บรรทัด)
15. **Tier-B remaining**: FI-9 Fixed Asset (เฉพาะถ้า SWT มี FA — รอ confirm)
11. **Tier-C (polish/cleanup)**:
   - Deprecate / redirect portal-mockup-index.html → index.html
   - Banner "BC Direct" บน CF-2.1/2/9
   - Update 01-module-list.md ให้ SV-3/4/5 scope ตรงกับ mockup จริง
10. **Dev handoff prep** — สรุป spec, API contract, component list
11. ~~CF-2.1 Tax~~ / ~~CF-2.2 Number Series~~ / ~~CF-2.3 Posting~~ / ~~CF-2.4 Bin~~ / ~~CF-2.9 General~~ → ใช้ BC ตรง
12. ~~CF-2.8 Entity Tag~~ → เลื่อน Phase 2

## Reference Files
- `sangwijit-portal-skill/SKILL.md` v2.1 — knowledge base (Rule 1: อ่าน Flowchart ก่อน)
- `sangwijit-portal-skill/modules/CF_config.md` — spec CF-1 ถึง CF-9
- `md1-item-master-mockup-v3.html` — pattern อ้างอิงสำหรับ detail/tab
- `cf2-config-hub-mockup.html` — pattern landing Hub
- `cf2-7-doc-template-mockup.html` — pattern sub-page + multi-tab + split layout
- `swt-link.js` — universal doc-linker + `swtAppendTimeline()` API (Tier-A shared component)

## Design Standards (Locked)
- Min width 1440px · Inter font · Sidebar #1E3A5F (240px fixed) · Accent #2563EB · BG #F8FAFC
- Collapse: `<details class="collapse">` + `▼` rotation
- Sub-tabs: JavaScript `switchSubTab()` scoped per section
- Status badges: green=ยืนยัน / amber=พิจารณา / gray=ไม่แน่ใจ
