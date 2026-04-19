# Portal Mapping — sangwijit-accounting

> **จุดประสงค์:** เชื่อม Skill `sangwijit-accounting` กับ Dynamic Web Portal
> ใช้คู่กับ `/knowledge-base/portal/` และ `SKILL.md` ของ skill นี้

---

## 1. Skill นี้ครอบคลุมเรื่องอะไร (สรุป)

งานบัญชีทุกตำแหน่งใน 4 นิติบุคคล (SWT/SWE/VMN/WPS):
- AP เจ้าหนี้/ชำระเงิน
- AR ลูกหนี้/รับชำระ
- GL / ปิดงวด
- Tax / VAT
- การเงิน / ธนาคาร
- KPI ผู้จัดการบัญชี
- Mindset: AP 3-ชั้นตรวจ, การเงิน Cash Flow Control

---

## 2. Module ใน Portal ที่ map กับ Skill นี้

| กลุ่ม Portal | Prefix | Module | ไฟล์ Skill ที่เกี่ยว |
|---|---|---|---|
| การเงิน | FI-1 | AR Ledger (ลูกหนี้) | `03-ar.md` |
| การเงิน | FI-2 | AP Ledger (เจ้าหนี้) | `02-ap.md`, `11-ap-mindset.md` |
| การเงิน | FI-3 | Bank Reconciliation | `06-finance-bank.md`, `12-finance-mindset.md` |
| การเงิน | FI-4 | VAT / Tax Report | `04-tax.md` |
| การเงิน | FI-5 | GL / Closing | `05-gl-closing.md` |
| การเงิน | FI-13A | Dual-Book Entity CF-9 | `05-gl-closing.md` |
| การเงิน | FI-13B | Dual-Book Entity CF-9 | `05-gl-closing.md` |
| การเงิน | FI-10 | Accounting Dashboard | `01-overview.md`, `07-kpi.md` |
| Config | CF-7 | Credit Limit / Tier | `03-ar.md` |
| Config | CF-9 | Entity Tagging (Dual-Book) | `05-gl-closing.md` |

---

## 3. Mockup File ที่อ้างอิงได้

```
fi1-ar-ledger-mockup.html            → 03-ar.md
fi2-ap-ledger-mockup.html            → 02-ap.md, 11-ap-mindset.md
fi3-bank-reconciliation-mockup.html  → 06-finance-bank.md
fi4-tax-report-mockup.html           → 04-tax.md
fi5-gl-closing-mockup.html           → 05-gl-closing.md
fi13a-dual-book-entity-mockup.html   → 05-gl-closing.md (CF-9 → FI-13A)
fi13b-dual-book-entity-mockup.html   → 05-gl-closing.md (CF-9 → FI-13B)
fi10-accounting-dashboard-mockup.html → 07-kpi.md
cf7-credit-limit-mockup.html         → 03-ar.md
cf9-entity-tagging-mockup.html       → 05-gl-closing.md
```

---

## 4. BC365 Entity ที่เกี่ยวข้อง

| BC365 Entity | ใช้ใน Module | หมายเหตุ |
|---|---|---|
| `customers` | FI-1 AR | master ลูกค้า (read) |
| `vendors` | FI-2 AP | master เจ้าหนี้ (read) |
| `salesInvoices` | FI-1 AR | invoice ออกให้ลูกค้า |
| `purchaseInvoices` | FI-2 AP | invoice จากเจ้าหนี้ |
| `generalLedgerEntries` | FI-5, FI-13 | posting GL |
| `bankAccounts` | FI-3 | บัญชีธนาคาร |
| `dimensionValues` | CF-9, FI-13 | Entity Tag (Dual-Book) |
| `vatPostingSetup` | FI-4 | VAT config |

ดูรายละเอียดเต็มใน `/portal/04-bc365-integration.md` หัวข้อ "Finance Entity Mapping"

---

## 5. Key Business Rule ที่ Skill + Portal ต้องใช้ร่วมกัน

| Rule | รายละเอียด | Portal ใช้ที่ไหน | Skill อ้างอิง |
|---|---|---|---|
| **V — VAT Golden Rule** | discount ก่อน VAT | FI-4, SL-1, PO | `04-tax.md` |
| **D — Dual-Book** | Entity Tag CF-9 → FI-13A/B | FI-13, CF-9 | `05-gl-closing.md` |
| **B5 — AP 3-ชั้นตรวจ** | PO + GRN + Invoice ต้องตรง | FI-2 | `11-ap-mindset.md` |
| **R — Credit Tier** | SL-F1 + PO ผ่าน CF-7 | SL, CF-7, FI-1 | `03-ar.md` |

---

## 6. เมื่อไรควรอ่าน Skill นี้ + Portal คู่กัน

- ออกแบบหน้าใหม่ใน FI-* → อ่าน `portal/01-module-list.md` + `skill/references/` ที่เกี่ยวข้อง
- แก้ field ใน FI mockup → อ่าน `portal/03-ui-ux-convention.md` + `skill/07-kpi.md`
- วาง BC365 integration → อ่าน `portal/04-bc365-integration.md` + `skill/05-gl-closing.md`
- ถามเรื่อง mindset/SOP บัญชี → อ่าน `skill/11-ap-mindset.md` หรือ `12-finance-mindset.md`

---

## 7. หมายเหตุสถานะ

- **08-system-hero.md** ยังเป็น TBD (รอคู่มือระบบ Hero — ระบบเดิม)
- **09-system-dynamics.md** ยังเป็น TBD (รอคู่มือ Dynamics BC365)
- เมื่อมีเอกสารครบแล้วค่อยเติม content เพื่อใช้เป็น baseline สำหรับ Migration Portal ↔ BC365
