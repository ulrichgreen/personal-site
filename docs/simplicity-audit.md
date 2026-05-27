# Simplicity Audit

This audit collects opportunities to make the site simpler, calmer, and more elegant. It is based on parallel investigations of architecture, styling, content modeling, tooling, and UX/accessibility.

The site is already unusually restrained for a custom static site: static output, constrained MDX, Preact instead of a large framework, selective hydration, CSS layers, performance budgets, and a small dependency set. The largest opportunities are not about replacing everything. They are about removing custom machinery where the platform can carry more weight, making derived data flow in one direction, and letting browser defaults and modern CSS do more of the design work.

## Guiding Principles

- Prefer fewer concepts over fewer lines.
- Preserve the static-first architecture.
- Move derivation to build time when it makes components dumber.
- Use semantic HTML and browser controls before custom JavaScript.
- Treat CSS as a small design language, not a utility framework.
- Keep MDX authoring close to documents, with a curated component surface.
- Remove infrastructure that exists only to support local abstractions.

## Recommended Future Sessions

### 1. Styling: browser-default-first design system

This is the highest-leverage area for making the site feel like a technical marvel of restraint.

**Progress:** Implemented the first browser-default quick wins: balanced heading wraps, prettier prose wraps, document color-scheme support, and default image `sizes` output.

**Current strengths**

- `src/styles/style.css` already uses a clean layer order.
- `src/styles/reset.css` is small.
- `src/styles/tokens.css` has a compact color, spacing, type, and layout system.
- `src/styles/base.css` already enhances semantic elements directly.
- `src/styles/components.css` uses CSS counters, `initial-letter`, and article-level defaults.
- System fonts carry the main reading experience, with JetBrains Mono reserved for code.

**Opportunities**

- Apply `text-wrap: balance` to headings and `text-wrap: pretty` to long prose defaults in `src/styles/base.css`, not just selected components.
- Convert mixed fixed and fluid type tokens in `src/styles/tokens.css` into a smaller fluid type scale.
- Convert line-height tokens from mixed pixel/unitless values to semantic unitless values.
- Replace one-off interaction colors with derived semantic tokens using `color-mix()` or `oklch()`.
- Add subtle border tokens such as `--color-border-subtle` instead of using one border color everywhere.
- Use `:where()` for low-specificity prose defaults and `:has()` only where it removes markup or classes.
- Evaluate container queries for component layout so fewer styles depend on the global `820px` breakpoint.
- Simplify margin notes in `src/styles/components.css` and `src/client/enhancements.ts`; explore CSS grid, anchors, or `:target` before JavaScript positioning.
- Document the CSS layer strategy in `src/styles/MAPPING.md` so future edits do not grow into ad hoc CSS.

**Candidate outcome**

A smaller CSS system that reads like: reset lightly, define tokens, style semantic HTML beautifully, then add only the few component rules the content genuinely needs.

### 2. Progressive enhancement: replace custom interactivity with platform primitives

The site works well without a framework, but a few interactions still ask JavaScript to solve problems the browser can mostly solve.

**Progress:** Table of contents no longer hydrates as an island. It now renders as sticky static markup with anchors to the extracted page headings.

**Files to revisit**

- `src/components/table-of-contents/table-of-contents.tsx`
- `src/components/table-of-contents/table-of-contents.client.tsx`
- `src/client/enhancements.ts`
- `src/components/code/code.tsx`
- `src/components/demo-widget/demo-widget.tsx`
- `src/components/demo-widget/demo-widget.client.tsx`

**Opportunities**

- Replace the hydrated table-of-contents toggle with native `<details>` and `<summary>`.
- Render the code-copy button in static HTML, disabled or inert by default, then enable it in `src/client/enhancements.ts` when Clipboard API support exists.
- Use normal footnote links and CSS `:target` as the baseline; layer margin-note behavior on top only where useful.
- Give dynamically inserted notes `aria-live="polite"` or avoid dynamic insertion where static markup can work.
- Add explicit button labels to the demo widget controls.
- Consider whether the demo widget is valuable enough to justify an island in such a simple site.

**Candidate outcome**

The browser provides disclosure, navigation, focus, and fallback behavior. JavaScript becomes a small enhancement layer instead of the owner of simple UI state.

### 3. Content metadata: one source of truth for derived data

The content model is strong, but several metadata fields and derivations can be simplified.

**Files to revisit**

- `site.config.ts`
- `src/components/site-head.tsx`
- `src/build/artifacts/feed.ts`
- `src/build/artifacts/og-image.ts`
- `src/components/manifesto/manifesto.tsx`
- `src/types/content.ts`
- `src/build/content/frontmatter.ts`
- `src/build/content/build-content.ts`
- `src/build/content/article-index.ts`
- `src/build/content/series-index.ts`

**Opportunities**

- Move author/site identity into `site.config.ts`; the author name is currently hard-coded in multiple files.
- Remove `summary` if it remains unused in real content and only acts as a fallback for `description`.
- Do not store `pagePath` as metadata if it can be derived reliably from the source path at render time.
- Store word count and compute reading time where displayed, or keep both derived together in one metadata builder.
- Clarify the difference between `note` and `revisions` in docs/types.
- Build article index and series data together so filtering, sorting, grouping, and validation happen once.
- Avoid re-rendering article bodies in feed generation if existing metadata is enough.
- Strengthen preflight validation for content before compilation where possible.

**Candidate outcome**

Authored metadata stays minimal. Derived metadata is built once, close to the content pipeline, then passed forward as read-only data.

### 4. Render data flow: reduce context and prop ceremony

The render layer is readable, but static data moves through a context abstraction that may be more powerful than needed.

**Files to revisit**

- `src/context/render-context.tsx`
- `src/build/render/render-react-page.tsx`
- `src/build/render/layouts.tsx`
- `src/templates/base.tsx`
- `src/templates/article.tsx`
- `src/types/content.ts`

**Opportunities**

- Replace render context for static data with explicit props at the layout boundary.
- Keep asset manifest access near templates rather than making every component eligible to read it.
- Replace `BaseLayoutProps` and `ArticleLayoutProps` overlap with a discriminated layout type.
- Pass a `meta` object through layout layers instead of destructuring and reassembling many fields.
- Make layout selection type-driven instead of relying on casts.

**Candidate outcome**

The render path becomes a plain function from compiled content and metadata to HTML. Context remains only if it solves a concrete problem that props cannot solve cleanly.

### 5. Islands: simplify declaration, registration, and hydration strategy

The island system is small, but wrapper components and duplicated strategy strings create avoidable ceremony.

**Files to revisit**

- `src/islands/island.tsx`
- `src/islands/registry.ts`
- `src/client/islands.ts`
- `src/components/demo-widget/demo-widget.tsx`
- `src/components/table-of-contents/table-of-contents.tsx`

**Opportunities**

- Remove wrapper components that only render `<Island name="..." props={...} />`.
- Centralize hydration strategy names and scheduler functions.
- Make strategy defaults live with island registration rather than every call site.
- Consider whether current islands should exist after progressive-enhancement work.
- Keep the island registry explicit, but make each island's static and client surface easier to find.

**Candidate outcome**

Interactive components become rare, obvious, and cheap to reason about. A page with no true interactivity should not pay conceptual cost for islands.

### 6. Build pipeline: consolidate orchestration without hiding it

The custom build is thoughtfully organized, but there are many small orchestration files for a simple site.

**Files to revisit**

- `src/build/build.ts`
- `src/build/dev.ts`
- `src/build/dev-render.ts`
- `src/build/dev-content.ts`
- `src/build/render/write-pages.ts`
- `src/build/render/layouts.tsx`
- `src/build/artifacts/*`
- `src/build/content/*`

**Opportunities**

- Create one build-task model shared by production and dev rebuilds.
- Consolidate change classification and rebuild scheduling in the dev server.
- Collapse dev-only render/content entry points if parameters can express the difference.
- Give artifacts a common interface for generation and writing.
- Centralize source-to-output path normalization.
- Treat page rendering as one operation returning HTML, islands, and metadata.

**Candidate outcome**

The build remains custom and legible, but future readers encounter fewer orchestration concepts.

### 7. Tests and validation: keep the no-framework advantage, reduce custom glue

The project uses Node's built-in test runner, which fits the site's low-tooling posture. The custom runner and scattered verification model are the parts to inspect.

**Files to revisit**

- `test/run-tests.ts`
- `test/verify-*.ts`
- co-located `src/**/*.test.ts`
- `package.json`

**Opportunities**

- Decide whether the custom test runner provides enough value to justify its maintenance overhead over direct `node --test` usage.
- Keep co-located unit tests if they improve locality, but document the split between unit and output verification.
- Consider parallel execution only if test time becomes friction.
- Keep `pnpm run verify` as the single confidence command.
- Avoid adding lint/format tooling unless there is a clear consistency problem; no tooling is currently part of the simplicity story.

**Candidate outcome**

Validation remains boring: typecheck, build, test. Any test infrastructure that exists should make that sequence clearer rather than more abstract.

### 8. Configuration: make constants boring and singular

There is little configuration overall, which is good. The goal is to remove duplication and magic numbers, not add a config framework.

**Files to revisit**

- `site.config.ts`
- `src/config.ts`
- `src/build/dev.ts`
- `src/build/assets/css.ts`

**Opportunities**

- Keep one source of truth for browser targets and derive tool-specific formats from it.
- Move dev-server constants such as port and debounce timing into named config values.
- Add site identity fields such as title, author, description, and locale to `site.config.ts`.
- Avoid schema-validating config unless it becomes user-editable or environment-dependent.

**Candidate outcome**

Configuration stays a short TypeScript object with no mystery values scattered across the build.

### 9. Repository cleanup and documentation hygiene

The docs are strong, but the repository contains a few signs of transitional work.

**Files/areas to revisit**

- `.deleted/`
- `docs/README.md`
- `docs/architecture.md`
- `docs/tooling.md`
- `docs/component-pattern.md`
- `src/styles/MAPPING.md`

**Opportunities**

- Remove `.deleted/` if it is only a manual archive of old code; Git already keeps history.
- Keep this audit separate from the roadmap. Move individual chunks into `docs/roadmap.md` only when they become planned work.
- Update architecture/tooling docs only after implementation changes land.
- Expand `src/styles/MAPPING.md` with cascade layer, token, and browser-default philosophy.

**Candidate outcome**

Docs remain a map, not a junk drawer. Aspirational work lives here until a future session turns it into a concrete roadmap item.

## Suggested Priority Order

1. Styling and browser defaults.
2. Progressive enhancement and accessible interactions.
3. Content metadata consolidation.
4. Render data-flow simplification.
5. Island simplification.
6. Build orchestration consolidation.
7. Test runner and validation simplification.
8. Configuration cleanup.
9. Repository cleanup and doc follow-through.

## Concrete Quick Wins

- Add `text-wrap: balance` to headings.
- Add `<meta name="color-scheme" content="light dark">`.
- Add `sizes` defaults to `Picture`.
- Replace the table-of-contents island with `<details>`.
- Add `aria-controls` where disclosure buttons remain.
- Move author identity to `site.config.ts`.
- Remove unused `summary` metadata if no content uses it.
- Delete `.deleted/` if it is not intentionally preserved.

## Risks to Avoid

- Do not replace the custom static build with a framework just to reduce local code count.
- Do not turn CSS into a token-heavy design system that is larger than the site.
- Do not add linting, formatting, or test frameworks unless they remove more friction than they add.
- Do not make MDX more application-like; keep content mostly prose.
- Do not chase clever CSS features where semantic HTML is enough.

## Definition of Done for Future Simplification Work

Each future session should leave the site with fewer concepts, clearer ownership, and no loss of accessibility or performance. Good outcomes should be visible in at least one of these ways:

- fewer client-side behaviors,
- fewer build-time abstractions,
- fewer metadata fields,
- fewer repeated constants,
- fewer custom integration hooks,
- fewer component wrappers,
- or simpler CSS that makes the browser do more work.
