import { fileURLToPath } from "node:url";
import { devAssetManifest, type AssetManifest } from "./assets/asset-manifest.ts";
import { indexArticles } from "./content/article-index.ts";
import { compilePages, type CompileResult } from "./content/compile.ts";
import { cleanGeneratedPages, discoverSourceFiles } from "./content/discover.ts";
import { writePages, type WrittenPageSummary } from "./render/write-pages.ts";
import type { ArticleIndexEntry, BuiltContent } from "../types/content.ts";

export interface CompiledSite {
    sourceFiles: string[];
    compiled: BuiltContent[];
    failed: CompileResult["failed"];
    articleIndex: ArticleIndexEntry[];
}

/** Stages 1–3 of the pipeline: discover sources, compile MDX, index articles. */
export async function compileSite(): Promise<CompiledSite> {
    const sourceFiles = discoverSourceFiles();
    const { compiled, failed } = await compilePages(sourceFiles);
    const articleIndex = indexArticles(compiled);
    return { sourceFiles, compiled, failed, articleIndex };
}

/** Reports compilation failures and throws a single aggregated error. */
export function assertCompiledCleanly(failed: CompileResult["failed"]): void {
    if (failed.length === 0) return;
    for (const { file, error } of failed) {
        process.stderr.write(`  error  ${file}\n  ${String(error)}\n`);
    }
    throw new Error(`Build failed: ${failed.length} page(s) had errors`);
}

/**
 * Dev rebuild: the content subset of the full pipeline
 * (discover → compile → index → render) with validation and artifacts skipped.
 * Used for in-process content edits and as a fresh-code subprocess for template
 * edits.
 */
export async function rebuildPages(
    manifest: AssetManifest = devAssetManifest,
): Promise<WrittenPageSummary> {
    const start = performance.now();
    const { compiled, failed, articleIndex } = await compileSite();

    cleanGeneratedPages();
    const summary = writePages(compiled, articleIndex, manifest);
    assertCompiledCleanly(failed);

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);
    process.stdout.write(`built ${compiled.length} pages in ${elapsed}s\n`);
    return summary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    rebuildPages().catch((error) => {
        process.stderr.write(`${String(error)}\n`);
        process.exit(1);
    });
}
