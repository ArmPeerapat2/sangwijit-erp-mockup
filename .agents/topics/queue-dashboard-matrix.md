# Queue / Dashboard Matrix — "รายการรอ" ต่อ module

> **ที่มา:** decision 2026-06-06 — List ไว้ก่อน · ทำ Q pages **หลัง** transaction forms เสร็จ (เพราะ Queue ดึงข้อมูลจาก forms)
> **กฎ:** Queue = หน้ารวม "งานรอดำเนินการ" ของ module · row → เปิด modal (memory `feedback_q_page_modal_rule`)
> **สถานะ:** Q pages เดิมมีอยู่แล้ว (SL-Q/WH-Q/PO-Q/FI-Q/SV-Q) แต่สร้างก่อน flow ใหม่ → ต้องปรับให้ตรง flow หลัง forms

## ขาย (SL-Q) — เฉพาะสถานะเอกสารขาย (decision 2026-06-06)
| คิว | ดึงจาก | สถานะที่กรอง |
|---|---|---|
| ใบเสนอราคา: ร่าง/รออนุมัติ/รอสั่งซื้อ | SL-1 | Open/Pending/Approved |
| ใบจอง: รอตั้งหนี้ (ปลีก/ส่ง) | SL-2 | Confirmed รอแปลงบิล |
| บิลขาย: รอ Post / Posted | SL-4 | Draft/Posted |
| มัดจำ: รอทำรายการ | SL-3 | Customer Ledger |
| ใบลดหนี้: รอ Post | SL-CN | Draft |
> **รอเบิก/รอจัดส่ง/รอติดตั้ง/รอสั่งซื้อ = ไม่อยู่ SL-Q** → แยกเมนูแต่ละแผนก · SL-Q ใส่เป็น **cross-link** เท่านั้น

## คลัง (WH) — 7 เมนู + action หลัง Save/Post (decision 2026-06-07)
| เมนู | บทบาท | action หลัง Post |
|---|---|---|
| WH-Q | Dashboard 4 panel (รับ/รับโอน/เบิก/นับ) | — |
| **WH-1** รับสินค้า (GRN+Transfer Receipt) | รับเข้าคลัง | Post Receipt → กรอก Serial + จัดวาง Bin → **สต๊อกเข้า (+)** · รับ>สั่ง=ขออนุมัติ |
| **WH-2** โอนสินค้า (Transfer) | โอนระหว่างคลัง | โอนออก(Ship)→In Transit→รอรับโอนปลายทาง(WH-1) · รับเข้า(Receive)→สต๊อกเข้าปลายทาง |
| **WH-3** เบิกจ่ายขาย (Sales Issue) | เบิกออกขาย | Post Shipment → **กรอก Serial (บังคับ)** → สต๊อกออก → Delivery Note → จัดส่ง=SV-6 / รับเอง=จบ |
| **WH-4** นับสต็อก (Physical Count) | ปรับสต๊อก | บันทึกนับ→variance · Post→Stock Adjustment ลง ledger · variance เกิน=ขออนุมัติ |
| WH-R Stock Card · WH-NM Non-Move | รายงาน | ดู/พิมพ์ (ไม่มี save) |

**คิวขาเข้า WH:** รอเบิก(WH-3)←SL-2 กันสต๊อก·SL-4 · รอรับ(WH-1)←PO-4/5·WH-2 โอนออก · รอรับคืน(WH-1)←SL-CN คืนสินค้า

## จัดซื้อ (PO-Q)
| คิว | ดึงจาก | หมายเหตุ |
|---|---|---|
| **รอสั่งซื้อ** | ใบจอง (SL-2 **สั่งซื้อล่วงหน้า**) · PR · MOS critical | ← routing จาก SL-2 แบบสั่งซื้อล่วงหน้า |
| รอราคา (RFQ) | PO-2 | |
| รอรับ GRN | PO-4 | |

## การเงิน (FI-Q) / บริการ (SV-Q)
- มีอยู่แล้ว (refactor queue pattern ปิดงานแล้ว) — review ให้ตรง flow ใหม่ภายหลัง

## Cross-flow routing ที่ผูกกับ SL-2 (ใบจอง)
- **จองกันสต๊อก** → line/ใบ วิ่งเข้า **WH-Q รอเบิก** (WH-3)
- **จองสั่งซื้อล่วงหน้า** → วิ่งเข้า **PO-Q รอสั่งซื้อ** (สร้าง PR)
- **รับมัดจำ** ในใบจอง → เปิด **ใบมัดจำ SL-3** (แยกเอกสาร)

## ลำดับทำ (handoff)
1. transaction forms บนเทมเพลต: SL-1 ✅ → SL-2 → SL-3 → SL-4 → (PO/WH/SV...)
2. แล้วค่อยปรับ Q pages ให้ดึงคิวตามตารางนี้ + ทำ routing จริง
