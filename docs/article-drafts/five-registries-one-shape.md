# Five Registries, One Shape

> The vocabulary's owner owns the registry. Everyone else reads. The moment a consumer keeps its own copy, you have two vocabularies and a schedule for their divergence.

**Description.** Platforms keep reinventing the same artifact under different names: the component catalog, the event contract, the block map, the variant allow-list, the conversion list. This essay names the shape they all converge on — typed, versioned, one owner per vocabulary, consumers who mirror rather than fork, defined unknown-entry behavior — and proposes stating the convention once instead of designing it five times.

**Why it lands.** Readers will recognize at least two of these registries in their own platform, invented independently by different teams, each with its own ad-hoc rules. The essay hands them a lens ("this is all the same pattern") and a decision procedure for the perennial ownership fights: conversions "mirror the event registry"? That phrase is the tell — a sub-vocabulary trying to fork. Alternative view: the interesting design surface isn't the data, it's the vocabulary governance.

## Outline

1. **An inventory nobody planned.** Five lists, five owners, five shapes — discovered, not designed. Every platform of sufficient age has this drawer of vocabularies.
2. **The convergent shape.** When a registry works, it is typed (compile-time-checked, not stringly conventions), versioned (the vocabulary evolves without silently breaking readers), and singular (exactly one place declares what exists).
3. **Owner = whoever owns the vocabulary.** Not the loudest consumer, not the team with capacity. Flags own variants; tracking owns events; the content layer owns blocks; the design system owns components. Ownership disputes dissolve when you ask what the words *are* rather than who wants them.
4. **Consumers mirror, never fork.** A read contract, not a copy. "Our registry mirrors theirs" is the smell — a mirror with its own write access is a fork with better PR.
5. **Validation at the boundary.** Entries are checked where data enters the system, not deep inside consumers — the registry is only trustworthy if nothing unregistered gets past the door.
6. **The honesty requirement.** A registry that overstates its coverage is worse than none: consumers (human and machine) build on entries that aren't real. Registry honesty — advertising exactly what is actually served — is what turns an index into an interface.
7. **The enumeration dividend.** A registry is also an audit surface: anything that can iterate the vocabulary can verify it — accessibility checks per component, contract tests per event, render tests per block. You audit the vocabulary, not the world.
8. **Close.** Convention beats five clever designs. Name the shape once; let every new vocabulary inherit it.

**Notes.** From private direction notes (registry-convention bet): anonymize the five instances into generic roles. Pairs with `the-unknown-entry.md` (which owns rule three). The "honesty" section could later expand into its own piece about machine-consumed metadata.
