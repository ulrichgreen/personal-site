# Typography Class Mapping

| Element | Class | Notes |
|---|---|---|
| `.hero__kicker` | `.label` | Replaces mono/uppercase/tracked/tiny/muted block |
| `.hero__name` | `.heading-display` | Display serif heading |
| `.hero__meta` | `.label` | Mono label pattern |
| `.header__eyebrow` | — | Shared kicker layout and rule for hero/article headers |
| `.title` | — | Shared title measure used by hero/article/series headings |
| `.lede` | — | Shared serif intro copy for hero/article summaries |
| `.header__meta` | — | Shared metadata container for hero/article headers |
| `.card` | — | Shared bordered raised surface for boxed components |
| `.container` | — | Shared max-width and gutter wrapper for full-width regions |
| `.article-header__kicker` | `.label` | Same label pattern |
| `.article-header .title` | `.heading-display` | Display serif heading |
| `.article-meta` | `.label` | Same label pattern |
| `.article-header__abstract` | — | Keeps local serif italic override |
| `.article-footer` | `.label` | Same label pattern |
| `.page-header` | `.label` | Same label pattern |
| `.site-nav` | `.label` | Same label pattern |
| `.article-list time` | `.label` | Applied directly to `<time>` element |
| `.article-list__series-label` | `.label` | Series group heading |
| `.series-nav__label` | `.label` | "Series" label text |
| `.series-nav__progress` | `.label` | "Part X of Y" text |
| `.series-nav__ordinal` | `.label` | Entry number |
| `.series-nav__prev` | `.label` | Previous link |
| `.series-nav__next` | `.label` | Next link |
| `.hero__tagline` | — | Local serif italic, 1.05rem |
| `.article-header__byline strong` | — | Local serif italic override |
| `.author-note` | — | Mono uppercase but different size (sm) |
| `.margin-note` | `.caption` | Small muted text |
| `.fn-ref` | — | Functional inline element |
| `.fn-inline` | `.caption` | Small muted text |
| `.series-nav__title` | — | Fluid italic, local style |
| `.series-nav__link` | `.body-sm` | Small body text for link titles |
| `article blockquote p` | — | Fluid quote size, local |
| `.article-list__link` | — | Fluid link size |
| `.page > h1:first-child` | — | Display-sm heading, kept local |
| `.playground__title` | `.label` | Mono label pattern |
| `.playground__readout` | `.mono` | Mono viewport-width readout |
| `.control__label` | `.label` | Mono label pattern |
| `.control__value` | `.mono` | Mono control value readout |

## Cascade layers

Every rule lives inside one named layer, declared once in
`style.css`:

```css
@layer reset, tokens, base, typography, layout, interactive, components;
```

Order is precedence: later layers win regardless of selector specificity,
so a component rule never needs `!important` or deep selectors to override a
base default. Place new rules in the layer that matches their job:

- `reset` — element normalization only.
- `tokens` — custom properties (`:root`), no element styling.
- `base` — bare element defaults (semantic HTML, prose).
- `typography` — the shared text utilities (`.label`, `.mono`, `.caption`, …).
- `layout` — page scaffolding, containers, regions.
- `interactive` — focus, hover, motion-driven states shared across components.
- `components` — self-contained component CSS (`@import`ed per component).

## Token philosophy

- Spell out a literal color/size **once**, as a token in `tokens.css`. Anything
  used in more than one place, or that must shift between color schemes, is a
  token — never a repeated literal.
- Derive related values instead of hand-tuning new literals. Prefer
  `color-mix()` over a fresh hex (e.g. `--color-border-subtle` and the copy
  button's error state both derive from existing tokens, so they track light
  and dark automatically).
- Keep the token set small. Add a token when a value is shared or theme-aware;
  a genuinely one-off, scheme-independent value can stay inline rather than
  inflating the system.

