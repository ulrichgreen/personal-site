# The Floor Is Not the Proof

> Automated checks catch a third to half of accessibility problems. The honest response is not better tooling. It is naming the manual pass as a first-class release step.

**Description.** Quality automation has a marketing problem: it presents itself as assurance when it is a floor. This essay uses accessibility as the sharpest case — axe-style checks catch perhaps a third to half of real WCAG issues — and argues for the two-tier posture: automate the floor ruthlessly (lint at write-time, component gates, journey scans, each layer carrying only what the cheaper layer can't), and then treat the human pass — a screen reader, a keyboard, real judgment — as a named, scheduled, first-class step. Not an admission the tooling failed; the other half of the method.

**Why it lands.** Both camps get flattered and corrected: automation enthusiasts hear their pipelines praised as necessary and exposed as insufficient; automation skeptics hear the manual pass dignified and then told it only scales because the floor exists. The layering rule generalizes well beyond accessibility — write-time catches what it can so runtime checks carry only what static analysis genuinely misses; tests catch what they can so human review carries only judgment. The "definition of proven" close gives teams something adoptable Monday morning.

## Outline

1. **The green dashboard.** Zero violations, says the scanner. Then a keyboard user can't exit the modal. Both facts are true; only one was measured.
2. **What the numbers actually are.** Automated a11y checks find roughly a third to half of real issues — the mechanically checkable subset: names, roles, contrast, structure. The remainder is meaning: focus order that makes sense, announcements that inform, flows that work.
3. **Automate the floor ruthlessly.** Layer by cost: lint rules at write-time (free), component-level gates in the design system (nearly free, inherited everywhere), journey scans in CI. Each layer carries only what the cheaper one genuinely cannot catch.
4. **Name the manual pass.** A screen-reader-and-keyboard session as a scheduled release step with an owner — not a virtue activity, not "when we have time." What is named and scheduled happens; what is implied doesn't.
5. **The definition of proven.** A crisp done-state: the gate fails on any *new* automated violation, no grandfathered exception is older than its expiry, and the manual pass for the release has a date and a name attached.
6. **The general form.** Every quality tool is a floor: type checkers, test suites, scanners. The failure mode is the same everywhere — mistaking the floor for the ceiling because the floor is what shows up green.
7. **Close.** Tools verify what can be checked. The rest must be *looked at* — and looking is a step, not a hope.

**Notes.** From private direction notes (a11y direction): the third-to-half figure should cite public research (Deque/WebAIM studies) when written. Related: `the-ratchet.md` (the gate mechanism this essay's floor uses).
