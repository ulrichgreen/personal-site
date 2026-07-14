# Two Lifetimes

> Everything on a personalized page is either shared with everyone or belongs to one person. Cache accordingly, and the whole model falls out.

**Description.** Caching personalized pages is treated as a dark art. This essay argues it reduces to one distinction: shared content is cached once for everyone and invalidated by events; personal data is never in the shared cache and streams in per user. Two lifetimes, one page, no cleverness.

**Why it lands.** Most caching articles are inventories of mechanisms — TTLs, tags, headers, CDN tiers. This one is about the *classification* that makes the mechanisms boring. Readers get a mental model they can apply to any stack: if you can say which lifetime a piece of data has, the caching decision is already made. And the stakes are real — the failure mode is serving one user's data to another, which is not a performance bug but a breach.

## Outline

1. **The page that is both.** An account overview: the shell, navigation, and editorial content are identical for every visitor; the policy list belongs to exactly one. The industry answer — make the whole page dynamic — pays the personalization tax on every byte.
2. **The classification.** Every piece of data on the page answers one question: same for everyone, or specific to this user? There is no third category. Ambiguity here is not nuance; it is a decision you haven't made yet.
3. **Lifetime one: shared, event-invalidated.** Content cached once, keyed by content and language, shared across all users, invalidated when the content actually changes. Time-based expiry demoted to a safety net — hours, never the freshness mechanism.
4. **Lifetime two: personal, streamed.** Personal data never enters the shared cache. It streams into its slot per request while the cached shell serves immediately. If it must be cached at all, the session is in the cache *key* — not a tag, not a header check — so entries cannot leak between users by construction.
5. **Deny is the default.** A missing session is deny and no-store, never a fallback to something shared. The fail-open cache is the one bug class you cannot afford; make the safe behavior the structural one.
6. **The dividend.** Once the two lifetimes are explicit, performance and correctness stop competing: the shared parts are as fast as static, and the personal parts are as isolated as uncached. The caching model *is* the performance model.
7. **Close.** Ask of every byte: whose is this? The answer decides everything downstream.

**Notes.** Diagram-friendly (one page, two shaded regions). Companion draft: `caching-other-peoples-secrets.md` (the compliance/isolation half). From private direction notes (content-caching and data-access notes): pattern-level; framework-specific terms (PPR, Suspense) can appear as examples but the model must not depend on them.
