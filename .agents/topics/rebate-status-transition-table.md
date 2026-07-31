# RB ส่งเสริมการขายฝั่งซื้อ (Rebate / Trade Support) — State Transition Table

Module: **RB (Trade Support · ฝั่งซื้อ)** = **PO-2 Trade Agreement + PO-7 Trade Support Tracking** · derived จาก `PO_purchase.md` (669-748) + grill 2026-07-31
> ✅ **หลักที่เคาะ (grill 07-31):** **แจ้งรายการ/มีเอกสารก่อน → งบออกตามหลัง** (accrue ก่อน → realized ทีหลังตอนได้ CN/เงิน) · **Sell-in มี 2 โหมด** (ลดบนบิล = ส่วนลด PO ทันที · ลดตามหลัง = accrue)
> ⚠️ **Rebate ≠ Discount** (Business Rule #8): rebate book "Other Income — Vendor Rebate" (CF-4) · ห้ามดั๊มพ์เป็นส่วนลดราคาขาย
doc-chain: **PO-2 Trade Agreement (ข้อตกลงงบ) → PO-7 Accrual (บันทึกงบ) → CN/Invoice จากห้าง → Realized offset เข้า PO-6 AP → Monthly Recon (กระทบยอด) 🏁**

## 📄 ประเภทงบ 4 types (per A2 v2.1) + เอกสารที่อ้าง
| type | เกณฑ์ | เอกสาร/กลไก |
|---|---|---|
| **① MOU** | ซื้อถึงเป้า รายไตรมาส/ปี (≥95%) | ข้อตกลง MOU → accrue → CN ตามหลัง |
| **② Sell-in** ⭐ | รายหมวด/รุ่น (100%) | **2 โหมด** (ดู §2) — ลดบนบิล / ลดตามหลัง |
| **③ Sell-out** | ขายออกสำเร็จ (≥85%) | จ่ายเมื่อ **serial/SL-4 match** (พิสูจน์ขายออก) → accrue → CN |
| **④ Co-op** | Event/แคมเปญ (≥90%) | งบ Event + ใบปลิว → accrue → CN |
| **รับปาก** | (verbal ยังไม่มีเอกสาร) | accrue ได้ แต่ **flag 🟡 เสี่ยง (confidence)** · ต้องชี้หลักฐานได้ กัน rebate ลอย |

## 🏊 Swimlane — actor (CF-1)
- **📋 จัดซื้อ / Purchase Mgr** — เจรจา PO-2 · บันทึก Accrual · Confirm & Send
- **🧑‍💼 Sales** — **รับปาก/เซ็นรับทราบ**ผลประโยชน์จากห้าง (แจ้งรายการ)
- **💰 Finance** — Realize / Record Payment (**ที่ PO-7 เท่านั้น**) · Monthly Recon · FI-8 monitor read-only
- **🏢 ห้าง / Vendor** — ออก CN/Invoice/Statement ตามหลัง

---

## 1 · ข้อตกลง + บันทึกงบ (declare-first · แจ้งก่อน งบตามหลัง)
| # | State | → ถัดไป | 📋 จัดซื้อ | 🧑‍💼 Sales | Action | สถานะใหม่ |
|---|---|---|---|---|---|---|
| 1.1 | Trade Agreement (PO-2) | → 1.3 | เจรจา vendor · **บันทึกข้อตกลงงบ (Vendor Commitment)** — ไม่มีผลภาษี | | ระบุ vendor/หมวด/เป้า/type | ข้อตกลงบันทึกแล้ว |
| 1.2 | 🟡 รับปาก (verbal) | → 1.3 | | **เซลรับปาก/เซ็นรับทราบ** ผลประโยชน์ | accrue ได้ แต่ **flag 🟡 เสี่ยง** · ต้องมีหลักฐานตามมา | รับปาก (เสี่ยง) |
| 1.3 | 📝 บันทึก Accrual (PO-7 Draft) | → 2.x | เลือก **type (MOU/Sell-in/Sell-out/Co-op)** · อ้าง PO-2 · งวด claim | | Accrual No · ไม่มี GL ตอนนี้ | Draft |

## 2 · แยกตาม type (⭐ Sell-in 2 โหมด)
| # | State | → ถัดไป | Action | สถานะใหม่ |
|---|---|---|---|---|
| 2.S1a | **Sell-in ลดบนบิล** (on-bill) | 🏁 (จบทันที) | **ส่วนใหญ่ใส่เป็นส่วนลดบนบิลซื้อ (PO) เลย** → ลดต้นทุนทันที · ⚠️ VAT Trap: **Case 4 (% บนบิล) เท่านั้น** · **ไม่ต้อง track accrual** | หักบนบิลแล้ว (terminal) |
| 2.S1b | **Sell-in ลดตามหลัง** | → 3.1 | แจ้งก่อน → accrue → รอ CN ตามหลัง | เข้า accrual |
| 2.S2 | **Sell-out** | → 3.1 | จ่ายเมื่อ**ขายออกสำเร็จ** (พิสูจน์ **serial/SL-4 match**) → accrue | เข้า accrual (รอ match) |
| 2.M | **MOU / Co-op** | → 3.1 | ซื้อถึงเป้า / Event → accrue | เข้า accrual |

## 3 · lifecycle: Accrued → Doc Received → Realized → Recon
| # | State | → ถัดไป | Actor | Action | สถานะใหม่ |
|---|---|---|---|---|---|
| 3.1 | Accrued (บัญชีรับรู้หนี้) | → 3.2 | 💰 Finance | GL: **Dr. Accrued Revenue / Cr. Vendor Obligation Liability** · (Confirm & Send โดยจัดซื้อ) | Accrued |
| 3.2 | Doc Received (ได้เอกสารจากห้าง) | → 3.3 | 🏢 ห้าง · 📋 จัดซื้อ | รับ **CN / Invoice / Statement** · **audit checklist + ระบุ Category (1/2/3)** · match Agreement | Doc Received |
| 3.3 | Realized (offset / รับเงิน) | → 3.4 | 💰 Finance | **Record Payment ที่ PO-7 เท่านั้น** (🔒 Single Payment Point) · Reverse Accrual · **offset CN → forward เข้า PO-6 AP** (ตัดหนี้จัดซื้อ) หรือ Dr.Bank | Realized |
| 3.4 | Monthly Recon (กระทบยอด) | **🏁** | 💰 Finance | **reconcile Accrual vs รับจริง ทุกเดือน** · **netting ห้าง (ลูกหนี้↔เจ้าหนี้ · §13.1a)** ถ้าห้างเป็นทั้งคู่ | ✅ กระทบยอดแล้ว (terminal) |

## 4 · แขนง (sanction / aging)
| # | State | → ถัดไป | Action |
|---|---|---|---|
| 4.1 | Aging alert | (ทวง) | Accrued เกิน 30 วันไม่ได้เอกสาร → Day-0 reminder · **60 วัน → STOP NEW PO อัตโนมัติ** |
| 4.2 | ยอดไม่ตรง (Adjust) | → 3.2 | รับจริง < Agreement เกิน 10% → **Flag สอบสวน** + แก้ไข + อนุมัติ |

---

## 🖥️ Menu → หน้าจริง
| Menu | หน้า mockup | ชนิด |
|---|---|---|
| **PO-2** Trade Agreement (Vendor Commitment) | (มีใน spec · ตรวจ mockup) | ฟอร์ม |
| **PO-7** Trade Support Tracking | `po7-rebate-dashboard` (spec: ขาด Form view 5 types) | Dashboard + Form |
| **PO-6** AP Invoice (offset) | `po6-*` / `fi2` | ข้ามโมดูล |
| **FI-8** Accrual Monitor | FI-Q (read-only · aging · Follow-up) | Cross-view |
| **PM-Q** งบ Realized/Accrued | `pmq-promo-dashboard` | Cross-view |

## cross-link
- **เข้า:** PO-2 Trade Agreement (ข้อตกลง) · PO (ซื้อจริง → เกณฑ์ MOU/Sell-in) · SL-4 (ขายออก → Sell-out match)
- **ออก:** CN → **PO-6 AP offset** (ตัดหนี้) หรือ FI-1 รับเงิน · netting → FI (§13.1a) · cross-view read-only → **FI-8** (การเงิน) + **PM-Q** (โปร)
- **กฎ:** 🔒 Record Payment ที่ PO-7 เท่านั้น (FI-8 read-only · กัน GL ซ้ำ) · Rebate ≠ Discount (Other Income CF-4)

## ✅ เคาะแล้ว (2026-07-31)
1. ✅ **pattern** = แจ้งรายการ/เอกสารก่อน → งบออกตามหลัง (accrue → realized)
2. ✅ **Sell-in 2 โหมด:** (a) ลดบนบิล = ส่วนลด PO ทันที (Case 4 · ไม่ track) · (b) ลดตามหลัง = accrue → CN
3. ✅ **Sell-out** = จ่ายเมื่อขายออก (serial/SL-4 match)
4. ✅ **รับปาก** = accrue+flag🟡 (confidence · ต้องมีหลักฐานตามมา)
5. ✅ **Realized** = offset เข้า PO-6 AP (ตัดหนี้) · Record Payment ที่ PO-7 เท่านั้น
6. ✅ **Monthly Recon** = กระทบยอด Accrual vs จริง + netting ห้าง

## แผน
1. ✅ ตารางสถานะ RB (บันทึกนี้)
2. ⏭️ ลง tab RB ใน module-flow-overview.html (srt-sec ตัวที่ 10)
3. ⏭️ detail chart rebate (flow-detail-charts ตัวที่ 7) — แตกตาม 4 types + sell-in 2 โหมด + lifecycle + test cases
4. ⏭️ implementation: po7 Form view 5 types
