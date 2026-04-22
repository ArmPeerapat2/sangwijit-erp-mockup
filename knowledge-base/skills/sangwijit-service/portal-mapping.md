# Portal Mapping — sangwijit-service

> **จุดประสงค์:** เชื่อม Skill `sangwijit-service` กับ Dynamic Web Portal
> ใช้คู่กับ `/knowledge-base/portal/` และ `SKILL.md` ของ skill นี้

---

## 1. Skill นี้ครอบคลุมเรื่องอะไร (สรุป)

คู่มือช่างศูนย์บริการแสงวิจิตร 3 หมวด:
- **รู้จักแสงวิจิตร** — WeService, SOP รับ/ส่งงาน, เบิกอะไหล่, ประกัน ใน/นอก, ค่าแรง + Job Incentive
- **รู้จักสินค้า** — เทคนิคซ่อมแต่ละหมวด, อาการ/สาเหตุ/วิธีแก้
- **รู้จักอะไหล่** — ตรวจสอบอะไหล่เสีย, พาร์ทนัมเบอร์, เบิก

---

## 2. Module ใน Portal ที่ map กับ Skill นี้

| กลุ่ม Portal | Prefix | Module | ไฟล์ Skill ที่เกี่ยว |
|---|---|---|---|
| Service | SV-1 | Service Job (WeService) | SOP รับงาน |
| Service | SV-2 | Spare Parts Request | เบิกอะไหล่ |
| Service | SV-3 | Warranty Check | ประกัน ใน/นอก |
| Service | SV-4 | Technician Schedule | ตารางช่าง |
| Service | SV-5 | Job Incentive Dashboard | ค่าแรง + Incentive |
| Delivery & Install | SV-6 | Delivery + Installation | ส่งงาน/ติดตั้ง |
| Delivery | DL-2 | Installation Job | งานติดตั้ง |
| Warehouse | WH-2 | GRN (รับอะไหล่) | อะไหล่เข้าคลัง |
| Master | MD-3 | Spare Parts Master | พาร์ทนัมเบอร์ |

---

## 3. Mockup File ที่อ้างอิงได้

```
sv1-service-job-mockup.html         → WeService flow
sv2-spare-parts-request-mockup.html → เบิกอะไหล่
sv3-warranty-check-mockup.html      → ประกัน
sv4-technician-schedule-mockup.html → ตารางช่าง
sv5-job-incentive-mockup.html       → ค่าแรง + Incentive
dl1-delivery-schedule-mockup.html   → ตารางส่ง
dl2-installation-job-mockup.html    → งานติดตั้ง
md3-spare-parts-master-mockup.html  → พาร์ทนัมเบอร์
```

---

## 4. BC365 Entity ที่เกี่ยวข้อง

| BC365 Entity | ใช้ใน Module | หมายเหตุ |
|---|---|---|
| `serviceOrders` | SV-1 | service order |
| `serviceItems` | SV-3 | สินค้าที่มีประกัน |
| `serviceContracts` | SV-3 | สัญญาประกัน |
| `items` (spare parts) | MD-3, SV-2 | master อะไหล่ |
| `itemLedgerEntries` | SV-2, WH-2 | ledger อะไหล่ |
| `resources` | SV-4 | ช่าง (resource) |

ดูรายละเอียดเต็มใน `/portal/04-bc365-integration.md` หัวข้อ "Service Entity Mapping"

---

## 5. Key Business Rule ที่ Skill + Portal ต้องใช้ร่วมกัน

| Rule | รายละเอียด | Portal ใช้ที่ไหน | Skill อ้างอิง |
|---|---|---|---|
| **Warranty In/Out** | ในประกันไม่เก็บค่าแรง, นอกประกันเก็บ | SV-3 | ประกัน ใน/นอก |
| **Job Incentive** | คิด incentive ต่อ job ปิด | SV-5 | ค่าแรง + Incentive |
| **Spare Parts 3-Way** | เบิก + ใช้ + คืน ต้องตรง | SV-2 | SOP เบิกอะไหล่ |

---

## 6. เมื่อไรควรอ่าน Skill นี้ + Portal คู่กัน

- ออกแบบหน้า SV/DL → อ่าน `portal/01-module-list.md` + skill SOP
- Training ช่างใหม่ → อ่าน SKILL.md + SV mockup
- วาง flow ประกัน → อ่าน skill "ประกัน" + SV-3
- ดีไซน์ Job Incentive Dashboard → อ่าน `portal/03-ui-ux-convention.md` + skill ค่าแรง
