# Architecture

The whole thing is a static build. Content goes in as MDX, comes out as HTML. React runs at build time. The browser gets clean documents with a thin progressive enhancement layer and a few interactive islands where they've earned it.

## Build Pipeline

`make build` produces everything in `dist/`. Each page follows one path:

```
content/*.mdx → frontmatter.ts → build-content.ts → compile-mdx.ts → render-react-page.tsx → dist/*.html
```

Every step does one thing:

- **`frontmatter.ts`** — parses YAML frontmatter, emits structured data.
- **`build-content.ts`** — resolves metadata, strips duplicate titles, prepares the MDX body.
- **`compile-mdx.ts`** — turns MDX into a React component. Build-time only.
- **`render-react-page.tsx`** — picks the template, calls `renderToStaticMarkup`, writes the final HTML.

The CLI entry is `src/build/page.ts`. It loads one content file, builds the writing index, and renders the page. Make calls it once per target.

## Rendering

Templates live in `src/templates/`. Shared pieces live in `src/components/`. Both are standard React TSX — nothing exotic.

MDX content renders through the same React tree. The only components available inside content come from `src/content-components.tsx`. That boundary exists on purpose and it stays.

`section: writing` in frontmatter routes a page through the article template. Everything else gets the base layout.

Islands are the exception to the static rule. Each one uses the `Island` wrapper from `src/islands/island.tsx`, gets server-rendered into its own root, then hydrated on the client with `hydrateRoot` via `src/client/islands.ts`. The rest of the page never hydrates.

## Content

MDX files in `content/` are the source of truth.

- `content/index.mdx` is the home page.
- `content/writing/*.mdx` holds articles.
- `section: writing` triggers the article template and index inclusion.

Articles get explicit `description` frontmatter. There's a fallback, but I treat it as a bug when I rely on it.

The TypeScript interfaces in `src/types/content.ts` define every shape in the pipeline: `PageMeta`, `FrontmatterPayload`, `HtmlPayload`, `WritingIndexEntry`, and the layout props. If the types and the templates disagree, the build breaks.

## Styles and Scripts

CSS is authored in `src/styles/` as layered partials (reset → tokens → base → layout → components → utilities → motion → print) and bundled by `lightningcss` into `dist/style.css`.

Client JS has two bundles, both built by `esbuild` as single IIFEs:

- **`dist/site.js`** — progressive enhancement: running header, scroll-linked weight shift, footnote reveals, page arrival fade.
- **`dist/islands.js`** — island hydration only.

Both target modern browsers (Chrome 120+, Firefox 121+, Safari 17+). The page works without either.

## Dev Server

`make watch` starts a local server on port 3000 via `src/build/dev.ts`. It watches `content/` and `src/`, rebuilds on change, pushes a reload over WebSocket. Nothing more.

## Lines Not To Cross

Don't reintroduce arbitrary MDX imports. `content-components.tsx` is the gate and it stays closed.

Don't hydrate the full page. If a component needs client state, it becomes an island.

Don't let the progressive enhancement layer touch island-owned DOM. They're separate worlds.

Don't change output paths casually. URLs are permanent.
