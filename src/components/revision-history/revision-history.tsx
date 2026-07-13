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

export function RevisionHistory({ revisions }: { revisions: Revision[] }) {
    return (
        <aside className="revisions" aria-label="Revision history">
            <p>Revisions</p>
            <ol>
                {revisions.map((revision) => (
                    <li key={revision.date}>
                        <time dateTime={revision.date}>
                            {formatDate(revision.date)}
                        </time>
                        <p>{revision.note}</p>
                    </li>
                ))}
            </ol>
        </aside>
    );
}
