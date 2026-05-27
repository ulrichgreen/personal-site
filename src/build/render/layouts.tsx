import type { ReactNode } from "preact/compat";
import ArticleLayout from "../../templates/article.tsx";
import BaseLayout from "../../templates/base.tsx";
import type { AssetManifest } from "../assets/asset-manifest.ts";
import type { PageMeta, SeriesInfo } from "../../types/content.ts";

export function renderLayout(
    meta: PageMeta,
    pagePath: string,
    children: ReactNode,
    assetManifest: AssetManifest,
    hasIslands: () => boolean,
    seriesInfo?: SeriesInfo,
): ReactNode {
    if (meta.layout === "article") {
        return (
            <ArticleLayout
                meta={meta}
                pagePath={pagePath}
                assetManifest={assetManifest}
                hasIslands={hasIslands}
                seriesInfo={seriesInfo}
            >
                {children}
            </ArticleLayout>
        );
    }
    return (
        <BaseLayout
            meta={meta}
            pagePath={pagePath}
            assetManifest={assetManifest}
            hasIslands={hasIslands}
        >
            {children}
        </BaseLayout>
    );
}
