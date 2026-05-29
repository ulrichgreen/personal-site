import type { Revision } from "../../types/content.ts";

function formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

function safeISODate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

export function RevisionHistory({ revisions }: { revisions: Revision[] }) {
    return (
        <aside
            className="section revision-history"
            aria-label="Revision history"
        >
            <p className="revision-history-heading label">Revisions</p>
            <ol>
                {revisions.map((revision) => (
                    <li key={revision.date}>
                        <time
                            className="label"
                            dateTime={safeISODate(revision.date)}
                        >
                            {formatDate(revision.date)}
                        </time>
                        <p className="caption">{revision.note}</p>
                    </li>
                ))}
            </ol>
        </aside>
    );
}
