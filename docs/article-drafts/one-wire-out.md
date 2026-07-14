# One Wire Out

> The browser gets exactly one way to emit events: your endpoint. When a signal needs a new destination, the answer is a new sink on the server — never a new wire out of the page.

**Description.** The standard analytics setup is a page full of vendor SDKs, each with its own transport, cookies, retries, and consent behavior. This essay argues for inverting it: first-party events flow through one transport to an endpoint you control, and every vendor lives behind server-side sinks. The page becomes clean by construction; vendors become an implementation detail.

**Why it lands.** Every front-end developer has inherited the tag-manager haunted house — twelve scripts, no owner, mystery cookies. The usual response is resigned hygiene. This is an architectural refusal with concrete payoffs readers can defend upward: one consent enforcement point, one performance cost, one place to debug "wrong numbers," and vendor swaps that never touch the page. The one-liner rule ("a new sink, not a new transport") gives teams a durable decision procedure, which is worth more than any migration story.

## Outline

1. **Inventory of an average page.** The analytics tag, the heatmap tag, the experiment tag, the pixel — each a privileged program running in your user's browser, shipped by a company you have a contract with and no control over.
2. **The invariant.** Browser code sends first-party events to first-party endpoints, through one transport. No direct browser-to-vendor calls. Everything a vendor needs is delivered server-side, behind that boundary.
3. **What moves server-side.** Normalization, routing, filtering, vendor translation — the work was always there; it was just being done badly, in the page, N times. A sink registry makes each destination explicit and swappable.
4. **The layering rule.** Semantic tracking is a layer on the telemetry substrate — an event contract and a facade — never a second delivery system. Two transports is how you get to twelve.
5. **Exceptions are approval-gated, not accreted.** Some third-party scripts will exist (the consent banner itself, perhaps). Each is an explicit, named exception with an owner — a short list you can read, not an archaeology project.
6. **The dividends.** Consent enforced once at ingestion instead of promised per-vendor. Performance budgets that survive contact with marketing. Debugging that starts at one choke point. Vendor migrations that are configuration, not page surgery.
7. **The honest costs.** You own an ingestion route, its scaling, and its failure modes; vendor "magic" features that depend on client-side SDKs need real evaluation instead of default adoption. Name the trade plainly.
8. **Close.** The page is the most hostile, least observable place to run integration code. Stop doing it there.

**Notes.** Sits in the trust series with `the-banner-is-not-the-gate.md` (the consent gate is what the one wire makes enforceable). From private direction notes (one-telemetry-transport bet): pattern-level; name no vendors beyond generic categories.
