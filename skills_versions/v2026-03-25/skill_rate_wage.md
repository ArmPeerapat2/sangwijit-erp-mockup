# Skill: Rate & Wage Calculation

## Purpose
Compute effective customer rate and technician wage from platform catalog + shop overrides with auditable snapshots.

## Inputs / Preconditions
- Job type, brand/service item, shop id.
- Platform catalog defaults.
- Shop override settings.
- Adjustment factors (distance, bonus, penalty).

## Calculation Rules
- Effective base rate uses shop override if active; otherwise platform rate.
- Wage = base wage + bonuses - penalties.
- Out-of-zone surcharge and quality bonus follow settings policy.
- Negative net wage is clamped by business policy (or blocked).

## Snapshot Rules
- Persist calculation snapshot at assignment and/or completion.
- Snapshot must include source rates and applied modifiers.

## Side Effects
- Store wage calculation record for payroll and audit.
- Expose preview values in admin UI before confirmation.

## API + Table Contracts
- Tables: `platform_service_catalog`, `shop_catalog_overrides`, `wage_calculations`.
- Inputs should be validated server-side before save.

## Error Handling
- `422` for missing mandatory rate config.
- Validation error when override causes invalid range.

## Acceptance Checklist
- Same input set always yields same deterministic result.
- Override precedence is applied correctly.
- Snapshot is immutable after confirmation.
- Payroll can consume wage records without recalculation drift.
