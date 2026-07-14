# No Decision Ledger

> I stopped numbering decisions. When a choice changes, the text changes. The right direction speaks for itself.

**Description.** A heresy against ADR culture, carefully scoped. Architecture Decision Records optimize for the archaeologist: someone reconstructing why, in sequence, with superseded-by chains. But a steering document optimizes for the navigator: someone asking *what is true now*. For direction, the ledger is the wrong shape — settled choices should simply be the current text, dated inline (`Settled 2026-07`), with one honest marker for the gap between deciding and shipping (`settled — not yet in code`). History lives in version control, where it always did.

**Why it lands.** ADRs are the current good-practice consensus, and consensus is exactly where a sharp scoping argument earns its keep. The essay doesn't torch decision records — it splits the audiences: ledgers for *contracts* (cross-team boundaries, compliance evidence, things outsiders must trace), living text for *direction* (one navigator, or one team, steering). The tell it hands readers is immediately useful: if your decision log's "superseded by" chains are longer than the documents they point to, you've been maintaining archaeology instead of direction. Guaranteed discussion-starter with the architecture crowd.

## Outline

1. **Decision 047 supersedes Decision 031.** A wiki of numbered records, each true at the time, arranged in strata. To learn the current caching policy you read four documents in reverse-chronological order and hope. The record of deciding has replaced the decision.
2. **Two readers, two shapes.** The archaeologist asks *why did this change, when, by whom* — serve them a ledger. The navigator asks *what do we believe now* — serve them current text. Most decision systems silently assume every reader is an archaeologist; almost every actual reader is a navigator.
3. **The living-text alternative.** The direction doc states what is chosen, with the date inline. When the choice changes, the text changes — and version control keeps the archaeology for free, better than hand-maintained supersession chains ever did.
4. **The two markers that matter.** `Settled (date)` — this fork is closed, stop reopening it. `Settled — not yet in code` — the honest gap between direction and reality, which is the single most useful status a plan can carry.
5. **Where ledgers still win.** Contracts across team boundaries; decisions regulators or auditors must trace; anywhere the deciding *process* is the evidence. The scoping rule: the ledger earns its overhead when someone outside the room needs the trail.
6. **What the change does to writing.** Without a ledger to hide in, the direction text must stay coherent — you can't append your way out of a contradiction. That pressure is the feature: every edit re-argues the whole position or shrinks it.
7. **Close.** Keep records where records are owed. Where you're steering, keep the map current instead — the map's history is not the map.

**Notes.** The most argumentative candidate in the direction group — expect (welcome) disagreement. Personal-practice framing; no employer context. Related: `would-it-survive-a-rewrite.md`, `the-direction-layer.md`.
