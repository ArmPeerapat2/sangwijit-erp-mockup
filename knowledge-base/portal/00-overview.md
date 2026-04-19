# 00 — Portal Overview

> **Scope:** ภาพรวมโปรเจกต์, โครงสร้างองค์กร, tech stack, phase plan
> **อ่านก่อน:** เพื่อเข้าใจว่าทำไมถึงมี portal นี้

---

## 1. ทำไมต้องมี Portal (ไม่ใช้ BC365 โดยตรง)

Business Central 365 เป็น ERP มาตรฐานที่ดี แต่มี **ข้อจำกัด 5 ข้อ** สำหรับกลุ่มแสงวิจิตร:

| ข้อจำกัด BC365 | Portal แก้อย่างไร |
|----------------|-------------------|
| UI ไม่เป็นภาษาไทย 100% + ไม่ใช้ พ.ศ. native | Portal ใช้ไทย + พ.ศ. ทั้งหมด |
| ไม่รองรับ Dual-Book (บัญชี 2 เล่ม: หลัก/ภาษี) | Portal บังคับ Entity Tag ทุก AP Invoice |
| ไม่มี Credit Approval Tier (หลายระดับ) | Portal ใช้ CF-7 Approval Matrix ร่วม SL-F1/PO |
| Rebate ปนกับ Discount | Portal แยก Rebate Dashboard (PO-7/FI-8) |
| Workflow cross-module แย่ (เช่น Service → GRN → AP) | Portal รวม Queue Dashboard ทุก module |

**หลักคิด:**
> BC365 เป็น **System of Record** (แหล่งข้อมูลจริง)
> Portal เป็น **System of Engagement** (ชั้นที่พนักงานใช้จริง)
> ทุก transaction ลง BC ผ่าน API, portal ไม่ใช่ต้นทางข้อมูล

---

## 2. โครงสร้างองค์กร (4 นิติบุคคล)

| Code | ชื่อ | บทบาท |
|------|-----|------|
| **SWT** | แสงวิจิตร เทรดดิ้ง | ค้าส่ง, Wholesale (นิติบุคคลหลัก) |
| **SWE** | แสงวิจิตร อิเล็คทริค | ค้าปลีก, Retail สาขา |
| **VMN** | วี เอ็ม เอ็น | นิติบุคคลร่วมทุน (ขายเฉพาะทาง) |
| **WPS** | ดับเบิลยู พี เอส | Export (ส่งออกต่างประเทศ) |

**Portal รองรับทั้ง 4 นิติบุคคล** ผ่านระบบ Entity Tag (CF-9) และ Dual-Book (FI-13A/B)

---

## 3. Tech Stack (Current Phase — Mockup)

| Layer | Technology |
|-------|-----------|
| Mockup UI | HTML5 + inline CSS + vanilla JS |
| Icons | Emoji + simple Unicode characters |
| Fonts | `Inter` (web-safe, sans-serif) |
| Layout | `position:fixed` sidebar + `margin-left:240px` main |
| Responsive | Desktop-first, min-width 1440px |
| Backend | ❌ ยังไม่มี (Phase ถัดไป) |

**เหตุผลที่เลือก HTML static:**
- รีวิว UX กับผู้ใช้ได้เร็ว ไม่ต้อง compile
- ไม่ต้องตั้ง dev environment ทุกเครื่อง
- ส่งไฟล์ให้ vendor ดูตรงๆ ได้

---

## 4. Phase Plan (Portal Development)

| Phase | ช่วงเวลา | ขอบเขต | สถานะ |
|-------|---------|-------|------|
| **P0 — Mockup** | Q1-Q2 2569 | HTML mockup 58 หน้า, architecture v3.0 | ✅ ทำอยู่ |
| **P1 — Core Transactions** | Q3 2569 | SL, WH, PO, FI พื้นฐาน เชื่อม BC365 | 📋 Plan |
| **P2 — Extended Modules** | Q4 2569 | SV, CL, CRM, Credit Control, FI Advanced | 📋 Plan |
| **P3 — Closing & Compliance** | Q1 2570 | Period Close, e-Tax, e-Filing, TFRS | 📋 Plan |
| **P4 — BI & Mobile** | Q2-Q3 2570 | Management Dashboard, Mobile App | 📋 Plan |
| **P5 — E-Commerce & API** | 2571 | B2B Customer Portal, Marketplace, Public API | 📋 Future |

**เงื่อนไข:** Portal rollout แต่ละ Phase ต้อง pass User Acceptance Test (UAT) โดยผู้ใช้จริงของแต่ละแผนก

---

## 5. Module สรุปใน 8 กลุ่ม (สถิติ)

| # | หมวด | จำนวน | Core | NEW | Phase ถัดไป |
|---|------|------|------|-----|------------|
| 1 | ขายและสัมพันธ์ลูกค้า | 15 | 12 | 0 | 3 |
| 2 | จัดซื้อและลูกโซ่อุปทาน | 12 | 9 | 0 | 3 |
| 3 | สินค้าคงคลัง/คลัง | 9 | 6 | 1 | 2 |
| 4 | การเงินและบัญชี | 15 | 7 | 7 | 1 |
| 5 | บริการและหลังการขาย | 9 | 8 | 0 | 1 |
| 6 | Master + Config | 17 | 15 | 1 | 1 |
| 7 | กฎหมายไทย | 9 | 9 | 0 | 0 |
| 8 | BI / Mobile / E-Com / API | 10 | 1 | 0 | 9 |
| **รวม** | | **91** | **82** | **10** | **9** + P3 |

รายละเอียดดู `01-module-list.md`

---

## 6. Business Rules สำคัญ (ห้ามลืม)

### B1 — Promotion Conflict Resolution
โปรโมชั่นซ้อนได้สูงสุด 2 ชั้น + กำหนด Priority ชัดเจน

### B5 — Credit Approval Tier Architecture
Credit Approval มี 2 ด้าน (SL-F1 + PO) ใช้ CF-7 Approval Matrix ร่วมกัน

### V — VAT Golden Rule
**ส่วนลดหักก่อน VAT เสมอ** — คำนวณ VAT จากราคาหลังหักส่วนลด

### R — Rebate ≠ Discount
Rebate คือ **คืนเงินหลังขาย** (ตาม Agreement), Discount คือ **ลดก่อนขาย** (ลด ณ จุดขาย)
**ห้ามใช้ Rebate ไปดั๊มพ์ราคา**

### M — Non-Move Stock Threshold
Threshold สินค้าหมุนช้าแยกตามหมวดสินค้า (ไม่ใช่ค่าเดียวทั้งระบบ)

### D — Dual-Book Entity Tag System
ทุก AP Invoice (PO-6) ต้องระบุ Entity Tag (1/2/3/.../novat) — ใช้แยกข้อมูลเข้าห้องภาษีแต่ละนิติบุคคล

### F — Fixed Asset Depreciation
สินทรัพย์ถาวรคำนวณค่าเสื่อมอัตโนมัติแบบ Straight-Line ผ่าน Batch Run รายเดือน

---

## 7. Cross-Module Flow (7 flow ข้าม module)

| Flow | Path |
|------|------|
| Sale-In Accrual | PO-7 → FI-8 → PM-Q |
| Non-Move Stock Alert | WH-NM → PO (ปรับ Threshold) |
| Credit Approval | SL-F1 + PO → CF-7 |
| Dual-Book | CF-9 → PO-6 → FI-13A → FI-13B |
| Fixed Asset Lifecycle | FI-9 → FI-10 / FI-11 |
| PO Deposit → AP Settlement | PO-8 → FI-2 → PO-5 |
| WHT Auto-Calculate | FI-2 → FI-12 → ภ.ง.ด.3/53 |

---

## 8. เกี่ยวข้องกับ Skill ไหนบ้าง

| Module Group | ดู Skill |
|-------------|---------|
| SL (ขาย) | `sangwijit-salesperson` + `sangwijit-commission` |
| WH (คลัง) | `sangwijit-warehouse` |
| PO (จัดซื้อ) | `sangwijit-purchasing` |
| FI (บัญชี/การเงิน) | `sangwijit-accounting` |
| SV / CL (บริการ) | `sangwijit-service` |
| MD (master data) | - (ยังไม่มี skill แยก) |
| CF (config) | - (admin level) |

---

## 9. Next Step

- ถ้าต้องการรู้ว่ามี module อะไรบ้าง → `01-module-list.md`
- ถ้าต้องการทำหน้าใหม่ → ต้องอ่าน `02-navigation-structure.md` + `03-ui-ux-convention.md`
- ถ้าต้องเชื่อม BC365 → `04-bc365-integration.md`
