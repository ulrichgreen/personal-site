# Roadmap

Planned work, in rough priority order.

---

## Content Scaffolding

`pnpm create-article "Title"` and `pnpm create-page "Title"` — generate `.mdx` files with valid frontmatter.

- A script at `src/build/tools/create-content.ts`
- `pnpm create-article "On Abstraction"` → creates `content/articles/on-abstraction.mdx` with `layout: article`, today's date as `published`, and placeholder fields
- `pnpm create-page "Colophon"` → creates `content/colophon.mdx` with `layout: base`
- Derives a kebab-case filename from the title
- Accepts optional `--series "Name" --series-order N` flags for articles
- Fails if the derived filename already exists

---

## Draft Support

A `draft: true` frontmatter field that excludes an article from the article index, feed, and sitemap while still building the page locally.

- Add `draft: z.boolean().optional()` to the schema in `src/build/content/frontmatter.ts`
- In `src/build/content/article-index.ts`, filter out articles where `draft === true`
- The page still builds and is reachable in dev; it just doesn't appear in the article list, Atom feed, or sitemap

---

## Writing Guide

A `docs/writing-guide.md` reference covering the authoring format, available content components, and conventions. Contents (excluding what the scaffolding command handles automatically):

- Available content components and usage: `ArticleList`, `Code`, `Hero`, `DemoWidget`, `Callout`
- How images work: source images in `src/images/`, generated variants, and how to reference them
- Series authoring: declaring a series, ordering, what appears in the article footer
- Revision history: when and how to add a `revisions` entry
- Footnote conventions: `[^1]` / `[^1]: text` syntax and what the client enhancement layer does with it

---

## Series Ordering Validation

Build-time check that detects conflicting `seriesOrder` values within the same series.

- In `src/build/content/series-index.ts`, verify no two articles in the same series share a `seriesOrder` value
- Throw a descriptive error naming both files and the conflicting order
- Add a test to `src/build/content/series-index.test.ts`

---

## Callout Component

A `Callout` content component for annotated asides — notes, warnings, and tips.

- Add `src/components/callout.tsx` with a `type` prop: `"note"`, `"warning"`, `"tip"`
- Register it in `src/content-components.tsx`
- Styled with the existing CSS token system

---

## Table of Contents Component

An "On this page" CTA that hydrates and reveals the heading list on click.

- Extract H2 and H3 headings during MDX compilation via a custom `rehype` plugin in `src/build/content/compile-mdx.ts`
- Pass the heading list through render context
- Register `TableOfContents` in `src/content-components.tsx`
- Server-render a collapsed "On this page" CTA; hydrate as an island that expands on click to show the heading nav
- Authors opt in with `<TableOfContents />` in their MDX

---

## Figure Component and Image Workflow

A `Figure` component wrapping `<Picture>` with a caption, plus image pipeline documentation.

- Add `src/components/figure.tsx` accepting `src`, `alt`, `caption`, and optional `width`/`height` props
- Register in `src/content-components.tsx`
- Document the image workflow in `docs/writing-guide.md`

---

## Inline Critical CSS

Inline above-the-fold styles in `<head>`, async-load the rest. Worth doing once the design settles.
