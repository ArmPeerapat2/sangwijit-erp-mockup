# Skill: Audit Timeline & Activity Log

## Purpose
Provide complete traceability for operational and security-sensitive actions across job lifecycle and settings changes.

## Inputs / Preconditions
- Actor identity and role.
- Event type and target resource.
- Timestamp and minimal context payload.

## Event Model
- Required fields: `event_type`, `actor_id`, `actor_role`, `resource_type`, `resource_id`, `created_at`.
- Optional fields: `before`, `after`, `reason`, `metadata`.
- Append-only policy; no hard delete of audit entries.

## Log Triggers
- Job create/edit/assign/reassign/status transition.
- Settings save actions (shop/wage/zones/roles).
- Permission denied events (security log tier).

## Side Effects
- Timeline feed available on job detail.
- Admin logs screen supports search/filter/time range.
- Reporting jobs can aggregate event metrics.

## API + Table Contracts
- Tables: `job_logs` (+ optional system audit table).
- Endpoints for list/filter and job timeline retrieval.

## Error Handling
- Logging failure should not silently drop critical events.
- Use retry or fallback queue for transient write failures.

## Acceptance Checklist
- Every critical action appears in timeline with actor and time.
- Event order is stable and queryable.
- Search by job id and actor returns expected records.
- No UI operation depends on mutable/deletable audit data.
