# Article Drafts

Candidate articles for the site — one file per candidate, each carrying a title, a short description, a why-it-lands note, and a section-by-section outline. This folder is the writing pipeline's orchard: meant to be grazed, picked from, and pruned without ceremony. Most of these should never be written, and that is the folder working.

**How to use it.** Graze the index below. When a candidate earns writing, copy `content/articles/_template.mdx`, carry over the title and description, and write the essay from the outline (the outlines are beats, not headings — collapse or reorder freely). Then delete the draft file here. Candidates that stop fitting the manifesto get deleted without graduating. Ideas about the *site* belong in `inspiration.md`; this folder holds only ideas about the *writing*.

**Provenance and the publish rule.** These candidates were mined from this repo's own planning documents and from a private direction-layer corpus. Every draft is written at pattern level — no employer, no internal app/package names, no vendor-contract or migration specifics, no personal handles — and each carries a provenance note. Before publishing any of them, re-verify the anonymization holds in the finished prose; a few notes flag specific de-identification requirements (real people's pivots, live-defect war stories).

## The candidates

### Building for trust

The runtime series: consent, caching, telemetry, and security treated as architecture rather than compliance. Possible series title: *The Untrusted Front End*.

- [`the-banner-is-not-the-gate.md`](the-banner-is-not-the-gate.md) — consent enforced server-side at ingestion; the cookie banner captures, it cannot enforce.
- [`one-wire-out.md`](one-wire-out.md) — the browser gets one telemetry transport; vendors live behind server-side sinks. A new signal means a new sink, never a new wire.
- [`two-lifetimes.md`](two-lifetimes.md) — everything on a personalized page is shared-with-everyone or one-person's; that classification *is* the caching model.
- [`caching-other-peoples-secrets.md`](caching-other-peoples-secrets.md) — cross-user cache bleed as a breach class; identity in the key, deny on missing session, isolation tested in CI.
- [`no-side-effects-in-cached-bodies.md`](no-side-effects-in-cached-bodies.md) — a cached body only runs on a miss; every log, counter, and audit record inside it silently stops. One bug, three faces.
- [`what-the-browser-can-mint.md`](what-the-browser-can-mint.md) — "lock the API to our own frontend" cannot work; what each control actually proves, and honest abuse-cost thinking.
- [`by-construction.md`](by-construction.md) — the states worth preventing are made impossible, not forbidden: fail-closed defaults, boot-time mutual exclusion, keys over promises.
- [`hold-less.md`](hold-less.md) — custody before controls: the data you never hold needs no protection. Payment seams, opaque identifiers, fixtures-only environments.
- [`nothing-phones-home.md`](nothing-phones-home.md) — this site's zero-external-services posture as a series of engineering dividends, and measurement that respects readers without measuring them.

### Architecture with edges

Systems essays: each one a hard problem reduced to a distinction that makes the mechanisms boring.

- [`dont-make-the-application-composable.md`](dont-make-the-application-composable.md) — the flagship heresy: refuse composable-everything for functional pages; business logic must not become content.
- [`the-unknown-entry.md`](the-unknown-entry.md) — what a system does with a value it doesn't recognize is a stated rule or a pending incident. A taxonomy of answers.
- [`five-registries-one-shape.md`](five-registries-one-shape.md) — every platform grows the same artifact five ways; name the registry shape once: one owner per vocabulary, consumers mirror never fork.
- [`invalidate-on-ready-not-on-publish.md`](invalidate-on-ready-not-on-publish.md) — the publish event is intent, not availability; pick invalidation signals by what they guarantee.
- [`the-url-is-the-truth.md`](the-url-is-the-truth.md) — locale determinism: one URL, one response, and an entire bug family deleted. The honest per-language 404.
- [`preview-is-a-second-instance.md`](preview-is-a-second-instance.md) — editor preview as the same app deployed twice, differing in configuration, unable to become production by accident.
- [`gate-on-invariants-not-changelogs.md`](gate-on-invariants-not-changelogs.md) — riding the framework's leading edge responsibly: one loud test per assumption, pins, and a pre-decided fallback.
- [`share-the-contract-not-the-renderer.md`](share-the-contract-not-the-renderer.md) — web + native design systems share decisions, not components; the split lives at the renderer leaf.
- [`earn-the-extraction.md`](earn-the-extraction.md) — shared code's full lifecycle: the three-consumer bar on the way up, the strangler peel on the way down.
- [`the-exposure-problem.md`](the-exposure-problem.md) — an honest unsolved puzzle: counting who saw a variant that lives in cache identity. Every naive fix teaches something.

### Platform and people

The organizational layer: pitching, ownership, legacy, and the quality gates that actually turn on.

- [`a-timing-question.md`](a-timing-question.md) — the platform pitch that wins: pay once centrally now, or N times locally forever, with drift as the interest.
- [`what-it-is-not.md`](what-it-is-not.md) — disarm the threats a proposal raises before the ask; negative space is part of the definition.
- [`design-systems-are-platform-problems.md`](design-systems-are-platform-problems.md) — systems decay by ownership shape, not component quality; the rigidity trap, the abstraction tax, and the escalation ladder.
- [`fixed-once-in-the-vocabulary.md`](fixed-once-in-the-vocabulary.md) — cross-cutting concerns (a11y, tracking, theming) solved once in the component layer and inherited; audit the vocabulary, not the world.
- [`the-floor-is-not-the-proof.md`](the-floor-is-not-the-proof.md) — automation catches a third to half; the manual pass is a named release step, not an apology.
- [`the-ratchet.md`](the-ratchet.md) — turn the strict gate on today: baseline what exists, block what's new, expire the grandfathered.
- [`on-legacy.md`](on-legacy.md) — "legacy" is a policy owed, not a status declared: change rules, no new consumers, an owned exit. Temporary means indefinite until proven otherwise.
- [`every-unowned-question-answers-itself.md`](every-unowned-question-answers-itself.md) — unowned decisions still get made, by drift; ownership is what makes any direction real.
- [`standards-you-dont-need-yet.md`](standards-you-dont-need-yet.md) — a standard is a dependency; borrow its shape, defer its machinery, revisit on triggers.

### Direction

The thinking-tools series: how plans stay true. The most site-native group — several could form a series with the published essays.

- [`would-it-survive-a-rewrite.md`](would-it-survive-a-rewrite.md) — the one test that separates durable direction from screenshots of the code; names versus coordinates.
- [`the-direction-layer.md`](the-direction-layer.md) — the private, one-way steering repo above the codebase: bets, live forks, distill-upward, and why it must stay optional.
- [`no-decision-ledger.md`](no-decision-ledger.md) — against ADR archaeology for direction: settled choices are current text with a date; ledgers only where outsiders need the trail.
- [`open-questions-are-live-forks.md`](open-questions-are-live-forks.md) — one index of everything genuinely undecided; resolved items dissolve into direction and vanish.
- [`the-null-decision.md`](the-null-decision.md) — record what you refused to build, with the reopening trigger named; absences fail in both directions otherwise.
- [`the-orchard-and-the-harvest.md`](the-orchard-and-the-harvest.md) — idea husbandry: capture is not commitment, grazing is the point, graduation is rare and one-way.
- [`the-smallest-real-step.md`](the-smallest-real-step.md) — contested direction is settled by a narrow slice that crosses every seam, not a fourth strategy revision.
- [`proof-in-the-lead-app.md`](proof-in-the-lead-app.md) — one app proves each foundation piece; siblings adopt a de-risked follow. Destination committed, schedule owned by the adopters.
- [`the-seam-is-the-scope.md`](the-seam-is-the-scope.md) — plan your tier and its seams, not one inch past; the one-question test that sorts every paragraph.

### The research instrument

A three-part series on feeding external signal into decisions without drowning.

- [`an-intelligence-agency-of-one.md`](an-intelligence-agency-of-one.md) — the pipeline: layered collection, cadence as distillation, and the grounding annotation that turns information into intelligence.
- [`audit-your-sources.md`](audit-your-sources.md) — sources rot: author drift, broken feeds, and the silence you can't see. Counter-scan what curation structurally misses.
- [`materialized-escalated-fizzled.md`](materialized-escalated-fizzled.md) — keep a prediction ledger; grade your own radar, and let *fizzled* retire the noise.

### Working with machines

The agents series: what changes when software reads your writing and writes your software.

- [`operating-manuals-for-ai-coworkers.md`](operating-manuals-for-ai-coworkers.md) — the agent-instructions file as a genre: one governing test, tripwires for the irreversible, skills with when-not-to-use.
- [`teach-the-machine-to-hedge.md`](teach-the-machine-to-hedge.md) — the summary failure mode is smoothing, not lying; instruct for preserved uncertainty.
- [`confidently-wrong.md`](confidently-wrong.md) — once agents consume your docs, wrong beats missing in damage; govern the corpus before mandating its use.
- [`your-next-reader-is-a-machine.md`](your-next-reader-is-a-machine.md) — registry honesty, enforcement as the teacher, and token cost as a crude objective measure of design quality.
- [`the-privacy-cost-of-thinking-with-machines.md`](the-privacy-cost-of-thinking-with-machines.md) — the unresolved trade-off of piping a private second brain through third-party AI, treated as a live open question.

### Craft

Site-native essays that extend the manifesto and the published trilogy.

- [`js-you-never-ship.md`](js-you-never-ship.md) — every platform feature adopted is JavaScript never written, bundled, or maintained; adopt *and retire*.
- [`the-load-bearing-decision.md`](the-load-bearing-decision.md) — every design problem has one decision that carries the rest; find it, make it early, build around it.
- [`the-smallest-test.md`](the-smallest-test.md) — the smallest test that can fail for the right reason; deleting structure-guarding tests is maintenance.
- [`the-calm-version-is-a-choice.md`](the-calm-version-is-a-choice.md) — restraint is only legible as judgment when capability is legible too; the loud cut held in reserve.

## Suggested first picks

If publishing order matters more than mood: `would-it-survive-a-rewrite.md` (the site's next quotable test), `dont-make-the-application-composable.md` (the flagship alternative view), `no-side-effects-in-cached-bodies.md` (short, sharp, immediately checkable), `the-ratchet.md` (widest practical reach), and `audit-your-sources.md` (the one nobody else is writing).
