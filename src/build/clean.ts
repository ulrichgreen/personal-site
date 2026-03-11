import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function cleanDist(): void {
    rmSync(new URL("../../dist", import.meta.url), {
        force: true,
        recursive: true,
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    cleanDist();
}
