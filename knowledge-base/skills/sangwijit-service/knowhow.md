# SV Service & Delivery — Business Knowhow

> **Source:** สรุปจากประชุม + Q&A (2026-04-22)
> **Scope:** Service (ซ่อม) + Delivery & Installation + Claim (เคลม Vendor)
> **ใช้ควบคู่กับ:** `SV_service.md` (spec) + `CF_config.md` (CF-2.5 Template)

---

## 🗺️ สารบัญ

1. [ภาพรวม 2 กระบวนการ](#ภาพรวม) — Service (ซ่อม) + Delivery & Install
2. [กระบวนการ Service 5 Steps](#service-5-process)
3. [กระบวนการ Delivery & Install](#delivery-install)
4. [Multi-role Vendor (AR + AP)](#multi-role-vendor)
5. [Business Rules Reference](#business-rules)
6. [Design Implications](#design-implications)
7. [Mockup Mapping & Gaps](#mockup-mapping)

---

<a id="ภาพรวม"></a>
## 1. ภาพรวม

**Service Module ครอบคลุม 3 กระแส:**

```
A. ซ่อม (Service)           ลูกค้าเอาเครื่องมาซ่อม / ช่างไปซ่อมที่บ้าน
B. ติดตั้ง/จัดส่ง (Install)   ลูกค้าซื้อสินค้าใหม่ → ติดตั้ง/ส่งที่บ้าน
C. เคลม (Claim)             ส่งคืน Vendor / Credit Note
```

**หลักการ:** Delivery + Install กระบวนการคล้ายกัน ~100% → ใช้ workflow เดียวกัน
- **เหตุผล:** ต้องการ track ช่าง + สต็อก + ค่าแรง แบบเดียวกับงานซ่อม
- **ไม่ใช่:** Sales Order ธรรมดาที่แค่ส่งของ

---

<a id="service-5-process"></a>
## 2. กระบวนการ Service 5 Steps

### 2.1 รับเรื่อง & ตรวจสอบ (Receiving & Inspection)

**Workflow:**
- รับสินค้า/ใบแจ้งซ่อม → ออก "ใบรับซ่อม" / "ใบจ๊อบ"
- ตรวจเงื่อนไขประกัน — เช็คกับ Vendor ก่อนยืนยัน

**Fields:**
- Customer, Product code, Brand, อาการเสีย
- Warranty status: ในประกัน / นอกประกัน / เคลม Vendor

### 2.2 ประเมิน & แจ้งเคลม (Assessment & Vendor Notification)

**Workflow:**
- ในประกัน → ส่งเรื่องแจ้ง Vendor → Vendor เปิดจ๊อบงานเคลม → **ได้ Vendor Job Ref**
- **จุดสำคัญ:** ประกันแยก**ต่อชิ้นส่วน** (Part-level warranty)
  - เช่น แอร์: คอมเพรสเซอร์ 5 ปี, PCB 1 ปี
- Coverage Flags (กึ่ง manual):
  - ฟรีค่าแรง
  - ฟรีอะไหล่
  - ฟรีค่าเดินทาง
  - ฟรีทั้งหมด

**Fields:**
- Part Warranty Terms (ต่อชิ้นส่วน — อยู่ใน MD-1 Item Master BOM)
- Coverage Conditions (checkboxes)
- Vendor Job Reference (เลข ID ฝั่ง Vendor)

### 2.3 มอบหมายงานช่าง (Task Assignment)

**Technician Type 2 ประเภท:**

| ประเภท | ผลตอบแทน | Reference | ตั้งหนี้ |
|---|---|---|---|
| **Internal** (ช่างภายใน) | Incentive | MD-4 Employee | Payroll |
| **Outsource** (ช่างนอก) | ค่าแรง | MD-3 Vendor (sub-type: outsource) | AP + WHT 3% |

**กติกา Sticky:**
- ช่างรับงานแล้ว **ส่งต่อเองไม่ได้**
- **Admin-only** มีสิทธิ์ re-assign
- งานที่ไม่เสร็จอยู่ status "ค้างส่ง" จนจบ

### 2.4 ปิดงาน & จัดการอะไหล่ (Job Closing & Inventory)

**Job Status 2 ระดับ:**
- ปิดงานช่าง (เพื่อคิดเงิน)
- ปิดงานลูกค้า (เพื่อส่งมอบ)

**Return Parts — 2 กรณี:**
1. **ร้านซื้ออะไหล่เอง:** ซ่อมเสร็จ → ส่งของเสียให้ Vendor → Vendor กดรับ → ตัดหนี้ AP
2. **Vendor ส่งอะไหล่มา:** เปลี่ยนเสร็จ → ส่งของเสียคืน

**Status Flow:**
```
ถอดจากเครื่อง → จัดส่งคืน → Vendor รับ → ตัดหนี้ AP
```

### 2.5 ตั้งหนี้ & บัญชี (Billing & Accounting)

**งานนอกประกัน:** เก็บเงินลูกค้าทั้งหมด (customer AR)

**งานในประกัน:** Vendor = **ลูกหนี้เรา (AR)** → เราตั้งหนี้เบิก Vendor
- ฝ่าย Service กรอกค่าใช้จ่าย (ค่าแรง / ค่าอะไหล่ / ค่าเดินทาง)
- ฝ่ายบัญชีตั้งหนี้ขอเบิกคืนจาก Vendor

**Line Type ในบิล:**
- **Part** (อะไหล่) — ตัดสต็อก + คิดเงิน
- **Service** (ค่าแรง) — ไม่ตัดสต็อก · **มี 2 ขา** (รับเงินลูกค้า/Vendor + จ่ายเงินช่าง)
- **Travel** (ค่าเดินทาง) — ไม่ตัดสต็อก

**Per-line "Charge to":**
- บิลเดียวอาจมี line บางรายการเก็บจากลูกค้า + บางรายการเก็บจาก Vendor
- เช่น ในประกัน: อะไหล่→Vendor · ค่าแรง→ลูกค้า · เดินทาง→ลูกค้า
- UI: แต่ละ line มี toggle/radio ระบุ

---

<a id="delivery-install"></a>
## 3. กระบวนการ Delivery & Install

### 3.1 การเปิดบิล (Invoice Opening)

**Invoice Structure (ตัวอย่าง แอร์ + ติดตั้ง):**
```
[1] สินค้า: แอร์ Mitsu 12k BTU × 2       = ฿24,000  ← แสดงราคา
[2] ค่าติดตั้ง (Installation): 9k-12k × 2 = ฿ 6,000  ← แสดงราคา
                              รวม ฿30,000
```

**Pattern:** ค่าติดตั้ง = **สินค้าชุด (Bundle)**
- เลือก Job Type → ระบบ **gen line + attached parts** อัตโนมัติ
- Parent line (ราคา) แสดงให้ลูกค้า
- Child parts (ท่อ, ขายึด, ฉนวน, น้ำยา) **ไม่มีราคา** — เห็นรายการแต่ไม่เห็นยอด

### 3.2 Installation = Job Type (CF-2.5)

**Source of truth:** CF-2.5 Tech Template
- Job Type × Product Category matrix
- เช่น `INS-AC-9k12k` = 2.5 ชม. / ฿800 (ค่าแรงช่าง)
- แต่ขายลูกค้า ฿3,000/ชุด (Gross margin ~฿2,200)

**Tab structure ใน CF-2.5:**
1. Job Type × Product Category rate (มีอยู่แล้ว)
2. **Install BOM** per Job Type — list อุปกรณ์มาตรฐาน 🆕
3. **Tech rate override** per ช่าง/พื้นที่ 🆕

### 3.3 Pricing — ไม่คงที่

**Standard rates** ใช้เป็นเริ่มต้น
- **ต่างจังหวัด / ช่างพิเศษ** ปรับได้ → ตกลงครั้งแรก → lock ไว้จนกว่าจะ renegotiate
- Override เก็บที่ `md3_vendor_rate` หรือ `md4_employee_rate` (per-entity)

**Dual Pricing (2 ตัวเลขแยก):**

| ฝั่ง | แสดง | เก็บที่ |
|---|---|---|
| **ลูกค้า ↔ เรา** | Invoice visible | `sellPrice` |
| **เรา ↔ ช่าง** | **ซ่อนจากลูกค้า** · อยู่ในสัญญาช่าง | `techCost` (separate field) |

### 3.4 ช่างใน vs ช่างนอก (ติดตั้ง)

| กรณี | ใครเบิกอุปกรณ์ | บัญชี |
|---|---|---|
| **ช่างใน** | เบิก WH → ตัดสต็อก Parts | Incentive/payroll |
| **ช่างนอก (รับเหมา)** | **ช่างมีอุปกรณ์เอง** → อุปกรณ์รวมในค่าแรง | AP + WHT 3% |

**Flag in SV-6 Job:**
- `issue_parts = true` เมื่อช่างใน → trigger WH issue
- `issue_parts = false` เมื่อช่างนอก → skip WH issue

### 3.5 Stock Reservation (กันสต็อก)

**Rule:** เปิดบิลแล้ว → ล็อกสต็อกทันที **รวมอุปกรณ์ติดตั้ง** ด้วย
- แอร์ 2 เครื่อง → reserve ✓
- ท่อทองแดง, ขายึด, ฉนวน, น้ำยา → reserve ด้วย ✓

**Behavior:**
- SO อื่นดึงไม่ได้
- WH-2 Transfer ข้ามคลังไม่ได้
- เบิกสต็อกจริงวันนัดงาน (admin/ช่างกดเบิก)

### 3.6 1 Invoice Line → N Jobs (Admin ตัดสินใจ)

- แอร์ 2 เครื่อง + ติดตั้ง × 2 → admin split ได้:
  - **1 job** (ช่างคนเดียว 2 เครื่อง ใน slot เดียว)
  - **2 jobs** (ช่างคนเดียว 2 slot หรือ 2 ช่าง)
- ตัดสินใจใน SV-6 queue planning

### 3.7 Conflict Check

- ช่าง 1 คนไม่สามารถรับงาน slot เดียวกัน 2 งานซ้อนได้
- แต่วันเดียวกัน slot ต่างเวลา ได้

### 3.8 Partial Completion (งานไม่เสร็จวันนั้น)

- ช่าง 1 คน → ติดตั้ง 1/2 เครื่อง → ไปต่อวันอื่น
- **Job stays in status "ค้างส่ง"** จนส่งมอบจริง
- ช่างคนเดิม**ส่งต่อเองไม่ได้** — admin reassign เท่านั้น
- ค่าแรง: จ่ายเมื่อจบทั้งงาน (ไม่แยกครึ่ง)

### 3.9 Payment to Technician (AP)

- ปิดงาน → admin ตรวจรับ → trigger AP
- **ช่างนอก:** สร้าง AP Invoice → WHT 3% ใบรับรอง
- **ช่างใน:** payroll entry (ไม่มี WHT)

---

<a id="multi-role-vendor"></a>
## 4. Multi-role Vendor (AR + AP)

**Vendor 1 ราย เป็นได้หลายบทบาทพร้อมกัน:**

| Role | คำอธิบาย | บัญชี |
|---|---|---|
| **🏭 Goods Supplier** | ตัวแทนจำหน่าย (ซื้อมาขาย) | **AP** (เราติดเงินเค้า) |
| **🛡️ Warranty Service Partner** | ศูนย์บริการ (ซ่อมในประกัน) | **AR** (เค้าติดเงินเรา) |
| **🚚 Outsource Technician** | ช่างนอกรับงานจ้าง | AP (ค่าแรง) |
| **🛠️ Service Provider** | ขนส่ง/บัญชี/IT | AP |

### 4.1 กรณีรวม — Daikin เป็นทั้ง Goods + Warranty Partner

- Goods side: เราซื้อแอร์มาขาย → ติดเงิน Daikin (AP)
- Warranty side: เราซ่อมในประกันให้ Daikin → Daikin ติดเงินเรา (AR)

**BC365 Implementation:**
- Vendor record `V-00012` (AP)
- **Shadow Customer record** `C-VDR-00089` (AR)
- Link 2 records ผ่าน field `linked_customer_no`
- Reconcile: หักกลบ AR-AP ที่ period end → เหลือ net position

### 4.2 Warranty Coverage Policy (per Vendor)

Matrix 3×3: `(อะไหล่, ค่าแรง, เดินทาง) × (Vendor, ลูกค้า, Case-by-case)`

**Default ที่ Daikin ยอมรับ:**
- ✓ ค่าอะไหล่ → เก็บ Vendor (AR)
- 🔀 ค่าแรง → Case-by-case (default: ลูกค้า)
- ✗ ค่าเดินทาง → เก็บลูกค้า (Vendor ไม่คุ้มครอง)

### 4.3 Per-line Charge-to

แต่ละ line ใน SV-2 Invoice:
- เลือก **เก็บจาก: ลูกค้า / Vendor**
- AR side → สร้าง AR entry ภายใต้ shadow customer
- Customer side → สร้าง AR entry ภายใต้ customer ปกติ

---

<a id="business-rules"></a>
## 5. Business Rules Reference (รวม)

### 5.1 Service
1. **Serial Track** — ทุก job ต้องมี Serial
2. **Warranty Check** — Serial vs GRN Date (อัตโนมัติ)
3. **Photo Required** — รูปก่อน-หลัง บังคับก่อนปิดงาน
4. **Customer Signature** — Digital Signature บังคับ
5. **Maker ≠ Checker** — QA ต้องไม่ใช่ช่างเอง
6. **Claim Auto-Trigger** — SV-4 ซ่อมไม่ได้ → Auto CL-1
7. **SLA Timer** — Countdown ทุก card ใน Queue

### 5.2 Delivery & Install
8. **Install = Bundle** — Job Type gen line + parts
9. **Stock Lock from Invoice Date** — รวมอุปกรณ์ติดตั้ง
10. **Dual Pricing** — customer/tech แยก 2 field
11. **Outsource Tech มีของเอง** — flag `issue_parts = false`
12. **Sticky Assignment** — tech ส่งต่อเองไม่ได้ · admin-only reassign
13. **Partial → ค้างส่ง** — จบทั้งงานเท่านั้น
14. **Pricing Override** — per-tech/area ตกลงครั้งแรก · lock จนกว่าจะ renegotiate

### 5.3 Vendor
15. **Multi-role Vendor** — checkbox (ไม่ใช่ radio)
16. **AR-side for Warranty Partner** — shadow customer in BC
17. **Reconcile AR-AP** — period-end หักกลบ

### 5.4 VAT & Accounting (จาก CLAUDE.md)
18. **Golden Rule** — discount **ก่อน** VAT เสมอ
19. **Rebate ≠ Discount** — rebate = คืนหลังขาย
20. **Entity Tag** — 1=SWT / 2=SWE / 3=VMN / novat
21. **Portal UI only** — no local DB · BC365 เป็นเจ้าของ posting/numbering
22. **WHT 3%** — ค่าบริการช่างนอก

---

<a id="design-implications"></a>
## 6. Design Implications

### 6.1 Data Model

```
md3_vendor
  ├─ roles[] (multi: goods, warranty, outsource, service)
  ├─ warranty_coverage
  │    ├─ parts: vendor/customer/case_by_case
  │    ├─ labor: vendor/customer/case_by_case
  │    └─ travel: vendor/customer/case_by_case
  └─ linked_customer_no (BC shadow record)

md4_employee (tech)
  └─ labor_rate (override on CF-2.5)

cf25_job_type
  ├─ standard_time (hours)
  ├─ labor_rate (default)
  ├─ install_bom[] (parts list per job type)
  └─ overrides_by_tech[] (per-tech/area)

sl4_invoice_line
  ├─ type: product / service / install_bundle
  ├─ sell_price (visible to customer)
  ├─ tech_cost (hidden — for AP)
  ├─ charge_to: customer / vendor (per-line)
  └─ children[] (bundle components — no price)

sv6_job
  ├─ invoice_line_ref
  ├─ split_index (1 of N jobs from this line)
  ├─ technician_type: internal / outsource
  ├─ technician_ref (MD-4 or MD-3)
  ├─ issue_parts: boolean (false if outsource)
  ├─ status: pending / assigned / in_progress / held / completed
  ├─ partial_flag
  └─ sticky_lock (admin-only reassign)
```

### 6.2 UI Components ที่ต้องออกแบบ

| # | Component | หน้าที่มีอยู่ |
|---|---|---|
| 1 | Toggle Card — radio card (5 flavors) | ✅ swt-patterns.css |
| 2 | Ref Block — highlighted box (4 variants) | ✅ swt-patterns.css |
| 3 | Status Flow — breadcrumb | ✅ swt-patterns.css |
| 4 | Status Chip (6 colors) | ✅ swt-patterns.css |
| 5 | Status Table (line-items + status) | ✅ swt-patterns.css |
| 6 | **Bundle Line Row** (SL-4) — parent + expandable children | 🆕 ต้องเพิ่ม |
| 7 | **Per-line Charge-to Toggle** (SV-2) | 🆕 ต้องเพิ่ม |
| 8 | **Coverage Matrix 3×3** (MD-3) | ✅ ทำเสร็จ |
| 9 | **Dual Balance Panel** (MD-3 AR+AP) | ✅ ทำเสร็จ |
| 10 | **Slot Conflict Calendar** (SV-6) | 🆕 ต้องเพิ่ม |
| 11 | **Sticky Assignment Lock Indicator** (SV-6) | 🆕 ต้องเพิ่ม |

---

<a id="mockup-mapping"></a>
## 7. Mockup Mapping & Gaps (ณ 2026-04-22)

### 7.1 Module Map

| รหัส | หน้า | สถานะ |
|---|---|---|
| SV-Q | Queue | [sv1-service-queue-mockup.html](../../sv1-service-queue-mockup.html) |
| SV-1 | Service Intake | รวมใน SV-Q |
| SV-2 | Service Invoice | [sv2-service-invoice-mockup.html](../../sv2-service-invoice-mockup.html) |
| SV-3 | Parts Requisition | [sv3-spare-part-issue-mockup.html](../../sv3-spare-part-issue-mockup.html) |
| SV-4 | Warranty Check | [sv4-warranty-check-mockup.html](../../sv4-warranty-check-mockup.html) |
| SV-5 | **Job Card** (ซ่อม) | [sv5-job-card-mockup.html](../../sv5-job-card-mockup.html) |
| **SV-6** | **Delivery & Install** | [sv6-delivery-install-mockup.html](../../sv6-delivery-install-mockup.html) ✅ renamed 2026-04-22 |
| ~~CL-1~~ | ~~Claim Intake~~ decomposed 2026-07-02 — เคลม = job type ใน SV-1 (spec: `.agents/svc-claim-jobtype-spec.md`) | [archived](../../_archive/cl1-claims-mockup.html) |

> ⚠️ **Spec drift:** `SV_service.md` เคยระบุ SV-5 = Delivery · แต่ mockup ใช้ SV-5 = Job Card → ต้อง update spec ให้ SV-5 = Job Card, SV-6 = Delivery

### 7.2 Gap Summary (9 ข้อ — จาก blueprint vs mockup)

**✅ ทำแล้ว (3 ข้อ):**
1. Technician Type toggle (SV-5) — Internal/Outsource
2. Vendor sub-type (MD-3) — checkbox multi-role + Warranty Coverage + Dual Balance
3. Vendor Job Ref + Return Parts section (CL-1)

**⚠️ ยังต้องทำ (6 ข้อ):**
4. Part Warranty Terms (MD-1 BOM) — ประกันแยกชิ้น
5. Coverage Conditions checkbox (SV-4) — ฟรีแรง/อะไหล่/เดินทาง
6. Per-line Charge-to toggle (SV-2) — refactor line items
7. Line Type: Service/Part/Travel (SV-2)
8. 2-stage Close (SV-5) — ปิดช่าง + ปิดลูกค้า
9. Return Parts Tracking — ✅ CL-1 แล้ว · รอ link จาก SV-3

**🆕 เพิ่มจาก Delivery/Install (5 ข้อ):**
10. **Rename dl1 → sv6** + sidebar rollout
11. **Install BOM tab** ใน CF-2.5
12. **Tech rate override** tab ใน CF-2.5
13. **Bundle line pattern** ใน SL-4 (parent + children)
14. **Stock lock ครอบคลุม install parts** (SL-4, SL-2)

---

## 📎 Linked Documents

- `sangwijit-portal-skill/modules/SV_service.md` — original spec
- `sangwijit-portal-skill/modules/CF_config.md` — CF-2.5 template
- `knowledge-base/skills/sangwijit-service/SKILL.md` — portal mapping
- `CLAUDE.md` (root) — project-wide rules

---

**Last updated:** 2026-04-22
**Maintainer:** Peerapat (Sangwijit)
