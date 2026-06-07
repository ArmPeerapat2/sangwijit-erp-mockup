# Shared Components — Field Design (ทั้ง 9 ตัว · สำหรับ build)

> source: component_fw doc §2 + **legacy ref `_reference/ComponanceShare/*.jpg`** + master (MD-1/MD-2) + SC-1/SC-2.
> ออกแบบฟิลด์จริงต่อ component (layout · fields · states · output event). build ขึ้น canvas หลัง review.

---

## 1. SharedCustomerSearch (drawer)
**Search bar:** ค้น (รหัส / ชื่อ / เบอร์ / เลขบัตร / เลขผู้เสียภาษี)
**Filters (chips):** ประเภท [บุคคล·นิติ·ราชการ·Walk-in] · กลุ่มราคา [A·B·C·VIP] · สถานะ [Active·Blocked·Overdue]
**Recent list** + **Results — result-card fields:** ชื่อ · รหัส · ประเภท · กลุ่มราคา · **วงเงิน / ใช้แล้ว / คงเหลือ** · creditStatus badge (ok/warning/over/blocked · "AR ค้าง") · โทร · สาขา · [ℹ️ ประวัติ→modal]
**Quick-Create (mini form):** ชื่อ · ประเภท · เบอร์ · (เลขบัตร) → save Draft
**States:** default · results · empty(→quick-create) · blocked(→ApprovalBanner)
**Output:** `customer:selected` (auto-fill header + ดึง Price List) · `customer:created` · `credit:blocked`

## 2. SharedItemSearch (popup — ตาม legacy Product Search)
**Toolbar:** สินค้า · บริการ · สินค้าชุด · ค้นตามกลุ่ม · แสดงประวัติ · Memo · **Multi (ใส่ปริมาณ)** · ☐ Only Cust Product
**Search bar** + **Result columns:** รหัสสินค้า · ชื่อสินค้า · หน่วย · **สต็อก · สั่งขาย · สุทธิ · สั่งซื้อ · ขอจ่าย · ขอโอน** · หมายเหตุ
**Detail tabs (8 · ของ item ที่เลือก):**
1. **สต็อกแต่ละคลัง:** รหัสคลัง · คลัง · ที่เก็บ · หน่วย · สต็อก · สั่งขาย · สุทธิ · สั่งซื้อ · ขอจ่าย · ขอโอน · จุดต่ำสุด (ต่อสาขา)
2. **ราคาขาย** (read-only): หน่วย · ราคาปลีก · Disc1 · ราคาส่ง · Disc2 · ต้นทุน INV · Disc3 · ต้นทุน ผปย · Disc4 · Price5-7 + Disc5-7
3. รายการสั่งซื้อ · 4. ค้างส่ง · 5. รูปสินค้า · 6. ยอดขายตามช่วงวันที่ · 7. ยอดขายแต่ละคลัง · 8. Rebate
**สินค้าทดแทน** (substitute) เมื่อสต็อก 0 · **multiSelect + ใส่ปริมาณ**
**Output:** `item:added{item,qty,price,promo}` · `item:substitute` · `stock:warning`

## 3. SharedPayment (panel — ตาม legacy รับชำระเงิน)
**หัว:** **Total** (ใหญ่) · **Remain** (ใหญ่ · = net − deposit − paid)
**รับเป็นเงินสด:** ยอด + ✓
**โอนเข้าธนาคาร:** เลขที่บัญชี · จำนวนเงิน · ค่าธรรมเนียม · หมายเหตุ
**Tabs (split methods):**
- **เช็ครับ:** เลขที่เช็ค · ธนาคาร · สาขาธนาคาร · ลงวันที่ · มูลค่าเช็ค · ชำระครั้งนี้ · หมายเหตุ
- **บัตรเครดิต:** เลขบัตร · ประเภทบัตร (+ **marketplace: Lazada/Shopee/...**) · การชาร์จ % · ยอดชำระบัตร · ยอดชาร์จ · เลขอ้างอิง
- **ชำระแบบอื่นๆ**
**PaymentLine table:** {method · amount · ref} + New/Del
**เครดิต:** creditCheck real-time → เกินวงเงิน = บล็อก + `approval:required`
**Output:** `payment:changed` · `payment:complete{method:cash/credit/split}`
(depositAmt auto-deduct จาก SharedDeposit · QR = 1 method)

## 4. SharedDelivery (panel)
**จัดส่ง:** ที่อยู่ส่ง (default จาก customer · เลือก Address Book) · วันนัดส่ง · วิธีส่ง [รถบริษัท·ขนส่ง·รับเอง] · ผู้รับ + เบอร์
**ติดตั้ง (toggle):** ต้องการติดตั้ง → วันนัดติดตั้ง · ทีม/ช่าง · หมายเหตุ
**Output:** `delivery:changed` · `install:toggled` · `install:triggerService{workOrderDraft}` (spawn Service WO หลัง Post)

## 5. SharedDocReference (panel)
**ค้นต้นทาง** (sourceTypes auto จาก docType) → **list:** เลขที่ · วันที่ · ลูกค้า/vendor · ยอด · สถานะ
**ดึง:** full / **Partial (เลือกบรรทัด)** → preview mapped (items/customer/delivery/depositRef)
**Cascading:** INVOICE←Quote/RSV/Deposit · RSV←Quote · PO←PR/RFQ · GR←PO · SERVICE←INVOICE
**Output:** `doc:pulled{mappedData}` · `doc:partial{selectedLines}` · `source:closed` (เตือนห้ามดึงซ้ำ)

## 6. SharedDeposit (panel)
**list ใบมัดจำ (ตาม customer):** เลขที่ · วันที่ · ยอดมัดจำ · ใช้ไป · คงเหลือ
**ตัดมัดจำ:** เลือกหลายใบ · ยอดตัด · validate รวม ≤ invoiceAmt · auto-close เมื่อใช้ครบ
**+ สร้างใบมัดจำใหม่** (stand-alone)
**Output:** `deposit:applied{depositLines,totalApplied}` · `deposit:created` · `deposit:fullyUsed`

## 7. SharedTimeline (collapsible · ล่างทุกเอกสาร · read-only)
**3 sub-panels:**
- **Document Chain:** ต้นทาง > ระหว่างทาง > ปลายทาง + สถานะ (คลิกข้าม)
- **Activity Log:** วัน/เวลา · ผู้ทำ · action (ลบ/แก้ไม่ได้)
- **Comment** ← เพิ่ม: internal note · mention @ชื่อ · แนบไฟล์
**props:** docId · docType · allowComment · collapsed

## 8. SharedSerialNumber (inline ใน item line)
**input:** กรอก / สแกน barcode / **Upload CSV** · ตามจำนวน qty
**validate real-time** (debounce 200ms): ซ้ำ / ใช้แล้ว / ไม่ใช่ของสินค้านี้ → บล็อก
**lifecycle:** ว่าง / ใช้งาน / ซ่อม / เคลม + เอกสารที่ผูก
**Output:** `serial:added` (unlock Confirm) · `serial:duplicate` · `serial:invalid`

## 9. SharedPromoPrice (inline ใน item line + Summary panel)
**inline/line:** ราคา (จาก Price List ตาม customer/channel/date) · discount · promo tag
**Summary panel:** โปรที่ apply · ของแถม (freeItems) · ส่วนลดรวม
**logic:** Price List priority สูงสุด → line discount → promo active → **conflict: priority win (ไม่ stack)**
**price lock** (ผู้ขาย lock → ต้องอนุมัติ) · **commission (PC) calc** แนบบิล
**props:** customerId · branchId · docDate · channel [retail/wholesale/online/project] · items
**Output:** `price:calculated` · `promo:applied` · `price:locked` · `commission:calc`
**dependency:** Price List (MD-6 defer) → skeleton + manual price ก่อน

---

## หมายเหตุ design
- ItemSearch + Payment ยึด **legacy ref** เป็นหลัก (field/column ตรงระบบจริงที่ user ใช้)
- ทุก component: รับ `mode` · output ผ่าน Events · มี state empty/loading/error
- ใช้ design tokens (main-header pattern · swt-patterns.css) ตอน build
- build order: CustomerSearch → ItemSearch → DocReference → PromoPrice → Payment → Deposit → Delivery → Serial

---

## SharedCustomerSearch — refined ตาม legacy + feedback (2026-05-31)
- **Search = popup** (ตอนเปิดบิลขาย) · toolbar: ประวัติ · เงื่อนไขลูกค้า (filter กลุ่ม/เขตขาย/จังหวัด) · Find bar
- **List = รายชื่อ (หลายรายการ · scroll):** รหัส · ชื่อ · ผู้ติดต่อ · ที่อยู่ · โทร · ยอดหนี้ · สถานะ(dot)
- **คลิกชื่อ → Customer Info popup:** credit bar (วงเงิน/ยอดหนี้ค้าง/คงเหลือ/เช็คในมือ) + **tabs: Customer · OutStanding (AR: DocDate/DocNo/DueDate/Day/InDue/OverDue/Deposit) · Sales · YTD** → ปุ่ม "เลือกลูกค้านี้" emit `customer:selected`
- **ปุ่ม "เพิ่มลูกค้า"** (เมื่อค้นไม่เจอ) → เปิด popup สร้างลูกค้าอีกหน้า = **ออกแบบใน MD-2 Customer master** (ไม่ออกแบบในนี้)
- mode (create/edit/view) <new>
- proposal mockup: `_proposal/sc1-customer-search-proposal.html` (v3)

- **CustomerSearch ✓ approved 2026-05-31** (interactive prototype) · approach = ทุก component ทำเป็น interactive prototype ให้ทดสอบก่อนตัดสิน

## ItemSearch — Multi-add UX (2026-05-31)
- กดเพิ่มลงบิลแล้ว **Product Search ค้างไว้** (ไม่ปิด) เพื่อเพิ่มหลายรายการต่อเนื่อง
- เพิ่มได้ 2 ทาง: (ก) ช่องจำนวน + "+เพิ่ม" ที่แถว (เร็ว) · (ข) คลิกชื่อ → detail 8 tabs → เพิ่ม
- ตะกร้าสะสม (เห็นรายการ+จำนวน+ลบได้) → ปุ่ม "เสร็จ" ค่อยส่งลงบิล (emit item:added) + ปิด
- ItemSearch ✓ approved direction · proposal v3: _proposal/sc2-item-search-proposal.html

## DocReference — Cascading map (user-defined 2026-05-31)
**1 เอกสารปลายทางอ้างอิงต้นทางได้หลายรายการ** (multi-reference)
| docType ปลายทาง | อ้างอิงต้นทาง | ระดับ |
|---|---|---|
| บิลขาย (Sales Invoice) | ใบเสนอราคา · ใบจอง · ใบมัดจำ | จอง/เสนอราคา = per-line · มัดจำ = per-bill |
| คลัง — รับของ | ใบสั่งซื้อ (PO) | per-line |
| คลัง — เบิก | ใบเบิก / ใบขอเบิก | per-line |
| คลัง — โอน | ใบขอโอน | per-line |
| บัญชี (AR/รับชำระ) | บิลขาย · บิลมัดจำ | per-bill |
| (contract) PO | PR · RFQ | per-line |
| (contract) Service | INVOICE | per-bill |
- per-line ref: ตามหลังชื่อสินค้า + คอลัมน์ "ขอ vs สั่งจริง" · per-bill ref: ระดับบิล · ห้ามอ้างซ้ำ (memory: References display rule)

## Payment/Deposit/Delivery/Serial — feedback แก้ (2026-05-31)
- **Payment:** กรอกยอดที่รับก่อน → แล้วค่อยเลือกวิธี (amount-first · split)
- **Deposit → กลุ่มเอกสารบัญชี:** ตัดมัดจำ · วางบิล (AR) · รับวางบิล (AP) · ดึงตัดชำระ (4 โหมด/แท็บ)
- **Delivery:** + เวลานัด · รายละเอียดการนัดหมาย · ปักพิกัดแผนที่ (ผูก SC-10 Map Picker)
- **Serial:** เน้นสแกนต่อเนื่อง (เคอร์เซอร์ค้าง) + นำเข้า CSV · รองรับถึง 1,000 serial/รายการ

## SharedItemSearch + PromoPrice — Final Flow (ตัดสิน 2026-06-01)

### บริบท
- SC-2 SharedItemSearch ใช้ทุกโมดูล
- Price/Promo section เปิดเฉพาะ **Sales** (INVOICE/QUOTE/RSV)
- PO/WH/SV = ไม่มีส่วน promo (เพิ่มลงบิลทันทีหลัง qty)

### Flow ที่ตัดสิน
```
① เปิด SC-2 → ค้น → เลือกสินค้า + ระบุจำนวน → กด "เพิ่ม"

② ระบบตรวจโปร (Sales เท่านั้น):
   ├─ มีโปรสำหรับสินค้า+qty นี้ → เด้ง side panel โปร (inline · ไม่บล็อก)
   │    ├─ แสดง ลด/แลก/แจก ที่เข้าเงื่อนไข
   │    ├─ optional (ปิดได้ = ไม่ใช้โปร)
   │    └─ ยืนยัน → เพิ่มลงบิล
   └─ ไม่มีโปร → เพิ่มลงบิลทันที (ราคา list)

③ ใน line บิล (แก้ราคาตรงๆ):
   ├─ ≥ Floor Price → ได้เลย
   └─ < Floor Price → ต้องอนุมัติ (SL-F1) · emit price:locked
```

### ราคาใน line
- เช็คโปรก่อนเสมอ (ถ้าเป็น Sales)
- ถ้าไม่มีโปร → กรอก override ตรงๆใน line ได้เลย + check floor
- ถ้ามีโปร → optional เลือก/ไม่เลือก แล้ว override ได้อีกทีใน line

### ไฟล์ prototype
- SC-2 เดิม: `_proposal/_shared/sc2-item-search-proposal.html`
- Integrated (sales flow): `_proposal/_shared/sc-item-with-price-proposal.html`
- **ตัวถัดไป:** รวม SC-2 + promo flow เป็นหน้าเดียวตาม flow นี้ (build เมื่อสั่ง)

## PromoPrice — Final Decision (2026-06-01)
- **SC-2 SharedItemSearch คงเดิม** (ไม่เปลี่ยน) — item search + 8 tabs + multi-add
- **PromoPrice = ไม่มี component แยก** — เป็น section ที่ Sales page orchestrate
- Flow: SC-2 emit `item:selected` → Sales page ตรวจโปร → เปิด promo panel (optional) → confirm → add line
- Reference: `_proposal/_shared/sc-item-with-price-proposal.html` (v3)
- **Build จริงตอน SL-1** (Sales page จะ orchestrate SC-2 → promo → line)
