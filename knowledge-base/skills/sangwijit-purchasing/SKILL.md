---
name: sangwijit-purchasing
description: >
  ระบบความรู้ด้านจัดซื้อและ Trade Agreement ครบวงจรสำหรับกลุ่มแสงวิจิตร
  ครอบคลุม 3 มิติ: (1) Mindset — เข้าใจว่าห้างและดีลเลอร์ทำงานต่างกันอย่างไร
  และทำไม (2) Calculation — คำนวณ True Margin, VAT Golden Rule, PSI & MOS
  (3) Agreement — วิเคราะห์/เจรจา/บริหาร Trade Agreement แต่ละห้าง
  ใช้ skill นี้ทุกครั้งที่: อธิบาย Dealer vs Modern Trade thinking, สอนหลักการ
  Purchasing ให้ทีม, คำนวณต้นทุนจริงหรือ VAT, ตรวจ MOS/PSI ก่อนสั่งซื้อ,
  เจรจา agreement กับห้าง, วิเคราะห์เงื่อนไขห้างใหม่, บริหาร non-move/penalty
---

# Sangwijit Purchasing Skill — ระบบจัดซื้อและ Trade Agreement

## หลักคิดหลัก: ทันเกมก่อน ทำถูกตาม

```
ห้างไม่ได้ขายแค่สินค้า — ห้างขาย "โอกาสในการขาย"
สิ่งที่เห็นบนป้ายราคา ≠ สิ่งที่ห้างเห็น
เราไม่จำเป็นต้องเป็นห้าง แต่เราต้อง "ทันเกม"
```

---

## โครงสร้าง Skill (6 Reference Files)

| มิติ | เรื่องที่ถาม | อ่าน reference |
|------|------------|---------------|
| **Mindset** | ทำไมห้างทำแบบนี้? Dealer vs Mall thinking | `05-mindset-dealer-vs-mall.md` |
| **Calculation** | VAT Golden Rule / True Margin / PSI / MOS | `06-calculation-tools.md` |
| **Agreement** | ค่าใช้จ่ายทุกประเภทในห้าง | `01-fee-structure.md` |
| **Agreement** | เปรียบเทียบเงื่อนไขแต่ละห้าง | `02-channel-comparison.md` |
| **Agreement** | หลักการเจรจาต่อรอง | `03-negotiation-guide.md` |
| **Agreement** | Non-move / Penalty / PC / Risk | `04-risk-management.md` |

> **ลำดับการอ่านสำหรับคนใหม่:** 05 → 06 → 01 → 02 → 03 → 04

---

## หลักการ TBD

ตัวเลขจริง (%, บาท) เปลี่ยนทุกปี/ทุก session
→ ถ้าไม่มีข้อมูล → ถาม 1 คำถาม → ดำเนินการต่อทันที
→ ไม่หยุดเพราะข้อมูลไม่ครบ

---

## โหมดการทำงาน

| คำขอ | Claude จะทำ |
|------|-----------|
| "อธิบาย Dealer vs Mall ให้ทีมฟัง" | ดึง `05` → อธิบายพร้อมตัวอย่างบริบทแสงวิจิตร |
| "สอนเรื่อง VAT / คำนวณต้นทุนที่ถูก" | ดึง `06` → อธิบาย Golden Rule + ตัวอย่างเลข |
| "ทดสอบความเข้าใจ Purchasing 101" | ดึง `05` + `06` → ออก Quiz / Role-play สถานการณ์ |
| "เช็ค MOS ก่อนสั่งซื้อ" | ดึง `06` → คำนวณ MOS + แนะนำ Go/No-Go |
| "คำนวณ true margin ห้าง X" | ดึง `01` + `06` → คำนวณแสดงทีละชั้น |
| "เปรียบเทียบเงื่อนไขห้าง A vs B" | ดึง `02` → ตารางเปรียบเทียบ |
| "ควรเจรจาจุดไหนได้บ้าง" | ดึง `03` → แนะนำตามห้างนั้น |
| "สินค้า Non-move ควรทำอย่างไร" | ดึง `04` → แนวทางรับมือ step by step |
| "ร่าง/ตรวจ agreement" | วิเคราะห์ทีละข้อ + ชี้จุดเสี่ยง |
