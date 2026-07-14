# By Construction

> A rule that must be remembered will eventually be forgotten. The states worth preventing are the ones you make impossible, not forbidden.

**Description.** The difference between "we never cache personal data in shared entries" as a code-review rule and as a property of the cache key. Between "don't enable mock auth in production" as a warning and as a boot-time assertion that refuses to start. This essay collects the by-construction move across domains — identity in cache keys, mutually exclusive modes, fixture personas instead of real data, deny-on-missing-session — and argues it is the only kind of safety that survives staff turnover, refactors, and Tuesday afternoons.

**Why it lands.** Every engineer maintains a mental list of "things we must never do," enforced by vigilance — and vigilance is the one resource that predictably runs out. The essay gives that anxiety a design method: find the invariant, then move it from prose into structure, where violating it is a type error, a crash at boot, or a lookup that cannot match. Includes a war story readers will feel: a route rename that turned a `startsWith` auth check into a fail-open bypass — a promise-based control failing exactly as promise-based controls do.

## Outline

1. **Two kinds of never.** "We never do X" as culture versus "X cannot happen" as structure. Culture is real but perishable; structure survives its authors.
2. **The rename that opened the door.** A protected-area check matching on a hardcoded path prefix; a locale refactor renames the routes; the check now matches nothing and fails *open*. Nobody did anything wrong in the diff. The control was a promise about strings, and strings change.
3. **Fail-closed is a design property.** The fix is not a better prefix — it's deriving protection from the routing source of truth, so a rename updates the guard by construction. Then generalize: a missing session denies; a missing consent record drops the event; an unknown variant serves control.
4. **Mutually exclusive by boot assertion.** Modes that must never combine (mock auth + real backend, preview + customer traffic) enforced when the process starts. Misconfiguration becomes a crash-loop you notice in minutes, not a quiet door open for months.
5. **Absence by construction.** The preview environment holds no real personal data — not because a policy says so, but because it only contains fixtures. The strongest compliance statements are the ones that describe what *cannot* be there.
6. **Identity in the key.** Cross-user cache isolation as a property of the lookup itself. Anything enforced after the lookup is a filter; filters have bugs.
7. **The honest limits.** Not everything can be structural, and pretending otherwise breeds ceremony. The discipline is noticing which "musts" carry breach-grade consequences — those earn construction; the rest can stay culture.
8. **Close.** Ask of every rule in your review checklist: could this stop being a rule and start being a shape?

**Notes.** A synthesis essay — could anchor the systems series. From private direction notes (security, identity, data-access, cms preview): the rename story must be fully de-identified (generic "locale refactor"). Related drafts: `preview-is-a-second-instance.md`, `caching-other-peoples-secrets.md`, `the-unknown-entry.md`.
