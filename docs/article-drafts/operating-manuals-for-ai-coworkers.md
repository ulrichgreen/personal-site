# Operating Manuals for AI Coworkers

> Prompting is improvisation. What a working relationship with an agent actually needs is a written operating manual: the rules, the tests, and the moves it may never make unasked.

**Description.** The agent-instructions file is becoming a genre of technical writing, and almost nobody treats it as one. This essay describes what belongs in a good operating manual for AI coworkers, drawn from practice: one governing rule stated as a test (not a vibe); hard tripwires — *ask before any structural move, rename, or deletion*; *verify any recalled claim against current source before asserting it*; a lightweight inline protocol for delegated edits (markers that are instructions, applied then removed); scoped skills with explicit triggers and — rarer and more valuable — explicit *when-not-to-use* sections; and the demand that contradictions found mid-task get resolved in the same pass, not left as two versions.

**Why it lands.** Most agent-instruction advice is prompt-engineering folklore; this treats the file as what it actually is — a management document, closer to onboarding a sharp contractor than incanting at a genie. The specifics are the value: readers can lift the tripwires verbatim, and the framing scales past today's tools (whatever the agents become, the written rules of engagement remain yours to author). The deeper observation gives it staying power: writing the manual forces you to discover what your *own* operating rules were, which turns out to be worth the exercise even before the agent reads it.

## Outline

1. **The improvised coworker.** Every session begins with re-explaining the same expectations, and every lapse is the same lapse. The problem isn't the agent's memory; it's that the expectations were never written down anywhere.
2. **One governing rule, stated as a test.** The best manuals lead with a single decidable question that settles most cases ("does this belong at this altitude?", "would a user notice?"). Rules that need judgment get a test; tests get followed.
3. **Tripwires for the irreversible.** Ask before structural moves, renames, deletions. Verify recalled claims against current source before asserting them. These two lines prevent the two worst agent failure classes: confident destruction and confident fiction.
4. **Protocols beat conversations.** Inline markers that mean "apply this and remove the marker." Dated status lines the agent maintains. Same-pass rules ("when you find neighbouring docs contradicting, resolve it now"). Small mechanical contracts, cheap to state, compounding in effect.
5. **Skills with when-not-to-use.** Recurring jobs get a written workflow with a trigger *and a boundary*. The when-not-to-use section is the mark of a mature manual — scope is defined by what's outside it.
6. **Leave it cleaner.** The manual encodes a posture, not just procedures: preserve uncertainty rather than smoothing it, flag the partially-confirmed, tidy what you touched. You are writing your engineering values in a form something else can execute.
7. **Close.** The manual outlives the model. Whatever ships next quarter, the document that says how you work — what to ask, what to verify, what never to touch unasked — was the durable artifact all along.

**Notes.** Derived from the private repo's agent rules and skill definitions plus this site's own agent files: quote-lift the rules, drop all repo names. Related: `teach-the-machine-to-hedge.md`, `confidently-wrong.md` — the working-with-agents series.
