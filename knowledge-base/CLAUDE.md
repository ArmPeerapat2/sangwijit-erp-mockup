# CLAUDE.md — Sangwijit ERP Web Portal

> **โปรเจกต์:** Dynamic Web Portal (ERP ครอบ Business Central 365)
> **บริษัท:** กลุ่มแสงวิจิตร (4 นิติบุคคล: SWT / SWE / VMN / WPS)
> **เวอร์ชัน:** Architecture v3.0 — เมษายน 2569 (2026-04)
> **สถานะ:** Mockup Phase — HTML mockups พร้อมแล้ว, ยังไม่เชื่อม BC365

---

## 1. โปรเจกต์นี้คืออะไร

Sangwijit ERP Web Portal เป็น **ชั้น Frontend เดียว** (Single Unified Portal) ที่ครอบบน Microsoft Dynamics 365 Business Central (BC365) โดยมี 91 modules จัดกลุ่มใน 8 หมวด:

1. ขายและสัมพันธ์ลูกค้า (15 modules)
2. จัดซื้อและลูกโซ่อุปทาน (12 modules)
3. สินค้าคงคลัง/คลังสินค้า (9 modules)
4. การเงินและบัญชี (15 modules)
5. บริการและหลังการขาย (9 modules)
6. การบริหารจัดการ / Master + Config (17 modules)
7. การปฏิบัติตามกฎหมายไทย (9 modules)
8. ส่วนขยาย BI / Mobile / E-Commerce / Integration (10 modules)

**เป้าหมาย Portal:** รวม workflow ทุกฝ่ายในหน้าเดียว, ลด context switch ระหว่างระบบ, บังคับ business rules ที่ BC365 ไม่รองรับในตัว (VAT Golden Rule, Dual-Book, Credit Approval Tier)

---

## 2. โครงสร้างไฟล์ในโปรเจกต์

```
/Design Ai/
├── *.html                           ← Mockup pages (58 ไฟล์)
├── portal-mockup-index.html         ← หน้า index รวม link mockup
├── sangwijit-portal-architecture.html ← Architecture v3.0 doc
├── dev-handoff-spec.html            ← Dev handoff spec
│
└── knowledge-base/                  ← ◆ โฟลเดอร์นี้ (knowledge)
    ├── CLAUDE.md                    ← ไฟล์นี้
    ├── README.md                    ← index + วิธีใช้ knowledge-base
    ├── portal/                      ← portal-specific knowledge
    │   ├── 00-overview.md
    │   ├── 01-module-list.md
    │   ├── 02-navigation-structure.md
    │   ├── 03-ui-ux-convention.md
    │   ├── 04-bc365-integration.md
    │   └── 05-page-catalog.md
    └── skills/                      ← sangwijit-* skills พร้อม portal context
        └── (7 skills)
```

---

## 3. กติกาการทำงานในโปรเจกต์นี้

### 3.1 แก้ไฟล์ vs สร้างไฟล์ใหม่
- **แก้ HTML mockup เดิม** — แก้ในไฟล์เดิม ห้ามสร้างไฟล์ใหม่
- **สร้าง mockup page ใหม่** — ถามผู้ใช้ก่อนทุกครั้ง (อาจมีการปรับจาก scope เดิม)
- **ต้องสร้าง version ใหม่** — ใช้ชื่อเดิม + ต่อท้าย `-v2`, `-v3` เช่น `md1-item-master-mockup-v3.html`

### 3.2 Sidebar / Navigation
- **ทุก mockup page ต้องมี sidebar format เดียวกัน** (ดู `portal/02-navigation-structure.md`)
- Active state ของ link ปัจจุบัน: `background:#2563EB; color:#fff; font-weight:600`
- Quick Nav panel (bottom-right) ต้องมีในทุก page หลัก

### 3.3 ภาษา
- UI label → ภาษาไทยเป็นหลัก, มี English code/prefix (เช่น "SL-1 ใบเสนอราคา")
- วันที่ → **พ.ศ.** (เช่น QT-2567-0015, 01/04/2567)
- Amount → คอมม่าคั่นหลักพัน, 2 ทศนิยม

### 3.4 Color Code หลัก
- Primary Blue: `#2563EB`
- Sidebar Dark: `#1E3A5F` (legacy) / `#1F2937` (main)
- Text Dark: `#1F2937`
- Muted: `#6B7280` / `#9CA3AF`
- Background: `#F8FAFC`
- Border: `#E5E7EB`
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`

### 3.5 Business Rules ที่ห้ามลืม
- **VAT Golden Rule** — ส่วนลดหักก่อน VAT เสมอ
- **Rebate ≠ Discount** — Rebate คืนหลังขาย, Discount ลดก่อนขาย
- **Dual-Book** — ทุก AP Invoice ต้องมี Entity Tag (1/2/3/.../novat)
- **Credit Approval Tier** — ทั้งฝั่ง SL (SL-F1) และ PO ต้องผ่าน CF-2.6 Approval Matrix

---

## 4. ก่อนเริ่มงานใดๆ ให้ทำตามนี้

1. **อ่าน `README.md`** ก่อนเพื่อเช็ควิธีหา reference ที่ถูกเรื่อง
2. **ถ้างานเกี่ยวกับ business SOP** (AP/AR/ช่าง/คลัง/ขาย) → อ่าน `skills/sangwijit-<department>/SKILL.md`
3. **ถ้างานเกี่ยวกับ portal UI/UX/นำทาง** → อ่าน `portal/*.md`
4. **ถ้าไม่แน่ใจว่าควรแก้หรือสร้างใหม่** → ถามผู้ใช้ก่อน
5. **ก่อนเริ่มรันระบบ** → ทวนความเข้าใจกับผู้ใช้ก่อน

---

## 5. Convention การตอบ

- ตอบภาษาไทยเป็นหลัก, กระชับ, ไม่ต้องเป็นทางการ
- ถ้าสร้างเอกสารให้ผู้ใช้ → ต้องมีความน่าเชื่อถือ (ใช้ reference, ตัวอย่างจริง)
- ถ้าไม่แน่ใจ → ถาม ไม่เดา
- ถ้าเป็น output file → save ใน `/Design Ai/` หรือ `/Design Ai/knowledge-base/` ตามความเหมาะสม

---

## 6. Quick Links

| สงสัยเรื่อง... | อ่าน |
|---------------|-----|
| Module มีอะไรบ้าง ขึ้นกับ phase ไหน | `portal/01-module-list.md` |
| Layout sidebar / Quick Nav เป็นยังไง | `portal/02-navigation-structure.md` |
| สี / ปุ่ม / ตาราง / form pattern | `portal/03-ui-ux-convention.md` |
| Entity ใน BC365, Phase การเชื่อม | `portal/04-bc365-integration.md` |
| หน้าไหนใช้ทำอะไร มีฟิลด์อะไร | `portal/05-page-catalog.md` |
| SOP บัญชี / VAT / ปิดบัญชี | `skills/sangwijit-accounting/` |
| SOP คลัง / รับสินค้า / นับสต็อก | `skills/sangwijit-warehouse/` |
| SOP ช่าง / งานบริการ / อะไหล่ | `skills/sangwijit-service/` |
| จัดซื้อ / Vendor / Trade Agreement | `skills/sangwijit-purchasing/` |
| Commission พนักงานขาย | `skills/sangwijit-commission/` |
| พนักงานขาย / ขายหน้าร้าน | `skills/sangwijit-salesperson/` |
| HR / JD / KPI | `skills/sangwijit-hr/` |
