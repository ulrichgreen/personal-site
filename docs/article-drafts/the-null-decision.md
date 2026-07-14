# The Null Decision

> "We hold no durable personal data in this tier" is a decision. "One brand for now" is a decision. Write the nothings down, or they become accidents waiting to be assumed.

**Description.** The decisions that never get recorded are the ones where nothing was built: the store you don't have, the integration you refused, the market dimension you deliberately didn't add, the SSO wiring that stays at zero until a trigger fires. This essay argues the null decision deserves the same standing as any architecture choice — recorded, dated, with its reopening trigger named — because unrecorded nothings fail in two directions: someone assumes the capability exists (and designs on it), or someone assumes it was an oversight (and builds it).

**Why it lands.** It's a genuinely under-written idea with instant utility: readers can inventory their own systems for load-bearing absences in an afternoon. The trigger clause is what elevates it beyond "document your decisions" boilerplate — a null decision without a reopening condition ("revisit when a second market is concrete", "reopen if employee-facing tools enter scope") either petrifies into dogma or silently erodes. Deciding *not yet*, on the record, with the tripwire named, is the disciplined middle between over-building and amnesia.

## Outline

1. **The absence someone found.** A new feature assumes user preferences are stored server-side. They aren't — deliberately, for three good reasons, none written anywhere. Two sprints die relearning them.
2. **Nothings fail in both directions.** Assumed-present: designs built on capabilities that were refused. Assumed-oversight: the refused thing gets built by someone being helpful. Both are the same root cause — the decision existed only as an absence.
3. **What a recorded null looks like.** One sentence of position, one of rationale, one of trigger: "No durable personal data at rest in this tier — keeps the tier out of breach and audit scope — revisit if offline requirements arrive." Auditable, inheritable, and cheap.
4. **The trigger is the discipline.** Deferral without a tripwire is just procrastination with documentation. Name what would reopen the question: a second concrete market, a real multi-provider need, the upstream feature shipping stable. Until then, the null stands — and stops being re-argued.
5. **Don't design for the market you don't have.** The null decision's sibling: settling a question without its concrete case is guessing, and guesses calcify. Record *that it's open*, what it waits for, and resist the flattering urge to be early.
6. **Nulls are load-bearing in audits.** "We don't hold it" is the best possible answer to a compliance question — but only if it's a statement of design, not a hopeful observation. The recorded null is what makes absence a property instead of a coincidence.
7. **Close.** A system is defined by what it refuses as much as what it does. Give the refusals the dignity of ink.

**Notes.** From private direction notes (data-access "no durable PII" note, identity SSO parking, i18n market-dimension deferral, theming single-brand note): all generalize cleanly. Compact essay. Related: `open-questions-are-live-forks.md`, `hold-less.md`.
