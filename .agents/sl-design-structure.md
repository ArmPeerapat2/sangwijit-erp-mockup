# SL-4 Design Structure — โครงสร้างการออกแบบ (2026-04-21)

## 🎯 เป้าหมาย
เขียนรายละเอียด **โครงสร้างการออกแบบ SL-4** ที่ชัดเจน ครอบคลุม 5 Components + 7 Sections ตามมาตรฐาน ERP Form

---

## ✅ Status: SL-4 Mockup มีครบแล้ว 90%

### Section ที่มีครบ:
- ✅ **S1 — Page Header** — Title + Status Badge + Action Bar (Draft/Pending/Confirmed)
- ✅ **S2 — Doc Header** — เลขที่บิล + วันที่ + สาขา + พนักงาน + อ้างอิง (SC5)
- ✅ **SC11 — Business Rule Status Bar** — 4 Pills (B1 Sale-In, VAT, Credit, Floor Price)
- ✅ **SC11.5 — 3-Way Match** — ตรวจสอบ Quote→Reservation→Invoice เท่ากันหรือไม่
- ✅ **S3 — Party (SC1)** — ค้นหาลูกค้า + ที่อยู่ 3 ประเภท + AR ค้าง
- ✅ **S4 — Line Items** — SC2 Item + SC8 Serial + SC9 Promo Pills + Stock Reserve
- ✅ **S5 — Tabs** ← **ต้องตรวจสอบ**:
  - ✅ Tab 1 — **② ชำระเงิน (SC3)** — Payment Methods + Check/Card/QR/AR Sub-tabs (ครบเรียบร้อย!)
  - ✅ Tab 2 — **③ จัดส่ง/ติดตั้ง (SC4)** — Delivery Address + Install Toggle (ยังไม่ดู)
  - ✅ Tab 3 — **④ โปรโมชั่น Auto-Match (SC9)** — Promo Cards + Free Items (ยังไม่ดู)
  - ✅ Tab 4 — **⑤ ใบกำกับภาษี** — Tax Invoice + Entity Tag (ยังไม่ดู)
  - ✅ Tab 5 — **เอกสารอ้างอิง (SC5)** — Quote→Reservation→Invoice Chain
  - ✅ Tab 6 — **Timeline (SC7)** — Audit Log + Activity
- ⚠️ **S6 — Summary** — ยอดรวม + ส่วนลด + VAT + เอาไปใส่บน (ต้องตรวจ)
- ✅ **S7 — Action Bar** — Sticky Bottom + Status-Driven Buttons

---

## 🔍 ต้องตรวจสอบใน Tabs Section

### Tab ③ Delivery (SC4) — ข้อมูลจัดส่ง
**ควรมี:**
- **ส่วน A — ที่อยู่เลือก**
  - ที่อยู่จัดส่ง (default จาก Customer หรือ input ใหม่)
  - ผู้รับ + เบอร์โทร
  - [เปลี่ยน] — Link ไปเลือกที่อยู่อื่น
  
- **ส่วน B — วางแผนจัดส่ง**
  - วันที่จัดส่ง (calendar picker หรือเลือกจากคิวว่าง)
  - ช่วงเวลา (08:00-12:00, 13:00-17:00, ฯลฯ)
  - วิธีจัดส่ง (ขับไปเอง, ส่งพนักงาน, ส่งโดย 3rd party)
  
- **ส่วน C — ติดตั้ง (Toggle)**
  - Toggle: ต้องการติดตั้ง? [ใช่/ไม่]
  - ถ้า "ใช่" → Auto-create Service Work Order (SV-1)
  - Show "ค่าติดตั้ง" field (คำนวณจากราคาตั้ง)

---

### Tab ④ Promo Auto-Match (SC9) — โปรโมชั่นอัตโนมัติ
**ควรมี:**
- **ส่วน A — โปรที่ Match แล้ว**
  - Grid 2 คอลัมน์ (หรือมากกว่า) — Promo Cards
  - แต่ละ Card:
    - 🟢 Live Badge
    - ชื่อโปร (e.g. "Summer Sale -10%")
    - เงื่อนไข (e.g. "ซื้อแอร์ ช่วง 01/04-30/06/2567")
    - ผลลัพธ์ (e.g. "ลดราคา 10%")
    - [ใช้] [ข้าม]
  - บันทึก Priority (ซ้อนได้ ≤ 2 ชั้น, ≥ 3 ต้องอนุมัติ)

- **ส่วน B — ของแถมฟรี**
  - ถ้าโปร "แถมของ" Match → แสดง Free Item Row
  - Example: "🎁 ท่อทองแดง 3m" (Free จาก Summer Sale)
  - Auto-add ใน Line Items (Price = 0, Flag = Gift)

- **ส่วน C — สรุปผลโปร**
  - Original Total
  - Promo Discount (by tier)
  - Final Total

---

### Tab ⑤ Tax Invoice (ใบกำกับภาษี)
**ควรมี:**
- **ส่วน A — Header + Entity Tag**
  - Entity Tag: [1 / 2 / 3 / novat]
  - กำหนดว่า Invoice นี้ออก Tax ใหนก (Sangwijit Main vs Sangwijit-PAY)
  - 🔒 Lock หลัง Confirm (ห้ามเปลี่ยน)

- **ส่วน B — ข้อมูลใบกำกับภาษี** (Read-only หลัง Confirm)
  - เลขที่ Tax Invoice (Auto ต่อจาก Running)
  - ที่อยู่ออกใบกำกับ (จาก Customer)
  - เลขผู้เสียภาษี (Biller)
  - VAT Rate: 7% (อ่านจาก System)

- **ส่วน C — Preview + Print**
  - Preview ใบกำกับ (ตัวอย่าง)
  - [📄 ดูตัวอย่าง PDF]
  - [🖨️ พิมพ์ใบกำกับภาษี]
  - Status: ยังไม่ออก / ออกแล้ว / ส่ง RD API แล้ว (Phase 2)

---

## 🏗️ Business Rules ตามกฎ 5 Components

### Component ① — สินค้า & สต็อก
```
Flow:
  เลือกสินค้า (SC2 Item Search + Barcode Scan)
    ↓
  ระบบกันสต็อก (Reserve) อัตโนมัติ
    ↓
  แจ้ง Warehouse: "Pick Request WH-2567-xxxx"
    ↓
  WH รับคิว → เบิกสินค้า
    ↓
  ลูกค้ารับเอง (คิวสิ้นสุด) หรือ → ไป Component ③ (จัดส่ง)

Key Fields:
  - Stock Display: [จำนวนว่าง] / [จำนวนจองไป] / [ติด]
  - Warehouse Allocation: เลือกคลังไหน (HQ / Branch)
  - Serial Flag: ถ้า Item = Serialized → เปิด SC8
  - Serial ตอนขาย: อาจว่างไว้ → WH กรอกตอน Issue ได้
```

### Component ② — ชำระเงิน
```
Flow:
  เลือกวิธีชำระ (เงินสด / โอน / เช็ค / บัตร / QR / เครดิต)
    ↓
  บันทึกข้อมูลอ้างอิง:
    - เงินสด: จำนวน
    - โอน: Ref No. + ธนาคาร
    - เช็ค: เลขที่เช็ค + วันที่ + ธนาคาร
    - บัตร: เลขที่บัตร + อนุมัติ + Charge
    - QR: ลูกค้าสแกนเอง → BC sync เงินเข้า → FI-1Q Queue
    - เครดิต: ตรวจวงเงิน auto → เกิน → trigger SL-F1 Approval
    ↓
  Split Payment: รองรับหลายวิธีต่อบิล
    ↓
  บันทึก AR Entry + Receive Cash (ถ้าเงินสด)

Key Validations:
  - ยอดชำระ = ยอดสุทธิ (หรือ ≤ ยอดสุทธิ ถ้า Partial)
  - เครดิต: Credit Used + ยอดบิลนี้ ≤ Credit Limit
  - Maker ≠ Checker: ห้าม Approve งานตัวเอง
```

### Component ③ — จัดส่ง / ติดตั้ง
```
Flow:
  รับเอง? → จบที่เคาน์เตอร์ (Component จบ)
      OR
  ต้องจัดส่ง? → ระบบสร้าง Delivery Job อัตโนมัติ:
    - Delivery Schedule: วันเวลา
    - Location: ที่อยู่จัดส่ง
    - Contact: ผู้รับ + เบอร์
    - Pickup Team (assign)
      ↓
    ต้องติดตั้ง? (Toggle)
      [ใช่] → Auto-create SV-1 Service Work Order
      [ไม่] → จบ (Delivery Done)
      [ใช่] → Pickup ส่ง → Service Tech install
            → สแกน Serial ยืนยัน
            → Close Job Card
            → Auto-create Service Invoice (SV-2)

Key Fields:
  - Delivery Date: Calendar
  - Delivery Time Window: Dropdown (8 ช่วงเวลา)
  - Delivery Method: Pick-up / Staff Delivery / 3rd Party
  - Installation Required: Toggle
  - Installation Cost: Auto-calc จากราคา (% ของราคาสินค้า)
```

### Component ④ — โปรโมชั่น Auto-Match
```
Flow:
  เลือกสินค้า (Component ①)
    ↓
  ระบบดึง Promo ที่ Match:
    - By Channel (ค้าปลีก / ค้าส่ง / ออนไลน์)
    - By Date (ระหว่าง Promo Start-End)
    - By SKU / Category
    - By Price Group (Customer)
    ↓
  แสดง Promo Badges ใต้ชื่อสินค้า:
    - 🎯 Summer Sale -10%
    - 🎁 ฟรีติดตั้ง
    - 💎 VIP Points x2
    ↓
  Priority Rule: ซ้อนได้ ≤ 2 ชั้น
    - ≤ 2: Auto Apply
    - ≥ 3: Alert + ขออนุมัติ Mgr
    ↓
  ผลลัพธ์:
    - Line Item: ราคาลด + Promo Tag
    - Free Items: Auto-add ใหม่ Line (Price = 0, Flag = Gift)
    - Summary: แสดงยอดลดรวม

Key Validations:
  - Golden Rule: Discount ก่อน VAT เสมอ
  - Floor Price: ห้ามลดต่ำกว่า Floor
  - Rebate ≠ Discount: Rebate เงินคืนหลัง, Discount ลดราคาตั้งต้น
```

### Component ⑤ — ใบกำกับภาษี
```
Flow:
  ลูกค้าขอ "ต้องการใบกำกับภาษี"? 
    [ไม่] → ข้าม (ไม่ออก Tax Invoice)
    [ใช่] → ออกได้ทันทีในจอ
      ↓
    ระบบ Auto-assign:
      - Entity Tag: 1 (Sangwijit Main) / 2 (Branch) / ...
      - Tax Invoice No.: ต่อจาก Running (Format: ???-YY-XXXXX)
      - ที่อยู่ออกใบ: จาก Customer Master
      - VAT 7%: บังคับทุกใบกำกับ
      ↓
    แสดง Preview ใบกำกับ:
      - Header: Biller Info + Entity Tag
      - Items: รหัส, ชื่อ, จำนวน, ราคา, VAT
      - Footer: ยอดรวม, VAT, รวมทั้งสิ้น
      ↓
    ออกใบกำกับ (Print / PDF)
    ↓
    Post บิล → Auto บันทึก VAT Output เข้า GL
    ↓
    (Phase 2) ส่ง e-Tax Invoice XML ไป RD API

Key Rules:
  - Lock หลัง Post: ห้ามเปลี่ยน Entity Tag
  - VAT 7% บังคับ
  - Tax Invoice No. ต้องถูกต้อง (เพื่อ e-Tax)
```

---

## 📊 Cross-Module Integration Map

```
SL-4 ──┬→ WH Module: Reserve Stock + Pick Request
       ├→ FI Module: AR Entry + Receive Cash (ถ้าเงินสด)
       ├→ SV Module: Delivery Job + Service Work Order (ถ้าต้องติดตั้ง)
       ├→ PM Module: Promo Auto-Match (SC9)
       └→ AC/TX Module: VAT Output + e-Tax Invoice (Phase 2)

BC365 API:
  - GET /customers/{id} → Customer Master
  - GET /items/{id}/stockByLocation → Stock Real-time
  - POST /salesOrders/{id}/post → Post Invoice
  - POST /generalJournals → VAT Entry
```

---

## 📋 Shared Components (SC) ที่ใช้ทั้งหมด

| SC | ชื่อ | ที่ใช้ใน SL-4 |
|---|---|---|
| SC1 | SharedCustomerSearch | S3 Party — ค้นหาลูกค้า |
| SC2 | SharedItemSearch | S4 Line Items — ค้นหาสินค้า + Barcode |
| SC3 | SharedPaymentPanel | S5 Tab ② — ชำระเงิน |
| SC4 | SharedDeliveryPanel | S5 Tab ③ — จัดส่ง/ติดตั้ง |
| SC5 | SharedDocRefPanel | S2 + S5 Tab "เอกสารอ้างอิง" — Quote→Invoice Chain |
| SC6 | SharedDepositPanel | S5 Tab ② (หักมัดจำ) |
| SC7 | SharedTimeline | S5 Tab "Timeline" — Audit Log |
| SC8 | SharedSerialPanel | S4 Line — Serial Tracking |
| SC9 | SharedPromoPrice | S4 Line + S5 Tab ④ — Promo Auto-Match |
| SC11 | Business Rule Status Bar | S2.5 (NEW) — 4 Pills Status |

---

## 📝 Next Actions

### Immediate (SL-4 Complete)
- [ ] ตรวจสอบ Tab ③④⑤ ว่าเนื้อหาครบถ้วน + UX ดี
- [ ] ตรวจสอบ Summary Section ส่วน6 (ยอดรวม)
- [ ] ทดสอบ Flow 5 Components ทั้งไป หน้าไป
- [ ] Mark SL-4 as ✅ Complete

### Next (SL Module Chain Design)
1. **SL-1 Quote** ← ก่อนบิล → ลูกค้าอนุมัติ ได้ → Convert → SL-2
2. **SL-2 Reservation** ← จอง → Request Stock → ได้ + Invoice → SL-4
3. **SL-3 Deposit** ← มัดจำ → ตัดในบิล (Component ②)
4. **SL-F1 Credit Approval** ← Override/เกินวงเงิน
5. **SL-Q Sales Queue** ← Follow-up + Track

---

**Last Updated:** 2026-04-21 14:30 +07:00  
**Status:** Ready for SL-1/2/3 Design
