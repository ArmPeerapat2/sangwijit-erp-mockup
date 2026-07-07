# 🚀 DEV HANDOFF — Sangwijit ERP Web Portal (Mockup)

> เอกสารปะหน้าสำหรับ **นักพัฒนา** ที่จะรับ mockup ไปพัฒนาต่อ · อ่านไฟล์นี้ก่อน แล้วค่อยเจาะตาม pointer

โปรเจกต์นี้คือ **Frontend mockup layer** (HTML/CSS/JS static · ไม่มี build system) ที่ออกแบบมาวางทับ **Microsoft Dynamics 365 Business Central (BC365)** · เป็นต้นแบบ UI + การตัดสินใจเชิงระบบ ให้ dev เอาไปทำของจริง (React/BC extension/API)

---

## 🚀 เริ่มที่นี่ (Quick Start)
1. **ดู UI ทั้งหมด:** เปิด `index.html` ในเบราว์เซอร์ (min-width 1440px) → ลิงก์ทุกหน้า (101 mockup) · sidebar เดียวทุกหน้า (`swt-sidebar.js`)
2. **ไม่มี build:** เปิดไฟล์ `.html` ตรง ๆ · CSS/JS อยู่ inline หรือ shared `swt-*.js`
3. **ลำดับอ่าน:** ไฟล์นี้ → `README.md` (ภาพรวม/phase/RBAC) → `sangwijit-portal-skill/SKILL.md` (mental model) → spec แต่ละโมดูล → `.agents/active.md` (decision ล่าสุด)

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

## 🗂️ เอกสารสำคัญ (อ่านตามนี้)
| หัวข้อ | ไฟล์ |
|---|---|
| ภาพรวม · phase · RBAC · API list | `README.md` |
| mental model · cross-module rules | `sangwijit-portal-skill/SKILL.md` |
| spec ต่อโมดูล (SL/PO/WH/FI/SV/PM/MD/CF/IA) | `sangwijit-portal-skill/modules/*.md` |
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
