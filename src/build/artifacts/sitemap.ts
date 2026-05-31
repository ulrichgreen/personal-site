import { readdirSync } from "node:fs";
import { SITE_URL } from "../../config.ts";
import { writeDistFile } from "../shared/dist-fs.ts";
import { contentDirectory } from "../shared/paths.ts";
import type { Artifact } from "./context.ts";

function toISODate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

function escapeXml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export const buildSitemap: Artifact = ({ articleIndex }) => {
    const topLevelPages = readdirSync(contentDirectory)
        .filter((file) => file.endsWith(".mdx") && file !== "404.mdx")
        .map((file) => file.replace(/\.mdx$/, ".html"));

    const urls: string[] = [];

    for (const page of topLevelPages) {
        urls.push(`  <url>\n    <loc>${escapeXml(`${SITE_URL}/${page}`)}</loc>\n  </url>`);
    }

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
