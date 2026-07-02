# WH Renumber Plan — 🔒 LOCKED 2026-07-02 (execute ตอน rebuild แต่ละหน้า)

> สร้าง 2026-07-02 (ของเก่าที่อ้างไม่มีจริง) · **grill Q1-Q4 ครบแล้ว**
> **ก่อนทำงานคลัง/แก้ WH ทุกครั้ง อ่านไฟล์นี้**
> **execute policy (Q4 ✓):** ไม่ rename ตอนนี้ · **rename + แก้ reference ตอน rebuild แต่ละหน้าบน design-system** (แก้รอบเดียว ไม่ซ้ำ)

## เหตุผล renumber
เรียงเลข**ตามปริมาณงานจริง** (ใช้บ่อย = เลขต้น) — เดิมเลขไม่ตรงลำดับใช้งาน

## Mapping (🔒 LOCKED — mapping ครบ)

| code เก่า | ไฟล์เก่า | คือ | → code ใหม่ | ไฟล์ใหม่ | หมายเหตุ |
|---|---|---|---|---|---|
| WH-1 | wh1-grn | รับเข้า (GRN) | **WH-1** | `wh1-receive` | เลขเดิม |
| WH-3 | wh3-sales-issue | เบิก | **WH-2** | `wh2-issue` | 3→2 (เบิกใช้บ่อย) |
| WH-2 | wh2-stock-transfer | โอน | **WH-3** | `wh3-transfer` | 2→3 |
| WH-4 | wh4-stock-count | นับ | **WH-4** | `wh4-count` | เลขเดิม |
| — | (ใหม่) | ขอเบิก (ขาย/บริการ ขอ · pick-list) | **WH-2R** | `wh2r-issue-request` | → ใบเบิก WH-2 |
| — | (ใหม่) | ขอโอน (คำขอย้ายข้ามคลัง) | **WH-3R** | `wh3r-transfer-request` | → ใบโอน WH-3 |
| — | (ใหม่) | เตรียมนับ (cycle count schedule) | **WH-4R** | `wh4r-count-plan` | → ใบนับ WH-4 |
| WH-Q | wh-queue | dashboard รวม | **WH-Q** | `wh-q-dashboard` | overview |
| — | (ใหม่) | คิวรับ (PO+โอนเข้า+คืน รอตรวจรับ) | **WH-Q1** | `wh-q1-receive-queue` | คิวรับ |
| — | (แยกจาก wh-queue) | คิวเบิก (pick · timing-based) | **WH-Q2** | `wh-q2-issue-queue` | คิวเบิก |
| WH-R | wh-r-stock-card | report stock card | **WH-R** | `wh-r-stock-card` | คงเดิม (report · ไม่เข้าลำดับเลข) |
| WH-NM | wh-nm-non-move | report non-move | **WH-NM** | `wh-nm-non-move` | คงเดิม (report) |

**โอน (WH-3) + นับ (WH-4) = ไม่มีคิว** (งานวางแผนล่วงหน้า ไม่ต้องคิว real-time)

## Grill log
- **Q1 (2026-07-02) ✓** เรียงตามปริมาณงาน: รับ=1 · **เบิก=2** · **โอน=3** · นับ=4 (สลับ WH-2↔WH-3 เดิม)
  - ⚠️ กระทบ audit #13: "WH-2 = เจ้าของใบโอน" → ต้องเปลี่ยนเป็น **WH-3 = เจ้าของใบโอน** · "WH-3 เบิก ขอโอน" → **WH-2 เบิก**
- **Q2 (2026-07-02) ✓** R = เอกสาร "ขอ/เตรียม" ก่อนออกเอกสารจริง: WH-2R ขอเบิก (ขาย/บริการ ขอ · pick-list) · WH-3R ขอโอน (คำขอย้าย · ตรง audit #13) · WH-4R เตรียมนับ (schedule) → แยก "ขอ" ออกจาก "ทำ" กันสร้างเอกสารซ้ำ
- **Q3 (2026-07-02) ✓** queue split: WH-Q dashboard รวม · **WH-Q1 คิวรับ** (PO+โอนเข้า+คืน) · **WH-Q2 คิวเบิก** · โอน/นับ ไม่มีคิว (งานวางแผน)
  - **⭐ timing การเบิก (สำคัญ):** สต๊อกถูก**กันไว้ก่อน** (จองตั้งแต่ SL-2/นัดติดตั้ง — เช่นนัดอีก 5 วัน สต๊อกโดนกันแล้ว) แต่**จะขึ้นคิวเบิก WH-Q2 เมื่อมีการแพลนวัน**เท่านั้น (ใกล้ถึงวัน fulfil) — จองแล้วแต่ยังไม่ถึงเวลา = ยังไม่อยู่ในคิวเบิก active · เชื่อม audit #7 (reservation กันสต๊อก)
- **Q4 (2026-07-02) ✓** WH-R/WH-NM คงเดิม (report ไม่เข้าลำดับเลข) · ชื่อไฟล์ตามแพทเทิร์น code=เลขในชื่อ · **execute ตอน rebuild แต่ละหน้า** (ไม่ทำตอนนี้ — กันแก้ reference 2 รอบ)

**🔒 grill ครบ Q1-Q4 · plan LOCKED · หยิบไป execute ได้ตอน rebuild WH บน design-system**

## ✅ EXECUTED (rename + refs · 2026-07-03) — R/Q pages ยังไม่สร้าง
- [x] rename 5 ไฟล์ html (git mv): wh1-grn→wh1-receive · wh3-sales-issue→wh2-issue · wh2-stock-transfer→wh3-transfer · wh4-stock-count→wh4-count · wh-queue→wh-q-dashboard
- [x] swt-sidebar.js (href ตรง · ตัด 5 entry R/Q dead ออก → comment planned)
- [x] swt-link.js DOC_MAP (GRN/REC/TRN/CNT/GIS/ISS → ไฟล์ใหม่ · GIS/ISS→wh2-issue)
- [x] spec WH_warehouse.md (code swap WH-2↔WH-3 · Menu List เรียง · audit #13 → WH-3 owner)
- [x] SKILL.md Cross-Module Flow Rules (swap) · SL_sales · PO_purchase · knowhow×2 (WH-3 เบิก→WH-2 · WH-2 transfer→WH-3)
- [x] knowledge-base catalog 01/05 (filename refs)
- [x] ~40 ไฟล์ที่อ้างชื่อไฟล์เก่า (bulk replace · ไม่แตะ _archive)
- [ ] ⏳ **ยังไม่สร้าง:** WH-Q1/Q2 (คิวรับ/เบิก) · WH-2R/3R/4R (ขอเบิก/ขอโอน/เตรียมนับ) — sidebar comment ไว้ · สร้างตอน rebuild
- [ ] ⚠️ `knowledge-base/skills/sangwijit-warehouse/portal-mapping.md` = stale (WH-2=GRN ผิดมาก่อน) · flag ไว้ · รอ reconcile รอบแยก
- [ ] index.html — ตรวจ nav/cards (ถ้ามี WH cross-link)
