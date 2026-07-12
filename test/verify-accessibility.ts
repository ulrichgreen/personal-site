import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildContent } from "../src/build/content/compile.ts";
import { renderPage } from "../src/build/render/render-react-page.tsx";
import { compileSite } from "../src/build/pipeline.ts";

/**
 * Color tokens are authored as light-dark(#light, #dark) pairs in
 * src/styles/style.css. This extracts both halves so contrast can be
 * verified for each scheme.
 */
function extractColorPair(
    css: string,
    name: string,
): { light: string; dark: string } {
    const match = css.match(
        new RegExp(
            `--${name}:\\s*light-dark\\((#[0-9a-fA-F]{6}),\\s*(#[0-9a-fA-F]{6})\\)`,
        ),
    );
    assert(match, `Could not find light-dark color token --${name}.`);
    return { light: match[1], dark: match[2] };
}

function relativeLuminance(hex: string) {
    const channels = hex
        .slice(1)
        .match(/.{2}/g)
        ?.map((channel) => Number.parseInt(channel, 16) / 255);

    assert(channels?.length === 3, `Invalid color value: ${hex}`);

    const [red, green, blue] = channels.map((channel) => {
        return channel <= 0.03928
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string) {
    const [lighter, darker] = [
        relativeLuminance(foreground),
        relativeLuminance(background),
    ].sort((left, right) => right - left);

    return (lighter + 0.05) / (darker + 0.05);
}

function extractCssBlockAfter(source: string, marker: string, label: string) {
    const markerIndex = source.indexOf(marker);
    assert(markerIndex >= 0, `Could not find ${label}.`);

    const openIndex = source.indexOf("{", markerIndex);
    assert(openIndex >= 0, `Could not find ${label} opening brace.`);

    let depth = 0;
    for (let index = openIndex; index < source.length; index += 1) {
        const char = source[index];
        if (char === "{") depth += 1;
        if (char === "}") depth -= 1;
        if (depth === 0) {
            return source.slice(openIndex + 1, index);
        }
    }

    assert.fail(`Could not find ${label} closing brace.`);
}

async function main() {
    const cssPath = fileURLToPath(
        new URL("../src/styles/style.css", import.meta.url),
    );
    const css = readFileSync(cssPath, "utf8");

    const paper = extractColorPair(css, "paper");
    const ink = extractColorPair(css, "ink");
    const inkSoft = extractColorPair(css, "ink-soft");
    const accent = extractColorPair(css, "accent");

    for (const scheme of ["light", "dark"] as const) {
        assert(
            contrastRatio(ink[scheme], paper[scheme]) >= 4.5,
            `Primary ${scheme}-mode text should meet WCAG AA contrast.`,
        );
        assert(
            contrastRatio(inkSoft[scheme], paper[scheme]) >= 4.5,
            `Muted ${scheme}-mode text should meet WCAG AA contrast.`,
        );
        assert(
            contrastRatio(accent[scheme], paper[scheme]) >= 4.5,
            `Accent ${scheme}-mode text should meet WCAG AA contrast.`,
        );
    }

    const headerNavBlock = extractCssBlockAfter(
        css,
        "body > header nav",
        "site header nav styles",
    );
    assert(
        !/display:\s*none/.test(headerNavBlock),
        "Primary navigation should stay visible on all screens.",
    );

    assert(
        css.includes(".skip-link"),
        "A visible-on-focus skip link style should exist.",
    );

    const { articleIndex } = await compileSite();
    const homePath = fileURLToPath(
        new URL("../content/index.mdx", import.meta.url),
    );
    const home = await buildContent(homePath);
    const homeHtml = renderPage(home, articleIndex);
    const skipLinkTag = homeHtml
        .match(/<a\b[^>]*>/g)
        ?.find((tag) => tag.includes('class="skip-link"'));
    const mainTag = homeHtml
        .match(/<main\b[^>]*>/g)
        ?.find((tag) => tag.includes('id="main-content"'));

    assert(
        skipLinkTag,
        "The page should render a skip link to the main landmark.",
    );
    assert(
        skipLinkTag.includes('href="#main-content"'),
        "The skip link should point at the main landmark ID.",
    );
    assert(mainTag, "The main landmark should expose the skip-link target.");

    const h1Matches = homeHtml.match(/<h1[\s>]/g) ?? [];
    assert.equal(
        h1Matches.length,
        1,
        "The home page should have exactly one h1.",
    );

    console.log(
        "Accessibility verified: text colors meet WCAG AA contrast in both schemes, skip link exists, the home page has one h1, and navigation stays visible on small screens.",
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
