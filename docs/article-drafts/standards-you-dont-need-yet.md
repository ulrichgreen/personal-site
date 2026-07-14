# Standards You Don't Need Yet

> Adopting a standard is not automatically prudent. A standard is a dependency — and a standard you don't yet need is a dependency with no payer.

**Description.** There's a reflex that treats industry standards as free virtue: adopt the vendor-neutral interface, the observability spec's every corner, the abstraction layer that promises portability — because "we might need it." This essay defends the unfashionable audit: what does the standard standardize, do we have the problem it solves, and what does alignment cost *today*? Sometimes the answer is a lean internal interface kept deliberately small until a real multi-provider need appears — with the standard's *shape* borrowed so a later migration stays cheap.

**Why it lands.** "Complexity must defend itself" applied to a target readers rarely aim at: complexity wearing a neutral, community-blessed badge. The essay is careful, not contrarian-for-sport — it names when standards genuinely pay (real interop, real ecosystem leverage, contract with the outside world) versus when they're speculative portability that costs a custom adapter, a wider API surface, and someone else's roadmap. The borrowed-shape move is the practical takeaway: align conceptually now, adopt mechanically later, only if later comes.

## Outline

1. **The badge.** A proposal arrives pre-approved because a foundation's logo is on it. The question "do we need this?" starts sounding like heresy — which is exactly when it most needs asking.
2. **A standard is a dependency.** It has a release cadence, experimental corners, missing pieces for your stack (the provider that doesn't exist, the API still marked unstable), and a governance process you don't control. Free to admire; not free to adopt.
3. **The three honest questions.** What precisely does it standardize (often less than the name implies)? Do we have that problem (multi-vendor today, or a hypothetical)? What does adoption cost now (custom glue, wider surface, upgrade tax) versus what the lean internal interface costs?
4. **When the standard wins.** Contracts that cross organizational boundaries; ecosystems whose tooling you want (telemetry pipelines, schema registries); places where you'd otherwise invent a worse version of the same thing. Adopt with enthusiasm — these are real payoffs, not badges.
5. **Borrow the shape, defer the machinery.** Design the internal interface to rhyme with the standard — same concepts, same seams — so the future migration is mechanical. You keep the exit; you skip the entry fee.
6. **Revisit on triggers, not calendars.** Write down what would change the answer: a second provider, a real interop requirement, the missing piece shipping stable. Until a trigger fires, the lean thing stands.
7. **Close.** Standards are how the industry agrees. Adoption timing is how *you* stay deliberate about what you've agreed to.

**Notes.** From private direction notes (experimentation's deliberate deferral of a flag-evaluation standard; observability's "no new vendor/toolchain needed"): name no specific standards in the spine — use categories, with public examples chosen fresh at writing time. Sibling of the published `on-tools`; this is its standards-shaped sequel.
