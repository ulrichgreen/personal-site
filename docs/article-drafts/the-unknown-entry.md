# The Unknown Entry

> What your system does with a value it doesn't recognize is not an edge case. It is a stated rule, or it is an accident waiting to be discovered in production.

**Description.** Every registry, enum, allow-list, and vocabulary eventually meets a value it doesn't know: the block type shipped ahead of the renderer, the experiment variant from a stale cookie, the event name from an old client. This essay argues unknown-entry behavior is a first-class part of a contract — skip, serve control, reject, or degrade — and that choosing it per vocabulary, on purpose, is what separates resilient systems from lucky ones.

**Why it lands.** It names a design decision most teams make implicitly and inconsistently — usually four different ways in four different subsystems, each discovered during an incident. The taxonomy is immediately reusable: readers can walk their own codebase asking "what does this do with an unknown value?" and find real bugs the same afternoon. Small, sharp, memorable — a nugget rather than a treatise.

## Outline

1. **Three unknowns, one week.** Opening montage: an unrenderable content block, an unrecognized variant assignment, an event name nobody registered. Three subsystems, three accidental behaviors — crash, cache-poison, silently ingest.
2. **The question nobody wrote down.** Every typed vocabulary implies the question: what happens outside the type? Compile-time safety ends at the boundary; runtime data arrives from the past and the future.
3. **A small taxonomy of answers.** *Skip and log* (a page never crashes over an unknown block). *Serve the safe default* (an unknown variant gets control — and never becomes a shared cache entry keyed by unvalidated input). *Reject loudly* (an unregistered event never enters the pipeline). *Degrade visibly* (preview shows the gap instead of hiding it).
4. **Matching the answer to the failure cost.** Rendering tolerates gaps; caches must never trust unknown keys; data pipelines must never absorb unknown names. The rule follows from what corruption costs downstream, not from taste.
5. **Unknown-entry behavior is contract, so it is testable.** If the rule is stated, there is a test asserting it. The test is cheap; the incident it prevents is not.
6. **The observability rider.** Every unknown handled silently is drift you can't see. Skip *and log and count* — the counter is how you notice the vocabulary outran its consumers.
7. **Close.** Systems are judged by what they do with input they never expected. Decide it; write it down; test it.

**Notes.** Could be the sharpest short piece in the set. From private direction notes (registry-convention and content-platform notes): pattern-level, fully anonymous. Pairs with `five-registries-one-shape.md`.
