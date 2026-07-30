# PM ส่งเสริมการขาย (ฝั่งขาย) — State Transition Table (ตารางเปลี่ยนสถานะ)

Module: **PM (ส่งเสริมการขาย · ฝั่งขาย)** · derived จาก `PM_promotion.md` (PM-2/3/4) + grill 2026-07-30
> ✅ **เคาะ 4 จุด 2026-07-30** — ตารางนี้ = **ฝั่งขาย** (สร้างโปร + ใช้โปรตอนขาย) · **rebate ฝั่งซื้อ (PO-2 Trade Agreement / PO-7 Sale-In Accrual)** = คนละฝั่ง → โน้ตในตาราง PO/FI
> spec แน่นแล้ว (locked): conflict = **stack ≤2 ชั้น · ชั้น 3 อนุมัติ** · GP<10% เตือน / <0% block · VAT last (Golden Rule) · lifecycle Draft→Live→Expired
doc-chain: **สร้างโปร PM-2 → อนุมัติ → Live → ใช้ตอนเลือกสินค้า (SC9) → หักตอนวางบิล SL-4 🏁**

## 🏊 Swimlane — actor (ตำแหน่งจริงกำหนด CF-1)
- **🎁 Promo Manager** — สร้าง/อนุมัติ/activate/deactivate โปร
- **🧑‍💼 Sales** — สร้างร่างโปรได้ · ใช้โปรตอนขาย (เลือกสินค้า)
- **✅ Sales Mgr / GM** — อนุมัติ stack ชั้น 3 · GM block เมื่อ GP<0%
- **🏭 คลัง** — ตัดสต็อกของแถม (WH-2) · gate เช็คของ

## เครื่องคิดราคา SC9 (PromoPrice · shared · read-only)
- อ่านจาก PM (price list + โปร Live ทั้งหมด) · คิดราคาตาม hierarchy (base→PM-1→โปร→step→gift→**VAT ท้ายสุด**) · เรียกทุกบรรทัดขาย/บริการ · cache 5 นาที

---

## 1 · สร้าง/คุมโปร (lifecycle) — Menu **PM-2** (pm2-promotion)
| # | State | → ถัดไป | 🎁 Promo Mgr | 🧑‍💼 Sales | Action | สถานะใหม่ |
|---|---|---|---|---|---|---|
| 1.1 | 📝 ร่างโปร (Draft) | → 1.2 | | สร้างร่างได้ | ระบุ type (%ลด/ลดคงที่/ของแถม/bundle/BuyXGetY) · scope (สินค้า/ลูกค้า) · period · **priority 1-10** | Draft |
| 1.2 | ⏳ อนุมัติ (Confirmed) | → 1.3 | อนุมัติ · **conflict check** (ห้ามซ้ำ item+ลูกค้า+ช่วงเดียวกัน) | | ผ่าน conflict → พร้อม Live | Confirmed |
| 1.3 | 🟢 Live | → apply(2.x) · 1.4/1.5 | activate (โชว์ estimated impact ก่อน) | | เปิดใช้จริง · **Live แก้ไม่ได้ → deactivate + สร้างใหม่** | Live |
| 1.4 | ⏱️ หมดอายุ (Expired) | **🏁** | | | auto ตอนพ้น Valid To (batch) | ✅ Expired (terminal) |
| 1.5 | ✖️ ยกเลิก/พัก (Cancel/Deactivate) | **🏁** / กลับ Live | ยกเลิก (บันทึกเหตุ) · deactivate (reactivate ได้ถ้ายังใน period) | | | ยกเลิก/พัก |

## 2 · ใช้โปรตอนขาย (application) — Menu **SC9 ที่ SL-1/SL-2/SL-4**
| # | State | → ถัดไป | 🧑‍💼 Sales | ✅ อนุมัติ | Action | สถานะใหม่ |
|---|---|---|---|---|---|---|
| 2.1 | เลือกสินค้า → โชว์โปร | → 2.2 | เลือกสินค้า (ตั้งแต่ QT) | | **SC9 โชว์ว่าติดโปรไหน + ราคาหลังโปรทันที** (โปรมากับการเลือกสินค้า ไม่มีปุ่มแยก) | แสดงราคาโปร |
| 2.2 | stack ซ้อนโปร | → 2.3 | | ชั้น 3+ → **Sales Mgr อนุมัติ** | **stack ≤2 ชั้น** (priority สูงก่อน → คิดต่อจากราคาหลังชั้นแรก) | stack แล้ว |
| 2.3 | GP guard | → 2.4 | | GP<0% → **GM block** | GP<10% → 🟡 เตือน · GP<0% → 🔴 บล็อก (อนุมัติ GM) | ผ่าน guard |
| 2.4 | ล็อกราคา/โปร | **🏁** | | | ล็อกตอน **post (SO/บิล)** · snapshot โปรที่ใช้ · **หักส่งเสริมการขายตอนวางบิล (SL 4.2)** | ✅ ล็อกแล้ว (terminal) |

## 3 · ของแถม / bundle / BuyXGetY — Menu **PM-2 + WH-2**
| # | State | → ถัดไป | 🏭 คลัง | Action | สถานะใหม่ |
|---|---|---|---|---|---|
| 3.1 | ของแถม/get-item → ตัดสต็อก | (กลับ 2.4) | เบิก **WH-2** ตัดสต็อกจริง (นับต้นทุนของแถม) · **gate เช็คของพอก่อน apply/activate** · BuyXGetY เช็คทั้ง 2 ตัว | ของแถม = ต้องมีของจริง | ตัดสต็อกของแถม |

---

## 🖥️ Menu → หน้าจริง (mapping)
| Menu | หน้า mockup | ชนิด |
|---|---|---|
| **PM-2** สร้างโปร (lifecycle) | `pm2-promotion` | ฟอร์ม |
| **PM-4** โควตา/discount budget | `pm4-promo-quota` | ฟอร์ม |
| **PM-5** จำลองราคา/โปร | `pm5-price-simulator` | เครื่องมือ |
| **PM-Q** dashboard โปร + งบ (Realized/Accrued) | `pmq-promo-dashboard` | Dashboard |
| **SC9** เครื่องคิดราคา+โปร | shared (ที่ SL/SV) | shared |

## cross-link
- **เข้า:** MD-1 สินค้า active · MD-2 ลูกค้า active (ถึงจะติดโปรได้)
- **ออก:** apply ที่ **SL** (QT→SO→บิล · ล็อกตอน post) · **หักตอนวางบิล SL 4.2** · ของแถม **WH-2** · discount budget/โควตา **PM-4** (เกินงบ→Sales Mgr อนุมัติ) · commission **CM-1**
- **คนละฝั่ง (rebate ซื้อ):** PO-2 Trade Agreement → PO-7 Sale-In Accrual → ได้ใบลดหนี้ vendor → **หักตอนตั้งหนี้ PO-6/รับวางบิล** (PO-CN) — อยู่ตาราง PO/FI

## ✅ เคาะแล้ว (2026-07-30)
1. ✅ **ขอบเขต** = ฝั่งขาย (PM) เท่านั้น · rebate ฝั่งซื้อ → ตาราง PO/FI
2. ✅ **rebate ฝั่งซื้อ** = ได้ใบลดหนี้ vendor → หักตอนตั้งหนี้ PO-6/รับวางบิล เพื่อทำจ่าย (PO-CN)
3. ✅ **apply** = โปรมากับการเลือกสินค้า (SC9 โชว์โปร+ราคาตั้งแต่ QT) · ล็อกตอน post · stack≤2/GP guard ตรงจุด apply
4. ✅ **ของแถม/bundle** = ตัดสต็อกจริง WH-2 + gate เช็คของ (BuyXGetY เช็ค 2 ตัว)

## แผน
1. ✅ ตารางสถานะ PM (บันทึกนี้)
2. ⏭️ ลง tab PM ใน module-flow-overview.html (srt-sec ตัวที่ 8)
3. ⏭️ detail chart ส่งเสริมการขาย (flow-detail-charts ตัวที่ 5) — decision tree ตาม type + stack + GP guard + test cases
4. ถัดไป: **ราคา** (PM-1/PM-5 · รอบสุดท้าย)
