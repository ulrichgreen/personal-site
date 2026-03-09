# Structure

This repo has a simple split.

## Where Things Live

`content/`

The markdown source for pages and essays.

`src/`

All code that produces the site.

`src/build/` contains command-line build steps.

`src/runtime/` contains the small JSX runtime and renderer.

`src/templates/` contains page-level templates.

`src/components/` contains reusable TSX pieces.

`src/client/` contains browser-only code.

`src/styles/` contains the stylesheet partials.

`docs/`

Short project documents. Each file should answer one question and stop.

`test/`

Small verifiers for rendering, docs, typography, and content expectations.

`dist/`

Generated output. Never edit it by hand.

## Typical Changes

Adding an essay means editing `content/writing/`.

Changing the page chrome usually means `src/templates/` or `src/components/`.

Changing the build means `src/build/` or `src/runtime/`.

Changing the look means `src/styles/`.

Changing a progressive enhancement means `src/client/site.ts`.

## Why It Is Shaped This Way

The repo now looks closer to a normal React project because that shape is easy to scan. The difference is that the output is still static HTML and the browser never pays for the TSX authoring model.

That is the trade: familiar source layout, minimal runtime.