# Sangwijit ERP Portal — Knowledge Base

> **เวอร์ชัน:** v1.0 — เมษายน 2569
> **Scope:** Dynamic Web Portal (ชั้น Frontend ครอบ BC365)

---

## ทำไมต้องมี knowledge-base นี้

โปรเจกต์ ERP Portal มี **58 mockup pages**, **91 modules**, **4 นิติบุคคล** และต้องเชื่อม BC365 ในอนาคต ข้อมูลที่ต้องใช้จึงเยอะและกระจาย knowledge-base นี้รวบรวมทุกอย่างใน folder เดียว แยกเป็น:

- **portal/** — ข้อมูลเฉพาะตัว portal (navigation, UI, BC integration)
- **skills/** — SOP ของแต่ละฝ่าย (บัญชี, คลัง, ช่าง, ...) ที่ต่อยอดให้เชื่อมกับ portal

---

## โครงสร้าง folder

```
knowledge-base/
├── CLAUDE.md                      ← instruction หลักโปรเจกต์ (อ่านก่อนเสมอ)
├── README.md                      ← ไฟล์นี้
│
├── portal/
│   ├── 00-overview.md             Architecture + tech stack + phase plan
│   ├── 01-module-list.md          91 modules แยก 8 กลุ่ม + สถานะ
│   ├── 02-navigation-structure.md Sidebar + Quick Nav + Active state
│   ├── 03-ui-ux-convention.md     Color / Typography / Component
│   ├── 04-bc365-integration.md    BC entity mapping + Phase 1-5
│   └── 05-page-catalog.md         รายละเอียดทุก mockup page (ตาราง)
│
└── skills/                        ← อัปเดตทีหลังใน Phase 2
    ├── sangwijit-accounting/
    ├── sangwijit-warehouse/
    ├── sangwijit-purchasing/
    ├── sangwijit-salesperson/
    ├── sangwijit-service/
    ├── sangwijit-commission/
    └── sangwijit-hr/
```

---

## วิธีใช้ — Decision Tree

```
เริ่มงาน
  │
  ├─ คำถามเกี่ยวกับ "portal" (UI, navigation, หน้า mockup)
  │   └─→ อ่าน portal/*.md
  │
  ├─ คำถามเกี่ยวกับ "SOP" (ขั้นตอนงาน, กฎบัญชี, จัดซื้อ)
  │   └─→ อ่าน skills/sangwijit-<department>/
  │
  ├─ คำถามเกี่ยวกับ "BC365" (เชื่อมระบบ, entity, phase)
  │   └─→ อ่าน portal/04-bc365-integration.md
  │
  └─ ไม่แน่ใจ → ถาม user
```

---

## ตารางเลือกไฟล์ (Quick Reference)

| ต้องการรู้... | ไปอ่าน |
|---------------|--------|
| Module ไหนใน phase ไหน | `portal/01-module-list.md` |
| Prefix code หมายถึงอะไร (SL/WH/PO/FI/SV/CF/MD) | `portal/01-module-list.md` 1 |
| Sidebar ควรมี link อะไรบ้าง | `portal/02-navigation-structure.md` |
| Copy sidebar ไปหน้าใหม่ยังไง | `portal/02-navigation-structure.md` 3 |
| สีไหนใช้ทำอะไร | `portal/03-ui-ux-convention.md` 1 |
| ฟอนต์ / ขนาด / spacing | `portal/03-ui-ux-convention.md` 2 |
| Component สำเร็จรูป (card/table/form) | `portal/03-ui-ux-convention.md` 3 |
| Module นี้ไปตรงกับ BC entity ไหน | `portal/04-bc365-integration.md` 2 |
| Phase ไหนเชื่อมอะไร | `portal/04-bc365-integration.md` 3 |
| Dual-Book ทำงานยังไง | `portal/04-bc365-integration.md` 5 |
| หน้านี้มีฟิลด์อะไร, จุดขายคืออะไร | `portal/05-page-catalog.md` |
| SOP บัญชี | `skills/sangwijit-accounting/SKILL.md` |
| SOP คลัง | `skills/sangwijit-warehouse/SKILL.md` |
| SOP จัดซื้อ | `skills/sangwijit-purchasing/SKILL.md` |
| SOP ช่าง | `skills/sangwijit-service/SKILL.md` |
| SOP ขาย | `skills/sangwijit-salesperson/SKILL.md` |
| Commission | `skills/sangwijit-commission/SKILL.md` |
| HR / JD / KPI | `skills/sangwijit-hr/SKILL.md` |

---

## กติกาการอัปเดต knowledge-base

1. **แก้ของเดิมก่อน** — ถ้าข้อมูลเปลี่ยน ให้แก้ไฟล์เดิม ห้ามสร้างไฟล์ใหม่ชื่อคล้ายกัน
2. **ถ้าต้อง version ใหม่** — ใช้ suffix `-v2`, `-v3` ที่ชื่อไฟล์
3. **อัปเดต README.md / CLAUDE.md ด้วย** ถ้ามีไฟล์เพิ่ม/ลด
4. **ใน skills/ ห้ามแก้ของ `/.claude/skills/` ต้นฉบับ** — แก้เฉพาะ copy ใน knowledge-base/skills/
