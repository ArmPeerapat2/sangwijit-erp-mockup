# CF-2.7 Document Template — โครงสร้างที่เคาะ (2026-06-03 · ก่อน build)

> docs-first: spec `.claude/skills/sangwijit-portal/modules/CF_config.md` CF-8 (Email + PDF Template) · mockup เดิม `cf2-7-doc-template-mockup.html` (= "Doc Template & Running Number" 5 tabs)

## ปัญหา mockup เดิม
ชื่อเดิม "CF-2.7 Document Template **& Running Number**" — 2 ใน 5 tabs ทับ CF-2.2 (ADR-0004):
- Tab 3 Document Code + Running · Tab 4 Format Pattern Builder → **ของ CF-2.2 ไปแล้ว**

## Decisions (confirm 2026-06-03)
1. **Document Group (กลุ่มเอกสาร)** → **ย้ายไป CF-2.2** เป็นเจ้าของ (รหัสผูกกับ running อยู่แล้ว) · CF-2.7 + CF-1 แค่ lookup
2. **Tax Group tab** → **ตัดออก** (ภาษี = CF-2.1 cut-to-BC)
3. **ขอบเขต CF-2.7** = แม่แบบเอกสารล้วน: **Email Template + PDF/Print Template ทั้งคู่** (SWT ส่งทั้ง mail + เอกสารพิมพ์)

## โครงใหม่ที่เสนอ (5 tabs — focus template)
| Tab | เนื้อหา |
|---|---|
| 1. Template List | รายการแม่แบบแยก doc type (+ SL-RQ/RT/CN/DN ใหม่) · แต่ละ doc มี Email + PDF |
| 2. Email Template | Subject + Body HTML + token + CC/BCC + แนบ PDF + ลายเซ็น + ภาษา TH/EN |
| 3. PDF/Print Template | หัวกระดาษ + โลโก้ + header/footer + ขนาดกระดาษ + QR + signature + สีแบรนด์ |
| 4. Tokens + เงื่อนไข | คลัง token ({DocNo}/{CustomerName}/{Amount}…) + conditional IF/THEN |
| 5. Preview / ทดสอบส่ง | render สด + ส่งทดสอบเข้า email/LINE ตัวเอง |

## ค้าง
- build proposal ใหม่แยก `_proposal/cf27-doc-template-proposal.html` (เก็บ mockup เดิมเป็น ref)
- ต้อง note ใน CF-2.2 ว่ารับ Document Group master เพิ่ม
