import { fileURLToPath } from "node:url";
import { applyHashedFilenames, generateAssetManifest } from "./asset-manifest.ts";
import { buildAncillary } from "./ancillary.ts";
import { buildClient } from "./client.ts";
import { buildCss } from "./css.ts";
import { compilePages } from "./compile-pages.ts";
import { cleanGeneratedPages, discoverSourceFiles } from "./discover.ts";
import { writingDirectory } from "./paths.ts";
import { writePages } from "./write-pages.ts";
import { listWritingEntries } from "./writing-index.ts";

export async function buildAll(): Promise<void> {
    const start = performance.now();

    await Promise.all([buildCss(), buildClient()]);
    const manifest = generateAssetManifest();

    const writingIndex = listWritingEntries(writingDirectory);
    const sourceFiles = discoverSourceFiles();
    const { compiled, failed } = await compilePages(sourceFiles);

    cleanGeneratedPages();
    writePages(compiled, writingIndex, manifest);

    if (failed.length > 0) {
        for (const { file, error } of failed) {
            process.stderr.write(`Failed to build ${file}: ${String(error)}\n`);
        }
        throw new Error(`Build failed: ${failed.length} page(s) had errors`);
    }

    const compiledWriting = compiled.filter((c) =>
        c.sourcePath.includes("/writing/"),
    );
    await buildAncillary(writingIndex, compiledWriting);
    applyHashedFilenames(manifest);

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);
    process.stdout.write(`build: ${compiled.length} pages in ${elapsed}s\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    buildAll().catch((error) => {
        process.stderr.write(`${String(error)}\n`);
        process.exit(1);
    });
}