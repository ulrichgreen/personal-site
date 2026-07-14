# The JavaScript You Never Ship

> Every platform feature you adopt is JavaScript you never write, never bundle, never debug, and never maintain. Betting on the platform is a maintenance strategy disguised as a technical preference.

**Description.** The browser has spent a decade absorbing responsibilities that used to require libraries: layout systems, scroll-driven animations, view transitions, popovers, dialogs, form validation, container queries, color functions. This essay reframes "use the platform" from aesthetic principle to economic argument: a library feature is a permanent liability on your balance sheet (bundled, versioned, upgraded, secured); a platform feature is the browser's liability — it gets faster, safer, and more accessible over the years *without you shipping anything*. The discipline is watching the platform's absorption frontier deliberately and retiring your JavaScript as native capability arrives.

**Why it lands.** "Use the platform" preaches to the converted; the ledger framing recruits the unconverted, because it speaks roadmap: every dependency is future work, and platform adoption is the only feature work that *reduces* future work. The retirement move is the practical novelty — teams add platform features but rarely delete the library the feature replaced, so they pay both costs. An audit habit ("what are we shipping that the browser now does?") gives readers a repeatable action, and the essay extends the site's published trilogy with its economic sequel.

## Outline

1. **Two implementations of the same thing.** An accordion: forty lines of JavaScript with a focus bug, or a `details` element. The visible difference is bytes. The real difference is who maintains it for the next decade — you, or every browser vendor on earth.
2. **The ledger.** Library features are liabilities: parsed on every visit, patched on every advisory, migrated on every major. Platform features are the browser's liabilities. Adopting one is the rare transaction that moves cost *off* your books permanently.
3. **The absorption frontier.** What required a library five years ago and doesn't now: smooth scrolling, lazy loading, dialog focus traps, popovers, transitions between views, masonry-ish layout, container-relative styling. The frontier moves constantly; most teams' dependency lists don't.
4. **Retire, don't just adopt.** The common failure: the platform feature arrives, gets used in new code, and the polyfill-era library stays bundled for the old code. Absorption pays only on deletion. Schedule the funerals.
5. **The honest boundary.** The platform is behind on real things — some interactions, some state, some rendering needs genuinely require script. The discipline is not zealotry; it's defaulting to the platform and making the library defend itself (a specific, nameable gap — not habit).
6. **Watching as a practice.** Baseline status, release notes, feature dashboards: a small, scheduled scan of what shipped, asked as one question — *what are we currently shipping that the browser now does?*
7. **Close.** The best dependency is the one 8 billion devices update for you.

**Notes.** Site-native theme (extends the published Web Trilogy; the manifesto's "the web is enough" made economic). Draws on the research feed's recurring "CSS absorbs JS" theme — public knowledge, no confidentiality concerns. Interactive-island potential: a before/after toggle of library vs. platform implementations.
