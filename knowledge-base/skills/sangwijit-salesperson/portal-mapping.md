# Portal Mapping — sangwijit-salesperson

> **จุดประสงค์:** เชื่อม Skill `sangwijit-salesperson` กับ Dynamic Web Portal
> ใช้คู่กับ `/knowledge-base/portal/` และ `SKILL.md` ของ skill นี้

---

## 1. Skill นี้ครอบคลุมเรื่องอะไร (สรุป)

คู่มือพนักงานขายแสงวิจิตร 3 หมวด:
- **รู้จักแสงวิจิตร** — SOP, KPI, ข้อจำกัดการขาย, โปรโมชั่น, ป้ายราคา, สต็อก
- **รู้จักลูกค้า** — วิเคราะห์, ต้อนรับ, ปิดการขาย, บริการหลังขาย
- **รู้จักสินค้า** — สเปก, จุดขาย, แคมเปนแบรนด์, โปรโมชั่น

---

## 2. Module ใน Portal ที่ map กับ Skill นี้

| กลุ่ม Portal | Prefix | Module | ไฟล์ Skill ที่เกี่ยว |
|---|---|---|---|
| Sales | SL-1 | Quotation | ป้ายราคา, โปรโมชั่น |
| Sales | SL-2 | Sales Order | SOP การขาย |
| Sales | SL-3 | Customer Master | รู้จักลูกค้า |
| Sales | SL-F1 | Credit Check | ข้อจำกัดการขาย |
| Sales | SL-F2 | Promotion/Discount | โปรโมชั่น + ป้ายราคา |
| Sales | SL-F3 | Delivery Note | หลังการขาย |
| Sales | SL-F4 | Installment | ผ่อนชำระ |
| Sales | SL-F5 | Sales Dashboard | KPI พนักงานขาย |
| Master | MD-1 | Product Master | สเปกสินค้า |
| Master | MD-2 | Product Category | หมวดสินค้า |

---

## 3. Mockup File ที่อ้างอิงได้

```
sl1-quotation-mockup.html           → ป้ายราคา + โปรโมชั่น
sl2-sales-order-mockup.html         → SOP การขาย
sl3-customer-master-mockup.html     → ลูกค้า
sl-f1-credit-check-mockup.html      → Credit Tier check
sl-f2-promotion-mockup.html         → โปรโมชั่น
sl-f3-delivery-note-mockup.html     → ส่งของ
sl-f4-installment-mockup.html       → ผ่อน
sl-f5-sales-dashboard-mockup.html   → KPI
md1-product-master-mockup.html      → สินค้า (v1/v2/v3)
md2-product-category-mockup.html    → หมวดสินค้า
```

---

## 4. BC365 Entity ที่เกี่ยวข้อง

| BC365 Entity | ใช้ใน Module | หมายเหตุ |
|---|---|---|
| `customers` | SL-3 | master ลูกค้า |
| `salesQuotes` | SL-1 | quotation |
| `salesOrders` | SL-2 | SO |
| `salesInvoices` | FI-1 | invoice |
| `items` | MD-1 | สินค้า |
| `itemCategories` | MD-2 | หมวด |

ดูรายละเอียดเต็มใน `/portal/04-bc365-integration.md` หัวข้อ "Sales Entity Mapping"

---

## 5. Key Business Rule ที่ Skill + Portal ต้องใช้ร่วมกัน

| Rule | รายละเอียด | Portal ใช้ที่ไหน | Skill อ้างอิง |
|---|---|---|---|
| **V — VAT Golden Rule** | discount ก่อน VAT | SL-1, SL-F2 | Calculation |
| **R — Credit Tier** | SL-F1 + PO ต้องผ่าน CF-2.6 | SL-F1, CF-2.6 | ข้อจำกัดการขาย |
| **F — Floor Price** | ห้ามขายต่ำกว่าราคาพื้น | SL-1, SL-F2 | ข้อจำกัดการลดราคา |
| **B1 — Sale-In Accrual** | commission ตั้งเร้าตามใบเสนอ | SL-F5 | KPI |

---

## 6. เมื่อไรควรอ่าน Skill นี้ + Portal คู่กัน

- ออกแบบหน้า Quotation/SO → อ่าน `portal/03-ui-ux-convention.md` + skill SOP
- Training พนักงานใหม่ → อ่าน SKILL.md + SL mockup
- เพิ่ม field สินค้า MD-1 → อ่าน skill "รู้จักสินค้า" + `portal/01-module-list.md`
- ถามเรื่อง Credit/Floor → อ่าน skill "ข้อจำกัดการขาย" + rules R, F
