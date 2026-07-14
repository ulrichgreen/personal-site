# The Exposure Problem

> Here is a puzzle I have not solved. A page variant baked into cache identity has no moment of assignment and no moment of use — so where do you count the user who saw it?

**Description.** An honest essay about a genuinely open problem. Server-decided page variants that live in the cache key are wonderful for performance — the variant is decided before rendering, the page stays fully cacheable, no cookies, no flicker. But experiment analysis needs *exposure* events: who actually saw which variant. The cookie-and-hook model has two natural moments to emit that signal; the cached variant has neither, and every naive fix is wrong in an instructive way.

**Why it lands.** Engineering blogs almost never publish unsolved problems, which is exactly why this one will travel: it invites the reader into real work instead of performing a victory lap. Each dead end teaches a distinct systems lesson — emitting server-side per request counts caches, not people; consulting per-user state at render forces dynamic rendering and destroys the optimization being measured; client-side beacons reintroduce the consent and blocking problems the architecture was built to escape. Ending with criteria for an acceptable answer, rather than an answer, models the kind of thinking the rest of the site argues for.

## Outline

1. **The setup.** Two ways to vary a page: per-user assignment (cookie written, hook read — two clean moments to record exposure) and per-variant caching (the variant is part of the cache identity; one cached artifact serves thousands). The second is architecturally superior and analytically mute.
2. **Why exposure matters.** An experiment without exposure data isn't an experiment; it's a rollout with charts. Double-counting or under-counting quietly corrupts every downstream conclusion.
3. **Dead end one: emit at the server.** The render happens once per cache fill, not once per viewer. You'd be measuring your cache hit ratio.
4. **Dead end two: read per-user state at render.** Now the page depends on the requester and can't be cached — the measurement destroyed the thing measured. An observer effect, literally.
5. **Dead end three: a client beacon.** Works, but reopens everything the server-side model closed: consent complexity in the page, ad-blocker attrition, one more script. Maybe the least-bad — name its costs honestly.
6. **Criteria for a real answer.** Counts viewers not caches; adds no per-request rendering cost; respects the consent gate; doesn't double-count across navigations. Anything that meets all four is welcome to exist; I haven't met it yet.
7. **Close.** An invitation: this is where my thinking stops. If yours goes further, write to me.

**Notes.** Unusual genre for the site — the open-problem essay — and a natural comments/correspondence generator. From private direction notes (experimentation open question): the problem statement is fully generalizable. The "write to me" close fits the site's no-comments, email-first posture.
