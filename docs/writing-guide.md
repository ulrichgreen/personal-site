# Writing Guide

This is the authoring reference for pages and articles in `content/`. It focuses on what you write by hand after scaffolding.

To start a new article, copy `content/articles/_template.mdx` (files beginning with `_` are skipped by the build) and fill in the frontmatter and body.

## Frontmatter

All content is `.mdx` with YAML frontmatter.

- pages default to `layout: base`
- files under `content/articles/` are treated as `layout: article` automatically, so the field is optional there
- articles need `published: YYYY-MM-DD`
- optional fields that affect article rendering include `description`, `summary`, `note`, `series`, `seriesOrder`, `revisions`, and `draft`

`draft: true` still builds the page locally, but it keeps the article out of the article index, feed, and sitemap.

## Approved Content Components

MDX does not allow arbitrary imports. Content can only use components registered in `src/content-components.tsx`.

### `ArticleList`

Use on index-like pages to render the article archive from the build context.

```mdx
## Articles

<ArticleList />
```

### `Code`

Use for short inline examples when fenced code is not the right fit.

```mdx
<Code language="ts" title="Example">
{`const answer = 42;`}
</Code>
```

### `Hero`

Reserved for the home-page lead section.

```mdx
<Hero portrait={{ src: "/images/IMG_1514.png", width: 320, height: 400, alt: "" }} />
```

### `Manifesto`

Use for the short manifesto block on the home page. It renders the site's core principles from the shared component system.

```mdx
<Manifesto />
```

### `GridPlayground`

An interactive example island — a small, article-scoped "mini CodePen". It renders a CSS grid on a resizable stage so readers can drag the viewport width and adjust columns, gap, and dense flow. Use interactive examples to let readers explore a concept, not just read about it.

```mdx
<GridPlayground initialColumns={3} initialGap={16} boxCount={9} />
```

New examples are authored as island components under `src/components/examples/` and registered in `src/islands/registry.ts`; once registered they are available in MDX automatically.

### `Callout`

Use for notes, warnings, or practical tips that should read as an aside.

```mdx
<Callout type="warning">
    Name the trade-off plainly before you ask a reader to absorb it.
</Callout>
```

Available `type` values are `note`, `warning`, and `tip`.

### `TableOfContents`

Opt in on longer pages when an "On this page" jump list will help. The build extracts `h2` and `h3` headings automatically; the component renders static sticky markup with anchors to those page headers.

```mdx
<TableOfContents />
```

### `Figure`

Use for editorial images with captions.

```mdx
<Figure
    src="/images/IMG_1514.png"
    alt="Portrait used in the hero."
    width={320}
    height={400}
    caption="The build emits AVIF and WebP siblings for raster sources."
/>
```

## Images

Source images live in `src/images/`.

- raster sources (`.jpg`, `.jpeg`, `.png`) are copied to `dist/images/` and get matching `.webp` and `.avif` variants at build time
- large raster sources also get a half-width AVIF and WebP variant
- SVG, AVIF, and WebP files pass through unchanged

When you use `Figure`, point `src` at the final site path (`/images/...`). For raster sources, the component derives the sibling WebP and AVIF paths automatically from the fallback filename.

Use explicit `width` and `height` when you know them. That keeps image layout stable.

The build validates local `/images/...` references against files in `src/images/`, so missing image sources fail before publication.

## Series

Series metadata lives in article frontmatter:

```yaml
series: The Web Trilogy
seriesOrder: 2
```

- articles in the same series render grouped in the article index
- the article footer shows series navigation
- `seriesOrder` values must be unique within a series
- series orders must be contiguous, starting at `1`
- `series` and `seriesOrder` must be set together; one without the other fails the build

## Notes and revisions

`note` and `revisions` look similar but do different jobs:

- `note` is a single, undated editorial aside about the piece as a whole — for example, "I rewrote the third section four times." Use it sparingly; one per article.
- `revisions` is the dated change log. Use it when an already-published article changes in a meaningful way.

```yaml
note: I rewrote the third section four times.
revised: "2025-03-02"
revisions:
  - date: "2025-03-02"
    note: Rewrote the third section
```

Keep entries short and factual. The revision history renders after the article body and before series navigation. Set `revised` to the date of the newest revision. The build rejects a `revised` date or any revision `date` that falls before `published`.

## Footnotes

Use standard footnote syntax:

```md
This is the claim.[^1]

[^1]: This is the note.
```

The client enhancement layer turns those notes into lighter-weight inline or margin treatments depending on viewport size, but the authored format stays plain Markdown.

## Maintenance Audit

Run `pnpm run audit-content` for a read-only archive report. It lists page and article counts, drafts, missing descriptions, stale articles, word-count totals, series gaps, and image-reference counts. It does not write files or change content.
