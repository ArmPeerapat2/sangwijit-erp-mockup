# sangwijit-bc-mockup — Install Guide

Skill นี้อยู่ที่ `C:\Design Ai\sangwijit-bc-mockup\` แล้ว — ใช้ได้เลยในโปรเจกต์นี้

## 📂 Files

```
sangwijit-bc-mockup/
├── SKILL.md                    ← คู่มือหลัก (UI/UX design system)
├── INSTALL.md                  ← ไฟล์นี้
├── templates/
│   └── base.html               ← Skeleton เริ่มต้นสำหรับหน้าใหม่
└── assets/
    ├── swt-sidebar.html        ← Sidebar + hover-trigger + pin enhancer
    ├── swt-pay.html            ← SC-3 Payment modal
    └── swt-item-search.html    ← SC-2 Product Search
```

## 🔗 Complement กับ existing skill

- `sangwijit-portal-skill/SKILL.md` → **business rules + module specs** (มีอยู่แล้ว)
- `sangwijit-bc-mockup/SKILL.md` → **UI/UX + design tokens** (skill ใหม่นี้)

ทั้ง 2 skills ใช้ร่วมกัน — business ดู portal-skill, design ดู bc-mockup

## 🚀 How Claude ใช้ (auto)

เมื่อพี่สั่ง `"สร้าง mockup หน้า sl1-quotation"` — Claude จะ:
1. อ่าน root `CLAUDE.md` → รู้ locked standards (bg #F8FAFC, ค.ศ. 26, VAT rules)
2. อ่าน `.agents/active.md` → current decisions
3. อ่าน `sangwijit-portal-skill/modules/SL.md` → business rules ของ Sales
4. อ่าน **`sangwijit-bc-mockup/SKILL.md`** → UI/UX patterns + design tokens
5. Copy `templates/base.html` → `sl1-quotation-mockup.html`
6. Inject SWT blocks จาก `assets/`
7. เขียน content cards + wire handlers
8. Verify: closing tags + locked standards

## 💬 Prompts ที่ใช้ได้

```
สร้าง mockup PO-4 ใบสั่งซื้อ ตาม design system
```
```
เพิ่ม SC-3 Payment ใน sl3-deposit-mockup.html
```
```
ตรวจ sl1-quotation-mockup.html ว่าตรง locked standards ไหม
```
```
หน้า WH-1 GRN ต้องมี card อะไรบ้าง ตาม SKILL.md
```

## 🛠️ Maintenance

- **เพิ่ม shared component ใหม่** → สร้างใน `assets/` + อัปเดต SKILL.md section "Shared Components"
- **เปลี่ยน design token** → แก้ SKILL.md + `templates/base.html` + root `CLAUDE.md` (37-43)
- **เพิ่ม UX pattern** → section "UX Patterns" ใน SKILL.md
- **เพิ่ม module code** → section "Module Codes" ใน SKILL.md + `CLAUDE.md 65`

## 📚 Reference

- **SL-4 Invoice** (`sl4-invoice-mockup-v2-redesign.html`) — ตัวอย่างครบ pattern หลัก ~2,200 บรรทัด
  - ✅ bg #F8FAFC (updated 2026-04-21)
  - ✅ ค.ศ. 26 dates (updated 2026-04-21)
  - ✅ SWT_SIDEBAR, SWT_PAY, SWT_ITEM_SEARCH blocks
  - ✅ Hover-pin sidebar + action bar
  - ✅ SC-11 pills, 3-Way Match, ID card scan
