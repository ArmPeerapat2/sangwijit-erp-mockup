# Master Flows — นิยามฉบับตัดสินแล้ว (docs-first)

> ทำทีละ flow ให้เสร็จระดับ design ก่อน (HTML = reference, ทำ/ขึ้น canvas ทีหลัง).
> อ้างอิง: `Flow Design/Master/*.pdf` + `sangwijit-portal-skill/modules/MD_master.md` + `_reference/docs/5 dd_..._phase4.docx` (รหัส MC-) + component framework (`1 component_fw_clean.docx`).
> หลัก: Portal = UI · BC365 เป็นเจ้าของ master + Update Data ผ่าน API.

---

## MD-1 / MC-1 — Item Master (สินค้า) — ✅ ตัดสิน 2026-05-30

**เอกสารอ้างอิง:** `Master - Item.pdf` · MD_master MD-1 · DD phase4 MC-1 (entity `items`) · BC `Item (27)`
**หน้าเดิม:** `md1-item-master-mockup-v3.html` (19 sections · over-scoped)

**Purpose:** ทะเบียนสินค้า — ศูนย์กลางอ้างอิงทุกโมดูล (ขาย/ซื้อ/คลัง/บริการ). master ล้วน ไม่ปนราคา/rebate/stock.

**Users (RBAC · CF-1):** สร้าง/แก้ = Warehouse Mgr · Inventory Mgr · Admin · ต้นทุน (Cost) เห็น/แก้เฉพาะ Finance Mgr + Admin (ซ่อนจาก Sales) · Lead Time เห็นเฉพาะ Procurement.

**Status flow (ตาม Master-Item.pdf):** New/Draft → ระบุข้อมูลสำคัญ → `Block=No` → **Active** ⇄ `Block=Yes` (ใช้ไม่ได้) → Inactive (archive · ห้ามลบ). ทุกการเปลี่ยน = Update Data → BC.

**Shared components (framework):** ItemSearch (เวลาถูกอ้างจากหน้าอื่น) · Timeline (SC-7) · Serial · doc-mode: create/edit/view.

### โครงใหม่ (lean) — เก็บ + เพิ่ม
1. **รหัส & ชื่อ** (code · EN/TH) + **Item Type** (Inventory/Service/Fixed Asset) + **Active/Block toggle**
2. **หมวดหมู่** + **Posting Group** + **Tax Category** (config · read-only non-admin)
3. **หน่วยนับ Multi-UOM** (base + alt)
4. **Barcode** + **Serial Tracking flag** (serial=Yes → barcode required)
5. **Reorder**: Point/Qty + **Lead Time** + **ผู้จำหน่ายหลัก** (Supplier primary · 1 field)
6. **คลัง/Location ตั้งต้น**
7. **คุณลักษณะ**: Manufacturer · Country of Origin · Weight · Dimension · Warranty Period · Effective From/To
8. **รูปสินค้า** + **ไฟล์ Spec/เอกสาร**
9. **อ้างอิง read-only**: ต้นทุน FIFO (Finance · 1 ค่า) · สต็อก real-time ทุกสาขา (→ ลิงก์ WH-R) · การเคลื่อนไหว (item ledger · ลิงก์)
10. **ประวัติการแก้ไข** (SC-7 timeline)

### ย้ายออกจาก Item (ไม่ใช่ master สินค้า)
- Standard Price (10 Tier) · Override Prices · ประวัติเปลี่ยนราคา · ประวัติกำหนดราคา → **MD-6 Sales Price List**
- Rebate Group · Vendor Commitment → **Trade Agreement (transaction · Purchase module)** — ไม่ผูกใน master (vendor แค่ลิงก์ดู)
- SRP & Channel Benchmark → **PM (Promotion/market)**

**ผลลัพธ์:** จาก 19 sections (master+pricing+rebate+stock+market ปน) → master ล้วน ~10 ส่วน · pricing/rebate/stock แยกไปเจ้าของจริง

**ค้าง:** rebuild HTML md1 ตามนิยามนี้ (ทำเมื่อสั่ง · ขึ้น canvas ให้ดู interface)

---

## MD-2 / MC-2 — Customer Master (ลูกค้า/ลูกหนี้) — ✅ ตัดสิน 2026-05-30

**เอกสารอ้างอิง:** `Master - Customer.pdf` · MD_master MD-2 · DD phase4 MC-2 (entity `customers`) · BC `Customer (18)` + `Contact` + `Ship-to Address`
**หน้าเดิม:** `md2-customer-master-mockup-v3.html` (split + sub-tabs)

**Purpose:** ทะเบียนลูกค้า/ลูกหนี้ — KYC + เครดิต + ที่อยู่ + จัดกลุ่มขาย. Portal=UI, BC owns. Status เปลี่ยน → Update Data ไป BC.
**Users (CF-1):** สร้าง/แก้ = Sales · Sales Mgr · Admin · 🔒 Tax ID / Credit Limit / Bank / เลขบัตร ซ่อนจาก Salesperson.
**Status (ตาม Master-Customer.pdf):** New(Draft) → ใส่ข้อมูลสำคัญ (เช่น Credit Limit) → `Block=ว่าง` → **Active** ⇄ `Block All` (เปิดบิลใหม่ไม่ได้) → Inactive (archive · ห้ามลบ).
**Shared components:** **CustomerSearch** (หน้านี้คือต้นทาง) · Payment(terms) · Timeline(SC-7) · doc-mode create/edit/view.

### โครงสร้าง (6 ส่วน)
**1. ระบุตัวตน & KYC**
- 1A core: Customer No.(unique) · ชื่อ TH/EN · ประเภท(บุคคล/นิติ/ราชการ/มูลนิธิ) · 🔒Tax ID(13,unique) · ประเภทบัตร + 🔒เลขบัตร + วันหมดอายุ · วันเกิด/ทะเบียนพาณิชย์ · กลุ่มธุรกิจ
- 1A+ **➕ สร้างจากบัตร ปชช.**: อ่าน/สแกนบัตร → prefill + เช็กประวัติเลขบัตร (กันซ้ำ) · *Portal-custom*
- 1B **➕ ผู้ติดต่อ (หลายคน/ร้าน · ตาราง)**: ชื่อ · ตำแหน่ง(เจ้าของ/จัดซื้อ/การเงิน) · โทร/อีเมล/LINE · ☑ผู้ติดต่อหลัก → map BC Contact
- 1C **➕ การจัดกลุ่ม (หลายมิติ)**: โซนขาย(Zone) · กลุ่มเซล(Sales Team) · ข้อมูลอ้างอิง(Reference) · กลุ่มการขายย่อย 3-4 ชั้น → Dimension/Salesperson + Portal-custom hierarchy

**2. ที่อยู่ (Address Book · เพิ่มได้ >1 + default)**
- ตาราง: ประเภท(Billing/Delivery/Tax Invoice) · ที่อยู่+ปณ.+จังหวัด · ☑Default ต่อประเภท
- บังคับมี Tax Invoice address ≥1 (กฎหมาย) → map BC Ship-to (หลายอัน), default flag = Portal

**3. เงื่อนไขการค้า & เครดิต**
- 🔒Credit Limit(=0→COD · เพิ่ม>10% ต้อง Sales Mgr อนุมัติ) · สกุลเงิน · Price Group(→MD-6) · Discount Group · เงื่อนไขชำระ(Net30/COD/Advance) · วิธีชำระตั้งต้น · 🔒บัญชีคืนเงิน
- **➕ ประวัติปรับวงเงิน (Credit Limit History · read-only)**: วันที่ · จาก→เป็น · ผู้ขอ · ผู้อนุมัติ · เหตุผล · *Portal-custom (จาก Change Log)*

**4. ภาษี & PDPA/Marketing**: อีเมลหลัก/รอง · โทร/แฟกซ์ · รหัสยกเว้นภาษี · 🔒WHT Applicable+Rate · Marketing/Data Sharing Consent · ภาษาเอกสาร · CRM ID

**5. สถานะ & Block**: Block toggle + เหตุผล (ดู Status ด้านบน)

**6. อ้างอิง read-only**: AR ค้าง+Aging → FI-1/FI-6 · ประวัติซื้อ → SL · ประวัติแก้ไข → SC-7

### ลีน — ย้ายออกจาก master
- Special Pricing (sub-tabs) → MD-6 Price List / PM (เก็บแค่ Price Group + Discount Group)
- Purchase History chart / CRM pipeline → SL-5 CRM (read-only)

### Portal-custom (เกินมาตรฐาน BC · ต้องบันทึกใน component/spec)
- สร้างจากบัตร ปชช. · กลุ่มการขายย่อย 3-4 ชั้น · Credit Limit History view

**ค้าง:** rebuild HTML md2 ตามนิยามนี้ (ทำเมื่อสั่ง · ขึ้น canvas)

---

## MD-3 / MC-3 — Vendor Master (เจ้าหนี้/ผู้ขาย) — ✅ ตัดสิน 2026-05-30

**เอกสารอ้างอิง:** `Master - Vendor.pdf` · MD_master MD-3 · DD phase4 MC-3 (entity `vendors`) · BC `Vendor (23)` + `Vendor Bank Account` · knowhow `sangwijit-purchasing`
**หน้าเดิม:** `md3-vendor-master-mockup-v3.html` (มี Trade Agreement 4 sub-tabs ฝังใน master → **ผิด, ต้องแยกเป็น transaction**)

**Purpose:** ทะเบียนผู้ขาย/เจ้าหนี้ — ตัวตน + การเงิน + เงื่อนไขจัดส่ง + เรตติ้ง. Portal=UI, BC owns.
**Users (CF-1):** สร้าง/แก้ = Procurement Mgr · Admin · 🔒 ข้อมูลธนาคาร = Finance เท่านั้น · เปลี่ยนบัญชี → Procurement+Finance อนุมัติ.
**Status (ตาม Master-Vendor.pdf):** New(Draft) → ใส่ข้อมูลสำคัญ → `Block=ว่าง` → **Active** ⇄ `Block All` (สร้าง PO ใหม่ไม่ได้) → Inactive. *(flow PDF เขียน "Credit Limit" ติดมาจาก template ลูกค้า — vendor ไม่มี credit limit)*
**Shared components:** Timeline(SC-7) · vendor ถูกอ้างผ่าน vendor-search ในหน้า PO/FI.

### โครงสร้าง (5 ส่วน)
1. **ระบุตัวตน & ติดต่อ** — Vendor No(unique) · ชื่อ TH/EN · ประเภท(Direct/Distributor/Service) · 🔒Tax ID · Website · ➕ผู้ติดต่อหลายคน (BC Contact) · กลุ่ม/Specialty (Default Item Category)
2. **ที่อยู่ & จัดส่ง** — Address Book (>1 + default) · ประเทศ · Delivery Lead Time · Min Order Value
3. **การเงิน & ภาษี 🔒(Finance)** — ธนาคาร/เลขบัญชี/ชื่อบัญชี/SWIFT (ชื่อต้องตรง vendor) · Payment Terms · สกุลเงิน · WHT Applicable+Category (align CF-2.1) · ยกเว้นภาษี · **Documents Verified + วันที่ (gate ก่อนจ่ายครั้งแรก)**
4. **จัดประเภท & ประเมิน** — Vendor Rating A/B/C/D (A=preferred RFQ · C/D=อนุมัติพิเศษ) · Preferred · Certifications · Block/Active + เหตุผล
5. **อ้างอิง read-only** — **Trade Agreement ที่ active → ลิงก์ไป transaction** (ไม่ฝังใน master) · AP ค้าง→FI-2 · ประวัติ PO→PO · Accrual→PO-7 · ประวัติแก้ไข→SC-7

### แยกออกเป็น transaction (นิยามตอนทำกลุ่ม Purchase)
- **Trade Agreement** = ธุรกรรม Portal-custom · Rebate/MDF/Co-op/Volume/Penalty · 1 record/type · multi-VC ต่อ item · `VC-{TYPE}-{YYMM}-{seq}` · มี approval + lifecycle · ผูก vendor (FK) **ไม่ฝังใน vendor master**

### Portal-custom สะสม
- multi-contact · Address Book default · (Trade Agreement = transaction แยก)

**ค้าง:** rebuild HTML md3 — ถอด Trade Agreement ออกเป็นหน้า transaction แยก (ทำเมื่อสั่ง)

---

## MD-4 — Employee Master (พนักงาน) — ✅ ตัดสิน 2026-05-31

**อ้างอิง:** `Master - Employee.pdf` · `MD_master.md` MD-4 · BC `Employee (5200)` · knowhow `sangwijit-hr` · RBAC ดู ADR-0003
**Status:** New(Draft) → ใส่ข้อมูลสำคัญ → Block=No → **Active** ⇄ Block=Yes → Inactive · **Users:** HR Mgr · Dept Mgr (ลูกทีม) · Admin

### สร้างพนักงาน (lean)
| ฟิลด์ | คำอธิบาย |
|---|---|
| ข้อมูลติดต่อ | ชื่อ-สกุล · email · โทร |
| รหัส user / password | credential login (ผูก user account) |
| สาขา (Branch) | ผูก MD-5 · 1 สาขา |
| แผนก (Department) | 1 แผนก |
| วงเงินที่เกี่ยวข้อง | เพดานอำนาจอนุมัติ/ส่วนลด (ผูก CF-2.6) |
| บทบาทที่มอบหมาย | เลือก Position · **1 บทบาทเท่านั้น** |
| สถานะ | Active/Block + Hire/Termination |

- salesperson→ต้องมี Sales Territory · ช่าง→ต้องมี Skill — ผูกตาม Position
- ย้ายออก (ระบบ HR `sangwijit-hr`): Compensation/Payroll · Leave · KPI · Training (read-only ref)

**ค้าง:** rebuild HTML md4

---

## CF-1 (redesign) — RBAC / Position (โมดูลแยก) — ✅ ตัดสิน 2026-05-31 · ADR-0003

> เปลี่ยนจาก spec CF-3 "9 roles ตายตัว × 28 functions" → **Position สร้างเองได้** (configurable)

**ลำดับ:** สร้าง Position → กำหนดสิทธิ์ → assign พนักงาน 1:1 Position
- **Scope:** Branch + Department (เห็น/ทำเฉพาะสาขา+กลุ่มงานตน)
- **Permission list:** CRUD (ดู/เพิ่ม/แก้ไข/ลบ) **ราย "หน้า" (per-page)** ครอบทุกหน้าพอร์ทัล
- **วงเงิน (Authority Limit):** เพดานอนุมัติ/ส่วนลด → CF-2.6 Approval tier
- Maker≠Checker คงไว้ผ่าน CF-2.6

**ค้าง:** สร้างหน้า CF Position/RBAC (สร้าง Position + permission list per-page) · เขียน spec CF_config CF-3 ใหม่

---

## MD-5 — Location & Warehouse (สาขา/คลัง) — ✅ ตัดสิน 2026-05-31

**อ้างอิง:** `Master - Location and Bin.pdf` · `MD_master.md` MD-5 · BC `Location (14)` + Warehouse + Bin · Bin Policy = CF-2.4 (cut-to-BC)
**Scope:** SWT บริษัทเดียว (ตัด multi-entity) · ความสัมพันธ์ Branch 1:N Warehouse 1:N Bin
**Status:** Active/Inactive (flow ไม่มี Block lifecycle · แค่ create + Update Data) · **Users:** Operations Mgr · Branch Mgr · Admin

### 1. Branch (สาขา) — ตัด field นิติบุคคล (ทั้งหมด SWT)
Branch Code · ชื่อ TH/EN · ที่อยู่+ปณ.+จังหวัด · โทร/อีเมล · ผู้จัดการ(MD-4) · ประเภท(HQ/Sales/WH/Service) · ภูมิภาค · Active

### 2. Warehouse (คลัง)
Code · ชื่อ · Parent Branch · ผู้จัดการ(MD-4) · ประเภท(Central/Regional/Hub/Spoke) · Bin Policy Enabled+Code(→CF-2.4) · ความถี่นับสต็อก · Max Capacity · Active

### 3. Bin
Bin Code (Zone-Row-Bin) · Zone(Incoming/Storage/Picking/Shipping) · สังกัด Warehouse · (Policy FIFO/picking → CF-2.4 cut-to-BC)

### ลีน / read-only
- Bin Policy → CF-2.4 (BC) · Stock Summary ต่อคลัง → read-only จาก WH (WH-R)

**ค้าง:** rebuild HTML md5

---

## 🔑 Decision system-wide — SWT single-entity (ตัดสิน 2026-05-31)
**ระบบกลางทำเพื่อ SWT (แสงวิจิตรเทรดดิ้ง) บริษัทเดียว** · ตัด multi-entity ทั้งระบบ:
- Branch master ไม่มี field นิติบุคคล (ทุกสาขา = SWT)
- **FI-13 Dual-Book / CF-2.8 Entity Tag** (Tag 1/2/3/novat · ห้องภาษีหลายบริษัท) → **defer / นอก scope ปัจจุบัน**
- **FI-7 VAT report** selector นิติบุคคล (4 บริษัท) → **เหลือ SWT** (note ไว้แก้ตอน rebuild)
- reference "4 นิติบุคคล (SWT/SWE/VMN/WPS)" ทุกที่ → SWT

---

## MD-6 / MD-7 — Price List (Sales/Purchase) — ⏸️ DEFER (ตัดสิน 2026-05-31)
ไม่ใช่ core ERP หลัก → **ข้ามไปก่อน** (มี flow `Master - Sales/Purchase Price List.pdf` รองรับ · กลับมาทำทีหลัง). pricing ที่ย้ายมาจาก Item (10-tier/override) + Customer (special pricing) รอ master นี้.

**Master phase: 5/7 ทำแล้ว (Item·Customer·Vendor·Employee·Location) + RBAC · MD-6/7 defer → ย้ายไปทำ Finance (FI-7) ต่อ**

---

## 🔑 Priority — Core ERP first (2026-05-31)
**ส่วนเสริม (defer · ทำทีหลัง):** FI-7/FI-12 (tax VAT/WHT) · FI-13 Dual-Book / การโอนเข้าห้องภาษี (single-entity ไม่ต้องแยก) · MD-6/7 Price List
- FI-7 selector ไม่ trim ตอนนี้ — leave as-is
**ทำก่อน = Core ERP transaction flows:** วงจรขาย (Sales) · วงจรซื้อ (Purchase) · คลัง/สต็อก (Inventory) · รับ-จ่ายเงิน (AR/AP FI-1/FI-2)
- Master 5/7 (Item·Customer·Vendor·Employee·Location) + RBAC พร้อม feed core แล้ว
