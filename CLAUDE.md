# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **static HTML mockup workspace** for the Sangwijit ERP Web Portal — a single Frontend layer designed to sit over Microsoft Dynamics 365 Business Central (BC365). There is **no build system, package manager, or test runner**: each `*.html` file at the root is a standalone mockup page with inline `<style>` and `<script>`. Mockups are opened directly in a browser.

The portal wraps 91 planned modules (8 groups) across 1 legal entities (SWT). Phase 1 (~34 screens) targets Run-ASAP modules; BC365 is not yet wired up.

## Where to read before doing work

The project keeps most rules in dedicated docs — load them on demand, don't duplicate here:

| Trigger | Read |
|---|---|
| **Any non-trivial task** (always) | `.agents/active.md` — current focus, decisions, next actions |
| Workflow policy for the `.agents/` workspace | `.agents/AGENTS.md` |
| Portal UI/navigation/BC integration conventions | `knowledge-base/CLAUDE.md` and `knowledge-base/portal/*.md` |
| Business rules / module specs (SL, WH, PO, FI, SV, PM, MD, CF, IA) | `sangwijit-portal-skill/SKILL.md` + `sangwijit-portal-skill/modules/<MODULE>.md` |
| Flow diagrams (required reading before designing any module) | `Flow Design/<Module>/Flow/*.pdf` |
| High-level project intro, phase plan, RBAC, API list | `README.md` |
| Requirements + open questions | `research.md`, `plan.md` |

Trust priority when sources conflict: latest user instruction → codebase state → `.agents/AGENTS.md` → `.agents/active.md` → topic/session notes. Notes lose to the actual HTML.

## Working on mockups

**Preview:** open the HTML directly in a browser (e.g. `start portal-mockup-index.html` on Windows). `portal-mockup-index.html` links every mockup page.

**Editing rules (from `knowledge-base/CLAUDE.md` 3 — these take precedence):**
- Edit the existing file in place. Do not create a new file for the same page.
- Only bump to `-v2`, `-v3` suffix if the user explicitly asks for a new version.
- Creating a brand-new mockup page → ask first; scope may have shifted.
- Every page must carry the standard sidebar + Quick Nav (see `knowledge-base/portal/02-navigation-structure.md`).

**Locked design standards** (do not change without asking):
- Min width 1440px, Inter font, sidebar `#1E3A5F` (240px fixed), accent `#2563EB`, background `#F8FAFC`
- Thai-primary UI labels with English code prefix (e.g. "SL-1 ใบเสนอราคา")
- Dates in **ค.ศ.** (YY = 26) — the earlier พ.ศ. convention in `knowledge-base/CLAUDE.md` 3.3 was superseded by the 2026-04-16 decision in `.agents/active.md`. When in doubt, check `active.md`.
- Amount: comma-separated thousands, 2 decimals
- Collapse pattern: `<details class="collapse">` with `▼` rotation; sub-tabs via a `switchSubTab()` helper scoped per section
- Status badge colors: green = confirmed, amber = under consideration, gray = unsure

## Non-obvious business rules (break these and the mockup is wrong)

- **VAT Golden Rule** — discount is applied **before** VAT, always.
- **Rebate ≠ Discount** — rebate is returned after the sale; discount reduces price before the sale.
- **Dual-Book** — every AP Invoice carries an Entity Tag (`1 / 2 / 3 / ... / novat`).
- **Credit Approval Tier** — both SL (SL-F1) and PO flows must route through CF-2.6 Approval Matrix.
- **Maker ≠ Checker** — a user cannot approve their own document anywhere an Approval step exists.
- **Portal is UI only** — no local DB, no posting outside BC365. Posting/numbering/status are owned by BC. See `sangwijit-portal-skill/SKILL.md` "Mental Model" section before designing anything.

## BC365 scope decisions (2026-04-16 audit — from `.agents/active.md`)

Already decided, do not re-litigate:
- **Cut (use BC directly, mockups kept as reference only):** CF-2.1 Tax, CF-2.2 Number Series, CF-2.3 Posting & GL, CF-2.4 Bin Policy, CF-2.9 General Parameter.
- **Portal as thin UI layer over BC API:** 18 pages.
- **Portal owns 100% (BC has no equivalent):** 21 pages, including CF-2.5 Tech Template and CF-2.7 Doc Template.
- **Deferred to Phase 2:** CL-1 Claims, SM-3 Vendor Portal, CF-2.8 Entity Tag.

## File-naming conventions worth knowing

- Top-level mockups use `<module-code><n>-<slug>-mockup[-v<N>].html` — e.g. `md1-item-master-mockup-v3.html`, `cf2-5-tech-template-mockup.html`.
- Module codes: `sl` Sales, `po` Purchase, `wh` Warehouse, `fi` Finance, `sv` Service, `pm` Promotion, `md` Master, `cf` Config, `ia` Integration, `cl` Claims, `cm` Commission, `ex` Executive, `rp` Report, `sc` Shared Component, `tr` Treasury.
- `_archive/` holds older docx/md reference material; `_reference/docs/` holds imported references. Don't edit archived material unless the user asks.

## Response style

- Reply in Thai by default (match the user's language). Be concise and informal.
- **กฎชื่อเต็ม (locked):** ทุกครั้งที่อ้างรหัสโมดูล — ต้องมีชื่อเต็มคู่กันเสมอ (เช่น **PO-6 ใบตั้งหนี้เจ้าหนี้** ไม่เขียนแค่ PO-6) · ดูตารางใน `.agents/active.md` §กฎชื่อเต็ม
- When unsure, ask rather than guess. The knowledge base is large and decisions move fast — check `.agents/active.md` for what's current.
- Output files go under `/Design Ai/` or `/Design Ai/knowledge-base/` as appropriate.

### เมื่อทำ mockup / rebuild เสร็จ — ส่งมอบให้ user ก๊อปไปดู (locked)

ทุกครั้งที่ปิดงาน mockup (สร้างใหม่ · rebuild · archive) **ต้องแสดงบล็อกส่งมอบ** ให้ user ก๊อปได้ทันที ห้ามสรุปอย่างเดียว:

1. **ไฟล์หลัก** — full path แบบ Windows (เช่น `C:\Users\...\Design Ai\sl1-quotation-mockup.html`)
2. **คำสั่งเปิด browser** — `start "…full path…"` (PowerShell / cmd บน Windows)
3. **Archive** — full path ของ `_archive/…-YYYY-MM-DD.html` (ถ้ามีการ archive)
4. **Chain ทดสอบ** — หน้าต้นทาง + ปุ่ม/action ที่พาไปหน้าที่เพิ่งทำ (ถ้าเชื่อม doc-chain)
5. **ไฟล์แก้ร่วม** — เช่น `swt-sidebar.js`, `.agents/active.md` (ถ้าแตะ)
6. **อัปเดต flow overview** — ทุกครั้งที่ **เพิ่มหน้า · แก้ flow/สถานะ · rebuild (ติด ✦)** ต้องปรับ node/สถานะ/ลิงก์/มาร์ก ✦↔เก่า ให้ตรง (locked 2026-06-14) · มี 2 ไฟล์: **`../Dev-Handoff-SLPOWH/module-flow-overview.html`** (per-module · handoff SL/PO/WH · มี copy mockup แยก) + **`.agents/flow-workflow-map.html`** (working · cross-module 7 สาย · กดได้)

รูปแบบตัวอย่าง:

```
ไฟล์หลัก:
C:\Users\Thinkpad\OneDrive\claude\ArmWiki\Design Ai\fi2-ap-payment-mockup.html

เปิดดู:
start "C:\Users\Thinkpad\OneDrive\claude\ArmWiki\Design Ai\fi2-ap-payment-mockup.html"
```

### การทำงานร่วมกัน (สรุป — รายละเอียดใน `.agents/active.md`)

- **Flow-first:** แสดง flow → user confirm → ค่อยแก้ mockup (ห้าม batch หลายหน้า)
- **Form Build Pattern:** **Step 0 Gate** → Blueprint ①–⑤ → confirm → build บน `_form-template.html` → archive + full path
- **Chain regression:** หลังแก้ `swt-sidebar.js` / `swt-doc-finder.js` → `.agents/topics/chain-regression-checklist.md`
- **Shared components:** `.agents/topics/shared-components-status.md` (§0 แนวทางกลาง · master checklist)
- **SC sprint (locked 2026-06-11):** ทำ SC ที่เหลือให้ครบก่อน · FI-1/WH-3/PO-2 รอหลัง sprint · ฟอร์มใหม่ใช้ `swt-patterns.js` + `swt-doc-finder.js` ไม่ copy inline
- **ตัวย่อ:** ใส่ชื่อเต็มในวงเล็บเมื่อตอบ user (เช่น AP = ใบตั้งหนี้เจ้าหนี้)

### Blueprint Step 0 — Pre-build Gate (บังคับ · locked 2026-06-11)

ก่อน Blueprint ①–⑤ และก่อนเขียนโค้ด ต้องผ่าน:

1. อ่าน `.agents/topics/form-template-guideline.md` (§🖥️ fit 100vh · party · ตาราง)
2. เปิด `swt-doc-finder.js` — มี 