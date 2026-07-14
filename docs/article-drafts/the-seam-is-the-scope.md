# The Seam Is the Scope

> Plan your system and the seams where it meets everything else — and not one inch past the seam. The route you own is in scope; the service it calls is not.

**Description.** Scope discipline as a positive design tool. Every planning effort bleeds: the front-end plan grows opinions about backend topology; the API design grows opinions about the data platform. The rule that stops it: own your tier *and its seams* — how you consume auth, content, payments, data — and refuse to redesign what's on the other side, even when you have opinions, even when it's tempting, even when they ask. The test is one question long: *is this our decision?* The BFF route is; the upstream service it calls is not.

**Why it lands.** Scope creep in planning is usually discussed as a time problem; this frames it as a *correctness* problem — plans about systems you don't own are fan fiction with diagrams, and they rot faster than the systems themselves. The seam framing gives readers something crisper than "stay in your lane": seams are *in* scope, and owning them well (contracts, caching posture, failure behavior at the boundary) is most of what good architecture at any tier consists of. Reference what's beyond the seam where it bears on your decision; never own it.

## Outline

1. **The plan that colonized.** A front-end architecture document with a section on backend service topology. Thorough, plausible, and worthless — the owning team never read it, and it aged into misinformation with an author.
2. **Seams are the real surface.** What a tier actually decides: how it consumes identity, how it caches what it fetches, what it does when upstream fails, which contract changes it can absorb. This is where the architecture lives — not in the boxes, in the lines.
3. **The one-question test.** *Is this our decision?* The route handler: ours. The gateway behind it: not ours, reference only. Asked honestly, the question sorts every paragraph of a plan in seconds.
4. **Reference, don't own.** The other side of the seam appears in your plan only as it bears on your decisions: its latency shapes your budget, its auth model shapes your session handling. State the dependency; never redesign the dependency.
5. **Why restraint wins twice.** Plans within your authority can be executed by you — the whole plan is real. And seams stated precisely become negotiation surfaces: the upstream team can meet a contract; they can't meet a critique.
6. **The temptation clause.** You will have good ideas about the other side. Write them as questions across the seam, not designs past it. Influence travels better as a well-specified need than as someone else's architecture, pre-decided.
7. **Close.** A plan's power is proportional to how much of it you can actually decide. Scope to the seam — it's where all your real decisions were anyway.

**Notes.** From private direction notes (VISION scope rules, "is this a front-end decision?"): generic framing, any-tier applicable. Compact essay. Related: `the-direction-layer.md`, `every-unowned-question-answers-itself.md`.
