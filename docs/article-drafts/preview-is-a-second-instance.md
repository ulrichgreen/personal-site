# Preview Is a Second Instance

> The editor's preview and the customer's site should be the same application twice — differing in configuration, never in code, and never able to become each other by accident.

**Description.** Content preview is usually bolted on: draft flags sprinkled through the rendering path, special headers, a login nobody remembers disabling. This essay argues for preview as a *separate deployed instance* of the same app — same code, same queries, different configuration — with boot-time assertions making preview mode and real customer data mutually exclusive by construction.

**Why it lands.** Preview is where three hard things collide: draft content, authenticated iframes, and personal data — and almost every team improvises it. The by-construction move is the teachable core: mock personas mean the preview environment holds no real user data *by construction*, not by policy; a boot assertion means a stray environment flag cannot quietly open a draft-mode door on the production instance. Readers get a deployable shape, not a warning to be careful.

## Outline

1. **The improvised preview.** A `?preview=true` param here, a cookie there, a draft check inside six components. Every one of these is a branch in the customer-facing code path, waiting for a wrong turn.
2. **One app, two instances.** Preview is the same build, deployed twice: the customer instance with preview capabilities *absent* (not disabled — unconfigured, nonexistent), the preview instance with draft mode, relaxed framing for the CMS iframe, and persona injection.
3. **Mutually exclusive by construction.** The boot-time assertion: preview/mock mode and a real customer backend refuse to coexist. The process won't start misconfigured. Configuration mistakes become crash-loops, not incidents.
4. **Personas instead of PII.** Auth-gated pages preview against fixture personas — so the preview environment contains no real personal data *by construction*. The strongest privacy statement is the one the architecture makes for you.
5. **Draft reads are never cached.** Preview traffic runs the same queries with short-lived, validated tokens and structurally bypasses every cache. Freshness bugs and draft-leak bugs die together.
6. **What editors get.** On-page editing against the real rendering pipeline — preview that is *true*, because it is the application, not a simulation of it.
7. **Close.** Any environment that can see drafts or fake identities is a different trust zone. Give it a different instance, and make the boundary something the code enforces, not something the team remembers.

**Notes.** From private direction notes (preview-design and mock-mode notes): fully generalizable to any CMS/framework. Pairs with `by-construction.md` (this is its worked example).
