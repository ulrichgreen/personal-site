import { SITE_AUTHOR } from "../../config.ts";

/**
 * Homepage manifesto block: eyebrow, opening declaration (the
 * page's h1), body paragraph, and closing resolution.
 */
export function Manifesto() {
    return (
        <section id="about" aria-label="About">
            <p>Notes on design, engineering &amp; the web</p>

            <h1>It's just text files.</h1>

            <p>
                Some are good. Most are too long. I'm {SITE_AUTHOR}. I make text
                files for a living. This is one of them.
            </p>

            <p>
                Just some <em>very well considered</em> text files.
            </p>
        </section>
    );
}
