# Skill: Technician Portfolio

## Purpose
Build a trust-oriented public technician profile from verified completed jobs while protecting customer privacy.

## Inputs / Preconditions
- Completed jobs and quality indicators.
- Privacy settings and display preferences.

## Validation Rules
- Only completed/verified jobs contribute to portfolio metrics.
- Customer-sensitive fields are always masked/removed.
- Public share access is tokenized and revocable.

## Portfolio Components
- Technician profile summary.
- Experience metrics (jobs completed, categories, recency).
- Rating highlights and verified badges.

## Side Effects
- Portfolio auto-refresh on qualifying events.
- Share link/QR generation with access control.

## API + Table Contracts
- Technician profile and portfolio settings tables.
- Public read endpoint with safe projection.

## Error Handling
- Revoked token returns not-found style response.
- Incomplete profile states are surfaced to owner app, not public endpoint.

## Acceptance Checklist
- Portfolio excludes disallowed customer data.
- Public view reflects latest eligible completed work.
- Revocation invalidates prior share link immediately.
