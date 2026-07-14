# The Ratchet

> Turn the strict gate on today. Baseline what exists, block what's new, and give every grandfathered violation an expiry date.

**Description.** The reason quality gates stay off is never disagreement about the standard — it's the four hundred existing violations nobody can fix this quarter. The ratchet dissolves the dilemma: snapshot today's violations into a dated, owned allowlist; flip the gate to blocking for *new* violations immediately; and make allowlist entries expire so the debt stays visible, owned, and shrinking. The same mechanism works for accessibility checks, bundle size, lint rules, type strictness — anything measurable.

**Why it lands.** Every team has a "we should really enforce this" list rotting in a backlog because day-one pain feels insurmountable. The ratchet is the trick that makes strictness adoptable *now*, and its two refinements are the insight: expiry keeps the baseline honest (a grandfather clause without a funeral is amnesty), and the gate-worthiness test — deterministic checks can block today, flaky metrics only observe until their variance is characterized — tells readers which gates deserve the mechanism at all.

## Outline

1. **Why good gates stay off.** The all-or-nothing framing: enforce and break every build, or don't and drift. Teams choose drift, reasonably, forever.
2. **The mechanism.** Run the check, snapshot every current violation into a committed baseline, block anything not in the baseline. New code meets the standard from this afternoon; old code is scheduled, not forgiven.
3. **Expiry is what keeps it honest.** Baseline entries carry dates and owners and *expire*. Without expiry the baseline is amnesty with paperwork; with it, the ratchet only turns one way.
4. **Only moves down.** For quantitative gates (bundle size, violation counts): regressions compare against a committed baseline that improvements re-snapshot. Intentional increases are a reviewed baseline bump — the same muscle as any other contract change.
5. **What may block at all.** Deterministic checks (artifact sizes, violation counts, structural assertions) gate now, no baseline period needed. Nondeterministic metrics (lab performance scores) observe until you've characterized run-to-run variance — a flaky gate teaches people to ignore gates.
6. **A budget without an owner is a dashboard.** The ratchet is mechanical, but each threshold needs a name attached — someone who can approve the bump and answer for the trend. Mechanism without ownership decays into noise.
7. **Close.** Strictness isn't a virtue you adopt; it's a mechanism you install. Install it while the standard still has friends.

**Notes.** Highly practical, wide audience, zero confidentiality risk. From private direction notes (a11y ratchet, the design system bundle ratchet, performance gating rules) — the pattern appearing independently twice is itself evidence it's real. Could include a small worked example (baseline file shape).
