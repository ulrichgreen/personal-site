# Don't Make the Application Composable

> When business logic becomes content, correctness questions stop having answers in code review. They have answers in whatever an editor last published.

**Description.** The modern CMS pitch is total composability: every feature is a block, editors arrange everything, engineering gets out of the way. This essay describes that model fairly — and then refuses it for functional pages, arguing that the application should own its routes and layouts while editors own copy and their own pages. Freedom inside a safe frame, not freedom over the frame.

**Why it lands.** This is a heresy stated out loud. Composable-everything is the current orthodoxy in CMS land, and most engineering critiques of it are vibes. This one enumerates the actual costs — behavior becomes unknowable, pages get slower *by construction*, login protection can't follow the URL, preview stops making sense, test matrices go combinatorial — and names precisely what editors lose (one thing) versus what they keep (everything else). Anyone negotiating with stakeholders over a CMS will want this essay in their pocket.

## Outline

1. **The flexible model, described fairly.** "Your account overview is just another block." Editors compose any page from any block, reorder, duplicate, remove. For marketing sites this is often right. Steelman first; the refusal means nothing otherwise.
2. **The core objection: business logic becomes content.** Which page shows personal data, to whom, behind which login — no longer a property of the application, but of the current CMS state. Every functional widget added to the free pool makes behavior less knowable.
3. **Slower by construction.** A fixed route fetches data immediately, in parallel with content. A composed page must fetch and parse the composition before it can *discover* what else to fetch — serial exactly where speed matters most.
4. **Protection can't follow the URL.** "Everything under /account requires login" is one line of middleware. If personal blocks can appear anywhere, protection must be derived from composition per page — or asserted by editors, which will eventually be wrong.
5. **Preview stops making sense.** An editor can meaningfully preview copy and promo blocks. A block whose real content is one customer's live data has nothing meaningful to show. Composability quietly assumes all content is editorial.
6. **Two kinds of pages.** The resolution: app-owned pages (fixed URL, fixed layout, editable copy inside) and editor-owned pages (free composition from a safe vocabulary of blocks). Same rendering pipeline, one difference — who controls the URL and layout.
7. **What editors actually lose.** Exactly one power: moving functional widgets without an engineering change. When the concrete need appears, build *that* block with a defined contract. Don't make the whole application composable to avoid a conversation.
8. **Close.** Composability is a spectrum you place deliberately, not a virtue you maximize.

**Notes.** The strongest "alternative view" candidate in the set — flagship material. From private direction notes (the CMS-platform bet, fixed-routes argument): fully generalizable; no vendor specifics required. Long-form; would carry a `<TableOfContents />`.
