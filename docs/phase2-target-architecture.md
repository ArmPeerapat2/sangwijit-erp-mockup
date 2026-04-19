# Phase 2 — Target Architecture Proposal (Separated Development)

## Objective
Create a clean, independent ERP mockup foundation that can evolve without mixing with the original source.

## Proposed principles
1. **Isolation-first**: keep all new work on dedicated branch namespace `dev/*`.
2. **Contract-first**: define data contracts before UI implementation.
3. **Modular domains**: separate ERP modules (auth, users, inventory, purchasing, sales, reporting).
4. **Replaceable infrastructure**: use adapters to swap DB/auth providers later.

## Suggested repo layout
```text
.
├── apps/
│   ├── web/                 # Frontend app (dashboard, module UIs)
│   └── api/                 # Backend API service
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── config/              # Shared lint/ts/build configs
│   ├── types/               # Shared domain types/contracts
│   └── utils/               # Shared helper functions
├── docs/
│   ├── phase1-structure-audit.md
│   ├── phase2-target-architecture.md
│   ├── domain-model.md      # Entities & relationships
│   └── api-contracts.md     # Endpoint + payload definitions
├── .github/workflows/       # CI checks (lint/test/build)
└── README.md
```

## Domain boundaries (initial)
- **Auth & RBAC**: users, roles, permissions.
- **Master Data**: products, suppliers, customers, warehouses.
- **Inventory**: stock ledger, adjustments, transfers.
- **Purchasing**: PR/PO lifecycle and receiving.
- **Sales**: quotations, orders, invoicing.
- **Reporting**: summary KPIs and export endpoints.

## API strategy
- REST for core CRUD + workflows.
- Consistent envelope response (`data`, `meta`, `error`).
- Versioned path (`/api/v1`).
- OpenAPI spec as source of truth.

## Data strategy
- Start with relational schema (PostgreSQL-compatible).
- Soft delete + audit columns (`created_at`, `updated_at`, `created_by`, `updated_by`).
- Transaction boundaries for stock-affecting operations.

## Development workflow (separated from original)
1. Create and stay on `dev/redesign-v1`.
2. Commit by module scope (small, reviewable PRs).
3. Keep architecture docs updated alongside code.
4. Merge only through PR review.

## Next execution tasks (Phase 3 preview)
1. Scaffold monorepo directories.
2. Add base lint/format/test scripts.
3. Implement auth + master data slice end-to-end.
4. Add seed data for demo environment.
