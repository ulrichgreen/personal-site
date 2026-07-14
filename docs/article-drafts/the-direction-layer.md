# The Direction Layer

> Beside the codebase, I keep a second repository. It holds what stays true when the code changes — and it flows one way.

**Description.** A tour of a working practice: a private direction layer — a plain-text repo of vision, per-area direction, cross-cutting bets, and open questions — that steers development without being process. Its rules are few and load-bearing: membership by the rewrite-survival test; settled choices as current text, not ledger entries; open questions kept as an honest index of live forks; raw capture distilled upward; and strict one-way flow — the direction layer informs the codebase, the codebase never references it back. Not a backlog, not a wiki, not a second brain that hoards: a steering instrument.

**Why it lands.** Second-brain content is saturated with app tours and capture porn; engineering-strategy content assumes a committee. This sits in the empty intersection: one person, plain text files, steering a real platform — with the failure modes of both genres designed out (no rot, because implementation detail is banished; no process theater, because nobody else has to know it exists). The one-way rule is the provocative part: your steering notes should be an *optional superpower*, never a required sidecar the team must consult. Readers get a system they could start this weekend with a folder and five conventions.

## Outline

1. **What it is.** A private repo of text files above the codebase: a charter, per-area direction docs, one file per cross-cutting bet, one index of open questions, one raw inbox. No tasks, no tickets, no code coordinates.
2. **The membership test.** Everything admitted must survive a from-scratch rewrite of the code. This single rule keeps the layer from becoming a mirror of the codebase — mirrors rot.
3. **One-way flow.** Direction informs how the code gets built; the code never links back. The team's planning happens in the team's terms, in their repos. The layer is a superpower you attach, not a dependency you impose — which is also what keeps it honest: it must earn its influence through better decisions, not citation.
4. **Bets, not epics.** Cross-cutting invariants get one document each — the thing that must stay true across areas — with the owning areas linking to it instead of restating it. Restatement is where contradictions breed.
5. **The live-fork index.** Every genuinely open question, one line each, in one place. Resolved questions don't get archived — they dissolve into direction text. The index is a map of your actual uncertainty, which is the most valuable map you own.
6. **Distill upward.** Meeting notes, raw captures, research feeds sit at the bottom as evidence. Insight moves up into direction; the raw material stays as record. Nothing at the bottom is ever the source of truth.
7. **What it costs.** Tending. The status lines carry dates; drift gets marked or fixed in the same pass. A direction layer you don't weed is worse than none — it becomes confident fiction.
8. **Close.** The codebase remembers what you built. Something should remember what you meant.

**Notes.** Write as personal practice, fully employer-anonymous, and don't name the private repo. The site's own docs folder (manifesto → roadmap → future-ideas → inspiration) is the public, small-scale instance of the same idea — a nice closing symmetry. Related: `would-it-survive-a-rewrite.md`, `no-decision-ledger.md`, `open-questions-are-live-forks.md`.
