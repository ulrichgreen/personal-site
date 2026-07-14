# Invalidate on Ready, Not on Publish

> The publish event tells you the old version is obsolete. It does not tell you the new version is available. Refreshing on the wrong signal re-caches the stale thing with a fresh timestamp.

**Description.** A small, unglamorous distributed-systems insight from the content pipeline: when content flows publish → index → API, invalidating your cache on *publish* makes you refetch before the pipeline has caught up — you evict the stale entry and then faithfully re-cache it. The correct signal is the one that means "the read path now serves the new version." A nugget essay about picking invalidation signals by what they actually guarantee.

**Why it lands.** This is the kind of bug that costs teams a week and produces a superstition ("our cache is flaky") instead of a diagnosis. The general principle — every event in a pipeline guarantees something specific, and cache freshness must key on the guarantee you need, not the event that arrives first — transfers to search indexes, CDNs, read replicas, and message queues. Readers get a story they've lived, an explanation that finally names it, and a checklist that prevents it.

## Outline

1. **The bug report.** "Editors publish, the site updates — sometimes." The cache was invalidated on every publish, immediately. That's the problem.
2. **The pipeline has a middle.** Publish is the *start* of propagation, not the end. Between the editor's save and the read API's new answer there is indexing, replication, eventual consistency — a window in which refetching is worse than doing nothing.
3. **Signals and their guarantees.** Enumerate what each available event actually promises. The publish webhook: intent. The indexing-complete webhook: availability on the read path. Only one of these is a freshness signal.
4. **Expiry is a safety net, not a mechanism.** Time-based TTLs measured in hours as the backstop for missed events — never the thing you rely on for freshness. If TTL is doing the work, you've chosen "always slightly stale" and should at least admit it.
5. **Bursts and debounce.** Bulk operations fire event storms; invalidate-per-event becomes a self-inflicted cache flush. Debounce from day one — precise per-item invalidation is the escalation path, not the starting point.
6. **Setting human expectations.** Preview is the instant feedback loop; the live site follows within moments, not milliseconds. Editors perceive publish-to-live lag as "broken" only if nobody told them the model.
7. **Close.** Ask of every invalidation signal: what, exactly, does this event guarantee is true at the moment it fires? Cache freshness is built on guarantees, not on notifications.

**Notes.** Short, concrete, high-transfer — good candidate to publish early and gauge appetite for the systems material. From private direction notes (content-caching notes): the CMS/search-index specifics generalize to any publish→index→read pipeline; keep vendor names out of the spine (one aside naming real-world instances is fine).
