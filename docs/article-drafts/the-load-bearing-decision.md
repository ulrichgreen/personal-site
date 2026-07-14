# The Load-Bearing Decision

> Every design problem contains one decision that carries the others. Find it, make it early, and build around it — not toward it.

**Description.** In any project a handful of choices are structural: they decide what the other choices are allowed to be. The data model that determines every API shape above it. The URL scheme that determines what can be cached. The one-transport rule that determines how every integration works. This essay is about the skill of *identifying* the load-bearing decision quickly — the tells: high fan-out (everything references it), high reversal cost (changing it means changing everything), and the way other questions go quiet once it's answered — and the practice of making it deliberately early, so the remaining decisions become small, local, and cheap. Build around the settled center, not toward a center you're hoping to reach.

**Why it lands.** Decision-making advice is either prioritization frameworks (treats all decisions as a ranked list) or big-design-up-front vs. iterate-everything tribalism. This cuts differently: most decisions genuinely don't matter much and should be made fast and shallow — *because* one or two matter enormously and deserve the concentrated attention everyone spreads thin instead. Readers get the diagnostic (fan-out, reversal cost, quieting), the failure story they'll recognize (a team politely deferring the structural decision while making forty downstream ones, each secretly betting on an answer), and permission to be decisive about the trivia.

## Outline

1. **Eight weeks, one decision.** On short projects you learn triage brutally: among a vague brief's hundred questions, one answer makes eighty of them fall into place. The skill was never speed — it was knowing which question was holding the others hostage.
2. **What load-bearing looks like.** Three tells. Fan-out: every other document references it. Reversal cost: changing it later means changing everything built since. Quieting: once answered, questions downstream stop being arguments and become chores.
3. **The deferral trap.** Teams defer the big decision to "keep options open" — then make forty small ones anyway, each silently assuming an answer. The options were never open; the assumption was just unexamined. Deferred structural decisions don't wait — they get made by accretion.
4. **Around, not toward.** Building *toward* a decision means hoping the pieces will meet in a middle nobody has defined. Building *around* one means the center is fixed and every piece can be checked against it. The second is how the pieces turn out to fit.
5. **Spend attention where the fan-out is.** The corollary that frees you: everything that isn't load-bearing should be decided quickly, shallowly, reversibly — defaults, conventions, whatever's boring. Decisiveness about trivia is what funds deliberation about structure.
6. **When you choose wrong.** Sometimes the center was misidentified. The tell is friction *against the grain* — every new feature fights the same wall. The move is the honest re-founding, early, while the accretion is still thin.
7. **Close.** Design is not a hundred decisions. It's one or two, plus consequences. Find yours before it finds you.

**Notes.** Personal-voice essay rooted in studio/consulting experience; also the through-line of the platform material (the caching model, the one transport — each a load-bearing decision the other drafts orbit). Related: published `on-constraints` and `on-simplicity`; this completes an informal decisions trilogy.
