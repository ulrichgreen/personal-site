import { build } from "esbuild";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ESBUILD_TARGET } from "../../config.ts";
import { distDirectory } from "../shared/paths.ts";

const targets = [
    {
        entryPoint: fileURLToPath(
            new URL("../../client/site.ts", import.meta.url),
        ),
        outfile: join(distDirectory, "site.js"),
    },
    {
        entryPoint: fileURLToPath(
            new URL("../../client/islands.ts", import.meta.url),
        ),
        outfile: join(distDirectory, "islands.js"),
    },
];

export async function buildClient(
    options: { dev?: boolean } = {},
): Promise<void> {
    const dev = options.dev ?? false;
    await Promise.all(
        targets.map(({ entryPoint, outfile }) =>
            build({
                entryPoints: [entryPoint],
                outfile,
                bundle: true,
                format: "iife",
                platform: "browser",
                target: ESBUILD_TARGET,
                // Keep dev output readable for debugging; ship minified.
                minify: !dev,
                logLevel: "silent",
            }),
        ),
    );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    buildClient({ dev: process.argv.includes("--dev") }).catch((error) => {
        process.stderr.write(`${String(error)}\n`);
        process.exit(1);
    });
}
