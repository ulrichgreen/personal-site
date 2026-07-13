# Component Pattern

This document captures how components and styling relate on this site.

The short version: components own markup, `src/styles/style.css` owns all
styling, and the two meet through semantic HTML — not through a class
naming convention.

## The styling contract

There is one stylesheet: `src/styles/style.css`. It is organized as a
cascade — tokens, then bare elements, then the page grid, then the few
widgets that need a name. It styles HTML elements directly and reaches
components through structure and context:

- **Elements first.** `article > header`, `main > footer`,
  `aside[data-type]`, `nav[aria-label="Breadcrumb"]`. If a selector can be
  written from the markup a component already produces, no class is added.
- **Position and state second.** The article masthead is styled by shape:
  the first `p` is the eyebrow, `h1 + p` without a `time` is the lede, the
  `p` containing a `time` is the meta row. Series labels in the article
  list are `li:not(:has(a))`.
- **Classes last, and only single words.** A class exists when structure
  genuinely cannot disambiguate (`.toc`, `.revisions`, `.logo`,
  `.playground`) or when a script needs a stable hook (`.skip-link`,
  `.fn-ref`, `.margin-note`, `.scroll-reveal-heading`). No BEM, no
  utilities, no `component__element--modifier` naming.

Colors are `light-dark()` pairs declared once in `:root`; nothing outside
the token block mentions a color scheme. Layout is one named-column grid
on `body` (`prose`, `wide`, `bleed`), with `main` and `article` as
subgrids so any element can claim a wider column without wrappers or
negative margins.

## What a component should look like

A component is a folder with one `.tsx` file:

```text
src/components/
  callout/
    callout.tsx
```

The component file should:

- export the component and its props
- produce the most semantic markup available (`aside`, `nav`, `figure`,
  `time`, `output`) so the stylesheet can reach it without classes
- keep attributes that scripts or styles key on (`data-type`,
  `aria-label`, `data-island`) stable — they are the public surface

The component file should not:

- import stylesheets
- carry presentational class lists
- know how CSS is bundled

## Adding styling for a new component

1. Write the markup with the right elements and ARIA attributes.
2. Try to style it in `style.css` from structure alone.
3. If two components produce colliding structures, give the new one a
   single-word class and scope its rules under it.
4. Keep the rules in the stylesheet section that matches where the
   component lives (site chrome, article, widgets).

## Failure modes to avoid

- Adding a class where an element or attribute selector already works.
- Inventing utility classes; sizes and colors come from the tokens.
- Component-specific stylesheet files; everything lives in `style.css`.
- Styling a script hook (`.fn-ref`, `#progress`) differently from the
  script's expectations — those selectors are contracts, verified by the
  test suite.
