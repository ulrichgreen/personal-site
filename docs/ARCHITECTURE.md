# Architecture

This site is a static build with a short path from source to output.

## Build Path

`make build` generates everything in `dist/`.

For prose pages, the path is:

`content/*.md` -> `src/build/frontmatter.ts` -> `src/build/md2html.ts` -> `src/build/template.ts` -> `dist/*.html`

`frontmatter.ts` reads YAML frontmatter and emits JSON.

`md2html.ts` turns markdown into HTML with `marked`.

`template.ts` picks the right TSX template and renders the final page through the custom runtime.

## Rendering Model

Templates live in `src/templates/` and shared pieces live in `src/components/`.

The TSX files compile against a tiny runtime in `src/runtime/`. That runtime has three jobs:

`h()` builds a tree.

`renderToString()` turns that tree into escaped HTML.

`html()` is the explicit escape hatch for trusted HTML from markdown.

That last part matters. Escaping is the default. Raw HTML is opt-in.

## Content Model

Markdown in `content/` is the source of truth for pages.

`section: writing` routes a page through the article template.

The home page is generated from `content/writing/*.md` files with valid `published` dates.

TypeScript interfaces in `src/types/content.ts` define the shapes that flow through the pipeline: `PageMeta`, `FrontmatterPayload`, `HtmlPayload`, `WritingIndexEntry`, and the layout props.

## CSS And Client JS

`src/build/css.ts` bundles the stylesheet partials in `src/styles/` into `dist/style.css` using `lightningcss`. The partials are organized into CSS layers: reset, tokens, base, layout, components, utilities, motion, and print.

`src/build/client.ts` bundles `src/client/site.ts` into `dist/site.js` using `esbuild` as a single IIFE.

Both target recent browsers (Chrome 120+, Firefox 121+, Safari 17+).

## Client Code

The browser code is in `src/client/site.ts` and compiles to one small file in `dist/site.js`.

It only handles progressive enhancement:

running header updates,

scroll-linked weight shift,

footnote reveals,

page arrival fade.

The page should still work without it.

## Dev Server

`make watch` starts a dev server on port 3000 through `src/build/dev.ts`. It serves `dist/`, watches `content/` and `src/` with `chokidar`, rebuilds on change, and pushes a reload over WebSocket.

## What Not To Change Casually

Do not break the stdin/stdout contract between the build stages.

Do not bypass the custom escaping rules.

Do not move content into framework conventions just to look familiar.

Do not add runtime complexity unless the site actually needs it.