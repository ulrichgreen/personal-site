import { writeDistFile } from "../shared/dist-fs.ts";
import type { Artifact } from "./context.ts";

// Cloudflare serves dist/ exactly as built (html_handling "none" in wrangler.jsonc), so every page
// keeps the .html URL the links and sitemap use. The root is the one path without a file of its own.
export const buildRedirects: Artifact = () => {
    writeDistFile("_redirects", "/ /index.html 200\n");
};
