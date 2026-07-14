# A Gate, Not a Date

> Production is not a milestone you reach. It is a set of conditions you satisfy.

**Description.** Launch dates are the industry's favorite fiction. This essay argues for replacing the date with a gate: a short, named list of conditions — each binary, each owned — that must hold before real users arrive. "Mostly" is a no.

**Why it lands.** Everyone has watched a system drift into production: traffic shows up on an environment that was never defined, alerted, or rehearsed, and "production" becomes whatever staging happened to be that week. Readers know the failure mode intimately but rarely see the alternative articulated. The gate reframes go-live from a project-management artifact into an engineering artifact — and gives ICs language to push back on date-driven launches without sounding obstructive.

## Outline

1. **The launch that already happened.** The quiet failure mode: nobody launches badly on purpose; systems *drift* into production. The first real user arrives before anyone decided what production is.
2. **A date answers the wrong question.** A date says *when*; it cannot say *whether*. The pressure a date creates is real, but it is pressure toward the calendar, not toward readiness.
3. **The gate.** A named set of conditions, each one a direction that must be true, not a task: an environment worth promoting to, someone who will notice and someone who will answer at 02:00, security enforced rather than report-only, journeys that block the pipeline when they break.
4. **Binary per item.** The load-bearing rule: a condition either holds or it doesn't. "Mostly" is a no. The moment you allow percentages, the gate becomes a date wearing a costume.
5. **Each condition has an owner.** A gate item without an owner is a wish. The gate distributes accountability to wherever the direction actually lives, instead of concentrating anxiety in a launch meeting.
6. **What the gate refuses to contain.** No schedule, no sequencing, no effort estimates. The how belongs to the teams; the gate only names what must be true. This is what keeps it short enough to be enforceable.
7. **Rehearsed, not present.** The subtlest condition: rollback that has been *performed once* beats rollback that exists in a config file. An alert that has been test-fired beats an alert that was authored. Exercised is the standard.
8. **Close.** The gate is slower exactly once. Every launch after it inherits the definitions.

**Notes.** Pairs naturally with a follow-up on rehearsal culture (fire drills for deploys). From private direction notes (road-to-production): keep at pattern level — no employer, app, or vendor names needed anywhere.
