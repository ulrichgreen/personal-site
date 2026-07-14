# No Side Effects in Cached Bodies

> A cached function's body only runs on a miss. Everything you put inside it — the counter, the log line, the audit record — silently stops happening the moment the cache starts working.

**Description.** A small rule with three-bug reach: never emit metrics, logs, or compliance records inside a function whose result is cached or memoized. On every hit, the body is skipped — so your metrics under-report in exact proportion to your cache's success, and your "who accessed what" audit trail develops holes precisely on the hot path. Observability and record-keeping belong at the boundary the cache cannot skip.

**Why it lands.** It's the rare bug that is simultaneously a performance artifact, an observability failure, and (in regulated settings) a compliance breach — and it's invisible in development, where caches are cold and everything runs. Readers will check their codebases immediately; most will find an instance. The deeper lesson generalizes to memoization, `useMemo`, HTTP caches, and materialized views: caching changes *how often code runs*, and anything that assumed "per request" needs a new home.

## Outline

1. **The graph that improved.** Traffic doubled; the "documents viewed" metric halved. Nothing broke — the cache got warm. The instrumentation was inside the thing being cached.
2. **The mechanism.** Caching a function means replacing execution with lookup. Every side effect in the body inherits the cache's hit rate as a sampling rate — unchosen, unmarked, varying with load.
3. **The three faces.** A counter that lies (observability). A debug log that goes quiet exactly when traffic spikes (operations). An access record that skips reads served from cache (compliance — the one that turns into a finding).
4. **The structural fix.** Side effects move to the uncached boundary — the gateway in front of the cache, the handler above the memoized call. One place, always executed, deduplicated per request. Per-callsite discipline ("remember not to log in cached functions") decays; a boundary doesn't.
5. **The corollary for accessing data.** If a record must exist for every access, it must be written where every access passes — which means the *architecture* has to have such a place. Not every codebase does; that absence is the real bug.
6. **Test it like an invariant.** Warm the cache, hit it again, assert the record was still written. Two requests and an assertion — cheaper than the incident review.
7. **Close.** "This code runs once per request" is an assumption, not a law. Caches revoke it without telling you.

**Notes.** Compact nugget — could publish early. From private direction notes (data-access/observability/privacy access-logging): generalize; no internal details needed. Cross-reference `caching-other-peoples-secrets.md` (rule three there is this essay's compliance face).
