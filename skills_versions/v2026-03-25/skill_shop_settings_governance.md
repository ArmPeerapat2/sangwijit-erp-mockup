# Skill: Shop Settings Governance

## Purpose
Manage immutable operational settings and controlled shop-level configuration changes.

## Inputs / Preconditions
- Shop context and actor role.
- Settings domains: general, roles, zones, wage/payment defaults, invites.

## Validation Rules
- Immutable fields (e.g., canonical shop code after lock) cannot be edited.
- Role updates must preserve at least one active owner/admin by policy.
- Zone names must be unique per shop.

## Governance Rules
- High-risk setting updates are audit-logged with before/after snapshot.
- Invite/application states follow explicit transitions.
- Agreement snapshots are immutable once accepted.

## Side Effects
- Settings changes update effective policies used by assignment/rate engines.
- Invite actions can trigger onboarding notifications.

## API + Table Contracts
- Tables: `shops`, `shop_users`, `shop_zones`, `tech_zone_assignments`, `shop_invite_links`, `tech_shop_applications`, `tech_shop_agreements`.

## Error Handling
- Reject inconsistent role matrix updates.
- Reject zone delete when active assignments exist unless reassigned.

## Acceptance Checklist
- Settings forms enforce validation and permission at both UI/service layers.
- Changes are fully visible in audit timeline.
- Invite-to-application flow is traceable end-to-end.
