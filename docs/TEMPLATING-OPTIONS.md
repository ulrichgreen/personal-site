# Templating Options

## Philosophy

The real problem is not whether template literals are technically capable. They are. The problem is
that large layouts written as interpolated strings become visually brittle. HTML stops looking like
HTML. Conditionals become punctuation. The source starts to feel like output code instead of authored
markup.

So this document now assumes one direction only: **a custom JSX renderer for static output**.

That is the path that keeps the things that matter:

- zero JavaScript in the browser by default
- static HTML as the source of truth
- React-like authoring ergonomics
- explicit islands only when chosen
- a system small enough to understand completely

The goal is not to adopt React the platform. The goal is to steal React's best idea — components as
functions returning markup-shaped code — and keep everything else radically small.

---

## The Assumption — A Custom JSX Renderer

The whole document assumes this architecture:

1. write layouts and components in JSX
2. compile JSX to your own `h()` function
3. render the resulting tree to HTML at build time
4. ship no client runtime unless a component explicitly opts into browser behavior

```jsx
export function EssayLayout({ title, section, children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
      </head>
      <body>
        <header class="running-header">
          <span>ULRICH</span> / <span>{section}</span> / <span>{title}</span>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

At build time, JSX compiles into calls to your own runtime. That runtime can be comically small:

```js
export function h(tag, props, ...children) {
  return { tag, props: props || {}, children: children.flat() };
}

export const Fragment = ({ children }) => children;
```

The browser never sees this layer. It sees plain HTML.

---

## Why This Fits the Site

This direction fits the site better than string templates because it improves authoring without
weakening the underlying model.

### Better to Write

- nested layouts still look like markup
- conditional rendering reads like JavaScript, not string surgery
- components are easy to compose
- prose-heavy pages stay legible in source

### Better to Maintain

- the data shape stays explicit
- the layout logic stays in functions
- refactoring wrappers, figures, pull quotes, footnotes, and metadata blocks becomes routine

### Better for the Site's Values

- build-time rendering remains the default
- output stays inspectable
- there is no browser framework tax
- JavaScript remains enhancement, not dependency

This is basically the React mental model with the browser runtime removed.

---

## What It Would Take

To make your own tiny React-flavored SSG library, you only need a few parts.

### 1. JSX Compilation

Use a compiler that can target a custom JSX runtime:

- `esbuild`
- TypeScript with a custom JSX factory
- Babel if you really want it, though `esbuild` is the cleaner fit

The job of this step is simple: convert JSX into calls to your own runtime.

### 2. A Tiny JSX Runtime

You need:

- `h(tag, props, ...children)`
- `Fragment`
- child flattening
- component invocation when `tag` is a function

This should stay extremely small and dumb.

### 3. `renderToString()`

The renderer walks the tree and returns HTML. It must:

- handle native tags
- call function components
- flatten arrays
- ignore `false`, `null`, and `undefined`
- support void elements
- render attributes correctly
- escape text content and attribute values

That escaping layer is the security-critical part. HTML escaping should be the default, not a
courtesy.

### 4. A Small Build Contract

Each page module should export one renderable component or one page factory. The build pipeline then:

1. loads markdown and front matter
2. converts markdown to HTML or structured nodes
3. passes data into a JSX page component
4. calls `renderToString()`
5. writes static HTML to `dist/`

The outer architecture barely changes. Only the templating surface changes.

### 5. An Explicit Escape Hatch for Raw HTML

You will occasionally need trusted HTML from markdown output. Make that opt-in and obvious:

```js
html(markedOutput)
```

or:

```js
{ __html: trustedHtml }
```

Do not blur the line between escaped text and trusted raw HTML.

---

## Islands Without Betraying the Default

The default must remain: **ship zero JavaScript in the browser unless a page explicitly asks for it**.

That means the renderer should treat browser behavior as a second layer, not the rendering engine.

### The Rule

- every page renders fully to HTML without client JavaScript
- a component can opt into an island
- only pages containing islands load island code
- islands attach behavior to existing HTML instead of hydrating the entire document

### The Shape

A component can declare browser needs with metadata:

```js
CodeDemo.client = {
  entry: '/assets/islands/code-demo.js'
};
```

During the build:

- the server renderer outputs the component's HTML
- the page gets a `data-island` marker
- the build records which island entries that page needs
- only those scripts are included

This preserves the site's core ethic: HTML first, enhancement second.

---

## File Structure for Version One

The first version can stay very small:

```text
scripts/
  render.mjs
  jsx-runtime.mjs
  render-html.mjs
components/
  EssayLayout.jsx
  HomeLayout.jsx
  Prose.jsx
pages/
  index.jsx
  essay.jsx
```

Responsibilities:

- `jsx-runtime.mjs` — `h`, `Fragment`
- `render-html.mjs` — `renderToString`, `escapeHtml`, void-tag handling
- `render.mjs` — page loading, markdown data flow, final HTML output
- `components/` — reusable layout primitives
- `pages/` — route-level page components

That is enough to prove the idea.

---

## Take It Up a Notch — A Tiny Custom Framework

Once the basic JSX renderer works, you can evolve it into a tiny custom framework for React-style
authoring that gives you an Astro-like DX without inheriting Astro's generality.

The key is to keep it **highly targeted for simple prose-heavy sites**.

Not a universal web framework. Not a platform. A sharp tool for your own publishing model.

### The Design Goal

You want this feeling:

- write in JSX
- render to static HTML by default
- drop in a self-contained interactive component when needed
- scope CSS per component without a separate styling religion
- keep the mental model small

### What Makes It Feel Astro-Like

An Astro-like DX here does not mean cloning Astro. It means adopting a few excellent ideas:

1. **components are server-first by default**
2. **client islands are explicit**
3. **content pages stay mostly static**
4. **interactive bits are isolated and intentional**
5. **the build output is still plain HTML, CSS, and a few targeted scripts**

That is the part worth stealing.

---

## Feature Set for the Custom Framework

If you want to turn the renderer into a small framework, these are the features worth adding.

### CSS Modules via lightningcss

This is the first upgrade I would make.

Let components import local styles:

```jsx
import styles from './CodeExample.module.css';

export function CodeExample({ children }) {
  return <figure class={styles.block}>{children}</figure>;
}
```

At build time:

- `lightningcss` processes `.module.css`
- class names are scoped
- the used CSS is emitted into page-specific or shared bundles
- no runtime styling system is needed

This gives you component-local styling without bringing in CSS-in-JS or a full framework pipeline.

### Client Islands for Code Examples

Code examples are a perfect island case because the default output is already static.

Base behavior:

- syntax-highlighted HTML is rendered at build time
- copy button behavior is optional
- expandable annotations or line-focus tools become an island only where used

That means most code blocks stay pure HTML, while advanced code explanations can opt into a tiny
script only on pages that need them.

### Interactive Widgets for Explaining Code Concepts Visually

This is where the custom framework could become genuinely special.

Examples:

- a small state transition visualizer
- a DOM tree explainer
- an event loop timeline
- a CSS layout playground with a fixed set of controls
- a typography axis demo for variable fonts

These are not app features. They are teaching instruments embedded inside essays.

That makes islands an especially good fit: they are self-contained, educational, and localized to the
pages that need them.

### Newsletter Signup

A newsletter signup is another clean island:

- static HTML form by default
- progressive enhancement for validation or optimistic UI
- easy to omit entirely from pages that do not need it

The important part is that signup behavior should not force a site-wide client runtime. It should be
just another small component with a browser entry.

### Self-Contained React Components

This is the more ambitious move.

Once your JSX system is stable, you could allow certain islands to be authored as isolated React
components if that improves developer speed for richer interactions.

The server side would still default to your own renderer. The React usage would be constrained to
client islands only.

That gives you an interesting hybrid:

- your site framework remains custom and server-first
- the browser gets zero JavaScript by default
- richer islands can use React when they truly benefit from local state and composition

That is a much better bargain than making React the page renderer for the whole site.

---

## Boundaries That Keep It Elegant

If you build this framework, it should stay opinionated enough to avoid turning into another general
purpose SSG.

Good constraints:

- optimize for essays, notes, and a CV
- assume mostly static pages
- assume one author
- assume the happy path is semantic prose, not application state
- keep routing simple
- keep content loading obvious
- keep browser JavaScript opt-in only

The moment it starts trying to compete with full frameworks, it loses its point.

---

## Practical Migration Path

The nicest thing about this direction is that you can test it incrementally.

### Phase 1 — Replace Only the Outer Layout

- keep markdown and front matter exactly as they are
- replace the current base template with a JSX layout
- prove that the output HTML is equal or better

### Phase 2 — Introduce Reusable Prose Components

Move repeated structures into components:

- running headers
- footnotes
- pull quotes
- code-example wrappers
- figure and caption blocks

### Phase 3 — Add CSS Modules

Use `lightningcss` to scope component styles while keeping the final CSS output small and legible.

### Phase 4 — Add One Island Type

A good first island would be one of these:

- code-example controls
- a visual explainer widget
- newsletter signup

Prove the island pipeline with one clear use case before generalizing it.

### Phase 5 — Extract the Pattern Into Your Own Framework

If the renderer keeps feeling good, then promote it from "a few helper files" to a named internal
framework with conventions for:

- pages
- components
- CSS modules
- island entries
- asset output

That is the moment it starts to feel like a tiny Astro for prose-heavy React-minded work.

---

## Recommendation

Build the custom JSX renderer first, and keep version one almost embarrassingly small.

Then, if it earns the right to grow, evolve it into a tiny framework with:

- server-first JSX components
- `lightningcss`-powered CSS modules
- explicit client islands
- self-contained interactive teaching widgets
- optional richer React islands where they are justified
- a build pipeline optimized for simple prose-heavy sites

That path gives you the React ergonomics you want without paying the usual framework tax in the
browser.
