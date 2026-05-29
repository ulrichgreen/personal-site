# Codebase Assessment: Remaining Work Toward a Marvel

> A follow-up to the original multi-angle audit. The build pipeline and dev
> workflow recommendations have largely landed; this document records **what was
> done**, **what is left**, and **where the next round of simplification should
> go**. Figures verified against the working tree.

## TL;DR

The two structural themes from the first audit are **done**: the build is now one
linear, readable pipeline, and dev reuses it instead of maintaining a parallel
path. The authoring model picked up its highest-ROI wins (path-inferred layout, a
template, friendlier series rules).

What remains is concentrated in **two places**:

1. **CSS still carries its redundancy.** `components.css` is unchanged in size
   (~634 lines). The groundwork landed — tokens for durations/radii, one
   centralized `:where()` interaction rule — but the broader consolidation
   (shared borders, list resets, pseudo-element marks, modern CSS features) has
   not happened yet. This is now the single largest lever left.
2. **A few components and wrappers still exist only as indirection.** `PageHeader`
   and `Manifesto` remain thin pass-throughs, and a handful of presentational
   `<span>`/`<div>` wrappers exist solely to be styled.

Everything else is polish: a couple of test-coverage gaps and a small set of
"lean harder on the platform" opportunities.

The guiding instinct is unchanged: **elegance comes from deletion**, not new
abstractions.

---

## What landed since the first audit

| Theme | Recommendation | Status |
| --- | --- | --- |
| Build pipeline | Extract named pipeline stages | **Done** — `src/build/pipeline.ts` exposes `compileSite` / `rebuildPages`; `build.ts` is a short, commented stage list |
| Build pipeline | Single article index (no disk fallback) | **Done** — index always derives from compiled content |
| Build pipeline | Collapse `content/` to ~5 cohesive files | **Done** — `discover`, `compile`, `metadata`, `article-index`, `contracts` |
| Build pipeline | Split Shiki theme out of compile | **Done** — `src/build/content/syntax-theme.ts` |
| Build pipeline | One `buildArtifacts()` call | **Done** — `buildAncillary()` orchestrates feed/sitemap/robots/headers/og |
| Dev workflow | Reuse prod pipeline in dev | **Done** — `rebuildPages()` is the content subset of the full pipeline |
| Dev workflow | Merge `dev-content` / `dev-render` | **Done** — both deleted; one rebuild path |
| Dev workflow | In-process fast rebuilds | **Done** — content edits rebuild in-process; a `codeStale` flag routes template edits through a fresh subprocess |
| Authoring | Infer `layout: article` from path | **Done** — `resolveLayout()` in `frontmatter.ts` |
| Authoring | Add an article template | **Done** — `content/articles/_template.mdx` |
| Authoring | Document auto-description | **Done** — called out in the template |
| Authoring | Allow gaps in `seriesOrder` | **Done** — non-contiguous order now warns instead of failing |
| Styling | Tokenize durations / radii / transitions | **Done** — present in `tokens.css` |
| Styling | Centralize the interaction pattern | **Partial** — one `:where()` rule exists atop `components.css`; the rest of the consolidation is outstanding |

The build now reads as one story, and a content edit no longer pays subprocess
cold-start. Those were the hardest-to-reason-about parts of the codebase, and
they are no longer the bottleneck.

---

## What is left

### 1. CSS consolidation — the biggest remaining lever

`components.css` is still ~634 lines and the redundancies the first audit named
are still present. The tokens and the single interaction rule are in place, which
means the hard part (deciding the shape) is settled; the work now is mechanical
consolidation that should not change a single rendered pixel.

Concrete, still-open items:

- **No dedicated `interactive` layer.** Interaction lives inside `components.css`
  rather than in its own auditable cascade layer. Promoting it to
  `@layer interactive` (added to the layer order in `style.css`) keeps all
  hover/focus/transition behavior in one place.
- **`list-style: none` is repeated** in at least three components. One
  `:where()` list-reset removes the duplication.
- **The bordered-divider rule recurs** (`border-block-start: 1px solid
  var(--color-border)` and friends) across list items, headings, and nav. A
  single shared rule applied via `:where()` collapses these.
- **`@property` is not adopted.** Declaring the theme colors as `@property`
  custom properties lets light/dark transitions animate in pure CSS and removes
  any bespoke transition handling.
- **`:has()` and container queries are unused.** `callout`, `demo-widget`, and
  the cards still size to the viewport via per-component media queries; container
  queries would let them size to their container and delete those breakpoints.

Target outcome is unchanged from the first audit: **~40% smaller `components.css`
with byte-identical rendered output.** The difference now is that it is a pure
clean-up — no design decisions remain.

### 2. Remove indirection-only components and wrappers

- **`PageHeader`** is used exactly once (in `templates/article.tsx`). Inlining its
  markup into the template removes a component, a CSS file, and a directory.
- **`Manifesto`** is static prose wrapped in a component and registered as an MDX
  component, used only by `index.mdx`. Moving the text into `index.mdx` directly
  removes the component and shrinks the content-component registry.
- **Presentational wrappers** remain in markup that exist only to be styled — e.g.
  the `hero-meta` `<span>`s and the hero rule. Several of these can become
  `::before`/`::after` marks, simplifying both the HTML and the CSS at once. This
  is the "markup as a work of art" goal the site is reaching for.

### 3. Close the two test gaps

- **No tests for image optimization** (`src/build/assets/images.ts`).
- **No tests for asset-manifest hashing** (`src/build/assets/asset-manifest.ts`).

Both are production-only paths that currently rely on the full `verify` pass
rather than focused unit tests. A small `*.test.ts` beside each would lock in the
hashing contract and the image-derivative outputs against regression.

---

## Further improvements that fit the vision

These were not in the original audit but align with the "simpler, more elegant,
lean on the platform" direction. None is required; each removes more than it adds.

- **Collapse the CSS entry imports.** `style.css` lists two component stylesheets
  (`demo-widget`, `table-of-contents`) inline alongside the layer imports. Once
  the `interactive` layer exists, consider a single convention — every component
  stylesheet imported in one ordered block — so the layer story is visible at a
  glance.
- **Treat `docs/` as a small, current set.** Several documents
  (`simplicity-audit.md`, `roadmap.md`, `future-ideas.md`, this file) overlap.
  After the CSS pass, fold the still-true parts into `architecture.md` and retire
  the rest, so a newcomer reads one source of truth rather than a paper trail.
- **One sentence on the test split.** The `*.test.ts` (unit) vs `test/verify-*.ts`
  (integration) division is coherent but undocumented. A single line in
  `docs/architecture.md` is enough.
- **Consider a client-JS size budget.** Performance budgets exist for output
  bytes; an explicit ceiling on shipped client JS would guard the partial-
  hydration promise the same way the CSS budget guards the styling one.
- **Audit the `--type-leading-*` set.** `tokens.css` defines `tight`, `normal`,
  `loose`, `relaxed`, `display`, and `body`. If any are unused after the CSS
  consolidation, drop them — the type system should be exactly as large as the
  design needs.

---

## The bar for "marvel" (unchanged)

When the remaining work is done, a newcomer should be able to:

- Read `tokens.css` + a single short `interactive` layer and understand the entire
  visual system.
- Read `pipeline.ts` top to bottom and see the whole build in one screen. *(Already
  true.)*
- Add an article by copying the template and writing prose — no layout field, no
  ceremony. *(Already true.)*
- Open any component and find clean, semantic HTML with no wrapper noise.

Two of the four are met. The other two are a CSS consolidation pass and a small
round of component/wrapper deletion away — almost entirely **removal**, not new
code.

---

## Suggested order of work

| Phase | Work | Payoff |
| --- | --- | --- |
| 1 | Add `interactive` layer; consolidate list-reset + border rules with `:where()`; delete presentational wrappers | ~40% smaller `components.css`, cleaner markup, identical render |
| 1 | Inline `PageHeader` and `Manifesto` into their single call sites | Fewer files, smaller content-component registry |
| 2 | Adopt `@property` theme colors; container queries for `callout` / `demo-widget` / cards | Modern-CSS showcase, fewer media queries |
| 2 | Add `images` and `asset-manifest` unit tests | Regression safety on the two prod-only paths |
| 3 | Consolidate `docs/`; document the test split; add a client-JS budget | One source of truth, guarded promises |

Done in this order, each phase leaves the site shippable and the diff reviewable.
