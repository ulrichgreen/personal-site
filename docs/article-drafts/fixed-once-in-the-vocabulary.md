# Fixed Once, in the Vocabulary

> Cross-cutting concerns don't scale by discipline. They scale by being solved once, in the component layer, where every page inherits the fix.

**Description.** Accessibility, tracking, theming, brand: the concerns that apply to *everything* are exactly the ones that can't be implemented *everywhere*. This essay argues the component vocabulary is where they belong — the accessible name logic, the interaction telemetry, the focus management, solved once in the shared component and inherited by every page that composes it. The corollary is the audit trick: once the vocabulary carries the property, you verify the vocabulary, not the world — run the accessibility gate per component, not per page; instrument the button, not the thousand buttons.

**Why it lands.** Teams burn out trying to make N teams apply M rules to P pages — checklists, training, review vigilance — and the math never works. Moving the burden into the vocabulary flips the multiplication: effort scales with the number of *component types*, results scale with the number of *usages*. The residual insight keeps it honest: what remains after component-level correctness is composition-level (heading order, link text in context) — a much smaller, nameable audit that humans can actually sustain.

## Outline

1. **The multiplication problem.** Five teams, forty pages, one rulebook. Compliance by vigilance decays at the rate people get busy — which is immediately.
2. **Where "everywhere" lives.** The only code that appears on every page is the shared vocabulary: components, layout primitives, typography. A property built into the vocabulary is deployed by composition, automatically, including on pages that don't exist yet.
3. **Worked example: accessibility.** Labels, roles, focus behavior, contrast — correct in the component, inherited everywhere. Editor-composed pages hold the floor no matter what editors compose, because there is nothing else to compose *with*.
4. **Worked example: measurement.** Buttons, links, forms self-report interactions with owned, bounded attributes. App teams stop hand-instrumenting ordinary elements and reserve effort for genuine business events. Consistency of data becomes a side effect of using the system.
5. **Audit the vocabulary, not the world.** An enumerable component set means checks iterate the registry: an accessibility gate per component, a render test per block type, a contract test per event. Coverage stops being a sampling problem.
6. **The honest remainder.** Composition-level concerns survive: heading order, link text that makes sense in context, the page-level shell contract (one main landmark, one h1, a skip link). Name the remainder as the human audit — small enough to actually do.
7. **Close.** You can't review your way to a cross-cutting property. You can build it in once, and then check the once.

**Notes.** From private direction notes (a11y direction, tracking auto-instrumentation, single-design-system a11y inheritance): merge of two domains making the same move — that convergence is the essay's proof. Timely with the European Accessibility Act era; keep regulatory framing generic. Related: `five-registries-one-shape.md` (the enumeration dividend), `the-ratchet.md` (how the gate turns on).
