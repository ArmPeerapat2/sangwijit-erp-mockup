# Portal Mapping — sangwijit-purchasing

> **จุดประสงค์:** เชื่อม Skill `sangwijit-purchasing` กับ Dynamic Web Portal
> ใช้คู่กับ `/knowledge-base/portal/` และ `SKILL.md` ของ skill นี้

---

## 1. Skill นี้ครอบคลุมเรื่องอะไร (สรุป)

ระบบจัดซื้อ + Trade Agreement ครบวงจร 3 มิติ:
- **Mindset** — Dealer vs Modern Trade thinking
- **Calculation** — True Margin, VAT Golden Rule, PSI & MOS
- **Agreement** — Trade Agreement, Vendor Obligation, Non-Move, Penalty

---

## 2. Module ใน Portal ที่ map กับ Skill นี้

| กลุ่ม Portal | Prefix | Module | ไฟล์ Skill ที่เกี่ยว |
|---|---|---|---|
| Purchasing | PO-1 | Purchase Request (PR) | SOP จัดซื้อ |
| Purchasing | PO-2 | Purchase Order (PO) | Trade Agreement, PSI |
| Purchasing | PO-3 | PO → GRN Flow | True Margin, MOS |
| Purchasing | PO-4 | Vendor Management | Vendor Obligation |
| Purchasing | PO-5 | Trade Agreement | Agreement management |
| Purchasing | PO-6 | PSI / MOS Dashboard | Calculation |
| Config | CF-7 | Credit Approval Tier | Credit policy |
| Warehouse | WH-5 | Non-Move Report | Non-Move handling |
| Finance | FI-4 | VAT Report | VAT Golden Rule |

---

## 3. Mockup File ที่อ้างอิงได้

```
po1-pr-mockup.html                  → PR → PO
po2-po-mockup.html                  → PO + approval
po3-po-to-grn-mockup.html           → PO → GRN flow
po4-vendor-management-mockup.html   → Vendor master
po5-trade-agreement-mockup.html     → Agreement detail
po6-psi-mos-dashboard-mockup.html   → PSI + MOS
cf7-credit-limit-mockup.html        → Credit Tier
wh5-non-move-mockup.html            → Non-Move
fi4-tax-report-mockup.html          → VAT report
```

---

## 4. BC365 Entity ที่เกี่ยวข้อง

| BC365 Entity | ใช้ใน Module | หมายเหตุ |
|---|---|---|
| `vendors` | PO-4 | master เจ้าหนี้/vendor |
| `purchaseOrders` | PO-2, PO-3 | PO header + lines |
| `purchaseReceipts` | PO-3, WH-2 | GRN |
| `purchaseInvoices` | PO-3, FI-2 | invoice จาก vendor |
| `items` | PO-2 | item + unit cost |
| `vendorLedgerEntries` | PO-4 | ledger vendor |

ดูรายละเอียดเต็มใน `/portal/04-bc365-integration.md` หัวข้อ "Purchase Entity Mapping"

---

## 5. Key Business Rule ที่ Skill + Portal ต้องใช้ร่วมกัน

| Rule | รายละเอียด | Portal ใช้ที่ไหน | Skill อ้างอิง |
|---|---|---|---|
| **V — VAT Golden Rule** | discount ก่อน VAT | PO-2, FI-4 | Calculation |
| **M — Non-Move** | สินค้า Non-Move | WH-5, PO-4 | Agreement penalty |
| **R — Credit Approval** | SL-F1 + PO ต้องผ่าน CF-7 | CF-7, PO-2 | Credit policy |
| **True Margin** | คำนวณต้นทุนจริงหลังส่วนลด | PO-6 Dashboard | Calculation |
| **PSI / MOS** | Plan Sales Inventory + Months of Supply | PO-6 | Calculation |

---

## 6. เมื่อไรควรอ่าน Skill นี้ + Portal คู่กัน

- ออกแบบหน้า PO/PR ใหม่ → อ่าน `portal/01-module-list.md` + skill Calculation
- เจรจา Agreement ใหม่ → อ่าน skill Agreement section
- วาง Dashboard PSI/MOS → อ่าน `portal/03-ui-ux-convention.md` + skill Calculation
- ถามเรื่อง Dealer vs MT → อ่าน skill Mindset
