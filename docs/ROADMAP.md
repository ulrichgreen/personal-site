# Roadmap

What's worth building next, in order of effort and payoff. The top items are small moves that punch above their weight. The bottom is the "not happening" list — useful for saying no quickly.

## Quick Wins

Add Speculation Rules — a `<script type="speculationrules">` block in the base template. The browser prerenders internal links on hover. Navigation feels instant. No framework, no JavaScript logic, silent fallback in unsupported browsers.

Add View Transitions with a single CSS rule (`@view-transition { navigation: auto; }`) and a meta tag. Cross-document fades without a single line of JS. Respects `prefers-reduced-motion`. Named transitions on article titles would let the writing index and article page animate between each other — the kind of detail that separates a crafted site from a generated one.

Add Open Graph and social meta tags. `site-head.tsx` already has the data in frontmatter. Adding `og:title`, `og:description`, `og:type`, `og:url`, and `twitter:card` makes shared links look deliberate instead of bare.

Add canonical URLs for every page. Needs a site base URL in config or frontmatter defaults. Small change, permanent benefit.

Add a favicon. Even a minimal inline SVG `data:` URI prevents the default 404 and shows intention in the browser tab.

Debounce dev rebuilds. Rapid saves currently queue overlapping builds in `dev.ts`. A 100–200ms debounce collapses them into one.

Enable parallel page builds. Pages are independent Make targets. `make -j` builds them concurrently. Free speedup.

## Next

Generate a sitemap.xml from the writing index and top-level content files. Helps search engines, costs nothing.

Add frontmatter validation — a build-time schema check that catches missing `title`, `section`, or `published` with file-specific errors. Fail loud, fail early.

Generate a full-text feed at `dist/feed.xml` with complete article content. Readers who use RSS deserve the full text, not a teaser.

Add a broken-link check — a post-build step scanning `dist/*.html` for internal `href` values, verifying targets exist. Catches rot before it ships.

Add lazy island hydration. Islands currently hydrate on `DOMContentLoaded`. A `data-hydrate` attribute (`visible`, `idle`, `interaction`) on each `data-island` root would let `islands.ts` defer `hydrateRoot`. Lower Time to Interactive, smarter resource use.

Add MDX plugins. `compile-mdx.ts` runs with zero plugins today. `remark-gfm` for tables and task lists, `rehype-autolink-headings` for deep links, `rehype-pretty-code` with `shiki` for build-time syntax highlighting with CSS custom properties. All build-time, no runtime cost. These make the content richer without adding client weight.

Add content-hashed filenames for CSS and JS. Both `esbuild` and `lightningcss` support this natively. Write a small manifest during the asset build, pass hashed filenames to the template. Enables `Cache-Control: immutable`.

Add structured data — JSON-LD `Article` schema using `title`, `published`, `revised`, and `description` from frontmatter. A small addition to `site-head.tsx` that makes the site legible to machines.

Author a custom 404 page at `content/404.mdx` and configure hosting to serve it. A 404 page is content, not infrastructure.

Compute reading time from the MDX body at build time. No manual word counts in frontmatter.

## Later

Year-based archives for the writing — once there's enough to group.

Article summaries on the home page — pull descriptions and dates into a richer landing.

Revision notes for essays that change meaningfully. Show the thinking, not just the result.

Consolidate the build into a single process. Currently Make spawns a separate `tsx` process per page. One Node process that reads everything, builds the index once, compiles MDX in parallel, writes all output. Eliminates per-page startup overhead.

Add performance budget enforcement — a post-build check measuring total HTML, CSS, JS size. Warn or fail if anything crosses a defined threshold.

Add an image pipeline. Optimize, resize, convert to AVIF/WebP, generate `<picture>` elements. Worth it once image content grows.

Add type-safe frontmatter. Replace the `[key: string]: unknown` escape hatch in `PageMeta` with a discriminated union on `section`. Writing pages require `published` and `description`; others don't. Catches misuse at compile time.

Inline critical CSS — inline above-the-fold styles in `<head>`, async-load the rest. Worth doing once the design settles.

Add build caching — a manifest of file hashes and frontmatter to skip unchanged pages on incremental rebuilds.

## Keep An Eye On

Performance budgets for HTML, CSS, JS, and fonts as the site grows.

Whether the running header and margin-note behavior still earns its place or becomes a distraction.

Whether these docs stay in step with the implementation. (The tests enforce this, but attention still matters.)

Whether CSS `@layer` would clean up the cascade. Migration would be mechanical and every target browser supports it.

Whether container queries become useful as the number of islands grows.

## Not The Goal

Turning this into an app. It's a document.

Adding features faster than the writing can absorb them.

Building infrastructure for ideas that still fit better as a line in this file.

A CMS. The authoring model is a text editor and `git push`.

Client-side search. The site is small. Use Ctrl+F.

A comment system. Email exists.

A CSS framework. The design system is the CSS.

Server-side rendering at request time. The site is static because static is better for this.