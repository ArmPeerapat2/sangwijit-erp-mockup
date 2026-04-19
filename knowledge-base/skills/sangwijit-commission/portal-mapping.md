# Portal Mapping — sangwijit-commission

> **จุดประสงค์:** เชื่อม Skill `sangwijit-commission` กับ Dynamic Web Portal
> ใช้คู่กับ `/knowledge-base/portal/` และ `SKILL.md` ของ skill นี้

---

## 1. Skill นี้ครอบคลุมเรื่องอะไร (สรุป)

ออกแบบและคำนวณ Commission 3 ช่องทาง:
- **ค้าปลีก** (SWE-RET)
- **ค้าส่ง** (SWT-WHS)
- **ส่งออก** (WPS-EXP)

หลักการ 4 ชั้น: เป้าทีม → เป้าหมวด/แบรนด์ → เป้ารายตัว → ทักษะการขาย

---

## 2. Module ใน Portal ที่ map กับ Skill นี้

| กลุ่ม Portal | Prefix | Module | ไฟล์ Skill ที่เกี่ยว |
|---|---|---|---|
| Sales | SL-F5 | Sales Dashboard | KPI พนักงานขาย |
| Sales | SL-F6 | Commission Sheet | Commission calculation |
| Sales | SL-F7 | Target Tracking (4-Layer) | เป้าทีม/หมวด/ตัว |
| Sales | SL-F8 | Incentive Dashboard | B1 Sale-In Accrual |
| Master | MD-4 | Employee (Sales) | พนักงานขาย + channel |
| Finance | FI-6 | Payroll Commission | จ่ายค่า commission |

---

## 3. Mockup File ที่อ้างอิงได้

```
sl-f5-sales-dashboard-mockup.html       → KPI (แยก Channel)
sl-f6-commission-sheet-mockup.html      → Commission sheet
sl-f7-target-tracking-mockup.html       → 4-layer target
sl-f8-incentive-dashboard-mockup.html   → Sale-In Accrual
md4-employee-mockup.html                → พนักงาน (v1/v2/v3)
fi6-payroll-commission-mockup.html      → จ่าย
```

---

## 4. BC365 Entity ที่เกี่ยวข้อง

| BC365 Entity | ใช้ใน Module | หมายเหตุ |
|---|---|---|
| `salespersonsPurchasers` | MD-4, SL-F5 | master พนักงานขาย |
| `salesOrders` | SL-F6 | อ้างอิงคำนวณ |
| `salesInvoices` | SL-F6 | invoice ที่ commission ปิดได้ |
| `employees` | MD-4, FI-6 | master พนักงาน |
| `dimensionValues` | SL-F7 | channel tag (RET/WHS/EXP) |

ดูรายละเอียดเต็มใน `/portal/04-bc365-integration.md` หัวข้อ "Commission/Sales Entity Mapping"

---

## 5. Key Business Rule ที่ Skill + Portal ต้องใช้ร่วมกัน

| Rule | รายละเอียด | Portal ใช้ที่ไหน | Skill อ้างอิง |
|---|---|---|---|
| **B1 — Sale-In Accrual** | Accrual ตามใบเสนอ/SO | SL-F8 | Incentive |
| **B5 — Sale-Out Confirm** | ยืนยันเมื่อลูกค้าจ่าย | SL-F6 | Commission |
| **4-Layer Target** | ทีม → หมวด → ตัว → skill | SL-F7 | หลักการ 4 ชั้น |

---

## 6. เมื่อไรควรอ่าน Skill นี้ + Portal คู่กัน

- ออกแบบ Commission Sheet ใหม่ → อ่าน skill หลักการ 4 ชั้น + SL-F6/F7
- ปรับ Incentive seasonal → อ่าน skill + SL-F8
- วิเคราะห์ commission shape พฤติกรรม → อ่าน skill Mindset
- ดีไซน์ Dashboard แยก channel → อ่าน `portal/03-ui-ux-convention.md` + skill 3 channel
