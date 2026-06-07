# Session Handoff 2026-06-01 — ERP BC2

> คัดลอกไฟล์นี้ไปวางต้นแชทใหม่เพื่อต่อยอดได้ทันที

## Context โปรเจกต์
- **Sangwijit ERP Web Portal** = UI layer เหนือ Dynamics 365 BC365 (SWT single-entity)
- Repo: `C:\Design Ai\` · Obsidian: `C:\Users\arm99\OneDrive\claude\ArmWiki\ArmWiki\Projects\Sangwijit-ERP-Portal\`
- Docs-first: `Flow Design/*.pdf` + `sangwijit-portal-skill/modules/*.md` + `_reference/docs/*.docx`

## ADRs (ตัดสินแล้ว · ห้ามเปลี่ยนโดยไม่ประกาศ)
- **ADR-0001**: Flow+spec = canonical · mockup ผิด = แก้ที่ mockup
- **ADR-0002**: FI-7 = VAT report (ภ.พ.30) เท่านั้น · ปิดงวด/Lock Period = cut-to-BC · WHT = FI-12
- **ADR-0003**: Position-based RBAC (แทน 9 fixed roles) · per-page CRUD · scope สาขา/แผนก · วงเงิน
- **ADR-0004**: CF-2.2 = Portal-managed running number · format `[BranchCode][DocCode]-[YYMM]-[###]` · BranchCode auto จาก login · reset ทุกเดือน

## สถานะงาน
### ✅ เสร็จ
- Shared Components 9/9 (CustomerSearch/ItemSearch/DocRef/Payment/Deposit/Delivery/Serial/Timeline/PromoPrice)
- Master flows 5/7 (MD-1~5 · RBAC/Position)
- SL list 10 หน้า (SL-Q/1/2/3/4/F1/RQ/RT/CN/DN)
- CF-1 Position/RBAC prototype: `_proposal/cf1-position-rbac-proposal.html`
- CF-2.2 Running Number prototype: `_proposal/cf22-running-number-proposal.html`

### ⏳ ถัดไป
1. **CF-2.6 Approval Matrix** — update Approver → Position · เพิ่ม SL-RQ/RT/DN
2. **CF-2.7 Doc Template** — เพิ่ม doc types ใหม่
3. **CF-2 Config Hub** — update links
4. **SL-1 ใบเสนอราคา** — ลงรายละเอียด field+flow

## กฎการทำงาน
- docs-first (ไม่ยึด HTML) · flow-first · ทำทีละ flow ให้เสร็จ
- ทุกข้อเสนอเปลี่ยน = ตารางเทียบเก่า↔ใหม่ก่อนตัดสิน
- save Obsidian ทุกปิด flow
- แนบลิงก์เปิดหน้าเดิมเวลาถาม
- มาตรฐาน table: # · หน้า · วัตถุประสงค์ · ผู้ใช้หลัก · Shared Components

## Obsidian Notes (knowledge copy)
- Sessions/2026-06-01 ERP BC2 — Setup Module CF + Shared Components.md
- Projects/Sangwijit-ERP-Portal/CF Setup Module.md
- Projects/Sangwijit-ERP-Portal/SL Sales Module.md
- Projects/Sangwijit-ERP-Portal/Foundation & Decisions.md
- Projects/Sangwijit-ERP-Portal/Shared Components.md
- Projects/Sangwijit-ERP-Portal/ADR-0004 Running Number.md
