function formatDate(value?: string): string {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

function safeISODate(value?: string): string {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toISOString().slice(0, 10);
}

export function getArticleTitleTransitionName(
    slugOrPath?: string,
): string | undefined {
    if (!slugOrPath) return undefined;

    const slug = slugOrPath
        .replace(/^\/articles\//, "")
        .replace(/\.html$/, "")
        .trim();

    const normalizedSlug = slug
        .replace(/[^a-z0-9_-]+/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    if (!normalizedSlug) return undefined;

    return `article-title-${normalizedSlug}`;
}

/**
 * The article masthead. The stylesheet keys on structure, not classes:
 * first p = eyebrow, h1 + p without a time = lede, p with a time = meta,
 * the p after the meta = author's note.
 */
export function ArticleHeader({
    title,
    description,
    section,
    kickerType,
    published,
    revised,
    words,
    readingTime,
    note,
    titleTransitionName,
    seriesName,
}: {
    title?: string;
    description?: string;
    section?: string;
    kickerType?: string;
    published?: string;
    revised?: string;
    words?: number | string;
    readingTime?: string;
    note?: string;
    titleTransitionName?: string;
    seriesName?: string;
}) {
    const publishedIso = safeISODate(published);
    const revisedIso = safeISODate(revised);
    const revisedDate = formatDate(revised);
    const publishedDate = formatDate(published);
    const kickerSection = seriesName || section || "Articles";
    const lengthLabel = [readingTime, words ? `${String(words)} words` : ""]
        .filter(Boolean)
        .join(" · ");

    return (
        <header>
            <p>
                <span>{kickerSection}</span>
                <span>{kickerType || "Article"}</span>
            </p>
            <h1
                style={
                    titleTransitionName
                        ? { viewTransitionName: titleTransitionName }
                        : undefined
                }
            >
                {title || ""}
            </h1>
            {description && <p>{description}</p>}
            <p>
                {publishedDate && (
                    <time dateTime={publishedIso}>{publishedDate}</time>
                )}
                {lengthLabel && <span>{lengthLabel}</span>}
                {revisedDate && (
                    <span>
                        Revised{" "}
                        <time dateTime={revisedIso}>{revisedDate}</time>
                    </span>
                )}
            </p>
            {note && <p>{note}</p>}
        </header>
    );
}
