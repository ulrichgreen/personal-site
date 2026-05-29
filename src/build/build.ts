import { fileURLToPath } from "node:url";
import {
    applyHashedFilenames,
    devAssetManifest,
    generateAssetManifest,
} from "./assets/asset-manifest.ts";
import {
    listLargestOutputFiles,
    sumOutputBytes,
    writeBuildSummary,
} from "./build-summary.ts";
import { cleanDist } from "./clean.ts";
import { buildAncillary } from "./artifacts/ancillary.ts";
import { buildClient } from "./assets/client.ts";
import { buildCss } from "./assets/css.ts";
import { buildImages } from "./assets/images.ts";
import { cleanGeneratedPages } from "./content/discover.ts";
import { validateContentContracts } from "./content/contracts.ts";
import { enforcePerformanceBudgets } from "./performance-budgets.ts";
import { writePages } from "./render/write-pages.ts";
import { assertCompiledCleanly, compileSite } from "./pipeline.ts";

export async function buildAll(options: { dev?: boolean } = {}): Promise<void> {
    const start = performance.now();
    const dev = options.dev ?? false;

    // Stage 0 — assets (independent of content, build in parallel).
    if (!dev) cleanDist();
    const [, , imageSummary] = await Promise.all([
        buildCss(),
        buildClient(),
        buildImages(),
    ]);
    const manifest = dev ? devAssetManifest : generateAssetManifest();

    // Stages 1–3 — discover, compile, index (single source of truth).
    const { compiled, failed, articleIndex } = await compileSite();

    // Stage 4 — validate (only meaningful once every page compiled).
    if (failed.length === 0) {
        validateContentContracts({ articleIndex, builtContent: compiled });
    }

    // Stage 5 — render pages to disk.
    cleanGeneratedPages();
    const pageSummary = writePages(compiled, articleIndex, manifest);
    assertCompiledCleanly(failed);

    // Stage 6 — ancillary artifacts (feed, sitemap, robots, headers, og-image).
    const compiledArticles = compiled.filter((c) =>
        c.sourcePath.includes("/articles/"),
    );
    const ancillarySummary = await buildAncillary(articleIndex, compiledArticles);

    // Stage 7 — production-only finalization.
    if (!dev) {
        applyHashedFilenames(manifest);
        enforcePerformanceBudgets();
    }

    writeBuildSummary({
        pageCount: pageSummary.pageCount,
        articleCount: articleIndex.length,
        feedEntries: ancillarySummary.feedEntries,
        imageSummary,
        cssBytes: sumOutputBytes([".css"]),
        jsBytes: sumOutputBytes([".js"]),
        islandPages: pageSummary.islandPages,
        islands: pageSummary.islands,
        largestFiles: listLargestOutputFiles(),
    });

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);
    process.stdout.write(`built ${compiled.length} pages in ${elapsed}s\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const dev = process.argv.includes("--dev");

    buildAll({ dev }).catch((error) => {
        process.stderr.write(`${String(error)}\n`);
        process.exit(1);
    });
}
