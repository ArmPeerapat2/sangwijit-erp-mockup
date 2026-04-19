# Skill: Job Lifecycle Orchestration

## Purpose
Standardize job state transitions, validations, and side effects so every status change is deterministic and auditable.

## Inputs / Preconditions
- Current `job.status`.
- Actor role and identity.
- Transition intent (e.g., assign, accept, start, submit review, confirm, dispute).

## Canonical States
`pending -> assigned -> accepted -> working -> reviewing -> completed`
Alternative branch: `reviewing -> disputed -> completed|cancelled`.

## Validation Rules
- Transition must be in allowed transition map.
- Actor must have permission for transition action.
- Required fields per transition must be present (e.g., tech id on assign).
- Terminal states reject non-admin reopen operations unless explicitly supported.

## Side Effects
- Append timeline/audit event for every transition.
- Trigger notifications to relevant participants.
- Trigger downstream hooks (finance/wage/reporting) for completion states.

## API + Table Contracts
- Tables: `jobs`, `job_logs`.
- Endpoints should be command-oriented per transition where possible.

## Error Handling
- `409 Conflict` for invalid transition from current state.
- `403 Forbidden` for insufficient role.
- Structured response includes `current_status` and `allowed_actions`.

## Acceptance Checklist
- Invalid transitions are blocked with clear messages.
- Valid transitions write both state and timeline log.
- Dispute branch can resolve back to completed/cancelled correctly.
- UI action buttons match backend allowed actions.
