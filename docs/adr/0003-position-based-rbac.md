# Position-based RBAC with per-page CRUD (replaces fixed 9-role model)

สิทธิ์ผู้ใช้ในพอร์ทัลกำหนดผ่าน **Position (ตำแหน่ง) ที่ admin สร้างเองได้** ไม่ใช่ role ตายตัว. พนักงาน 1 คนได้ **1 Position เท่านั้น**.

A **Position** record:
- **Scope:** ผูก Branch + Department (เห็น/ทำได้เฉพาะสาขา + กลุ่มงานของตน)
- **Permission list:** สิทธิ์ **CRUD (ดู/เพิ่ม/แก้ไข/ลบ) ราย "หน้า" (per-page)** ครอบทุกหน้าในพอร์ทัล — granular ระดับหน้า ไม่ใช่แค่กลุ่มเมนู
- **วงเงิน (Authority Limit):** เพดานอำนาจอนุมัติ/ส่วนลดของ Position/พนักงาน → ผูก CF-2.6 Approval Matrix (amount tier)

แทนที่ของเดิมใน `CF_config.md` CF-3 (RBAC) ที่นิยาม **9 fixed roles × 28 functions**. เลือกแบบนี้เพราะแสงวิจิตรต้องการสิทธิ์ที่ **config ได้เอง + scope ตามสาขา/แผนก + ละเอียดระดับหน้า** (4 นิติบุคคล · 10 สาขา · หลายแผนก — role ตายตัวไม่พอ).

Maker ≠ Checker ยังบังคับผ่าน CF-2.6 (ผู้สร้าง ≠ ผู้อนุมัติ) เหมือนเดิม.

## Consequences
- spec `CF_config.md` CF-3 ต้องเขียนใหม่: 9 roles → Position model (configurable · per-page CRUD · branch/dept scope · authority limit). 9-role/28-function matrix เดิม = reference เท่านั้น
- **Employee master (MD-4)** ถือ field: 1 Position (assigned) + วงเงิน + branch + department — ไม่ถือ permission matrix เอง
- Permission storage = ลิสต์ per-page × CRUD ต่อ Position (ทุกหน้าพอร์ทัล)
- Salesperson/Technician ไม่ใช่ flag อิสระอีกต่อไป — เป็นคุณสมบัติที่ผูกกับ Position
- ต้องมีหน้า **CF Position/RBAC** สำหรับสร้าง Position + กำหนด permission list (โมดูลแยกจาก Employee)
