# Portal Mapping — sangwijit-hr

> **จุดประสงค์:** เชื่อม Skill `sangwijit-hr` กับ Dynamic Web Portal
> ใช้คู่กับ `/knowledge-base/portal/` และ `SKILL.md` ของ skill นี้

---

## 1. Skill นี้ครอบคลุมเรื่องอะไร (สรุป)

สร้างเอกสาร HR แสงวิจิตร 4 Layer:
- **Layer 0** — Department Overview
- **Layer 1** — JD + KPI
- **Layer 2** — SOP
- **Layer 3** — KPI Dashboard

ครอบคลุมโครงสร้างองค์กร, เงินเดือน, Commission ของทุกบริษัทในกลุ่ม

---

## 2. Module ใน Portal ที่ map กับ Skill นี้

| กลุ่ม Portal | Prefix | Module | ไฟล์ Skill ที่เกี่ยว |
|---|---|---|---|
| Master | MD-4 | Employee | Layer 1 JD/KPI |
| Master | MD-5 | Department / Org Structure | Layer 0 |
| Finance | FI-6 | Payroll | เงินเดือน |
| Finance | FI-7 | Commission Payout | Commission |
| Config | CF-8 | Role / RBAC | RBAC 9 roles |
| Dashboard | RP-* | KPI Dashboard | Layer 3 |
| Sales | SL-F5 | Sales KPI | KPI พนักงานขาย |

---

## 3. Mockup File ที่อ้างอิงได้

```
md4-employee-mockup.html             → Employee master (v1/v2/v3)
md5-department-mockup.html           → Org structure
fi6-payroll-mockup.html              → Payroll
fi7-commission-payout-mockup.html    → Commission payout
cf8-role-rbac-mockup.html            → RBAC
rp-hr-dashboard-mockup.html          → HR Dashboard
sl-f5-sales-dashboard-mockup.html    → Sales KPI
```

---

## 4. BC365 Entity ที่เกี่ยวข้อง

| BC365 Entity | ใช้ใน Module | หมายเหตุ |
|---|---|---|
| `employees` | MD-4, FI-6 | พนักงาน master |
| `departments` | MD-5 | แผนก |
| `dimensionValues` | MD-5, CF-8 | tag organization |
| `userGroups` | CF-8 | RBAC group |
| `permissionSets` | CF-8 | permission |

> หมายเหตุ: Payroll จริงอาจอยู่ในระบบ HR แยก (Hero/อื่นๆ) — ดูใน skill เดิมเรื่องระบบเงินเดือน

---

## 5. Key Business Rule ที่ Skill + Portal ต้องใช้ร่วมกัน

| Rule | รายละเอียด | Portal ใช้ที่ไหน | Skill อ้างอิง |
|---|---|---|---|
| **4-Layer Doc** | JD→KPI→SOP→Dashboard | MD-4, RP-* | Layer 0-3 |
| **RBAC 9 Roles** | 9 roles mapped ให้ทุก module | CF-8 | RBAC |
| **Entity Tag** | พนักงานผูกกับนิติบุคคล SWT/SWE/VMN/WPS | MD-4, CF-9 | Org Structure |

---

## 6. เมื่อไรควรอ่าน Skill นี้ + Portal คู่กัน

- สร้าง JD/KPI ใหม่ → ใช้ skill Layer 1 + ผูกกับ MD-4
- ออก SOP → ใช้ skill Layer 2
- ดีไซน์ KPI Dashboard → อ่าน `portal/03-ui-ux-convention.md` + skill Layer 3
- วาง RBAC → อ่าน `portal/04-bc365-integration.md` "RBAC 9 Roles" + skill โครงสร้างองค์กร
