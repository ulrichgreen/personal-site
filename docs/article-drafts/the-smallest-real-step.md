# The Smallest Real Step

> A narrow slice that actually runs settles more arguments than a broad plan that doesn't. When direction is contested, stop widening the document and take the smallest step that touches reality.

**Description.** Against the instinct that hard decisions need more comprehensive plans. When a direction spans systems — a new pipeline, a new integration model — the de-risking move is not another strategy revision; it's one narrow, complete, end-to-end slice: a single flag flowing through server evaluation, one event through the pipeline into one sink, an alert wired to data already flowing. Complete beats broad: the slice must cross *every* boundary once, because the boundaries are where plans lie.

**Why it lands.** "Build a PoC" is common advice; what's rare is the discipline that makes one *evidentiary*: narrowness (one path, no options), completeness (every seam crossed, including the unglamorous ones — consent, auth, the write to the real store), and a stated question it answers. The essay also gives readers the sequencing corollary that sounds obvious and constantly gets violated: start where reality already is — alerts on the telemetry you already emit before new tooling; the smallest real environment before the DR plan — because "failover planning has nothing real to fail over" until production exists.

## Outline

1. **The fourth revision of the strategy.** Each version more complete, more reviewed, more agreed-with — and no more likely to survive contact. Documents converge on consensus, not on truth.
2. **Vertical, not horizontal.** The step that teaches is a slice through every layer, not a survey across them. One flag: decided on the server, exposure emitted, event through the pipeline, past the consent gate, into one real sink. Anything that skips a seam is a demo, and demos only ever succeed.
3. **Narrow is a feature.** One path, one variant, one sink. Every option added to the slice divides its evidence across the options. You are buying an answer, not building a beta.
4. **State the question first.** A slice without a named question answers whatever happened to work. "Can exposure ride the pipeline without a second transport?" is a question; "let's see how it goes" is a vibe with a repo.
5. **Start where reality already is.** Wire alerts to data already flowing before adopting new telemetry. Define the environment before rehearsing its failover. The step must stand on something that exists, or it's the strategy document again, wearing code.
6. **What the slice buys.** The seams that lie get caught (the auth handshake, the consent gate, the write path — never the happy middle). The plan's remaining risk gets a shape. And the next argument is about evidence, which is shorter.
7. **Close.** Direction is set by documents. It is *settled* by the smallest thing that runs.

**Notes.** From private direction notes (experimentation end-to-end PoC framing, observability "smallest real first step", tracking pilot-as-vertical-slice): merge of three domains making the same move. Related: `proof-in-the-lead-app.md` (the org-scale version), `a-gate-not-a-date.md`.
