# ulrich.green

A personal site. The writing is the product; everything else is support structure.

The generator is hand-rolled: a small TypeScript build pipeline using Preact for server-side rendering, constrained MDX for authoring, esbuild, Lightning CSS, and sharp. That is deliberate. The site exists to remember that the web is mostly text files — HTML, CSS, URLs, and a little restraint get you a long way — and a build a person can read in one sitting is part of the point. See `docs/manifesto.md` for the full argument.

Content lives in `content/` (MDX), site code in `src/`, tests in `test/`. The build writes plain HTML, CSS, fonts, images, and a couple of focused browser bundles to `dist/`.

## Quick Start

Requires Node.js 24 or later. pnpm is managed through corepack:

```sh
corepack enable
pnpm install
pnpm dev
```

## Scripts

| Script                | What it does                                                        |
| --------------------- | ------------------------------------------------------------------- |
| `pnpm build`          | Build the site into `dist/`.                                        |
| `pnpm dev`            | Build, serve locally, and rebuild on change.                        |
| `pnpm start`          | Build once and serve the generated site from `dist/`.               |
| `pnpm test`           | Run unit tests and rendered-output verifiers.                       |
| `pnpm typecheck`      | Check the TypeScript contracts (`tsc --noEmit`).                    |
| `pnpm verify`         | Typecheck, build, and test, in that order.                          |
| `pnpm clean`          | Remove generated output.                                            |
| `pnpm audit-content`  | Print read-only diagnostics for the content archive.                |
| `pnpm check-links`    | Check internal links in the rendered output.                        |

## Documentation

`docs/README.md` maps the docs folder: manifesto, architecture, tooling, writing guide, and planning files. `AGENTS.md` describes the structured workflows for coding agents working in this repository.

## License

ISC. See `LICENSE`.
