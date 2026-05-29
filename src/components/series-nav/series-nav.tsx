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
        <nav
            className="section semi-bleed card series-nav"
            aria-label={`${name} series navigation`}
        >
            <div className="series-head">
                <p className="label">Series</p>
                <p className="series-name heading-sm">{name}</p>
                <p className="series-progress label">
                    Part {current} of {total}
                </p>
            </div>
            <div
                className="series-track"
                role="progressbar"
                aria-valuenow={current}
                aria-valuemin={1}
                aria-valuemax={total}
                aria-label={`Part ${current} of ${total}`}
            >
                <div style={{ width: `${(current / total) * 100}%` }} />
            </div>
            <ol className="series-list">
                {entries.map((entry, index) => {
                    const isCurrent = entry.order === currentOrder;
                    return (
                        <li
                            key={entry.slug}
                            aria-current={isCurrent ? "page" : undefined}
                        >
                            <span className="ord label">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            {isCurrent ? (
                                <span className="body-sm">{entry.title}</span>
                            ) : (
                                <a className="body-sm" href={entry.href}>
                                    {entry.title}
                                </a>
                            )}
                        </li>
                    );
                })}
            </ol>
            {(prev || next) && (
                <div className="series-arrows label">
                    {prev ? (
                        <a className="series-prev" href={prev.href}>
                            ← {prev.title}
                        </a>
                    ) : (
                        <span />
                    )}
                    {next ? (
                        <a className="series-next" href={next.href}>
                            {next.title} →
                        </a>
                    ) : (
                        <span />
                    )}
                </div>
            )}
        </nav>
    );
}
