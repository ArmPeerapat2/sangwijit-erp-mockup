# SVC — Claim as Job Type Spec (เคลม = ประเภทงานใน Service Intake)

> **สถานะ:** decisions locked (grill เคลม Q1-Q15 · 2026-07-01) + เชื่อมใบลดหนี้ (grill SL-CN Q1-Q10 · 2026-07-02)
> **ที่มา:** ไฟล์นี้เขียนย้อนหลัง 2026-07-02 จาก memory + active.md — grill transcript เดิมถูก compact ไปแล้ว รายละเอียดบางจุดจึง mark ⚠️ ต้องยืนยัน
> **Trust:** ไฟล์นี้แพ้ mockup จริง (`sv1-service-intake-mockup.html`, `clm-vendor-claim-mockup.html`) ถ้าขัดกัน

---

## 1. หลักการใหญ่ (ห้าม re-litigate)

**งานเคลม (CL-1 เดิม) ไม่เป็น module แยก** — เป็น **ประเภทงาน (job type)** หนึ่งใน Service Intake (SV-1)
- Service form เดิมเป็น **skeleton ร่วม** ทุกประเภทงาน · แต่ละ job type toggle **extension ของตัวเอง**
- **claim = job type ไม่ใช่ source** — source (walk-in / โทร / LINE / หน้าร้าน) เป็นช่องทางล้วน ไม่กำหนดชนิดงาน
- module CL-1/CL-2/CL-3 ใน spec เดิม → decomposed: intake อยู่ SV-1 · ติดตาม vendor อยู่ CLM · ใบลดหนี้เจ้าหนี้อยู่ PO-CN

## 2. Job Types (5 ประเภท — ตัด "จัดส่ง" ออก)

| Job type | รูปแบบ extension | หมายเหตุ |
|---|---|---|
| 🔧 ซ่อม | **core** (skeleton หลัก) | งาน default |
| ♻️ เคลม Vendor | **popup** (built แล้ว) | ดู §3 |
| 🏗️ ติดตั้ง | **inline section** | ดู §8 |
| 🧪 ตรวจเช็ค | shared checklist | ใช้ checklist ร่วมกับล้าง |
| 🚿 ล้าง | shared checklist | ใช้ checklist ร่วมกับตรวจเช็ค |

- **จัดส่ง** = logistics → อยู่ WH ไม่ใช่ SV · **ส่ง+ติดตั้ง** → ยุบเข้า job type ติดตั้ง
- ⚠️ mockup `sv1-service-intake-mockup.html` ปัจจุบันแสดง dropdown 4 ตัวเลือก (ซ่อม/ติดตั้ง/ตรวจสภาพ/เคลม Vendor) — "ตรวจสภาพ" ยังไม่แยกเป็น ตรวจเช็ค/ล้าง → จุดตรวจตอน build

## 3. Claim Flow (job type เคลม)

### Entry
- **S/N-first** — เริ่มจากสแกน/กรอก Serial Number → ระบบดึงประวัติซื้อ+ประกัน+vendor
- **5 menu resolution (A-E)** — ⚠️ รายละเอียดเมนู A-E หายจาก transcript ต้อง re-grill ก่อน build หน้า resolution

### ผลจบงานเคลม 3 ทาง (grill SL-CN Q9 · 2026-07-02)

| ผลจบ | เอกสารที่เกิด | เงินลูกค้า |
|---|---|---|
| ① ซ่อมเสร็จคืนลูกค้า | จบใน SV — ไม่มีเอกสารเงิน | ไม่เกี่ยว |
| ② เปลี่ยนตัวใหม่ (replace) | จบใน SV/WH: เบิกเครื่องใหม่ → ไล่ vendor ผ่าน CLM→PO-CN | ไม่เกี่ยว — **ห้ามออก SL-CN** |
| ③ คืนเงิน/ลดหนี้ | ส่ง**คำขอ**เข้า SL-Q กลุ่ม CN (badge 🛠️ จากเคลม SV) → Sales ออก **SL-CN** | ลด AR ผ่าน SL-CN |

- SV **ไม่ออกเอกสารบัญชีเอง** — ส่งคำขอเท่านั้น (pattern เดียวกับ CLM→PO-CN)
- ของที่รับตอน intake = หลักฐาน "รับของคืนแล้ว" ของ SL-CN gate ของก่อนเงิน — ไม่ต้องรับซ้ำที่ WH

## 4. Cost Rule (binary — ไม่แบ่ง %)

- ภาระค่าเคลม = **Vendor 100%** หรือ **SWT รับภาระเอง** — เลือกอย่างเดียว ไม่มีสัดส่วน
- **ลูกค้าไม่จ่ายค่าเคลมเสมอ** (ในประกัน) — เคสนอกประกัน = งานซ่อมปกติ ไม่ใช่ job type เคลม

## 5. Approval (2 ชั้น)

| ชั้น | ผู้อนุมัติ | code |
|---|---|---|
| ภายในศูนย์ | ผจก.ศูนย์บริการ | INT-APPR |
| ภายนอก/เซล | จนท.เซล/บริการ | EXT-APPR |

- Maker≠Checker ตามมาตรฐาน CF-2.6

## 6. Vendor Settlement (V1-V5)

- ผลตอบจาก vendor มี 5 แบบ **V1-V5** — ที่ยืนยันได้: **V4 = vendor ปฏิเสธ → ออกเอกสาร VRA** (Vendor Rejection Acknowledgement)
- ⚠️ นิยาม V1/V2/V3/V5 หายจาก transcript — ต้อง re-grill (คาดเดา: ของใหม่ทดแทน / CN / ซ่อมให้ / คืนเงิน — **ห้ามใช้จนกว่ายืนยัน**)
- Chain ที่ build แล้ว (ดู `clm-vendor-claim-mockup.html`): SV-4 ปิดงาน (ระบุเคลม) → CLM ใบเคลม + ตั้ง ARI (Vendor billing AR) → vendor อนุมัติ → **APCN (PO-CN)** ตัด ARI → "รอหักหนี้" → PO-6 ดึงไปหัก

## 7. คลังเคลม

- คลังเฉพาะ **WH-SVC-CTR** + **6 bins** — ⚠️ รายชื่อ bin หายจาก transcript ต้อง re-grill (คาด: รอตรวจ/รอเคลม/รอส่ง vendor/รอรับคืน/เปลี่ยนตัว/ซาก)
- **SLA = visibility เท่านั้น ไม่ enforce** (แสดงเตือน ไม่ block งาน) · Reply Supplier ≤ 7 วัน (จาก SV_service.md เดิม)

## 8. Job Type ติดตั้ง (บันทึกไว้กันหาย — ไม่ใช่เคลมแต่ล็อกใน grill เดียวกัน)

- Service **pull งานติดตั้งจาก SL** (บิลขายที่มีติดตั้ง → auto เข้าคิว SV)
- **1 job ต่อ 1 site** — หลายจุดติดตั้งในไซต์เดียว = job เดียว
- Stock ที่ใช้ **สืบทอดจาก SL-2/SL-4** (ของที่จอง/ขายแล้ว) — ไม่เบิกใหม่

## 9. Reuse Map (✦ = มีแล้ว ห้าม build ซ้ำ)

| งาน | ใช้ของเดิม |
|---|---|
| รับของเคลมเข้าคลัง | ✦ WH-1 |
| เบิกเครื่องเปลี่ยนตัว | ✦ WH-3 |
| ลดหนี้ลูกค้า | ✦ SL-CN (ผ่านคำขอใน SL-Q) |
| stock งานติดตั้ง | ✦ SL-2 / SL-4 |
| ลดหนี้เจ้าหนี้ (vendor CN) | ✦ PO-CN |
| รับเงินจาก vendor | ✦ FI-1 |
| คิวงานช่าง | ✦ service board (SV-Q) |

## 10. ⚠️ ต้อง re-grill ก่อน build (รายละเอียดหายจาก transcript)

1. เมนู resolution **A-E** ตอน entry — มีอะไรบ้าง
2. นิยาม vendor settlement **V1/V2/V3/V5** (V4=refuse+VRA ยืนยันแล้ว)
3. รายชื่อ **6 bins** ใน WH-SVC-CTR
4. SLA target ต่อขั้น (มีแค่ Reply Supplier ≤ 7 วัน)
5. job type ตรวจเช็ค/ล้าง — checklist ร่วมหน้าตาเป็นยังไง

## ไฟล์เกี่ยวข้อง

| ไฟล์ | บทบาท |
|---|---|
| `sv1-service-intake-mockup.html` | intake + dropdown ประเภทงาน |
| `clm-vendor-claim-mockup.html` | ใบเคลม vendor + chain ARI/APCN |
| `sv4-service-close-mockup.html` | ปิดงาน → trigger เคลม |
| `slq-sales-queue-mockup.html` | คิวคำขอลดหนี้จากเคลม (กลุ่ม CN) |
| `slcn-credit-memo-mockup.html` | ใบลดหนี้ปลายทาง (ผลจบ ③) |
| `po-cn-credit-note-mockup.html` | ใบลดหนี้เจ้าหนี้ (ไล่ vendor) |
| `sangwijit-portal-skill/modules/SV_service.md` | spec module SV (CL-1/2/3 เดิม = decomposed) |
