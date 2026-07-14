# Design Systems Are Platform Problems

> A design system planned inside a feature team becomes a UI feature factory. The failure is organizational before it is ever technical.

**Description.** Why design systems decay: not bad components, but wrong ownership shape. When the system is a side quest of a product team, it optimizes for that team's roadmap; when it's "everyone's responsibility," it's no one's — and both roads end in the two classic failure modes: the rigidity trap (teams fight the system and fork it) and the abstraction tax (the system absorbs so much flexibility it's harder than raw code). The alternative: treat the design system as a platform product with an owner, consumers, contracts, and an escalation ladder of customization — use as-is, theme it, extend it, eject — so control escalates instead of shattering.

**Why it lands.** Design-system content is saturated with token tutorials and component anatomy; almost none of it addresses why systems with beautiful components still fail. Framing it as a platform-ownership problem gives readers the diagnostic they actually need ("who can say no to a component?" reveals everything) and names the two traps memorably enough to enter their team's vocabulary. Synthesizes industry experience with hard-won conviction — cite the field honestly where the phrases come from it.

## Outline

1. **The healthy-looking corpse.** Storybook full, tokens documented, adoption declining. The post-mortem never finds a technical cause.
2. **The feature-factory drift.** A system owned by a product team inherits that team's incentives: their components mature, everyone else's requests queue. The system becomes their component library with guests.
3. **"When everybody owns something, nobody owns it."** Contribution models without an owner produce drive-by components — added for one need, maintained by no one, breaking quietly.
4. **The two traps.** Rigidity: the system says no so often teams route around it, and the forks are the real system now. Abstraction tax: the system says yes so much its components have forty props and using raw primitives would be faster. Both are ownership failures wearing technical costumes.
5. **Control escalates.** The design that avoids both traps is a ladder, not a wall: use as-is → retheme via tokens → extend with your own styles → eject to the underlying primitives. Every rung is legitimate; the system's job is making each rung easier than the one below it.
6. **Platform product, platform practices.** A named owner who can say no; consumers, not stakeholders-by-committee; versioned contracts; intake paths for promoting app innovations into the system. The boring machinery is the survival mechanism.
7. **Close.** Buy the ownership shape before the component library. It's the only part that can't be refactored later.

**Notes.** Partially synthesized from industry sources the author's research feed surfaced (rigidity trap / abstraction tax / control-escalation phrasing) — attribute where due when writing the full piece. From private direction notes framing (platform ownership, intake paths): keep employer-generic.
