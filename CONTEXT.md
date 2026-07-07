# Sangwijit ERP Web Portal

A UI-only frontend mockup layer over Microsoft Dynamics 365 Business Central (BC365). The Portal designs screens and workflow; BC365 owns all data, posting, numbering, and status.

## Language

**Portal**:
The frontend layer being mocked up. Holds no permanent data — it validates input, orchestrates workflow, and renders state pulled from BC365.
_Avoid_: app, system, website

**BC365** (Business Central):
The System of Record. Owns posting, document numbers, status, ledger, and master data. Every transaction enters BC via API.
_Avoid_: backend, database, ERP (ERP refers to the whole, not BC alone)

**Flow**:
A reference process diagram under `Flow Design/<Module>/`. The canonical definition of what a business process requires. Source of truth for which pages must exist.
_Avoid_: process, diagram, spec

**Touchpoint**:
A step in a Flow that a user actively performs in the Portal. Only touchpoints become UI. BC-side steps (post, number, ledger) are status changes, never separate screens.
_Avoid_: step, action, node

**Mockup Page**:
One static HTML screen representing the Portal-side touchpoints of one or more Flows. Not 1:1 with Flows — a Flow may span pages and a page may serve many Flows.
_Avoid_: mockup, screen, view, file

**Queue Page**:
A list/dashboard page that serves many Flows at once (e.g. SL-Q, PO-Q, FI-Q). Row "ดำเนินการ" buttons open a detail modal — never navigate via location.href.
_Avoid_: dashboard, list, inbox

**Reservation** (ใบจอง):
The BC Sales Order in Open status; the Portal page SL-2. Same BC entity as the Flow named "Sales Order (ใบสั่งขาย)" — a UI/business renaming, not a separate concept.
_Avoid_: booking, order (when meaning the BC entity, say "BC Sales Order")

**Module Code**:
The canonical page identifier (e.g. SL-4, FI-3) defined by the Flow + module spec under `.claude/skills/sangwijit-portal/modules/`. A mockup's code must match the spec's meaning for that code.
_Avoid_: prefix, page number

**VAT Report (รายงานภาษีขาย/ภาษีซื้อ)**:
The Portal page FI-7. A per-period register of Output VAT (ภาษีขาย) and Input VAT (ภาษีซื้อ), released and printed to file ภ.พ.30. A read-and-release view over BC `vatEntries` — not an editing screen, not a reconciliation, not period close.
_Avoid_: Tax Reconciliation, กระทบยอดภาษี, VAT close

**Period Close (ปิดงวด / Lock Period)**:
A BC365-owned operation that locks an accounting period against back-dated posting. No Portal page exists — cut-to-BC, like General Journal (JV / FI-4). Not FI-7.
_Avoid_: FI-7 (FI-7 is the VAT Report), ปิดงวดใน Portal

**WHT List (ภาษีหัก ณ ที่จ่าย)**:
The Portal page FI-12. Lists withholding-tax entries from payments, releases them, and prints WHT certificates + ภ.ง.ด.3 (บุคคลธรรมดา) / ภ.ง.ด.53 (นิติบุคคล). Distinct from VAT — never share a page with FI-7.
_Avoid_: tax (unqualified), ภาษี (unqualified), bundling with VAT

**Position (ตำแหน่ง)**:
A configurable RBAC record (ADR-0003) scoped by Branch + Department, carrying a per-page CRUD permission list and an authority limit (วงเงิน). An Employee is assigned exactly one Position. Replaces the old fixed "9 roles" model.
_Avoid_: role (ใช้ "Position" เมื่อหมายถึง record ที่ config ได้), fixed role

**Authority Limit (วงเงิน)**:
The approval/discount ceiling attached to a Position/Employee; consumed by CF-2.6 Approval Matrix to route documents by amount tier. Not a credit limit (that is the Customer's).
_Avoid_: credit limit (นั่นของลูกค้า MD-2), budget
