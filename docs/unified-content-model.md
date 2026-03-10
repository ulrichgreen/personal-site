# Unified Content Model

A plan to collapse the article/page split into a single authoring model. Files and folders dictate URLs. Frontmatter is the same everywhere. The build pipeline gets simpler.

## The Problem

Today the site has two content tracks:

1. **Pages** — `content/*.mdx` with arbitrary `section` values. Routed through `BaseLayout`.
2. **Articles** — `content/writing/*.mdx` with `section: writing`. Routed through `ArticleLayout`.

The `section: writing` field in frontmatter is doing two jobs: it selects the template **and** signals that a page belongs to the article index. That coupling means you can't have a dated essay outside `content/writing/`, and you can't use article-style layout without joining the writing index. Every content file already has access to the same MDX components and the same React rendering — the split is artificial.

## The Unified Model

**One content type. One frontmatter schema. File path equals URL.**

- Any `.mdx` file in `content/` becomes a page. `content/foo/bar.mdx` → `/foo/bar.html`.
- Layout is chosen by the `layout` frontmatter field: `article` or `base`. Default is `base`.
- A page appears in the writing index if and only if it has a `published` date.
- The `section` field becomes purely presentational — it controls the running header breadcrumb and nothing else.
- All frontmatter fields (`title`, `description`, `published`, `revised`, `words`, `note`, `summary`, `print`) are valid on any page.

### Frontmatter Before

```yaml
# content/writing/on-tools.mdx — today
---
title: On Tools
description: Tools are not neutral.
published: 2025-03-01
words: 900
section: writing
---
```

### Frontmatter After

```yaml
# content/writing/on-tools.mdx — unified
---
title: On Tools
description: Tools are not neutral.
published: 2025-03-01
words: 900
layout: article
---
```

The `section` field is dropped from writing articles. If a page wants a custom running-header breadcrumb, it can still set `section` — but it no longer affects template selection.

For pages that already don't have `section: writing`, nothing changes. A page without `layout` gets `BaseLayout` as before.

## What Changes

### 1. Content frontmatter (`content/writing/*.mdx`)

Remove `section: writing` from all three articles. Add `layout: article`.

| File | Drop | Add |
|---|---|---|
| `content/writing/on-simplicity.mdx` | `section: writing` | `layout: article` |
| `content/writing/on-tools.mdx` | `section: writing` | `layout: article` |
| `content/writing/on-constraints.mdx` | `section: writing` | `layout: article` |

### 2. Types (`src/types/content.ts`)

- Add `layout?: "article" | "base"` to `PageMeta`.
- Keep `section?: string` for running-header use, but it no longer selects template.
- Keep `ArticleLayoutProps` extending `BaseLayoutProps` — the template split stays, it's just selected differently.

### 3. Template selection (`src/build/render-react-page.tsx`)

Replace:
```typescript
content.meta.section === "writing"
```
With:
```typescript
content.meta.layout === "article"
```

This is the one-line heart of the change. Template selection moves from implicit convention to explicit declaration.

### 4. Title stripping (`src/build/build-content.ts`)

`stripDuplicateArticleTitle` currently guards on `section !== "writing"`. Change to guard on `layout !== "article"`:

```typescript
if (input.meta.layout !== "article" || !input.meta.title) {
    return input;
}
```

### 5. Writing index (`src/build/writing-index.ts`)

No structural change needed. The index already works by scanning `content/writing/` for files with `title` and `published`. It doesn't check `section: writing`. It stays directory-based.

Future option: scan all of `content/` recursively and filter by `published` presence. That would let dated content live anywhere. But the directory convention is fine for now — it keeps the index predictable without extra configuration.

### 6. Section in running header (`src/components/running-header.tsx`)

No change. The running header already reads `section` as a display string. For writing articles, the section will derive from the URL path or fall back to the slug. Or articles can explicitly set `section: writing` if they want that breadcrumb — it just won't affect layout anymore.

Practically: writing articles lose their `section` field, so the running header falls back to `"home"`. If the breadcrumb should say "writing", either:
- Infer it from the file path in `build-content.ts` (add `section` to meta when the path contains `/writing/`).
- Or let each article set `section: writing` in frontmatter purely for display.

**Recommendation**: Infer `section` from the first directory segment of the content path when not explicitly set. `content/writing/on-tools.mdx` → `section: "writing"`. `content/cv.mdx` → no section. This keeps frontmatter clean and preserves the running header behavior.

### 7. Section inference (`src/build/build-content.ts`)

Add path-based section inference after frontmatter parsing:

```typescript
if (!meta.section) {
    const segments = filePath.split("/");
    const contentIdx = segments.indexOf("content");
    if (contentIdx >= 0 && segments.length > contentIdx + 2) {
        meta.section = segments[contentIdx + 1];
    }
}
```

This fills in `section` from the directory structure when the author doesn't set it explicitly. `content/writing/on-tools.mdx` → `section: "writing"`. `content/cv.mdx` → no section (shows "home" in running header as before).

### 8. Makefile

No change needed. The existing pattern rules already handle `content/*.mdx` and `content/writing/*.mdx` independently. The build doesn't care about `section`.

### 9. Docs

**`docs/architecture.md`**: Replace the `section: writing` routing description with `layout` field description. Update "Authoring Content" section.

**`docs/manifesto.md`**: No change — doesn't reference `section: writing`.

**`docs/roadmap.md`**: The "type-safe frontmatter" item in Later mentions "a discriminated union on `section`". Update to reference `layout` instead. Add a completed item or note about unified content model.

### 10. Tests

**`test/verify-architecture.ts`**: Replace `"section: writing"` in the required anchors with the new routing description (e.g. `"layout"` or `"layout: article"`).

**`test/verify-jsx-rendering.ts`**: Update the `resolveMetaDescription` test that passes `section: "writing"` — change to `layout: "article"`. Verify the article still renders with article layout. Check running header section value.

## What Stays The Same

- MDX as content format, YAML frontmatter, `gray-matter` parsing.
- The `BaseLayout` / `ArticleLayout` template split — both templates stay, they're just selected by `layout` not `section`.
- The component gate (`src/content-components.tsx`) — all pages already share it.
- The writing index directory scan — `content/writing/` stays the article home.
- CSS, client JS, islands architecture — untouched.
- The `published`, `revised`, `words`, `note` fields — they've always been valid on any page, now that's explicit.

## What This Enables

- **Dated content outside writing/**: A `content/notes/` directory could hold short posts with `published` dates. They'd need `layout: article` to get the article template, but they could also use `layout: base` with a custom presentation.
- **Article-style layout for any page**: Set `layout: article` on `content/cv.mdx` to get the article header and footer if you want them.
- **Cleaner frontmatter**: `section` becomes optional and purely cosmetic. New authors don't need to know about a magic routing value.
- **Simpler mental model**: "Files are pages. Frontmatter controls presentation. Folders control URLs."

## Migration Checklist

1. Add `layout` to `PageMeta` in `src/types/content.ts`
2. Update `render-react-page.tsx` to select template by `layout` field
3. Update `build-content.ts`: change `stripDuplicateArticleTitle` guard, add section inference from path
4. Update `content/writing/*.mdx` frontmatter: drop `section: writing`, add `layout: article`
5. Update `docs/architecture.md` to describe new routing
6. Update `docs/roadmap.md` type-safe frontmatter item to reference `layout`
7. Update `test/verify-architecture.ts` required anchors
8. Update `test/verify-jsx-rendering.ts` to use `layout` instead of `section`
9. Run full test suite, typecheck, and build
