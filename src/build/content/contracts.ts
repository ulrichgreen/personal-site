import { existsSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { RASTER_EXTS } from "../assets/images.ts";
import { contentDirectory } from "../shared/paths.ts";
import type { ArticleIndexEntry, BuiltContent } from "../../types/content.ts";

const articlePathPattern = /^articles\/[a-z0-9]+(?:-[a-z0-9]+)*\.mdx$/;
const pagePathPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.mdx$/;
const imageReferencePattern = /\/images\/[^\s"'`)<>]+/g;
// Matches outputs the image pipeline derives from a raster source
// (`name.webp`, `name.avif`, `name-<width>w.webp`, …); see assets/images.ts.
const generatedVariantPattern = /(?:-\d+w)?\.(?:webp|avif)$/;
const defaultImagesDirectory = fileURLToPath(
    new URL("../../images", import.meta.url),
);

interface ContentContractOptions {
    articleIndex: ArticleIndexEntry[];
    builtContent: BuiltContent[];
    contentDirectory?: string;
    imagesDirectory?: string;
}

function fail(message: string): never {
    throw new Error(`Content contract failed: ${message}`);
}

function assertUniqueArticleSlugs(articleIndex: ArticleIndexEntry[]): void {
    const seen = new Map<string, ArticleIndexEntry>();
    for (const entry of articleIndex) {
        const existing = seen.get(entry.slug);
        if (existing) {
            fail(
                `Duplicate article slug "${entry.slug}" in ${existing.sourcePath} and ${entry.sourcePath}.`,
            );
        }
        seen.set(entry.slug, entry);
    }
}

function assertCanonicalSourcePaths(
    builtContent: BuiltContent[],
    root: string,
): void {
    for (const page of builtContent) {
        const relativePath = relative(root, page.sourcePath).split(sep).join("/");
        const isCanonical =
            articlePathPattern.test(relativePath) ||
            pagePathPattern.test(relativePath);

        if (!isCanonical) {
            fail(
                `Use lowercase kebab-case content paths. Found ${relativePath}.`,
            );
        }
    }
}

function assertSeriesIntegrity(articleIndex: ArticleIndexEntry[]): void {
    const entriesBySeries = new Map<string, ArticleIndexEntry[]>();
    for (const entry of articleIndex) {
        if (!entry.series) continue;
        entriesBySeries.set(entry.series, [
            ...(entriesBySeries.get(entry.series) ?? []),
            entry,
        ]);
    }

    for (const [series, entries] of entriesBySeries) {
        const missingOrder = entries.find((entry) => entry.seriesOrder === undefined);
        if (missingOrder) {
            fail(
                `Series "${series}" requires seriesOrder on ${missingOrder.sourcePath}.`,
            );
        }

        const ordered = entries
            .map((entry) => entry.seriesOrder)
            .filter((order): order is number => order !== undefined)
            .sort((left, right) => left - right);

        for (let index = 0; index < ordered.length; index++) {
            const expected = index + 1;
            if (ordered[index] !== expected) {
                // Gaps are allowed (e.g. inserting an article mid-series), but
                // worth surfacing so renumbering stays a deliberate choice.
                process.stderr.write(
                    `  warn  Series "${series}" has non-contiguous seriesOrder ` +
                    `(expected ${expected}, found ${ordered[index]}).\n`,
                );
                break;
            }
        }
    }
}

/**
 * A reference is valid when it names a source image directly, or a generated
 * variant whose raster source exists (the pipeline derives those at build
 * time, so they are absent from src/images/).
 */
function imageReferenceResolves(
    relativeReference: string,
    imagesDirectory: string,
): boolean {
    if (existsSync(join(imagesDirectory, relativeReference))) return true;
    if (!generatedVariantPattern.test(relativeReference)) return false;

    const sourceBase = relativeReference.replace(generatedVariantPattern, "");
    return [...RASTER_EXTS].some((ext) =>
        existsSync(join(imagesDirectory, `${sourceBase}${ext}`)),
    );
}

function assertImageReferencesExist(
    builtContent: BuiltContent[],
    imagesDirectory: string,
): void {
    for (const page of builtContent) {
        const raw = readFileSync(page.sourcePath, "utf8");
        const references = [...new Set(raw.match(imageReferencePattern) ?? [])];
        for (const reference of references) {
            const relativeReference = reference.replace(/^\/images\//, "");
            if (!imageReferenceResolves(relativeReference, imagesDirectory)) {
                fail(
                    `Missing image reference "${reference}" in ${page.sourcePath}.`,
                );
            }
        }
    }
}

export function validateContentContracts({
    articleIndex,
    builtContent,
    contentDirectory: root = contentDirectory,
    imagesDirectory = defaultImagesDirectory,
}: ContentContractOptions): void {
    assertUniqueArticleSlugs(articleIndex);
    assertCanonicalSourcePaths(builtContent, root);
    assertSeriesIntegrity(articleIndex);
    assertImageReferencesExist(builtContent, imagesDirectory);
}
