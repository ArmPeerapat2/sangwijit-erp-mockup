# ChangPrompt Implementation Gap Analysis v1

## Source-of-Truth Policy
- Primary: `ออกแบบ With Ai/updates/*`
- Fallback: root/main docs when topic is not present in `updates/`

## Current Progress (Already Done)

### Admin UI/UX improvements completed
- Global header keyword is wired to JO-P1 list behavior.
- JO-P1 filtering and clear-filter interaction are connected.
- Settings validations added (Shop/Wage/Zones) with inline errors.
- Toast feedback added for admin success/error outcomes.

### Documentation and skill assets completed
- Original skill doc copied without modification.
- Extracted skill index created in versioned folder.
- Detailed skills v1 (core) and v2 (extended) drafted.

## Gap vs Current Development Direction

### 1) Core access/security layer (High gap)
Missing or not yet formalized in codebase:
- Central RBAC policy map and reusable guard utilities.
- Consistent route guard + action guard + data masking integration.
- Unified permission checks at service boundary.

### 2) Domain workflow enforcement (High gap)
Missing or partial:
- Canonical status transition validator for job lifecycle.
- Conflict-safe transition handling (race-safe status change).
- Transition-driven side effects orchestration (notify/log/finance).

### 3) Assignment intelligence (Medium-High gap)
Missing:
- Zone/availability/workload scoring flow.
- Override reason enforcement and structured reassignment audit.
- Suggestion endpoint + admin confirm pattern.

### 4) Rate/Wage and financial backbone (High gap)
Missing:
- Effective rate engine integration (platform + override + snapshot).
- Wage/payroll transaction lifecycle and reconciliation.
- Shop invoice / spread tracking implementation details in app layer.

### 5) Audit and observability maturity (Medium gap)
Missing or partial:
- Strong append-only event model standard.
- Systematic event taxonomy across all critical actions.
- KPI/report aggregation pipeline tied to logs and transactions.

### 6) Multi-role product surfaces (Medium gap)
Missing:
- Owner-specific dashboard/report surface.
- Sales public-booking conversion flow integration.
- Technician portfolio flow integration.

## Recommended Adjustment Plan

### Sprint A: Foundation hardening (now)
- Implement centralized RBAC + masking utilities.
- Introduce transition map/validator for job lifecycle.
- Normalize audit log event schema.

### Sprint B: Operations correctness
- Implement assignment engine v1 (zone + availability + override reason).
- Implement rate/wage snapshot path at assignment/complete transitions.
- Add finance transaction skeleton (pending->paid lifecycle records).

### Sprint C: Product expansion
- Owner dashboard read-only KPIs.
- Public booking conversion pipeline.
- Technician portfolio MVP.

## Definition of Done for realignment
- No role can execute unauthorized action via UI or direct service call.
- Every critical job action emits timeline event with actor and timestamp.
- Assignment and wage calculations are deterministic and auditable.
- Dashboard totals reconcile with transactional records.

## Files Created in this Version (Reference)
- `SKILL.source-copy.md`
- `SKILL.extracted-v1.md`
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
