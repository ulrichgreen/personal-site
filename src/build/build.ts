import { fileURLToPath } from "node:url";
import { applyHashedFilenames, generateAssetManifest } from "./asset-manifest.ts";
import { buildClient } from "./client.ts";
import { buildCss } from "./css.ts";
import { buildSite } from "./site.ts";

export async function buildAll(): Promise<void> {
    await Promise.all([buildCss(), buildClient()]);
    const manifest = generateAssetManifest();
    await buildSite(manifest);
    applyHashedFilenames(manifest);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    buildAll().catch((error) => {
        process.stderr.write(`${String(error)}\n`);
        process.exit(1);
    });
}