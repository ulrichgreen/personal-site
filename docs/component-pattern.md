# Component Pattern

This document captures the component structure used by the site and turns it into a repeatable recipe.

Use it in two situations:

- to convert an existing standalone component into the colocated structure
- to create new standalone components that should follow the same conventions from the start

The goal is not just folder tidiness. The goal is to make each standalone component legible as a small unit with a clear public entry point, predictable global class names, and minimal coupling to the rest of the site.

## When To Use This Pattern

Use this pattern for a component when most of the following are true:

- it is a named, reusable UI unit rather than incidental markup inside one template
- it may grow a few adjacent implementation files over time
- its public API can be expressed as one exported TSX component
- it has enough component-specific styling to need a named class surface in `src/styles/components.css`

Do not force this pattern onto every file.

Keep a component as a single `.tsx` file when it is still trivial and can rely on semantic HTML plus shared global classes.

## Target Shape

For a component named `Hero`, the target structure is:

```text
src/components/
  hero/
    hero.tsx
```

The folder name should be lowercase and match the component file name.

Component styles live in the global CSS layer files, usually `src/styles/components.css`. Use a predictable prefix that matches the component folder, such as `.hero`, `.hero__body`, and `.hero--with-portrait`.

## Responsibilities

### `component.tsx`

This is the component's public entry point.

It should:

- export the component itself
- define or import the component props
- compose semantic component classes with existing shared utility or structural classes when needed
- keep the markup readable without hiding simple class composition behind helpers

It should not:

- import component-specific stylesheets
- know how CSS is bundled
- contain unrelated helper code that belongs at a broader layer

In practice, the component file should feel like the clearest possible statement of the component's markup and API.

### `src/styles/components.css`

This file holds the site's component layer.

It should contain:

- shared component primitives such as `.header`, `.card`, and `.semi-bleed`
- named component class families such as `.hero`, `.site-nav`, and `.article-list`
- component states and variants expressed with clear modifiers
- selectors that are intentionally part of the site's public styling language

It should not become a dumping ground for page-specific one-offs. If a rule is only prose styling, layout scaffolding, typography, code presentation, or motion, keep it in the more specific global stylesheet for that concern.

## Shared vs Component Styling

This is the most important judgment call in the pattern.

Keep a class shared when it is part of the site's common language:

- shared layout wrappers such as `.section`
- shared typographic helpers such as `.label`, `.lede`, or `.heading-display`
- shared editorial header primitives that more than one component uses
- design tokens, keyframes, or rules that are intentionally site-wide

Use a component-prefixed class when the selector is specific to one component's structure:

- internal wrappers such as portrait containers, local body rows, or metadata dots
- component-specific spacing and arrangement
- component-specific interaction states
- animation timing applied only to that component's elements

The pattern is not "everything global and vague". The pattern is "global, named, and disciplined".

## The Hero Example

`Hero` is the reference implementation.

Its current shape demonstrates the intended split:

- the component entry lives in `src/components/hero/hero.tsx`
- the component-specific class family lives in `src/styles/components.css`
- shared editorial header primitives also live in global stylesheets

That means the Hero markup composes both component-prefixed and shared classes.

Examples:

- the root section keeps shared structural classes like `section` and `header`, then adds `hero`
- the kicker keeps shared typography and header layout classes, then adds `hero__kicker`
- the rule and metadata row still compose with shared `header__rule` and `header__meta` classes while adding component-specific behavior and spacing

That composition is intentional. Component-prefixed classes keep the component surface clear without reintroducing a local styling build pipeline.

## Recipe For Converting An Existing Component

### 1. Create the component folder

Move the component from:

```text
src/components/example.tsx
```

to:

```text
src/components/example/example.tsx
```

### 2. Move imports to the new location

Update any imports that referenced the old file path.

If the component is exposed to MDX through `src/content-components.tsx`, update that file as part of the same change.

### 3. Choose a class prefix

Use the component folder name as the class prefix.

For `src/components/example/example.tsx`, use names like:

- `.example`
- `.example__body`
- `.example__title`
- `.example--featured`

Prefer semantic names that describe the component part, not its current visual treatment.

### 4. Move component rules into the global component layer

Add the component's rules to `src/styles/components.css`.

Leave in other global CSS files:

- shared primitives used by multiple components
- utility classes
- site-wide tokens, keyframes, and layered structure
- prose, layout, code, print, or motion rules that belong to those concerns

If a selector looks shared but is actually only used once, prefer a component-prefixed name unless there is a clear reason to keep it as part of the shared system.

### 5. Preserve composition at the markup level

When a component relies on shared global classes, keep composing them in the JSX rather than copying their behavior into the component-prefixed class.

That usually means class strings like:

```tsx
<p className="hero__meta header__meta label">
```

This is the right pattern when the element needs both the shared baseline behavior and component-specific refinement.

### 6. Keep the public API small

As you move the component, take the chance to trim accidental complexity.

Prefer:

- one exported component
- one clear class prefix
- small, explicit props

Avoid introducing extra wrapper files, barrels, or variant systems unless the component actually needs them.

### 7. Verify the rendered output

After conversion, verify:

- TypeScript still accepts the component
- the CSS bundle still contains the component's global styles
- the rendered HTML still composes the expected shared and component-prefixed classes

In this repository, the usual checks are:

- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run test`

## Recipe For New Components

When building a new standalone component, start with the target shape immediately.

### Start with the folder

Create the folder and component file first:

```text
src/components/new-component/
  new-component.tsx
```

### Write the TSX around the public API

Define the props first, then write the minimal markup the component actually needs.

Use semantic HTML and shared classes before adding component-prefixed classes.

### Keep CSS global but specific

Begin with component-prefixed classes in `src/styles/components.css`.

Only promote a rule into a shared class when one of these becomes true:

- another component needs the same selector-level behavior
- the rule is clearly part of the site's shared typographic or layout language
- keeping it component-prefixed would duplicate design-system logic that already exists globally

### Prefer explicit composition over hidden abstraction

If a component needs shared structure plus component-specific refinement, write both classes in the markup.

Do not invent a new abstraction layer just to avoid a two- or three-class `className`.

## Naming Guidance

Use predictable names.

- folder: lowercase, usually kebab-case if the component name has multiple words
- file: match the folder name
- exported component: PascalCase
- component classes: prefix with the component name, use element and modifier suffixes when useful

Examples:

- `.article-list`
- `.article-list__item`
- `.series-nav__link--current`

## What Not To Do

Avoid these failure modes:

- creating component-specific stylesheets or CSS module imports
- moving files into folders without moving the component-specific CSS into the global component layer
- using generic global names such as `.root`, `.body`, or `.title`
- duplicating shared global styles inside component-prefixed classes just to reduce class composition in TSX
- adding barrels, `index.ts`, or extra indirection for a component that only needs one entry point
- creating separate pattern exceptions for each component instead of treating this as a default recipe

## Decision Rule

When unsure whether a rule belongs to a component class family or a shared class, ask:

"Does this primarily express this component, or does it primarily express the site's shared language?"

If it expresses the component, use the component prefix.

If it expresses the shared language, keep it shared.
