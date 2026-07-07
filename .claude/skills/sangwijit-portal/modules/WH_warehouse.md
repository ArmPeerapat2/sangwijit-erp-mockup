# WH — Warehouse Module Spec (งานคลัง)

**Version:** 1.0 | **Phase:** P1 | **Module Code:** WH
**BC Entity หลัก:** transferOrders (5740/5741), itemLedgerEntries (32), warehouseEntries
**อ่าน Flowchart ก่อน:** `/Design Ai/Flow Design/Warehouse Inventory/Flow/` + `/Warehouse Inventory/Document/`

---

## 📋 Menu List

| รหัส | เมนู | Phase | BC Entity | หน้าจอ |
|---|---|---|---|---|
| WH-Q | Queue Dashboard (คิวคลัง) | P1 | Multiple | รายการรอดำเนินการ |
| WH-1 | รับสินค้า GRN + Transfer Receipt | P1 | purchaseReceipts + transferReceiptsLines | List + Form |
| WH-2 | เบิกจ่ายขาย (Sales Issue) | P1 | warehouseShipmentLines | List + Form |
| WH-3 | โอนสินค้า (Stock Transfer) | P1 | transferOrders (5740/5741) | List + Form |
| WH-4 | นับสต็อก (Stock Count / Physical Inventory) | P1 | physInventoryOrderLines | List + Form |
| WH-5 | ปรับปรุง/ตัดจำหน่ายสต็อก (Stock Adjustment / Write-off) | P1 | itemLedgerEntries (+/− Adjmt.) | Form (`wh5-stock-adjustment-mockup.html`) |

> **🔢 WH Renumber (2026-07-02):** เดิม WH-2=โอน · WH-3=เบิก → สลับเป็น **WH-2=เบิก · WH-3=โอน** (เรียงตามปริมาณงาน เบิก>โอน) · ดู `.agents/topics/wh-renumber-plan.md` · **execute ตอน rebuild หน้า · ไฟล์ rename แล้ว (wh2-issue/wh3-transfer)**
| WH-R | Stock Card / รายงานสต็อก | P1 | itemLedgerEntries (32) | Report View |
| WH-NM | รายงานสินค้าไม่เคลื่อนไหว (Non-Move) | P1 | itemLedgerEntries + items + vendors | Report + Alert |

---

## WH-Q — Queue Dashboard (คิวคลัง)

### 🔒 โมเดล "รางครัว" (Kitchen Rail · decision 2026-07-03)
คิว = **หน้ารวมหลายเอกสาร จัดตามทิศทาง** (ไม่ใช่ 1 คิว = 1 ประเภทเอกสาร) — เหมือน order rail ในครัวร้านอาหาร · คลังกวาดสายตาเห็นงานทั้งหมด → คลิกตั๋ว → เปิดฟอร์มทำจริง · แยก 2 ราง:
- **WH-Q1 คิวรับ** = ทุกงาน "เข้า/รับ" — รับซื้อ (PO→WH-1) · รับโอน (WH-3 ปลายทาง) · รับคืน/เคลม
- **WH-Q2 คิวเบิก** = ทุกงาน "จ่าย/ออก" — ขอเบิก (WH-2R) · ขอโอน (WH-3R) · ใบจอง (SL-2 ที่ถึงคิว)

> เนื้อ picking/packing queue เดิม (wh2-issue เก่า) = ย้ายมาเป็น **WH-Q2** · WH-2 กลายเป็นฟอร์มใบเบิกเดี่ยว (แฝด WH-3) · Panel A-E ด้านล่างเป็น reference โครงเดิม (dashboard รวม) ก่อนแยกทิศ

### Layout
```
┌──────────────────────────────────────────────────┐
│  PAGE HEADER: คิวคลัง | สาขา | วันที่            │
│  Filter: คลัง | ประเภทงาน | Status | วันที่       │
├──────────────────────────────────────────────────┤
│  Panel A: รับสินค้า (GRN จาก Vendor) — ETA วันนี้│
│  Panel B: Transfer In (รอรับโอนจากคลังอื่น)      │
│  Panel C: เบิกจ่ายขาย (SO รอส่ง)                │
│  Panel D: นับสต็อก (ที่ยังค้าง)                  │
│  Panel E: สินค้ารอตรวจสอบ (QC Pending)           │
└──────────────────────────────────────────────────┘
```

### SLA Indicator (จาก Wharehouse.docx)
- GRN: ตรวจรับ ≤ 4 ชั่วโมงหลัง Vendor ส่ง
- Sales Issue: เบิกสินค้า ≤ 2 ชั่วโมงหลัง SO Confirmed
- Transfer: โอนออก ≤ 1 วันทำการ

### SC ที่ใช้
- SC7 (Timeline) — Log ทุก Action
- SC8 (SerialPanel) — แสดงสินค้า Serial รอดำเนินการ

### RBAC
| Role | สิทธิ์ |
|---|---|
| Admin / WH Manager | ดูทุกคลัง ทุก Panel |
| WH Staff | ดูเฉพาะคลังที่ตัวเองสังกัด |
| Sales | ดูเฉพาะ Panel C (เบิกจ่าย — View Only) |

---

## WH-1 — รับสินค้า GRN + Transfer Receipt

### Module Brief
```
Module:  WH-1 Goods Receipt (WH Side)
Phase:   P1
BC:      purchaseReceipts + warehouseReceiptLines
Trigger: Purchase GRN Posted (PO-5) หรือ Transfer Order ส่งออกแล้ว
Output:  Serial ลงใน BC + จัดวาง Bin Location + สต็อกเพิ่ม
```

### ความสัมพันธ์กับ PO-5
```
Purchase GRN Flow:
  PO-5 (Finance/Buyer): ยืนยันรับสินค้า ตั้งหนี้
      ↓ Auto-trigger
  WH-1 (Warehouse): ลง Serial + จัดวาง Bin

Transfer Receipt Flow:
  WH-3 (คลังต้นทาง): โอนออก
      ↓
  WH-1 (คลังปลายทาง): รับโอน + ลง Serial + Bin
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: รับสินค้าเข้าคลัง | Status Badge (รอรับ/รับแล้ว/ปิด)
ActionBar: [Post Receipt] [พิมพ์ GRN] [จัดวาง Bin]
```

**Section 2 — Doc Header**
```
เลขที่ WH GRN  : Auto | วันที่รับ   : Today
ประเภทรับ      : [จาก Vendor] [Transfer In]
อ้างอิง PO/TO  : SC5 ← เลขที่ PO หรือ Transfer Order
คลังรับ        : Required (รับเข้าคลังไหน)
```

**Section 3 — Party**
```
Vendor / คลังต้นทาง: Auto-fill จาก PO/Transfer Order
```

**Section 4 — Line Items (SC2 + SC8)**
```
Copy มาจาก PO Line / Transfer Line (Auto-fill)
จำนวนรับจริง: ปรับได้ถ้ารับไม่ครบ
SC8 Serial Panel — กรอก Serial per ชิ้น:
  - Manual พิมพ์
  - Barcode Scan (UX2) — ยิงทีละตัว
  - Import CSV (UX3) — อัปโหลดทีเดียว
Bin Location: ระบุว่าวางที่ไหนในคลัง (WH-BIN-A1/B2/etc.)
QC Flag: Pass/Fail per Line (ถ้า Enable QC)
```

**Section 5 — Tabs**
```
Tab [Serial Summary]: รายการ Serial ที่รับครบแล้ว vs ยังขาด
Tab [อ้างอิง]:        SC5 → PO / Transfer Order
Tab [ประวัติ]:        SC7 Timeline
```

**Section 7 — Action Bar**
```
รอรับ   : [Post Receipt] (ต้องใส่ Serial ครบก่อน)
รับแล้ว : [พิมพ์ GRN Label] [View Stock Entry] [Transfer to Shelf]
```

### Status Flow
```
รอรับ → ตรวจสอบ/ใส่ Serial → Post → สต็อกเข้า BC → ปิดงาน
```

### BC API
```
GET  /purchaseReceipts?purchaseOrderId=         → ดู GRN ที่รอ
GET  /transferOrders/{id}?$expand=lines         → ดู Transfer ที่รอ
POST /warehouseReceipts/{id}/Microsoft.NAV.post  → Post WH Receipt
POST /itemSerialNumbers                          → บันทึก Serial
PATCH /warehouseEntries                          → Bin Assignment
GET  /items/{id}/stockByLocation                 → ตรวจสต็อกหลังรับ
```

### Business Rules
- **Serial Required ก่อน Post**: ถ้า Item มี Serial Flag → ห้าม Post ถ้าใส่ไม่ครบ
- QC Fail → สินค้าไปที่ "ช่อง Hold" อัตโนมัติ รอ Buyer ตัดสินใจ (Return/Rework)
- GRN มากกว่า PO → Warning + ต้องอนุมัติ (เหมือน PO-5)
- Transfer Receipt: ต้องตรงกับ Serial ที่ส่งออก (Validate)

---

## WH-3 — โอนสินค้า (Stock Transfer)

### Module Brief
```
Module:  WH-3 Stock Transfer
Phase:   P1
BC:      transferOrders (Header 5740, Line 5741)
Trigger: ต้องการย้ายสินค้าจากคลัง A ไป คลัง B / สาขาอื่น
Output:  สินค้าออกจาก Location ต้นทาง → เข้า Location ปลายทาง
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: โอนสินค้า | Status Badge (Draft/รออนุมัติ/โอนออกแล้ว/รับแล้ว/ปิด)
ActionBar: [Save] [Submit] [โอนออก] [พิมพ์ใบโอน]
```

**Section 2 — Doc Header**
```
เลขที่โอน    : Auto | วันที่โอน      : Today
คลังต้นทาง   : Required | คลังปลายทาง : Required
กำหนดถึง     : Expected Arrival Date
เหตุผล       : Dropdown (ตามสั่งขาย / เติมสต็อก / ปรับคลัง)
```

**Section 3 — Party**
```
สาขาต้นทาง / ปลายทาง: Auto-fill จากคลังที่เลือก
```

**Section 4 — Line Items (SC2 + SC8)**
```
SC2 ItemSearch: เลือกสินค้าที่จะโอน
จำนวน: ระบุจำนวนที่จะโอน (ตรวจสต็อกต้นทาง Real-time)
SC8 Serial Panel: เลือก Serial ที่จะโอน (ถ้า Serial Flag)
  - Barcode Scan: ✅
  - Import CSV: ✅ (UX3)
ถ้าสต็อกไม่พอ → Warning สีแดง + แสดงจำนวนที่มี
```

**Section 5 — Tabs**
```
Tab [จัดส่ง]:  SC4 (วิธีขนส่ง, คนรับ, ทะเบียนรถ)
Tab [อ้างอิง]: SC5 (Sales Order ที่สั่ง Transfer ถ้ามี)
Tab [ประวัติ]: SC7 Timeline
```

**Section 7 — Action Bar**
```
Draft        : [Save] [Submit] [Delete]
รออนุมัติ   : Approver=[Approve] [Reject]
อนุมัติแล้ว : [โอนออก (Ship)] → สินค้าออกจาก Location ต้นทาง
โอนออกแล้ว  : คลังปลายทาง=[รับเข้า (Receive)] → WH-1 ปลายทาง
ปิด         : [View Only] [พิมพ์สรุปโอน]
```

### Status Flow
```
Draft → รออนุมัติ → อนุมัติ → โอนออก (In Transit) → รับแล้ว → ปิด
           ↓
       ปฏิเสธ → Draft
```

### RBAC
| Function | Admin | WH Manager | WH Staff | Sales |
|---|---|---|---|---|
| สร้าง Transfer | ✅ | ✅ | ✅ | ❌ |
| อนุมัติ | ✅ | ✅ | ❌ | ❌ |
| โอนออก (Ship) | ✅ | ✅ | ✅ | ❌ |
| รับเข้า (Receive) | ✅ | ✅ | ✅ | ❌ |

### BC API
```
POST  /transferOrders                               → สร้าง TO
PATCH /transferOrders/{id}                          → แก้ไข
POST  /transferOrders/{id}/Microsoft.NAV.post       → Ship (ต้นทาง)
POST  /transferOrders/{id}/Microsoft.NAV.receive    → Receive (ปลายทาง)
GET   /items/{id}/stockByLocation                   → ตรวจสต็อกต้นทาง
PATCH /itemSerialNumbers                            → โอน Serial
```

### Business Rules
- Serial ต้นทาง ≠ สร้างใหม่ — ต้อง Select จาก Stock เดิมเสมอ
- Transfer In Transit: สินค้าอยู่ระหว่างทาง → ไม่นับสต็อกทั้ง 2 Location
- ถ้า ปลายทางรับไม่ครบ → ส่วนที่เหลือ Return กลับหรือทำ Transfer ใหม่
- **🔒 Transfer Ownership (decision 2026-07-02 #13):**
  - **WH-3 = เจ้าของใบโอน** — จุดเดียวที่สร้าง Transfer Order ได้
  - **WH-2 "TR-Out ขอโอน" = request only** — ส่งคำขอเข้าคิว WH-3 ไม่สร้าง TO เอง (กันใบซ้อน 2 ใบสำหรับของชุดเดียว)
  - **WH-1 "TR-In รับโอน" = receive once (idempotent)** — ต้อง match TO status=Shipped · ยืนยันรับได้ครั้งเดียว → status=Received แล้วปุ่ม disable (กันสต๊อกปลายทางเข้าซ้ำ 2 เท่า)
  - ทั้ง 3 คิวแสดงสถานะใบโอนเดียวกัน real-time จาก BC Transfer Header status

---

## WH-2 — เบิกจ่ายขาย (Sales Issue)

### Module Brief
```
Module:  WH-2 Sales Issue
Phase:   P1
BC:      warehouseShipmentLines (ผลจาก SO Ship)
Trigger: Sales Order Confirmed + Finance Approved → WH เบิกสินค้า
Output:  สินค้าออกจากสต็อก + Serial บันทึก + ส่งมอบลูกค้า
```

### 🔒 Auto-Generate ใบขอจากใบขาย — Waterfall Allocation (decision 2026-07-03)

**Trigger:** ใบขายยืนยัน (ใบจอง/ใบสั่งขาย/ใบขาย) + บรรทัด **ระบุคลังจ่าย** → ระบบจัดของต่อบรรทัดตามลำดับ:

```
ต้องการ = จำนวนขาย
1. เบิก  = min(ต้องการ, สต๊อกคลังจ่าย)   → ขอเบิก WH-2R
2. เหลือ = ต้องการ − เบิก
3. โอน   = min(เหลือ, สต๊อกคลังอื่น)      → ขอโอน WH-3R (คลังอื่น→คลังจ่าย)
4. ซื้อ  = เหลือ − โอน                     → สั่งซื้อ PO
```
ลำดับ: **คลังจ่ายก่อน → โอนจากคลังอื่น → ที่ขาดจริงค่อยซื้อ** · 1 บรรทัดขายแตกได้ถึง 3 ใบขอ · ทุกใบ **อ้างอิงกลับใบขายเดียวกัน** (SC-5 doc-ref)

- **Q2 กันสต๊อก = ตอนสร้างใบขอ (reserve ทันที)** — ระบุคลังปุ๊บ สต๊อกโดนกันเลย · ขึ้น **คิวเบิกจริง WH-Q2 เมื่อแพลนวันนัด/ติดตั้ง** (เชื่อม audit #7)
- **Q3 แก้/ยกเลิกใบขายภายหลัง = admin ยืนยันก่อน sync** (ไม่ auto) — ปรับ/ยกเลิกใบขอ + คืนสต๊อกที่กัน หลังคนกดยืนยัน (กันสต๊อกเพี้ยนกรณี picking ไปแล้ว)

**Test cases (A ขาย 5):**

| TC | A มี / B มี | เบิก | โอน | ซื้อ | หมายเหตุ |
|---|---|---|---|---|---|
| TC-1 | 10 / – | 5 | – | – | ปกติ |
| TC-2 | 0 / 10 | – | 5 | – | โอนล้วน |
| TC-3 | 3 / 10 | 3 | 2 | – | เบิก+โอน |
| TC-3b | 3 / 0 | 3 | – | 2 | เบิก+ซื้อ |
| TC-3c | 0 / 3 | – | 3 | 2 | โอน+ซื้อ |
| TC-4 | 0 / 0 | – | – | 5 | ซื้อล้วน (full PO) |
| TC-5 | ไม่ระบุคลัง | ❌ ไม่ auto — รอ admin ระบุคลัง |
| TC-6 | serial/lot | ใบขอสถานะ "รอเลือก serial" |
| TC-7 | หลายบรรทัด คนละคลัง | แตกใบขอตามคลังต้นทาง (1 ใบ=1 คลังต้นทาง) |
| TC-8 | สินค้าฝาก/ไม่สต๊อก | ❌ ไม่ auto |
| TC-9 | แก้/ยกเลิกใบขายภายหลัง | admin ยืนยัน → sync ใบขอ + คืนสต๊อก (Q3=ข) |
| TC-10 | คลังจ่าย=ต้นทางเดียวกัน | เบิกล้วน (กันใบโอนเปล่า) |

### สำคัญ — Serial Rule
> **Serial Required ที่นี่** — ไม่บังคับที่ใบขาย (SL-4)
> ช่อง Serial ใน Invoice อาจว่างไว้ → WH ต้องกรอก Serial ตอนเบิก

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: เบิกจ่ายสินค้า | Status Badge (รอเบิก/กำลังหยิบ/เบิกแล้ว/จัดส่งแล้ว)
ActionBar: [Post Shipment] [พิมพ์ Picking List] [พิมพ์ Delivery Note]
```

**Section 2 — Doc Header**
```
เลขที่เบิก    : Auto | วันที่เบิก  : Today
อ้างอิง SO   : SC5 [Required] ← เลขที่ Sales Order
ลูกค้า       : Auto-fill จาก SO
วันที่ต้องส่ง : Auto-fill จาก SO (Delivery Date)
```

**Section 3 — Party**
```
ลูกค้า: Auto-fill | ที่อยู่จัดส่ง: SC4 (3 Address UX6)
```

**Section 4 — Line Items (SC2 + SC8)**
```
Copy มาจาก SO Line (Auto-fill)
หยิบจริง: ระบุจำนวนที่หยิบได้ (ถ้าสต็อกไม่พอ → ส่งบางส่วน)
SC8 Serial Panel — REQUIRED:
  - ยิง Barcode ทีละตัว (UX2)
  - Import CSV (UX3) ถ้าหลายชิ้น
  - Serial ต้องตรงกับ Location ที่หยิบ
Bin Location: ระบุ Bin ที่หยิบจาก (เพื่ออัปเดต WH Layout)
```

**Section 5 — Tabs**
```
Tab [จัดส่ง]:  SC4 ← ที่อยู่ + วิธีส่ง + QR Track (UX9)
Tab [อ้างอิง]: SC5 → SO → Invoice Chain
Tab [ประวัติ]: SC7 Timeline
```

**Section 7 — Action Bar**
```
รอเบิก     : [พิมพ์ Picking List] [Post Shipment]
กำลังหยิบ  : [บันทึก Serial] [Post ส่วนที่หยิบได้]
เบิกแล้ว   : [พิมพ์ Delivery Note] [ยืนยันส่งมอบ]
จัดส่งแล้ว : [View Only] [QR Link]
```

### Status Flow
```
รอเบิก → Picking → Post Shipment → จัดส่งแล้ว → ลูกค้ารับแล้ว → ปิด
                                                        ↑
                                              QR Track (UX9)
```

### BC API
```
GET  /salesOrders/{id}?$expand=lines&$filter=status eq 'Released'
POST /warehouseShipments/{id}/Microsoft.NAV.postShipment → Ship
PATCH /itemSerialNumbers                                  → บันทึก Serial
GET  /items/{id}/stockByLocation                          → ตรวจสต็อก
```

### Business Rules
- Serial **ต้องใส่ครบก่อน Post Shipment** (ถ้า Item มี Serial Flag)
- ส่งบางส่วน: Post ส่วนที่มี → SO Status = Partially Shipped
- ถ้า Delivery Date ผ่านแล้ว → SLA Alert สีแดงใน Queue

---

## WH-4 — นับสต็อก (Stock Count / Physical Inventory)

### Module Brief
```
Module:  WH-4 Physical Inventory Count
Phase:   P1
BC:      physInventoryOrderLines
Trigger: ตามรอบนับ (รายเดือน/ไตรมาส) หรือ Spot Check
Output:  Adjust สต็อก BC ให้ตรงกับของจริง
```

### ERP Form 7 Sections

**Section 1 — Page Header**
```
Title: นับสต็อก | Status Badge (Draft/กำลังนับ/รอยืนยัน/ปิด)
ActionBar: [เริ่มนับ] [บันทึกผลนับ] [Post Adjustment] [พิมพ์ใบนับ]
```

**Section 2 — Doc Header**
```
เลขที่นับ    : Auto | วันที่นับ    : Today
คลังที่นับ   : Required | หมวดสินค้า : All / เลือกหมวด
ประเภทนับ   : [นับทั้งหมด] [Spot Check] [Cycle Count (หมุนเวียน)]
ผู้รับผิดชอบ : WH Manager
```

**Section 4 — Line Items (SC2 + SC8)**
```
Auto-generate: รายการสินค้าทุกตัวในคลัง (จาก BC Stock)
Columns:
  สินค้า | ยี่ห้อ | สต็อกตาม BC | นับได้จริง | ผลต่าง | Bin Location

การบันทึก:
  - Barcode Scan ทีละชิ้น (UX2) → ระบบนับเพิ่มทีละ 1
  - Manual พิมพ์จำนวน
  - สำหรับ Serial Item: SC8 ยิง Barcode Serial ทีละตัว
  
Highlight: ถ้าผลต่าง ≠ 0 → สีแดง (เกิน) / สีส้ม (ขาด)
```

**Section 5 — Tabs**
```
Tab [Summary]:  รายการที่มีผลต่าง + มูลค่าความแตกต่าง
Tab [ประวัติ]:  SC7 Timeline (ใครนับ, เวลาไหน)
```

**Section 7 — Action Bar**
```
Draft       : [เริ่มนับ] [พิมพ์ใบนับ]
กำลังนับ   : [บันทึกผล] [Pause]
รอยืนยัน   : WH Manager=[Post Adjustment] [ปฏิเสธ (นับใหม่)]
ปิด        : [พิมพ์รายงาน] [View GL Adjustment]
```

### Status Flow
```
Draft → เริ่มนับ → บันทึกผล → รอยืนยัน → Post Adj (ปรับสต็อก BC) → ปิด
                                    ↓
                               นับใหม่ (ถ้าผิดพลาด)
```

### RBAC
| Function | Admin | WH Manager | WH Staff | Finance |
|---|---|---|---|---|
| สร้างใบนับ | ✅ | ✅ | ❌ | ❌ |
| นับ/บันทึก | ✅ | ✅ | ✅ | ❌ |
| Post Adjustment | ✅ | ✅ | ❌ | ✅ |
| ดูรายงาน | ✅ | ✅ | ✅ | ✅ |

### BC API
```
POST /physInventoryOrders                        → สร้างใบนับ
GET  /physInventoryOrderLines?locationCode=      → ดูรายการ
PATCH /physInventoryOrderLines/{id}              → บันทึกผลนับ
POST /physInventoryOrders/{id}/Microsoft.NAV.finish → Post Adjustment
GET  /itemLedgerEntries?entryType='Positive Adjmt.' → ดูการปรับ
```

### Business Rules
- ขณะนับ → ล็อก Transaction ของสินค้าที่กำลังนับ (ห้าม Issue/Receive)
- ผลต่างเกิน ±5% ต่อ Item → ต้องนับซ้ำก่อน Post
- Post Adjustment → บันทึก GL Entry (Inventory Adjustment Account)
- Serial Item: ผลต่าง → ระบุว่า Serial ไหนหาย / Serial ไหนเกิน

---

## WH-5 — ปรับปรุง/ตัดจำหน่ายสต็อก (Stock Adjustment / Write-off)

หน้าจอ: `wh5-stock-adjustment-mockup.html` · form-template fit-100vh · grill Q1-Q8 (2026-07-06)

### วัตถุประสงค์
ปรับสต็อกให้ตรงจริง **นอกรอบนับ** — ของหาย/แตกชำรุด/หมดอายุ/เจอเกิน ที่เกิดระหว่างวัน (gap ที่เจ้าของงานบอก "เจ็บสุด" — เดิมต้องเปิดรอบนับ WH-4 ถึงจะปรับได้)

### ⚖ เส้นแบ่ง WH-4 ↔ WH-5 (สำคัญ — อย่าให้ 2 หน้าแย่งงาน)
- **WH-4 = ปรับจากรอบนับ** — มี snapshot ทั้งคลัง · ผลต่างจากการนับจริง vs ระบบ
- **WH-5 = ปรับนอกรอบนับ** — เหตุการณ์เดี่ยว ad-hoc · เปิดใบตัดได้ทันทีไม่ต้องรอรอบนับ
- ทั้งคู่ Post ลง `itemLedgerEntries` เป็น Positive/Negative Adjmt. เหมือนกัน แต่ WH-5 ไม่มี snapshot

### Business Rules (จาก grill Q1-Q8)
- **Q1** ใบเดียวครอบทุกสาเหตุ · เลือกเหตุผลต่อบรรทัด (ไม่แตกหน้าตามสาเหตุ)
- **Q2** ส่งอนุมัติเข้า **AP-1 ศูนย์อนุมัติรวม** (ไม่ทำหน้าอนุมัติแยก) · ผู้อนุมัติ/threshold อ่านจาก **CF-2.6 Approval Matrix** · Maker≠Checker
- **Q3** บรรทัดทิศ **− (ตัดจำหน่าย) บังคับแนบรูป + เหตุผล** ถึงส่งอนุมัติได้ (soft-gate) · ทิศ + ไม่บังคับ
- **Q4** โชว์มูลค่ารวม (ต้นทุนเฉลี่ย ประมาณการ) + badge read-only — **BC เป็นเจ้าของ posting/GL**
- **Q5** สินค้ามี **Serial → ต้องเลือก SN เจาะจง** (ดึงคงเหลือจาก itemLedger) · ไม่มี SN → ตัดตามจำนวน
- **Q6** **ทิศ +/− ต่อบรรทัด** (เจอเกิน = +, ตัดออก = −) · เจอเกินคุมเบา (ไม่บังคับรูป) แต่ยังผ่านอนุมัติ
- **Q7** **เหตุผล = master** (list-detail เหมือน 1.5.1.x) · แต่ละเหตุผล**ผูกทิศ (+/−) + ผังบัญชีปลายทาง** ที่ BC ลง GL (หาย→ค่าใช้จ่ายสูญเสีย · หมดอายุ→ตัดจำหน่าย ฯลฯ)
- **Q8** สร้าง **ad-hoc ได้** (ไม่ต้องมีเอกสารต้นทาง) · อ้างอิง WH-R Stock Card / WH-4 ใบนับ ได้ (optional)

### Flow
```
(ของแตก/หาย ad-hoc) หรือ WH-R / WH-4 (อ้างอิง optional)
   → WH-5 ใบปรับ/ตัดจำหน่าย → [ส่งอนุมัติ] AP-1 (เกณฑ์ CF-2.6)
   → Post → BC itemLedgerEntries (+/− Adjmt.) + GL ตามผังบัญชีของเหตุผล
```

### TODO
- ✅ master "เหตุผลปรับสต็อก" (ผูกทิศ +/− + ผังบัญชี + บังคับรูป) — สร้างแล้วใน `cf-master-settings-mockup.html` (ผ่าน `swt-master-editor`) · WH-5 dropdown เหตุผลดึงจากนี้
- ผูก AP-1 การ์ด "ปรับ/ตัดจำหน่ายสต็อก" (เพิ่มแถวตัวอย่างแล้ว)

---

## WH-R — Stock Card / รายงานสต็อก

### วัตถุประสงค์
ดูความเคลื่อนไหวสต็อกย้อนหลัง per Item per Location

### หน้าจอ
```
Filter: สินค้า | คลัง | ช่วงวันที่ | ประเภท (In/Out/Adjust)

Columns:
วันที่ | ประเภท | เอกสาร | In | Out | คงเหลือ | Serial | ผู้ทำรายการ
```

### BC API
```
GET /itemLedgerEntries?itemNo=&locationCode=&postingDate= → Stock Movement
GET /items/{id}/stockByLocation                           → Current Stock
GET /itemSerialNumbers?itemNo=                            → Serial Status
```

---

## WH-NM — รายงานสินค้าไม่เคลื่อนไหว (Non-Move Report)

### Module Brief
```
Module:  WH-NM Non-Move Report
Phase:   P1
BC:      itemLedgerEntries (32) + items (27) + vendorLedgerEntries (25)
Trigger: จัดซื้อ / ผู้จัดการสาขา เปิดดูเพื่อตรวจสินค้าค้าง
Output:  รายงานสินค้าไม่เคลื่อนไหว → คนวิเคราะห์สาเหตุ + ตัดสินใจ action เอง
```

### Config: กำหนด Non-Move Threshold (CF)
```
ตั้งค่าใน System Config (CF):
┌─────────────────────────────────────────────────────────┐
│  Non-Move Threshold Setting                             │
│  ──────────────────────────────────────────────────────  │
│  🟡 Warning (เหลือง) : สินค้าค้าง ≥ [30] วัน           │
│  🔴 Critical (แดง)   : สินค้าค้าง ≥ [45] วัน           │
│  ⚫ Dead Stock (ดำ)   : สินค้าค้าง ≥ [90] วัน           │
│  ──────────────────────────────────────────────────────  │
│  ตั้งแยกตามหมวดสินค้าได้:                                │
│  แอร์        : Warning 45 / Critical 60 / Dead 120      │
│  เครื่องซักผ้า: Warning 30 / Critical 45 / Dead 90       │
│  อะไหล่      : Warning 60 / Critical 90 / Dead 180      │
│  ──────────────────────────────────────────────────────  │
│  แจ้งเตือนอัตโนมัติ: ✅ ส่ง Alert ไป Purchase Manager   │
│  ความถี่แจ้งเตือน  : ทุก [7] วัน                        │
└─────────────────────────────────────────────────────────┘
```

### หน้าจอ Report

**Section 1 — Page Header + Filter**
```
Title: รายงานสินค้าไม่เคลื่อนไหว (Non-Move Report)
Filter:
  สาขา/คลัง    : [ทั้งหมด ▾] [HQ] [สาขา1] [สาขา2]
  หมวดสินค้า    : [ทั้งหมด ▾] [แอร์] [ตู้เย็น] [เครื่องซักผ้า] ...
  แบรนด์        : [ทั้งหมด ▾]
  Vendor/ห้าง   : [ทั้งหมด ▾]
  ระดับความเสี่ยง: [ทั้งหมด ▾] [🟡 Warning] [🔴 Critical] [⚫ Dead]
  วันค้างขั้นต่ำ : [ระบุเอง] วัน (override threshold ชั่วคราว)
```

**Section 2 — Summary Cards (ด้านบน)**
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ รวมรายการ    │ 🟡 Warning   │ 🔴 Critical  │ ⚫ Dead Stock │
│ 156 SKU      │ 89 SKU       │ 45 SKU       │ 22 SKU       │
│ ฿4.2M        │ ฿1.8M        │ ฿1.5M        │ ฿0.9M        │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Section 3 — ตารางรายละเอียด**
```
┌────────┬──────┬────────┬──────┬──────┬──────────┬───────┬──────────┬───────────┬──────┐
│สินค้า  │สาขา  │แบรนด์  │สต็อก │ราคาทุน│มูลค่าคงคลัง│วันค้าง│Credit Term│เหลือก่อนดิว│สถานะ │
├────────┼──────┼────────┼──────┼──────┼──────────┼───────┼──────────┼───────────┼──────┤
│แอร์ A  │HQ    │Daikin  │10 ชิ้น│15,000│150,000   │56 วัน │60 วัน   │4 วัน      │🔴    │
│ตู้เย็น B│สาขา1│Samsung │5 ชิ้น │12,000│60,000    │42 วัน │90 วัน   │48 วัน     │🟡    │
│พัดลม C │สาขา2│Hatari  │20 ชิ้น│1,500 │30,000    │95 วัน │60 วัน   │เกินดิว 35d │⚫    │
│แอร์ D  │HQ    │Mitsu   │3 ชิ้น │18,000│54,000    │33 วัน │60 วัน   │27 วัน     │🟡    │
└────────┴──────┴────────┴──────┴──────┴──────────┴───────┴──────────┴───────────┴──────┘

Sort: คลิก Header เรียงได้ทุกคอลัมน์
Default Sort: มูลค่าคงคลัง DESC (ของแพงขึ้นก่อน)
```

**คอลัมน์อธิบาย:**

| คอลัมน์ | ที่มาข้อมูล | คำอธิบาย |
|---|---|---|
| สินค้า | Item Master (MD-1) | ชื่อ + รหัสสินค้า |
| สาขา | Location Code | คลังที่สินค้าอยู่ |
| แบรนด์ | Item Category / Attribute | แบรนด์สินค้า |
| สต็อก | itemLedgerEntries | จำนวนคงเหลือปัจจุบัน |
| ราคาทุน | Item.unitCost | ต้นทุนต่อหน่วย (ก่อน VAT) |
| มูลค่าคงคลัง | สต็อก × ราคาทุน | มูลค่ารวมที่จมอยู่ |
| วันค้าง | Today - วันที่ขายชิ้นสุดท้าย (หรือวันที่รับเข้าถ้ายังไม่เคยขาย) | นับจากวันที่ไม่มี movement |
| Credit Term | Vendor Card → Payment Terms | กี่วันที่ต้องจ่าย Supplier |
| เหลือก่อนดิว | Credit Term - วันค้าง (ถ้าติดลบ = เกินดิวแล้ว) | เวลาที่เหลือก่อนต้องจ่ายเงินแต่ยังขายไม่ได้ |
| สถานะ | เทียบกับ Threshold ที่ตั้งไว้ | 🟡🔴⚫ ตาม config |

**Section 4 — Tabs (per row เมื่อกดดูรายละเอียด)**
```
Tab [ประวัติเคลื่อนไหว]: ดึงจาก WH-R Stock Card — In/Out ย้อนหลัง
Tab [เทียบสาขา]:
  ┌────────┬──────┬──────┬──────────┐
  │ สาขา   │ สต็อก │ขายได้│ วันค้าง  │
  │ HQ     │ 10   │ 0   │ 56 วัน   │ ← สาขานี้
  │ สาขา 1 │ 5    │ 3   │ 12 วัน   │ ← ขายได้ปกติ
  │ สาขา 2 │ 8    │ 0   │ 60 วัน   │ ← ค้างเหมือนกัน
  └────────┴──────┴──────┴──────────┘
  → จัดซื้อดูแล้ววิเคราะห์เองว่าทำไมสาขา 1 ขายได้แต่สาขาอื่นไม่ได้

Tab [ข้อมูล Supplier]: Vendor + Credit Term + ประวัติ Agreement
Tab [บันทึก Action]: (Free text) จัดซื้อจดบันทึกว่าทำอะไรไปแล้ว
  เช่น: "12/04 — โทรคุย Daikin แล้ว รอ confirm โปรลดราคา"
        "15/04 — Daikin เสนอรับคืน 5 ชิ้น"
```

**Section 5 — Action Bar**
```
[Export Excel] [Export PDF] [ส่ง Alert ซ้ำ] [พิมพ์]
```

### Alert อัตโนมัติ
```
ทุก [7] วัน (configurable) ระบบส่งสรุปไปยัง Purchase Manager:

Subject: ⚠️ สรุปสินค้าไม่เคลื่อนไหว — 12 เม.ย. 2569
──────────────────────────────────────
🔴 Critical: 45 SKU / มูลค่า ฿1.5M
⚫ Dead Stock: 22 SKU / มูลค่า ฿0.9M
──────────────────────────────────────
Top 5 มูลค่าสูงสุด:
1. แอร์ Daikin FTKM-18 — 10 ชิ้น — ฿150K — ค้าง 56 วัน — เหลือ 4 วันก่อนดิว
2. ...

→ [เปิดดูรายงานเต็ม]
```

### RBAC
| Function | Admin | Purchase Mgr | Buyer | WH Manager | WH Staff | Sales Mgr |
|---|---|---|---|---|---|---|
| ดูรายงาน | ✅ | ✅ | ✅ (สินค้าที่ดูแล) | ✅ | 🔍 (สาขาตัวเอง) | 🔍 (ดูได้ไม่เห็นราคาทุน) |
| ตั้ง Threshold | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| บันทึก Action | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Export | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

### BC API
```
GET /itemLedgerEntries?$filter=itemNo eq '{id}' and entryType eq 'Sale'
    &$orderby=postingDate desc &$top=1
    → วันที่ขายชิ้นสุดท้าย (ถ้าไม่มี = ยังไม่เคยขาย)

GET /items/{id}?$select=no,description,unitCost,itemCategoryCode
    → ข้อมูลสินค้า + ราคาทุน

GET /items/{id}/stockByLocation
    → สต็อก per Location (เทียบสาขา)

GET /vendors/{id}?$select=paymentTermsCode
    → Credit Term ของ Vendor

GET /itemLedgerEntries?$filter=itemNo eq '{id}' and locationCode eq '{loc}'
    &$orderby=postingDate desc
    → Stock Movement ย้อนหลัง (Tab ประวัติ)
```

### Business Rules
1. **วันค้าง** = Today - Max(วันที่ขายล่าสุด, วันที่รับเข้าคลัง) — ถ้าไม่เคยขาย ใช้วันที่รับเข้า
2. **Threshold ตั้งแยกตามหมวดได้** — สินค้าราคาสูง (แอร์) ยอมรับค้างนานกว่าสินค้าราคาถูก (พัดลม)
3. **ราคาทุน = Unit Cost ก่อน VAT** — ตรงกับ VAT Golden Rule (ตรรกะที่ 1)
4. **เหลือก่อนดิว = Credit Term - วันค้าง** — ถ้าติดลบ = บริษัทจ่ายเงินไปแล้วแต่ของยังขายไม่ได้ (เงินจม)
5. **Tab เทียบสาขา** = ช่วยจัดซื้อดูว่าปัญหาอยู่ที่สินค้าหรือที่สาขา (manual analysis)
6. **Tab บันทึก Action** = free text ไม่มี workflow — จัดซื้อจดเอง เพื่อ audit trail ว่าทำอะไรไปแล้ว
7. **Alert ไม่บังคับ action** — แค่แจ้งเตือน จัดซื้อตัดสินใจเอง (คุย Supplier / ทำโปร / ส่งคืน / ปล่อย)
8. **Sales Manager เห็นรายงานได้แต่ไม่เห็นราคาทุน** — field-level permission (CF-3)

---

## 📌 Warehouse Module — Business Rules รวม

1. **Serial at Warehouse**: Serial ลงที่ WH GRN (รับเข้า) และ WH Issue (เบิกออก)
2. **Serial at Sales**: ไม่บังคับ — ช่องว่างไว้ WH กรอกตอนเบิก
3. **Bin Location**: ทุก Receipt/Issue ต้องระบุ Bin (ถ้า Location ใช้ Bin)
4. **SLA Timer**: GRN ≤ 4h / Issue ≤ 2h / Transfer ≤ 1 วัน
5. **QC Hold**: Item QC Fail → ไปช่อง Hold อัตโนมัติ ห้าม Issue
6. **Stock Count Lock**: ขณะนับ → ล็อก Movement ของ Item นั้น
7. **Transfer Serial**: โอน Serial ต้องมาจาก Stock เดิมเสมอ — ห้ามสร้างใหม่
8. **Barcode ทุกจุด**: GRN / Transfer / Issue / Count รองรับ Barcode Scan (UX2)

---

## 🗄️ BC Table Reference (Warehouse)

| เอกสาร | Table No. | Endpoint |
|---|---|---|
| Transfer Header | 5740 | /transferOrders |
| Transfer Line | 5741 | /transferOrderLines |
| Item Ledger Entry | 32 | /itemLedgerEntries |
| Warehouse Entry | 7152 | /warehouseEntries |
| Phys. Inventory Order | 5875 | /physInventoryOrders |
| Serial No. Information | 6505 | /itemSerialNumbers |
| Purchase Receipt Header | 120 | /purchaseReceipts |
| WH Receipt Header | 7316 | /warehouseReceipts |
