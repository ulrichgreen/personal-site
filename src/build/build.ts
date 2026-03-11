import { buildClient } from "./client.ts";
import { buildCss } from "./css.ts";
import { buildSite } from "./site.ts";

export async function buildAll(): Promise<void> {
    buildCss();
    await buildClient();
    await buildSite();
}

buildAll().catch((error) => {
    process.stderr.write(`${String(error)}\n`);
    process.exit(1);
});