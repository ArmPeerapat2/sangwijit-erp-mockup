# Service Overview

## โปรเจกต์นี้คืออะไร?
**Sangwijit ERP Web Portal** — Frontend Portal เหนือ Dynamics 365 Business Central
- 4 นิติบุคคล: SWT / SWE / VMN / WPS
- 10 สาขา: HQ, Rangsit, Bangna, Nakhon Pathom, Chonburi, Khon Kaen, Stock HQ, Company, Export, Online
- Stack: React/Vue + TypeScript → BC365 REST API

## Design System
- Font: Inter, min-width 1440px
- Sidebar: #1E3A5F, 240px fixed
- Accent: #2563EB
- Background: #F8FAFC
- Cards: white, border-radius 12px
- Active nav item: `background:#2563EB; color:white; font-weight:600`
- Floating Quick Nav: ☰ bottom-right, 300px panel, current page with ★

## RBAC (2-Layer)
1. Role — กำหนด permission (action)
2. User Scope — visibility by branch/dept

## หน้า mockup ที่มี (39 หน้า, Index v1.5)
- SL-1..7, SL-Q (Sales)
- PO-4, PO-Q (Purchase)
- WH-R (Warehouse)
- FI-1..5 (Finance)
- MD-1..5 (Master Data)
- SC-1, SC-2, SC-7 (Search/Timeline)
- SM-1, SM-2 (SKU Management)
- CM-1, SV-6, EX-1 (Commission/Delivery/Exec)
- CF-1, AP-1 (Config/Approval)
- RP-1 (Report Center)
- CL-1, CL-2 (Claims)

## File locations
- Mockups: `/sessions/great-dreamy-davinci/mnt/Design Ai/*.html`
- Index: `portal-mockup-index.html`
- Plan: `plan.md`
- Gap analysis: `Sangwijit_Portal_Gap_Analysis.xlsx`

## Preferences ผู้ใช้
- ภาษา: ไทย, กระชับ, ไม่เป็นทางการ (ยกเว้นเอกสารทางการ)
- ก่อนสร้างไฟล์ใหม่: ถามก่อน
- แก้ไขไฟล์เดิม: แก้ตัวเดิม ห้ามสร้างใหม่
- ถ้าจำเป็นต้องสร้างใหม่: ใช้ชื่อเดิม + version suffix
- Role: General Manager
