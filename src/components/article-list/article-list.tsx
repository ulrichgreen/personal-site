import { getArticleTitleTransitionName } from "../article-header/article-header.tsx";
import type { ArticleIndexEntry } from "../../types/content.ts";

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

interface YearGroup {
    year: string;
    standalone: ArticleIndexEntry[];
    series: Map<string, ArticleIndexEntry[]>;
    seriesOrder: string[];
}

function groupByYear(entries: ArticleIndexEntry[]): YearGroup[] {
    const yearMap = new Map<string, YearGroup>();
    const yearOrder: string[] = [];

    for (const entry of entries) {
        // Published dates are schema-validated ISO strings (YYYY-MM-DD).
        const year = entry.published.slice(0, 4);
        let group = yearMap.get(year);
        if (!group) {
            group = {
                year,
                standalone: [],
                series: new Map(),
                seriesOrder: [],
            };
            yearMap.set(year, group);
            yearOrder.push(year);
        }

        if (entry.series) {
            const existing = group.series.get(entry.series);
            if (existing) {
                existing.push(entry);
            } else {
                group.series.set(entry.series, [entry]);
                group.seriesOrder.push(entry.series);
            }
        } else {
            group.standalone.push(entry);
        }
    }

    for (const group of yearMap.values()) {
        for (const seriesEntries of group.series.values()) {
            seriesEntries.sort(
                (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0),
            );
        }
    }

    return yearOrder.map((year) => yearMap.get(year)!);
}

function EntryItem({ entry }: { entry: ArticleIndexEntry }) {
    const titleTransitionName = getArticleTitleTransitionName(entry.slug);

    return (
        <li>
            <a
                href={entry.href}
                style={
                    titleTransitionName
                        ? { viewTransitionName: titleTransitionName }
                        : undefined
                }
            >
                {entry.title}
            </a>
            <time dateTime={entry.published}>
                {formatDate(entry.published)}
            </time>
            {entry.description && <p>{entry.description}</p>}
        </li>
    );
}

export function ArticleList({
    items,
    articleIndex = [],
}: {
    items?: ArticleIndexEntry[];
    articleIndex?: ArticleIndexEntry[];
}) {
    const entries = items || articleIndex;
    const yearGroups = groupByYear(entries);

    return (
        <section id="articles">
            {yearGroups.map((group) => (
                <>
                    <h3 key={group.year}>{group.year}</h3>
                    <ul>
                        {group.seriesOrder.map((seriesName) => {
                            const seriesEntries =
                                group.series.get(seriesName) ?? [];
                            return [
                                <li key={`series-${seriesName}`}>
                                    Series · {seriesName}
                                </li>,
                                ...seriesEntries.map((entry) => (
                                    <EntryItem key={entry.slug} entry={entry} />
                                )),
                            ];
                        })}
                        {group.standalone.map((entry) => (
                            <EntryItem key={entry.slug} entry={entry} />
                        ))}
                    </ul>
                </>
            ))}
        </section>
    );
}
