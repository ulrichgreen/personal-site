# Hold Less

> The cheapest data to protect is the data you never hold. Design custody before you design controls.

**Description.** Security planning usually starts with controls: encryption, access policies, audits. This essay argues the higher-leverage question comes first: what do we refuse to hold at all? Card numbers that flow provider-to-provider so your servers never see them; national identifiers replaced by opaque internal IDs before they reach logs and cache keys; preview environments stocked with fixtures so there is nothing to leak. Custody decisions beat control decisions, and "we hold nothing durable" is itself a decision worth writing down.

**Why it lands.** Data minimization is usually preached as compliance virtue, which makes engineers' eyes glaze. Framed as *scope minimization* it becomes self-interest: every category you don't hold is audits you don't undergo, breach classes you can't have, and controls you don't build or maintain. The natural-key trap gives it teeth — the national ID is the obvious join key and precisely the identifier that turns every log line and cache entry into regulated data. Readers in fintech, health, and gov will forward it; personal-site readers get the same principle at blog scale (see: analytics you don't collect).

## Outline

1. **The audit that took an afternoon.** Not because the controls were excellent — because the answer to "where do you store card data" was "nowhere." Absence is the one control that never has a CVE.
2. **Custody before controls.** Every piece of sensitive data you hold demands storage, access policy, logging, retention, deletion, and incident scope. The multiplication happens at *intake*. The design review question is not "how do we secure this?" but "why do we have it?"
3. **The payment seam.** Let card data flow browser → payment provider directly; your systems keep a reference token and the last four digits. The boundary decision ("what may our servers hold: masked number, scheme, expiry, mandate reference — nothing else") is separate from any read-path decision, and it is the one that sets your compliance scope.
4. **The natural-key trap.** The national ID is unique, stable, and already everywhere upstream — the perfect join key. Use it, and every cache key, log subject, and error message that touches it becomes personal data of the most regulated kind. Mint opaque IDs at the boundary; translate once.
5. **Nothing real by construction.** Test and preview environments hold fixtures, not copies of production. "No real personal data in preview" as an architectural property, not a scrubbing pipeline that runs mostly.
6. **Write down the nothing.** "No durable personal data at rest in this tier" is an auditable, load-bearing decision. Record it like one — it's the decision that keeps future convenience features from drifting you into custody.
7. **Close.** You cannot leak what you do not have. Hold less.

**Notes.** From private direction notes (payments PCI posture, identity SSN-to-opaque-ID, privacy, preview personas): war-story details must stay generic. Overlaps deliberately with `by-construction.md` (custody is its data-shaped sibling) — cross-link rather than merge.
