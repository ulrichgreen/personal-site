# MDX Authoring

MDX is the content format. It's Markdown with the option to drop in React components where plain prose isn't enough — and only where it isn't enough.

## The Rules

1. **Frontmatter goes at the top, stays YAML.** Writing pages need `title`, `section`, `published`, and `description`. Other pages need at least `title` and `section`.
2. **All content files are `.mdx`** and live under `content/`.
3. **No `import` or `export` inside MDX files.** Ever. Components are provided by the build, not by the author.
4. **Only components exposed through `src/content-components.tsx` are available.** That file is the single gate between the authoring surface and the component library.

## Available Components

| Component | What it does |
|---|---|
| `<ArticleList />` | Renders the current writing index |
| `<DemoWidget />` | A hydratable example island |

## Writing Well in MDX

Most prose should stay prose. A component in content should feel like a deliberate choice, not a shortcut.

Hydrate only when the component genuinely needs client-side state. If it can render once and be done, it should.

Always write an explicit `description` in frontmatter. The automatic fallback exists as a safety net, not a feature.
