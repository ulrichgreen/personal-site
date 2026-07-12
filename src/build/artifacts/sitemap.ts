import { SITE_URL } from "../../config.ts";
import { isArticlePage } from "../content/article-index.ts";
import { writeDistFile } from "../shared/dist-fs.ts";
import { urlPathFromSource } from "../shared/paths.ts";
import { escapeXml } from "../shared/xml.ts";
import type { Artifact } from "./context.ts";

function toISODate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

export const buildSitemap: Artifact = ({ articleIndex, compiledPages }) => {
    const urls: string[] = [];

    // Non-article pages come straight from the compiled page set, so the
    // sitemap shares the pipeline's discovery rules (no `_`-prefixed sources,
    // no drafts) instead of re-scanning the content directory.
    for (const page of compiledPages) {
        if (isArticlePage(page)) continue;
        const href = urlPathFromSource(page.sourcePath);
        if (href === "/404.html") continue;
        urls.push(`  <url>\n    <loc>${escapeXml(`${SITE_URL}${href}`)}</loc>\n  </url>`);
    }

    // Articles come from the index (drafts already excluded) with lastmod.
    for (const entry of articleIndex) {
        const lastmod = toISODate(entry.revised || entry.published);
        const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
        urls.push(
            `  <url>\n    <loc>${escapeXml(`${SITE_URL}${entry.href}`)}</loc>${lastmodTag}\n  </url>`,
        );
    }

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        "</urlset>",
        "",
    ].join("\n");

    writeDistFile("sitemap.xml", xml);
};
