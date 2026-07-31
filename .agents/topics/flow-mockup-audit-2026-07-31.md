# Flow ↔ Mockup Consistency Audit (2026-07-31)

ตรวจ 6 flow (จัดส่ง/เคลม/บริการ/ส่งเสริมการขาย/ราคา/rebate) เทียบ record (workflow เคาะแล้ว) กับ mockup จริง · 6 agents ขนาน · READ-ONLY

## สรุปคะแนนแต่ละ flow
| flow | ✅ ทำดีแล้ว | ⚠️ ช่องว่างหลัก |
|---|---|---|
| **จัดส่ง (DL)** | ทีมเอง POD+COD (sv7) · SV-6 คิว/assign/QA | path 3PL หายทั้งเส้น (carrier/tracking) · ไม่มีปุ่มยกเลิกงาน (Partial=นัดใหม่ ขัด decision) · WH-2 ไม่อ้าง JOB |
| **เคลม (CLM)** | pre-sale · S1-S4 (มี S3) · 1.1a/1.1b+loaner · rename S2 | S2/S3 รับของ WH-1 ยังไม่ wired (loop ลอย) · S4 approval แค่ note · จอเอียงไป ② · bin 6/netting ไม่มี field |
| **บริการ (SV)** | billing payer per-line (sv4) · gate คืนอะไหล่ (sv4.4b) · multi-axis badge (sv-q) — **ครบตรง record** | **sv5 เป็น desktop ไม่ใช่มือถือช่าง** · stage-4 actions ขาด (ยกเลิก/นัดถัดไป/กดรับสินค้า) · มัดจำ (4.2/6.1) ไม่ชัด |
| **ส่งเสริมการขาย (PM)** | GP guard · stack≤2 · VAT-last · **อนุมัติตอนสร้าง** · lifecycle | conflict-check gate (1.2) ไม่มี · field สาขา/SITECODE ขาด · gate ของแถมเป็นแค่ warning |
| **ราคา (PM-1)** | lifecycle · history PM-1.3 · ต้นทุนซ่อน · pm5 simulator | **ขัด decision: แตกแถวตาม qty (ควรเป็นช่องทาง)** · ไม่มี channel master · cost floor ไม่มี · โหมด ①/② ปน |
| **rebate (PO-7)** | 4 types · แหล่งยอด auto · **GL-at-Realized ถูก (v2.1)** · single payment point | Sell-in 2 โหมด (บนบิล/ตามหลัง) ไม่แยก · รับปาก confidence เป็น cosmetic · Monthly Recon/netting ไม่มีจอ |

---

## 🎯 จัดลำดับข้าม flow (ควรแก้ก่อน)

### P1 — ขัด decision / loop ไม่ปิด (ด่วนสุด)
1. **ราคา: pm1 เปลี่ยน qty-tier → ช่องทาง (channel)** + สร้าง **channel master** — ขัด decision "ไม่มี qty · ต่อช่องทาง" ตรงๆ · biggest
2. **จัดส่ง: SV-6 assign เพิ่ม "ช่องทางส่ง (ทีมเอง/3PL)" + carrier + tracking** — path 3PL หายทั้งเส้นตั้งแต่มอบหมาย
3. **เคลม: wire S2/S3 → wh1-receive** (ref CLM + โหมดรับของแทน/ซ่อมกลับ) — ปลายทางลอย S3 เพิ่งเคาะ
4. **rebate: Sell-in 2 โหมด (บนบิล = ส่วนลด PO terminal / ตามหลัง = accrue)** — กระทบ VAT trap + track ซ้ำ

### P2 — gate/control ที่ตัดสินแล้วแต่เป็นแค่ note
5. **เคลม: S4 write-off = approval-tier control จริง** (ช่องผู้อนุมัติ/Maker≠Checker/VRA) — เงินหายจริง
6. **PM: (a) conflict-check gate ก่อน Activate · (b) field ขอบเขตสาขา SITECODE · (c) ของแถม stock gate**
7. **ราคา: cost floor guard ตอน Post pm1** (ราคา<ทุน เตือน/บล็อก) + ระบุ Maker≠Checker
8. **rebate: รับปาก = badge 🟡 + gate เตือนตอน Realize · เพิ่ม tab Recon/กระทบยอด+netting**

### P3 — โครงสร้าง/action ปลายสาย
9. **บริการ: sv5 ทำ mobile variant (ช่าง)** + เติม stage-4 (ยกเลิก+เหตุผล/นัดถัดไป/กดรับสินค้า)
10. **จัดส่ง: ปุ่ม "ส่งไม่สำเร็จ→ยกเลิก+คืนคลัง WH-1" · WH-2 อ้าง JOB (SV-6)**

---

## ❓ จุดต้องเคาะ (record ↔ mockup/spec ไม่ตรง)
1. **loaner: record = WH-3 · sv1 mockup = WH-2R** — ใช้อันไหน?
2. **sanction: record §4.1 = 60 วัน STOP · spec rule4 + po7 mockup = 30 วัน** — ตัวเลขไหนจริง?
3. **spec `PO_purchase.md` บรรทัด 742 (GL ตอน Accrued) ขัด 674 (GL ตอน Realized)** — mockup ทำถูกตาม 674 · ควรแก้ 742 ในไฟล์ spec
4. **SV-7 scope:** ครอบแค่ "ส่งงานซ่อมคืน" หรือรวม "ส่งของขายจาก SL-4" ด้วย?
5. **ราคา determination wording:** mockup strip = "โปร→มาตรฐานตามกลุ่มลูกค้า" · record = "มาตรฐานตามช่องทางก่อน→โปร" — sync ให้ตรง
6. **PCR vs PM-3:** mockup เรียก "ใบขอเปลี่ยนราคา (PM-3)" · record เรียก "PCR" — เลือกคำเดียว
7. **sv1 นัดหมาย:** sv1 ผลักนัดไป SV-2 ทั้งหมด · record บอก admin นัดได้ตั้งแต่รับเรื่อง (guard 1.2) — sync

## หมายเหตุ prerequisite
- **channel master** (ข้อ 1) เป็น prerequisite ของการแก้ pm1 · ควรทำก่อน (จอ config ที่ CF/MD · ราคา reference by code · กัน hard-code Price1-7 ซ้ำระบบเก่า)
- **stage 7 (วางบิล) · stage 9 (ค่าแรง cm1) · stage 8 (เคลม)** ของ SV — by design ไม่มีจอ SV เฉพาะ (อยู่ FI/CM/CLM) · ไม่ใช่ช่องว่าง
