# Confidently Wrong

> A knowledge base with gaps makes agents ask. A knowledge base with errors makes them act. Once machines consume your docs, wrong is strictly worse than missing.

**Description.** The moment you wire documentation into AI agents — a knowledge server, a retrieval layer, an instruction to "consult the docs first" — the risk profile of that documentation inverts. Humans read skeptically; agents read *operationally*: a stale architecture rule doesn't mislead an agent, it *directs* it, at scale, with confidence. This essay argues the live risk moves from building the pipe to governing the corpus: a named owner who can say no; correctness review distinct from shape validation (frontmatter lint is not truth lint); an explicit source-of-truth hierarchy where the derived layer *cites and never contradicts*; and the rule that mandating consultation is forbidden until the corpus has earned it — a trustworthy corpus is a precondition for enforcement, not a consequence of it.

**Why it lands.** Teams are racing to point agents at their wikis, and the failure mode is genuinely new: docs that were harmlessly stale for years become active steering the day an agent trusts them — the guidance that quietly contradicts the accepted architecture now *reverts* correct code. The shape-versus-correctness distinction gives readers a diagnostic their tooling can't (their validators all pass; their content still lies), and the enforcement inversion is the memorable law: push agents toward a corpus only as hard as you'd bet on its accuracy.

## Outline

1. **The doc that fought back.** An agent, dutifully consulting the knowledge base, removes a correct pattern — because a two-year-old page says the pattern is wrong. The wiki was always stale; what's new is that stale now has hands.
2. **Two audiences, two risk models.** Humans discount docs by ambient skepticism they don't even notice using. Agents inherit none of it: retrieval is endorsement. The same sentence has different blast radii depending on what reads it.
3. **Wrong beats missing — in damage.** A gap sends the reader to the source. An error *is* a source. Coverage metrics reward filling gaps; nothing measures the confident lie sitting at 100% coverage.
4. **Shape lint is not truth lint.** IDs valid, frontmatter well-formed, links resolving — and the content inverted. Structural validation gives correctness vibes without correctness. The missing gate is review by someone who knows what's currently true, on a trigger (the code changed) not a calendar.
5. **Derived layers cite, never contradict.** The hierarchy in one rule: decisions and code are truth; the agent-facing corpus is derived, links downward, and loses every conflict by definition. A derived doc that disagrees with its source isn't an opinion — it's drift with authority.
6. **Earn the mandate.** "Agents must consult the KB" multiplies whatever the KB is. Multiplying a trustworthy corpus is leverage; multiplying an unreviewed one is an incident generator with a policy behind it. Governance first, enforcement second — the order is the whole point.
7. **Close.** Documentation used to describe the system. Now it steers the things that build the system. Steering columns get engineering standards; start applying them.

**Notes.** Derived from the private MCP/knowledge-base governance direction: fully anonymize (no server names, no specific wrong entries). Timely and mostly unwritten-about. Related: `your-next-reader-is-a-machine.md`, `operating-manuals-for-ai-coworkers.md`.
