# Experiments

The calm version of the site is the real version. But a craftsperson should be allowed a secret drawer.

This file holds the ideas that are too fun to forget and too risky to ship by default. They live here until they earn a place — or stay here because staying here is the right call.

## Load Full Experience

A hidden footer trigger: `Load full experience`.

The quiet site stays quiet. One click, and the whole thing briefly becomes something else — an overbuilt, Flash-era, "what if I had no restraint" alternate cut. Motion, color, weight, surprise. A love letter to the era when personal sites were loud and strange and proud of it.

The rules:

- The page structure stays intact. The writing stays readable.
- Only the presentation layer changes. No content swap, no navigation change.
- It respects `prefers-reduced-motion` — the experience scales down gracefully.
- There's always a clean exit: `Return to reality`.
- It should feel crafted and deliberate, not chaotic.
- It must never become the reason the rest of the site gets harder to maintain.

The point isn't the mode itself. The point is proving that the calm version is a _choice_ — that the restraint comes from taste, not from inability.

## More Ideas Worth Exploring

**SVG social cards** generated at build time — every shared link gets a bespoke card instead of a generic fallback.

**A 404 page that feels authored** — not an apology, a small piece of content. Something that makes getting lost feel intentional.

**Scroll-driven animations** — CSS-only, using `animation-timeline: scroll()`. Subtle reveals and parallax-lite effects. No JS, no library, just the platform.

**A colophon page** that documents the typographic and design decisions in detail — the kind of page other developers would bookmark.

## Why This File Exists

Some ideas are good _because_ they're optional. Corralling them here keeps them from leaking into the core build before they're ready. If an experiment proves itself, it graduates to the roadmap. If not, it stays here — alive, contained, and harmless.
