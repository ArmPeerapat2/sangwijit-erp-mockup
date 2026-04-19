# 02 — Navigation Structure

> **Scope:** Sidebar + Quick Nav + Active state + กติกาเพิ่มลิ้งก์ใหม่
> **ใช้เมื่อ:** สร้างหน้าใหม่ / อัปเดตเมนู / troubleshoot sidebar

---

## 1. Layout Overview

```
┌────────────────┬───────────────────────────────────┐
│                │  Header (title, user, notify)     │
│   SIDEBAR      │───────────────────────────────────│
│   240px        │                                   │
│   fixed left   │         MAIN CONTENT              │
│   dark bg      │         (margin-left: 240px)     │
│                │                                   │
│   scrollable   │                                   │
│                │                                   │
│                │                         [☰]      │ ← Quick Nav button
│                │                                   │   (fixed bottom-right)
└────────────────┴───────────────────────────────────┘
```

**Key numbers:**
- Sidebar width: `240px` (fixed)
- Main content margin-left: `240px`
- Quick Nav button: `bottom:24px; right:24px`
- Quick Nav panel: `bottom:80px; right:24px; width:300px; max-height:70vh`

---

## 2. Sidebar Structure (HTML Template)

### 2.1 Outer container

```html
<div class="sidebar"
     style="width:240px;background:#1E3A5F;overflow-y:auto;
            position:fixed;height:100vh;left:0;top:0;
            padding:16px 12px;z-index:100;
            font-family:'Inter',sans-serif;">
  <!-- Logo/Portal title -->
  <!-- Back-to-index link -->
  <!-- Navigation sections -->
</div>
```

### 2.2 Section header

```html
<div style="font-size:10px;font-weight:600;color:#6B7280;
            padding:10px 12px 4px;
            text-transform:uppercase;letter-spacing:0.08em">
  งานขาย (SL)
</div>
```

### 2.3 Nav link — inactive (default)

```html
<a href="sl2-reservation-mockup.html"
   style="display:flex;align-items:center;gap:6px;
          padding:6px 12px;border-radius:6px;
          text-decoration:none;color:#D1D5DB;font-size:12px;
          margin:1px 0"
   onmouseover="this.style.background='rgba(255,255,255,0.1)';
                this.style.color='#fff'"
   onmouseout="this.style.background='transparent';
               this.style.color='#D1D5DB'">
  SL-2 ใบจอง
</a>
```

### 2.4 Nav link — active (หน้าปัจจุบัน)

```html
<a href="sl1-quotation-mockup.html"
   style="display:flex;align-items:center;gap:6px;
          padding:6px 12px;border-radius:6px;
          text-decoration:none;color:#fff;font-size:12px;
          margin:1px 0;
          background:#2563EB;font-weight:600">
  SL-1 ใบเสนอราคา
</a>
```

**ความต่าง active vs inactive:**

| ส่วน | Inactive | Active |
|-----|---------|--------|
| `color` | `#D1D5DB` | `#fff` |
| `background` | — (hover เท่านั้น) | `#2563EB` (ถาวร) |
| `font-weight` | normal (400) | `600` |
| `onmouseover/out` | มี | **ไม่มี** |

---

## 3. Section Order (มาตรฐาน)

ตามลำดับจาก `sl1-quotation-mockup.html` (reference):

1. **BACK TO INDEX** — `portal-mockup-index.html`
2. **งานขาย (SL)** — SL-Q, SL-1 ~ SL-7, CM-1, CL-1
3. **คลังสินค้า (WH)** — WH-Q, WH-1, WH-2, WH-3, WH-R
4. **จัดซื้อ (PO)** — PO-Q, PO-4, PO-Rebate
5. **SKU & Vendor (SM)** — SM-1, SM-2, SM-3
6. **บัญชี/การเงิน (FI/TR)** — FI-1 ~ FI-5, TR-1
7. **บริการ (SV/DL)** — SV-1, SV-2, DL-1
8. **รายงาน/สั่งการ** — EX-1, **RP-1**
9. **อนุมัติ/ตรวจสอบ (AP)** — AP-1
10. **สิทธิ์ผู้ใช้ (CF-1)** — CF-1
11. **ตั้งค่าระบบ (CF-2)** — CF-2 Hub, CF-2.1, 2.2, 2.5, 2.6, 2.7, 2.9
12. **Master Data (MD)** — MD-1 ~ MD-5 (v3)
13. **Commission & Reports** — CM-1 (ถ้าไม่ได้อยู่ใน SL), SC-* tools

---

## 4. Quick Nav Panel (Floating Bottom-Right)

### 4.1 ปุ่ม trigger

```html
<div id="quickNavBtn"
     onclick="document.getElementById('quickNavPanel').classList.toggle('qn-open')"
     style="position:fixed;bottom:24px;right:24px;width:48px;height:48px;
            background:#2563EB;color:#fff;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:20px;cursor:pointer;
            box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:99;">
  ☰
</div>
```

### 4.2 Panel

```html
<div id="quickNavPanel"
     style="position:fixed;bottom:80px;right:24px;width:300px;
            max-height:70vh;background:#fff;border-radius:12px;
            box-shadow:0 8px 32px rgba(0,0,0,0.15);
            overflow-y:auto;padding:16px;z-index:99;display:none;">
  <!-- Section headers + links -->
</div>
```

### 4.3 Section header ใน Quick Nav

```html
<div style="font-size:11px;font-weight:600;color:#6B7280;
            margin:8px 0 4px;">
  📋 งานขาย
</div>
```

### 4.4 Link ใน Quick Nav

```html
<a href="sl1-quotation-mockup.html"
   style="display:block;padding:4px 8px;font-size:12px;
          color:#2563EB;text-decoration:none;">
  SL-1 ใบเสนอราคา
</a>
```

**หมายเหตุ:** Quick Nav ใช้ style **คนละตัว** กับ sidebar — อย่าเอา style dark มาใช้ใน Quick Nav

### 4.5 CSS trigger class

```css
.qn-open {
  display: block !important;
}
```

---

## 5. กติกาเพิ่มเมนูใหม่

### 5.1 เพิ่ม 1 link ใหม่

1. ใน **sidebar** — copy anchor inactive จาก template §2.3, แก้ `href` + ข้อความ
2. ใน **Quick Nav** — copy anchor จาก template §4.4, แก้ `href` + ข้อความ
3. ทำทั้ง 58 mockup files ต้องเหมือนกัน

### 5.2 เพิ่ม section ใหม่ (module group ใหม่)

1. เลือกตำแหน่ง — ตามลำดับใน §3
2. Copy section header template §2.2 + links ภายใน
3. ใน Quick Nav ก็ต้องมี section เดียวกันในตำแหน่งเดียวกัน

### 5.3 แก้ active state เมื่อย้ายหน้า

- **หน้าใหม่** → ใน sidebar ของหน้าใหม่ **ต้อง** ทำให้ link ตัวเองเป็น active (ใช้ template §2.4)
- **ทุก link อื่น** → ต้องเป็น inactive

### 5.4 Bulk update (แก้ทั้ง 58 ไฟล์พร้อมกัน)

- ใช้ Python script ไม่ใช่ sed/awk (จัดการ anchor Thai/Unicode ได้ดีกว่า)
- หา pattern ที่ unique เพื่อ insert (เช่น `>AP-1 ศูนย์อนุมัติ</a>` แทน just `</a>`)
- **ระวัง:** Patterns เช่น `>SL-1 ใบเสนอราคา</a>` อยู่ใน 2 ที่ (sidebar + Quick Nav) — ต้องแยก
- วิธี split: หา comment `<!-- Floating Quick Nav -->` เป็น marker

---

## 6. Back-to-Index Link

```html
<a href="portal-mockup-index.html"
   style="display:flex;align-items:center;gap:8px;
          padding:7px 12px;border-radius:6px;
          text-decoration:none;color:#9CA3AF;font-size:12px;
          margin-bottom:16px;background:rgba(255,255,255,0.05);">
  ← กลับหน้า Index
</a>
```

**วาง:** บนสุดของ sidebar, หลัง Logo/Title

---

## 7. Common Mistakes (เจอประจำ)

| ปัญหา | สาเหตุ | วิธีป้องกัน |
|------|--------|------------|
| Sidebar ไม่เหมือนกันระหว่างหน้า | Copy จาก template เก่า / ลืมอัปเดต | ใช้ sl1 เป็น master template เสมอ |
| ลิ้งก์ href="#" (broken) | สร้างไฟล์ใหม่โดยไม่ update sidebar | Checklist: link ต้อง end ด้วย `.html` |
| Content ถูก sidebar ทับ | ลืมใส่ `margin-left:240px` ให้ main | CSS `.main-content { margin-left:240px }` |
| Quick Nav ปิดไม่ได้ | ลืม JS trigger | Test click ปุ่ม ☰ หลังอัปเดต |
| Active state ค้างที่หน้าอื่น | Copy sidebar จากหน้าอื่นมาทั้งก้อน | ต้อง deactivate link เดิม + activate link ใหม่ |

---

## 8. Reference Files

- Master template: `sl1-quotation-mockup.html` (chars 12732–32890 = sidebar)
- Index: `portal-mockup-index.html`
- Architecture: `sangwijit-portal-architecture.html`
