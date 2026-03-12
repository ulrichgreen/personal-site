import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const distUrl = new URL("../dist/", import.meta.url);

function distPath(name: string): string {
    return fileURLToPath(new URL(name, distUrl));
}

function requireDist(name: string): string {
    const path = distPath(name);
    if (!existsSync(path)) {
        console.error(
            `verify-seo-artifacts.ts: ${name} not found at ${path}. Run "pnpm build" first.`,
        );
        process.exit(1);
    }
    return readFileSync(path, "utf8");
}

function main() {
    // robots.txt
    const robots = requireDist("robots.txt");

    assert(
        robots.includes("User-agent: *"),
        "robots.txt should include a User-agent directive.",
    );
    assert(
        robots.includes("Allow: /"),
        "robots.txt should allow all paths.",
    );
    assert(
        /Sitemap: https?:\/\/[^\s]+sitemap\.xml/.test(robots),
        "robots.txt should include a Sitemap directive pointing to sitemap.xml.",
    );

    // sitemap.xml
    const sitemap = requireDist("sitemap.xml");

    assert(
        sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'),
        "sitemap.xml should start with an XML declaration.",
    );
    assert(
        sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'),
        "sitemap.xml should contain a <urlset> element with the sitemap namespace.",
    );
    assert(
        sitemap.includes("</urlset>"),
        "sitemap.xml should close the <urlset> element.",
    );
    assert(
        /<loc>https?:\/\/[^<]+<\/loc>/.test(sitemap),
        "sitemap.xml should include at least one <loc> element with an absolute URL.",
    );
    assert(
        (sitemap.match(/<url>/g) || []).length > 0,
        "sitemap.xml should include at least one <url> entry.",
    );

    // _headers
    const headers = requireDist("_headers");

    assert(
        headers.includes("Cache-Control:"),
        "_headers should include Cache-Control directives.",
    );
    assert(
        headers.includes("/*.css"),
        "_headers should include a CSS caching rule.",
    );
    assert(
        headers.includes("/*.js"),
        "_headers should include a JS caching rule.",
    );
    assert(
        headers.includes("immutable"),
        "_headers Cache-Control should include immutable for hashed assets.",
    );

    // og-image.svg
    const ogImage = requireDist("og-image.svg");

    assert(
        ogImage.includes("<svg"),
        "og-image.svg should contain an <svg> element.",
    );
    assert(
        ogImage.includes('xmlns="http://www.w3.org/2000/svg"'),
        "og-image.svg should include the SVG namespace.",
    );
    assert(
        /^<svg[^>]+width="1200"[^>]+height="630"/.test(ogImage) ||
        /^<svg[^>]+height="630"[^>]+width="1200"/.test(ogImage),
        "og-image.svg should use standard OG image dimensions (1200×630).",
    );
    assert(
        ogImage.includes("</svg>"),
        "og-image.svg should close the <svg> element.",
    );

    console.log(
        "SEO artifacts verified: robots.txt, sitemap.xml, _headers, and og-image.svg are well-formed.",
    );
    process.exit(0);
}

main();
