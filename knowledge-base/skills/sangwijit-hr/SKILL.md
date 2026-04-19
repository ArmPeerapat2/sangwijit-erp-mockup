---
name: sangwijit-hr
description: >
  สร้างเอกสาร HR สำหรับกลุ่มแสงวิจิตร (Saengwichit Group) ครอบคลุม 4 Layer:
  Layer 0 (Department Overview), Layer 1 (Job Description + KPI),
  Layer 2 (SOP), Layer 3 (KPI Dashboard). ใช้ skill นี้ทุกครั้งที่มีการ:
  สร้างหรือแก้ไข JD / KPI / SOP / คู่มือพนักงาน ของแสงวิจิตร,
  ออกไฟล์ .docx หรือ .xlsx สำหรับ HR แสงวิจิตร,
  ถามเรื่องโครงสร้างองค์กร / ระบบเงินเดือน / Commission ของแสงวิจิตร,
  อัปเดต Master Document Register,
  หรือทำงานใดๆ ที่เกี่ยวกับระบบ HR ของบริษัทในกลุ่มแสงวิจิตร
---

# Sangwijit HR Documentation Skill

## บริบทองค์กร

กลุ่มแสงวิจิตรมี **4 นิติบุคคล** — prefix ของรหัสเอกสารต้องตรงกับนิติบุคคล:

| รหัส | บริษัท | ธุรกิจหลัก |
|------|--------|-----------|
| **SWT** | แสงวิจิตรเทรดดิ้ง | Wholesale + Master Franchise + Holding |
| **SWE** | แสงวิจิตรการไฟฟ้า | Retail 6 สาขา (Consignment จาก SWT) |
| **VMN** | หจก.วีมันนี่ | สินเชื่อ — **Read Only / Out of Scope** |
| **WPS** | หจก.WePowerSupply | ส่งออกลาว (margin ~1%, รายได้หลัก = VAT refund) |

> ⚠️ ไม่มี "shared" code ข้ามนิติบุคคล — เอกสารที่ใช้ร่วมกันให้แยกรหัสตามนิติบุคคลเสมอ

---

## ระบบ 4 Layer

```
Layer 0  →  Department Overview (ภาพรวมแผนก + flow + policies)
Layer 1  →  Job Description + KPI (รายตำแหน่ง)
Layer 2  →  SOP (ขั้นตอนปฏิบัติงาน)
Layer 3  →  KPI Dashboard (เชื่อมยอดขายกับ KPI จริง)
```

**กฎ**: ทำ Layer 0 → 1 → 2 → 3 ตามลำดับ ไม่ข้ามขั้น

---

## รหัสเอกสาร (Document Numbering)

Format: `[Entity]-[Dept]-[DocType]-[NN]-[Rev]`

- **NN** = 2 หลักเสมอ (01, 02, … 09, 10)
- **Rev** = R00 (draft), R01, R02 …
- **DocType**: JD, KPI, SOP, CHK, F (Form), POL, MAN, REP

ตัวอย่าง: `SWE-RET-JD-02-R00` = แสงวิจิตรการไฟฟ้า / ค้าปลีก / JD / ลำดับ 2 / ฉบับแรก

---

## โครงสร้างองค์กร (สรุป)

```
CEO
├── ผอ.ฝ่ายขายในประเทศ  (SWT/SWE)
│   ├── ผจก.ขายปลีก  →  SWE-RET  (6 สาขา)
│   │   ├── Area Manager
│   │   ├── หัวหน้าสาขา
│   │   ├── พนักงานขาย (Nominee/PC)
│   │   ├── แคชเชียร์/สินเชื่อ
│   │   └── พนักงานจัดส่ง
│   ├── ผจก.ขายส่ง    →  SWT-WHS  (11 จังหวัดอีสาน)
│   │   ├── พนักงานขายส่งแอร์ (เขต 1,2,3)
│   │   ├── พนักงานขายส่งไฟฟ้า
│   │   ├── Telesale
│   │   ├── แอดมินขายส่ง
│   │   ├── พนักงานขับรถ 6 ล้อ
│   │   └── พนักงานติดตามรถ 6 ล้อ
│   └── ผจก.ออนไลน์   →  SWT-ONL
│       ├── แอดมิน Marketplace
│       ├── Packing
│       └── กราฟิกดีไซน์
├── ผจก.ส่งออก        →  WPS-EXP  (ขึ้นตรง CEO)
├── ผจก.จัดซื้อ        →  SWT-PUR  (ขึ้นตรง CEO)
└── ผอ.ฝ่ายสนับสนุน   (SWT)
    ├── ผจก.บัญชี      →  SWT-ACC
    ├── ผจก.ศูนย์บริการ →  SWT-SVC
    ├── ผจก.คลัง       →  SWT-WH
    ├── ผจก.สินเชื่อ    →  VMN-CRD  (วีมันนี่ — Read Only)
    ├── หน.จัดส่ง      →  SWT-DLV
    └── ผจก.บุคคล      →  SWT-HR
```

---

## สถานะ Layer 1 (JD) ปัจจุบัน

| แผนก | จำนวนตำแหน่ง | สถานะ | ไฟล์ |
|------|-------------|-------|------|
| SWE-RET (ค้าปลีก) | 6 | ✅ ครบ | Layer1_JD_ค้าปลีก_ครบ6ตำแหน่ง.docx |
| SWT-WHS (ค้าส่ง) | 7 | ⚠️ TBD เงินเดือน/Commission | Layer1_JD_ค้าส่ง_ครบ7ตำแหน่ง.docx |
| SWT-ONL | — | ❌ ยังไม่เริ่ม | — |
| WPS-EXP | — | ❌ ยังไม่เริ่ม | — |
| SWT-ACC/SVC/WH/DLV/HR | — | ❌ ยังไม่เริ่ม | — |

---

## โครงสร้างรายได้ที่ตกลงแล้ว (ค้าปลีก SWE-RET)

> อ่านรายละเอียดเพิ่มเติมใน `references/salary-commission.md`

**ระดับ Executive:**
- Sales Director / Area Manager: 17,000 base + 1,200 ตำแหน่ง + 2,000 ปสก.max + 200 โทร + 1,000 น้ำมัน
- Retail Manager: 14,000 (13,000 ทดลอง) + 1,200 ตำแหน่ง + 2,000 ปสก.max + 300 โทร + 1,000 น้ำมัน

**ระดับ Supervisor:**
- หัวหน้าสาขา: 13,000 (12,000 ทดลอง) + 800 ตำแหน่ง + 1,500 ปสก.max + 300 โทร
- แคชเชียร์: 13,000 (12,000 ทดลอง) + 800 ตำแหน่ง

**ระดับ Staff:**
- พนักงานขาย Nominee: 360/วัน ทดลอง + 1,000 Nominee bonus → 10,560/เดือน เต็มเวลา
- พนักงานจัดส่ง: 12,000 ทดลอง → 13,000 บรรจุ
- Online Staff: 11,000 ทดลอง → 12,000 + 3,000 ค่าความรับผิดชอบ

**Commission ค้าปลีก (2 ส่วน):**
1. Branch Sales Commission: 50% ของ commission สาขา + 100 บาท/case (min 5 case/เดือน, ≥90% brand target)
2. Brand Commission (Nominee): 50% ของ brand commission + 50 บาท/case แบ่งตาม brand (no-target brands = 10%)
- Bonus <70% target: 2,000/800 บาท หรือ 40/20 บาท/case
- วงเงินส่วนลด: max 3% ทุกระดับ (ไม่ต้องขออนุมัติ)

---

## ระบบ Nominee/PC

พนักงานขายสาขาลงทะเบียนเป็น Brand PC แต่เงินทุกส่วนผ่านแสงวิจิตร ขายได้ทุก brand เป้า = เป้าสาขา commission pool รวมแล้วกระจายตามระบบแสงวิจิตร

---

## ระบบ Consignment (SWE-RET)

- SWE ไม่เป็นเจ้าของสต็อกในทางบัญชี แต่**ต้องรับผิดชอบสต็อกจริง**
- SWE ได้รับ commission 10–15% จาก SWT
- สินค้าหายหรือเสียหาย → SWE จ่ายคืน SWT
- SOP และ Layer 0 ต้องสะท้อน operational reality ไม่ใช่แค่ accounting treatment

---

## วิธีสร้างไฟล์ .docx

ใช้ Node.js + `docx` library เสมอ ด้วย pattern ที่กำหนดในโปรเจกต์

**อ่าน `references/docx-pattern.md` ก่อนเขียน code ทุกครั้ง**

สิ่งที่ต้องรักษาให้สม่ำเสมอทุกไฟล์:
- Font: TH Sarabun New ทุกที่
- Color palette: ดูใน `references/docx-pattern.md`
- Header: ชื่อกลุ่ม + Layer + แผนก + Rev ทุกหน้า
- Footer: "CONFIDENTIAL — สำหรับใช้ภายในองค์กรเท่านั้น | หน้า [N]"
- TBD Box: สีส้ม (#FFF3E0 background, orange border) สำหรับข้อมูลที่ยังไม่ครบ
- TBD Summary Page: ท้ายไฟล์ทุกฉบับที่มี TBD

---

## กฎการทำงาน

1. **ถามก่อนเขียนเสมอ** กรณีข้อมูลสำคัญยังขาด (เงินเดือน / Commission) — แต่ถ้าผู้ใช้บอกให้ใส่ TBD ให้ใส่ TBD แล้วสร้าง TBD Summary ท้ายไฟล์
2. **ไม่ข้ามนิติบุคคล** — ตรวจ entity prefix ก่อนออกรหัสทุกครั้ง
3. **อัปเดต Master Document Register** ทุกครั้งที่ออกเอกสารใหม่
4. **KPI ต้องเชื่อมกับยอดขาย** — ไม่ใช่แค่ตัวชี้วัดพฤติกรรม ต้องมีตัวเลขเป้าหมายชัดเจน
5. **Career Path** ต้องอยู่ใน JD ทุกตำแหน่ง
6. **TBD fields** ต้องระบุชัดเจน — ไม่เขียนค่าสมมติแทน

---

## ไฟล์ Reference

- `references/docx-pattern.md` — Node.js code patterns, helper functions, color palette
- `references/salary-commission.md` — ข้อมูลเงินเดือน/Commission ที่ตกลงแล้วทุกแผนก
- `references/document-register.md` — Master Document Register logic และ running number

อ่าน reference ที่เกี่ยวข้องก่อนเขียน code ทุกครั้ง
