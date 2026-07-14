# Earn the Extraction

> Shared code is born a liability and must earn its way to asset. Extract from what an app actually needed — never design the shared thing first.

**Description.** Two disciplines, one lifecycle. At birth: a shared package must clear a real bar — three genuine consumers, no runtime imports of test scaffolding, no domain fixtures smuggled in, and the test that matters most: teams would actively resent rebuilding it locally. At death: the oversized shared package nobody dares touch gets decomposed by strangler — capabilities peel off one at a time into owned packages, each peel following a proven model, until what remains is only what was ever genuinely shared.

**Why it lands.** "Don't repeat yourself" produced a generation of premature platform teams and shared-utils graveyards, and the pendulum-swing rebuttals ("just copy-paste!") are as lazy as the sin. This essay offers an actual mechanism for both directions: concrete extraction criteria on the way up, the peel on the way down, and the observation that ties them together — the shared package that hurts you is almost always one that was *designed* rather than *extracted*. Readers get to diagnose their own monorepo within one scroll.

## Outline

1. **Two graveyards.** The `shared/utils` package with forty consumers and no owner, and the twelve almost-identical `formatDate` functions. Both are failures of the same skill: knowing when sharing is earned.
2. **Standardize before abstracting.** First make the apps do the thing the same way, locally. Convergent local implementations are the evidence; the abstraction is the reward, not the plan.
3. **The bar for a shared package.** Three real consumers (not two, not "soon"). No hidden auto-mocking or domain fixtures. Not imported by runtime code (for test scaffolding). And the resentment test: would teams be annoyed to rebuild it? If not, it isn't earning its coordination cost.
4. **Extracted, not designed.** The healthiest shared code is lifted from the app that proved it, keeping the shape usage gave it. Speculative design bakes in requirements nobody had.
5. **The other direction: the peel.** The legacy shared package everyone depends on and no one owns. No big-bang rewrite: peel one capability at a time into an owned package with a real contract, prove the model on the first peel, repeat. The package shrinks until what's left is only what was genuinely shared — often surprisingly little.
6. **Peer dependencies are the knot.** What actually blocks decomposition is rarely code — it's the coupling nobody chose, like a peer dependency that forces every consumer to share one version of everything. Untying it is the first peel's real job.
7. **Close.** Sharing is a tax that should be levied only where the alternative is worse. Both the bar and the peel exist to keep that sentence true over time.

**Notes.** From private direction notes (testing shared-primitive bar, shared-package decomposition notes): fully generalizable. Wide audience; monorepo-era timely. Related: `on-simplicity` (published) — this is its organizational sequel.
