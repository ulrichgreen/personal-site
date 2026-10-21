import { build } from "esbuild";
import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ESBUILD_TARGET } from "../../config.ts";
import { distDirectory } from "../shared/paths.ts";

const clientEntry = (name: string) =>
    fileURLToPath(new URL(`../../client/${name}.ts`, import.meta.url));

// Island code lives in content-hashed chunks next to the islands.js entry.
export const chunkDirectory = "chunks";

/** The island chunks the last build wrote, as paths relative to dist/. */
export function listIslandChunks(): string[] {
    return readdirSync(join(distDirectory, chunkDirectory)).map(
        (file) => `${chunkDirectory}/${file}`,
    );
}

export async function buildClient(
    options: { dev?: boolean } = {},
): Promise<void> {
    const dev = options.dev ?? false;
    const shared = {
        bundle: true,
        platform: "browser",
        target: ESBUILD_TARGET,
        // Keep dev output readable for debugging; ship minified.
        minify: !dev,
        logLevel: "silent",
    } as const;

    rmSync(join(distDirectory, chunkDirectory), { recursive: true, force: true });

    await Promise.all([
        build({
            ...shared,
            entryPoints: [clientEntry("site")],
            outfile: join(distDirectory, "site.js"),
            format: "iife",
        }),
        // islands.js is a small module that waits for each island's trigger,
        // then imports Preact and that island's code from chunks/.
        build({
            ...shared,
            entryPoints: [clientEntry("islands")],
            outdir: distDirectory,
            entryNames: "[name]",
            chunkNames: `${chunkDirectory}/[name]-[hash]`,
            format: "esm",
            splitting: true,
        }),
    ]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    buildClient({ dev: process.argv.includes("--dev") }).catch((error) => {
        process.stderr.write(`${String(error)}\n`);
        process.exit(1);
    });
}
