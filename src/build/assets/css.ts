import { bundle } from "lightningcss";
import { mkdirSync, writeFileSync } from "node:fs";
import { LIGHTNING_CSS_TARGET } from "../../config.ts";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { distDirectory } from "../shared/paths.ts";

const source = fileURLToPath(new URL("../../styles/style.css", import.meta.url));
const destination = join(distDirectory, "style.css");

export async function buildCss(): Promise<void> {
    mkdirSync(distDirectory, { recursive: true });

    const { code } = bundle({
        filename: source,
        minify: true,
        targets: LIGHTNING_CSS_TARGET,
    });

    writeFileSync(destination, Buffer.from(code).toString("utf8"));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    buildCss();
}
