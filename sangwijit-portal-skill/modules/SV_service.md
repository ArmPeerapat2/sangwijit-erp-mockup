# SV — Service & Claims Module Spec (งานบริการ + เคลม)

**Version:** 1.0 | **Phase:** P2 (ทุกเมนู)
**Module Code:** SV
**BC Entity หลัก:** serviceOrders (5900/5901), serviceItemComponents (5943)
**อ่าน Flowchart ก่อน:** `/Design Ai/Flow Design/Service/` (00–06)
**ไฟล์ซ้ำที่ตัดสินใจแล้ว:** ใช้ `06...คืนของ Vendor.pdf` เป็น Reference หลัก

---

## 📋 Menu List (sync กับโครงจริง 2026-07-02 — mockup ชนะ spec เดิม)

| รหัส | เมนู | ไฟล์จริง | State หลัก |
|---|---|---|---|
| SV-Q | Service Queue Dashboard (ทุกสถานะ) | `sv-q-service-queue-mockup.html` | filter ตาม state |
| SV-1 | ใบรับงานซ่อม (รับเรื่อง · ประมาณการ · **job type selector**) | `sv1-service-intake-mockup.html` | `รอมอบหมาย` |
| SV-2 | **ใบมอบหมายงาน** (Admin เลือกช่าง+นัด) — *ไม่ใช่ Job Card ตาม spec เดิม* | `sv2-service-assignment-mockup.html` | `รอมอบหมาย → มอบหมายแล้ว` |
| SV-5 | Job Card ช่าง (กรอกอาการ+แก้ไข) | `sv5-job-card-mockup.html` | `งานช่าง → ส่งงาน/รออะไหล่` |
| SV-3 | เบิกอะไหล่จาก**สต็อก** | `sv3-spare-part-issue-mockup.html` | `PendingApproval → Issued` |
| SV-Order | **สั่งอะไหล่** (ไม่มีในสต็อก · spawn PO-4) | `sv-order-parts-request-mockup.html` | `สั่ง → จ่าย → รอรับ → นัด → คืนของเก่า` |
| SV-4 | ใบรับสินค้าจากงานซ่อม (admin pricing + Vendor billing) | `sv4-service-close-mockup.html` | `รอส่งคืนลูกค้า` |
| SV-7 | ส่งงานลูกค้า (เซ็น+QR+Invoice+ปิดงาน) | `sv7-service-delivery-mockup.html` | `ปิดงาน (เรา-ลูกค้า)` |
| SV-6 | จัดส่งและติดตั้ง (Delivery & Installation · แยก loop) | `sv6-delivery-install-mockup.html` +2 sub | — |
| CLM | ใบเคลม Vendor (ติดตาม + settlement) | `clm-vendor-claim-mockup.html` | `Draft → ส่งเคลม → รอ vendor → APCN` |
| ~~CL-1~~ | ~~รับเรื่องเคลม Supplier~~ **decomposed** → เคลม = job type ใน SV-1 intake | — | เคลม |
| ~~CL-2~~ | ~~ส่งเคลม & ติดตาม~~ **decomposed** → CLM ใบเคลม vendor (`clm-vendor-claim-mockup.html`) | — | เคลม |
| ~~CL-3~~ | ~~ใบลดหนี้เคลม~~ **decomposed** → PO-CN ใบลดหนี้เจ้าหนี้ (ฝั่ง vendor) · SL-CN (ฝั่งลูกค้า ผ่านคำขอใน SL-Q) | — | เคลม |

> **🔒 CL decomposed (grill 2026-07-01 + SL-CN grill 2026-07-02):** เคลม**ไม่เป็น module แยก** — เป็น**ประเภทงาน (job type)** ใน SV-1 Service Intake · ผลจบ 3 ทาง (ซ่อม = จบใน SV / เปลี่ยนตัว = SV+WH → ไล่ vendor ผ่าน CLM→PO-CN / คืนเงิน = ส่งคำขอ → SL-Q → SL-CN) · cost binary (Vendor 100% หรือ SWT) ลูกค้าไม่จ่าย · **full spec: `.agents/svc-claim-jobtype-spec.md`** — section CL-1/2/3 ด้านล่างเก็บไว้เป็น reference field-level เท่านั้น ห้ามใช้เป็นโครง module

---

## SV-Q — Service Queue Dashboard

### Layout
```
┌──────────────────────────────────────────────────────┐
│  SERVICE QUEUE | สาขา | ช่าง | วันที่                 │
│  Filter: สถานะ | ช่าง | ประเภทงาน | Priority         │
├──────────────────────────────────────────────────────┤
│  Panel A: รับเรื่องใหม่ (ยังไม่มีช่าง)              │
│  Panel B: นัดหมายแล้ว (รอวันนัด)                    │
│  Panel C: รอช่าง (ในเวลา SLA)                        │
│  Panel D: กำลังดำเนินงาน                             │
│  Panel E: รอ QA / ส่งงาน                             │
│  Panel F: ⚠️ เกิน SLA (สีแดง)                       │
└──────────────────────────────────────────────────────┘
```

### SLA Targets
| ประเภทงาน | SLA Target |
|---|---|
| รับซ่อม (นัดช่าง) | ≤ 24 ชั่วโมง |
| ซ่อมเสร็จ | ≤ 3 วันทำการ |
| ส่งมอบ (Delivery) | ตามวันนัด ± 0 |
| เคลม (Reply Supplier) | ≤ 7 วัน |

### SC ที่ใช้
SC1, SC7, SC8

---

## SV-1 — รับเรื่องซ่อม (Service Intake)

### Module Brief
```
Module:  SV-1 Service Intake
Phase:   P2
BC:      serviceOrders (Header 5900)
Trigger: ลูกค้านำสินค้ามาซ่อม หรือโทรแจ้ง
Output:  Service Order + นัดหมายช่าง
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: รับเรื่องซ่อม | Status Badge (รับเรื่อง/นัดหมาย/รอช่าง/ดำเนินงาน/เสร็จ/ปิด)
ActionBar: [Save] [นัดหมายช่าง] [พิมพ์ใบรับสินค้า]
```

**Section 2 — Doc Header**
```
เลขที่รับซ่อม : Auto | วันที่รับ    : Today
ประเภทงาน    : ซ่อม / ติดตั้ง / ตรวจสภาพ / เคลม
อ้างอิงบิล   : SC5 (บิลขายต้นทาง — ถ้ามี)
วันนัดช่าง   : Required (ระบุทันที)
ช่างที่รับผิดชอบ: Assign จาก Technician List
```

**Section 3 — Party (SC1)**
```
ลูกค้า: SC1 CustomerSearch
ที่อยู่ซ่อม: SC4 (3 Address Types — UX6)
```

**Section 4 — สินค้าที่นำมาซ่อม (SC2 + SC8)**
```
SC2: ค้นหาสินค้า (รหัส/ชื่อ/รุ่น)
Serial No.: SC8 — ยิง Barcode หรือพิมพ์ (ตรวจสอบว่า Serial นี้เคยซื้อหรือไม่)
อาการที่แจ้ง: Textarea (อาการตามลูกค้าบอก)
การตรวจสอบเบื้องต้น: (ช่างประเมิน)
ประเภทการรับประกัน: [ในประกัน] [นอกประกัน] [เคลม Vendor]
ประมาณค่าใช้จ่าย: (ถ้านอกประกัน)
```

**Section 5 — Tabs**
```
Tab [นัดหมาย]: วันที่ / เวลา / ช่าง / สถานที่
Tab [รูปถ่าย]: รูปสภาพก่อนซ่อม (Before Photo)
Tab [อ้างอิง]: SC5 → บิลขาย, ใบรับประกัน
Tab [ประวัติ]: SC7 Timeline
```

**Section 7 — Action Bar**
```
รับเรื่อง   : [Save] [นัดหมาย] [Assign ช่าง] [พิมพ์ใบรับ]
นัดหมาย    : [แก้ไขนัด] [ส่งให้ช่าง (Mobile)]
```

### Status Flow
```
รับเรื่อง → นัดหมายแล้ว → รอช่าง → ดำเนินงาน → ส่งงาน/รออนุมัติ → ปิดงาน
                                                        ↓ (ช่างนอก)
                                                   ตั้งหนี้ค่าแรง
```

### BC API
```
POST /serviceOrders                 → สร้าง Service Order
PATCH /serviceOrders/{id}           → แก้ไข/Update Status
GET  /customers/{id}                → ประวัติลูกค้า
GET  /itemSerialNumbers?serialNo=   → ตรวจ Serial ประวัติ
```

### Business Rules
- Serial ต้องตรวจว่าซื้อจากแสงวิจิตรหรือไม่ → ถ้าไม่พบ → แจ้งลูกค้า (นอกประกัน)
- ถ้า ในประกัน → ตรวจวันที่ซื้อ + เงื่อนไขประกัน → ยืนยันโดยระบบ

---

## SV-2 — ใบงานช่าง (Job Card)

### Module Brief
```
Module:  SV-2 Job Card
Phase:   P2
BC:      serviceOrders (5900) + serviceLines (5901)
Trigger: ช่างรับงาน → บันทึกผลการซ่อม
Output:  Job Card พร้อม Parts + ค่าแรง
```

### หน้าจอ (Mobile-Optimized)
```
[รับงาน / Check-in ที่งาน]
สินค้าที่ซ่อม: [ชื่อ / รุ่น / Serial]
อาการที่พบจริง: [Textarea]

Parts ที่ใช้:
  SC2 ค้นหาอะไหล่ | จำนวน | หน่วย | ราคา
  Barcode Scan: ✅

ค่าแรง:
  ประเภทงาน | ชั่วโมง | อัตรา (Auto จาก Technician Template)

รูปถ่าย Before/After: [Upload]

[บันทึก] [ปิดงาน → SV-4]
```

### SC ที่ใช้
SC2, SC7, SC8

### BC API
```
POST /serviceItemComponents   → บันทึก Parts ที่ใช้
PATCH /serviceOrders/{id}    → Update สถานะ + ผลงาน
POST /serviceLines            → บันทึกค่าแรง
```

---

## SV-3 — เบิกอะไหล่ (Parts Requisition)

### Module Brief
```
Module:  SV-3 Parts Requisition
Phase:   P2
BC:      serviceItemComponents (5943) + warehouseIssue
Trigger: ช่างต้องการอะไหล่ระหว่างซ่อม
Output:  อะไหล่ออกจากสต็อก + บันทึกต้นทุน
```

### ERP Form

**Section 4 — Line Items (SC2 + SC8)**
```
SC2: ค้นหาอะไหล่ (ค้น by รหัส / ชื่อ / Barcode)
แสดงสต็อกคลังช่าง Real-time
SC8: ถ้าอะไหล่มี Serial → ระบุ Serial ที่เบิก
จำนวน: เบิกได้ไม่เกินสต็อก
```

### Business Rules
- เบิกอะไหล่เกิน Service Order → ต้องขออนุมัติ WH Manager
- ค่าอะไหล่ → บวกเข้า Service Invoice อัตโนมัติ
- อะไหล่ เคลม Vendor → ไม่คิดเงินลูกค้า → บันทึก Claim แยก (CL-1)

### BC API
```
POST /serviceItemComponents   → เบิกอะไหล่
GET  /items/{id}/stockByLocation  → ตรวจสต็อกคลังช่าง
```

---

## SV-4 — ปิดงาน / QA (Service Close & QA)

### Module Brief
```
Module:  SV-4 Service Close
Phase:   P2
BC:      serviceOrders → Post
Trigger: ช่างซ่อมเสร็จ → ส่งให้ QA หรือลูกค้ารับ
Output:  ปิด Service Order + ออก Invoice (ถ้านอกประกัน)
```

### หน้าจอ
```
Section QA Checklist:
  ✅ ทดสอบฟังก์ชั่นหลัก
  ✅ ทดสอบฟังก์ชั่นย่อย
  ✅ ทำความสะอาด / แพ็ค
  ✅ ถ่ายรูป After

ลูกค้าเซ็นรับ: [Digital Signature Pad]

Rating: ⭐⭐⭐⭐⭐

ผล: [ส่งคืนลูกค้าแล้ว] [ยังซ่อมไม่ได้ → ส่ง Claim Vendor]
```

### Business Rules
- ในประกัน: ปิดงาน → ไม่มีค่าใช้จ่าย → แต่บันทึกต้นทุนใน BC
- นอกประกัน: ปิดงาน → ออก Service Invoice → ลูกค้าจ่าย
- ซ่อมไม่ได้: → Trigger CL-1 (ส่ง Claim Vendor) โดยอัตโนมัติ

---

## SV-6 — จัดส่งและติดตั้ง (Delivery & Installation)

> **Note:** renamed from DL-1 (2026-04-22) to align with Service module scope.
> File: `sv6-delivery-install-mockup.html` · Previous: `dl1-delivery-planning-mockup.html`

### Module Brief
```
Module:  SV-5 Delivery & Installation
Phase:   P2
BC:      warehouseShipment + serviceOrders
Trigger: Sales Invoice มี Delivery Flag = true → สร้าง Delivery Job Auto
Output:  ส่งสินค้า + ติดตั้ง + ลูกค้าเซ็นรับ
```

### หน้าจอ

**SV-5.1 Delivery Queue**
```
คิวงานจัดส่ง/ติดตั้ง แยกตาม Branch + วันนัด + ช่าง
SLA: ต้องไปถึงภายในวันนัด ± 0
```

**SV-5.2 Delivery Job Card**
```
เลขที่ Delivery | วันที่นัด | ช่าง/คนส่ง
สินค้า: รหัส | ชื่อ | Serial (SC8) [Required ก่อน Close]
ที่อยู่จัดส่ง: SC4 → 3 Address Types (UX6)
แผนที่: Google Maps Link (ถ้ามี)
```

**SV-5.3 Delivery Completion**
```
Serial Confirm: ยิง Barcode ยืนยัน Serial ที่ส่ง
รูปถ่าย Before Install / After Install
ลูกค้าเซ็นรับ: Digital Signature
Rating: ⭐⭐⭐⭐⭐
QR Track Update: อัปเดตสถานะ "ส่งมอบแล้ว" (UX9)
```

### Business Rules
- Serial ต้องยืนยันก่อน Close (ต้องตรงกับ Invoice)
- ถ้าส่งไม่ได้ → Update สถานะ "ส่งไม่สำเร็จ" + แจ้ง Sales

---

## CL-1 — รับเรื่องเคลม Supplier (Claim Intake)

> ⚠️ **DECOMPOSED** — section นี้เป็น reference field-level เท่านั้น · เคลม = job type ใน SV-1 (ไม่ใช่ module แยก) · โครงจริงดู `.agents/svc-claim-jobtype-spec.md`

### Module Brief
```
Module:  CL-1 Claim Intake
Phase:   P2
BC:      Custom Claim Table (ไม่มี Standard BC)
Trigger: สินค้าชำรุด (ในประกัน) หรือ ซ่อมไม่ได้ → ส่งคืน Vendor
Output:  Claim Case พร้อมส่ง Vendor
```

### ประเภทเคลม
- **ซ่อมในประกัน**: ลูกค้านำมาซ่อม → ซ่อมแล้วส่งคืน (ไม่มีเคลมเงิน)
- **คืนของ Vendor (เคลม)**: ซ่อมไม่ได้ / ชำรุดจาก Factory → คืน Vendor → รับของใหม่หรือ Credit Note

### ERP Form

**Section 2 — Doc Header**
```
เลขที่เคลม   : Auto | วันที่เคลม   : Today
ประเภทเคลม   : [คืนสินค้า] [ขอ Credit Note] [ขอของใหม่ทดแทน]
Vendor ที่เคลม : Required
อ้างอิง PO/GRN: SC5
```

**Section 4 — สินค้าที่เคลม (SC2 + SC8)**
```
รหัสสินค้า | ชื่อ | Serial | อาการชำรุด | รูปถ่าย | มูลค่า
SC8: Serial ที่เคลม (ตรวจสอบว่าซื้อจาก Vendor นี้จริง)
```

**Section 5 — Tabs**
```
Tab [เอกสาร]: แนบรูป, ใบ GRN ต้นทาง, รายงานช่าง
Tab [ประวัติ]: SC7 Timeline (วันส่ง / Vendor ตอบ / ปิด)
```

### Status Flow
```
Draft → ส่ง Vendor → รอผล → Vendor ตอบรับ → รับของใหม่/CN → ปิด
                               ↓
                           Vendor ปฏิเสธ → Escalate
```

---

## CL-2 — ส่งเคลม & ติดตาม

### หน้าจอ Tracking
```
เลขที่เคลม | Vendor | วันส่ง | วันตอบรับ | สถานะ | มูลค่า
[Email Vendor] [ติดตาม] [บันทึกผลตอบ]
```

### Business Rules
- Claim ต้องตอบภายใน 7 วัน → Alert ถ้าเกิน
- ถ้า Vendor ตอบรับ Credit → สร้าง AP Credit Memo อัตโนมัติ (CL-3)

---

## CL-3 — ใบลดหนี้เคลม (Claim Credit Note)

### Module Brief
```
Module:  CL-3 Claim Credit Note
Phase:   P2
BC:      purchaseCreditMemos
Trigger: Vendor อนุมัติเคลม → ออก AP Credit Note
Output:  ลด AP + บันทึกรับสิทธิ์
```

### BC API
```
POST /purchaseCreditMemos                            → สร้าง AP CM
POST /purchaseCreditMemos/{id}/Microsoft.NAV.post   → Post
```

---

## 📌 Service Module — Business Rules รวม

1. **Serial Track**: ทุก Service Job ต้องมี Serial สินค้าที่ซ่อม
2. **Warranty Check**: ตรวจ Serial vs GRN Date อัตโนมัติ → แสดงสถานะประกัน
3. **Photo Required**: รูปก่อน-หลัง บังคับก่อนปิดงาน
4. **Customer Signature**: Digital Signature บังคับก่อน Close (SV-4, SV-5.3)
5. **SLA Timer**: แสดง SLA Countdown ใน Queue ทุก Card
6. **Claim Auto-Trigger**: SV-4 → ซ่อมไม่ได้ → Auto สร้าง CL-1
7. **Delivery Auto-Trigger**: Invoice + Delivery Flag → Auto สร้าง SV-5 Job

---

## 🗄️ BC Table Reference (Service)

| เอกสาร | Table No. | Endpoint |
|---|---|---|
| Service Order Header | 5900 | /serviceOrders |
| Service Order Line | 5901 | /serviceOrderLines |
| Service Item Component | 5943 | /serviceItemComponents |
| Purchase Credit Memo | 121 | /purchaseCreditMemos |
