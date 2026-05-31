import { createElement } from "preact/compat";
import { renderToStaticMarkup } from "preact-render-to-string";
import { getContentComponents } from "../../content-components.tsx";
import type { BuiltContent, SeriesInfo, ArticleIndexEntry } from "../../types/content.ts";
import type { RegisterIslandInput } from "../../types/islands.ts";
import { devAssetManifest, type AssetManifest } from "../assets/asset-manifest.ts";
import { urlPathFromSource } from "../shared/paths.ts";
import { renderLayout } from "./layouts.tsx";
import {
    RenderContext,
    type RenderContextValue,
} from "../../context/render-context.tsx";

export type IslandUsage = Record<string, number>;

export interface RenderedPage {
    html: string;
    islands: IslandUsage;
}

function createRenderContext(content: BuiltContent): {
    context: RenderContextValue;
    hasIslands: () => boolean;
    getIslandUsage: () => IslandUsage;
} {
    const islands = new Map<string, number>();
    const registerIsland = ({ name }: RegisterIslandInput): string => {
        const count = (islands.get(name) ?? 0) + 1;
        islands.set(name, count);
        return `${name.toLowerCase()}-${count}`;
    };
    const hasIslands = () => islands.size > 0;
    const getIslandUsage = () =>
        Object.fromEntries(islands.entries()) as IslandUsage;
    return {
        context: {
            headings: content.headings,
            registerIsland,
            hasIslands,
        },
        hasIslands,
        getIslandUsage,
    };
}

export function renderContentBody(
    content: BuiltContent,
    articleIndex: ArticleIndexEntry[],
): string {
    const { context } = createRenderContext(content);
    const body = createElement(content.Content, {
        components: getContentComponents(articleIndex),
    });
    return renderToStaticMarkup(
        createElement(RenderContext.Provider, { value: context }, body),
    );
}

export function renderPage(
    content: BuiltContent,
    articleIndex: ArticleIndexEntry[],
    assetManifest: AssetManifest = devAssetManifest,
    seriesInfo?: SeriesInfo,
): string {
    return renderPageWithMetadata(
        content,
        articleIndex,
        assetManifest,
        seriesInfo,
    ).html;
}

export function renderPageWithMetadata(
    content: BuiltContent,
    articleIndex: ArticleIndexEntry[],
    assetManifest: AssetManifest = devAssetManifest,
    seriesInfo?: SeriesInfo,
): RenderedPage {
    const { context, hasIslands, getIslandUsage } = createRenderContext(
        content,
    );

    const pagePath = urlPathFromSource(content.sourcePath);

    const body = createElement(content.Content, {
        components: getContentComponents(articleIndex),
    });

    const page = renderLayout(
        content.meta,
        pagePath,
        body,
        assetManifest,
        hasIslands,
        seriesInfo,
    );

    return {
        html: `<!doctype html>\n${renderToStaticMarkup(
            <RenderContext.Provider value={context}>{page}</RenderContext.Provider>,
        )}`,
        islands: getIslandUsage(),
    };
}
