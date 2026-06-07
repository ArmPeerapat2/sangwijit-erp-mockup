# Branch-level running number — Portal-managed (ไม่ใช่ BC Number Series)

เลขที่เอกสารในพอร์ทัลแบ่ง series **ต่อสาขา × ประเภทเอกสาร** โดย Portal จัดการ running เอง ไม่ใช้ BC Number Series (ซึ่ง global เดียว ทำ sub-series ต่อสาขาไม่ได้ native)

## Format มาตรฐาน (ใช้ทุก doc type)
```
[BranchCode][DocCode]-[YYMM]-[###]
```
- **BranchCode** = รหัสสาขา 2 หลัก (01=อากาศ, 02=สว่าง, 03=บ้านม่วง, 04=ท่าแร่, 08=สนง.ใหญ่ ฯลฯ)
- **DocCode** = รหัสประเภทเอกสาร (S=ขอเบิก, SO=สั่งขาย, GR=รับของ, INV=Invoice ฯลฯ)
- **YYMM** = ปี+เดือน ค.ศ. 2 หลัก (2606 = มิ.ย. 2026)
- **###** = running 3 หลัก reset ทุกเดือน ต่อ Branch × DocCode

ตัวอย่าง:
- `04S-2606-001` = สาขาท่าแร่ · ใบขอเบิก · มิ.ย.69 · เลขที่ 1
- `08SO-2606-001` = สนง.ใหญ่ · ใบสั่งขาย · มิ.ย.69 · เลขที่ 1

## BranchCode auto จาก login
- ผู้ใช้ login สาขาไหน → Branch Prefix ถูกใส่อัตโนมัติ (ไม่ต้องกรอกเอง)
- ตรงกับ legacy: "?" ใน format `?YYMM-###` = ระบบใส่ให้จาก session

## เหตุผล
- Legacy (HERO/TPM) ใช้ sub-series ต่อสาขา → user คุ้นเคย · trace ง่าย
- BC Number Series = global series เดียว ทำ sub-series ไม่ได้ → Portal ต้องจัดการเอง
- **แนวทางเดียวกันทุก doc type** = ลดความสับสน ง่ายต่อการ config

## Consequences
- **CF-2.2 Number Series** เปลี่ยนจาก "cut-to-BC" → **Portal-managed**
- Portal ต้องเก็บ running counter ต่อ Branch × DocCode × YYYYMM
- BC ยังรับเลขจาก Portal (Portal ส่ง pre-defined number ไป BC ตอน Post)
- CF-2.2 mockup ต้องออกแบบใหม่: ตาราง Branch × DocType + ตั้ง format + current running
- Uniqueness guarantee: Portal ต้อง lock ก่อน increment (prevent duplicate)
