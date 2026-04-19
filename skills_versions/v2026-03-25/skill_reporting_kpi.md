# Skill: Reporting & KPI Aggregation

## Purpose
Provide consistent KPI dashboards and operational reports across jobs, staff, and financial performance.

## Inputs / Preconditions
- Event logs, job states, payment data, staff performance metrics.
- Time window, shop scope, role-based visibility constraints.

## KPI Domains
- Job throughput and status mix.
- Assignment/response times and SLA adherence.
- Revenue, payout, spread, and overdue balances.
- Technician productivity and quality signals.

## Validation Rules
- Aggregations must use single source metric definitions.
- Role-based masking applies to sensitive financial KPIs.
- Timezone and period boundaries are explicit.

## Side Effects
- Optional scheduled materialization for heavy reports.
- Alert generation when thresholds are crossed.

## API + Table Contracts
- Source tables: `jobs`, `job_logs`, `wage_calculations`, `payment_transactions`, `platform_revenue_records`.
- Report API must accept filters and pagination.

## Error Handling
- Missing data periods are represented explicitly, not silently dropped.
- Aggregation failures emit observability events.

## Acceptance Checklist
- Dashboard totals reconcile with raw transactional data.
- Filters return deterministic, repeatable results.
- KPI definitions documented and versioned.
