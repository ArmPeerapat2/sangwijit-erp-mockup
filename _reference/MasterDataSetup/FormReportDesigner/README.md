# Form & Report Designer (ERP เดิม) — อ้างอิงข้อ 7 (drag-drop จัดหน้ากระดาษ)

2 เครื่องมือ WYSIWYG ของ ERP เดิม ที่ user อยากได้แนวเดียวกันในพอร์ทัล (ออกแบบฟอร์มเอกสาร/รายงานเองได้)
> รูปจริง: ลากวาง `form-designer.jpg`, `report-builder.jpg` ในโฟลเดอร์นี้

---

## 1.7 สร้างฟอร์มเอกสาร — Document Form Designer (drag-drop)
Canvas กระดาษเปล่า (A4) + ลากวาง element ลงไป
- **Toolbar บน:** New · Open · Save · Preview · Printer · PageLayout · PageSize · Close · Register · PRN Cfg
- **Font:** เลือกฟอนต์ (Angsana New) · ขนาด (14) · B / I / U · สี
- **Element ลากวาง:** `Source` · `Select` · **Label** · **Field** · **Table** · **Rectangle** · **Image** · **BarCode** · Property · Background
- **จัดเรียง:** align ซ้าย/กลาง/ขวา · distribute · เครื่องมือตาราง (merge/split cell)

→ นี่คือแม่แบบข้อ 7: หน้าออกแบบฟอร์มเอกสาร ที่ลาก Label/Field/Table/Image/BarCode วางบนหน้ากระดาษได้ + เลือก PageSize/PageLayout + Preview/Print

## 1.B สร้างรายงาน — Report Builder
- **Toolbar:** ใหม่ · เปิด · บันทึก · คำสั่ง · เงื่อนไข · พิมพ์ตัวอย่าง · พิมพ์ · พิมพ์... · **Excel** · รูปแบบหน้า · ขนาดกระดาษ · คอลัมน์ · ปิดหน้าจอ
- **แถว 2:** ข้อมูลรายงาน · มุมมอง · คำนวณหน้า · font · รูปแบบ · รูปแบบเริ่มต้น
- **หัวรายงาน (fix):** บริษัท · หมายเหตุ · วันที่พิมพ์ | หน้าที่ · พิมพ์โดย · พิมพ์ครั้งที่
- **body:** ตารางคอลัมน์เลือกเอง (ตัวอย่าง Date · DocNo) · export Excel ได้

→ report แบบมี "เงื่อนไข" + เลือกคอลัมน์ + export Excel + หัว/ท้ายกระดาษมาตรฐาน

**หมายเหตุ scope:** ข้อ 7 นี้ user บอก "จะทำภายหลัง" — เก็บ ref ไว้ก่อน
