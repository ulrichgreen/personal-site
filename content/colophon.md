---
title: Colophon
description: How this site was built — tools, decisions, and constraints.
section: colophon
---

# Colophon

This site is a collection of static files built from a small TypeScript codebase. No framework, no server-side app, no client-side hydration. Just a Makefile, a handful of scripts under `src/`, and enough tooling to keep the work clear.

## Planning

The docs folder stays small on purpose. `MANIFESTO.md` says what the site is trying to do. `ARCHITECTURE.md` explains the build and rendering path. `STRUCTURE.md` is the map of the repo. `STACK.md` records the tool choices. `ROADMAP.md` keeps the next useful ideas in one place. `EXPERIMENTS.md` is where the stranger ideas live.

That split keeps the documents short enough to stay useful.

## Build

`make` still drives the whole thing. Markdown from `content/` goes through a TypeScript pipeline: frontmatter parsing, markdown to HTML, then template rendering through a small JSX runtime. CSS is bundled from partials in `src/styles/`. The browser script is compiled from `src/client/site.ts`. The output lands in `dist/`.

There is a watch mode now. `make watch` runs a tiny dev server with rebuilds and live reload. The setup is still small enough that the build path fits in your head.

## Design

The visual design is still raw CSS. The source is now split into partials under `src/styles/`, but it still compiles to one stylesheet. The 8px baseline grid is still the backbone. Custom properties still carry the spacing scale, type scale, and palette. The site still leans on typography before graphics.

There is a small browser script for four progressive enhancements: updating the running header, shifting font weight with scroll, revealing footnotes into the margin, and a one-time page-arrival fade. Everything still works without JavaScript. The script is there to sharpen the reading, not to carry the page.

## Principles

This site has zero external services at runtime. No CDN fonts, no analytics script, no third-party widgets. Every byte served is a byte I wrote or explicitly chose to include. TypeScript makes the build code clearer, but the site itself is still plain HTML, raw CSS, and a tiny bit of Vanilla JS.

Constraints are still the point. The result should be a site I understand completely, which means I can fix it, extend it, and trust it.
