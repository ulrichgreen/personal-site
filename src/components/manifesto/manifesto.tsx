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
                The web never stopped being simple. Under every website: text
                files. Usually too many. My name is {SITE_AUTHOR}. I build text
                files for a living. It's a surprisingly short list of materials.
                Worth choosing the characters carefully.
            </p>

            <p>
                Just some <em>very well considered</em> text files.
            </p>
        </section>
    );
}
