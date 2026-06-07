# FI-7 is the VAT report (ภ.พ.30), not period close

FI-7 names the Portal page that lists Output/Input VAT per period, releases it, and prints it for ภ.พ.30 filing — and nothing more. Period close (locking an accounting period) is a BC365-owned operation with no Portal page (cut-to-BC), alongside General Journal / JV (FI-4, also cut-to-BC).

This contradicts the module spec as written (`sangwijit-portal-skill/modules/FI_finance.md`), which defined FI-7 as "รายงาน VAT + ปิดงวด (Period Close)" at Phase 3 and bundled a five-step close workflow. We chose the flow over the spec text because the canonical flows separate the two concerns: `Account/Flow/06 - Sales VAT Purchase VAT` is a List → Release → Print register sitting entirely in the BC365 lane, while period/year close have their own flows (`Account/Flow/08 Close Period`, `09 Close Year`). The user-confirmed `finance-flow-understanding.md` (2026-05-29) already treats FI-7 as a P1 VAT report and flags the spec's P3 as wrong. Per ADR-0001 the flow wins, so the spec is corrected and the mislabeled `fi3-tax-reconciliation` page is recoded to FI-7.

WHT (ภ.ง.ด.3/53) is a separate page, FI-12 — not part of FI-7. The existing `fi3-tax` page conflated VAT + WHT in one 3-tab screen; that split is tracked separately.

## Consequences

- `fi3-tax-reconciliation-mockup.html` is recoded to FI-7 and retitled "รายงานภาษีขาย/ภาษีซื้อ (ภ.พ.30)"; its WHT tabs move to FI-12. This frees the FI-3 code, which now belongs solely to Bank Reconciliation — resolving a duplicate-FI-3 sidebar collision across ~74 files.
- The spec's FI-7 entry is rewritten (scope = VAT report, Phase P1); references to "ปิดงวด (FI-7)" in FI-3, FI-8, and the business rules are corrected — period close is BC365-direct.
- "กระทบยอดภาษี / Tax Reconciliation" is retired as a page name. Reconciling BC VAT against the filed amount is an out-of-flow concern, not this page.
- Period close gains no Portal page. If a close cockpit is ever wanted it needs a new code and its own flow — never FI-7.
