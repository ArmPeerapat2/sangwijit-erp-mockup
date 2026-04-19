# Skill: RBAC & Permission Guard

## Purpose
Enforce access control consistently across route, UI action, and service/data layers for `super_admin`, `owner`, `admin`, `coordinator`, and `technician`.

## Inputs / Preconditions
- Authenticated user context with `platform_role` and optional `shop_role`.
- Target resource metadata: `shop_id`, `job_id`, action intent.
- Permission matrix source (update-first docs, fallback main).

## Validation Rules
- Deny by default for undefined role-action.
- Route access requires explicit allow rule.
- Action access requires explicit allow rule.
- Sensitive fields are masked when role lacks permission.

## State / Policy Model
- Policy key format: `<resource>:<action>`.
- Evaluation order:
  1. Super admin override (if configured)
  2. Shop role policy
  3. Ownership/scope check (same shop)
  4. Field-level visibility rules

## Side Effects
- Permission denied events are logged (minimal audit).
- Security-sensitive denies can emit warning telemetry.

## API + Table Contracts
- Tables: `users`, `shop_users`, `jobs`.
- Service boundary should accept actor context and apply masking before returning payload.

## Error Handling
- `403 Forbidden` for unauthorized actions.
- `404` may be returned instead of `403` for hidden resources by policy.

## Acceptance Checklist
- Route guard blocks unauthorized screens.
- Hidden actions are not executable through direct API call simulation.
- Sales/coordinator cannot access admin-only wage or assignment actions.
- Field masking works for phone/address/price/wage by role.
