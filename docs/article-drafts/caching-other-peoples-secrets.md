# Caching Other People's Secrets

> A cache that can show one user another user's data is not slow. It is a breach with good latency.

**Description.** Server-side rendering plus caching plus logged-in users is now the default architecture, and it quietly turned a performance tool into a data-protection boundary. This essay treats cache safety as a correctness discipline: personal data never in shared caches, session identity in the cache key by construction, deny-and-no-store on missing sessions, and the compliance record written where the cache can't skip it.

**Why it lands.** Cross-user cache bleed is the incident everyone running a personalized Next.js/SSR app is one refactor away from, and almost nothing written about caching treats it as the headline concern. The essay gives readers structural rules rather than vigilance ("be careful with cache tags" is not a strategy) — and the closing move, an isolation test that runs on every PR, turns a scary compliance topic into an engineering habit.

## Outline

1. **The incident shape.** User A refreshes and sees user B's account. No attacker, no exploit — just a cache key that didn't include who was asking. The most expensive kind of bug: one that worked correctly for every developer who tested it alone.
2. **Performance tool, protection boundary.** The moment personal data enters a server cache, the cache stops being an optimization detail and becomes part of your security model. Most teams never perform this reclassification.
3. **Structural rule one: identity in the key.** Session-scoped data is keyed by session — in the key itself, never a tag, never a filter applied after lookup. Keys partition by construction; everything else partitions by promise.
4. **Structural rule two: missing identity is deny.** The fail-open cache — "no session, fall back to the shared entry" — is how helpful defaults become incidents. Deny and no-store, never a shared fallback.
5. **Structural rule three: the record survives the cache hit.** If regulation or ethics requires knowing who saw what, the access log must be written at a boundary the cache cannot bypass — otherwise the hot path is a blind spot exactly when traffic matters.
6. **The test that keeps it true.** One shared cross-user isolation test — user A never sees user B's data — running on every pull request. Invariants that live in review comments decay; invariants that live in CI don't.
7. **Close.** Ask the two-lifetimes question first (is this shared or personal?), then make the personal path safe by shape, not by care.

**Notes.** Companion to `two-lifetimes.md` — that one is the model, this one is the failure mode and its discipline. From private direction notes (data-access, road-to-production): fully generalizable, no internal names needed. GDPR access-logging angle can stay generic ("regulated data").
