import { readFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { pathToFileURL } from "node:url";
import * as runtime from "preact/jsx-runtime";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type {
    BuiltContent,
    ContentBodyComponent,
    ContentHeading,
} from "../../types/content.ts";
import { formatCodeLanguage } from "../../format-code-language.ts";
import { parseFrontmatter } from "./frontmatter.ts";
import { resolvePageMeta } from "./metadata.ts";
import { CODE_THEME } from "./syntax-theme.ts";

const MDX_ESM_PATTERN = /^\s*(import|export)\s/m;

type HastNode = {
    type: string;
    tagName?: string;
    value?: string;
    properties?: Record<string, unknown>;
    children?: HastNode[];
};

function getStringProperty(value: unknown): string | undefined {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
        return value.find((entry): entry is string => typeof entry === "string");
    }
    return undefined;
}

function classList(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.filter((entry): entry is string => typeof entry === "string");
    }
    if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
    return [];
}

function createElement(
    tagName: string,
    properties: Record<string, unknown>,
    children: HastNode[] = [],
): HastNode {
    return { type: "element", tagName, properties, children };
}

function createText(value: string): HastNode {
    return { type: "text", value };
}

function collapseWhitespace(value: string): string {
    return value.replace(/\s+/g, " ").trim();
}

function hasProperty(node: HastNode, key: string): boolean {
    return Boolean(node.properties && key in node.properties);
}

function visitTree(node: HastNode, visitor: (node: HastNode) => void): void {
    if (!node) {
        return;
    }

    visitor(node);

    for (const child of node.children || []) {
        if (!child) continue;
        visitTree(child, visitor);
    }
}

function extractNodeText(node: HastNode): string {
    if (!node) {
        return "";
    }

    if (node.type === "text") {
        return node.value ?? "";
    }

    return (node.children || []).filter(Boolean).map(extractNodeText).join("");
}

function rehypeCodeBlockChrome() {
    return (tree: HastNode) => {
        visitTree(tree, (node) => {
            if (
                node.type !== "element" ||
                node.tagName !== "figure" ||
                !hasProperty(node, "data-rehype-pretty-code-figure")
            ) {
                return;
            }

            const children = node.children || [];
            if (
                children.some(
                    (child) =>
                        child.type === "element" &&
                        classList(child.properties?.className).includes(
                            "code-block__toolbar",
                        ),
                )
            ) {
                return;
            }

            const titleIndex = children.findIndex(
                (child) =>
                    child.type === "element" &&
                    hasProperty(child, "data-rehype-pretty-code-title"),
            );
            const titleNode = titleIndex >= 0 ? children.splice(titleIndex, 1)[0] : undefined;

            const preIndex = children.findIndex(
                (child) => child.type === "element" && child.tagName === "pre",
            );
            if (preIndex < 0) return;

            const preNode = children[preIndex];
            const language =
                getStringProperty(preNode.properties?.["data-language"]) ||
                getStringProperty(node.properties?.["data-language"]) ||
                "text";

            node.properties = {
                ...node.properties,
                className: [...classList(node.properties?.className), "code-block"],
                "data-language": language,
            };

            if (titleNode) {
                titleNode.properties = {
                    ...titleNode.properties,
                    className: [
                        ...classList(titleNode.properties?.className),
                        "code-block__title",
                    ],
                };
            }

            const toolbar = createElement(
                "div",
                { className: ["code-block__toolbar"] },
                [
                    ...(titleNode ? [titleNode] : []),
                    createElement(
                        "span",
                        { className: ["code-block__language"] },
                        [createText(formatCodeLanguage(language))],
                    ),
                    createElement(
                        "button",
                        {
                            className: ["code-block__copy"],
                            type: "button",
                            "aria-label": `Copy ${language} code to clipboard`,
                            disabled: true,
                        },
                        [createText("Copy")],
                    ),
                ],
            );

            children.splice(preIndex, 0, toolbar);
            node.children = children;
        });
    };
}

function rehypeCollectHeadings(headings: ContentHeading[]) {
    return (tree: HastNode) => {
        visitTree(tree, (node) => {
            if (
                node.type !== "element" ||
                (node.tagName !== "h2" && node.tagName !== "h3")
            ) {
                return;
            }

            const id = getStringProperty(node.properties?.id);
            const text = collapseWhitespace(extractNodeText(node));
            if (!id || !text) return;

            headings.push({
                id,
                text,
                level: node.tagName === "h2" ? 2 : 3,
            });
        });
    };
}

function assertSupportedMdx(body: string, filePath: string) {
    const withoutFencedBlocks = body.replace(/^```[\s\S]*?^```/gm, "");
    if (MDX_ESM_PATTERN.test(withoutFencedBlocks)) {
        throw new Error(
            `${filePath}: MDX ESM is disabled. Use approved components from src/content-components.tsx instead.`,
        );
    }
}

const mdxImport = import("@mdx-js/mdx");
const shikiImport = import("shiki");
const siteHighlighterPromise = shikiImport.then(({ createHighlighter }) =>
    createHighlighter({
        themes: [CODE_THEME],
        langs: ["plaintext"],
    } as never),
);

export async function compileMdx(
    body: string,
    filePath: string,
): Promise<{ Content: ContentBodyComponent; headings: ContentHeading[] }> {
    assertSupportedMdx(body, filePath);

    const { evaluate } = await mdxImport;
    const headings: ContentHeading[] = [];

    const module = (await evaluate(
        { value: body, path: filePath },
        {
            ...runtime,
            baseUrl: pathToFileURL(filePath),
            development: false,
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
                rehypeSlug,
                [rehypeCollectHeadings, headings],
                [
                    rehypePrettyCode,
                    {
                        theme: "site-code",
                        keepBackground: false,
                        getHighlighter: async (
                            options: { langs?: unknown[] },
                        ) => {
                            const highlighter = await siteHighlighterPromise;
                            const langs = options.langs?.filter(
                                (lang): lang is string => typeof lang === "string",
                            );

                            if (langs && langs.length > 0) {
                                await highlighter.loadLanguage(...(langs as never[]));
                            }

                            return highlighter;
                        },
                    },
                ],
                rehypeCodeBlockChrome,
                [rehypeAutolinkHeadings, { behavior: "append" }],
            ],
        },
    )) as {
        default: ContentBodyComponent;
    };

    return { Content: module.default, headings };
}

/**
 * Reads a single MDX source file and produces its compiled component, derived
 * metadata, and heading outline.
 */
export async function buildContent(filePath: string): Promise<BuiltContent> {
    const raw = readFileSync(filePath, "utf8");
    const parsed = parseFrontmatter(raw, filePath);
    const meta = resolvePageMeta(parsed, filePath);
    const { Content, headings } = await compileMdx(parsed.body, filePath);

    return { meta, Content, headings, sourcePath: filePath };
}

export interface CompileResult {
    compiled: BuiltContent[];
    failed: { file: string; error: unknown }[];
}

/**
 * Compiles every source file with bounded concurrency, preserving input order
 * and collecting failures rather than aborting on the first error.
 */
export async function compilePages(
    sourceFiles: string[],
): Promise<CompileResult> {
    const results: PromiseSettledResult<BuiltContent>[] = new Array(
        sourceFiles.length,
    );
    const concurrency = Math.min(sourceFiles.length, 4, availableParallelism());
    let nextIndex = 0;

    async function worker(): Promise<void> {
        while (nextIndex < sourceFiles.length) {
            const currentIndex = nextIndex;
            nextIndex += 1;

            try {
                results[currentIndex] = {
                    status: "fulfilled",
                    value: await buildContent(sourceFiles[currentIndex]),
                };
            } catch (error) {
                results[currentIndex] = {
                    status: "rejected",
                    reason: error,
                };
            }
        }
    }

    await Promise.all(Array.from({ length: concurrency }, () => worker()));

    const compiled: BuiltContent[] = [];
    const failed: { file: string; error: unknown }[] = [];
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === "fulfilled") {
            compiled.push(result.value);
        } else {
            failed.push({ file: sourceFiles[i], error: result.reason });
        }
    }
    return { compiled, failed };
}
