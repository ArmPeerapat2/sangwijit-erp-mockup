---
name: sangwijit-bc-mockup
description: UI/UX Design System สำหรับสร้าง mockup HTML ของ Sangwijit ERP Portal (BC365) ทุกหน้า ยึดตาม Locked design standards ใน root CLAUDE.md — #F3F4F6 bg · #2563EB primary · #1E3A5F sidebar · Inter + Noto Sans Thai + IBM Plex Mono · compact 11-13px · ค.ศ. 2-digit dates (YY=26) · bcsale UX (modal-heavy + click-to-edit). รวม Shared Components (SC-1 ถึง SC-8) เป็น self-contained SWT blocks พร้อม copy-paste. ใช้ skill นี้ทุกครั้งที่ — สร้าง mockup หน้าใหม่ (เช่น sl1-quotation, po4-purchase-order, wh1-grn, fi1-ar-receive), เพิ่ม shared component (sidebar / customer search / item search / payment), วาง layout shell, ถามเรื่อง design tokens, ทำ save flow bcsale pattern. Complement กับ sangwijit-portal-skill/ (ซึ่งเก็บ business rules + module specs) — skill นี้เน้น UI/visual/interaction เท่านั้น
---

# Sangwijit BC ERP — UI/UX Design System

> ⚠️ **สำคัญ**: skill นี้ complement กับ `sangwijit-portal-skill/SKILL.md` และ `CLAUDE.md` ของ project — อ่านทั้งสองก่อน

**Scope ของ skill:**
- ✅ UI structure, CSS, layout, shared components
- ✅ Design tokens (colors, fonts, spacing)
- ✅ UX patterns (modal, save flow, hover+pin)
- ❌ Business rules (ไปอ่าน `sangwijit-portal-skill/`)
- ❌ Module specs (ไปอ่าน `sangwijit-portal-skill/modules/<MODULE>.md`)
- ❌ Flow diagrams (ไปอ่าน `Flow Design/<Module>/Flow/*.pdf`)

---

## 🚀 Workflow สร้างหน้าใหม่

### Step 1 — อ่านก่อน (จาก root CLAUDE.md)
1. `.agents/active.md` — current focus & latest decisions
2. `sangwijit-portal-skill/modules/<MODULE>.md` — business rules ของโมดูลนี้
3. `Flow Design/<Module>/Flow/*.pdf` — flow diagram
4. **ไฟล์นี้ (SKILL.md)** — UI/UX pattern

### Step 2 — ตั้งชื่อไฟล์
Format: `{module-code}{n}-{slug}-mockup[-v<N>].html`

ตัวอย่าง:
- `sl1-quotation-mockup.html`
- `po4-purchase-order-mockup.html`
- `wh1-receive-mockup.html`
- `md1-item-master-mockup-v3.html`
- `cf2-5-tech-template-mockup.html`

**Rule (จาก CLAUDE.md Editing rules):**
- แก้ไฟล์เดิมก่อนเสมอ — อย่าสร้างใหม่
- `-v2`, `-v3` suffix เฉพาะเมื่อ user ขอ
- หน้าใหม่ทั้งหมด → ถาม user ก่อน

### Step 3 — Copy skeleton
```
cp sangwijit-bc-mockup/templates/base.html → <filename>.html
```

### Step 4 — ปรับ head + breadcrumb
- `<title>` และ page title
- Breadcrumb: `Module › Page`
- Main header icon + meta (เลขที่, วันที่, สาขา)

### Step 5 — เขียน content + inject SWT blocks
ก่อน `</body>` วาง 3 SWT blocks จาก `assets/`:
- `<!-- SWT_SIDEBAR_START -->...<!-- SWT_SIDEBAR_END -->`
- `<!-- SWT_PAY_START -->...<!-- SWT_PAY_END -->` (ถ้าหน้าต้องรับเงิน)
- `<!-- SWT_ITEM_SEARCH_START -->...<!-- SWT_ITEM_SEARCH_END -->` (ถ้าหน้ามีสินค้า)

### Step 6 — Wire triggers
- "เพิ่มสินค้า" → `onclick="openItemSearch()"`
- "บันทึก/ชำระ" → `data-pay data-pay-total="X" data-pay-doc="Y"`
- "ลูกค้า" → `onclick="openCustomerSearch()"` (page-local modal)

---

## 🎨 Design Tokens (Locked Standards — จาก CLAUDE.md 37-43)

### Colors

| Token | Value | Usage |
|---|---|---|
| Primary | `#2563EB` | Buttons, highlights, links, focus ring |
| Primary dark | `#1D4ED8` | Hover |
| Sidebar | `#1E3A5F` | Sidebar bg, modal header |
| **Background** | **`#F3F4F6`** | **Page bg (locked)** |
| Card | `#fff` | Card bg |
| Border | `#E5E7EB` | Card/input border |
| Text | `#111827` | Main text |
| Muted | `#6B7280` | Secondary text |
| Label | `#9CA3AF` | Field labels |
| Success | `#10B981` / `#059669` | Confirmed (green) |
| Warning | `#F59E0B` / `#D97706` | Under consideration (amber) |
| Danger | `#EF4444` / `#DC2626` | Error |
| Unsure | `#6B7280` (gray) | Status unsure |
| Pin active | `#FCD34D` | Pin button active |

**Status Badge Colors (CLAUDE.md 43):**
- **Green** = confirmed
- **Amber** = under consideration
- **Gray** = unsure

**Gradients:**
```css
/* Main header / Summary total */
background: linear-gradient(90deg, #1E3A5F 0%, #2563EB 100%);

/* Modal header */
background: linear-gradient(180deg, #1E3A5F 0%, #172A47 100%);
```

### Typography
```css
font-family: 'Inter', 'Noto Sans Thai', sans-serif;
font-size: 13px; line-height: 1.45;
/* Mono for codes/numbers */
font-family: 'IBM Plex Mono', monospace;
```

Import:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Thai-primary UI labels กับ English code prefix เช่น `SL-1 ใบเสนอราคา`

### Layout constraints
- Min width: **1440px** (locked)
- Sidebar: **240px fixed** (locked)

### Dates (Locked — CLAUDE.md 40)
ใช้ **ค.ศ. 2 หลัก** เสมอ
- ✅ `12 เม.ย. 26` (ค.ศ. 2026)
- ✅ `INV-26-0042`
- ❌ `12 เม.ย. 2567` (พ.ศ. — เก่า)
- ❌ `INV-2567-0042`

**การเปลี่ยนแปลง**: ใน 2026-04-16 โปรเจกต์เปลี่ยนจาก พ.ศ. → ค.ศ. ทั้งหมด (ดู `.agents/active.md`)

### Amounts (Locked — CLAUDE.md 41)
Comma-separated thousands + 2 decimals เสมอ
- ✅ `103,439.00`
- ❌ `103439` · `103,439`

### Density (Compact)
- Card padding: 14px (default) · 10-12px (compact)
- Card border-radius: 8px
- Field margin-bottom: 8px / 0 (compact)
- Content padding: 16px 24px
- Font sizes: 9px (tiny) · 10-11px (small) · 12-13px (body) · 16-20px (title)

### Collapse Pattern (CLAUDE.md 42)
```html
<details class="collapse">
  <summary>... ▼</summary>
  ...
</details>
```
- `▼` rotation on open
- Sub-tabs: ใช้ `switchSubTab()` helper scoped per section

---

## 🏗️ Layout Shell (ทุกหน้าต้องมี)

```
<body>
  <div class="layout">
    [SIDEBAR: SWT_SIDEBAR block at bottom of body]

    <div class="main">
      <div class="topbar">           ← 56px sticky
      <header class="main-header">   ← gradient blue, sticky top:56
      <div class="saab-wrap">        ← sub action bar (hover+pin)
      <div class="content">          ← page content
    </div>
  </div>

  [Modals: page-local + SWT blocks]
</body>
```

ดูรายละเอียดใน `templates/base.html`

---

## 🧩 Shared Components (SC-x)

### SC-1 Customer Search + New Customer (Page-local)
**Features:**
- ค้น: ชื่อ / เบอร์ / เลขภาษี / **บัตรประชาชน 13 หลัก**
- ปุ่ม 📇 สแกนบัตร → mock smart card reader
- Empty state → "สร้างลูกค้าใหม่" (prefill ID card ถ้าค้นด้วยเลข)
- New Customer: section "กรอกจากบัตรประชาชน"

**API:** `openCustomerSearch()` · `openNewCustomer()` · `scanIdCardForSearch()` · `scanIdCardForNew()` · `lookupByIdCard()`

### SC-2 Product Search (`assets/swt-item-search.html`)
**Block:** `<!-- SWT_ITEM_SEARCH_START -->...<!-- SWT_ITEM_SEARCH_END -->`
**CSS prefix:** `swt-is-*`
**API:** `window.openItemSearch()` · `window.closeItemSearch()`
**Shortcut:** Alt+I

### SC-3 Payment (`assets/swt-pay.html`)
**Block:** `<!-- SWT_PAY_START -->...<!-- SWT_PAY_END -->`
**CSS prefix:** `swt-pay-*`
**6 วิธี:** เงินสด · โอน · QR PromptPay · บัตร · เช็ค · เครดิต AR
**API:** `window.swtOpenPay(total, docNo, {paid: 0})` · `window.swtClosePay()`
**Auto-wire:** `data-pay data-pay-total="103439" data-pay-doc="INV-26-0042"`

### SC-8 Serial Number (Page-local)
Modal เลือก S/N ของสินค้า — checkbox + counter

### SC-11 Doc Status Pills (inline)
4 pills แสดงสถานะเอกสาร:
- **B1** — Sale-In / Sale-Out
- **VAT** — 7% / 0% / ยกเว้น
- **CR** — Credit OK / Warning
- **FP** — Locked / Open

### SWT_SIDEBAR (`assets/swt-sidebar.html`)
Sidebar 240px น้ำเงินเข้ม · 12 กลุ่ม collapsible · search + hover+pin
**Default state:** **pinned** (visible first visit)

---

## 🔄 UX Patterns (bcsale pattern)

### 1. Save Flow (3-step)
```
[✔ บันทึก] → SC-3 Payment Modal → Confirm Dialog → Done
```

### 2. Modal Conventions
- **Open:** `openModal('mXxx')` หรือ `swtOpenXxx()`
- **Close:** overlay click · ESC · X button
- **Sizes:** `.modal.sm` (480) · `.md` (720) · `.lg` (900) · `.xl` (1040)

### 3. Hover + Pin (Sidebar, Sub Action Bar)
- Trigger strip บางๆ ที่ขอบ
- `body:not(.xxx-pinned) .xxx { transform: translateX/Y(hide) }`
- localStorage state per page

### 4. Click-to-Edit
ข้อมูลทั้งหมด **display-only** + ปุ่ม `✎ แก้ไข` → เปิด modal
**ไม่ใช้** inline edit กับ form fields หลัก (ยกเว้น item qty, notes)

### 5. Customer ID Card (บัตรประชาชน)
ทุก customer search/create รองรับ:
- ค้นด้วยเลข 13 หลัก
- ปุ่ม 📇 สแกนบัตร
- Prefill form จากบัตร

---

## 📋 Business Rules (จาก CLAUDE.md 45-52)

**ต้องจำ** — ทำ mockup ผิดกฎพวกนี้ = ผิด:

1. **VAT Golden Rule** — ส่วนลด **ก่อน** VAT เสมอ
2. **Rebate ≠ Discount** — rebate คืนหลังขาย · discount ลดก่อนขาย
3. **Dual-Book** — AP Invoice ทุกใบมี Entity Tag (`1 / 2 / 3 / ... / novat`)
4. **Credit Approval Tier** — SL-F1 และ PO ผ่าน CF-7 Approval Matrix
5. **Maker ≠ Checker** — คนทำกับคนอนุมัติต้องต่างคน
6. **Portal is UI only** — ไม่มี local DB / posting; เลข/สถานะ owned by BC365

---

## 🏛️ BC365 Scope (CLAUDE.md 54-60 · audit 2026-04-16)

**Cut (ใช้ BC365 ตรงๆ):** CF-2.1, CF-2.2, CF-2.3, CF-2.4, CF-2.9
**Portal UI layer (thin):** 18 pages
**Portal owns 100%:** 21 pages (รวม CF-2.5, CF-2.7)
**Phase 2:** CL-1, SM-3, CF-2.8

---

## 📋 Module Codes (CLAUDE.md 65)

`sl` Sales · `po` Purchase · `wh` Warehouse · `fi` Finance · `sv` Service · `pm` Promotion · `md` Master · `cf` Config · `ia` Integration · `cl` Claims · `cm` Commission · `ex` Executive · `rp` Report · `sc` Shared Component · `tr` Treasury

(91 modules · 8 groups · 1 entity SWT · Phase 1 ~34 screens — จาก CLAUDE.md 9)

---

## 🔧 เทคนิค/ข้อควรระวัง

### 1. Edit tool + ไฟล์ใหญ่ truncation
ไฟล์ > 100 KB + Thai text ใน Edit ขนาดใหญ่อาจ truncate

**วิธีแก้:**
- แบ่งเป็น Edit เล็กๆ
- เช็ค `awk 'END{print NR}' file && tail -3 file` หลังทุก Edit
- ถ้า truncate → recovery ด้วย bash `head -n N` + `cat >> EOF`
- หรือใช้ **sed** แทน Edit tool สำหรับ replace เยอะๆ

### 2. SWT Block prefix isolation
- Sidebar: `swt-sb-*`
- Payment: `swt-pay-*`
- Item Search: `swt-is-*`

### 3. localStorage keys
Prefix ตามหน้า: `sl4_sb_pinned` · `po4_sb_pinned` · etc.

### 4. sticky z-index
- Topbar top:0 z:40 · Main header top:56 z:30 · Saab top:120 z:25 · Sidebar z:500 · Modal z:1000+

### 5. swt-link.js
ใน root project มี `swt-link.js` (sidebar injector) — ถ้าใช้ SWT_SIDEBAR block ไม่จำเป็น แต่ reference ไว้ใน `<script src="swt-link.js">` ได้

---

## 🎓 Design Principles

1. **Compact density first** — 11-13px, tight padding
2. **bcsale UX** — modal-heavy, click-to-edit (ไม่ tab-heavy)
3. **Locked colors** — `#F3F4F6` · `#2563EB` · `#1E3A5F` เท่านั้น
4. **ค.ศ. 2-digit dates** — `26` ไม่ใช่ `2567`
5. **Shared components = SWT blocks** — prefix-isolated
6. **State persistence** — localStorage สำหรับ pin/filter
7. **Thai-first, EN-secondary** — code/label ใช้ EN monospace

---

## 📚 Reference Example

`sl4-invoice-mockup-v2-redesign.html` (~2,200 บรรทัด · ~128 KB)
แสดงทุก pattern: layout shell, SC-1, SC-2, SC-3, SC-8, SC-11, 3-way match, hover+pin, save flow, ID card scan

---

## ✅ Checklist ก่อน handoff

- [ ] ไฟล์ปิดด้วย `</body></html>` ครบ
- [ ] `</html>` ปรากฏใน `tail -3`
- [ ] **bg = #F3F4F6** (ไม่ใช่ `#F3F4F6`)
- [ ] **Dates = ค.ศ. 2 หลัก** (ไม่ใช่ พ.ศ. 2567)
- [ ] **Amounts = comma + 2 decimals**
- [ ] Min width 1440px, font Inter, sidebar 240px fixed
- [ ] Thai labels + EN code prefix
- [ ] มี 6+ SWT markers (SIDEBAR/PAY/ITEM_SEARCH)
- [ ] Sidebar pin ทำงาน (localStorage)
- [ ] Modals ปิดด้วย ESC + overlay ได้
- [ ] **Business rules ถูกต้อง** (VAT Golden Rule, Rebate≠Discount, Maker≠Checker)
- [ ] ไม่มี local DB / posting (Portal is UI only)
- [ ] มี reference ไปที่ `sangwijit-portal-skill/modules/<MODULE>.md` ใน comment (optional)
