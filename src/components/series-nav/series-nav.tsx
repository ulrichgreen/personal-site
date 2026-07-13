import type { SeriesInfo } from "../../types/content.ts";

export function SeriesNav({ seriesInfo }: { seriesInfo: SeriesInfo }) {
    const { name, entries, currentOrder } = seriesInfo;
    const currentIndex = entries.findIndex((e) => e.order === currentOrder);
    const prev = currentIndex > 0 ? entries[currentIndex - 1] : undefined;
    const next =
        currentIndex < entries.length - 1
            ? entries[currentIndex + 1]
            : undefined;
    const total = entries.length;
    const current = currentIndex + 1;

    return (
        <nav aria-label={`${name} series navigation`}>
            <header>
                <p>Series</p>
                <p>{name}</p>
                <p>
                    Part {current} of {total}
                </p>
            </header>
            <div
                role="progressbar"
                aria-valuenow={current}
                aria-valuemin={1}
                aria-valuemax={total}
                aria-label={`Part ${current} of ${total}`}
            >
                <div style={{ width: `${(current / total) * 100}%` }} />
            </div>
            <ol>
                {entries.map((entry, index) => {
                    const isCurrent = entry.order === currentOrder;
                    return (
                        <li
                            key={entry.slug}
                            aria-current={isCurrent ? "page" : undefined}
                        >
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            {isCurrent ? (
                                <span>{entry.title}</span>
                            ) : (
                                <a href={entry.href}>{entry.title}</a>
                            )}
                        </li>
                    );
                })}
            </ol>
            {(prev || next) && (
                <p>
                    {prev ? (
                        <a href={prev.href}>← {prev.title}</a>
                    ) : (
                        <span />
                    )}
                    {next ? (
                        <a href={next.href}>{next.title} →</a>
                    ) : (
                        <span />
                    )}
                </p>
            )}
        </nav>
    );
}
