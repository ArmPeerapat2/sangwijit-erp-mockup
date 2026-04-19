# Skill: Financial Flow Core

## Purpose
Handle wage payout, platform spread, shop billing, and monthly financial summaries with traceable records.

## Inputs / Preconditions
- Completed or payable jobs.
- Wage calculation snapshots.
- Shop payment configuration and payout method.

## Validation Rules
- Payout cannot proceed without approved wage snapshot.
- Net amount must be non-negative and balanced with components.
- Duplicate payout for same job is blocked by idempotency key.

## Lifecycle
- Wage record: `pending -> approved -> paid`.
- Payment transaction: `initiated -> processing -> success|failed`.
- Shop invoice: `draft -> issued -> paid|overdue`.

## Side Effects
- Generate payment transaction records.
- Update payroll summary aggregation.
- Update platform revenue/spread records.

## API + Table Contracts
- Tables: `wage_calculations`, `payment_transactions`, `payroll_runs`, `platform_revenue_records`.
- Must support filtered query by shop/date/status.

## Error Handling
- Failed payment stores gateway reference and retry status.
- Partial failure must not corrupt payroll totals.

## Acceptance Checklist
- One completed job maps to one payable wage record.
- Payout reconciliation matches transaction totals.
- Monthly payroll report equals sum of paid wage records.
- Shop invoice reflects agreed spread and period.
