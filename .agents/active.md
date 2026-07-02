---
updated_at: "2026-07-02T03:00:00+07:00"
status: "active"
current_focus: "🏭 **Service Job-Type Model + Claim Decompose (grill locked 1 ก.ค.)** — ดู **`.agents/svc-claim-jobtype-spec.md`** (design record ครบ Q1-Q15). หัวใจ: **CL-1 ไม่เป็น module แยก · claim = job type ใน service-intake** · service form = skeleton · 5 job types (ซ่อม·เคลม·ติดตั้ง·ตรวจเช็ค·ล้าง · ตัดจัดส่ง) แต่ละอัน toggle extension. **BUILT:** เคลม popup ใน `bc365/service-intake-mockup.html` (trigger=ประเภทงาน=เคลม · 5 sections · cost BINARY vendor/SWT). **TO-BUILD:** ติดตั้ง inline section · shared checklist section (ตรวจเช็ค+ล้าง) · job-type toggle · SL-4 repoint SV-1. Phase 2 done ก่อนหน้า: CF-2.6·CF-2.7·CL-1 v2·PM-1. **ก่อนหน้า:** Phase 1 ✦ 56 หน้าปิด. ⚠️ no-localhost-build · ห้าม bash sed OneDrive (PowerShell+negative lookbehind) · Archive on Rebuild · Feature Parity Audit · claim=job type ไม่ใช่ source · cost=binary ไม่ใช่ % · อ้างของเก่า/ใหม่ระบุ path"
branch: "main"
project_type: "frontend-mockup (HTML + docs)"
---

## 🌙 HANDOFF — ล่าสุด (2026-06-11)

**chain ปิดแล้ว (procure-to-pay):**
```
PO-1 ใบขอสั่งซื้อ (PR) → PO-4 ใบสั่งซื้อ (PO) → WH-1 ใบรับสินค้า (GRN) → PO-3 ใบวางบิล Vendor (VBL) → PO-6 ใบตั้งหนี้เจ้าหนี้ (AP) → FI-2 จ่ายชำระเจ้าหนี้ (AP) → FI-Q คิวงานการเงิน (แผง AP)
```
+ PO-7 สรุปงบจัดซื้อ · PO-CN ใบลดหนี้เจ้าหนี้ · PO-8 บิลฝาก (Deposit Pool) · AP reduction ผ่าน PO-6 ใบตั้งหนี้เจ้าหนี้ picker

**✦ DONE (`swt-sidebar.js`):** SL-Q/1~4/CN · PO-1/**2**/**3**/4/6/7/8/CN · WH-1 · SC-3 · **FI-1/2** — ทุกหน้าอัปเดตเทมเพลตหลักแล้ว (ยกเว้น SC-3 = picker) · PO-2 Trade Agreement ติด ✦ 2026-06-14 · **PO-3 ใบวางบิล Vendor** ติด ✦ 2026-06-14

**ทำเสร็จล่าสุด (2026-06-13):**
- **SL-4 บิลขาย — โหมดยิงเปิดบิลเร็ว (scan/คีย์ลัด)** — `sl4-invoice-mockup.html` (archive `_archive/sl4-invoice-mockup-2026-06-13.html`) · เพิ่ม **hotbar คีย์ลัด** ใต้ SAAB · `tplScan()` ทำงานจริง (ยิงตัวเดิม=+qty · ตัวใหม่=เติมแถวว่าง · toast + row-flash) · catalog จำลอง `SCAN_CAT` · **คีย์ลัด global** F2 กลับช่องยิง / F4 SC-2 เพิ่มสินค้า / F6 SC-1 ลูกค้า / F7 SC-5+ อ้างอิง / F8 SC-3P ชำระเงิน / F9·Ctrl+Enter Post / Esc · auto-focus ช่องยิงตอนโหลด · live recalc → re-render SC-11 สรุปยอด · แตะไฟล์เดียว ไม่ยุ่ง shared → ไม่ต้อง chain regression

**ทำเสร็จล่าสุด (2026-06-10~11):**
- **✦ Batch เทมเพลตหลัก (2026-06-11)** — ทุกหน้า ✦ ใน `swt-sidebar.js` DONE[] ยกเว้น SC-3 picker: unified-header · saab-compact · SC-12/Gate แยก · dc-strip ⑤ · split docChain JS · `swt-sc-wire.js` wireStandardMounts + compact payment SL-1/2/3
- **Header ย่อ (SL-4 + template)** — `unified-header` รวม topbar+main-header · SAAB `saab-compact` · SC-3P `compact:true` ชำระเงิน fit row-bottom · Doc Chain ⑤
- **100vh overflow fix** — `swt-patterns.css` §④c: เอา `min-height:340/300px` ออก · ใช้ `flex:1 1 0` + `min-height:0` · `row-bottom` 136px · `gap` 8px · scroll ใน `items-wrap` เท่านั้น · ทด 1440×900/768 ผ่าน FI-1/SL-4/FI-2/PO-4/SL-3
- **FI-1 รับชำระลูกหนี้** rebuild บนเทมเพลต · mirror FI-2 · archive `_archive/fi1-ar-receive-mockup-2026-06-11.html`
- **FI-2 จ่ายชำระเจ้าหนี้** rebuild บน `_form-template` · chain ไป FI-Q · archive `_archive/fi2-ap-payment-mockup-2026-06-10.html`
- **FI-Q** sync AP panel · แถว AP-2606-0088 · modal chain · ปุ่ม→FI-2
- **SC-11 (สรุปยอด) + SC-12 (สถานะ)** ✅ `swt-patterns.js` · wire SL-4 · PO-4 · WH-1 · FI-2 · PO-6 · `#*Sc11`=summary · `#*Sc12`=status
- **SC-5+** ✅ `dfOpenRef({docType})` โปรไฟล์ SL/PO/WH/FI · wire SL-4 · PO-4 · WH-1 · `dfRefPull()`
- **SC-14** ✅ `swt-ap-reduce.js` · wire PO-6
- **SC Sprint Build ปิด** ✅ `swt-sc-modals.js` (10/13/15/16/18) · `swt-panels.js` (3P/4/6/8/17) · `swtBcTooltip` · `sc-shared-catalog-mockup.html`
- **Docs:** ตัดประวัติยาว · `chain-regression-checklist.md` + `shared-components-status.md` · Blueprint Step 0
- **Menu IA:** เพิ่ม `menu-grouping-old-new-mapping.md` (mapping เมนูเก่า/ใหม่ + ไฟล์ปลายทางสำหรับ sidebar final)
- **Sidebar Final IA:** ปรับ `swt-sidebar.js` ตามกรุปใหม่ (รายงานอยู่ใต้แต่ละสายงาน) + badge `เก่า/ใหม่` + ย้ายกลุ่มศูนย์กลางระบบ
- **Sidebar Toggle:** เพิ่มปุ่ม `ซ่อนไม่มี✦` (done-only) ใน `swt-sidebar.js` + จำสถานะด้วย `localStorage`
- **PO-2/PO-7 alignment:** เน้น `PO-2` เอกสารแนบหลักฐาน (ไม่อ้างอิงบิล) + `PO-7` ดึงรายการ+หลักฐานจาก PO-2 ก่อน Realize
- **PO-2 layout tune:** รวม `PO-2.2/2.4` เป็นกลุ่มเดียว + `PO-2.3` เป็นตารางสไตล์ลิสต์แบบ `SL-4.3` (คงเนื้อหาเดิมตาม type)
- **PO-2 wording cleanup (2026-06-12):** ตัดคำ `VC` ออกจาก UI ของ **PO-2 Trade Agreement / Vendor** → ใช้คำ `ข้อตกลง` + เลขเอกสาร `AG-*` ให้ตรงเทมเพลทกลาง
- **PO-2 + PO-7 flow refine (2026-06-12):** `PO-2` ปรับ line list ตาม type (MOU/Sell-in/Sell-out = กรอบยอดซื้อแบบ filter ประเภท/ยี่ห้อ/หมวด/สินค้า, Co-op = บันทึกความเข้าใจ) + อัปโหลดหลักฐานภาพ/PDF/DOC + เซ็นยืนยันแบบพิมพ์แนบไฟล์หรือส่งลิงก์เซ็นในระบบ; `PO-7` ปรับเป็นดึง `PO-2` ทีละ 1 ข้อตกลง + ช่อง `Adj` กรอกมือ + สรุปยอดส่ง `PO-6` ตามยอดหลังปรับ
- **PO-2 popup standard + PO-7 two-pull list (2026-06-12):** `PO-2` เปลี่ยนปุ่มเอกสารหลังอัปโหลด/หลักฐานเซ็นให้เปิด popup มาตรฐาน (`modal-overlay`) เพื่อดูไฟล์ในหน้าต่างเดียว; `PO-7` บังคับดึงข้อมูล 2 ชั้น (① ดึง PO-2 ② ดึงยอดจริงซื้อ/ขายตามช่วง+สินค้า) และแสดงลิสต์แบบสินค้าเมื่อเป็น MOU/Sell-in/Sell-out ส่วน Co-op แสดงลิสต์บันทึกความเข้าใจ
- **PO-2 template layout alignment (2026-06-12):** ปรับโครงหัวฟอร์มของ `PO-2 Trade Agreement / Vendor` เป็น `unified-header` + `saab-compact` ตามเทมเพลทกลาง และย้ายหน้าจอเป็น fixed shell (`height:100vh`) โดยให้ scroll ภายใน content wrapper
- **PO-2 screen-fit fix (2026-06-12):** ปรับขนาด shell/spacing ของ `PO-2 Trade Agreement / Vendor` ให้พอดีจอมากขึ้น (ลด `min-width` เป็น 1280, ปรับ `saab` ให้ไม่ยุบ, ลด padding content, และให้ status strip wrap ได้) เพื่อแก้ปัญหาหน้าไม่พอดีจอคอม
- **PO-2 de-duplicate sections (2026-06-12):** ลบ `PO-2.6` และ `PO-2.7` ออกจากหน้าเพราะข้อมูลซ้ำกับการ์ด `ข้อมูลสัญญา & ผู้รับผิดชอบ` เพื่อให้หน้าเบาและพอดีจอมากขึ้น
- **PO-2 compact layout pass (2026-06-12):** ย่อการ์ด `Vendor (คู่สัญญา)` และ `ข้อมูลสัญญา & ผู้รับผิดชอบ` ให้เหลือสรุปไม่เกิน 3 บรรทัด, ตัดแถบ `SC11` ออก, ย่อ `PO-2.2/PO-2.4` เป็น compact 2 บรรทัด และลด `PO-2.5` เป็นขั้น flow เอกสารแบบย่อ
- **PO-2 full rebuild บนเทมเพลต (2026-06-12):** สร้าง `po2-rfq-mockup.html` ใหม่แทนตัวเดิม (archive `_archive/po2-rfq-mockup-2026-06-12.html`) — โครง `_form-template` เต็ม (unified-header · saab-compact · SC-12 strip · items-card 100vh · row-bottom tabs+สรุป · dc-strip) · **PO-2.1** Vendor ใช้ SC-3 `dfOpenVend()` · **PO-2.3** เปลี่ยนเป็น line สินค้าจริง (SC-2 `dfOpenProd()` + ⚡ Filter Scope modal แตกรายสินค้า) · **ส่วนลด 3 แบบเลือกรายบรรทัด** (①ลดบาท/ตัว ②ลด% — แถวจาก scope ③ลด+โควต้า บังคับกรอก · หน่วยโควต้าเลือก ตัว/บาท) · ฟิลด์รายบรรทัด: รายละเอียดบิล/เลขอ้างอิง/วันที่/โควต้า/ลด฿/ลด%/ราคาหลังลด · Co-op สลับเป็นตารางบันทึกความเข้าใจ · PO-2.4 หลักฐาน (ภาพ/ประกาศโปรโมชัน) + PO-2.5 เซ็นยืนยัน ย้ายลง row-bottom tabs · popup มาตรฐานคงเดิม · dc-strip "ใช้อ้างอิงโดย" → PO-7 สรุปงบจัดซื้อ → PO-6 ใบตั้งหนี้เจ้าหนี้ (AP) · ไม่แตะ `swt-sidebar.js`/`swt-doc-finder.js` (ไม่ต้อง chain regression)
- **Header audit + fix ทุกหน้า (2026-06-12):** สแกน 88 ไฟล์ root — พบบั๊ก `uh-utility` ไม่ปิด (`</div>` หาย 1 หลัง topbar-avatar ทำให้ uh-main ซ้อนผิดชั้น) ใน **8 หน้า unified-header**: SL-Q คิวงานขาย · SL-CN ใบลดหนี้ · PO-1 ใบขอสั่งซื้อ (PR) · PO-6 ใบตั้งหนี้เจ้าหนี้ (AP) · PO-CN ใบลดหนี้เจ้าหนี้ · WH-1 ใบรับสินค้า (GRN) · FI-1 รับชำระลูกหนี้ · FI-2 จ่ายชำระเจ้าหนี้ (+ PO-7 แก้ไปก่อนแล้ว) → **แก้ครบ 8 หน้า ตรวจซ้ำ div บาลานซ์ผ่านหมด** · ⚠️ ตกค้าง: `poq-purchase-queue` div ปิดเกิน 2 · `wh-queue` เปิดค้าง 1 (นอก header) · `po8-deposit-bill` ไม่มีแถวว่าง ④c (0 แถว — ผิดกติกา ≥10) · ④b ยังเป็น field-grid-2 ทุกหน้า ยกเว้น FI-1 → ไล่ปรับ mini-line ทีละหน้า
- **PO-7 layout fit pass (2026-06-12):** ซ่อม `unified-header` ที่ div ไม่ปิด (`uh-utility` ค้าง → uh-main ซ้อนผิดชั้น) · PO-7.1 ย่อเล็ก (0.75fr) / PO-7.2 ขยาย (1.55fr) — การ์ดละ 3 บรรทัดแบบ `mini-line` ตามกติกา party card · PO-7.3 เติมแถวว่างขั้นต่ำ 10 บรรทัด (`po7PadRows`)
- **PO-7 sync PO-2 ใหม่ + บิลอ้างอิงยอดจริง (2026-06-12):** ปรับ `po7-rebate-dashboard.html` (archive `_archive/po7-rebate-dashboard-2026-06-12.html`) — data ข้อตกลง sync line PO-2 ใหม่ (AG-SI = 5 รายการ: RF-1001/RF-1005 แบบ① · TV-3002 แบบ③ โควต้า 50 ตัว · AC-2001/AC-2008 แบบ② ⚡scope) · เพิ่มคอลัมน์ **แบบส่วนลด (PO-2)** + **โควต้า ใช้/ทั้งหมด** (เกินโควต้า = เตือนแดง ตัดสิทธิ์) · **สิทธิ์ส่วนลดคำนวณอัตโนมัติ** ตามแบบ (①③=฿×จำนวนจริง ③cap โควต้า · ②=%×ยอดจริง) แทนเป้า fix · **แหล่งยอดจริง auto ตามประเภท**: MOU/Sell-in = ยอดซื้อ (WH-1 ใบรับสินค้า / PO-8 บิลฝาก) · Sell-out = SL-4 บิลขาย · ปุ่ม **📄 N บิล ต่อแถว → popup มาตรฐาน** ลิสต์บิลอ้างอิง (เลขที่คลิกเปิดเอกสารต้นทาง) · ตัด dropdown แหล่งยอดจริงเดิม · คง 2-step pull + ยอดบริษัทจ่ายจริง + Co-op memo + Sanction
- **PO-7 doc parity + company confirm docs (2026-06-12):** คงหลักว่าเอกสาร PO-7 เทียบเท่า PO-2 และเพิ่มเอกสารยืนยันยอดจริงของบริษัท, เปลี่ยนช่องกรอกมือเป็น `ยอดบริษัทจ่ายจริง`, และยืนยันยอดส่ง PO-6 ตามยอดยืนยันจริง
- **PO-3 ใบวางบิล Vendor rebuild (2026-06-14):** เปลี่ยน PO-3 จาก Vendor Onboarding → **รับวางบิล AP (VBL)** · โหมดเลือก **ทั้งบิล (GRN/PO)** + **รายการ (SKU)** · ฟิลเตอร์บิล (PO/GRN/สถานะ/วันที่) · Onboarding ย้ายไป **MD-3 ทะเบียน Vendor** · sync `swt-link.js` VBL/VINV → po3 · chain WH-1 → PO-3 → PO-6 → FI-2 · `module-flow-overview.html` อัปเดต

**✅ SC Wire phase ปิด (2026-06-11):** `swt-sc-wire.js` ผูก runtime เข้า chain ทั้งหมด (SL-1~4/CN · PO-1/4/6/8/CN · WH-1 · FI-2)

| ลำดับ | SC | Build | Wire | แนวทางกลาง | หมายเหตุ |
|---|---|---|---|---|---|
| — | SC-1/2/3/7 | ✅ | ✅ chain | ✅ | picker + timeline |
| — | SC-11/12 | ✅ | ✅ chain | ✅ | migrate หน้าเก่า + mount หน้า rebuild |
| 2 | SC-5+ | ✅ | ✅ chain | ⬜ | dfOpenRef ทุกหน้า rebuild |
| 3 | SC-14 | ✅ | ✅ PO-6 | ⬜ | `swt-ap-reduce.js` |
| 4~10 | SC-15…19 | ✅ | ✅ chain | ⬜ | print/3way/bank/panels/serial/tracking |
| — | SC-9 | — | 🟡 inline | ⬜ | รอ promo panel แยก |

**ถัดไป:** WH-3 · Chain C regression (FI-1 ✅ 2026-06-11 · PO-2 rebuild ✅ 2026-06-12)

**แนวทางพัฒนากลาง (locked):** ฟอร์ม rebuild ใหม่ → ใช้ SC runtime ก่อนเขียน inline ซ้ำ · คุย SC ทีละตัว → อ่าน `shared-components-status.md` **§0.1** (คำอธิบาย+ฟิลด์)

**🔖 เคลม (CLM):** domain SV · defer · เชื่อม CLM→PO-CN ไว้แล้ว

## กฎชื่อเต็ม (locked 2026-06-11)

**ทุกครั้งที่อ้างรหัสโมดูล/เอกสาร — ต้องมีชื่อเต็มคู่กันเสมอ** (Catalog · sidebar · doc-chain · regression · คำตอบ agent · checklist)

| ห้าม | ต้องเป็น |
|---|---|
| SL-4 | **SL-4 บิลขาย** |
| PO-6 | **PO-6 ใบตั้งหนี้เจ้าหนี้ (AP)** |
| FI-2 | **FI-2 จ่ายชำระเจ้าหนี้ (AP)** |
| WH-1 | **WH-1 ใบรับสินค้า (GRN)** |
| SC | **SC (Shared Components · ส่วนกลาง UI)** |

ยกเว้น: เลขเอกสารล้วน (AP-0088 · GR-0210) ไม่ต้องซ้ำชื่อโมดูล

## Working Rules (locked 2026-05-29)

- **Flow-first, always.** ทุกงานปรับดีไซน์: (1) แสดง flow → (2) confirm → (3) แก้ mockup. ห้าม batch หลายหน้า
- **Canonical source = Flow Design + module spec** (ADR-0001). รหัสเพี้ยน = แก้ที่ mockup
- **Glossary** อยู่ที่ `CONTEXT.md` (root)

### Working Rules เพิ่ม (locked 2026-05-30)
- **Docs-first:** ยึด DD + Flow PDF + spec · HTML = reference เท่านั้น
- **ทำทีละ flow ให้เสร็จ** · ยังไม่เน้น dashboard
- **ทุกข้อเสนอเปลี่ยน = ตารางเทียบ ของเก่า ↔ ใหม่** ก่อนลงมือ
- **Obsidian save:** vault `C:\Users\arm99\OneDrive\claude\ArmWiki\ArmWiki\Projects\Sangwijit-ERP-Portal\`
- **🔑 Scope = SWT single-entity** · FI-13 Dual-Book / CF-2.8 Entity Tag = defer

### Working Rules เพิ่ม (locked 2026-06-06 / 11)
- **🔑 Form Build Pattern:** (1) Flow+spec → Blueprint → confirm · (2) build บน `_form-template.html` (100vh · status+doc-chain · ตาราง+grid · sidebar+✦) · (3) shared: sc1/sc2/sc3/dfOpenRef · (4) Post routing ทุกฟอร์ม (`sl-post-save-routing.md`) · (5) archive + full path
- **Form Blueprint — Step 0 Gate (locked 2026-06-11):** ก่อน Blueprint ①–⑤ — อ่าน `form-template-guideline.md` · เช็ค `swt-doc-finder.js` API · เปิด `_form-template` + reference chain · ยืนยัน Post routing · *บทเรียน PO-8: ข้าม Step 0 = พลาด fit/picker* → แล้ว Blueprint 5 ส่วน → user confirm → เขียนโค้ด
- **Chain regression:** หลังแก้ `swt-sidebar.js` / `swt-doc-finder.js` → `.agents/topics/chain-regression-checklist.md`
- **🗺️ Flow overview sync (locked 2026-06-14):** ทุกครั้งที่เพิ่มหน้า · แก้ flow/สถานะ · rebuild (ติด ✦) → ต้องอัปเดต `module-flow-overview.html` (node/สถานะ/ลิงก์/มาร์ก ✦↔เก่า) ให้ตรงเสมอ

## 🔒 PO↔WH Receiving Boundary (locked 2026-06-07)

**หลักการ: "รับสินค้า = งานคลัง (WH)" ทั้งหมด** · จัดซื้อ (PO) เก็บแค่ สั่ง + ตั้งหนี้
```
PO-4 ใบสั่งซื้อ (สั่ง Vendor)
 ├ ปกติ:    → WH-1 ใบรับสินค้า ─รับครบ flag→ PO-6
 └ บิลฝาก:  → PO-6 (โหมดบิลฝาก) → PO-8 Deposit Pool
              ├ เข้าคลัง → WH-1    └ ส่งลูกค้าตรง → SL-4 (drop-ship)
```
- **✂️ PO-5 ตัดแล้ว** — archive · redirect GRN→WH-1
- **WH-1 = ศูนย์รับ** · "รับครบ" = qty-based ทุกไลน์
- **PO-8 = Deposit Pool** · งานเรียก/รับ = ฝั่ง WH

## 🔒 AP Reduction / Trade Support Concept (locked 2026-06-08)

**ยอดหนี้เจ้าหนี้ (AP) ลดได้ 2 จังหวะ** — บนบิล (PO-6) vs หลังบิล (PO-CN)
```
PO-2 ข้อตกลงงบ ──► PO-7 สรุปได้จริง ──► PO-6 net
WH-1 (+) ────────────────────────────────┤
PO-CN ลดหนี้ ────────────────────────────┼─► PO-6
CLM → รอหักหนี้ → PO-CN ─────────────────┘
```
- **PO-6** ✅ picker 2 แท็บ: ใบแจ้งหนี้ (+) · ดึงลดหนี้/หัก (−)
- **PO-CN** ✅ · **PO-7** ✅ · **PO-2** = redo ถัดไป

## 📚 Docs & archive (2026-06-11 cleanup)

ประวัติ session 2026-04–06 ย้ายออกจากไฟล์นี้แล้ว:
- `.agents/sessions/archive/active-history-2026-04-06.md`
- `.agents/sessions/archive/session-handoff-2026-06-01.md` — **obsolete**
- `.agents/sessions/archive/2026-04-16.md` — BC365 audit (ยัง valid · สรุปใน lock แล้ว)
- `.agents/sessions/archive/sl-design-structure-2026-04-21.md` — obsolete

**ห้ามอ้าง PO-5 / PO-8 โมเดลเก่า / WH-1 แบบ queue-only** ใน archive

## 🔜 NEXT — WH Renumber (locked 2026-06-14 · ยังไม่ execute)
**ก่อนทำงานคลังทุกครั้ง อ่าน `.agents/topics/wh-renumber-plan.md` ก่อน** — จะเรียงเลข+rename ไฟล์คลังใหม่ทั้งชุด (Q=ดู · เลข=เอกสาร · R=ขอ/เตรียม · โอนไม่มีคิว)
- ใหม่: WH-1 ใบรับ · WH-2 ใบเบิก(+2R) · WH-3 ใบโอน(+3R) · WH-4 ใบนับ(+4R) · WH-Q/Q1/Q2 · WH-R
- ⚠️ เลข�