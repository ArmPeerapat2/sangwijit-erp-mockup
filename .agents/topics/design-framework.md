# Design Framework — Sangwijit ERP Portal (single source)

> เริ่ม 2026-05-30. แก้ 3 ปม: CSS ไม่ตรง · เมนูเยอะ/ซ้ำ · shared-component อ้างอิงไม่สม่ำเสมอ.
> ใช้คู่กับ: `reconcile-mockup-vs-flow-matrix.md` (เมนู/scope) · `dev-handoff-spec.html` (catalog) · `swt-link.js` + `swt-patterns.css` (shared runtime).

## 1. Design Tokens (locked)

| token | ค่า |
|---|---|
| Min width | 1440px |
| Font | `Inter, 'Noto Sans Thai', sans-serif` |
| Sidebar | `#1E3A5F` · กว้าง 240px fixed (`.swt-sb`) |
| Accent | `#2563EB` |
| Background | `#F8FAFC` |
| Main-header | `linear-gradient(135deg,#1E3A5F 0%,#2563EB 100%)` radius 12 |
| Card | white · radius 12 · `box-shadow:0 1px 3px rgba(0,0,0,.1)` · padding 24 |
| Status badge | เขียว=ยืนยัน · เหลือง=พิจารณา · เทา=ไม่แน่ใจ |
| Status hex (ERP form) | `#BFBFBF/#C55A11/#4472C4/#375623/#C00000/#00B050` |
| วันที่ | ค.ศ. (YY=26) · จำนวนเงิน comma + 2 ทศนิยม |
| Section label | `[PAGE]-[N] [emoji] ชื่อ` (เช่น `FI-7.3 📤 รายงานภาษีขาย`) |

## 2. Page Shell Standard (ยึดแบบ fi3-bank / fi7)
ทุกหน้า transaction ใช้โครงเดียว:
1. `<div class="main-header">` gradient + `mh-status-track` (step pills) + `mh-docno` + `mh-status`
2. `<!-- SWT_SIDEBAR_START/END -->` = unified `.swt-sb` (auto-inject, filename = active)
3. body = `.card` sections มี section label `[PAGE]-[N]`
4. `.sticky-action-bar` (left=docno/info · right=actions + BC note)
5. `<!-- SWT_LINK_START/END -->` = include `swt-link.js` + `swtRenderBreadcrumb` + `swtAppendTimeline`
6. **ต้อง include `swt-patterns.css`** (ปัจจุบันขาด 54/79 ไฟล์ — rollout ค้าง)

**เลิกใช้:** page shell เก่า `.page-title`/`.menu-item` (31 ไฟล์ยังเป็นแบบเก่า → ทยอย migrate)

## 3. Shared-Component Contract (swt-link.js auto-wire)
ใส่ attribute → `swt-link.js` wire ให้อัตโนมัติ (ไม่ต้องเขียน JS ซ้ำ):

| ต้องการ | ใส่ใน HTML | swt-link ทำให้ |
|---|---|---|
| ค้นหา **ลูกค้า** | `data-customer-search` บน input/ปุ่ม | เปิด global palette (ลูกค้า) + **auto-inject ปุ่ม Customer QR** |
| ค้นหา **สินค้า** | `class="swt-item-input"` (input) หรือ `data-item-search` | เปิด SC-2 item search modal |
| ค้นหา **Vendor** | `data-vendor-search` | เปิด palette (vendor) |
| สแกน **บาร์โค้ด** | `data-barcode-scan` | เปิด barcode modal |
| **Invoice QR** | `swtRenderInvoiceQR('mountId',{...})` | render QR inline |
| **Doc-chain บน** | `swtRenderBreadcrumb([{type,no,label,current}])` | breadcrumb strip |
| **Timeline ล่าง** | `swtAppendTimeline(title,[...],{meta})` | SC-7 doc chain |
| **Global search** | (auto) | Ctrl+K / `/` |

**กฎ:** หน้าใดมี field ลูกค้า/สินค้า/vendor → **ต้องใส่ attribute ให้ครบ** (ปัจจุบัน `data-customer-search` แค่ 3 ไฟล์ · `data-item-search` 61 ไฟล์ — ลูกค้า under-wired)

**SC source pages:** SC-1 ลูกค้า · SC-2 สินค้า · SC-7 timeline · SC-10 map

## 4. Canonical DOC_MAP (prefix → หน้า · แก้แล้ว 2026-05-30)
อยู่ใน `swt-link.js` `var DOC_MAP`. เพิ่ม prefix ใหม่ต้องชี้หน้าจริงเสมอ.

- **Sales:** QT/QUO→sl1 · RES→sl2 · DPS/DEP→sl3 · SO/INV/BIL→sl4 · CRM→sl5 · PROMO→sl6 · CRD/CRA→slf1
- **Purchase:** PR→po1 · RFQ→po2 · PO→po4 · VBL/VINV→po6 · REB→po7
- **Warehouse:** GRN/REC→wh1 · TRN/TRF→wh2 · STK/CNT→wh4 · GIS/ISS→wh3
- **Service:** SVC/SVQ→sv-q · SIR→sir · SQT→sqt · SIN→sv4-close · SPR→sv3 · WAR→sv1-intake · JOB→sv5
- **Finance:** RV→fi1 · PAY/PV→fi2 · **TAX/VAT→fi7** · **BR→fi3-bank** · EXP→fi4 · **WHT→fi12** · JV→fi13 · URC/UAR→fi1q
- **อื่นๆ:** DLV/DEL→sv6 · APV→ap1 · CLM→clm-vendor-claim · COM→cm1

> แก้รอบนี้: TAX (fi3-tax archived→fi7) · WHT (fi4→fi12) · SVC (sv1-queue→sv-q) · SIN (sv2-invoice archived→sv4) · WAR (sv4-warranty archived→sv1-intake) · DLV (dl1 ไม่มี→sv6) · CLM (cl1→clm-vendor) · +VAT/BR/SIR/SQT

## 5. กรอบ redesign ต่อกลุ่ม (4 ชั้น)
ทำทีละกลุ่ม (เริ่ม Master) · flow-first · no batch:
1. **เมนู (de-dup)** — ยึด reconcile matrix: เหลือเมนูจริง ตัด excess/ซ้ำ
2. **ฟังก์ชัน + เงื่อนไข + user** — ลงตาราง catalog (ขยาย dev-handoff-spec 7 คอลัมน์)
3. **Design system** — migrate page shell เก่า→main-header + ใส่ swt-patterns.css ครบ
4. **Component contract** — wire ลูกค้า/สินค้า/vendor ครบ + DOC_MAP prefix ชี้หน้าจริง

## สถานะ foundation
- ✅ DOC_MAP ซ่อมแล้ว (swt-link.js)
- ✅ swt-patterns.css ครบ **78/78 ไฟล์** (rollout 2026-05-30 · verified โหลด + layout ไม่ overflow)
- ⏳ page shell เก่า (page-title) 31 ไฟล์ รอ migrate (ทำตอน redesign กลุ่ม)
- ⏳ data-customer-search under-wired (3 ไฟล์ · เติมตอน redesign กลุ่ม)
