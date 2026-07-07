# SL Module — Form Blueprints (ก่อนลงมือทีละฟอร์ม)

> สร้าง 2026-06-06 · grounded จาก Flow PDF (`Flow Design/Sales/Flow`) + Document DD (`.../Document`) + spec (`.claude/skills/sangwijit-portal/modules/SL_sales.md`) + ไฟล์ deployed เดิม
> มาตรฐาน Form Blueprint 5 ส่วน: ① โครง section · ② SC · ③ field+อธิบาย · ④ ข้อเสนอ(แนะนำ+เหตุผล) · ⑤ จุดต่าง
> ใช้เอกสารนี้สั่งงานต่อได้ — ทำทีละฟอร์ม (ห้าม batch)

---

## 0. Doc-Chain ภาพรวม (สายเอกสารงานขาย)

```
SL-1 ใบเสนอราคา (QT) ──► SL-2 ใบจอง/สั่งขาย (SO) ──► SL-4 บิลขาย (INV)
   (ไม่มี upstream)         │  กันสต็อก               │  ตัดสต็อก + ตั้งหนี้
                            └──► SL-3 ใบมัดจำ (DP) ────┘  (หักมัดจำ auto · SC6)
   SL-F1 อนุมัติวงเงิน = gate คั่นได้ทุกขั้นที่เกินวงเงิน
   SL-CN ใบลดหนี้ (Flow 07) ◄── SL-4   [✦ build แล้ว · slcn-credit-memo-mockup.html]
```

| ฟอร์ม | BC entity | อ้างอิง upstream | ตัดสต็อก | ลงบัญชี | ไฟล์ |
|---|---|---|---|---|---|
| SL-1 QT | salesQuotes | — | ✗ | ✗ | sl1-quotation-mockup.html |
| SL-2 SO | salesOrders (Open) | QT (ถ้ามี) | กัน(reserve) | ✗ | sl2-reservation-mockup.html |
| SL-3 DP | custom prepayment | SO (required) | ✗ | ✓ (G/L + VAT) | sl3-deposit-mockup.html |
| SL-4 INV | postedSalesInvoice | QT·SO·DP | ✓ | ✓ (AR+VAT) | sl4-invoice-mockup.html |

---

## STANDARDS ที่ใช้ทุกฟอร์ม SL (เคาะครั้งเดียว ใช้ทั้ง chain)

1. **เลขเอกสาร = ADR-0004** `[Branch][DocCode]-[YYMM]-[####]` เช่น `08QT-2604-0015`, `08SO-2604-0021`, `08DP-2604-0009`, `08INV-2604-0042`
   - แก้ prefix ที่ผิด: SL-2 ใช้ `RSV`→**SO** · SL-3 ใช้ `DEP`/`DPS`→**DP** · ทุกตัวใช้ **ค.ศ.** (เลิก พ.ศ. 2567 ใน SL-3)
2. **ตัด field Entity Tag** ทุกหน้า (SWT single-entity · 2026-05-31) — SL-1/2/4 ยังโชว์ "SWT (Main)" ค้าง
3. **Section 5 = Tab group มาตรฐาน** [ชำระเงิน][จัดส่ง][เอกสารอ้างอิง SC-5][ประวัติ SC-7] — ทุกหน้ายุบ card กระจัดกระจายเข้า tab
4. **Doc-chain bottom strip** = base module `.dc-*` (swt-patterns.css) เหมือนกันทุกหน้า เปลี่ยนแค่ chain data
5. **Print preview = DD parity** (ลายเซ็นต่างกันตามเอกสาร — ดูราย section)
6. **Status lifecycle + Approval gate** ตาม Flow (Open→รออนุมัติ→Approved/Posted · Print/Post หลังผ่าน gate)
7. **Warranty date (Ending)** — Flow บังคับทุกการขายสินค้า → ต้องมี field (SL-2/SL-4 ขาด)

---

## SL-1 — ใบเสนอราคา (Quotation)

**① โครง:** หัวเอกสาร · ลูกค้า · รายการสินค้า · สรุปยอด · Tabs · Follow-up · Approval+Action
**② SC:** SC-1 ลูกค้า · SC-2 สินค้า · SC-5 อ้างอิง · SC-7 ประวัติ · SC-9 ราคา/โปร · SC-11 สรุปยอด · SC-12 pills
**③ Field สำคัญ (จาก DD):** เลขที่ · วันที่ · **ยืนราคาถึง/หมดอายุ** · วันกำหนดส่ง · หมายเลขอ้างอิง · ผู้ติดต่อ · พนักงานขาย · ส่วนลด(จำนวนเงิน) · comment line/รายการ · ยอดตัวอักษร · 3 ลายเซ็น (ขาย/ผจก.ขาย/ผู้มีอำนาจ)
**④ ข้อเสนอ:**
- หัวเอกสาร — **แนะนำ:** 2 โซนตาม DD + เลข ADR-0004 + badge อายุนับถอยหลัง · *เหตุผล:* ตรง DD + consistency CF
- ลูกค้า — **แนะนำ:** คงการ์ดเครดิต + rule เกินวงเงิน→ปุ่ม "ขออนุมัติ SL-F1" · *เหตุผล:* flow บังคับ approval gate
- สินค้า — **แนะนำ:** ส่วนลด toggle %/จำนวนเงิน (default จำนวนเงิน) + comment line/row · *เหตุผล:* DD ใช้จำนวนเงิน, retail ใช้ %
- สรุป — **แนะนำ:** ยอดตัวอักษร auto + แยกวิธีชำระเงิน · *เหตุผล:* DD บังคับ
- Tabs — **แนะนำ:** ยุบ Follow-up+Notes+DocRef+Timeline เป็น tab เดียว · *เหตุผล:* spec S5 + ลด scroll
- Approval — **แนะนำ:** Open→รออนุมัติ→Approved + gate print + 3 ลายเซ็น · *เหตุผล:* flow + DD
**⑤ จุดต่าง:** ไม่มี upstream (หัวสาย) · ไม่ผูกเงิน/ไม่ตัดสต็อก · **มีอายุ 30 วัน** (ฟอร์มเดียวที่หมดอายุ auto)

---

## SL-2 — ใบจอง / สั่งขาย (Reservation / Sales Order)

**① โครง:** หัวเอกสาร · ลูกค้า · รายการสินค้า · **Reserve Stock** · สรุปยอด · Tabs · Approval+Action
**② SC:** SC-1 · SC-2 · SC-3 ชำระ · SC-4 จัดส่ง · SC-5 อ้างอิง Quote · SC-6 มัดจำ · SC-7 ประวัติ · SC-8/9 stock check
**③ Field (จาก DD ใบสั่งขาย):** เลขที่ · วันที่ · พนักงานขาย · **สถานที่ส่งของ (ship-to)** · หมายเลขอ้างอิง · เงื่อนไข+วิธีชำระ · **วันกำหนดส่ง** · วันครบกำหนดชำระ · ส่วนลด · ยอดตัวอักษร · **4 ลายเซ็น** (ผู้รับของ/ผู้ส่งของ/ผู้จัดทำ/ผู้อนุมัติ)
**④ ข้อเสนอ:**
- Reserve Stock — **แนะนำ:** คงการ์ด reserve (bin/lot/READY-TRANSIT) ที่ทำดีแล้ว · *เหตุผล:* คือหัวใจ SL-2
- Lifecycle — **แนะนำ:** เพิ่ม Draft↔Confirmed action split + state "รออนุมัติวงเงิน" + ปุ่ม Confirm · *เหตุผล:* spec/flow บังคับ, ของเดิม static
- Convert path — **แนะนำ:** แสดง 2 ทางเข้า (จาก Quote / direct) + selector ขายปลีก/ขายส่ง (เลือกชุดเอกสาร) · *เหตุผล:* Flow 02 vs 03
- Field ขาด — **แนะนำ:** เพิ่ม ship-to, วิธีชำระ, **warranty date** · *เหตุผล:* DD + flow บังคับ
- Tabs/Print — ตาม STANDARD 3 + 5 (print = 4 ลายเซ็น)
**⑤ จุดต่าง:** ฟอร์มเดียวที่ **กันสต็อก (Item Reservation)** + hold มีเวลา (auto คืนสต็อก) · รับเงินบางส่วน/ไม่รับ · lines locked-from-Quote

---

## SL-3 — ใบมัดจำ (Deposit)

**① โครง:** หัวเอกสาร · ลูกค้า(auto) · **รายการมัดจำ (G/L line)** · Payment Info · **สถานะการใช้มัดจำ** · สรุป(VAT split) · Tabs · Action
**② SC:** SC-1 · SC-3 PaymentPanel(เงินสด/โอน/เช็ค/บัตร) · SC-5 อ้างอิงจอง · SC-6 auto-deduct · SC-7 ประวัติ
**③ Field:** เลขที่ · วันที่ · **อ้างอิงใบจอง (SO · required)** · ยอดมัดจำ + VAT 7% split · วิธีชำระ + ธนาคาร/เลขโอน/สลิป · ยอดมัดจำทั้งหมด/ตัดใน INV/คงเหลือ
**④ ข้อเสนอ:**
- โมเดล — **แนะนำ:** ระบุชัดว่ามัดจำ = **G/L-account line (+) ไม่ตัดสต็อก** · *เหตุผล:* Flow 05/06, BC custom prepayment API
- รายการ — **แนะนำ:** เพิ่ม line "มัดจำตามใบจอง [เลข]" + ยอดแก้ได้ (ของเดิมเป็นยอด flat) · *เหตุผล:* spec S4
- Deduct — **แนะนำ:** คง "สถานะการใช้มัดจำ" (ตัดใน INV) + รองรับ many-to-one (รับทีละงวด) · *เหตุผล:* SC6 net ที่บิลเดียว
- Print — **แนะนำ:** ใช้ template ใบตั้งหนี้ (ไม่มี DD เฉพาะ) · *เหตุผล:* Document folder ไม่มี deposit print
- เลข/Tab — ตาม STANDARD 1 (DEP→DP, พ.ศ.→ค.ศ.) + 3
**⑤ จุดต่าง:** เอกสาร **G/L ล้วน** (ไม่ตัดสต็อก) · **VAT บนตัวมัดจำเอง** (ออกใบกำกับ) · settle ด้วย auto-deduct ที่ SL-4 · many-to-one · ยืดอายุ reservation (+14 วัน)

---

## SL-4 — บิลขาย / Invoice (Shipment + Invoice)

**① โครง:** หัวเอกสาร · ลูกค้า · รายการสินค้า(+Serial) · จัดส่ง/ติดตั้ง · Payment · **หักมัดจำ** · สรุป(VAT golden) · Tabs · Approval+Action
**② SC:** SC-1…SC-9 ครบ (SC-8 Serial · SC-6 หักมัดจำ · SC-9 Promo auto-match) + SC-11 สรุปยอด + SC-12 pills
**③ Field (3 DD: Invoice/Delivery/Pick):**
- Invoice: คอลัมน์การเงิน (หน่วยละ/ส่วนลด/จำนวนเงิน) + VAT 7% + ยอดตัวอักษร + เงื่อนไข/วิธีชำระ + **4 ลายเซ็น**
- Delivery Order: คอลัมน์ logistics (วันกำหนดส่ง/จำนวน) + **สถานที่ส่งของ** + **2 ลายเซ็น** (ผู้รับ/ผู้ส่ง)
- Pick Slip: qty-only + **3 ลายเซ็น internal** (จัด/ตรวจ/รับรอง · ไม่มีลายเซ็นลูกค้า)
**④ ข้อเสนอ:**
- Posting split — **แนะนำ:** แยกปุ่ม Release→Post Shipment (ตัดสต็อก) vs Post Invoice (ตั้งหนี้) + รวม Post Ship&Invoice · *เหตุผล:* Flow 04/08/09 = 2 leg
- 3 printed outputs — **แนะนำ:** print menu เลือก Pick Slip / Delivery Order / Tax Invoice (ลายเซ็นต่างกัน) · *เหตุผล:* DD 3 แบบ
- หักมัดจำ — **แนะนำ:** คง SC6 auto-deduct (ของเดิมทำดี −40,000) · *เหตุผล:* ปลายทาง settle มัดจำ
- Serial — **แนะนำ:** คง SC8 + รองรับออกบิลก่อน serial ว่าง → คลังเติมตอน issue · *เหตุผล:* spec/flow
- Field ขาด — **แนะนำ:** เพิ่ม warranty date, VAT toggle (UX7), ประเภทการรับ [รับเอง/จัดส่ง/+ติดตั้ง] · *เหตุผล:* flow ③ + spec
- Tab/Entity/เลข — ตาม STANDARD 1·2·3
**⑤ จุดต่าง:** ฟอร์มเดียวที่ **ตัดสต็อก + ลงบัญชี AR** · หักมัดจำ auto · Serial capture · VAT Golden Rule จุดสุดท้าย · **3 เอกสารพิมพ์จากบิลเดียว**

## SL-CN — ใบลดหนี้ (Credit Memo · Flow 07) ✦ build แล้ว
- **trigger/role:** ลดหนี้/รับคืนสินค้าจากลูกค้า → ออกใบลดหนี้ → ลด AR + คืน VAT ขาย
- **โครง:** `_form-template` · อ้างบิลขายเดิม SL-4 (SC-5+) · ลูกค้า (SC-1) · items คืน (+Serial SC-8) · เหตุผล · VAT (Golden Rule) · SC-11 สรุป
- **rules:** ลด AR + กลับ VAT ขาย · ของคืนเข้าคลัง (RT → WH-1 รับคืน) · maker≠checker · post → credit memo
- **chain:** SL-4 → (รับคืน WH-Q2) → **SL-CN** → ปรับ AR/FI-Q-AR · BC: salesCreditMemos
- ไฟล์: `slcn-credit-memo-mockup.html`

---

## ลำดับลงมือ (แนะนำ)
1. เคาะ STANDARD 1-7 (ใช้ทั้ง chain) + 7 decision SL-1
2. ทำ **SL-1** ก่อน (หัวสาย · มี DD ชัด) → SL-2 → SL-3 → SL-4 (ตามสาย doc-chain)
3. ทุกตัว: Form Blueprint นี้ = spec ลงมือ · แก้ในไฟล์เดิม · archive ก่อน · เทียบเก่า/ใหม่
