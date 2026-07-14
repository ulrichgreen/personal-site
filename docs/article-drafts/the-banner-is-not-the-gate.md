# The Banner Is Not the Gate

> The cookie banner collects consent. It cannot enforce it. The check that counts runs where the data lands.

**Description.** Nearly every consent implementation on the web enforces in the browser: the banner blocks the scripts, the scripts respect the flags, everyone hopes. This essay argues the enforcement point belongs server-side, at telemetry ingestion — an event without consent for its category never reaches a sink, no matter what the page did.

**Why it lands.** Consent is usually written about as legal compliance theater, which is why engineers tune it out. This treats it as an architecture problem with a clean invariant, and the reframe generalizes: any control that lives only in the client is a suggestion. Readers building analytics, tracking, or personalization get a concrete, defensible pattern; readers who distrust surveillance-by-default get an essay that takes their side with engineering rigor rather than sentiment.

## Outline

1. **A UI-only promise.** The standard model: a consent management platform in the browser, category flags in a cookie, and every script on the page promising to check before firing. What a promise like that is worth under drift, bypass, and the next developer's deadline.
2. **Capture and enforcement are different jobs.** The banner is the capture UI — it asks the question and records the answer. Enforcement is honoring the answer where data is stored and forwarded. Conflating the two is the original sin of consent tooling.
3. **The gate at ingestion.** First-party events flow to your own endpoint; the ingestion route reads the consent state on every request and filters before storage and fan-out. Withdrawn consent cannot be routed around, because there is nothing to route to.
4. **Origin checks are not consent checks.** A same-origin guard authenticates *where a request came from*; it says nothing about *what the user agreed to*. Security controls and consent controls look similar and answer different questions — run both, never one as a stand-in for the other.
5. **Client-side gating is good citizenship, not the control.** Queue-and-flush before consent is known still matters — it is politeness and bandwidth. It just isn't the guarantee.
6. **Withdrawal means cleanup.** Revocation is not "stop dispatching." Identifiers that consent created, consent must destroy. A withdrawal that leaves the identity cookie behind is a withdrawal in name only.
7. **The pairing rule.** Ship the enforcement and the banner together. A banner backed by nothing is a lie in both directions: the user believes they have control, the org believes it has compliance.
8. **Close.** The consent gate is the rare case where the compliant architecture is also the simpler one: one enforcement point instead of a hundred promises.

**Notes.** Strong candidate for a small diagram (browser → ingestion gate → sinks). From private direction notes (consent-gate bet): pattern-level only; CMP vendor names unnecessary. Could seed a "trust" series together with the cache-safety and one-transport drafts.
