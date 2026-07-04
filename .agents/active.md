---
updated_at: "2026-06-03T00:00:00+07:00"
status: "active"
current_focus: "🏁 SL กลุ่มงานขายปิดครบ 6 หน้า: SL-Q(คิว·จัดกลุ่ม QT/SO/INV/DP/CN) · SL-1 · SL-2 · SL-3 · SL-4 · SL-CN(ใบลดหนี้ 3 โหมด) — build บนเทมเพลตเดียวกัน · doc-chain เชื่อม · sc1/sc2 shared · routing ชัด (sl-post-save-routing.md) · SL-Q เน้นเอกสารขาย / ปลายทาง(เบิก/ส่ง/สั่งซื้อ)=แยกเมนู cross-link · ถัดไป: WH(รอเบิก)/PO(รอสั่งซื้อ) ตาม Form Build Pattern · [เดิม SL-1→4]" (ใบเสนอราคา/ใบจอง/ใบมัดจำ/บิลขาย · doc-chain เชื่อมกัน · status+chain รวมแถวบน · เลขที่อ้างอิงต่อไลน์ · per-doc reservation routing · หักมัดจำ) · **Component หลัก: sc1-customer-search + sc2-item-search = canonical** (Customer Search 9 คอลัมน์+ประวัติ 4 แท็บ · Product Search) เรียกผ่าน swt-doc-finder dfOpenCust/dfOpenProd (iframe modal) · + Reference Picker dfOpenRef (multi-select ตามลูกหนี้) · guideline: .agents/topics/form-template-guideline.md + queue-dashboard-matrix.md · ถัดไป: SL-CN ใบลดหนี้ (flow 07) หรือ propagate sc1/sc2 ไปหน้าเก่า"
branch: "main"
project_type: "frontend-mockup (HTML + docs)"
---

## 🔢 WH Renumber — ✅ EXECUTED rename+refs (2026-07-03)

**execute แล้ว:** rename 5 ไฟล์ (wh1-receive/wh2-issue/wh3-transfer/wh4-count/wh-q-dashboard) · flip code WH-2↔WH-3 ทุก reference (sidebar/DOC_MAP/index/spec×5/mockup 12 หน้า) · fix dead link wh-q2-issue-queue→wh2-issue · sidebar comment R/Q planned
**✅ build เต็มแล้ว (2026-07-03 · Blueprint→confirm→build บน _form-template):**
- **WH-3 ใบโอนสินค้า** (`wh3-transfer-mockup.html`) — rebuild จาก queue เดิม (archive `_archive/wh3-transfer-queue-mockup-2026-07-03.html`) · form: ต้นทาง→ปลายทาง · **จำนวนขอ + จำนวนที่ได้จริง** · In-Transit
- **WH-3R ใบขอโอน** (`wh3r-transfer-request-mockup.html`) — คู่แฝด WH-3 · **ตัดช่อง "จำนวนที่ได้จริง"** · สถานะคำขอ → ส่งคำขอ/สร้างใบโอน · section code WH-3R.1-4
- Q5 decision: ใบคำขอ = หน้าจริง · direct/referenced ตามสิทธิ์ · R≈action ต่างที่ actual-qty · **เลขธรรมดา + section code (WH-3.1) ตาม memory [[section-code-labels-plain-numbers]]**
**✅ กลุ่มเบิก/คิว build ครบ 4 หน้า (2026-07-03):**
- **WH-2R ใบขอเบิก** (`wh2r-issue-request-mockup.html`) — ลอก WH-3R ตัด flow 2 คลัง · คลังจ่ายเดียว + reserved badge · line: ขอเบิก + กันสต๊อก✓ + อ้างอิงใบขาย · ปุ่ม ส่งเข้าคิวเบิก(WH-Q2)/สร้างใบเบิก(WH-2)
- **WH-2 ใบเบิก** (`wh2-issue-mockup.html`) — **rebuild ฟอร์มเดี่ยว แฝด WH-3** (archive เก่า `_archive/wh2-issue-pickingqueue-mockup-2026-07-03.html`) · เพิ่ม จำนวนที่เบิกจริง (ส้ม) + Serial input + Post Shipment · doc-chain SL-4→WH-2R→WH-Q2→WH-2
- **WH-Q2 คิวเบิก** (`wh-q2-issue-queue-mockup.html`) — **kitchen rail** รวมตั๋ว ขอเบิก+ขอโอน+จอง · filter chip ตามประเภท · KPI · คลิกแถว→ฟอร์มทำจริง (recycle เนื้อ picking queue เดิม)
- **WH-Q1 คิวรับ** (`wh-q1-receive-queue-mockup.html`) — twin ของ Q2 ฝั่งเข้า · รวม รับซื้อ+รับโอน+รับคืน · คลิกแถว→WH-1
- **WH-4R ใบเตรียมนับ** (`wh4r-count-prep-mockup.html`) — ✅ form เดี่ยว · ขอบเขตนับ (คลัง/Bin + ประเภท Cycle/Annual/Spot/Recount) + freeze snapshot · line: Stock ระบบ (snapshot) ไม่มี "นับจริง/Variance" · ปุ่ม Freeze+ส่งเข้ารอบนับ/ออกใบนับ(WH-4) · doc-chain WH-4R→WH-4→Recount
**stub WH ครบแล้ว ✅** — เหลือ WH-4 นับ (คิวนับเดิม ใช้ได้) · migrate design-system ค่อยทำ (hybrid)

**🧹 Form UX sweep + Flow map sync ✅ (2026-07-03):**
- **sweep 5 หน้า (WH-2/2R/3/3R/4R):** ย้าย note banner บนหัว → ยุบเข้าแท็บล่าง "เกี่ยวกับหน้านี้" (header โล่ง) · เพิ่ม line item เป็น ~16 แถว · กฎใหม่ memory [[form-header-open-note-in-tab]] + form-template-guideline §④a
- **Flow map** (`flow-workflow-map.html`) อัพเดทเป็น **6 สาย**: fix เลข WH (เบิก=WH-2/โอน=WH-3) สาย 1+4 · เพิ่ม waterfall branch (สาย 1) · เพิ่มสาย 6 คลังปฏิบัติการ (kitchen rail WH-Q1/Q2 + R→action + นับ WH-4R/4) · callout ช่องว่าง
- **Audit ตอบ:** ลดหนี้ซื้อ (po-cn) ✅ · รีเบท/ส่งเสริมการขายฝั่งซื้อ (po7) ✅ — มีแล้วอยู่สาย 2 · **โปรโมชั่นฝั่งขาย (PM) = ช่องว่างจริง** ยังไม่มีหน้า setup (sl6 archived · เหลือ pm5 vat-sim + sc-promoprice proposal)
- **Flow map: node กดได้แล้ว** — เพิ่ม PGMAP script auto-wire รหัส node → เปิดหน้า mockup (มี 🔗 มุมขวา) · PO-2 = บ้านข้อตกลง Vendor Commitment (MOU/Sell-in/Sell-out/Co-op) · PO-7 = realize

**📋 Pending grill list (2026-07-03):**
1. **โปรโมชั่นฝั่งขาย (PM)** — ไม่มีหน้า setup/แคมเปญ (sl6 archived) → grill+build
2. **รับปาก / verbal commitment (ฝั่งซื้อ)** — ยังไม่มี field แยก "รับปาก vs มีสัญญา MOU" · ตอนนี้ทับกับ status Accrued → grill: บันทึกคำมั่นปากเปล่ายังไง · confidence · แปลงเป็น type ทีหลัง
3. **PO-7 Form view 5 types** — spec บอก "ขาด Form view 5 types" (มีแต่ dashboard · PO_purchase.md §PO-7) → grill/build ฟอร์ม create/edit commitment ที่ PO-2
4. **SV claim/service** — build backlog B1-B10 + re-grill §10 (เมนู A-E · V1-V5 · 6 bins · SLA) — spec `.agents/svc-claim-jobtype-spec.md`
5. (minor) `/plan-mockup` skill setup · CI logo scope (SWE only)

**🔗 Sidebar audit + Flow map links ✅ (2026-07-03):**
- **flow map** (`flow-workflow-map.html`): node + รหัสในกล่อง branch/rule **กดเปิดหน้าได้** (PGMAP script) · เพิ่มเข้า sidebar (Overview · FLOW)
- **Sidebar dead links 28 จุด** — โฟลเดอร์ `bc365/` ไม่มีในโฟลเดอร์หลัก (design-system refactor หาย)
  - **แก้แล้ว 14 (กลุ่ม A):** bc365/* → root ที่มีจริง (SL-1·CF2.1/2.6/2.7·SC-2·SQT·MD-1/4·CF-1·สาขา/คลัง·SV-IN→sv1·FIQ-AR/AP→fiq รวม) · fix ทั้ง GROUPS + DONE[]
  - **ค้าง orphan (กลุ่ม B):** **SV group 9 จุด → user เลือก grill โครง SV ก่อน แล้วค่อยแก้ sidebar** · CL-1/CL1F/PM-1/CF-3/CF-5 → user จะเปิดตรวจ archived ก่อนลบ
  - ไฟล์ archived เปิดได้: `_archive/cl1-claims-mockup.html` (07-02) · `_archive/sl6-promotion-setup-mockup.html` (สร้าง 2026-04-19 · 17 commits — ref โปรโมชั่นฝั่งขาย) · CL1F/CF-3/CF-5 = ไม่มีไฟล์เลย
**🔧 Grill โครง SV ✅ (2026-07-03 · grilling skill Q1-Q4):**
- **Q1** root = canonical · ไม่รื้อ SV ใหม่ (spec svc-claim-jobtype ตัดสินแล้ว · bc365 = aspirational หาย)
- **Q2** sidebar SV group = **12 หน้า root**: SV-Q คิว → SV-1 intake → SV-2 มอบหมาย → SV-3 เบิกอะไหล่ → SV-Order สั่งนอกประกัน → SV-5 job card → SV-4 ปิดงาน/บิล → SV-6 ส่ง+ติดตั้ง(ขาย) → SV-7 ส่งคืน → SQT → SIR → CLM · ตัด sv6-1-booking-modal + sv6-print-templates (เป็น component) · **repoint sidebar + DONE[] แล้ว**
- **Q3** bc365-only 3 ตัว → **backlog B12-B14 (ข้ามก่อน ต้องทำ):** MA contract · tech-mobile · posted-docs (อีก 5 ตัว board/dispatch/parts-claim/dashboard/setup = ครอบด้วย SV-Q/SV-2/SV-3/EX-1/CF แล้ว)
- **Q4** flow map **เพิ่มสาย 7 Service Ops** (SV-Q→SV-1→SV-2→SV-3→SV-5→SV-4→SV-7 · branch เคลม①→CLM/PO-CN · เคลม②→ARI/SL-4 · rule per-component/3 รายได้/gate คืนอะไหล่) · header 6→7 สาย · PGMAP เพิ่มรหัส SV กดได้
- **DONE ทั้งชุด:** sidebar SV group ใช้งานได้ · flow map สาย 7 + callout SV backlog · spec B12-14 · เหลือ orphan CL-1/PM-1/CF-3/CF-5/MD-6 รอ user ตัดสิน (จะเปิดตรวจ archived ก่อน)

**🔧 SV backlog B1 ✅ (2026-07-04 · flow-reconciled):** rebuild sv1 intake ตาม Flow Design/Service 01+06 — Step 0 Gate จับ discrepancy (flow: Doc Type Repair/Installation + Warranty In/Out/Release · เคลม=route ≠ doc type · vs spec 5 job types) → user เลือก **hybrid**: Doc Type 2 + งานย่อย(ซ่อม/ตรวจเช็ค/ล้าง) + **claim reveal เมื่อ In-Warranty** (Bill to Vendor · Resolution ซ่อม/♻️เปลี่ยนเครื่องใหม่) · **replace path:** เบิกใหม่ WH-2 + เครื่องเดิม→CLM/PO-CN · ไม่ออก SL-CN · spec §1 reconciled · เหลือ B2-B14

**🔧 SV layout C1-C3 ✅ (2026-07-04):** replicate B-layout → กลุ่มฟอร์ม SV · **C1** doc-chain sv1-5,7 (SV-1→2→3→5→4→7) · **C2** SAAB uniform (เปิดเก่า/Copy) sv2-5,7 · **C3** sv6 = **queue ไม่ใช่ฟอร์ม** (main-header · ไม่แตะ · correctly นอกกลุ่ม) · sv6-1/sv6-print = component ย่อย

**🔧 SV backlog B2 ✅ (2026-07-04 · spec §2):** Resolve Serial → เมนู A-E ที่ sv1 · S/N-first resolve 5 ทาง → ขับ Warranty (B1) อัตโนมัติ: **A**เจอ+ในประกัน→In·BillVendor · **B**หมดประกัน→Out·ลูกค้า · **C**มีงานค้าง→ลิงก์งานเดิม(กัน job ซ้ำ) · **D**ไม่เจอ→Release(admin ยืนยัน·Maker≠Checker) · **E**ซื้อที่อื่น→In(แบรนด์)·เคลมอะไหล่/ค่าแรงได้·เปลี่ยนเครื่องไม่ได้ · svRes()reuse svWarr()

**🔧 SV backlog B4 ✅ (2026-07-04 · grill Q1-Q3):** per-line payer assignable ที่ sv4 · **Q3 auto-bind:** ประเภท(ใน/นอก Comp)=dropdown → เก็บจาก payer พลิกเอง (ใน→Vendor·นอก→ลูกค้า · chip=derived คำนวณสด · เปลี่ยน payer=เปลี่ยนประเภท กัน maker error) · **Q1 payer=bill-to party:** Vendor=ลูกค้าอีกราย/วิธีจ่าย กรอกบริษัทเมนวล (ไม่ hardcode type) · **Q2 ออก 2 ARI ที่ sv4:** ARI-Vendor + ARI-Customer(อ้าง SL-4/SO) post ทันที · SV-7 = รับชำระเท่านั้น (invoice ออกที่ sv4 แล้ว) · เหลือ B5 (parts return dashboard+gate) · B6-B14

**🔧 SV backlog B5 ✅ (2026-07-04 · grill 3 ข้อ):** core-return dashboard + gate ที่ sv4 · **Q1** คืนเฉพาะอะไหล่ในประกัน (เคลม · ซาก=หลักฐาน · out-warranty=ของลูกค้า) · **Q2** 3 สถานะ: ⏳รอส่งคืน→🚚ส่งแล้ว→✅Vendorรับแล้ว · **Q3** gate **เข้มสุด** = block "→ ส่งต่อ SV-7" จน Vendor รับซากครบ (coreGate() สด) · SV-4.4b dashboard + sv3 flag "ต้องคืนซาก→SV-4.4b" · ⚠️ **timing tension:** gate เข้มอาจ block customer delivery ระหว่างรอ vendor รับซาก — flag ให้ user ทบทวน (ถ้าติดจริงค่อยผ่อนเป็น "≥ส่งแล้ว") · **C4 (B2/B4/B5) ปิดครบ**

**🔧 SV backlog B3 ✅ (2026-07-04 · grill Q1-Q4):** per-component warranty ที่ sv1 SV-1.3 · **Q1** manual กรอกเอง (+pre-fill hint model +แนบสแกน=audit) · **Q2** เฉพาะชิ้นเกี่ยวงาน +เพิ่มแถว (svAddComp) · **Q3** loose = ตาราง reference เฉย ๆ ไม่ auto-drive B4 · **Q4** mismatch soft-flag ⚠️ ที่ sv4 line (data-b3=in + ตั้งเก็บลูกค้า) ปิดได้ · demo คอม🟢/PCB🔴 · ปิด placeholder "B3 ทีหลัง"

**🔧 SV backlog B6 ✅ + kitchen-rail (2026-07-04 · grill Q1-Q3):** ปุ่มส่งคำขอลดหนี้ · **Q1** 4 เหตุผล (vendor-claim/goodwill/คิดเกิน/คืนของ) · **Q2** SV-4 จุดเดียว (admin คุม) · **Q3** เบา: ส่ง ARI+เหตุผล → SL-CN draft · line เลือกที่ SL-CN · ปุ่มใน SAAB sv4 + popup(cnReqModal) · **B6+ enhance:** SL-Q รับ CN ticket จาก SV-4 พร้อมอ้างอิงต้นทาง (SCR+ARI) · **📌 model ใหม่ [[q-kitchen-rail-pattern]]:** ทุก Q=ครัวรับออเดอร์ · โมดูล=โต๊ะสั่ง · ticket โชว์ ref ต้นทางเสมอ · จัดตามงานไม่ใช่ doc-type

**🔧 SV backlog B4b ✅ (2026-07-04 · grill Q1-Q4 · ภาษาบ้าน):** ตัวเลือก "บริษัทออกให้ฟรี" (goodwill) ตอนตั้งบิล sv4 · **Q1** ทางที่ 3 ต่อบรรทัด (Vendor/ลูกค้า/บริษัทให้ฟรี) · **Q2** เลือกได้ บริษัทเรา/แบรนด์ (กล่อง goodwill) · **Q3** อนุมัติทุกครั้ง หัวหน้า+เก็บหลักฐาน (ชั้นสิทธิ์ที่ CF-2.6) · **Q4**(default) ลูกค้าเห็นราคาเต็ม+ป้าย จ่าย 0 + กล่องสรุปแยก · svRebill 3 ถัง

**🎉 SV backlog ครบ B1-B14 ✅ (2026-07-04):** 7 หน้าใหม่ session นี้ — **B10** ตั้งค่า SLA (`sv-sla-config`) · **B7** คลังศูนย์ซ่อม 6 bins (`wh-svc-center`) · **B8** สรุปงานช่าง→CM-1 (`sv-tech-report`) · **B14** เอกสารโพสต์แล้ว (`sv-posted-docs`) · **B9** เช็คลิสต์ล้าง/ตรวจ (`sv-checklist-template`) · **B12** สัญญา MA รายปี (`sv-ma-contract` · เปิดงาน→ค้างมอบหมาย reuse flow) · **B13** มือถือช่าง (`sv-tech-mobile` · phone mockup ครบวงจรหน้างาน) · เพิ่ม sidebar 7 links · **เหลือแค่ B11** (SL-CN validation = งาน SL ไม่ใช่ SV)

**🏷️ PM โปรโมชั่นฝั่งขาย ✅ (2026-07-04 · grill + build จาก stub):** เดิม parked P2 → user สั่งลุย · spec PM ละเอียดครบ (conflict = Priority+Stack≤2 RESOLVED) · **PM-1 รายการราคา** (`pm1-price-list`): ราคาก่อน VAT + qty bracket + กลุ่มลูกค้า + ต้นทุนซ่อน · Draft→อนุมัติ→Posted→sync BC · **PM-2 โปรโมชั่น** (`pm2-promotion`): grill Q1 เลือกแบบ→ช่องเปลี่ยนตาม (5 แบบ ลด%/ลดเงิน/แถม/ชุด/ซื้อXแถมY · selType) · Q2 ไม่ใส่เช็คกำไร/ชนกันสด (defer P3 · rule stack≤2 เขียน note ไว้) · sidebar อัปเดต (ตัด "stub P2") · เหลือ PM-Q/PM-3/PM-4/PM-5 = P3

**🧮 PM-5 จำลองราคาขาย ✅ (2026-07-04 · grill Q1-Q3):** `pm5-price-simulator` (หน้าใหม่ · แยกจาก `pm5-vat-simulator` เดิมที่สอน Golden Rule) · **Q1** 2 โหมดสลับได้ (forward สินค้า→ราคา/กำไร · reverse กำไรเป้า→ราคา) · **Q2** ระบบเลือกโปรดีสุด 2 ชั้น (priority) + ติ๊กแก้ได้ · เกิน 2 = เตือนต้องอนุมัติ · **Q3** แค่ดู/พิมพ์ ไม่ save · JS: calc() ลดทีละชั้นก่อน VAT + margin สี (≥10 เขียว/<10 เหลือง/<0 แดง) + คอมประมาณ · calcR() reverse · sidebar เพิ่ม PM-5(price) + PM5V(vat) · **PM เหลือ P3: PM-Q · PM-3 · PM-4**

**🔍 SL group 2-agent audit + refine ✅ (2026-07-04):** ใช้ agent 2 ตัวคู่ขนาน — `erp-design-architect` (ดีไซน์) + general-purpose ใช้สกิล `dynamics-bc365` (ตรวจ field ↔ BC365 · verify Microsoft Learn) — ก่อนปรับจริง (user สั่ง "สรุปก่อนปรับ")
- **ผลดีไซน์:** SL = คนละ design-system กับ SV (form-template fit-100vh · ไม่ใช่ content-wrapper scroll) · **แน่นกว่า SV อยู่แล้ว** · section code ครบ · ไทยครบ → **ห้าม density sweep แบบ SV = พัง** · saab เป็น flush (≠ ตัวกลาง SV card) → **คงไว้ ไม่ย้าย**
- **ผล BC365 (กลาง-ค่อนสูง):** field แกน (เลขที่/วันที่/ลูกค้า/line/VAT trio/discount 2 ระดับ/Bill-to·Ship-to) ตรง BC · ยอด summary ทั้งหมด **BC เจ้าของ = read-only**
- **ทำแล้ว (A · sl1-4+cn):** ป้าย WHT sl1 → "ประมาณการ · คิดจริงตอน FI" (BC ไม่คิด WHT บนบิลขาย) · โน้ต 🔒 ยอด/VAT ระบบ BC คำนวณ + ⚖ ลดก่อน VAT ทุกหน้า
- **⏭️ ส่งทีม BC dev (custom fields · ไม่ใช่งาน mockup):** Entity Tag (dimension/company?) · SL-2 ประเภทจอง SO/SOW · SL-CN ประเภทใบ ใน/นอกประกัน · SL-3 มัดจำ (ไม่มี standard endpoint) · โปรฯ auto-match · ส่วนลดท้ายบิล %→฿ ก่อนส่ง BC
- **บทเรียน:** "สรุปก่อนปรับ" คุ้มมาก — agent จับได้ว่าโจทย์ตั้งสมมติฐานผิด (นึกว่า SL ต้อง sweep แบบ SV) กันพังก่อนลงมือ

**⏭️ NEXT (resume จุดนี้):** (a) ~~Q-sweep~~ ✅ **ตรวจแล้วไม่ต้องทำ (2026-07-04):** rail ทุกหน้าโชว์ ref ต้นทางอยู่แล้ว (fiq→PO/บิล · sv-q→SIR/SQT/CLM · poq→PR · fi1q→INV) · wh-q-dashboard=stock ไม่ใช่ rail · SL-Q(B6) คือหน้าเดียวที่ขาดจริง เติมแล้ว · (b) SV backlog เหลือ: **B4b** goodwill payer (โยง B4+B6) · **B7** WH-SVC 6 bins · **B8** CM-1 เรทช่าง · **B9** checklist tmpl · **B10** SLA config · **B12** MA contract · **B13** tech-mobile · **B14** posted-docs · (c) sweep density โมดูลอื่น (PO/WH/FI/MD ค่าเดิม 24/20/16) · **⚠️ ~25 commits ยังไม่ push** (local focus ตามสั่ง)

**🎨 SV design-consistency sweep ✅ (2026-07-04 · ยึด SL-4):** ปรับ SV ทั้งกลุ่มให้ตรงกัน —
- **section-code:** ทุกโซน (การ์ด+section) มี code emoji+`SV-x.x ·` · แก้ sv7 (การ์ดไม่มี code → SV-7.1/7.1b · renumber 7.2-7.4) · sv2/3 + sv-order-parts (num-badge → emoji+code)
- **CSS shared:** base `.saab` ย้ายเข้า `swt-patterns.css` · sv1-7+clm+sv-order inline/local `.saab-bar` → `class="saab"` (memory [[css-shared-not-inline]])
- **density = ยึด SL-4** (`sl4-invoice`): cw `16px 24px` · card `14px 16px`/mb12 · title mb10 · pills 12 · saab mb12 · `.swt-mh` shared `12px 24px` · footer gap 16 (memory [[density-first-hierarchy]] spacing tokens)
- **ครอบ:** sv1-5,7 + clm-vendor-claim + sv-order-parts (8 form) + sv-q (queue) · sv6 แน่นแล้ว (template `.content`) · sv6-1/print = component ไม่แตะ
- **sv7 "เลื่อนไม่ได้" = viewer แคบ** (min-width 1440 · หน้าปกติ · render พิสูจน์ scroll 0→771 ที่ 1460)

**✅ Orphan 6 ปิดครบ (2026-07-04 · sidebar = 0 dead link):** CL-1/CL1F → ลบเมนู (claim=job type) · PM-1/PM-2/CF-3/CF-5/MD-6 → สร้าง stub placeholder (pm1-price-list · pm2-promotion · cf3-payment-hub · cf5-bank-master · md6-service-item) + repoint sidebar + เคลียร์ DONE[] bc365 · stub = กัน dead link · build เต็มตอน P2/TBD

**⏸️ Grill ฝั่งขาย PM — parked P2 (2026-07-04):** grill ครั้งแรกที่เจาะ PM (เดิม parked P2 จาก SL-CN grill Q10) · **user เลือก C: ปิด grill · P2-defer ยังยืน · ไม่ build ตอนนี้**
- **flow-grounded findings (จาก Flow Design/Promotion 3 PDF):** "โปรโมชั่น" ในโฟลว์ = จัดซื้อ vendor-funded loop · Flow 02 (ขาย→ผูก promo code รายบรรทัด→เคลม vendor→Sales Credit Memo) = **ซ้อนกับ PO-7 sell-out + SC-9 PromoPrice ที่ทำแล้ว** → "promotion" ส่วน loop = ครบแล้ว
- **PM gap จริง = 2 หน้า setup:** PM-1 รายการราคา (Flow 01 · ราคา+วันโปรฯ→sync BC) · PM-2 โปรโมชั่น/แคมเปญ (rebuild sl6 · 5 types) · + PM-Q dashboard (Flow 00 เบา) · PM-5 sim ✅
- **naming locked (สำหรับ P2 build):** PM-1 ราคา · PM-2 โปรฯ · PM-Q dash · PM-5 sim · Price List อยู่ PM (ไม่ใช่ MD) — ค้าง Q2 (build order) ยังไม่ปิด · resume ตอน P2
- ref: `_archive/sl6-promotion-setup` (สร้าง 04-19 · 17 commits) · `PM_promotion.md` (spec เต็ม เม.ย.) · `Flow Design/Promotion/*.pdf`

**🎁 Grill ฝั่งซื้อ (PO promotion/commitment) ✅ (2026-07-04):**
- ตรวจพบ **PO-2 Vendor Commitment form + PO-7 realize = มีอยู่แล้ว** (audit "PO-2 redo/PO-7" = stale เหมือน FI-2) · PO-2 มี type selector MOU/Sell-in/Sell-out/Co-op + เอกสารแนบ(สแกน) + tabs หลักฐาน/เซ็น
- **gap จริงข้อเดียว = รับปาก/verbal** → เพิ่ม **Evidence Level ladder** (🗣️รับปาก→📄มีเอกสาร→✍️เซ็นแล้ว) ใน po2 PO-2.1b · แต่ละขั้นแนบสแกนหลักฐาน · รับปาก accrue ได้แต่ flag 🟡 เสี่ยง
- **po7:** เพิ่มบรรทัด "ระดับหลักฐาน (confidence)" → finance เห็นก่อน realize · spec PO_purchase PO-2.1b + active
- **PO ฝั่งซื้อ = จบแล้ว** (ไม่มีหน้าใหม่ · แค่เติม field) → next = ฝั่งขาย PM

**✅ FI-2 จ่าย AP verified done (2026-07-04):** ตรวจแล้วเสร็จบน design-system ครบ (apply AP หลายใบ + picker PO-6 + WHT→FI-12 + doc-chain ปิด procure-to-pay · Maker≠Checker) · audit เดิม 🔧 = stale · แก้แค่ dead link `fiq-ap→fiq-finance-queue` (fi2 ×2 · fi12 ×1) · optional polish ค้าง: default row เป็น WHT 0% (สินค้า) — โหลด service row ให้เห็น WHT flow · Entity Tag (P3 defer)

**📋 File audit regen ✅ (2026-07-03):** `file-status-audit.md` = master เดียว · fix WH renumber + WH-2R/3R/4R/Q + SV grill + orphan + **เพิ่ม layer skill/docs/flow-html** (3 กลุ่ม: current/ต้องอัพเดท/archive-candidate) · ยุบ `document-inventory.md` เข้ามา (พร้อม archive) · next actions ค้าง: (2) bulk archive sm-spec/_proposal(17)/backup-map · (3) update stale PM/README/plan/research/core-erp/master-flows

**🔒 Auto-Generate ใบขอจากใบขาย — Waterfall Allocation ✅ (2026-07-03 · spec WH_warehouse.md §WH-2):**
- trigger: ใบขายยืนยัน + ระบุคลังจ่าย → ต่อบรรทัด: **เบิก(คลังจ่าย) → โอน(คลังอื่น) → ซื้อ(PO)** ตามลำดับ · 1 บรรทัดแตกได้ 3 ใบขอ · อ้างอิงกลับใบขายเดียวกัน (SC-5)
- **Q2=ก** กันสต๊อกตอนสร้างใบขอ (reserve ทันที) → ขึ้นคิวเบิกจริง WH-Q2 เมื่อแพลนวัน
- **Q3=ข** แก้/ยกเลิกใบขายภายหลัง → admin ยืนยันก่อน sync (ไม่ auto)
- test cases TC-1..TC-10 (เบิก/โอน/ซื้อ mix · TC-3b เบิก+ซื้อ · TC-3c โอน+ซื้อ) — spec มีตารางเต็ม · ใช้ตอน build WH-2R

**🔒 โมเดลคิว = "รางครัว" (Kitchen Rail) ✅ (2026-07-03):**
- **คิว = หน้ารวมหลายเอกสาร จัดตามทิศทาง** (ไม่ใช่ 1 คิว = 1 ประเภทเอกสาร) เหมือน order rail ในครัวร้านอาหาร — คลังกวาดสายตาเห็นงานทั้งหมด คลิกตั๋ว → เปิดฟอร์มทำจริง
  - **WH-Q1 คิวรับ** = ทุกงาน "เข้า/รับ": รับซื้อ (PO→WH-1) · รับโอน · รับคืน/เคลม
  - **WH-Q2 คิวเบิก** = ทุกงาน "จ่าย/ออก": ขอเบิก WH-2R · ขอโอน WH-3R · ใบจอง SL-2 (ที่ถึงคิว)
- **โครง 5 หน้าฝั่ง WH (เบิก/โอน/รับ):** Q1 คิวรับ (ทำใหม่) · Q2 คิวเบิก (**recycle จาก wh2-issue เก่า** = เดิมเป็นหน้า picking/packing queue อยู่แล้ว · ขยายรวมขอโอน+จอง) · WH-2R ขอเบิก (ฟอร์มแฝด WH-3R) · WH-2 เบิก (**rebuild ฟอร์มเดี่ยวใหม่ แฝด WH-3** · archive เก่า) · WH-3/WH-3R ✅ ทำแล้ว
- ลำดับ build: WH-2R (ตั๋ว·เร็ว) → WH-2 form (rebuild) → WH-Q2 rail (recycle+ขยาย) → WH-Q1 rail
**ยังไม่ทำ:** portal-mapping.md warehouse (flag stale) · core-erp-flows/reconcile-matrix docs อ้างชื่อเก่า (ประวัติ low-pri)

plan เต็ม: `.agents/topics/wh-renumber-plan.md`
- **Q1 ✓** เรียงตามปริมาณงาน: รับ=WH-1 · **เบิก=WH-2** · **โอน=WH-3** · นับ=WH-4 (สลับ 2↔3) — ⚠️ กระทบ audit #13: เจ้าของใบโอน WH-2→**WH-3**
- **Q2 ✓** R = "ขอ/เตรียม": WH-2R ขอเบิก · WH-3R ขอโอน · WH-4R เตรียมนับ → ออกเอกสารจริง
- **Q3 ✓** WH-Q dashboard · WH-Q1 คิวรับ · WH-Q2 คิวเบิก · โอน/นับไม่มีคิว · **timing: จองกันสต๊อกก่อน (SL-2) → ขึ้นคิวเบิกเมื่อแพลนวัน** (เชื่อม audit #7)
- **Q4 ✓** WH-R/WH-NM คงเดิม (report) · ชื่อไฟล์ code=เลข · execute ตอน rebuild
- **ชื่อไฟล์ใหม่:** wh1-receive · wh2-issue · wh3-transfer · wh4-count · wh2r/3r/4r · wh-q/q1/q2
- execute เมื่อ mapping ครบ + confirm → แก้ทุก reference (sidebar/DOC_MAP/breadcrumb/spec/catalog/cross-link)

## 🎨 wip Design-System Refactor + Hybrid Reconcile (2026-07-02)

**สถานะ 2 ไลน์งานที่ reconcile:**
- **wip (design-system refactor · ค้างกลางทาง):** วางโครงใหม่ `design-tokens.css` · `swt-patterns.js` · `swt-panels.js` · `swt-sc-modals.js` · `swt-sc-wire.js` · `sc-shared-catalog-mockup.html` · `_styleguide-preview.html` — **แต่ลบหน้าใช้งาน 26 หน้า** (WH×5/SV×8/CF×4/MD×3/SL×2/SC2/SQT/CL1) ยังไม่ rebuild
- **🔜 WH Renumber (wip plan · locked 2026-06-14 · ยังไม่ execute):** ตั้งใจ rename wh1-grn→wh1-receive · wh2-stock-transfer→wh3-transfer · wh3-sales-issue→wh-q2-issue-queue · wh-queue→wh-q-dashboard · wh4-stock-count→wh4-count — **catalog อ้างชื่อใหม่แล้วแต่ไฟล์ยังไม่มี** (ถ้าจะทำต้อง execute จริงก่อน)
- **Hybrid decision (2026-07-02):** เอา 26 หน้าใช้งานกลับจาก session (ดีไซน์เก่า + audit edits) + เก็บ infra ใหม่ของ wip ไว้ → portal ใช้ได้ + ค่อย migrate ทีละหน้า · branch `reconcile/consolidate-2026-07-02`
- **backup ครบ GitHub:** `expense-management-app`(base) · `claude/compassionate-tu-ebb1cc`(session) · `wip/...`(wip) · `reconcile/...`(hybrid)

## 🔒 SV Claim/Service Deep-Dive Grill (decisions 2026-07-02)

grill เจาะงานเคลม+บริการ · full spec `.agents/svc-claim-jobtype-spec.md` (§11 = build backlog B1-B10)
- **แยก 2 concept:** ① เคลมสินค้า (ของเราซื้อมาเสีย→คืน vendor · S1-S4 · chain CLM→PO-CN) vs ② เคลมงานบริการ (ศูนย์บริการซ่อมในประกัน ไม่ว่าซื้อจากไหน)
- **ประกัน per-component** (เครื่อง 1 ปี · คอมเพรสเซอร์ 5 ปี) → S/N lookup ได้ตารางประกันรายชิ้น
- **Billing:** assignable payer ต่อบรรทัดที่ SV-4 · default จากประกันรายชิ้น · แบรนด์→ARI · ลูกค้า→SL-4 · 2 บิลได้
- **อะไหล่ 2 แหล่ง:** ในประกัน (แบรนด์ส่งฟรี→ต้องคืนเก่า gate) / นอกประกัน (สั่ง PO via SV-Order→ไม่คืน) · return per-line + gate ปิดงาน + exception (แบรนด์ยืนยัน→admin ติ๊ก)
- **Entry A-E** (E = ซื้อที่อื่นในประกัน ซ่อม+เคลมอะไหล่/ค่าแรงได้ แต่เปลี่ยนสินค้าใหม่ไม่ได้) · **6 bins** WH-SVC-CTR · **SLA** per-ขั้น visibility config CF
- **5 job types** (ตรวจเช็ค≠ล้าง) checklist template ราย product type · **รายงานช่าง→CM-1** (เรทจ่ายช่าง≠ราคาขาย)
- CL decomposed: cl1-claims archived · เคลม = job type ใน SV-1 · SV_service.md sync ตาราง Menu List ตรงโครงจริง 9 หน้า

## 🔒 Flow Redundancy Closeout (decisions 2026-07-02)

จากรายงาน `.agents/flow-redundancy-analysis.html` — user ตัดสิน 10 overlap เปิดค้าง:
- **#14 CF-2.6 = canonical:** เปลี่ยนรหัสจาก CF-7 → CF-2.6 ทุกไฟล์ (CLAUDE.md ×2, CF_config.md +alias note, MD_master, SKILL ×2, portal docs, index/architecture html — 33 จุด) เหตุผล: ไฟล์ mockup ตั้งชื่อ cf2-6 ตั้งแต่แรก, mockup ชนะ notes
- **#10 อนุมัติ:** PO-7 = จุดจ่ายเดียว (Record Payment exclusive) · FI-8 = read-only aging + follow-up
- **#11 ปรับ:** Serial ผูก SL-4 บิลขายเป็นหลัก (ดึงจาก itemLedger/WH-3 แต่ link กลับบิลเสมอ) + exception "Serial ไม่มีบิลอ้างอิง" ให้ผูกบิลย้อนหลัง
- **#7 ปรับ:** อายุใบจองระบุวันเองได้ต่อใบ + default dropdown · guard สต๊อกไม่พอ = แสดงลิสต์ใบจองที่ถือของ (เลขใบจอง+เซลล์+วันหมดอายุ) เพื่อไปคุยถอนใบจอง
- **#13 อนุมัติ:** WH-2 = เจ้าของใบโอน · WH-1 รับครั้งเดียว · WH-3 = request only
- **#9 ยืนยันซ้ำซ้อน:** WHT ออกฟอร์มเดียว (FI-12) · อัตราหักเป็น dropdown เลือกเรท (1/2/3/5%)
- **#12 กลับทิศ:** ที่อยู่หัวบิล = ที่อยู่ใบกำกับภาษี (Bill-to) ≠ ที่อยู่จัดส่ง (Ship-to ใน tab จัดส่ง แก้อิสระ) — SV-6/WH-3 ต้องอ่านจาก Ship-to
- **#17 ลด scope:** ไม่ทำ chain ทฤษฎี — แสดงเฉพาะเอกสารที่อ้างอิงถึงรายการนั้นจริง (DocRefPanel)
- **#6 ✅ ดำเนินการแล้ว (2026-07-02):** PO-8 rename → **"สั่งซื้อสินค้าฝาก"** (title/breadcrumb/h1 ใน po8 mockup · swt-sidebar.js · PO_purchase.md +note · module-list/bc365-integration · cross-ref ใน wh1/po4) · SL-3 เพิ่ม badge "💼 ขาย มัดจำ — ลูกค้าจ่ายล่วงหน้า" · **naming convention ลง `knowledge-base/portal/03-ui-ux-convention.md` §10**: ชื่อเสี่ยงชนข้ามโมดูล → prefix ฝั่งงาน ("ขาย มัดจำ"/"ซื้อ มัดจำ") · shorthand ในเนื้อ flow โมดูลเดียวกันใช้ต่อได้ — **flow-redundancy audit ปิดครบ 17/17** 🎉
- **#15 ✅ grill จบ + ดำเนินการแล้ว (2026-07-02 Q1-Q10):** canonical = **SL-CN** (spec แก้ตามไฟล์ · SL_sales.md rewrite section) · เคลม: SV ส่งคำขอ → SL-Q กลุ่ม CN badge "จากเคลม SV" → Sales ออกใบ (ฟอร์มเดียว 2 ทางเข้า · เหตุผลล็อก) · รูปแบบเอกสาร auto ตามบิลต้นทาง · **ของก่อนเงินเท่านั้น** (WH Return/SV intake = Post gate) · เครดิตค้างใน ledger เสมอ → apply/refund ที่ FI-1Q · อนุมัติทุกใบ CF-2.6 · CN เฉพาะผลจบ "คืนเงิน/ลดหนี้" (เปลี่ยนตัวใหม่ = SV/WH→PO-CN) · **archive sl5-crm/sl6-promotion/sl7-report → `_archive/`** + ลบ sidebar/index/DOC_MAP — SL Phase 1 เหลือ SL-Q/1/2/3/4/CN/F1

## 🌙 HANDOFF — ต่อพรุ่งนี้ (บันทึก 2026-06-08)

**วันนี้ทำเสร็จ (committed · ahead origin):** procure-to-pay + AP Reduction chain เกือบครบ
- **Shared sidebar `swt-sidebar.js`** (refactor 73 ไฟล์ · แก้เมนู/ติดดาว ✦ ที่ DONE[] ที่เดียว · เลิก inline sidebar · กัน drift)
- **Forms rebuild บน `_form-template`:** PO-1 ใบขอสั่งซื้อ · PO-4 ใบสั่งซื้อ · WH-1 ใบรับสินค้า (โหมดรับ segmented) · PO-6 ใบตั้งหนี้ (ย้ายเข้าเมนู FI · maker≠checker · 3-Way drill · ดึงส่งเสริม/ลดหนี้) · PO-7 ส่งเสริมการขาย (สรุปได้จริง→ตั้งหนี้)
- **หน้าใหม่:** SC-3 ค้นหาเจ้าหนี้ · PO-CN ใบลดหนี้เจ้าหนี้ (Purchase Credit Note · ปิด gap APCN)
- **เชื่อม:** CLM → ออกใบลดหนี้ PO-CN → "รอหักหนี้" → PO-6 ดึงไปตัด
- **picker fixes:** sc2/sc7 ถอด sidebar · sc2 parent-doc + popup โปร่งใส · กรอบ iframe ไร้ขอบ (swt-doc-finder df-frame-x)
- **lock ไว้ 2 section ล่าง:** PO↔WH Receiving Boundary + AP Reduction Concept

**chain ที่ build แล้ว:** PO-1 → PO-4 → WH-1 → PO-6 → (FI-2) · + PO-7/PO-CN/CLM (AP reduction)
**✦ DONE:** SL-Q/1~4/CN · PO-1 · PO-4 · PO-6 · PO-7 · PO-CN · WH-1 · SC-3

**⏭️ ต่อ (ลำดับ):**
1. ~~**"รอหักหนี้" queue ใน PO-6**~~ ✅ 2026-06-08 — **ยุบเป็น picker เดียว "🔗 ดึงรายการอ้างอิง" 2 แท็บ**: (A) 🧾 ใบแจ้งหนี้ Vendor (+) เลือกหลายใบ · อ้างรับครบ · Inbox+คีย์มือ+แนบสแกน · เทียบยอด+3-Way · **ประเภทรับ (📥 รับทั้งหมด / 🟣 บิลฝาก) เลือกรายบิล** (เอา mode-bar รวมทั้งใบออก · gate/pill สรุปอัตโนมัติ) · (B) ↩️ ดึงลดหนี้/หัก (−) 4 หมวด: มัดจำ/บิลฝาก/ใบลดหนี้(PO-CN คืน/ราคาผิด/เคลม)/ส่งเสริม(PO-7) · ดึงเข้า PO-6.3 ตารางเดียว net · **PO-6.5 คำนวณสดจาก data-kind** · PO-6.2 เลิกปุ่มซ้ำ→badge · กันดึงซ้ำ+renumber · archive `_archive/po6-ap-invoice-mockup-2026-06-08.html`
2. ~~**✂️ ตัด PO-5 (Finance GRN)**~~ ✅ 2026-06-08 — `git mv po5-finance-grn-mockup.html → _archive/` · ลบ entry PO-5 จาก swt-sidebar.js · **redirect GRN→WH-1** ใน po1(chain)/po4(5จุด)/po8(2)/wh-r(8)/architecture(2)/cf1-rbac(list) · ไม่แตะ _archive/* + sangwijit-bc-mockup/ (sub-project แยก)
3. **PO-8 บิลฝาก (Deposit Pool)** — กองฝากเรียกออกหลายปลายทาง (เคสคุยละเอียด · 100→เรียก40→เหลือ60)
4. **FI-2 จ่ายชำระ AP** — ปิด chain procure-to-pay

**🔖 Backlog:** SC-2 tab ประวัติการซื้อ · PO-2 redo (Vendor Commitment · Sell-in/Rebate/Co-op) · dfOpenRef localize สายซื้อ (PR/RFQ/Reorder) · SL-4 เติมบริหารเครดิต+วงเงินลูกค้า+drop-ship
**⚠️ เคลม (CLM) = ย้ายไปอยู่ศูนย์บริการ SV** (งานเคลมเป็น domain SV) → defer · เชื่อม CLM→PO-CN ไว้แล้ว

## Working Rules (locked 2026-05-29)

- **Flow-first, always.** ทุกงานปรับดีไซน์หลังจากนี้: (1) ทำ/แสดง flow ให้เห็นก่อนว่าเข้าใจตรงกัน → (2) confirm → (3) ค่อยเริ่มปรับ mockup. ห้ามกระโดดไปแก้ดีไซน์ก่อน confirm flow. (ต่อยอดจาก memory feedback_edit_workflow: explain → confirm → edit, ห้าม batch หลายหน้า)
- **Canonical source = Flow Design + module spec** (ADR-0001 `docs/adr/0001-flow-and-spec-are-canonical.md`). รหัส/ขอบเขตหน้าใดเพี้ยนจาก flow/spec = แก้ที่ mockup. หน้าไม่มี flow = excess (ต้องเพิ่ม flow ก่อน หรือตัด). flow ไม่มีหน้า = gap จริง.
- **Glossary** อยู่ที่ `CONTEXT.md` (root) — เป็น glossary ล้วน ไม่ใส่ implementation.

### Working Rules เพิ่ม (locked 2026-05-30)
- **Docs-first:** ยึดเอกสารอ้างอิงเป็นหลัก (DD docx `_reference/docs/` + Flow PDF + spec md) · **ไม่ยึด HTML เป็นตัวตั้ง** (HTML = reference). component framework canonical = `_reference/docs/1 component_fw_clean.docx` (6 layers · 9 shared · doc-mode create/edit/view/approve/post).
- **ทำทีละ flow ให้เสร็จ** ตาม flow อ้างอิงที่ลิสต์ไว้ · **ยังไม่เน้นหน้า dashboard**.
- **ทุกข้อเสนอเปลี่ยน/ปรับ = ตารางเทียบ "ของเก่า ↔ ข้อเสนอใหม่"** ให้ user ตัดสิน (ในแชท หรือ canvas ตามที่ดูง่าย) ก่อนลงมือเสมอ.
- **เวลาคุยแต่ละเมนู** ดึงเอกสารอ้างอิง (DD + Flow + spec) มาประกอบทุกครั้ง + แนบลิงก์เปิดหน้าเดิม.
- **Obsidian save standard:** ทุก flow/decision ที่ปิด → save เป็นโน้ตเข้า vault `C:\Users\arm99\OneDrive\claude\ArmWiki\ArmWiki\Projects\Sangwijit-ERP-Portal\` (knowledge/searchable copy · คู่กับ `.agents/topics/` working copy). ใช้ `/claude-obsidian:save`. ทีหลังทำ `.base` รวม flow เป็นตาราง.
- **🔑 Scope = SWT single-entity** (ระบบกลาง · ตัดสิน 2026-05-31): ทำเพื่อ SWT บริษัทเดียว · ตัด multi-entity · **FI-13 Dual-Book / CF-2.8 Entity Tag = defer (นอก scope)** · FI-7 VAT selector → SWT only.

### Working Rules เพิ่ม (locked 2026-06-06)
- **🔑 Form Build Pattern (ใช้ทุกครั้ง ทุก module):** memory `feedback_form_build_pattern` — (1) ดึง Flow+Document+spec → Blueprint → confirm · (2) build บน `_form-template.html` (fit จอ 100vh · status+doc-chain รวมแถวบน · ตาราง 15 บรรทัด+grid · เลขที่อ้างอิงเป็นคอลัมน์ · sidebar+✦marker) · (3) shared: ลูกค้า=sc1 · สินค้า=sc2 (dfOpenCust/dfOpenProd) · อ้างอิง=dfOpenRef (multi-select) · ปุ่มค้นหาลูกค้าต้องมีเสมอ · (4) **ระบุ action หลัง Save/Post = สถานะ+routing ปลายทางทุกฟอร์ม** (ref: `.agents/topics/sl-post-save-routing.md`) · (5) archive+เทียบ full path+mirror Obsidian
- **Form Blueprint ก่อนสร้างทุกฟอร์ม:** ก่อนสร้าง/refactor mockup ฟอร์มใดๆ ต้องวาง Blueprint 5 ส่วนให้ confirm ก่อนเขียนโค้ดเสมอ — (1) โครงสร้าง section จาก Flow PDF + Document DD + spec · (2) shared component ต่อ section · (3) field list + อธิบายรายฟิลด์ · (4) **ข้อเสนอ (แนะนำ + เหตุผล) ต่อ section** · (5) จุดต่างเฉพาะฟอร์ม. ห้าม batch หลายฟอร์ม. (memory: `feedback_form_blueprint_standard`)

## 🔒 PO↔WH Receiving Boundary (locked 2026-06-07)

**หลักการ: "รับสินค้า = งานคลัง (WH)" ทั้งหมด** (ปกติ + ทยอยรับ + บิลฝาก) · จัดซื้อ (PO) เก็บแค่ สั่ง + ตั้งหนี้
```
PO-4 ใบสั่งซื้อ (สั่ง Vendor)
 ├ ปกติ:    → WH-1 ใบรับสินค้า (รับ·ทยอยรับ·serial/bin) ─รับครบ flag→ PO-6 ใบตั้งหนี้
 └ บิลฝาก:  → PO-6 ใบตั้งหนี้ (โหมดบิลฝาก·ตั้งก่อน+ดิวชำระ) → PO-8 บิลฝาก (Deposit Pool·เรียกออกหลายปลายทาง)
              ├ เข้าคลัง → WH-1 ใบรับสินค้า    └ ส่งลูกค้าตรง → SL-4 ใบขาย (drop-ship)
```
- **✂️ ตัด PO-5 (Finance GRN)** — ซ้ำ WH-1 (รับ) + PO-6 (ตั้งหนี้) · archive + เอาออกจาก swt-sidebar.js
- **WH-1 = ศูนย์รับ** · โหมดการรับ (ทยอยรับ/รับทั้งบิล) ระบุในหัวบิล · **"รับครบ" จริง = รับสะสม=สั่ง ทุกไลน์ (qty-based)** ไม่ใช่ดูจากโหมด (กันของขาดหลุดไปตั้งหนี้)
- **PO-8 บิลฝาก = Deposit Pool** (กองฝากที่ Vendor · ทยอยเรียกออกหลายปลายทาง 100→เรียก 40→เหลือ 60) · soft alert เงินจม (คนตัดสิน) · งานเรียก/รับ = ฝั่ง WH
- คนกดตั้งหนี้ = บัญชีการเงิน/จัดซื้อ
- **Backlog:** SC-2 tab ประวัติการซื้อ · PO-2 redo (Vendor Commitment) · dfOpenRef localize สายซื้อ · **SL-4 เติมบริหารเครดิต+วงเงินลูกค้า+drop-ship** · PO-6 refine โหมดบิลฝาก · ยุบ/ตัด PO-5

## 🔒 AP Reduction / Trade Support Concept (locked 2026-06-08)

**หลักการ: ยอดหนี้เจ้าหนี้ (AP) ลดได้ 2 จังหวะ** — บนบิล (หักใน PO-6) vs หลังบิล (ออกใบลดหนี้ PO-CN)
```
PO-2 ข้อตกลงงบ (commit ส่งเสริมการขาย) ──ดึง──►
[1] PO-7 ฟอร์มส่งเสริมการขาย — สรุป "ได้จริงเท่าไร" + เปลี่ยนสถานะ commit→realized → ส่งตั้งหนี้ ─┐
WH-1 ใบรับสินค้า (รับจริง +) ─────────────────────────────────────────────────────────────────┤
[2] PO-CN ใบลดหนี้ (คืนสินค้า / ราคาผิด / เคลม) ──────────────────────────────────────────────┼─► [3] PO-6 ใบตั้งหนี้ (ดึงรวม net)
[4] CLM ใบเคลม → บันทึก process → "รอหักหนี้" ──spawn──► PO-CN ──────────────────────────────┘
```
- **"เหตุผล" ≠ "เอกสาร":** ส่งเสริมการขาย/คืนสินค้า/ลดราคา/เคลม = เหตุผล · PO-6/PO-CN/PO-2/CLM = เอกสาร
- **[1] PO-7** = refine จาก Rebate Dashboard → **ฟอร์มสรุปยอดได้จริง + เปลี่ยนสถานะ + ส่งตั้งหนี้** (ดึงข้อตกลงจาก PO-2)
- **[2] PO-CN** ✅ build แล้ว = ใบลดหนี้ตัวเดียวครอบ คืน/ราคาผิด/เคลม (หลังบิล) → ตัด AP
- **[3] PO-6** ✅ build แล้ว · PO-6.3 ดึงบิลรวม (รับ + ใบลดหนี้ + ส่งเสริมได้จริง) net
- **[4] CLM** (กลุ่มบริการ) → เพิ่มสถานะ **"รอหักหนี้"** → spawn PO-CN (โหมดเคลม · อ้างอิง CLM)
- **"รอหักหนี้" = คิว/สถานะกลาง** เชื่อม PO-CN + CLM → โผล่ตอน PO-6 ดึงมาหัก
- **Sell-in = บนบิล** (หักใน PO-6 ตรง) · **Rebate/MOU = หลังบิล** (ผ่าน PO-7 สรุป → PO-6)

## Session Summary 2026-06-01 (ERP BC2 Part 2)

### ✅ งานที่เสร็จ
- **PromoPrice v1/v2/v3** — ยืนยัน v2 (`sc-promoprice-proposal.html`) เป็น current · side panel 1:1 per item
- **SL Sales Module** — map ครบ 10 หน้า + วัตถุประสงค์ + shared components + flow · บันทึก Obsidian `SL Sales Module.md` ✅
- **SL-1 Flow** — วิเคราะห์จาก DD + Flow PDF + spec · ได้ field list + status flow ครบ
- **Credit Memo 3 กรณี** — Sales Return / ยกเลิกบิล / ลดหนี้ → แต่ละกรณีใช้เอกสารต่างกัน
- **CF Setup ทั้งหมด** — review ทุกหน้า · สรุปสถานะ Portal-owned / cut-to-BC
- **ADR-0004 + CF-2.2** — Format `[BranchCode][DocCode]-[YYMM]-[###]` · CF-2.2 เปลี่ยนจาก cut-to-BC → **Portal-managed** · บันทึก Obsidian ✅
- **CF-1 RBAC prototype** — `_proposal/cf1-position-rbac-proposal.html` · 5 tabs · approve แล้ว
  - Tab 4 กลุ่มเอกสาร: **แก้แล้ว** → กรองตาม Tab 2 สิทธิ์เมนูที่ติ๊กไว้ (DOC_MENU_MAP)
- **CF-2.2 prototype** — `_proposal/cf2-2-number-series-proposal.html` · 3 panels: Matrix / Format Editor / Audit
- **Obsidian** — `CF Setup Module.md` สร้างใหม่ · `Foundation & Decisions.md` อัปเดต · ADR-0004.md ✅

### ⏳ Next Actions (ลำดับ)
1. ~~**CF-2.6 Approval Matrix**~~ ✅ 2026-06-03 — `_proposal/cf26-approval-matrix-proposal.html` (Position-based · SWT · +SL-RQ/RT/CN/DN · Simulator)
2. ~~**CF-2.7 Doc Template**~~ ✅ 2026-06-05 — ทับ deployed ด้วย proposal design (`cf2-7-doc-template-mockup.html` 1061→567 บรรทัด) · ตัด Running/Format (ย้าย CF-2.2) · 5 tabs→3 panels · SWT single-entity · 13 doc types sync CF-2.2 · archive เก่า `_archive/cf2-7-doc-template-mockup-2026-06-04.html`
3. ~~**CF-2 Config Hub**~~ ✅ 2026-06-06 — ทับ deployed ด้วย proposal design (`cf2-config-hub-mockup.html` 932→353 บรรทัด) · 9→8 card (ซ่อน CF-2.8/CF-9 Entity Tag) · CF-2.2 🔴→🟢 Portal-managed · href→deployed mockup ทุกอัน · card render จาก JS array · สรุป Portal 4/BC 4 · archive `_archive/cf2-config-hub-mockup-2026-06-06.html` · **CF module ปิดสมบูรณ์**
4. **SL-1 ใบเสนอราคา** — ลงรายละเอียด mockup ตาม flow + DD
5. **fi4→FI-5 / fi5→FI-6 recode** (Finance ค้าง)

### 💡 วิธีเปิด session ใหม่
```
"อ่าน .agents/active.md แล้วต่องาน CF-2.6"
```

---

## Reconciliation Audit (2026-05-29) — mockup vs Flow Design

8-module cross-ref. อันดับความรก: Service+Claims (14 หน้า/6 flow, P2) > Finance (เลข fi3/4/5 เพี้ยน → Bank Recon + JV หาย, P1) > Sales (sl5=CRM แย่งช่อง Credit Memo; sl6 promo วางผิด, P1) > Master (sm1/2/3 วางผิด; ขาด Price List masters) > Promotion (กระจาย pm/sl/po/cm) > Purchase (ดี · แค่ rename po2/po7) > Warehouse (สะอาด · แค่ retitle wh1) > Utility (สะอาด).
- **Excess (ไม่มี flow):** sl5-crm, fi5-ar-audit, sir, sqt, sm1, sm2, cm1
- **Misplaced (ผิด module):** sl6-promotion-setup → PM · sm3-vendor-report → (P2 Vendor Portal)
- **Duplicate:** sv7↔sv4 (ปิดงาน) · cl1↔clm (เคลม) · po5-grn vs wh1-grn (boundary ต้องชัด)
- **Merge fragment:** sv6-1-booking-modal + sv6-print-templates → เข้า sv6
- **P1 Gaps:** Sales Credit Memo (flow 07) · Bank Reconciliation · General Journal/JV · Purchase/Sales Price List masters
- หลักฐานเต็ม: workflow reconcile-mockups-vs-flows (2026-05-29).

## Finance — flow confirmed (2026-05-29) → เริ่มจัดระเบียบ

flow-understanding: `.agents/topics/finance-flow-understanding.md` (user confirm แล้ว). Decisions ที่เคาะ:
- **FI-4 JV (General Journal) = cut-to-BC** (ไม่ทำหน้า Portal · เหมือน CF-2.3 Posting & GL · ต่อยอด BC365 audit)
- **FI-7 VAT report = P1** (ยึด flow · spec เขียน P3 ผิด → ต้องแก้ spec) · ยื่น ภ.พ.30 ทุกวันที่ 15
- **แยก VAT/WHT:** FI-7 = รายงาน VAT (ภ.พ.30) · FI-12 = WHT List (ภ.ง.ด.3/53) · เลิกรวมหน้าเดียว
- **Account flows ไม่ใช่ FI:** AR→SL-4, AP→PO-6+ap1, ARCN→SL-CN (ใหม่), APCN→PO-CN (ใหม่)
- ลำดับลงมือ Finance: (1) สร้าง FI-3 Bank Recon [กำลังทำ] → (2) re-code fi3→FI-7 + fi4→FI-5 → (3) รวม FI-12 WHT → (4) FI-2 โชว์ Approval → (5) fi5-ar-audit re-scope → (6) FI-13 transfer engine. ทำทีละหน้า (no batch).

> **อัปเดต 2026-05-30 (ADR-0002):** ✅ FI-3 Bank Recon ยืนยันเสร็จ (ไม่ใช่ gap) · ✅ recode fi3-tax→**FI-7** (สร้าง `fi7-vat-report-mockup.html` = VAT register ตาม flow Account/06, ไม่ใช่หน้ากระทบยอด) · ✅ แยก WHT → **FI-12** (`fi12-wht-mockup.html`) · ✅ archive `fi3-tax` · ✅ sidebar rollout 73 ไฟล์ + index · ✅ ปิดงวด=cut-to-BC · แก้ spec FI_finance.md + CONTEXT.md + ADR-0002. **ค้าง:** fi4→FI-5, fi5→FI-6 recode · FI-2 Approval gate · ตรวจ FI-7.N section label/render. ดู `.agents/topics/reconcile-mockup-vs-flow-matrix.md`.

## Phase 1 Closeout (2026-04-27 / 28)

- **FI-Q Refactor ✅ NEW 2026-04-28** — apply Q-rule (drill modal) · FI module wrap-up · 5/5 main modules ปิด queue pattern
  - **Keep:** Sum bar (5 KPI: total/AR/AP/Tax/Close) · Action summary hero · 6 queue cards (AR/AP/Tax/WHT/JV/Close · ทำหน้าที่เหมือน sub-type chips อยู่แล้ว) · Mini calendar of deadlines (4 events) · Detail panel filter
  - **Add:** drill modal (SL-4 pattern · 6-step status pills · customer + credit info · invoice details + 4 payment channels: QR/Bank/Card/Cash · footer drill → FI-1)
  - **Convert:** 8 detail panel rows → q-row class + onclick="openWqDetail()" · all action buttons in tbody → event.stopPropagation() · so click row = open modal · click button = button action without bubbling
  - **Q-page rule applied:** row buttons → modal · header + modal footer + card-level "💳 รับชำระ" link = navigate OK
  - **Sidebar relabel 74 ไฟล์:** "Finance Queue" → "คิวงานการเงิน"
  - **index.html:** sidebar nav + FI-Q card description updated
- **SV-Q Refactor ✅ NEW 2026-04-28** — apply queue pattern · SV module wrap-up
  - **Keep:** KPI 5 cards (งานวันนี้/รอมอบหมาย/กำลังดำเนินการ/เสร็จวันนี้/เกิน SLA) · **Technician Board** (4 tech cards · valuable visualization · งานวันนี้ + skill + status)
  - **Replace:** filter dropdown + jobs table (12 rows) + slide-in panel pattern → 14 rows + 8 sub-filter chips:
    - 🆕 New Intake (รับเรื่องใหม่ SV-1 · 2) · 🔍 Site Inspection (SIR · 1) · 💵 Quote Pending (SQT · 1)
    - 👷 Pending Assignment (รอมอบหมาย SV-2 · 3) · 🛠️ In Progress (SV-5 · 3) · 🔧 Awaiting Parts (SV-3/SV-O · 2)
    - ✅ Ready Delivery (SV-7 · 1) · 🎫 Vendor Claim (CLM · 1)
  - **Click row → centered modal** (replace slide panel · SL-4 pattern · 6-step status pills · customer + product card · อาการ + การประเมิน + SIR escalation hint · footer drill → SV-1)
  - **Q-page rule applied:** row buttons → openWqDetail() · header + modal footer = navigate OK
  - **index.html:** SV-Q card description updated (8 sub-types listed)
- **SL-Q Refactor ✅ NEW 2026-04-28** — apply queue pattern · SL module wrap-up
  - **Keep:** Header quick actions (4 buttons + ใบเสนอ/จอง/มัดจำ/บิล) · KPI 6 cards · Sales Pipeline Summary (5 bars · valuable visualization)
  - **Replace:** Recent Documents filter dropdown + table → 15 rows + 8 sub-filter chips:
    - 📋 New Quote (รอติดตาม · 3) · 📌 Pending Reservation (จอง · 2) · 💰 Awaiting Deposit (รอลูกค้าจ่าย · 2)
    - 🧾 Pending Invoice (พร้อมออกบิล · 3) · ⚠️ Credit Hold (รออนุมัติวงเงิน · 2) · ↩️ Return Request (ลูกค้าขอคืน · 1)
    - 🎁 Promo Validation (ตรวจ promo · 1) · 📞 Follow-up Required (CRM · 1)
  - **Click row → Detail modal** (SL-4 pattern · 6-step status pills · customer card 2-col with credit info + ratings · line items 4 SKU sample · footer drill → SL-1)
  - **Q-page rule applied:** row "ดำเนินการ" buttons → openWqDetail() · header + modal footer = OK navigate
  - **Sidebar relabel 74 ไฟล์:** "Sales Queue" → "คิวงานขาย"
  - **index.html:** sidebar nav + WH cards descriptions อัพเดต
- **PO-Q Refactor ✅ NEW 2026-04-27 (late evening)** — apply queue pattern เหมือน WH (Phase 1 PO module wrap-up)
  - **Keep advanced features:** Panel 0 (MOS Critical · 3 SKU · ต้องสั่งด่วน rule A5) + Panel F (CN Outstanding · Sanction Flow Day 0/7/15/30 + Stop New PO rule A3)
  - **Replace:** 3 tabs (Queue/Create-PR/Summary) + tab JS · ลบทั้ง Tab 2 Create-PR และ Tab 3 Summary (ใช้ + ปุ่มสร้าง PR ที่ link → po1 แทน · summary report ย้ายไป RP-1)
  - **New queue:** 13 rows + 8 sub-filter chips:
    - 📋 PR Pending (รอสร้าง PO · 7) · ✉️ RFQ Open (รอราคา · 3) · 📦 PO Pending (รอส่ง Vendor · 4)
    - 🚚 Awaiting Receive (รอ GRN · 5) · ⚠️ Overdue (เกินกำหนด · 3) · 💰 Deposit Pending (PO-8 · 2)
    - 📄 AP Pending (พร้อมตั้งหนี้ · 1) · 🎯 Rebate Tracking (PO-7 · 1)
  - **Click row → Detail modal** (SL-4 pattern · gradient + 6-step status pills · line items + MOS chip + Vendor info + Trade Type + CN status · footer → สร้าง PO ที่ PO-4)
  - **Cross-links:** PO-4 (สร้าง PO) · PO-8 (Deposit) · PO-6 (AP Invoice) · PO-7 (Rebate) · WH-1 (GRN) · WH-R (Stock Card)
- **WH-2 + WH-4 Refactor ✅ NEW 2026-04-27 (evening)** — apply queue pattern เหมือน WH-1/3 (consistency · Phase 1 closeout)
  - **WH-2 (Transfer Queue · คิวโอนย้ายสต็อก):** ลบ tabs เดิม (รายการโอน/สร้างใบโอน/ประวัติ) + form sections + side panel · เป็น queue page เต็มตัว · 12 rows + 8 sub-filter chips (TR-Out · TR-In · Transit · Inter-Branch · Internal-Bin · Service-Stock · Promo-Stock · Return-Flow) · click row → Detail modal (SL-4 pattern · gradient + status pills 6 ขั้น · From→To route card · line items + Stock Card link)
  - **WH-4 (Count Queue · คิวนับสต็อก):** ลบ tabs เดิม (แผนการนับ/กำลังนับ/ประวัติ) · 11 rows + 8 sub-filter chips (Cycle · Annual · Spot · Recount · Branch · Bin · NewItem · PreAudit) · variance tracking · click row → Detail modal (status pills 6 ขั้น · 24 SKU sample table + count input + Variance auto-calc · ขั้นตอนการนับ 6 steps)
  - **Sidebar relabel 75 ไฟล์:** WH-2 "โอนย้ายสต็อก" → "คิวโอนย้ายสต็อก" · WH-4 "นับสต็อก" → "คิวนับสต็อก"
  - **index.html:** sidebar nav 2 entries + WH cards 2 entries (descriptions อัพเดต) · WH module ปิดสมบูรณ์: 7 หน้าทั้งหมดเป็น queue pattern เดียวกัน
- **Tier-C polish ✅ DONE 2026-04-27 (evening)**:
  - **BC Direct banner** added to 3 cut-to-BC pages: CF-2.1 Tax Setup · CF-2.2 Number Series · CF-2.9 General Parameter — banner สีแดงระบุชัดว่าใช้ BC365 ตรง · mockup เก็บเป็น reference เท่านั้น · ระบุ BC path
  - **Deprecate portal-mockup-index.html** = ไฟล์หายแล้ว (rename/merge เป็น index.html ตั้งแต่ก่อนหน้า) · skip
  - Sidebar edge cases (modal/login/print/sc10/sv7/sv6 — 5-6 ไฟล์ที่ rollout ไม่ครบ): ปกติเป็นหน้าที่ no/cut-down sidebar · pre-existing pattern · ไม่ใช่ scope แก้

## Phase 2 Plan: Brand CI Rollout (SWE-only)

- **Decision 2026-04-27:** ใช้ Sangwijit Design CI (skill at `~/OneDrive/claude/ArmWiki/sangwijit-design/`) กับ **งานใหม่หลังจากนี้ทุกชิ้น**
- **Scope correction:** CI ครอบคลุม **SWE (แสงวิจิตรการไฟฟ้า · ค้าปลีก) เท่านั้น** · SWT/VMN/WPS ยังไม่มี logo · ต้องถามก่อนใช้
- **Locked specs (SWE):**
  - 🔵 Brand Blue: `#184898` (RGB 24/72/152)
  - 🟠 Brand Orange: `#F37721`
  - Font: **Sukhumvit** (TH+EN single font · fallback `Sukhumvit Set, IBM Plex Sans Thai, Sarabun`)
  - Tagline: "เพื่อนแท้ ไว้ใจได้"
- **Existing 80+ mockups:** leave as-is (Tailwind `#2563EB` + Inter+Noto Sans Thai · sidebar `#1E3A5F`) — ห้าม batch refactor unless requested
- **Multi-entity caveat:** ERP mockups ส่วนใหญ่เป็น multi-entity (Dual-Book Tag 1/2/3/novat) ไม่ใช่ SWE-only · การ apply CI SWE กับ ERP ทั้งระบบจะไม่เหมาะ · รอ master brand CI

# Active Context

## Objective
ออกแบบ Frontend ERP Web Portal (Sangwijit Group) เหนือ Dynamics 365 Business Central — สร้าง HTML mockup ครบทุกหน้า, เตรียม handoff ให้ทีม dev

## Current State (2026-04-27 — latest)

- **SV Phase 3 SIR/SQT/CLM expansion ✅ NEW 2026-04-27** — ขยาย flow ให้รองรับงานที่ต้องประเมินหน้างาน + งานเคลม Vendor
  - **3 หน้าใหม่:**
    - `sir-site-inspection-mockup.html` — ใบประเมินหน้างาน (Site Inspection Report) · 5-section: ข้อมูลลูกค้า · งานที่ต้องประเมิน · รายการประเมิน + รูป + ประมาณค่า · ข้อจำกัดหน้างาน · Hand-off → SQT
    - `sqt-service-quotation-mockup.html` — ใบเสนอราคางานบริการ · ผู้จัดการ markup · ส่งลูกค้า · รอยืนยัน → SV-2
    - `clm-vendor-claim-mockup.html` — ใบเคลม Vendor (post-warranty) · ส่งเคลมแบรนด์ · ติดตามผล · รับเงิน/ของแทน → ตั้ง APCN ตัด ARI ของ SV-4 · 6-step status pills
  - **Flow เพิ่ม:** SV-1 → **(ถ้าต้องประเมินหน้างาน) → SIR → SQT → ลูกค้ายืนยัน** → SV-2 → SV-5 → SV-3/SV-O → SV-4 → SV-7 · ส่วน CLM แยก loop จาก SV-4 (post-close) → APCN
  - **Branch optional ใน SV-1:** เพิ่มปุ่ม `🔍 ขอประเมินหน้างาน (SIR)` (secondary) คู่กับ `→ ส่งต่อ SV-2` (primary) · Timeline แทรก step "ประเมินหน้างาน (ถ้าจำเป็น)"
  - **Sidebar rollout:** 75 ไฟล์ (Python regex block replace · count 9 → 12) · เพิ่ม SIR/SQT/CLM · reorder ตาม flow (SV-5 ก่อน SV-3) · 5 ไฟล์ตกหล่น (modal/login/print/sc10 — ไม่มี sidebar SV)
  - **index.html:** Service section 8 → 11 cards · sidebar nav 8 → 11 entries · KPI hero 66 → 80 pages · subtitle อัพเดต
  - **CLM footer fix:** แก้ copy-paste leftover (ปุ่ม "ส่งต่อ SQT" → "ตั้ง APCN + ปิดเคลม")
  - **Pending:**
    - Verify SIR/SQT vs `ui_design_pattern_guideline.md` (7-section ERP form, status hex, bilingual)
    - Wire reverse links: SV-4 → CLM (button "🎫 เปิดเคลม Vendor" สำหรับงานในประกัน), SQT → SV-2 (auto-spawn)
    - ทบทวน BC365 mapping ของ SIR/SQT/CLM (Portal-owned 100% ตาม pattern SV)
- **AP Invoice chain audit ✅ DONE 2026-04-27** — PO-6/PO-5/PO-8 audit pass · features ครบ
  - PO-6 (AP Invoice · ใบวางบิล Vendor): gate "รับครบก่อนตั้งหนี้" + 2-mode toggle (Normal 3-Way / Deposit 2-Way) + auto-switch via `#mode=deposit` deep-link
  - PO-5 (Finance GRN · ใบรับสินค้าตั้งหนี้): partial receive + cumulative tracking + full-receive detector + forward CTA "→ PO-6" (เพิ่งเพิ่ม) · text-link → PO-8 (ครบ Credit Term)
  - PO-8 (Deposit Bill · บิลฝาก): "⏭ Settle (ของครบ)" deep-link → PO-6#mode=deposit
  - Per-line ref refactor: PO-4 "ชื่อสินค้า · PR ref · VC" → "ชื่อสินค้า" + column dedicated "เลขที่อ้างอิง" ขวาสุด · ย้าย ref จาก PR (po1) → SL-4 (INV-26-0042 drop-ship pattern)
  - SL-4 ก็ refactor ตาม pattern เดียวกัน (column "เลขที่อ้างอิง" ขวาสุด · ย้าย ref จาก inline)
  - PO-4 References section "📎 เอกสารอ้างอิง": inline body section → popup modal pattern (เหมือน SL-4 mDocRef) · trigger card + summary stats + ปุ่ม "🔗 ดูรายละเอียด" → modal มี PSI Report + PO-8 Deposit เนื้อหาเดิมครบ
- **WH-Q/WH-1/WH-3 Refactor ✅ NEW 2026-04-27 (later)** — split queue role per page · Q1=a (ลบจาก WH-Q) + Q2=b (ลบ form WH-1)
  - **WH-1 (Warehouse Receive Queue · คิวรอรับสินค้า):** ลบ form (S2-S7: doc-header + vendor-info + line items + tabs + summary + sticky-action) ออก · เป็น list page เต็มตัว · KPI 4 cards + 8 sub-filter chips (PO · PO-8 · TR-In · RT-Good · RT-Defective · RT-SV · RT-V · ADJ-In) + queue table 8 rows · click row → Detail modal (SL-4 pattern · gradient main-header + status pills + party card + line items + footer)
  - **WH-3 (Warehouse Issue Queue · คิวเบิกสินค้า):** ลบ queue table เก่า (6 rows) · ใส่ใหม่ 9 rows + 8 sub-filter chips (SL-4 · SV-6 · TR-Out · SV-3 · SV-O · Promo · ADJ-Out · RT-V Out) · เก็บ Tab 2 (Pick & Pack) + Tab 3 (History) ไว้ · click row → Detail modal เดียวกับ WH-1
  - **WH-Q (Warehouse Dashboard):** ลบ 2 sections (Receive + Issue queues) ออก · เก็บ KPI summary + filter bar · เพิ่ม CTA cards 2 ใบ (gradient blue → WH-1 รับ · gradient pink → WH-3 เบิก) + Quick links bar (WH-2/WH-4/WH-R/WH-NM) · ลบ JS chip + modal (ไม่ใช้แล้ว)
  - **Sidebar relabel 75 ไฟล์:** WH-Q "คิวรับสินค้า" → "Dashboard" · WH-1 "ใบรับสินค้า (GRN)" → "คิวรอรับสินค้า" · WH-3 "เบิกสินค้า" → "คิวเบิกสินค้า"
  - **index.html:** sidebar nav labels + WH cards (3 cards updated content) + 1 card descriptions
- **WH Module Reports ✅ NEW 2026-04-27 (earlier)** — ปิด WH module
  - WH-NM (Warehouse Non-Movement Report · รายงานสินค้าไม่เคลื่อนไหว): audit pass · features ครบ (threshold settings · category override · filter · ledger · branch breakdown · auto-alert) · ไม่ต้องแก้
  - WH-R (Warehouse Stock Card · รายงานสต็อกการ์ด): **NEW** — 7 sections ใหม่
    - WH-R-1 ตัวกรอง (SKU + สาขา + ช่วงเวลา + brand)
    - WH-R-2 Item Info card (SKU header + cost layers + sell price + stock)
    - WH-R-3 KPI strip 5 cards (Open · In · Out · Closing · MOS)
    - WH-R-4 Movement Ledger (16 transactions · GRN/Sales/TR-In/TR-Out/SVC/ADJ + cumulative balance + Moving Average cost)
    - WH-R-5 Branch Breakdown (4 สาขา + MOS + status)
    - WH-R-6 FIFO Cost Layers (4 lots · weighted avg cross-check)
    - WH-R-7 Sales Velocity Comparison (30/60/90 วัน + MOS recommendation)
  - **Sidebar rollout 73 ไฟล์** (WH count 5 → 7) · 6 edge cases (modal/login/print/sc10/sv7/sv6 — handle แยก)
  - **index.html:** WH section 5 → 7 cards · sidebar nav 5 → 7 entries · KPI hero 80 → 81 pages
- **Feedback rule new:** [Expand abbreviations](feedback_abbreviation_expansion.md) — ทุกครั้งที่พิมพ์ตัวย่อในข้อความตอบ user ต้องใส่ชื่อเต็มในวงเล็บประกอบ
- **Phase 1 mockup status:** 81 pages ทั้งหมด · AP Invoice chain ปิด · WH module ปิด · เหลือ low-priority polish (sidebar edge cases · spec docs)

- **PIVOT 2026-04-23 22:00 — Path 2 scope simplified + focus shift → AP Invoice (PO-6)**
  - **User clarifications ยืนยัน:**
    - **PO-3 Vendor Onboarding** = สร้าง Vendor ใหม่ (กรอกข้อมูล) · **ไม่ใช้ KYC** · create-only — การแก้ไขต้องใช้สิทธิ์ (ไม่อยู่ใน scope หน้านี้) · ไม่ซีเรียส · สร้างได้เลย
    - **PO-5 Finance GRN** = รับสินค้า โดย user = คลัง หรือ แคชเชียร์สาขา (ขึ้นกับมอบหมาย/สิทธิ์) · **ทยอยรับได้** (order 10 · รับก่อน 2 ตัว OK) · **เงื่อนไขตั้งหนี้: ต้องรับครบบิลก่อน** ถึงจะตั้งหนี้ได้ (ยกเว้นเข้าเงื่อนไข PO-8 บิลฝาก)
    - **PO-8 Deposit Bill** = **ข้ามขั้น PO-5** · รับการวางบิล/จ่ายชำระก่อน · สินค้ายังอยู่กับบริษัท (ฝากของ) · ทยอยรับสินค้าผ่าน PO-5 · ต้อง**ไล่ตาม flow เอกสาร**
    - **WH-R + WH-NM** = กลุ่ม**รายงาน** (ไม่เร่ง) · ดึงจากประวัติรับเข้า + ประวัติสินค้า + คงเหลือ + ประวัติขาย เปรียบเทียบ
  - **NEW FOCUS:** กระบวนการตั้งหนี้ (AP Invoice · PO-6) — ลำดับสำคัญกว่า Path 2 เดิม
    - flow: PO-5 (รับครบ) → PO-6 AP Invoice | PO-8 (บิลฝาก) → PO-5 ทยอยรับ → settle
    - PO-6 mockup มีอยู่แล้ว — ต้อง audit ว่า UX ตรง flow นี้ไหม (gate "รับครบ" · link PO-8 advance · 3-Way Match)
  - **Pending decision:** `/plan-mockup` skill setup — user ถามแนวทาง 3 option (skill / memory / ทั้งคู่) ยังไม่ตัดสินใจ — คาดเริ่ม conversation หน้า
  - **Build order ใหม่ (revise):** audit PO-6 flow ก่อน → PO-5 (รับสินค้า + gate) → PO-8 (ฝากของ + advance) → PO-3 (simple form) → WH-R/WH-NM (reports · low priority)

- **SV Module Phase 2 Refinement ✅ NEW 2026-04-23 (evening)** — ปรับโครงตาม user workflow จริง (4 ขั้น + SV-Order)
  - **User's 4-step workflow:** (1) ใบรับงานซ่อม · (2) ใบมอบหมายงาน · (3) ใบรับจากงานซ่อม (admin pricing) · (4) ส่งงานลูกค้า + ปิดงาน
  - **NEW builds (3 pages):**
    - `sv2-service-assignment-mockup.html` — ใบมอบหมายงาน (เดิมรวมอยู่ใน SV-1) · 6 tabs: เลือกช่าง/นัด/เบิก-สั่งอะไหล่ล่วงหน้า/แจ้งลูกค้า+ช่าง/อ้างอิง/timeline · 3 tech cards
    - `sv-order-parts-request-mockup.html` — สั่งอะไหล่ (ใหม่ทั้งหมด) · state chain 5 ขั้น: สั่ง → จ่ายเงิน → รอรับอะไหล่ → นัดหมาย → รอส่งอะไหล่เก่าคืน · ผูก Job+Customer+Serial · spawn PO-4
    - `sv7-service-delivery-mockup.html` — ส่งงานลูกค้า + ปิดงาน (แยกจาก SV-4) · customer signature + Rating + QR PromptPay + Invoice preview · ปิดงานระหว่างเรา-ลูกค้า
  - **Refactor (3 pages):**
    - `sv1-service-intake-mockup.html` — ตัดส่วน "นัดหมายช่าง" ออก (ย้าย SV-2) · Tab "ความสะดวกลูกค้า" (preferences only) · action → ส่งต่อ SV-2
    - `sv3-spare-part-issue-mockup.html` — Redesign ตาม `ui_design_pattern_guideline.md` · 7-section ERP form · status hex (`#BFBFBF`/`#C55A11`/`#4472C4`/`#375623`) · bilingual TH/EN labels · 4 tabs
    - `sv4-service-close-mockup.html` — เปลี่ยนเป็น "ใบรับจากงานซ่อม" (admin pricing+warranty adj) · **Tab Vendor Billing (Q2=A)** · Customer side เป็น preview · action → ส่งต่อ SV-7
  - **Light touch:** `sv5-job-card-mockup.html` — เพิ่ม state link ไป SV-3/SV-Order + state flow alert · action → SV-4
  - **SV-Order vs อื่น:** ไม่ซ้ำ · SV-3 = เบิกจาก**สต็อก** · SV-Order = **สั่งใหม่** (spawn PO-4 · รับผ่าน WH-1 GRN)
  - **Sidebar rollout:** 67 files (Python regex block replacement · idempotent) · 9 SV entries: SV-Q/1/2/5/3/O/4/7/6
  - **index.html:** Service section 5→8 cards · meta + sidebar updated
  - **Commit prior:** `ddc4d8b` feat(sv): Phase 1 SV loop closure
- **SV Module Loop Closure ✅ 2026-04-23 (morning) — superseded by evening refinement above**
  - **Rename + Archive:**
    - `sv1-service-queue-mockup.html` → `sv-q-service-queue-mockup.html` (เนื้อหาจริง = Queue Dashboard)
    - `sv2-service-invoice-mockup.html` → `_archive/` (Service Invoice logic ย้ายเข้า SV-4 ตาม Q3=B)
    - `sv4-warranty-check-mockup.html` → `_archive/` (**ไม่ใช้** — ทีมเช็คประกัน manual กับ Vendor · Q2 decision)
  - **NEW 2 pages built:**
    - `sv1-service-intake-mockup.html` — ERP Form 7 sections: Doc header · Customer · Product+Serial · Warranty toggle (3 options) · Appointment/Photo/Ref/Timeline tabs · ประมาณค่า · **ไม่มี auto warranty check** (manual field)
    - `sv4-service-close-mockup.html` — Close/QA + Invoice merged: Job ref · QA Checklist 6 ข้อ · Before/After photos · Digital signature 2 เซ็น + Rating · **Billing mode dual** (🏢 Vendor / 👤 ลูกค้า split summary) · BC Sync post
  - **Spec ambiguity resolved (Q1=A):** SV-2 Mobile Job Card ตัดออก — sv5 Desktop Job Card cover ทั้งหมด
  - **Sidebar rollout:** 69 ไฟล์ updated (2-pass Python script) · 6 SV entries ใน group บริการ: SV-Q · SV-1 (NEW) · SV-3 · SV-4 (NEW) · SV-5 · SV-6
  - **index.html:** Service section (5 cards · count 5 pages) + sidebar nav updated
  - **dev-handoff-spec.html:** SV table + file list updated
- **PO/WH Rename Cleanup ✅ 2026-04-21** — ปรับเลข mockup ให้ตรง `sangwijit-portal-skill` spec
  - `po3-vendor-invoice-mockup.html` → `po6-ap-invoice-mockup.html` (เดิมผิดแมป — จริงๆ คือ PO-6 AP Invoice)
  - `po-rebate-dashboard.html` → `po7-rebate-dashboard.html`
  - `whr-goods-issue-mockup.html` → `wh2-issue-mockup.html` (spec: WH-3 = Sales Issue)
  - `wh3-stock-count-mockup.html` → `wh4-count-mockup.html` (spec: WH-4 = Physical Count)
  - Updated: 73 .html files + swt-link.js + 3 .md docs (filename refs + sidebar code labels + titles + breadcrumbs + stale `PO-Rebate` → `PO-7`)
  - _archive/ ไม่แตะ
- **Gap + KPI Matrix ✅ NEW 2026-04-21** — `.agents/topics/po-wh-gap-kpi-matrix.md` เทียบ spec vs mockup (PO 9 + WH 7), map 27 KPI, Priority P0-P3
- **Next (revised 2026-04-23 22:00 — focus = ตั้งหนี้ flow):**
  1. Audit PO-6 AP Invoice (มีอยู่แล้ว) ว่า gate "รับครบก่อนตั้งหนี้" + link PO-8 มีหรือยัง
  2. Build PO-5 Finance GRN (ทยอยรับ + full-receive detector)
  3. Build PO-8 Deposit Bill (ข้าม PO-5 · bill first · flow เอกสารไล่ตาม Flow Design PDF)
  4. Build PO-3 Vendor Onboarding (simple form · no KYC · create-only)
  5. (Low priority) WH-R Stock Card + WH-NM Non-Move Report — รายงาน · ดึงข้อมูลรวม

## SV Module — Final Structure (post 2026-04-23 Phase 2 refinement)
| รหัส | ไฟล์ | บทบาท | State หลัก |
|---|---|---|---|
| SV-Q | `sv-q-service-queue-mockup.html` | Queue dashboard (ทุกสถานะ) | filter ตาม state |
| **SV-1** | `sv1-service-intake-mockup.html` | ใบรับงานซ่อม (รับเรื่อง · ประมาณการ) | `รอมอบหมาย` |
| **SV-2** 🆕 | `sv2-service-assignment-mockup.html` | ใบมอบหมายงาน (Admin เลือกช่าง+นัด) | `รอมอบหมาย → มอบหมายแล้ว` |
| SV-5 | `sv5-job-card-mockup.html` | Job Card ช่าง (กรอกอาการ+แก้ไข) | `งานช่าง → ส่งงาน/รออะไหล่/รอสั่งอะไหล่` |
| SV-3 | `sv3-spare-part-issue-mockup.html` | เบิกอะไหล่จาก**สต็อก** | `PendingApproval → Issued` |
| **SV-Order** 🆕 | `sv-order-parts-request-mockup.html` | **สั่งอะไหล่** (ไม่มีในสต็อก · spawn PO-4) | `สั่ง → จ่าย → รอรับ → นัด → คืนของเก่า` |
| **SV-4** (refactored) | `sv4-service-close-mockup.html` | ใบรับสินค้าจากงานซ่อม (admin pricing + Vendor billing) | `รอส่งคืนลูกค้า` |
| **SV-7** 🆕 | `sv7-service-delivery-mockup.html` | ส่งงานลูกค้า (เซ็น+QR+Invoice+ปิดงาน) | `ปิดงาน (เรา-ลูกค้า)` |
| SV-6 | `sv6-delivery-install-mockup.html` + 2 sub | Delivery & Install (งานติดตั้งสินค้าใหม่ · แยก loop) | — |
| CL-1/2/3 | `cl1-claims-mockup.html` (CL-2/3 ยังไม่มี) | ⏳ Phase 2 deferred (BC365 audit) | — |

### Design guide compliance (2026-04-23)
- ใหม่ทั้ง 3 ไฟล์ + SV-3 redesign: 7-section ERP form pattern · status-badge hex `#BFBFBF/#C55A11/#4472C4/#375623/#C00000/#00B050` · bilingual `label + .en` · sticky `.footer-actions` · SC5 doc-chain · SC7 timeline tab · numeric `.num` class
- Reference: `ui_design_pattern_guideline.md` (ผู้ใช้สั่ง Q1 · 402 บรรทัด)

## Previous Focus (2026-04-19)
- **Payment QR 2 ชั้น ✅ NEW 2026-04-19** — Tier-A 5 ใน `swt-link.js` (~260 บรรทัดเพิ่ม)
  - **ชั้น 1 — Customer QR (modal)** — ปุ่มม่วง `📱 QR` auto-inject ข้างทุก `[data-customer-search]` (9 หน้า: SL-1/2/3/4, SV-2/3, WHR + MD-2 combo)
    - Modal: picker · Biller ID (099-4-12345-6) · Ref1 = รหัสลูกค้า · Ref2 = YYMM · amount mode (ว่าง/ค้างรวม/ระบุ) · PNG / Copy / ส่ง LINE
  - **ชั้น 2 — Invoice QR (inline card)** — helper `swtRenderInvoiceQR()` · ฝังใน SL-3 (มัดจำ ฿30,000) + SL-4 (ยอดคงเหลือ ฿24,385)
    - Ref1 = เลขที่บิล · Ref2 = CustCode · ยอด fix
    - `@media print` — เก็บ QR พิมพ์บนกระดาษได้ clean (hide ปุ่ม, border ดำ)
  - Payload mockup = URL (`pay.sangwijit.co.th/c/...` หรือ `/d/...`); prod → EMVCo PromptPay ผ่าน BC API
  - Sidebar rollout FI-1Q entry ✅ — 65 ไฟล์ได้ entry ใหม่ (Python script idempotent)
- **FI-1Q Apply Queue ✅ NEW 2026-04-19** — หน้าใหม่ `fi1q-apply-queue-mockup.html` (+หน้าใหม่ที่ 66)
  - 3 categories: 🟢 Auto-ready (Ref1+ยอดตรงเป๊ะ 1-click) · 🟡 Partial (FIFO/เกินยอด/ปิดหลายบิล) · 🔴 Unmatched (Ref1 ผิด/ไม่มี/advance ก่อนบิล)
  - Link จาก FI-Q (AR card: "📥 23 รอจัดสรร") + FI-1 topbar ("📥 Apply Queue 23")
  - DOC_MAP `URC` / `UAR` → fi1q · doc-chain: QR → URC → RV → INV
  - Flow: ลูกค้าสแกน QR → เงินเข้าบัญชี → IA-Q sync bank statement → สร้าง URC → เข้าคิวนี้ → Auto-apply หรือจัดสรรเอง → BC post RV ปิด AR
- **Tier-A 1+2+3+4 ✅** — `swt-link.js` shared component (~430 บรรทัด)
  - **Universal Doc Linker** — ทุกข้อความที่ตรง pattern `PREFIX-YYYY-####` (QT/SO/INV/PO/GRN/RV/JOB/RFQ/CRD/...) จะกลายเป็นลิงก์อัตโนมัติ
  - **Embedded SC-7 Timeline + Breadcrumb** — ฝังใน **16 หน้า transaction**:
    - งานขาย: SL-1, SL-2, SL-3, SL-4, SL-F1
    - จัดซื้อ: PO-1, PO-2, PO-3, PO-4
    - คลัง: WH-1, WH-2, WHR
    - บริการ: SV-1, SV-2
    - การเงิน: FI-1, FI-2
  - **Cross-module Doc-Chain Breadcrumb** — bar ใต้ topbar, current/pending/jump states
  - **Global Search palette** — hotkey `/` หรือ `Ctrl+K` · ค้น Doc No. + เมนู + mock customers/items · arrow keys
  - **Rolled out 65 หน้า** ✅ NEW 2026-04-17 — ทุก HTML root file มี `<script src="swt-link.js">` แล้ว (Python loop, idempotent)
- **Add-Item Standardization ✅ 2026-04-17 + ขยาย 2026-04-18** — Pattern: ถ้าหน้าใดเพิ่มสินค้าได้ ใช้ icon 🔍 + attribute `data-item-search` → auto-wire ของ SC-2 modal ผูก `openItemSearch()` ให้อัตโนมัติ
  - เปลี่ยน `+`/`➕` → 🔍 ใน 5 ไฟล์ (sl4 add-row, sl6 promo, wh2 transfer, poq queue, sv3 spare-part)
  - **เพิ่ม `<tr class="swt-add-line">` ใต้ tbody ใน 8 ตารางใหม่** ✅ 2026-04-18: sl1, sl2, po1, po4, wh1, whr (1 ตาราง each) · sv2 (2 ตาราง). PO-1 ใช้ header "SKU/PSI/ขอสั่ง" — audit รอบแรกเลยไม่จับ, แก้แล้ว
  - **รวม 13 หน้าที่กด 🔍 เปิด SC-2 modal ได้** — sl1, sl2, sl4, sl6, po1, po4, poq, wh1, wh2, whr, sv2, sv3 และอื่นๆ ที่มี data-item-search
- **Line-editable + Search-Combo Pattern ✅ NEW 2026-04-18** — ทุก transaction page ที่มี line item:
  - **Header:** ลูกค้า/Vendor field แรก เป็น `<div class="swt-search-combo">` (textbox + ปุ่ม 🔍) · attr `data-customer-search` / `data-vendor-search` → เปิด global palette
  - **Line items:** จำนวน (input number class=line-input qty), หน่วย (select class=line-select), ราคา (input text class=line-input price), คลัง (select class=line-select) — editable ได้ทุก row
  - **Add-row:** `<tr class="swt-add-line">` เปลี่ยนเป็น swt-search-combo (textbox + ปุ่ม 🔍 ค้นหาสินค้า · Enter key ก็เปิด modal)
  - **Shared CSS + JS:** ย้ายเข้า `swt-link.js` แล้ว (ไม่ต้อง inline ในแต่ละไฟล์)
  - **หน้าที่ rollout:** SL-1/2/3/4, PO-1/3/4, WH-1/2, WHR, SV-2/3 (11 หน้า) · โอนย้าย (WH-2) ไม่มีราคา, มี FROM/TO คลังอยู่แล้ว
- **Tier-B ✅ NEW 2026-04-17**
  - **PO-2 RFQ / Vendor Compare** — เปรียบ 3 vendor side-by-side (ราคา/lead time/payment/QC/rebate), score 0-100, line-item compare, award → สร้าง PO + route ผ่าน CF-2.6
  - **SL-F1 Credit Approval** — แยกจาก AP-1; queue เฉพาะ SL ที่เกินวงเงิน/ลูกค้าค้าง · credit gauge + AR aging + workflow tier 1→2→3 · enforce Maker ≠ Checker
  - sidebar nav อัปเดตทุกไฟล์: SL group 11→12 entries, PO group 5→6 entries
  - DOC_MAP เพิ่ม `RFQ`, `CRD`, `CRA`
- **index.html** (master index v2.0) — sidebar collapse 13 groups · live search · BC365 matrix · 64 pages
- **Unified sidebar rolled out** → ทุกหน้า mockup ใช้ sidebar เดียวกัน (auto-inject ด้วย Python script, idempotent)
- **Tier-1 new mockups (2026-04-17)** — 4 หน้าใหม่ปิด gap critical:
  - **FI-13 Dual-Book / Entity Tag** ✅ NEW — Tag 1/2/3/novat allocation · ห้องหลัก+ห้องภาษี · ภพ.30 แยกบริษัท
  - **IA-Q BC Sync Monitor** ✅ NEW — Entity sync grid · Live feed · Error queue · Batch schedule
  - **PM-5 VAT Simulator** ✅ NEW — Golden Rule sandbox · ถูก vs ผิด side-by-side · Discount vs Rebate
  - **FI-Q Finance Queue** ✅ NEW — 6 queue cards (AR/AP/Tax/WHT/JV/Close) · Aging · SLA
- Portal Index v1.5 (ก่อนหน้า) → 60 หน้า + ของรอบนี้ 4 = 64 หน้า + FI-1Q (2026-04-19) = **66 หน้า**
- **CF-2.5 Tech Template** — 5 tabs (Job Type / Checklist / อุปกรณ์ / เวลา&ทักษะ / Safety) ✅
- **MD-2 Customer v3** — 6 details + split layout + sub-tabs ✅
- **MD-3 Vendor v3** — 6 details + Trade Agreement 4 sub-tabs ✅
- **MD-4 Employee v3** — 6 details + leave sub-tabs + KPI ✅
- **MD-5 Warehouse v3** — branch cards + 6 details + bin layout ✅
- **BC365 Audit** — ตรวจครบ 39 หน้า จัด 4 กลุ่ม ✅
- MD-1 v3 / CF-2 Hub / CF-2.6 / CF-2.7 / etc. — ✅ เสร็จก่อนหน้า

## Decisions Confirmed
- **CF-2 Structure**: Option C = Hub + sub-pages (ปรับหลัง audit)
- **CF-2.4 Bin Policy** → อยู่ CF-2 (เพราะเป็น config ไม่ใช่ transaction)
- **CF-2.5 Tech Template** → อยู่ CF-2 (🟢 BC ไม่มี — ทำเอง)
- **CF-2.7 Doc Template** → ทำเองใน Portal 100% (🟢 BC ไม่มี)
- **CF-2.9 General System Parameter** → เพิ่มเป็นข้อที่ 9 (global)
- **Date format** → ใช้ ค.ศ. (YY = 26) ไม่ใช่ พ.ศ.
- **Running reset** → ทุกเดือน (YYMM เปลี่ยน → running กลับ 0001)
- **หลักการ**: แยก Config (admin-only) ออกจาก Transaction (staff)

### BC365 Audit Decision (2026-04-16)
- 🔴 **ตัด 5 หน้า (ใช้ BC ตรง)**: CF-2.1 Tax, CF-2.2 Number Series, CF-2.3 Posting & GL, CF-2.4 Bin Policy, CF-2.9 General Parameter
  - เหตุผล: BC มี built-in ครบ, ทำ Portal ซ้ำ = double maintenance + sync risk
  - mockup ที่ทำแล้วเก็บเป็น reference "ตั้งค่าที่ BC หน้าไหน"
- 🟡 **18 หน้า Portal เป็น UI layer**: เรียก BC API, ไม่ duplicate logic
- 🟢 **21 หน้า Portal ทำเอง 100%**: BC ไม่มีฟังก์ชันนี้
- ⚠️ **เลื่อน Phase 2**: CL-1 Claims, SM-3 Vendor Portal, CF-2.8 Entity Tag

### BC365 Mapping — SV Phase 3 expansion (2026-04-27)
- 🟢 **SIR ใบประเมินหน้างาน** = Portal-owned 100% — BC ไม่มี Site Inspection Report concept · เป็น process ภายในของศูนย์บริการก่อน quote
- 🟢 **SQT ใบเสนอราคางานบริการ** = Portal-owned 100% — BC Service Quote มี (Service Module) แต่ Portal ทำเองเพราะ markup logic + customer confirmation flow ของ Sangwijit เป็น custom (มัดจำ 50% + Apply Queue + LINE delivery)
- 🟡 **CLM ใบเคลม Vendor** = UI layer + BC posting hybrid — Portal track Vendor claim status (async 7 days) + ตั้ง APCN ผ่าน BC API · APCN posting + GL effect = BC owns · CLM ≠ CL-1 (ลูกค้าเคลมเข้ามา · Phase 2 deferred) — CLM = post-warranty service ที่ Sangwijit เคลมต่อแบรนด์
- **ผลรวม:** Portal-owned 21 → 23 (+ SIR + SQT) · UI layer 18 → 19 (+ CLM)

## Blockers
- ❌ ไม่มี blocker ปัจจุบัน

## Next Action (Priority Order — หลัง Tier-1 build)
1. ~~CF-2.5 Tech Template~~ ✅
2. ~~MD-2/3/4/5 v3~~ ✅
3. ~~index.html + unified sidebar~~ ✅
4. ~~Tier-1 mockups (FI-13 / IA-Q / PM-5 / FI-Q)~~ ✅
5. ~~Tier-A 1+2 (Universal Doc Linker + Embedded Timeline 6 หน้า)~~ ✅ 2026-04-17
6. ~~Tier-A 3 (Cross-module Doc-Chain Breadcrumb)~~ ✅ 2026-04-17
7. ~~Tier-A 4 (Global Search palette + hotkey)~~ ✅ 2026-04-17
8. ~~Tier-A rollout — `swt-link.js` 65 หน้า~~ ✅ 2026-04-17
9. ~~Tier-B PO-2 RFQ + SL-F1 Credit Approval~~ ✅ 2026-04-17
10. ~~Customer QR + FI-1Q Apply Queue~~ ✅ 2026-04-19
11. ~~Sidebar rollout FI-1Q entry~~ ✅ 2026-04-19 (65 ไฟล์)
12. ~~Invoice QR ชั้น 2 (SL-3/SL-4)~~ ✅ 2026-04-19
13. **ขยาย Invoice QR** — ฝังบน SV-2 (บริการ), PO-3 (vendor invoice reverse? — optional)
14. **Tier-A rollout เพิ่ม** — ขยาย `swt-link.js` ไปอีก ~30 หน้า (แค่ใส่ `<script src>` 1 บรรทัด)
15. **Tier-B remaining**: FI-9 Fixed Asset (เฉพาะถ้า SWT มี FA — รอ confirm)
11. **Tier-C (polish/cleanup)**:
   - Deprecate / redirect portal-mockup-index.html → index.html
   - Banner "BC Direct" บน CF-2.1/2/9
   - Update 01-module-list.md ให้ SV-3/4/5 scope ตรงกับ mockup จริง
10. **Dev handoff prep** — สรุป spec, API contract, component list
11. ~~CF-2.1 Tax~~ / ~~CF-2.2 Number Series~~ / ~~CF-2.3 Posting~~ / ~~CF-2.4 Bin~~ / ~~CF-2.9 General~~ → ใช้ BC ตรง
12. ~~CF-2.8 Entity Tag~~ → เลื่อน Phase 2

## Reference Files
- `sangwijit-portal-skill/SKILL.md` v2.1 — knowledge base (Rule 1: อ่าน Flowchart ก่อน)
- `sangwijit-portal-skill/modules/CF_config.md` — spec CF-1 ถึง CF-9
- `md1-item-master-mockup-v3.html` — pattern อ้างอิงสำหรับ detail/tab
- `cf2-config-hub-mockup.html` — pattern landing Hub
- `cf2-7-doc-template-mockup.html` — pattern sub-page + multi-tab + split layout
- `swt-link.js` — universal doc-linker + `swtAppendTimeline()` API (Tier-A shared component)

## Design Standards (Locked)
- Min width 1440px · Inter font · Sidebar #1E3A5F (240px fixed) · Accent #2563EB · BG #F8FAFC
- Collapse: `<details class="collapse">` + `▼` rotation
- Sub-tabs: JavaScript `switchSubTab()` scoped per section
- Status badges: green=ยืนยัน / amber=พิจารณา / gray=ไม่แน่ใจ
