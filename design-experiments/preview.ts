/* Serve the built site with one of the experiment stylesheets in place
   of the real one. The stylesheet is re-bundled on every page load, so
   an edit shows up on refresh.

     pnpm build -- --dev
     node --import tsx design-experiments/preview.ts raster [port]

   Pass "current" to serve the site's own stylesheet. */
import { bundle } from "lightningcss";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { LIGHTNING_CSS_TARGET } from "../src/config.ts";
import { createStaticSiteServer } from "../src/build/serve.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const designs = readdirSync(here)
    .filter((file) => file.endsWith(".css") && !file.startsWith("_"))
    .map((file) => file.replace(/\.css$/, ""));

const design = process.argv[2] ?? "";
const port = Number(process.argv[3] ?? 3010);

if (design !== "current" && !designs.includes(design)) {
    process.stderr.write(`usage: preview.ts <${["current", ...designs].join("|")}> [port]\n`);
    process.exit(1);
}

function experimentCss(): string {
    const filename = `${here}${design}.css`;
    if (!existsSync(filename)) return "";
    const { code } = bundle({ filename, minify: true, targets: LIGHTNING_CSS_TARGET });
    return Buffer.from(code).toString("utf8");
}

const server = createStaticSiteServer({
    transformHtml: (html) =>
        design === "current"
            ? html
            : html.replace(
                  /<link rel="stylesheet" href="[^"]*"\/?>/,
                  () => `<style>${experimentCss()}</style>`,
              ),
});

server.listen(port, "127.0.0.1", () =>
    process.stdout.write(`\n  ${design}: http://localhost:${port}\n\n`),
);
