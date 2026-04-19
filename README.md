# sangwijit-erp-mockup (Independent Redesign Track)

This repository is an isolated ERP mockup redesign track, intentionally separated from any original upstream implementation.

## Status
- ✅ Phase 1: structure audit complete
- ✅ Phase 2: target architecture defined
- ✅ Phase 3: runnable scaffold with baseline checks
- ✅ Interface mockup: dashboard screen added (`apps/web/index.html`)

## What is now implemented
- Root workspace scripts with real runnable checks (`lint`, `build`, `test`).
- API/Web starter modules with deterministic functions.
- Shared packages (`ui`, `types`, `utils`, `config`) with importable exports.
- Node test suite validating core behavior.
- CI workflow running lint + build + test.
- Basic ERP dashboard UI mockup (sidebar, KPI cards, recent orders table).

## Interface preview entry
- Open `apps/web/index.html` in browser.
- Or run `npm run dev -w @erp/web` then open `http://localhost:4173/apps/web/`.

## Workspace structure
- `apps/web` — frontend starter module + mock dashboard interface
- `apps/api` — backend starter module (`healthcheck`)
- `packages/ui` — UI helper (`badge`)
- `packages/types` — type/domain guards (`isEntityId`)
- `packages/utils` — utility helpers (`identity`, `toSlug`)
- `packages/config` — shared runtime config constants

## Architecture docs
- `docs/phase1-structure-audit.md`
- `docs/phase2-target-architecture.md`
- `docs/domain-model.md`
- `docs/api-contracts.md`

## Branching strategy
Use `dev/*` branches for implementation slices to keep work separated and reviewable.
