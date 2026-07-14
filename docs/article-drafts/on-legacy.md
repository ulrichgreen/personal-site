# On Legacy

> "Legacy" is not a status you declare. It is a policy you owe: what may a change to this system still do, and what ends it?

**Description.** Teams declare things legacy and believe they've decided something. They haven't — until a freeze policy exists, "keep the lights on" is reinterpreted per change, per engineer, per deadline: is a security patch allowed? A bug fix? A small feature for the customer who shouted? This essay argues legacy is an operational contract with three clauses — what a change may still do, what may still consume the system (usually: nothing new), and what its exit condition is — and that "temporary" without an owned exit trigger is a synonym for permanent.

**Why it lands.** Every codebase has a system in the gray zone: declared dead, quietly growing. The essay names why (a declaration without semantics delegates the real decision to whoever is under the most pressure) and offers the fix as a one-paragraph policy anyone can write this week. The "temporary means indefinite" half hits the adjacent nerve — the bridge solution whose exit condition has no owner and no trigger, which is to say, no exit. Readers will recognize both failure modes with a wince.

## Outline

1. **The undead system.** Declared legacy two years ago; four features added since. Nobody violated the decision — there was no decision, just a word.
2. **A word is not a policy.** "Keep the lights on" answers nothing concrete: security patches? Crash fixes? The five-line feature that closes a deal? Each maintainer answers differently, and the sum of their answers is the actual policy — unwritten, inconsistent, and growing.
3. **The three clauses.** *Change policy:* what a legacy change may do (e.g., security and data-loss fixes yes; features no; refactors no). *Consumption policy:* no new consumers — legacy status is contagious through every new dependency on it. *Exit condition:* what event retires it — with an owner and a trigger, or it's decoration.
4. **"Nothing" is a real option — but choose it.** For a surface that's being retired anyway, "no maintenance at all" can be right. It should be chosen, not defaulted into; a chosen nothing is a budget, a defaulted nothing is a surprise.
5. **Temporary means indefinite.** The interim bridge, the compatibility shim, the "we'll remove it after the migration" — each needs the same third clause. An exit condition without an owner and a trigger describes a hope, not a plan. Decide even the small ones: actively remove, or explicitly let it die with its host.
6. **Legacy budgets attention, not just code.** The point of the policy is what it frees: every question it pre-answers is a debate the team doesn't have, and investment flows to the strategic surface by default instead of by argument.
7. **Close.** Declaring legacy is easy. Deciding what dying is allowed to look like — that's the work.

**Notes.** From private direction notes (single-design-system open remainder, feature-flag decommission fork, testing "temporary home" note): fully generalizable. Fits the site's "On X" naming line. Compact essay; strong closing-line potential.
