import type {
    ArticleIndexEntry,
    BuiltContent,
    PageMeta,
    SeriesEntry,
    SeriesInfo,
} from "../../types/content.ts";
import { isArticleMeta } from "../../types/content.ts";

function toArticleIndexEntry(
    meta: PageMeta,
    sourcePath: string,
): ArticleIndexEntry | undefined {
    if (!isArticleMeta(meta)) {
        return undefined;
    }

    const slug = sourcePath.split("/").pop()?.replace(/\.mdx$/, "") || "";

    return {
        ...meta,
        title: String(meta.title || ""),
        published: String(meta.published || ""),
        slug,
        href: `/articles/${slug}.html`,
        sourcePath,
        draft: meta.draft,
        series: meta.series,
        seriesOrder: meta.seriesOrder,
    } satisfies ArticleIndexEntry;
}

function filterAndSortArticleEntries(
    allEntries: ArticleIndexEntry[],
): ArticleIndexEntry[] {
    const filtered = allEntries.filter(
        (entry) =>
            entry.draft !== true &&
            Boolean(entry.title) &&
            entry.published &&
            !Number.isNaN(new Date(entry.published).getTime()),
    );

    const invalid = allEntries.filter(
        (entry) =>
            entry.draft !== true &&
            (!entry.title ||
                !entry.published ||
                Number.isNaN(new Date(entry.published).getTime())),
    );
    if (invalid.length > 0) {
        for (const entry of invalid) {
            process.stderr.write(
                `  skip  "${entry.slug}" — missing title or published date\n`,
            );
        }
    }

    return filtered.sort(
        (left, right) =>
            new Date(right.published).getTime() -
            new Date(left.published).getTime(),
    );
}

/**
 * Builds the published-article index from compiled content. This is the single
 * source of truth for article listings, feeds, and series navigation.
 */
export function indexArticles(
    builtContent: BuiltContent[],
): ArticleIndexEntry[] {
    return filterAndSortArticleEntries(
        builtContent
            .map((page) => toArticleIndexEntry(page.meta, page.sourcePath))
            .filter((entry): entry is ArticleIndexEntry => entry !== undefined),
    );
}

export function buildSeriesMap(
    articleIndex: ArticleIndexEntry[],
): Map<string, SeriesEntry[]> {
    const seriesMap = new Map<string, SeriesEntry[]>();
    const ordersBySeries = new Map<string, Map<number, ArticleIndexEntry>>();

    for (const entry of articleIndex) {
        if (!entry.series) continue;

        if (entry.seriesOrder !== undefined) {
            const seriesOrders =
                ordersBySeries.get(entry.series) ??
                new Map<number, ArticleIndexEntry>();
            const conflictingEntry = seriesOrders.get(entry.seriesOrder);
            if (conflictingEntry) {
                throw new Error(
                    [
                        `Series "${entry.series}" has conflicting seriesOrder ${entry.seriesOrder}.`,
                        conflictingEntry.sourcePath,
                        entry.sourcePath,
                    ].join(" "),
                );
            }
            seriesOrders.set(entry.seriesOrder, entry);
            ordersBySeries.set(entry.series, seriesOrders);
        }

        const seriesEntry: SeriesEntry = {
            title: entry.title,
            slug: entry.slug,
            href: entry.href,
            order: entry.seriesOrder ?? 0,
            published: entry.published,
        };

        const existing = seriesMap.get(entry.series);
        if (existing) {
            existing.push(seriesEntry);
        } else {
            seriesMap.set(entry.series, [seriesEntry]);
        }
    }

    for (const entries of seriesMap.values()) {
        entries.sort((a, b) => a.order - b.order);
    }

    return seriesMap;
}

export function resolveSeriesInfo(
    seriesName: string | undefined,
    seriesOrder: number | undefined,
    seriesMap: Map<string, SeriesEntry[]>,
): SeriesInfo | undefined {
    if (!seriesName) return undefined;

    const entries = seriesMap.get(seriesName);
    if (!entries || entries.length === 0) return undefined;

    return {
        name: seriesName,
        entries,
        currentOrder: seriesOrder ?? 0,
    };
}
