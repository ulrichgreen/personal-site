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

## Client Code

The browser code is in `src/client/site.ts` and compiles to one small file in `dist/site.js`.

It only handles progressive enhancement:

running header updates,

scroll-linked weight shift,

footnote reveals,

page arrival fade.

The page should still work without it.

## What Not To Change Casually

Do not break the stdin/stdout contract between the build stages.

Do not bypass the custom escaping rules.

Do not move content into framework conventions just to look familiar.

Do not add runtime complexity unless the site actually needs it.