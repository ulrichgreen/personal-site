# Design experiments

Five complete overhauls of the site's look, each in a single stylesheet. Every one restyles the same HTML the build already writes: nothing in `src/` or `content/` changed. They keep the premise: minimal, system fonts only, nothing extra to download, and writing at the center. All five fit the CSS budget in `site.config.ts` (4.9–6.2 KiB gzipped; today's sheet is 6.1).

| Direction | Type | Layout | Color | CSS, gzipped |
| --- | --- | --- | --- | --- |
| [Raster](#raster) | System sans, huge and tight | One 12-column grid; facts and section numbers hang left | White, black, one red | 5.5 KiB |
| [Plaintext](#plaintext) | System monospace, one size | 72-character column, markdown markers in the margin | Paper or terminal, green | 4.9 KiB |
| [Broadsheet](#broadsheet) | Book serif | Masthead, ruled columns, two-column standalone pages | Newsprint and ink | 5.5 KiB |
| [Workbench](#workbench) | System UI | Fixed sidebar, top bar, contents rail | Quiet greys, emerald | 6.2 KiB |
| [Poster](#poster) | Heavy sans display, serif text | Split screen: fixed green field and a reading column | Signal green, black code | 5.2 KiB |

## Preview

Build the site with every page (dev mode), then serve it with one of the stylesheets swapped in:

```sh
pnpm build -- --dev
node --import tsx design-experiments/preview.ts poster      # http://localhost:3010
node --import tsx design-experiments/preview.ts current     # the real stylesheet
```

The stylesheet is re-bundled on each page load, so edits show up on refresh. `_shared.css` holds the design-neutral parts every experiment imports: the reset, accessibility helpers, code-block scrolling, footnote mechanics and the playground island.

The screenshots were taken in Chromium at 1440×900 (desktop) and 390×844 (phone), with Inter, Charter and DejaVu Sans Mono standing in for Apple's system fonts (SF Pro, New York/Charter, SF Mono/Menlo).

## Raster

The International Typographic Style. One twelve-column grid runs everything: the wordmark, the article facts and the section numbers sit in columns 1–3, the text in 4–9, and code and pull quotes reach column 12. Display type is system sans set very large and tight; the reading text is plain. Rules instead of boxes, and red used only for labels, links and the quote marker. The footer is an inverted band with the wordmark at poster size.

![Raster, home](screenshots/raster-home.webp)
![Raster, article](screenshots/raster-article.webp)
![Raster, CV](screenshots/raster-cv.webp)
![Raster, article detail](screenshots/raster-detail.webp)

## Plaintext

The site as its own source. One monospace face at one size, with the markdown left showing: `#` markers, `>` quotes, `-` bullets, `_emphasis_` and backticks hang in the margin so the text still lines up. Page titles are setext headings, underlined with `=`. Article facts read as YAML frontmatter, code keeps its fences, the series bar is ASCII (`[####------]`), the article breadcrumb is a vim-style status line pinned to the bottom, and the footer opens with an editor's `~` lines past the end of the file. Dark mode is a green-on-black terminal.

![Plaintext, home](screenshots/plaintext-home.webp)
![Plaintext, article](screenshots/plaintext-article.webp)
![Plaintext, CV](screenshots/plaintext-cv.webp)
![Plaintext, dark](screenshots/plaintext-dark.webp)

## Broadsheet

The front page of a newspaper. The nav already puts the wordmark between the links, so it becomes a centered nameplate with a motto in a ruled strip. The home page is a lead story with a drop cap and a pull quote, then the archive as three ruled columns of headlines with the series as its own row. Articles open with a big centered headline, an italic deck and a byline strip; the text is justified with a drop cap and indents, crossheads are centered, and pull quotes break into the left margin. Standalone pages like the CV run in two columns. Inside pages get a smaller nameplate.

![Broadsheet, home](screenshots/broadsheet-home.webp)
![Broadsheet, article](screenshots/broadsheet-article.webp)
![Broadsheet, CV](screenshots/broadsheet-cv.webp)
![Broadsheet, article detail](screenshots/broadsheet-detail.webp)

## Workbench

The site as a well-made tool, in the style of good documentation sites. The header becomes a fixed sidebar with the `{u}` monogram as an app icon, icon links and the current page marked. The article breadcrumb is a sticky top bar, long articles get a contents rail on the right, the archive is a card list, code blocks are panels with a title bar, callouts are tinted by type, and the series is a card with steps and pager buttons. On phones the sidebar folds into a top bar.

![Workbench, home](screenshots/workbench-home.webp)
![Workbench, article](screenshots/workbench-article.webp)
![Workbench, CV](screenshots/workbench-cv.webp)
![Workbench, article detail](screenshots/workbench-detail.webp)

## Poster

Half the screen is a statement. On wide screens a fixed field of green fills the left half and carries the page's one big line in very heavy type: the manifesto, the article title, or the name on the CV. That type is sized in container units, so the longest word always fits the field. The right half is a calm serif reading column: pull quotes are highlighted like a marker, code sits on black, and the series is a black card. On phones the poster becomes a green block on top, and the breadcrumb stays green as a sticky strip.

![Poster, home](screenshots/poster-home.webp)
![Poster, article](screenshots/poster-article.webp)
![Poster, CV](screenshots/poster-cv.webp)
![Poster, article detail](screenshots/poster-detail.webp)

## Notes

- Staying CSS-only means a few short strings live in the stylesheets as generated content: the Broadsheet motto, the Workbench sidebar label and tagline, and the Plaintext frontmatter keys and markers.
- Workbench marks the current page with `:has()` on what the page contains (`#about`, `article`, the CV and colophon headings), since the markup has no `aria-current` in the main nav. Adding that to `SiteHeader` would be the proper fix if this direction goes ahead.
- Every design has light and dark palettes, a print block, phone layouts, and handles the table of contents, callouts, footnotes, margin notes, the series nav and the grid playground. Dark-mode shots of each home page are in `screenshots/*-dark.webp`.
