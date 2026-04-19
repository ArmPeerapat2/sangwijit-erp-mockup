---
name: changprompt
description: |
  ระบบความรู้และ Assistant ครบวงจรสำหรับโปรเจกต์ ChangPrompt (ช่างพร้อม) — Marketplace Platform เชื่อมร้านค้า/ศูนย์บริการกับช่างอิสระ บริการซ่อม/ติดตั้งแอร์

  ใช้ Skill นี้ทุกครั้งที่:
  - ถามเรื่อง ChangPrompt, ช่างพร้อม, หรือโปรเจกต์นี้ในทุกแง่มุม
  - ขอสร้างหรือแก้ไขเอกสาร Flow / Spec ใหม่ ให้ตรงกับ format มาตรฐานโปรเจกต์
  - เขียน Code (React, Django REST, MySQL) ให้สอดคล้องกับ Tech Stack และ Database Schema ของโปรเจกต์
  - ถามเรื่อง Business Model, Revenue Stream, Data Monetization ของ ChangPrompt
  - ออกแบบ UI/UX, API Endpoint, DB Query ใหม่
  - วางแผน Phase การพัฒนา, ประเมินเวลา/ราคา
  - ถามเกี่ยวกับ Flow ใด ๆ ใน 43 Flows ที่มีอยู่
---

# ChangPrompt Skill — คู่มือหลัก

## 🎯 โปรเจกต์คืออะไร

**ChangPrompt (ช่างพร้อม)** คือ Marketplace Platform เชื่อมร้านค้า/ศูนย์บริการกับช่างอิสระ
เพื่อให้ร้านขยายทีมได้โดยไม่ต้องจ้างประจำ และช่างมีงานสม่ำเสมอจากหลายร้าน

**เจ้าของโปรเจกต์:** Peerapat — GM, Sangwijit Company (เครื่องใช้ไฟฟ้า, ยอดขาย 450M/ปี)

---

## 🏗️ 3 ระบบหลัก

| ระบบ | Platform | Users |
|------|----------|-------|
| ChangPrompt Store Manager | Web Portal | Shop Owner, Shop Admin, Sales Staff |
| ChangPrompt Pro | Mobile App | Freelance Technician |
| Platform Admin | Super Dashboard | Super Admin (KYC, Analytics, Data) |

---

## 👥 User Roles

| Role | สิทธิ์หลัก |
|------|-----------|
| Super Admin | อนุมัติร้าน/ช่าง (KYC), ภาพรวม Marketplace |
| Shop Owner | จัดการพนักงาน, ดูรายงานทั้งหมด, ตั้งค่าร้าน |
| Shop Admin | จ่ายงานช่าง, อนุมัติพันธมิตร, จ่ายค่าแรง |
| Sales Staff | เปิดงานได้, ดูเฉพาะงานตัวเอง |
| Technician | รับงานจากหลายร้าน, อัปโหลดหลักฐาน, สแกน Serial |

---

## 💰 Business Model (Data-First)

Revenue Streams 3 ช่องทาง:
1. **Data Fees** — ขาย Installation Records ให้ผู้ผลิตแอร์ (หลัก)
2. **Incentive Fee** — Commission จาก Brand Promotional Budget
3. **Subscription** — ค่าบริการรายเดือนจากร้านค้า (รอง)

**Key Insight:** Serial Number + ข้อมูลการติดตั้ง = สินทรัพย์ข้อมูลที่มีมูลค่า
ผู้ผลิตยินดีจ่ายสำหรับข้อมูลนี้มากกว่าค่า Subscription

---

## 📊 Development Status

```
Phase 0 (MVP):      88h — ✅ COMPLETE  (Flows 01-04)
Phase 1 (Prod):     46h — 🟡 30% Done (Flows 05-06)
Phase 2 (Analytics): 23h — ⏳ Planned  (Flow 07)
Phase 3 (Customer): 12h — 🔮 Future
─────────────────────────────────────────
Total: 169h = 135,200฿ dev cost
Grand Total (incl. design/QA/ops): 250,480฿
```

---

## 🗂️ Flows Index (43 Flows รวม)

| Group | File | Flows | Status |
|-------|------|-------|--------|
| 1: Onboarding | 01_Onboarding_Flows.md | 1A, 1B | ✅ |
| 2: Partnership | 02_Partnership_Flows.md | 2A, 2B, 8A-8D | ✅ |
| 3: Core Operations | 03_Core_Operations_Flows.md | 3A, 3B, 3C, 3D | ✅ |
| 4: Exception Handling | 04_Exception_Handling_Flows.md | 4A-4D, 5A-5D, 6A-6D | ✅ |
| 5: Staff Management | 05_Staff_Management_Flows.md | 7A-7G | ✅ |
| 6: Financial | 06_Financial_Flows.md | 9A-9C, 10A-10C | ✅ |
| 7: Reporting | 07_Reporting_Analytics_Flows.md | R1-R7 | ✅ |

---

## 🗄️ Database — 25 Tables (8 Groups)

| Group | Tables |
|-------|--------|
| User & Auth | users, otp_codes |
| Shop | shops, shop_staffs, staff_permissions |
| Technician | technicians, technician_documents, technician_penalties, technician_earnings |
| Partnership | partnership_requests, shop_technician_partners |
| Customer | customers |
| Jobs | jobs, installed_products, job_issues, complaints, warranty_parts_needed |
| Financial | withdrawal_requests, shop_expenses, receipts, withholding_tax_certificates, warranty_claims |
| System | audit_logs, notifications, staff_commissions |

**Core Table:** `jobs` — hub กลางที่ทุก Flow ผ่าน
**Data Asset:** `installed_products` — serial_number, brand, location, technician_id, installed_at

---

## 🔧 Tech Stack

```
Backend:   Django + Django REST Framework (Python)
Frontend:  React 18 + Tailwind CSS (Web Portal)
Mobile:    React Native (iOS + Android)
Database:  MySQL 8.0 (RDS)
Cache:     Redis
Storage:   AWS S3 (Photos, Documents)
```

---

## 🔒 Privacy Rules (สำคัญมาก)

- ข้อมูลลูกค้าผูกกับ `shop_id` — ช่างเห็นได้เฉพาะระหว่างงาน
- ช่างเห็นข้อมูลลูกค้าเฉพาะตอน `status IN ('accepted', 'working')`
- พอปิดงาน → เบอร์และที่อยู่เต็มหายทันที
- ร้านเป็นเจ้าของข้อมูลลูกค้า ไม่ใช่ Platform

---

## 🧭 วิธีใช้ Skill นี้

### เมื่อถามเกี่ยวกับ Flow ใด ๆ
→ อ่านไฟล์ที่ตรงกับ Group นั้นจาก `/mnt/project/`

### เมื่อต้องการสร้างเอกสาร Flow ใหม่
→ อ่าน `references/doc_format.md` เพื่อดู Template มาตรฐาน

### เมื่อต้องเขียน Code
→ อ่าน `references/tech_conventions.md` สำหรับ Pattern ที่ใช้ในโปรเจกต์

### เมื่อถามเรื่อง Database
→ อ่าน `/mnt/project/98_Database_Schema.md` โดยตรง

### เมื่อถามเรื่อง Business / Revenue
→ ข้อมูลหลักอยู่ใน SKILL.md นี้แล้ว ไม่ต้องอ่านไฟล์เพิ่ม

---

## 📁 Reference Files

| File | เมื่อไหร่ควรอ่าน |
|------|----------------|
| `references/doc_format.md` | สร้าง Flow เอกสารใหม่ |
| `references/tech_conventions.md` | เขียน Code ใหม่ |
| `references/flow_summaries.md` | ต้องการ Quick Summary ของทุก Flow |
| `/mnt/project/98_Database_Schema.md` | SQL / Schema ละเอียด |
| `/mnt/project/10_Tech_Stack_Detailed.md` | Tech Stack ละเอียด |
| `/mnt/project/11_Development_Roadmap.md` | Timeline / Roadmap |
