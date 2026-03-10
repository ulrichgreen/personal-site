# Stack

Every tool here was chosen on purpose. If something isn't on this list, I either removed it or never needed it.

## Make

The top-level build graph. Make still says "what produces what" more clearly than any task runner. It's old, it's boring, it works.

## TypeScript

TypeScript covers the build, the templates, the client code, and the tests. Not because this is an app — because the dangerous parts of the codebase are the seams: the content model, the rendering path, the file boundaries. Types catch the mistakes that matter.

## React + `react-dom/server`

React is the rendering engine for templates, MDX content, and interactive islands. One component model, three uses.

`react-dom/server` renders the full document at build time. The browser never sees React unless an island explicitly opts in.

## MDX + `gray-matter`

`gray-matter` handles YAML frontmatter parsing. `@mdx-js/mdx` compiles MDX into React components at build time.

This gives me an expressive content format — components in prose where they earn it — without resorting to string-template spaghetti or runtime compilation.

## `lightningcss` + `esbuild`

`lightningcss` bundles and minifies the CSS. `esbuild` bundles the two client-side entry points (progressive enhancement and island hydration).

Both are fast, single-purpose, and require almost no configuration. That's the whole point.

## `chokidar` + `ws`

File watching and WebSocket-based live reload for the dev server. It watches, rebuilds, and tells the browser. Nothing more.

## What This Stack Avoids

No full-page hydration. The document is static. Islands are the exception, not the rule.

No client-side routing. Pages are URLs. Navigation is an `<a>` tag.

No arbitrary imports from MDX content. Components go through one gate.

No CSS framework. The design system is the CSS itself.

No tool added because it's popular. Every dependency answers to the question: does this make the site better for the reader?
