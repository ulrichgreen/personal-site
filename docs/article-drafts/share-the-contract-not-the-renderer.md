# Share the Contract, Not the Renderer

> One design system across web and native doesn't mean one component library. It means one set of decisions, rendered twice.

**Description.** The dream of "write the component once, run it everywhere" keeps shipwrecking on the fact that web and native are genuinely different mediums. This essay argues for the split that works: share the semantic contract — tokens, prop models, value vocabularies, accessibility rules, state behavior — and keep renderers per platform, with the split placed at the renderer leaf. One system, two renderers; shared semantics, not shared pixels.

**Why it lands.** Design-system teams are under constant executive pressure toward "unify web and mobile," and the honest engineering answer is usually a mumble. This gives it structure: what genuinely shares (the decisions), what genuinely cannot (components bridged to web-platform primitives are *unusable* natively — say so plainly), and a stop rule that keeps the project honest: the moment shared files fill with platform exceptions, the sharing has gone too deep. Includes the tokens-first sequencing argument — start from shared tokens, not shared components, because tokens are decisions in their purest form.

## Outline

1. **The pressure.** "Why do web and app look different?" is a fair question with an expensive wrong answer: a universal component library that serves both platforms badly.
2. **What a design system actually is.** Not components — decisions. Color meaning, spacing rhythm, type hierarchy, interaction vocabulary, accessibility floor. Components are one rendering of those decisions per medium.
3. **The split at the renderer leaf.** Per component: shared tokens, shared prop model and value vocabulary, shared behavior/state logic — then a web leaf and a native leaf that render with their platform's own primitives and interaction idioms.
4. **Tokens first, components later.** Sequencing matters: a shared token source proves the pipeline, forces the "where does truth live and how is it consumed" decision early, and pays off even if component sharing never happens.
5. **Be honest about the un-shareable.** Some components are structurally web-bound (anything bridged to web components or browser APIs). An honest exclusion list beats a leaky abstraction — and the list is a moving boundary owned by upstream reality, not by wishing.
6. **The stop rule.** If shared files accumulate platform conditionals, stop or narrow scope. The exceptions are the medium telling you where the boundary actually is. A slogan ("one platform-neutral source") is not a workstream until it has a home and a consumption mechanism.
7. **Governance names the failure mode.** Web-led sharing drifts web; mobile-led drifts native; upstream-led bottlenecks both. Pick one deliberately, knowing its bias.
8. **Close.** Unification is real when it happens in the vocabulary. Everything below the vocabulary is allowed — required — to be native.

**Notes.** From private direction notes (react-native domain, single-design-system bet): strip org specifics; the pattern is industry-general. Good conference-talk seed. Related: `five-registries-one-shape.md` (vocabulary thinking).
