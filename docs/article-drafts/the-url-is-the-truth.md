# The URL Is the Truth

> One URL, one response. The moment a page's language depends on a cookie or a header, every cache between you and the user is guessing.

**Description.** Automatic locale detection is a beloved feature that quietly poisons everything downstream: `Vary: Cookie` on cacheable pages, redirect loops, the wrong language served from a shared cache. This essay defends the unfashionable alternative — the URL alone decides the language, detection happens in exactly two places (first entry and an explicit switcher), and a page not published in a language is honestly a 404 there, never a silent fallback.

**Why it lands.** It's a concrete demonstration of a principle readers can reuse anywhere: determinism deletes bug classes. Not "reduces," deletes — the wrong-language-cached bug cannot exist when the URL is the sole input. i18n advice is usually a tour of libraries; this is a tour of one constraint and everything it buys. The silent-fallback refusal will be the controversial part, which is exactly why it's worth writing.

## Outline

1. **The helpful feature.** Detect the browser language, set a cookie, redirect politely. Three sympathetic decisions — and now one URL has N possible responses, and something between you and the user is caching one of them.
2. **What the cache sees.** A shared cache keys on the URL. Vary on cookies and you've either fragmented the cache into uselessness or served Danish to Finland. Both happen; both get diagnosed as "flaky."
3. **The constraint.** The URL is the sole locale truth. Unprefixed default, prefixed everything else. No detection on content routes, ever. One URL = one response, and caching becomes boring — which is the highest compliment caching can receive.
4. **Negotiate in exactly two places.** The root entry point (a redirect, uncached) and the explicit language switcher (an action, uncached). The locale cookie never rides a cacheable response. Contain the nondeterminism; don't sprinkle it.
5. **The honest 404.** A page that isn't published in a language doesn't exist in that language. Falling back silently serves the wrong language under a URL that claims otherwise — a lie that breaks bookmarks, SEO, and trust in the model. Fail visibly.
6. **What it costs.** First-visit language detection gets one chance instead of ambient magic; editors must publish per language deliberately. Name the trade: a small ergonomic loss for the deletion of an entire bug family.
7. **Close.** When a response depends only on its URL, the whole delivery chain — CDN, server cache, prefetcher — can be trusted with it. Determinism is a gift you give to every system downstream of you.

**Notes.** From private direction notes (i18n routing-and-locale-negotiation): fully generalizable. Could carry a tiny diagram (request → cache keyed by URL). Related: `two-lifetimes.md` (same spirit: make cache identity explicit).
