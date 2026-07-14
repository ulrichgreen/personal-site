# Nothing Phones Home

> This site has zero external services at runtime. Not as deprivation — as a definition of done: every byte served is a byte I wrote or explicitly chose.

**Description.** An essay from practice: running a personal site with no CDN fonts, no analytics script, no third-party widgets, no external requests at all — and what that constraint turns out to buy. Privacy is the obvious dividend and the least interesting one. The others compound: a strict Content-Security-Policy becomes *cheap* (nothing external to allowlist); performance becomes deterministic (no third-party latency lottery); durability becomes real (no partner deprecations can break a page); and measurement gets reframed — you can respect the reader's time (computed reading lengths, printed pages that work) without measuring the reader. The essay generalizes honestly: what a personal site can refuse absolutely, a product can refuse *by default* — every external request as an explicit, named exception with an owner.

**Why it lands.** Privacy essays usually moralize; this one itemizes. The zero-external-services constraint is presented as a series of engineering wins that readers can verify in the network tab — and the "measurement without surveillance" section answers the question every blogger actually has ("but how do I know if anyone reads it?") with a position instead of a workaround: the writing is the product; the reader owes you nothing back. The scale-up section keeps it from being indie-web navel-gazing: the same posture, applied to product work, is the one-wire-out architecture in miniature.

## Outline

1. **Open the network tab.** One host. Every request answered by the same origin that served the page. It reads like an empty room and took deliberate work to keep that way.
2. **What "no" costs.** Self-hosted fonts (or the reader's own system faces — better). No analytics dashboard. No embed conveniences: every YouTube iframe becomes a link, every tweet becomes a quotation. Name the losses honestly; they're smaller than advertised.
3. **The CSP dividend.** `default-src 'self'` stops being a hardening project and becomes a description of reality. The strictest security posture on the web is nearly free when there's nothing external to permit.
4. **The determinism dividend.** No third-party tag can slow the page, because there are none. Performance budgets become promises you can actually keep — nobody else deploys to your critical path.
5. **The durability dividend.** Ten-year-old pages with external dependencies are archaeology of dead services. A page that depends only on its own origin ages like text, which is the point of the whole site.
6. **Respecting without measuring.** Reading time computed at build; no scroll tracking, no beacons. The honest accounting: you lose the dashboard, you keep the reader's trust and your own attention. Email exists for the readers who want to be counted.
7. **Scaling the posture.** A product can't always refuse; it can *default* to refusal — every external runtime request an explicit, gated exception with a name attached. The personal site is the pure case of an architecture that works at any size.
8. **Close.** The site doesn't phone home because it's already home.

**Notes.** Extends the colophon's principles into an argument; pure site-native material, zero confidentiality concerns. Related: `one-wire-out.md` (the platform-scale sibling), `js-you-never-ship.md`.
