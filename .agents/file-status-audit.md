# File Status Audit — Sangwijit ERP Portal (2026-07-03 · master เดียว)

> **inventory ไฟล์ทั้ง repo: mockup + skill + docs + flow-html** — อะไรใช้อยู่ / ต้องอัพเดท / ไม่ใช้
> ยุบรวม `document-inventory.md` (branch-reconcile) เข้ามาที่ §D · แหล่ง: swt-sidebar.js + flow-workflow-map + active.md + งาน session 2026-07-03
> อัพเดทล่าสุด: WH renumber (เบิก=WH-2 · โอน=WH-3) + WH-2R/3R/4R/Q + SV grill (root canonical) + sidebar reconcile

## Legend
✅ current ใช้งานได้ · 🔧 มีหน้าแต่ต้องทำต่อ (backlog) · 📋 reference/cut-to-BC · ⏸️ defer P2/P3 · 🔴 gap ยังไม่มีหน้า · 📦 archived · ⚠️ stale ต้องอัพเดท · 🕳️ orphan/dead link รอตัดสิน

---

# ส่วนที่ 1 — MOCKUP (หน้าจอ)

## SL — งานขาย (✅ ครบ 7)
SL-Q · SL-1 · SL-2 · SL-3 · SL-4 · SL-CN · SL-F1 — ทั้งหมด ✅ (session: SL-CN grill · Bill/Ship-to · auto-expire · CN group)

## PO — จัดซื้อ (✅ 7 · 🔧 2)
PO-Q/1/3/4/6/PO-CN ✅ · **PO-7** ✅ (single-payment) · **PO-2** 🔧 (redo Vendor Commitment MOU/Sell-in/out/Co-op · ดู grill pending) · **PO-8** 🔧 (Deposit Pool)

## WH — คลัง (✅ ครบ 12 · 🔄 renumber+ใหม่วันนี้)
| รหัส | ไฟล์ | สถานะ |
|---|---|---|
| WH-Q | wh-q-dashboard | ✅ คิวรวมเดิม |
| **WH-Q1** | wh-q1-receive-queue | ✅ 🆕 kitchen rail (รับ: ซื้อ+โอน+คืน) |
| **WH-Q2** | wh-q2-issue-queue | ✅ 🆕 kitchen rail (จ่าย: เบิก+โอน+จอง) |
| WH-1 | wh1-receive | ✅ รับ |
| **WH-2** | wh2-issue | ✅ **เบิก** (rebuild วันนี้ · แฝด WH-3 · เบิกจริง+Serial+Post) |
| **WH-2R** | wh2r-issue-request | ✅ 🆕 ขอเบิก (reserve) |
| **WH-3** | wh3-transfer | ✅ **โอน** (owner · จำนวนที่ได้จริง) |
| **WH-3R** | wh3r-transfer-request | ✅ 🆕 ขอโอน |
| WH-4 | wh4-count | ✅ นับ (คิวนับเดิม) |
| **WH-4R** | wh4r-count-prep | ✅ 🆕 เตรียมนับ (freeze snapshot) |
| WH-R / WH-NM | wh-r-stock-card / wh-nm-non-move | ✅ report |

> 🔒 waterfall (ขาย→เบิก/โอน/ซื้อ) + kitchen rail model = spec `WH_warehouse.md` §WH-2/WH-Q · test case TC-1..10

## FI — การเงิน (✅ ส่วนใหญ่)
FI-Q/1/1Q/3/7/12 ✅ · **FI-2** 🔧 NEXT (จ่าย AP · ปิด chain procure-to-pay) · FI-4 🔧 (recode ชื่อ) · FI-5 🕳️ candidate archive · FI-13 ⏸️ · TR-1 ⏸️ · PO-6 ✅ (เมนู FI)

## CF — ตั้งค่า (✅ Portal · 📋 cut-to-BC บางตัว)
CF-1/2/2.2/2.5/2.6/2.7 ✅ (Portal owns) · CF-2.1/2.9 📋 cut-to-BC (reference)

## MD — Master (✅ 5 · 🔴 gap)
MD-1..5 (v3) ✅ · **MD-6 service-item-master** 🕳️ (sidebar ชี้ bc365 ตาย · ไม่มี root · ทะเบียนเครื่องซ่อม) · MD-7 Price List 🔴 gap

## SV — บริการ (✅ 12 · grill 2026-07-03 = root canonical)
> **grill ตัดสิน: ยึด root (by-function) · ไม่รื้อใหม่** · sidebar repoint แล้ว · enhancement = backlog B1-B14 (svc-claim-jobtype-spec §11)

SV-Q คิว · SV-1 intake · SV-2 มอบหมาย · SV-3 เบิกอะไหล่ · SV-Order สั่งนอกประกัน · SV-5 job card · SV-4 ปิดงาน/บิล · SV-6 ส่ง+ติดตั้ง · SV-7 ส่งคืน · SQT · SIR · CLM — ทั้งหมด ✅ current (🔧 backlog: B1 job type 5 · B4 billing 2 บิล · B5 parts return ฯลฯ)
component (ไม่ใช่เมนู): sv6-1-booking-modal · sv6-print-templates

## SC — Shared (✅)
SC-1/2/3/7 ✅ · **SC-10 map-picker** ✅ (component · ควรเพิ่มในกลุ่ม SC sidebar)

## Cross / อื่น
PM-5 ✅ · CM-1 ✅ · AP-1 ✅ · RP-1 ✅ · EX-1 ⏸️ · IA-Q ⏸️
non-nav (ถูกต้อง): _form-template · login · notification-center · user-profile · index

---

# ส่วนที่ 2 — 🕳️ ORPHAN / DEAD LINKS (sidebar ชี้ bc365 ที่หาย · รอตัดสิน)

> bc365/ folder หายทั้งชุด (design-system refactor ที่ revert) · sidebar group A แก้แล้ว 14 · เหลือ 6 orphan:

| รหัส | ปัญหา | ไฟล์ inspect ได้ | ทางเลือก |
|---|---|---|---|
| CL-1 · CL1F | claim=job type แล้ว (archived) | `_archive/cl1-claims-mockup.html` (07-02) | ลบจาก sidebar |
| PM-1 promotion | gap โปรโมชั่นฝั่งขาย | `_archive/sl6-promotion-setup-mockup.html` (สร้าง 04-19 · 17 commits) | grill+build |
| CF-3 payment-hub · CF-5 bank | ไม่มี root | — | stub / ลบ |
| MD-6 service-item | ไม่มี root | — | คู่กับ SV · build |

---

# ส่วนที่ 3 — SKILL / DOCS / FLOW-HTML

> **🗓️ Generation lens (user 2026-07-03): primary working set = มิย–กค · April (04-xx) = legacy ไม่ค่อยใช้**
> April tier archive ชัด: `sm-module-spec` · `service-overview` (+ `ui_design_pattern` ถ้าซ้ำ design-framework) · เก็บ-mark-legacy: `IA_integration` · `PM_promotion` (รอ grill) · `README/plan/research` (CLAUDE ยังชี้) · `sv6-print-templates` (component ยังใช้ · ไม่ตาม date)

## A. ✅ Current (ใช้อยู่ · อัพล่าสุด)
- **skill:** SKILL.md (07-03) · modules SL/PO/WH (07-03) · CF/FI/MD/SV_service/SV_knowhow (07-02/03)
- **state/spec:** active.md (07-03 · master) · svc-claim-jobtype-spec.md · WH_warehouse waterfall
- **flow-html:** flow-workflow-map.html (07-03 · 7 สาย กดได้) · flow-redundancy-analysis.html (audit 17/17)
- **topics:** design-framework · form-template-guideline · queue-dashboard-matrix · shared-components · sl-module-form-blueprints · wh-renumber-plan · po-wh-gap-kpi-matrix (07-02/03)
- CLAUDE.md (07-02)

## B. ⚠️ ต้องอัพเดท (relevant แต่ล้าสมัย)
| ไฟล์ | วันที่ | ทำอะไร |
|---|---|---|
| `modules/PM_promotion.md` | 04-19 | โปรโมชั่น = gap · รอ grill+rewrite |
| `README.md · plan.md · research.md` | 04-19 | foundational เก่า · phase/RBAC/API เปลี่ยน · CLAUDE.md ยังชี้ |
| `CONTEXT.md` | 06-07 | domain context (อ้าง ×1) · verify ผู้ใช้ |
| `ui_design_pattern_guideline.md` | 04-19 | ทับ design-framework/form-template-guideline · verify ยุบ |
| topics: `reconcile-mockup-vs-flow-matrix.md` | 06-07 | ⚠️ stale (เลข+ชื่อไฟล์ WH เก่า บรรทัด 77/106/109) + **superseded โดย file-status-audit** → archive candidate (ไม่ fix) |
| topics: `core-erp-flows · master-flows` | 06-07 | ✅ เช็คแล้ว **ไม่มีเลข WH เก่า** — เก็บได้ (อาจ sync SV grill ทีหลัง) |
| `modules/IA_integration.md` | 04-19 | thin · low-pri |

## C. 📦 ไม่ใช้ / archive
| ไฟล์ | สถานะ |
|---|---|
| `sm-module-spec.md` | ✅ **archived** 07-03 → `_archive/` |
| `service-overview.md` (topic) | ✅ **archived** 07-03 → `_archive/service-overview-topic.md` |
| `backup-storage-map.html` | ✅ **archived** 07-03 → `_archive/` |
| `document-inventory.md` | ✅ **archived** 07-03 → `_archive/` (ยุบเข้าไฟล์นี้แล้ว) |
| `_proposal/*.html` (17) | 📦 reference-only · **อยู่โฟลเดอร์แยกแล้ว (segregated)** · ปล่อยไว้ได้ |
| `ui_design_pattern_guideline.md` | ⚠️ **เก็บ** (SKILL.md อ้าง) · เนื้อ pattern ละเอียด · ยุบเข้า design-framework ทีหลัง |

## D. ไฟล์ซ้ำ (จาก document-inventory เดิม · ควรยุบ)
- `shared-components.md` + `-comparison.md` + `-fielddesign.md` (3 ไฟล์) → ตรวจซ้ำ ยุบเหลือ 1
- `file-status-audit.md` (นี้) ทับ `reconcile-mockup-vs-flow-matrix.md` (เก่า) → matrix = reference เก่า
- `flow-redundancy-analysis` .md + .html คู่กัน (เก็บ .html อ่าน · .md source)
- `document-inventory.md` → **ยุบเข้าไฟล์นี้แล้ว** (branch-reconcile ทำเสร็จ · ปลอดภัยบน GitHub ทุก branch)

---

# ส่วนที่ 4 — Archived (32+ ใน _archive/ · ยืนยันแล้ว)
session 07-02/03: sl5/sl6/sl7 · cl1-claims · wh2-pickingqueue · wh3-transfer-queue
ก่อนหน้า: po5 · fi3-tax-recon · sv2-invoice · sv4-warranty · sm1/2/3 · md old-versions · cf snapshots

# ส่วนที่ 5 — 🔴 Gaps (ยังไม่มีหน้า)
MD-7 Purchase Price List · PM promotion (ฝั่งขาย · setup/แคมเปญ) · SV backlog B12 MA contract · B13 tech-mobile · B14 posted-docs

---

## สรุปตัวเลข (2026-07-03)
- **✅ current mockup:** ~60 หน้า (SL 7 · PO 7 · WH 12 · FI 6 · CF 6 · MD 5 · SV 12 · SC 5 · cross 4)
- **🔧 ทำต่อ:** FI-2 (next) · PO-2 redo · PO-8 pool · SV backlog B1-B14
- **🕳️ orphan รอตัดสิน:** CL-1/CL1F · PM-1 · CF-3/CF-5 · MD-6 (6 จุด)
- **⚠️ docs ต้องอัพเดท:** PM_promotion · README/plan/research · core-erp/master-flows · CONTEXT · ui-guideline
- **📦 archive candidate:** sm-module-spec · _proposal/ (17) · backup-storage-map
- **📦 archived แล้ว:** 32+ ไฟล์
