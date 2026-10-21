import { bundle } from "lightningcss";
import { mkdirSync, writeFileSync } from "node:fs";
import { LIGHTNING_CSS_TARGET } from "../../config.ts";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { distDirectory } from "../shared/paths.ts";

const source = fileURLToPath(new URL("../../styles/style.css", import.meta.url));
export const stylesheetPath = join(distDirectory, "style.css");

/** The tag every page renders for the stylesheet (see SiteHead). */
const STYLESHEET_LINK = '<link rel="stylesheet" href="/style.css"/>';

/**
 * Swaps the page's stylesheet link for the built CSS itself, so the whole page arrives in one
 * response. The source stays in src/styles/style.css; only built or served pages carry it inline.
 */
export function inlineStylesheet(html: string, css: string): string {
    if (!html.includes(STYLESHEET_LINK)) {
        throw new Error(`No ${STYLESHEET_LINK} to inline the CSS into`);
    }
    // A "</style" inside the CSS would end the element early; "\/" is the same character in CSS
    const safeCss = css.replaceAll("</style", "<\\/style");
    return html.replace(STYLESHEET_LINK, () => `<style>${safeCss}</style>`);
}

export async function buildCss(): Promise<void> {
    mkdirSync(distDirectory, { recursive: true });

    const { code } = bundle({
        filename: source,
        minify: true,
        targets: LIGHTNING_CSS_TARGET,
    });

    writeFileSync(stylesheetPath, Buffer.from(code).toString("utf8"));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    buildCss();
}
