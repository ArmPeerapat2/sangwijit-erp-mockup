# Shared Components — canonical spec (9 ตัว)

> source: `_reference/docs/1 component_fw_clean.docx` section 2 · visual ref: `_reference/ComponanceShare/*.jpg`
> หลัก: แต่ละตัว self-contained (Props · State · Events · BC API) · Parent รับผลผ่าน **Events** เท่านั้น · ทุกตัวรับ prop **`mode`** (create/edit/view[/approve])
> นี่คือ contract ที่ทุก transaction flow (SL/PO/WH/SV/FI) เรียกใช้ → แก้ปม "reference มาบ้างไม่มาบ้าง"

## ตารางรวม + สถานะปัจจุบัน (vs swt-*)

| # | Component | หน้าที่ | key events | ใช้ที่ | สถานะ swt ปัจจุบัน |
|---|---|---|---|---|---|
| 1 | **SharedCustomerSearch** | ค้นหา/เลือก/Quick-Create ลูกค้า + เช็กเครดิต | `customer:selected` · `customer:created` · `credit:blocked` | Invoice/Quote/RSV/Deposit/CN/Service/Claim | 🟡 partial (`data-customer-search` 3 ไฟล์ · ไม่มี quick-create/credit) |
| 2 | **SharedItemSearch** | ค้นหา/เพิ่มสินค้า + สต็อก real-time แยกคลัง + barcode | `item:added` · `item:substitute` · `stock:warning` | ทุกเอกสารที่มี line | 🟡 ดีสุด (SC-2 + `swt-item-input` 61 ไฟล์ · ขาด substitute/stock-warn) |
| 3 | **SharedPayment** | รับชำระ split + เช็กวงเงิน real-time + trigger approval | `payment:changed` · `approval:required` · `payment:complete` | Invoice/Cash sale/Deposit/รับชำระ | 🔴 ขาด (มีแค่ QR) |
| 4 | **SharedDelivery** | ที่อยู่ส่ง/วันนัด/วิธีส่ง + toggle ติดตั้ง→spawn Service WO | `delivery:changed` · `install:toggled` · `install:triggerService` | Invoice/RSV/ส่งของ | 🔴 ขาด |
| 5 | **SharedDocReference** | ดึงเอกสารต้นทาง (Quote/RSV/Deposit/PO) + **Partial Pull** | `doc:pulled` · `doc:partial` · `source:closed` | ทุกเอกสารที่มีต้นทาง | 🔴 ขาด (มีแค่ breadcrumb display) |
| 6 | **SharedDeposit** | ค้นหา/ตัดมัดจำในบิล (หลายใบต่อบิล) | `deposit:applied` · `deposit:created` · `deposit:fullyUsed` | Invoice/RSV (SL-3) | 🔴 ขาด (กระจายใน sl3) |
| 7 | **SharedTimeline** | Document Chain + Activity Log + Comment (read-only) | (read-only · 3 sub-panel) | ล่างทุกเอกสาร | 🟢 มี (SC-7 + `swtAppendTimeline`/`swtRenderBreadcrumb`) |
| 8 | **SharedSerialNumber** | กรอก/สแกน/CSV serial + ตรวจซ้ำ real-time + lifecycle | `serial:added` · `serial:duplicate` · `serial:invalid` | Invoice/Transfer/GRN/Service | 🔴 ขาด |
| 9 | **SharedPromoPrice** | ดึง Price List + apply โปร (conflict: priority win) + commission | `price:calculated` · `promo:applied` · `price:locked` · `commission:calc` | ทุกเอกสารที่มีราคา | 🔴 ขาด (PM-5 simulator แยก) |

## Cascading (DocReference auto-fill ตาม docType)
- INVOICE ← QUOTE/RESERVATION/DEPOSIT (items, customer, delivery, depositRef)
- RESERVATION ← QUOTE · PO ← PR/RFQ · GR ← PO · SERVICE ← INVOICE

## Props/Events ย่อ (ตัวสำคัญ)
- **CustomerSearch:** props `mode·docType·preloadId·allowCreate·creditWarning` · API `GET/POST /customers`
- **ItemSearch:** props `mode·docType·customerId·branchId·docDate·allowSerial·multiSelect` · API `GET /items`, `/priceLists`, `/substitutes`
- **Payment:** props `netAmount·vatAmount·depositAmt·customerId·allowedMethods·requireApproval` · state `PaymentLine[]·remaining·creditCheck`
- **Serial:** props `itemId·docType·qty·required·allowBulk` · API `GET /itemTrackingEntries`
- **PromoPrice:** props `customerId·branchId·docDate·channel·items` · logic: priceList priority → line discount → promo → conflict(priority win)

## สรุปสถานะ
- 🟢 1 (Timeline) · 🟡 2 (Customer/Item partial) · 🔴 6 (Payment/Delivery/DocReference/Deposit/Serial/PromoPrice ขาด)
- swt-link.js ทำได้บางส่วนแบบ attribute-wire · **ยังไม่เป็น component ตาม contract (Props/Events/mode)**

## ลำดับสร้างที่เสนอ
1. **CustomerSearch + ItemSearch** (ใช้ทุกที่ · มีฐานแล้ว · ทำให้ครบ contract + wire ทุกหน้า)
2. **DocReference** (หัวใจ chain — pull ต้นทาง · ทำให้ flow ต่อกัน)
3. **PromoPrice** (ราคา/โปร — แต่ผูก Price List MD-6 ที่ defer → ทำ skeleton + manual ก่อน)
4. Payment · Deposit · Delivery · Serial (ตามที่ flow ต้องใช้)
