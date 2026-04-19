# Skill: Assignment Engine (Zone + Availability)

## Purpose
Select and assign the most suitable technician quickly while preserving manual admin override control.

## Inputs / Preconditions
- Job location, type, requested slot.
- Technician availability, zone coverage, workload, skills.
- Role: admin/owner authorized to assign.

## Candidate Scoring Rules
- Zone coverage match (highest weight).
- Availability for target slot.
- Active workload threshold.
- Optional skill/certification match.
- Tie-breaker by recent assignment fairness.

## Validation Rules
- Assigned tech must be active and linked to shop.
- Out-of-zone assignments require explicit override reason.
- Reassign requires reason and previous assignment log reference.

## Side Effects
- Update `assigned_tech_id` and status (`pending` -> `assigned` or change tech event).
- Write assignment event to timeline with reason.
- Push notification to technician and relevant admin channel.

## API + Table Contracts
- Tables: `tech_shop_memberships`, `shop_zones`, `tech_zone_assignments`, `jobs`, `job_logs`.
- Typical endpoints:
  - suggestion list (top N)
  - assign/reassign command endpoint

## Error Handling
- `422` when no valid candidate is assignable.
- `409` when job no longer assignable due to status race.

## Acceptance Checklist
- Suggestions prioritize in-zone available tech.
- Manual override is possible and always logged.
- Reassign flow preserves full history.
- Notifications are emitted after successful assign/reassign.
