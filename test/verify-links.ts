import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = fileURLToPath(new URL("../dist", import.meta.url));

if (!existsSync(distDir)) {
    console.error(
        `verify-links.ts: dist/ not found at ${distDir}. Run "pnpm build" first.`,
    );
    process.exit(1);
}

function collectHtmlFiles(dir: string): string[] {
    const files: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectHtmlFiles(fullPath));
        } else if (entry.name.endsWith(".html")) {
            files.push(fullPath);
        }
    }
    return files;
}

function extractLinks(html: string): string[] {
    const pattern = /(?:href|src)="([^"]+)"/g;
    const links: string[] = [];
    let match;
    while ((match = pattern.exec(html)) !== null) {
        links.push(match[1]);
    }
    return links;
}

function collectAnchorIds(html: string): Set<string> {
    const ids = new Set<string>();
    for (const match of html.matchAll(/\bid="([^"]*)"/g)) {
        ids.add(match[1]);
    }
    return ids;
}

// Links with a scheme (https:, mailto:, data:, …) or protocol-relative
// links point off-site; everything else should resolve inside dist/.
function isExternalLink(link: string): boolean {
    return /^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith("//");
}

function decodeFragment(fragment: string): string {
    try {
        return decodeURIComponent(fragment);
    } catch {
        return fragment;
    }
}

const htmlFiles = collectHtmlFiles(distDir);
const broken: { file: string; link: string; reason: string }[] = [];

for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    const links = extractLinks(html);
    const relativePath = file.replace(distDir, "");
    const anchorIds = collectAnchorIds(html);

    for (const link of links) {
        if (isExternalLink(link)) continue;

        const [withoutFragment, fragment] = link.split("#", 2);
        const path = withoutFragment.split("?")[0];

        // Same-page anchor: check the target id exists in this file.
        if (!path) {
            if (fragment && !anchorIds.has(decodeFragment(fragment))) {
                broken.push({ file: relativePath, link, reason: "missing anchor" });
            }
            continue;
        }

        // Root-relative links resolve against dist/, relative links against
        // the directory of the file that contains them.
        const target = path.startsWith("/")
            ? join(distDir, path)
            : join(dirname(file), path);

        if (!existsSync(target)) {
            broken.push({ file: relativePath, link, reason: "missing file" });
            continue;
        }

        // A directory only serves if it has an index page.
        if (
            statSync(target).isDirectory() &&
            !existsSync(join(target, "index.html"))
        ) {
            broken.push({ file: relativePath, link, reason: "directory without index.html" });
        }
    }
}

if (broken.length > 0) {
    console.error("Broken internal links found:");
    for (const { file, link, reason } of broken) {
        console.error(`  ${file} → ${link} (${reason})`);
    }
    process.exit(1);
}

console.log(`Link check passed: ${htmlFiles.length} HTML files, no broken internal links.`);
