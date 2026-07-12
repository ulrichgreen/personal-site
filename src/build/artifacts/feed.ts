import type { BuiltContent } from "../../types/content.ts";
import { SITE_AUTHOR, SITE_TITLE, SITE_URL } from "../../config.ts";
import { writeDistFile } from "../shared/dist-fs.ts";
import { slugFromSource } from "../shared/paths.ts";
import { escapeXml } from "../shared/xml.ts";
import { renderContentBody } from "../render/render-react-page.tsx";
import type { ArtifactContext } from "./context.ts";

// Fixed `updated` fallback for a feed with no entries, so builds stay
// byte-for-byte reproducible instead of embedding the build time.
const EMPTY_FEED_UPDATED = "1970-01-01T00:00:00Z";

function toISOTimestamp(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function escapeCdata(text: string): string {
    return text.replace(/]]>/g, "]]]]><![CDATA[>");
}

export async function buildFeed({
    articleIndex,
    compiledArticles,
}: ArtifactContext): Promise<number> {
    const latestDate =
        articleIndex.length > 0
            ? toISOTimestamp(
                articleIndex[0].revised || articleIndex[0].published,
            )
            : EMPTY_FEED_UPDATED;

    const contentBySlug = new Map<string, BuiltContent>();
    for (const content of compiledArticles) {
        contentBySlug.set(slugFromSource(content.sourcePath), content);
    }

    const entries: string[] = [];

    for (const entry of articleIndex) {
        const content = contentBySlug.get(entry.slug);
        if (!content) {
            process.stderr.write(
                `  skip  feed entry "${entry.slug}" — no compiled content\n`,
            );
            continue;
        }

        const bodyHtml = renderContentBody(content, articleIndex);

        const published = toISOTimestamp(entry.published);
        const updated = toISOTimestamp(entry.revised || entry.published);
        entries.push(
            [
                "  <entry>",
                `    <title>${escapeXml(entry.title)}</title>`,
                `    <link href="${escapeXml(`${SITE_URL}${entry.href}`)}" />`,
                `    <id>${escapeXml(`${SITE_URL}${entry.href}`)}</id>`,
                `    <published>${published}</published>`,
                `    <updated>${updated}</updated>`,
                entry.description
                    ? `    <summary>${escapeXml(entry.description)}</summary>`
                    : undefined,
                `    <content type="html"><![CDATA[${escapeCdata(bodyHtml)}]]></content>`,
                "  </entry>",
            ]
                .filter(Boolean)
                .join("\n"),
        );
    }

    const xml = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<feed xmlns="http://www.w3.org/2005/Atom">',
        `  <title>${escapeXml(SITE_TITLE)}</title>`,
        `  <link href="${SITE_URL}/" />`,
        `  <link rel="self" href="${SITE_URL}/feed.xml" />`,
        `  <id>${SITE_URL}/</id>`,
        `  <updated>${latestDate}</updated>`,
        "  <author>",
        `    <name>${escapeXml(SITE_AUTHOR)}</name>`,
        "  </author>",
        ...entries,
        "</feed>",
        "",
    ].join("\n");

    writeDistFile("feed.xml", xml);
    return entries.length;
}
