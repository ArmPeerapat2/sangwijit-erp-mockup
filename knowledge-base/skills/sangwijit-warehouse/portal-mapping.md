# Portal Mapping — sangwijit-warehouse

> **จุดประสงค์:** เชื่อม Skill `sangwijit-warehouse` กับ Dynamic Web Portal
> ใช้คู่กับ `/knowledge-base/portal/` และ `SKILL.md` ของ skill นี้

---

## 1. Skill นี้ครอบคลุมเรื่องอะไร (สรุป)

คู่มือคลังสินค้า HQ + สาขา ครอบคลุม:
- รับสินค้า Vendor + ตรวจนับ
- ยก/เคลื่อนย้ายสินค้าปลอดภัย
- ผังคลัง, FIFO, การจัดเรียง
- นับสต็อก (Physical Count)
- โอน/เบิก/ย้ายระหว่างคลัง
- ความรับผิดชอบสินค้าแต่ละหมวด

---

## 2. Module ใน Portal ที่ map กับ Skill นี้

| กลุ่ม Portal | Prefix | Module | ไฟล์ Skill ที่เกี่ยว |
|---|---|---|---|
| Warehouse | WH-1 | Stock On Hand | ผังคลัง/FIFO |
| Warehouse | WH-2 | Goods Receipt (GRN) | รับสินค้า Vendor |
| Warehouse | WH-3 | Stock Transfer (โอนข้ามคลัง) | โอน/เบิก/ย้าย |
| Warehouse | WH-4 | Physical Count | นับสต็อก |
| Warehouse | WH-5 | Non-Move Report | Non-Move (M rule) |
| Warehouse | WH-6 | Warehouse Layout | ผังคลัง |
| Purchasing | PO-3 | PO → GRN Flow | รับสินค้า Vendor |
| Sales | SL-F3 | Delivery Note | เบิกสินค้าส่งลูกค้า |

---

## 3. Mockup File ที่อ้างอิงได้

```
wh1-stock-on-hand-mockup.html       → สต็อกรายคลัง
wh2-grn-mockup.html                 → GRN + ตรวจรับ
wh3-stock-transfer-mockup.html      → โอนระหว่างคลัง
wh4-physical-count-mockup.html      → นับสต็อก
wh5-non-move-mockup.html            → Non-Move (D+90, D+180)
wh6-warehouse-layout-mockup.html    → ผังคลัง
po3-po-to-grn-mockup.html           → PO → GRN
sl-f3-delivery-note-mockup.html     → เบิกส่งลูกค้า
```

---

## 4. BC365 Entity ที่เกี่ยวข้อง

| BC365 Entity | ใช้ใน Module | หมายเหตุ |
|---|---|---|
| `items` | WH-1, WH-2 | master สินค้า |
| `itemLedgerEntries` | WH-1, WH-5 | ledger การเคลื่อนไหวสต็อก |
| `locations` | WH-* | คลัง HQ + สาขา |
| `transferOrders` | WH-3 | โอนระหว่างคลัง |
| `purchaseReceipts` | WH-2, PO-3 | รับจาก Vendor |
| `physicalInventoryOrders` | WH-4 | นับสต็อก |
| `salesShipments` | SL-F3 | เบิกส่งลูกค้า |

ดูรายละเอียดเต็มใน `/portal/04-bc365-integration.md` หัวข้อ "Warehouse Entity Mapping"

---

## 5. Key Business Rule ที่ Skill + Portal ต้องใช้ร่วมกัน

| Rule | รายละเอียด | Portal ใช้ที่ไหน | Skill อ้างอิง |
|---|---|---|---|
| **M — Non-Move** | สินค้าไม่เคลื่อนไหว D+90, D+180 trigger | WH-5 | Mindset + SOP |
| **FIFO** | เบิกของเก่าก่อน | WH-3, WH-4, SL-F3 | ผังคลัง + SOP |
| **3-Way Match** | PO + GRN + Invoice ตรงกัน | WH-2, PO-3, FI-2 | SOP รับสินค้า |

---

## 6. เมื่อไรควรอ่าน Skill นี้ + Portal คู่กัน

- ออกแบบหน้าใหม่ใน WH-* → อ่าน `portal/01-module-list.md` + SOP คลัง
- ดีไซน์ form นับสต็อก → อ่าน `portal/03-ui-ux-convention.md` + SOP นับสต็อก
- วาง flow Non-Move alert → อ่าน `portal/00-overview.md` "M rule" + skill Mindset
- training พนักงานคลัง → อ่าน SKILL.md + portal mockup ที่เกี่ยวข้อง
