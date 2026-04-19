---
name: sangwijit-accounting
description: >
  ระบบความรู้และ SOP งานบัญชีกลุ่มแสงวิจิตร ครอบคลุม 4 นิติบุคคล (SWT/SWE/VMN/WPS)
  สำหรับทุกตำแหน่งในฝ่ายบัญชี: ผู้จัดการบัญชี, AP เจ้าหนี้/ชำระเงิน,
  AR ลูกหนี้/รับชำระ, GL บัญชีแยกประเภท, Tax/VAT, การเงิน/ธนาคาร
  รวมถึง Mindset: AP (ตรวจสอบ 3 ชั้น), การเงิน (Cash Flow Control)
  ใช้ skill นี้ทุกครั้งที่: ถามขั้นตอนงานบัญชี, เงื่อนไข VAT/ภาษี,
  SOP รับ/จ่ายเงิน, ปิดบัญชี, KPI, สอนพนักงานบัญชีใหม่, หรือเตรียม Audit
  หมายเหตุ: เรื่อง Vendor Agreement / Vendor Obligation → ใช้ sangwijit-purchasing
---

# Sangwijit Accounting Skill

## Skill Boundary — ขอบเขตที่ชัดเจน

```
sangwijit-accounting  ← บัญชีและการเงิน (AP/AR/GL/Tax/Finance)
sangwijit-purchasing  ← จัดซื้อ Vendor/ห้าง/Agreement/Obligation
```

> AP ต้องรู้ว่าจะถามจัดซื้อเรื่องอะไรก่อนจ่าย
> แต่รายละเอียด Vendor Agreement อยู่ใน sangwijit-purchasing

## วิธีใช้ Skill นี้

| เมื่อถามเรื่อง | อ่าน reference |
|---------------|----------------|
| ภาพรวม 4 นิติบุคคล / flow เงิน / โครงสร้างทีม | `01-overview.md` |
| AP — SOP เจ้าหนี้ / จ่ายเงิน / 3-layer check | `02-ap.md` + `11-ap-mindset.md` |
| AR — SOP ลูกหนี้ / รับชำระ / Credit Control | `03-ar.md` |
| VAT / ภาษีหัก ณ ที่จ่าย / ภงด. / VAT Refund WPS | `04-tax.md` |
| GL — บัญชีแยกประเภท / ปิดบัญชี / รายงาน | `05-gl-closing.md` |
| การเงิน / ธนาคาร / Cash Management / Bank Rec | `06-finance-bank.md` + `12-finance-mindset.md` |
| KPI รายตำแหน่ง / ตัวชี้วัดงานบัญชี | `07-kpi.md` |
| ระบบ Hero (ปัจจุบัน) | `08-system-hero.md` ← TBD |
| Microsoft Dynamics BC (Q4) | `09-system-dynamics.md` ← TBD |
| **Mindset AP** — ตรวจสอบ 3 ชั้น / โครงสร้างราคา | `11-ap-mindset.md` |
| **Mindset การเงิน** — กระทบยอด / โยกเงิน / Cash Report | `12-finance-mindset.md` |
| Vendor Obligation / Agreement Analysis | → **sangwijit-purchasing** |

## หลักการแยก Layer

```
Layer 1 — หลักการ (ไม่เปลี่ยนตามระบบ) = ไฟล์ 01–07, 11–12
  ← เงื่อนไข VAT, นโยบายบัญชี, SOP, KPI, Mindset
  ← ใช้ได้ทันที ไม่ว่าจะใช้ระบบไหน

Layer 2 — ระบบ (ผูกกับ Software) = ไฟล์ 08–09
  ← เมนู, หน้าจอ, วิธีบันทึก
  ← เพิ่มทีหลังเมื่อระบบพร้อม
```

## โหมดการทำงาน

| คำขอ | Claude จะทำ |
|------|-----------|
| "ขั้นตอนจ่ายเงิน Supplier ทำยังไง?" | SOP AP + 3-layer check จาก `02`+`11` |
| "ก่อนจ่าย Vendor ต้องตรวจอะไร?" | AP Mindset 3 ชั้น จาก `11` |
| "VAT ใบนี้คิดยังไง?" | อธิบายพร้อมตัวอย่างเลข จาก `04` |
| "ปิดบัญชีสิ้นเดือนต้องทำอะไรบ้าง?" | Checklist จาก `05` |
| "เงินเข้าผิดบัญชีทำยังไง?" | Finance Mindset จาก `12` |
| "KPI บัญชี AP ต้องวัดอะไร?" | KPI รายตำแหน่งจาก `07` |
| "Vendor ค้างอะไรกับเรา?" | → แนะนำให้ใช้ **sangwijit-purchasing** |
| "วิเคราะห์ Agreement ห้าง/Vendor" | → แนะนำให้ใช้ **sangwijit-purchasing** |
