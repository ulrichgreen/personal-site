# Would It Survive a Rewrite?

> One test separates the notes worth keeping from the notes that rot: if the codebase were rewritten from scratch tomorrow, would this sentence still be true?

**Description.** The reason most engineering documentation decays is not laziness — it's that direction and implementation live in the same files, and implementation detail drags everything down with it as it ages. This essay proposes a single membership test for durable planning notes: *would it survive a from-scratch rewrite?* Vision, bets, concepts, trade-offs survive; file paths, function names, API shapes, task lists die with the code. With a companion heuristic that makes the test usable day to day: code *names* are the vocabulary of direction and welcome; code *coordinates* are the tell that a document has slipped altitude.

**Why it lands.** Everyone who keeps engineering notes — personal or team — has watched them rot and concluded documentation is hopeless. The test says: only half of it was documentation; the other half was a screenshot of the code, and screenshots age. The names/coordinates distinction is immediately actionable (grep your docs for `file:line` and you've found the rot vectors), and the essay scales from a personal notes file to a team wiki without changing a word of the principle.

## Outline

1. **Two sentences from the same doc.** "We chose server-side rendering because our pages are content-first" — true for years. "The renderer lives in `src/render/page.tsx`" — false by Thursday. One file, two half-lives; the shorter one wins.
2. **The test.** Would it survive a from-scratch rewrite? What survives is direction: why, trade-offs, bets, vocabulary, boundaries. What dies is implementation: coordinates, shapes, inventories, checklists. Sort every paragraph into one of the two.
3. **Names versus coordinates.** The usable everyday form. "The gateway owns caching" — a name, direction, welcome. "See `gateway.ts:41`" — a coordinate, a screenshot, the tell. Names are vocabulary; coordinates are drift scheduled in advance.
4. **Two homes, one-way flow.** Direction lives above the codebase and steers it; implementation planning lives *in* the codebase, next to what it changes, in the team's own terms. The direction layer informs the code; the code never has to reference back.
5. **Demote, don't delete.** When implementation detail shows up in a direction doc, it isn't wrong — it's misfiled. Mark it and move it down. The altitude rule stays pure without losing the work.
6. **Why this saves documentation.** Docs that contain only survivors don't rot on the code's schedule. They change when the *thinking* changes — which is rare, deliberate, and worth recording.
7. **Close.** Write down what would survive the fire. Everything else, let the code carry — it was always going to anyway.

**Notes.** The flagship of the direction-layer group; the test deserves to be the site's next quotable line. Derived from private planning practice: present it as a personal method, no employer context needed. Related drafts: `the-direction-layer.md` (the system built on this test), `no-decision-ledger.md`.
