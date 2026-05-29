import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { h } from "preact";
import {
    buildSeriesMap,
    indexArticles,
    resolveSeriesInfo,
} from "./article-index.ts";
import type { ArticleIndexEntry, BuiltContent } from "../../types/content.ts";

function builtArticle(
    slug: string,
    overrides: Partial<BuiltContent["meta"]> = {},
): BuiltContent {
    return {
        meta: {
            title: slug,
            layout: "article",
            published: "2025-01-02",
            readingTime: "1 min read",
            words: 123,
            ...overrides,
        } as BuiltContent["meta"],
        Content: () => h("div", null, "Body"),
        headings: [],
        sourcePath: `/tmp/content/articles/${slug}.mdx`,
    };
}

function seriesEntry(
    overrides: Partial<ArticleIndexEntry> & { title: string; slug: string },
): ArticleIndexEntry {
    return {
        layout: "article",
        published: "2025-01-01",
        href: `/articles/${overrides.slug}.html`,
        sourcePath: `/content/articles/${overrides.slug}.mdx`,
        ...overrides,
    };
}

describe("indexArticles", () => {
    it("derives article metadata from compiled pages", () => {
        const entries = indexArticles([
            builtArticle("published"),
            {
                meta: { title: "About", layout: "base" },
                Content: () => h("div", null, "Body"),
                headings: [],
                sourcePath: "/tmp/content/about.mdx",
            },
        ]);

        assert.equal(entries.length, 1);
        assert.equal(entries[0].title, "published");
        assert.equal(entries[0].slug, "published");
        assert.equal(entries[0].href, "/articles/published.html");
        assert.equal(entries[0].readingTime, "1 min read");
    });

    it("filters draft articles from the index", () => {
        const entries = indexArticles([
            builtArticle("published"),
            builtArticle("draft", { draft: true, published: "2025-01-03" }),
        ]);

        assert.equal(entries.length, 1);
        assert.equal(entries[0].slug, "published");
    });

    it("sorts entries by published date, newest first", () => {
        const entries = indexArticles([
            builtArticle("older", { published: "2025-01-01" }),
            builtArticle("newer", { published: "2025-02-01" }),
        ]);

        assert.deepEqual(
            entries.map((entry) => entry.slug),
            ["newer", "older"],
        );
    });
});

describe("buildSeriesMap", () => {
    it("groups entries by series name, sorted by seriesOrder", () => {
        const index: ArticleIndexEntry[] = [
            seriesEntry({
                title: "Part 2",
                slug: "part-2",
                series: "My Series",
                seriesOrder: 2,
            }),
            seriesEntry({
                title: "Part 1",
                slug: "part-1",
                series: "My Series",
                seriesOrder: 1,
            }),
            seriesEntry({ title: "Standalone", slug: "standalone" }),
        ];
        const map = buildSeriesMap(index);

        assert.equal(map.size, 1);
        const series = map.get("My Series");
        assert.ok(series);
        assert.equal(series.length, 2);
        assert.equal(series[0].title, "Part 1");
        assert.equal(series[1].title, "Part 2");
    });

    it("returns empty map when no entries have a series", () => {
        const index: ArticleIndexEntry[] = [
            seriesEntry({ title: "A", slug: "a" }),
            seriesEntry({ title: "B", slug: "b" }),
        ];
        const map = buildSeriesMap(index);
        assert.equal(map.size, 0);
    });

    it("handles multiple series", () => {
        const index: ArticleIndexEntry[] = [
            seriesEntry({
                title: "A1",
                slug: "a1",
                series: "Series A",
                seriesOrder: 1,
            }),
            seriesEntry({
                title: "B1",
                slug: "b1",
                series: "Series B",
                seriesOrder: 1,
            }),
            seriesEntry({
                title: "A2",
                slug: "a2",
                series: "Series A",
                seriesOrder: 2,
            }),
        ];
        const map = buildSeriesMap(index);
        assert.equal(map.size, 2);
        assert.equal(map.get("Series A")?.length, 2);
        assert.equal(map.get("Series B")?.length, 1);
    });

    it("throws when two articles in a series share the same order", () => {
        const index: ArticleIndexEntry[] = [
            seriesEntry({
                title: "Part 1",
                slug: "part-1",
                series: "My Series",
                seriesOrder: 1,
                sourcePath: "/content/articles/part-1.mdx",
            }),
            seriesEntry({
                title: "Another Part 1",
                slug: "another-part-1",
                series: "My Series",
                seriesOrder: 1,
                sourcePath: "/content/articles/another-part-1.mdx",
            }),
        ];

        assert.throws(
            () => buildSeriesMap(index),
            /Series "My Series" has conflicting seriesOrder 1/,
        );
    });
});

describe("resolveSeriesInfo", () => {
    it("returns undefined when the series name is undefined", () => {
        const map = new Map();
        assert.equal(resolveSeriesInfo(undefined, undefined, map), undefined);
    });

    it("returns undefined when the series has no entries", () => {
        const map = new Map();
        assert.equal(resolveSeriesInfo("Unknown", 1, map), undefined);
    });

    it("returns series info with the current order", () => {
        const index: ArticleIndexEntry[] = [
            seriesEntry({
                title: "Part 1",
                slug: "p1",
                series: "S",
                seriesOrder: 1,
            }),
            seriesEntry({
                title: "Part 2",
                slug: "p2",
                series: "S",
                seriesOrder: 2,
            }),
            seriesEntry({
                title: "Part 3",
                slug: "p3",
                series: "S",
                seriesOrder: 3,
            }),
        ];
        const map = buildSeriesMap(index);
        const info = resolveSeriesInfo("S", 2, map);

        assert.ok(info);
        assert.equal(info.name, "S");
        assert.equal(info.currentOrder, 2);
        assert.equal(info.entries.length, 3);
    });
});
