# ระบบบัญชี: Hero (ระบบปัจจุบัน)

> **สถานะ:** Draft v1 — ร่างโครงสร้างตาม best-practice  
> รอ input จริงจากทีมบัญชี/IT เพื่อกรอก field ที่มีเครื่องหมาย `[รอข้อมูล]`

---

## 1. Hero คืออะไร

Hero เป็นระบบบัญชีที่กลุ่มแสงวิจิตรใช้งานอยู่ในปัจจุบัน (ก่อน migrate ไป BC365) ใช้สำหรับ:

- บันทึกเอกสารบัญชี AP / AR
- ออกใบกำกับภาษี / ใบเสร็จ
- กระทบยอดธนาคาร (Bank Reconciliation)
- ปิดงวด (Month-end, Year-end)
- ออกรายงานบัญชีและภาษี

**Vendor / เวอร์ชัน:** `[รอข้อมูล — ชื่อบริษัทผู้พัฒนา + version]`  
**Database:** `[รอข้อมูล — SQL Server / MySQL / อื่นๆ]`  
**วิธี access:** `[รอข้อมูล — Desktop client / Web / Terminal]`

---

## 2. โครงสร้างเมนูหลัก

| เมนู | ใช้ทำอะไร | Role ที่ใช้หลัก |
|---|---|---|
| ลูกหนี้ (AR) | บันทึก Invoice ลูกค้า, รับชำระ, ออกใบเสร็จ | AR |
| เจ้าหนี้ (AP) | บันทึก Invoice Vendor, จ่ายชำระ | AP |
| ธนาคาร | Bank Reconciliation, โอนเงิน | การเงิน |
| GL | ผังบัญชี, JV, งบทดลอง | GL |
| ภาษี | VAT ซื้อ/ขาย, ภ.ง.ด. 3/53 | Tax |
| รายงาน | งบดุล, งบกำไรขาดทุน, Aging | ทุก role |
| ปิดงวด | Month-end, Year-end | GL / ผู้จัดการ |

> `[รอข้อมูล — ชื่อเมนูจริงตามที่ใช้ใน Hero]`

---

## 3. Flow งาน AP ใน Hero

```
ใบแจ้งหนี้ Vendor มา
  ↓
ตรวจ 3-ชั้น (PO + GRN + Invoice) ← กฎ B5
  ↓
คีย์ Invoice เข้า Hero (เมนู AP → บันทึก Invoice)
  ↓
ผู้จัดการอนุมัติ
  ↓
การเงินเตรียมจ่าย (cheque / transfer)
  ↓
คีย์รับเลขที่เช็ค / reference โอน
  ↓
Bank Rec เมื่อเงินออกจากบัญชี
```

**หน้าจอที่ใช้บ่อย:** `[รอข้อมูล — ชื่อหน้าจอ/menu path]`

---

## 4. Flow งาน AR ใน Hero

```
SO จากฝ่ายขาย → ตรวจ Credit Tier (กฎ R)
  ↓
จัดของ → ส่งของ
  ↓
ออก Invoice + ใบกำกับภาษีใน Hero
  ↓
Post เข้า GL + VAT ขาย
  ↓
ลูกค้าชำระเงิน → คีย์รับชำระใน Hero
  ↓
ออกใบเสร็จ + ปิด Invoice
  ↓
Bank Rec
```

**หน้าจอที่ใช้บ่อย:** `[รอข้อมูล]`

---

## 5. Bank Reconciliation

- Frequency: `[รอข้อมูล — รายวัน / รายสัปดาห์ / รายเดือน]`
- Source ข้อมูลธนาคาร: `[รอข้อมูล — statement PDF / export CSV / API]`
- Tolerance: `[รอข้อมูล — เช่น ±1 บาท ไม่ต้อง escalate]`
- ใครทำ: `[รอข้อมูล — การเงินคนไหน]`

---

## 6. รายงานที่ใช้บ่อย

| รายงาน | Frequency | ผู้รับ |
|---|---|---|
| งบทดลอง | รายเดือน | ผู้จัดการบัญชี |
| งบกำไรขาดทุน | รายเดือน | ผู้บริหาร |
| งบดุล | รายเดือน | ผู้บริหาร |
| AR Aging | รายสัปดาห์ | ผู้จัดการ + ฝ่ายขาย |
| AP Aging | รายสัปดาห์ | การเงิน |
| VAT ซื้อ/ขาย | รายเดือน | Tax |
| Cash Flow | รายวัน | การเงิน |

> `[รอข้อมูล — format จริงของแต่ละรายงาน + path เมนู]`

---

## 7. ปิดงวด

### Month-end Checklist (ร่าง)

- [ ] ตรวจ AP/AR ให้เคลียร์ทุก Invoice ในงวด
- [ ] Bank Reconciliation ครบทุกบัญชี
- [ ] ตั้งค่า Accrual (ค่าใช้จ่ายค้างจ่าย, รายได้ค้างรับ)
- [ ] Depreciation (ค่าเสื่อม)
- [ ] ตรวจ VAT ซื้อ/ขายตรงกับ GL
- [ ] ออกงบทดลอง review ผิดปกติ
- [ ] Lock งวด

### Year-end

- [ ] ทุกอย่างใน Month-end
- [ ] Physical Inventory
- [ ] ปิด retained earning
- [ ] เตรียม audit pack

> `[รอข้อมูล — step-by-step จริงใน Hero, กี่วันก่อน/หลัง EoM]`

---

## 8. ข้อจำกัด / ปัญหาที่เจอ (ทำไมถึง migrate)

- `[รอข้อมูล — ปัญหาที่ user เจอจริง เช่น ไม่รองรับ multi-entity, report slow, ไม่มี API, …]`
- ตัวอย่างประเด็นที่พบเห็นบ่อยในระบบเดิม:
  - ไม่รองรับ Dual-Book entity tagging → ต้องทำใน Excel
  - Concurrent user จำกัด
  - ไม่มี audit trail ละเอียด
  - ไม่มี REST API ให้ระบบอื่น integrate
  - Custom report ยาก ต้องจ้าง vendor

---

## 9. สิ่งที่ต้อง migrate ไป BC365

| หมวด | Hero | BC365 | ความเสี่ยง |
|---|---|---|---|
| Master ลูกค้า | `[รอข้อมูล]` | `customers` | ต้อง map field |
| Master Vendor | `[รอข้อมูล]` | `vendors` | ต้อง map field |
| ผังบัญชี (COA) | `[รอข้อมูล]` | `accounts` | อาจต้อง restructure |
| Opening balance | รายบัญชี | `generalLedgerEntries` | cutover date ต้องชัด |
| Open AR | รายใบ | `salesInvoices` | ต้อง match ใบที่ยังไม่เคลียร์ |
| Open AP | รายใบ | `purchaseInvoices` | ต้อง match ใบที่ยังไม่เคลียร์ |
| VAT ค้าง | รายเดือน | `vatEntry` | ต้อง reconcile |

ดู `09-system-dynamics.md` สำหรับ BC365 side และ `/portal/04-bc365-integration.md` สำหรับ API mapping

---

## 10. Checklist สำหรับ interview ทีมบัญชีเพื่อเติมข้อมูลจริง

- [ ] ขอ screenshot เมนูหลัก Hero
- [ ] ขอ export format ของแต่ละรายงาน
- [ ] ขอดู SOP ปิดงวดปัจจุบัน
- [ ] ถาม pain point ของแต่ละ role (AR/AP/GL/Tax/การเงิน)
- [ ] ถามปัญหาที่อยากให้ BC365 แก้
- [ ] ขอ sample data ของ AP/AR invoice 10 รายการสุดท้าย

---

> **หมายเหตุ:** ไฟล์นี้เป็น framework ร่าง ให้ทีมบัญชี/IT เติม field ที่มี `[รอข้อมูล]` ก่อนนำไปใช้จริง
