# What the Browser Can Mint

> Anything the browser can create, an attacker inside the browser can create too. Plan for higher abuse cost, not impossible secrecy.

**Description.** Teams keep reinventing the same charm: a "proof-of-origin" token, minted client-side, to ensure API routes are "only called from our own front end." This essay explains why the charm cannot work — anything reachable by a browser is reachable by a scripted client — and what the real layers are: session authorization in the handler as the boundary, origin checks as CSRF hygiene, edge protection as a backstop, and honest acceptance that public means public.

**Why it lands.** "How do we lock the BFF to our own frontend?" is one of the most-asked and worst-answered questions in web architecture — the answers usually involve secrets shipped to the client, which is security theater with extra steps. A clear taxonomy (what each control actually authenticates: the user, the request's origin, or nothing) saves readers from rediscovering the dead ends. The refusal to promise secrecy is the credibility move: the goal is raising abuse cost, and saying so plainly is rarer than it should be.

## Outline

1. **The recurring wish.** "Only our frontend may call these routes." A reasonable-sounding sentence that dissolves under one question: distinguishable *how*? Every credential you give the page, you give the attacker who scripts the page.
2. **What each control proves.** A session cookie: who the user is. An origin header: which site the request rode in on (CSRF). A rate limit: how fast abuse can go. A client-minted token: nothing — it proves the client ran your code, which is what attackers do.
3. **The handler is the boundary.** Not the proxy, not the edge, not the middleware that "already checked." The route handler authorizes the session or the data does not leave. Everything in front of it is cost, not identity.
4. **Three kinds of routes.** Personalized (session-authorized, always), anonymous-but-platform-owned (webhooks, ingestion — secret in a header, constant-time compare, rate-limited, never logged), and intentionally public (admit it, then budget for it). Most confusion comes from routes nobody classified.
5. **Edge protection as a backstop.** WAF, bot filtering, rate limits: they reduce abuse and cost; they never substitute for authorization. Use them like insulation, not like a lock.
6. **Honesty as strategy.** Anything the browser can reach, a script can reach. Design so that scripted access yields nothing the user couldn't already see about themselves — then the "lockdown" question mostly evaporates.
7. **Close.** Security features that depend on the client keeping a secret are apologies in advance.

**Notes.** From private direction notes (security BFF lockdown, inbox question about locking down BFF routes — the essay literally answers a question the author once asked, which is a nice provenance). Pairs with `the-banner-is-not-the-gate.md` as a possible series: *The Untrusted Front End*.
