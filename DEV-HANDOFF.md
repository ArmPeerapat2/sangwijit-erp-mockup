# 🚀 DEV HANDOFF — Sangwijit ERP Web Portal (Mockup)

> เอกสารปะหน้าสำหรับ **นักพัฒนา** ที่จะรับ mockup ไปพัฒนาต่อ · อ่านไฟล์นี้ก่อน แล้วค่อยเจาะตาม pointer

โปรเจกต์นี้คือ **Frontend mockup layer** (HTML/CSS/JS static · ไม่มี build system) ที่ออกแบบมาวางทับ **Microsoft Dynamics 365 Business Central (BC365)** · เป็นต้นแบบ UI + การตัดสินใจเชิงระบบ ให้ dev เอาไปทำของจริง (React/BC extension/API)

---

## 🚀 เริ่มที่นี่ (Quick Start)
1. **ดู UI ทั้งหมด:** เปิด `index.html` ในเบราว์เซอร์ (min-width 1440px) · sidebar เดียวทุกหน้า (`swt-sidebar.js`) · **ชุด build จริง ~62 หน้า** (ผ่าน consolidation 2026-07-12 — ดู §Consolidation ด้านล่าง)
2. **ไม่มี build:** เปิดไฟล์ `.html` ตรง ๆ · CSS/JS อยู่ inline หรือ shared `swt-*.js`
3. **ลำดับอ่าน:** ไฟล์นี้ → `README.md` (ภาพรวม/phase/RBAC) → `.claude/skills/sangwijit-portal/SKILL.md` (mental model) → spec แต่ละโมดูล → `.agents/active.md` (decision ล่าสุด)

---

## 🧠 Mental Model — กติกาที่ห้ามพลาด (อ่าน SKILL.md เต็ม)
- **Portal = UI only** — ไม่มี DB/posting/numbering เอง · **BC เป็นเจ้าของ record/posting/GL/number series** ทั้งหมด · พอร์ทัลเรียกผ่าน BC API
- **BC-owns vs Portal-owns** — accounting/master/config = BC (พอร์ทัลอ่าน dropdown) · UI/logic เฉพาะพอร์ทัล = พอร์ทัลถือ (ดู §shared components + `_reference/MasterData-3way-analysis.html`)
- **VAT Golden Rule** — ส่วนลดหักก่อน VAT เสมอ (multi-layer)
- **Rebate ≠ Discount** — rebate คืนหลังขาย · discount ลดก่อนขาย
- **Dual-Book** — ทุกเอกสารมี Entity Tag (นิติบุคคล) · โอนข้ามบริษัทไปห้องภาษี = BC multi-company (Phase 2 · CF-9)
- **Maker ≠ Checker** — ห้ามอนุมัติเอกสารตัวเอง · ทุกจุดอนุมัติ route ผ่าน **CF-2.6 Approval Matrix → AP-1 ศูนย์อนุมัติรวม**
- **Q = kitchen rail** — ทุกหน้า Q (คิว) = ครัวรับออเดอร์ · ทุก ticket โชว์อ้างอิงต้นทาง

## 🎨 Design Standards (locked)
- min-width 1440px · Inter/Noto Sans Thai · sidebar `#1E3A5F` 240px · accent `#2563EB` · bg `#F8FAFC`
- Thai-primary label + English code prefix (เช่น "SL-4 บิลขาย") · วันที่ **ค.ศ.** (YY=26) · เงิน comma + 2 ทศนิยม
- **2 design systems:** (a) **fit-100vh** form (`_form-template.html` · SL/PO/WH/MD · `body{height:100vh;overflow:hidden}`) — ห้ามใส่ scroll · (b) **content-wrapper scroll** (SV/PM) · **อย่าสลับ** (พังทั้งคู่)

---

## 🧩 Shared Components (reusable · `swt-*.js` · inject CSS เอง · state ต่อ instance · wire ผ่าน data-act)
| ไฟล์ | หน้าที่ | API |
|---|---|---|
| `swt-sidebar.js` | sidebar เดียวทุกหน้า + ปักหมุด/ย่อ | auto-render · `GROUPS`/`DONE[]` |
| `swt-patterns.js/.css` | CSS/JS กลาง (status strip · doc-chain · gate) | `swtRenderStatusStrip/DocChain/GateAlert` |
| `swt-doc-finder.js` | ค้นเอกสารเก่า + picker ลูกค้า/สินค้า | `dfOpen/dfOpenCust/dfOpenProd` |
| `swt-payment.js` | รับชำระเงิน (split · QR/บัตร+%ชาร์จ/โอน/เช็ค) | `swtOpenPayment(opts)` / `swtRenderPayment(el,opts)` |
| `swt-master-editor.js` | master editor (list-detail · schema-driven) | `swtRenderMasterEditor(el,{title,columns,fields,data})` |
| `swt-gallery.js` | รูป/วิดีโอสินค้า (master · public CDN) | `swtRenderGallery(el,{images,videos})` |
| `swt-attach.js` | เอกสารแนบ (transaction · private · version/audit/RBAC) | `swtRenderAttach(el,{docs,config})` |
| demo | `sc-payment-mockup.html` · `cf-master-settings-mockup.html` · `sc-media-demo-mockup.html` | เปิดดู component ตัวจริง |

## 🖼️ Media/File storage (สำคัญ — อย่าเก็บ binary ใน BC)
ไฟล์จริง → **Azure Blob** (public CDN=รูปสินค้า reuse เว็บ · private=เอกสาร) · BC/portal เก็บแค่ URL/reference · signed URL+RBAC สำหรับ private · ดู `_reference/MasterData-3way-analysis.html §media`

---

## 🔧 Custom API Backlog (งาน BC dev — standard API ไม่มี · verify แล้วกับ Microsoft Learn)
> รายละเอียด + ref: `_reference/MasterData-3way-analysis.html/.md`
- ทั้ง customer/vendor/item **create/update ผ่าน standard API v2.0 ได้เต็ม** · กลุ่ม/มิติ = `defaultDimensions` entity
- **ต้อง custom (table ext + custom API page ใหม่ · standard page extend ไม่ได้):**
  - **TaxBranch (สาขาภาษี)** — customer + vendor (Thai localization · โยง Dual-Book)
  - **หน่วย ratio (Qty per UoM)** — v2.0 ตัด unitConversion ออก
  - **Serial/Lot tracking API** — Item Tracking Code ไม่มี v2.0
  - คำนำหน้าไทย · PersonType(vendor) · costing method · ยี่ห้อ/รุ่น(หรือ dimension) · rebate · barcode ต่อหน่วย
- **"เครดิตวัน"** = Payment Terms (FK) ไม่ใช่ตัวเลข → แปลง · ก่อน implement ดึง `$metadata` ของ environment จริง

---

## 🧹 Consolidation 2026-07-12 (ลดจาก ~101 → ~62 หน้า build · decisions locked)

> เต็ม: `.agents/topics/consolidation-plan-2026-07.md` + `consolidation-review.html` (เทียบก่อน/หลัง + wireframe ทุกข้อ)

**กติกาอ่าน mockup หลัง consolidation:**
- หน้าใน `_archive/*-2026-07-12.html` = **ไม่ build** (ตาย/ซ้ำ/ย้ายบ้าน/cut ไป BC)
- หน้าที่มี **badge น้ำเงิน "🔧 DEV:" มุมล่างขวา** = build เป็น **โหมด/แท็บ/view ของหน้าอื่น** — mockup หน้านั้นคือ spec ของโหมดนั้น: `wh2r`/`wh3r` (โหมดใบขอของ WH-2/3 · เมนู/เลขเอกสารแยกเดิม) · `wh4r` (แท็บใน WH-4) · `sv5` (แท็บในหน้างาน Job · desktop กรอกได้เต็ม) · `sv7` (แท็บ 2 ใน SV-4 + gate ซาก) · `sv6` (view ปฏิทินใน SV-Q) · `ex1` (P1 = SWT เดี่ยว · multi-entity → P2)
- **cut ไป BC (ไม่ build):** fi3 กระทบยอดธนาคาร · tr1 treasury (BC native) · CF-2.1/2.3/2.4/2.9 — ⚠️ **CF-2.2 Number Series = Portal-managed** (ADR-0004 un-cut)
- **ย้ายบ้านแล้ว:** SLA + เช็คลิสต์ → `cf-master-settings` · สถานะธนาคาร → แท็บใน `cf-company-settings` · ค่าส่วนตัว → `user-profile` ที่เดียว · จ่ายค่าแรงช่าง → `cm1` section บริการ · รายงานขาย → `rp1` · ตั้งค่า approval → CF-2.6 เท่านั้น (ap1 = runtime)
- **sc1/sc2/sc3 = runtime component จริง** (iframe จาก `swt-doc-finder.js`) — build เป็น modal component · หน้า sc-* อื่น = demo/reference

**📋 Status Lifecycle (ผัง step × บทบาท × สถานะ × surface):** `flow-all-status.html` (แท็บเดียวรวม SV/WH/SL/PO/FI + ศัพท์ย่อ) · ต้นแบบฟอร์แมต = `service.pdf` · แต่ละไฟล์มี edge cases (void/reverse/พิมพ์ซ้ำ) + คำถาม 💬 ที่รอ Peerapat เคาะ

**🗂️ MD ทะเบียนหลัก — state สั้น (ไม่มี flow เดินเอกสาร · ไม่ต้องทำผังแยก):**
> `Draft (ร่าง)` → `รอตรวจ/KYC` (ลูกค้า/vendor: ยืนยันเลขภาษี+บัญชีธนาคารก่อนใช้) → `Active (ใช้งาน)` → `Blocked (ระงับ · ห้ามเปิดเอกสารใหม่ + เหตุผล)` → `Inactive (ปิด · soft-delete ไม่ลบจริง)` · ทุก master ใช้ pattern นี้ (MD-1..5) · สถานะจริง BC เป็นเจ้าของ · portal แสดง badge + ปุ่มเปลี่ยนสถานะตามสิทธิ์

---

## 🗂️ เอกสารสำคัญ (อ่านตามนี้)
| หัวข้อ | ไฟล์ |
|---|---|
| ภาพรวม · phase · RBAC · API list | `README.md` |
| mental model · cross-module rules | `.claude/skills/sangwijit-portal/SKILL.md` |
| spec ต่อโมดูล (SL/PO/WH/FI/SV/PM/MD/CF/IA) | `.claude/skills/sangwijit-portal/modules/*.md` |
| **decision ล่าสุด + session log** | `.agents/active.md` |
| flow map (6 สายหลัก · กดเปิดหน้าได้) | `.agents/flow-workflow-map.html` |
| master data field list + BC API เทียบ | `_reference/MasterData-fields.md` · `MasterData-3way-analysis.html` |
| catalog config (จาก ERP เดิม) | `_reference/ConfigMasterData-catalog.md` · `MenuStructure/` · `SystemDefaults/` |
| convention การตั้งชื่อไฟล์ | `<module><n>-<slug>-mockup[-v<N>].html` (module: sl/po/wh/fi/sv/pm/md/cf/ia/sc) |

## 📊 สถานะ / Phase
- **Phase 1 (mockup ครบ):** SL · PO · WH(+WH-5 ปรับสต็อก) · FI · SV(claim=job type) · PM · MD(1-3) · CF(config/master/bank) · shared components 7 ตัว
- **Phase 2 (design + spec ไว้ · ยังไม่ build):** Entity Tag/Dual-Book โอนข้ามบริษัท (CF-9) · SM-3 vendor portal · CL-1 claims · bank outbound payment API
- **cut (ใช้ BC ตรง · mockup เป็น reference):** CF-2.1/2.2/2.3/2.4/2.9 (tax·number series·posting·bin·general param)

---
> ทุก decision มี audit ใน `.agents/active.md` (session log ตามวันที่) · ถ้าสงสัยว่าทำไมออกแบบแบบนี้ → หาใน active.md ก่อน
