# _reference — สารบัญอ้างอิง (สกรีนช็อต ERP เดิม → กรอบแนวทางพอร์ทัล)

รูปจาก **Smile Account Hero:FULL (บริษัท แสงวิจิตร เทรดดิ้ง)** = ERP เดิม ใช้เป็นแม่แบบ UX/UI/logic

| โฟลเดอร์ | เนื้อหา | ใช้กับ |
|---|---|---|
| [ComponanceShare/](ComponanceShare/) | shared component: รับชำระเงิน (payment) · ค้นหาลูกค้า (1-2) · ค้นหาสินค้า (product) | sc-* · **ข้อ 4 sc-payment** |
| [SystemDefaults/](SystemDefaults/README.md) | บันทึกข้อมูลบริษัท: แท็บ Company + Options (ค่าตั้งต้นระบบ ครบทุก flag) | หน้า Config / CF · company setup |
| [FormReportDesigner/](FormReportDesigner/README.md) | 1.7 สร้างฟอร์มเอกสาร (drag-drop) + 1.B สร้างรายงาน | **ข้อ 7** (drag-drop จัดหน้ากระดาษ · ทำภายหลัง) |
| [MenuStructure/](MenuStructure/README.md) | โครง+เลขเมนู (1-9,A-H,Q) · module groups · 1.5.1.x master data | จัดลำดับ/เลขเมนู sidebar |
| [MasterDataSetup/](MasterDataSetup/README.md) | pattern list-detail ของหน้า 1.5.1.x · **ข้อมูลสาขาจริง SWT** · **ประเภทบัตร+%ชาร์จ** | หน้า master/config · **feed sc-payment** · branch dropdown |
| docs/ | (เดิม) เอกสารอ้างอิงนำเข้า | — |

> **ไฟล์รูปจริง (.jpg):** ผม (AI) เซฟภาพจากแชทลง disk เองไม่ได้ — แต่ละโฟลเดอร์ถอดเนื้อหาเป็น README.md ครบแล้ว · ให้ user ลากไฟล์รูปมาวางในโฟลเดอร์ตามชื่อที่ระบุใน README
> **user แจ้ง "มีเพิ่มอีก"** — เพิ่มโฟลเดอร์/แถวใหม่ที่นี่เมื่อได้ ref ชุดถัดไป
