# The Smallest Test That Can Fail for the Right Reason

> A test suite is not a museum of effort. If a refactor breaks ten tests and no behavior changed, delete the ten tests — they were guarding structure, not users.

**Description.** A testing philosophy in one governing rule — choose the smallest test that can fail for the right reason — and the unfashionable corollaries it licenses. Delete tests that break on renames: a test that fails every time an internal function changes is protecting structure, not behavior. Refuse the monorepo-wide coverage number: one percentage pretending all code has the same risk profile is theater — coverage should drive questions, not box-ticking. Treat mocking pain as a design signal: needing to mock five framework modules to test one change means the code is too coupled — fix the design, don't paper it with more mocking. And treat flakes as defects in the delivery system: a spec that flakes twice in a week gets quarantined with an owner and a fix-by date, never retried into silence.

**Why it lands.** Testing discourse oscillates between coverage maximalism and testing nihilism; this stakes out the judgment position with concrete, defensible rules — each one a permission slip for something readers already suspected (that deleting tests can be an act of maintenance; that the coverage gate is measuring the wrong thing) backed by a criterion that keeps the permission from becoming sloppiness: *would a real user notice if this broke?* The keep/delete question makes the whole philosophy portable in eight words.

## Outline

1. **The refactor that broke ten tests.** No behavior changed; ten red tests. The instinct is to update them. The better question: what were they testing, that a pure rename could kill it? Structure. They were structure all along.
2. **The governing rule.** The smallest test that can fail for the right reason. Small: cheapest level that captures the behavior. Right reason: a user-observable promise broke — not a private name, not an implementation order, not a snapshot's whitespace.
3. **Deletion is maintenance.** Tests that guard structure punish improvement — they make refactoring expensive exactly when refactoring is the right move. Deleting them isn't lowering the bar; it's re-aiming it at behavior.
4. **Mocking pain is design feedback.** When testing one change requires stubbing half the framework, the test isn't hard — the coupling is. Listen to the test's complaint about the code instead of overpowering it with tooling. (Nuance survives: a provider or two isn't a stop sign; five are.)
5. **Against the single number.** One coverage percentage across code with wildly different risk is a number about nothing. Tier the expectations: the money path, the shared contract, the scaffolding — each gets the scrutiny its failure cost earns. Coverage drives questions, not compliance.
6. **Flakes are defects, not weather.** Retrying until green teaches the suite to lie. Two flakes in a week: quarantine, owner, fix-by note. The suite's credibility is the asset; every tolerated flake spends it.
7. **Close.** The test suite exists so you can change things. The moment it mainly punishes change, it has defected — audit it with the same question you'd audit anything: would a user notice?

**Notes.** From private direction notes (testing domain philosophy): fully generalizable, quote-rich. Wide audience; likely high-circulation candidate. Related: `gate-on-invariants-not-changelogs.md` (invariant tests are this rule applied upward), `the-ratchet.md`.
