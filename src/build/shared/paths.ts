import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const distDirectory = fileURLToPath(
    new URL("../../../dist", import.meta.url),
);
export const contentDirectory = fileURLToPath(
    new URL("../../../content", import.meta.url),
);
export const articlesDirectory = join(contentDirectory, "articles");

// ─── Source → output normalization ───────────────────────────────
// One place owns the rules that turn a content `.mdx` source path into the
// slug, dist file path, and site URL it renders to. Keep all call sites
// delegating here so the mapping never drifts.

/** `…/content/articles/on-tools.mdx` → `on-tools` */
export function slugFromSource(sourcePath: string): string {
    return sourcePath.split("/").pop()?.replace(/\.mdx$/, "") ?? "";
}

/** `…/content/articles/on-tools.mdx` → `articles/on-tools.html` */
export function htmlRelativePath(sourcePath: string): string {
    return relative(contentDirectory, sourcePath).replace(/\.mdx$/, ".html");
}

/** Absolute filesystem path of the rendered page under `dist/`. */
export function outputPathFromSource(sourcePath: string): string {
    return join(distDirectory, htmlRelativePath(sourcePath));
}

/** Site-root-relative URL of the rendered page, e.g. `/articles/on-tools.html`. */
export function urlPathFromSource(sourcePath: string): string {
    const marker = "/content/";
    const idx = sourcePath.indexOf(marker);
    if (idx === -1) return "/";
    return "/" + sourcePath.slice(idx + marker.length).replace(/\.mdx$/, ".html");
}
