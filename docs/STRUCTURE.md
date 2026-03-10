# Structure

Everything has a place. If it doesn't, it doesn't belong yet.

## The Map

**`content/`** — MDX source files. Pages, essays, everything the reader sees. This is the material.

**`src/`** — All code that builds the site:

- `src/build/` — CLI build steps and render pipeline.
- `src/content-components.tsx` — the approved component surface for MDX. The only door in.
- `src/templates/` — page-level React templates (article, base).
- `src/components/` — shared TSX pieces used across templates.
- `src/client/` — browser-only code (progressive enhancement + island hydration).
- `src/islands/` — explicitly hydratable React components and the island wrapper.
- `src/styles/` — CSS partials, layered and authored by hand.
- `src/types/` — TypeScript interfaces for the content model and layout props.

**`docs/`** — These files. Project constraints and directions, not aspirational prose.

**`test/`** — Small verifiers that keep docs, rendering, typography, and content honest.

**`dist/`** — Generated output. Read it, serve it, never edit it.

## Common Moves

| What you're doing | Where you go |
|---|---|
| Writing a new essay | `content/writing/*.mdx` |
| Changing page chrome | `src/templates/` or `src/components/` |
| Touching the build | `src/build/` |
| Changing the look | `src/styles/` |
| Adding a progressive enhancement | `src/client/` |
| Exposing a component to content | `src/content-components.tsx` |
| Building an interactive island | `src/islands/` + `src/client/islands.ts` |
| Updating content model types | `src/types/content.ts` |

## Why This Shape

The repo borrows React's component model because MDX and islands are easiest to express that way. But the output is still static HTML. Only explicit islands pay any hydration cost. That's the deal — a capable authoring surface without the client-side weight.
