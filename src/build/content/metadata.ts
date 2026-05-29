import type { FrontmatterPayload, PageMeta } from "../../types/content.ts";

const DESCRIPTION_MAX_LENGTH = 160;
const WORDS_PER_MINUTE = 238;

function normalizeTitle(value: string): string {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function collapseWhitespace(value: string): string {
    return value.replace(/\s+/g, " ").trim();
}

function stripMdxSyntax(value: string): string {
    return value
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^\s*>+\s?/gm, "")
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        .replace(/^\s*[-]{3,}\s*$/gm, " ")
        .replace(/<\/?[^>]+>/g, " ")
        .replace(/\{[^{}]*\}/g, " ")
        .replace(/[*_~]/g, " ");
}

function truncateDescription(value: string): string {
    if (value.length <= DESCRIPTION_MAX_LENGTH) {
        return value;
    }

    const clipped = value.slice(0, DESCRIPTION_MAX_LENGTH + 1);
    const wordBoundary = clipped.lastIndexOf(" ");
    const end = wordBoundary > 100 ? wordBoundary : DESCRIPTION_MAX_LENGTH;

    return `${clipped.slice(0, end).trimEnd()}...`;
}

function extractDescriptionFromMdx(
    body: string,
    title?: string,
): string | undefined {
    const normalizedTitle = normalizeTitle(title || "");

    for (const block of body.split(/\n\s*\n/g)) {
        const trimmed = block.trim();
        if (!trimmed || /^\s*(import|export)\s/.test(trimmed)) {
            continue;
        }

        const candidate = collapseWhitespace(stripMdxSyntax(trimmed));
        if (!candidate) {
            continue;
        }

        if (trimmed.startsWith("#")) {
            if (
                normalizedTitle &&
                normalizeTitle(candidate) === normalizedTitle
            ) {
                continue;
            }
        }

        return truncateDescription(candidate);
    }

    return undefined;
}

/**
 * Resolves the meta description, preferring an explicit frontmatter value and
 * otherwise falling back to the first prose block of the body.
 */
export function resolveMetaDescription(
    input: FrontmatterPayload,
): string | undefined {
    const explicit = collapseWhitespace(String(input.meta.description || ""));

    if (explicit) {
        return truncateDescription(explicit);
    }

    return extractDescriptionFromMdx(
        input.body,
        typeof input.meta.title === "string" ? input.meta.title : undefined,
    );
}

function computeReadingTime(body: string): {
    wordCount: number;
    readingTime: string;
} {
    const words = stripMdxSyntax(body).split(/\s+/).filter(Boolean);
    const count = words.length;
    const minutes = Math.max(1, Math.round(count / WORDS_PER_MINUTE));
    return { wordCount: count, readingTime: `${minutes} min read` };
}

/**
 * Derives the `section` from the content directory layout when frontmatter
 * omits it (e.g. `content/articles/foo.mdx` → `articles`).
 */
function deriveSection(
    explicit: string | undefined,
    filePath: string,
): string | undefined {
    if (explicit) return explicit;

    const segments = filePath.split("/");
    const contentIdx = segments.indexOf("content");
    if (contentIdx >= 0 && segments.length > contentIdx + 2) {
        return segments[contentIdx + 1];
    }
    return undefined;
}

/**
 * Combines parsed frontmatter with auto-derived metadata (description,
 * section, word count, and reading time) into the final `PageMeta`.
 */
export function resolvePageMeta(
    parsed: FrontmatterPayload,
    filePath: string,
): PageMeta {
    const description = resolveMetaDescription(parsed);
    const { wordCount, readingTime } = computeReadingTime(parsed.body);
    const section = deriveSection(parsed.meta.section, filePath);

    return {
        ...parsed.meta,
        ...(description ? { description } : {}),
        section,
        words: wordCount,
        readingTime,
    };
}
