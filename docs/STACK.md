# Stack

These are the tools that matter.

## Make

Make is the top-level build graph. It is still the clearest way to say what produces what.

## TypeScript

TypeScript now covers the build, templates, client code, and tests.

The reason is simple: the risky parts of this repo are the content model, the rendering path, and the file boundaries. Types help there.

## TSX With A Small Runtime

Templates use TSX because it is easier to read and compose than string templates once layouts grow past trivial size.

The runtime is still custom and small. TSX is an authoring format, not a framework commitment.

## marked And gray-matter

`gray-matter` parses frontmatter.

`marked` turns markdown into HTML.

Both stay because they solve the exact problems this site has and then get out of the way.

## lightningcss And esbuild

`lightningcss` bundles and minifies the stylesheet.

`esbuild` handles two jobs: loading TSX templates at build time and compiling the tiny browser script.

That keeps the toolchain short.

## chokidar And ws

The dev server watches files, rebuilds, and reloads the browser. Nothing more.

## What This Stack Avoids

No framework runtime.

No client-side routing.

No hydration.

No CSS framework.

No tool added just because other projects use it.