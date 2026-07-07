# Flow Design + module spec are the canonical source of page identity

When a built mockup's module code or scope disagrees with the `Flow Design/` flowcharts and the `.claude/skills/sangwijit-portal/modules/` spec, the Flow + spec win and the mockup is corrected to match — not the other way around.

We chose this because the portal is explicitly designed "by reference to the flowcharts," so the diagrams must be the fixed point. The reconciliation audit (2026-05-29) found code drift was the root cause of every duplicate / excess / misplaced page (e.g. SL-5 built as CRM instead of Credit Memo; FI-3/4/5 mislabeled, leaving Bank Reconciliation and General Journal with no page). Treating the spec as canonical makes cleanup deterministic: any code-vs-spec mismatch is a defect in the mockup.

## Consequences

- Some working mockups will be renumbered, repurposed, or retired to match the spec — accepted cost.
- A mockup with no backing flow is "excess" and must be either tied to a flow (add it to `Flow Design/` first) or removed.
- A flow with no mockup is a real gap, even if a similarly-named page exists under the wrong code.
