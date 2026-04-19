# ChangPrompt Skills Extracted v1

## Source Rule
- Use `updates/` documents as primary source.
- If a topic is missing in `updates/`, fallback to main/root documents.

## Extracted Core Skills (Implementation Priority)

### 1) RBAC & Permission Guard
- Route guard by role: `owner`, `admin`, `coordinator`, `technician`, `super_admin`.
- Action-level permission checks in UI and service layer.
- Field-level masking for sensitive data.
- Deny-by-default for unknown role/action pairs.

### 2) Job Lifecycle Orchestration
- Canonical states: `pending -> assigned -> accepted -> working -> reviewing -> completed/disputed`.
- Transition validator enforces valid state changes.
- Side effects on transitions: timeline log, notifications, and finance hooks.

### 3) Assignment Engine
- Candidate selection based on zone coverage, availability, and workload.
- Support assign/reassign with explicit override reason.
- Emit assignment events to timeline and notifications.

### 4) Rate & Wage Calculation
- Effective rate = platform catalog base + shop override.
- Wage calculation includes gross, deductions, and net payout.
- Snapshot rate inputs at assignment/confirmation time for auditability.

### 5) Audit Timeline
- Append-only event log for all critical actions.
- Event schema includes `who`, `when`, `what`, `before`, `after`.
- Query by `job_id`, `shop_id`, `actor`, `date_range`.

### 6) Shop Settings Governance
- General shop setup, role setup, zone setup, payment defaults.
- Invite/application flow for technicians with approval status.
- Immutable agreement snapshot per accepted membership.

### 7) Financial Flow Core
- Wage calculation per job.
- Payment transaction lifecycle and reconciliation fields.
- Monthly payroll summary and shop invoicing.
- Platform spread/revenue tracking.

### 8) Reporting & KPI Aggregation
- Dashboard core metrics: job status, revenue trend, top performers.
- Filters: date range, payment mode, status, team/zone.
- Scheduled aggregation jobs for heavy queries.

### 9) Public Booking Intake
- Public booking creation (QR / channel intake).
- Shop-side confirm/reject/convert-to-job lifecycle.
- Conversion events must link booking to created job.

### 10) Technician Portfolio
- Auto-build profile from completed jobs.
- Privacy filter for customer-sensitive fields.
- Public share token with revocable access.

## Skill Template (Use for all new skills)
- Purpose
- Inputs / Preconditions
- Validation Rules
- State Transitions
- Side Effects
- API + Table Contracts
- Error Handling
- Acceptance Checklist

## Suggested Next Skills to Draft in Detail
1. `skill_rbac_guard.md`
2. `skill_job_lifecycle.md`
3. `skill_assignment_engine.md`
4. `skill_rate_wage.md`
5. `skill_audit_timeline.md`

## Detailed Skill Files (Created)
- `skill_rbac_guard.md`
- `skill_job_lifecycle.md`
- `skill_assignment_engine.md`
- `skill_rate_wage.md`
- `skill_audit_timeline.md`
- `skill_financial_flow.md`
- `skill_shop_settings_governance.md`
- `skill_reporting_kpi.md`
- `skill_public_booking.md`
- `skill_tech_portfolio.md`

## Analysis File
- `IMPLEMENTATION_GAP_ANALYSIS_v1.md`
