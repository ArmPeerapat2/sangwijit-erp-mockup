# 03 — UI / UX Convention

> **Scope:** Color / Typography / Component pattern / Layout rules
> **ใช้เมื่อ:** ออกแบบหน้าใหม่ / รีวิวความสม่ำเสมอ

---

## 1. Color Palette

### 1.1 Primary / Brand

| Token | Hex | ใช้กับ |
|-------|-----|-------|
| Primary Blue | `#2563EB` | Active link, Primary button, Link text |
| Primary Blue Hover | `#1D4ED8` | Hover state |
| Primary Blue Light | `#DBEAFE` | Badge background |

### 1.2 Neutral (Text + Background)

| Token | Hex | ใช้กับ |
|-------|-----|-------|
| Text Dark | `#1F2937` | Main heading, body text |
| Text Medium | `#374151` | Secondary text |
| Text Muted | `#6B7280` | Helper text, section label |
| Text Gray | `#9CA3AF` | Placeholder, disabled |
| Text Light | `#D1D5DB` | Inverted text บน dark bg |

| Token | Hex | ใช้กับ |
|-------|-----|-------|
| BG White | `#FFFFFF` | Card, Panel |
| BG Gray 50 | `#F8FAFC` | Page background |
| BG Gray 100 | `#F3F4F6` | Row hover, disabled bg |
| Border | `#E5E7EB` | Table border, input border |
| Border Dark | `#D1D5DB` | Focus border |

### 1.3 Sidebar (Dark)

| Token | Hex | ใช้กับ |
|-------|-----|-------|
| Sidebar BG (legacy) | `#1E3A5F` | Older files (main sidebar format) |
| Sidebar BG (alt) | `#1F2937` | Alternate dark tone |
| Sidebar Hover | `rgba(255,255,255,0.1)` | Link hover |

### 1.4 Status Colors

| Color | Hex | Light bg | ใช้กับ |
|-------|-----|----------|-------|
| Success | `#10B981` | `#D1FAE5` | Completed, Approved |
| Warning | `#F59E0B` | `#FEF3C7` | Pending, Attention |
| Error / Danger | `#EF4444` | `#FEE2E2` | Rejected, Overdue |
| Info | `#3B82F6` | `#DBEAFE` | Note, Tip |

---

## 2. Typography

### 2.1 Font Family

```css
font-family: 'Inter', 'Noto Sans Thai', -apple-system, sans-serif;
```

- **หลัก:** Inter (สะอาด, รองรับตัวเลข, display-friendly)
- **ไทย:** Noto Sans Thai (fallback, รองรับสระ/วรรณยุกต์)

### 2.2 Size Scale

| Level | Size | Weight | ใช้กับ |
|-------|------|--------|-------|
| H1 Page title | 20-24px | 700 | หัวเอกสาร (SL-1 ใบเสนอราคา) |
| H2 Section | 16-18px | 600 | หัวข้อในฟอร์ม (ลูกค้า, สินค้า) |
| H3 Subsection | 14-15px | 600 | หัวข้อย่อย |
| Body | 13-14px | 400 | เนื้อหาทั่วไป |
| Small | 12px | 400 | Table cell, sidebar |
| Tiny | 10-11px | 600 | Section label (UPPERCASE) |
| Badge | 11px | 600 | Status badge, tag |

### 2.3 Thai Typography Rules

- ไทยกับอังกฤษวางปนในบรรทัดเดียวได้ เช่น "SL-1 ใบเสนอราคา" (กติกา: English code + ภาษาไทย description)
- วันที่ต้อง **พ.ศ.** เท่านั้น: `01/04/2567` ไม่ใช่ `01/04/2024`
- เลขเอกสาร: `<PREFIX>-<YYBE>-<RUNNING>` เช่น `QT-2567-0015`
- จำนวนเงิน: คอมม่าคั่นหลักพัน, 2 ทศนิยม — `89,218.00`

---

## 3. Component Patterns

### 3.1 Card (container pattern)

```html
<div style="background:#fff;border-radius:8px;
            border:1px solid #E5E7EB;
            padding:16px 20px;
            box-shadow:0 1px 2px rgba(0,0,0,0.04);">
  <!-- content -->
</div>
```

### 3.2 Button — Primary

```html
<button style="background:#2563EB;color:#fff;
               padding:8px 16px;border-radius:6px;
               font-weight:500;font-size:13px;
               border:none;cursor:pointer;">
  บันทึก
</button>
```

### 3.3 Button — Secondary

```html
<button style="background:#fff;color:#2563EB;
               padding:8px 16px;border-radius:6px;
               font-weight:500;font-size:13px;
               border:1px solid #2563EB;cursor:pointer;">
  ยกเลิก
</button>
```

### 3.4 Badge / Status Chip

```html
<span style="background:#D1FAE5;color:#065F46;
             padding:2px 8px;border-radius:12px;
             font-size:11px;font-weight:600;">
  ✓ อนุมัติแล้ว
</span>
```

### 3.5 Table

```html
<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead>
    <tr style="background:#F8FAFC;border-bottom:1px solid #E5E7EB;">
      <th style="text-align:left;padding:10px 12px;font-weight:600;color:#374151;">
        รหัสสินค้า
      </th>
      ...
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #F3F4F6;">
      <td style="padding:10px 12px;">DAI-FTKM35</td>
      ...
    </tr>
  </tbody>
</table>
```

**กติกาตัวเลข:** `text-align:right;font-variant-numeric:tabular-nums;`

### 3.6 Form Input

```html
<label style="display:block;font-size:12px;color:#6B7280;
              margin-bottom:4px;font-weight:500;">
  ชื่อลูกค้า
</label>
<input type="text" value="นายวิชัย สุขสมบูรณ์"
       style="width:100%;padding:8px 12px;
              border:1px solid #E5E7EB;border-radius:6px;
              font-size:13px;color:#1F2937;">
```

### 3.7 Header Bar (top of main content)

```html
<div style="background:#fff;border-bottom:1px solid #E5E7EB;
            padding:12px 24px;
            display:flex;justify-content:space-between;align-items:center;">
  <div>
    <span style="color:#6B7280;font-size:12px;">Sales /</span>
    <h1 style="margin:0;font-size:18px;color:#1F2937;">
      ใบเสนอราคา
    </h1>
  </div>
  <div style="display:flex;gap:12px;align-items:center;">
    🔍 🔔
    <span style="font-size:13px;color:#6B7280;">HQ</span>
    <div style="width:32px;height:32px;border-radius:50%;
                background:#2563EB;color:#fff;
                display:flex;align-items:center;justify-content:center;">
      สว
    </div>
  </div>
</div>
```

---

## 4. Spacing Scale

| Token | Value | ใช้กับ |
|-------|-------|-------|
| `xs` | 4px | Icon gap |
| `sm` | 8px | Tight spacing, chip padding |
| `md` | 12px | Standard gap |
| `lg` | 16px | Section padding |
| `xl` | 24px | Page padding |
| `2xl` | 32px | Big section separator |

---

## 5. Layout Grid

### 5.1 Page Container

```
┌─────────────────── Sidebar 240px ───────────────────┐
│                                                      │
│  ┌─ Header (fixed หรือ sticky ก็ได้) ─────────────┐  │
│  │                                                 │  │
│  ├─ Main content (padding: 24px) ─────────────────┤  │
│  │                                                 │  │
│  │  ┌─ Card: Header info (2-col grid) ───────┐    │  │
│  │  └───────────────────────────────────────┘    │  │
│  │                                                 │  │
│  │  ┌─ Card: Items table ───────────────────┐    │  │
│  │  └───────────────────────────────────────┘    │  │
│  │                                                 │  │
│  │  ┌─ Card: Totals/Summary (right align) ─┐    │  │
│  │  └───────────────────────────────────────┘    │  │
│  │                                                 │  │
│  └─ Footer action bar (sticky bottom) ───────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
                                              [☰]   ← Quick Nav
```

### 5.2 2-Column / 3-Column Grid

```html
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
  <!-- 2 cols -->
</div>

<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
  <!-- 3 cols -->
</div>
```

---

## 6. Icon Usage

- **Emoji ok** — ใช้ใน sidebar Quick Nav section (📋 🛒 💰 👷 ⚙️)
- **Unicode simple** — ใช้ใน button (☰ ▼ 🔍 🔔 ✓ ✗)
- **ไม่ใช้** icon library (เพราะ mockup static) — อนาคต P1 ใช้ lucide-react

---

## 7. Responsive Breakpoint

| BP | Width | หมายเหตุ |
|----|-------|---------|
| Desktop | `>= 1440px` | Default, มี sidebar เต็ม |
| Laptop | `1024-1440px` | Sidebar ยังเต็ม, content แคบลง |
| Tablet | `< 1024px` | Phase ต่อไป — sidebar collapse เป็น icon-only |
| Mobile | `< 768px` | Phase P4 — Mobile App แยก |

**ปัจจุบัน P0-P1 Focus Desktop-first เท่านั้น**

---

## 8. Accessibility Notes

- Contrast ratio ≥ 4.5:1 สำหรับ body text (ผ่าน WCAG AA)
- Active link ต้องมี visual cue ชัด (ไม่ใช่สีอย่างเดียว — มี font-weight ด้วย)
- Focus state (`:focus`) ควรมี outline ชัดเจน (P1)
- ห้ามใช้ red-only เป็น error indicator — ต้องมี icon ด้วย (❌, ⚠️)

---

## 9. Icon / Emoji Guide ที่ใช้บ่อย

| หมวด | Emoji |
|-----|-------|
| งานขาย | 📋 |
| คลังสินค้า | 📦 |
| จัดซื้อ | 🛒 |
| บัญชี/การเงิน | 💰 |
| บริการ / ช่าง | 👷 🔧 |
| Dashboard / Exec | 📊 📈 |
| ตั้งค่าระบบ | ⚙️ |
| Claims / Insurance | 🧾 |
| Search | 🔍 |
| Notification | 🔔 |
| ลูกค้า/User | 👥 👤 |
| สาขา/Warehouse | 🏢 |

---

## 10. Reference Files

- ตัวอย่างหน้าสวยสมบูรณ์: `sl1-quotation-mockup.html`
- ตัวอย่างฟอร์ม + table: `po4-purchase-order-mockup.html`
- ตัวอย่าง Dashboard: `ex1-executive-dashboard-mockup.html`
