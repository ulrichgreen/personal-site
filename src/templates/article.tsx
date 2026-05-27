import {
    ArticleHeader,
    getArticleTitleTransitionName,
} from "../components/article-header/article-header.tsx";
import { PageHeader } from "../components/page-header/page-header.tsx";
import { RevisionHistory } from "../components/revision-history/revision-history.tsx";
import { SeriesNav } from "../components/series-nav/series-nav.tsx";
import BaseLayout from "./base.tsx";
import type { ReactNode } from "preact/compat";
import type { AssetManifest } from "../build/assets/asset-manifest.ts";
import type { ArticlePageMeta, SeriesInfo } from "../types/content.ts";

interface ArticleLayoutProps {
    meta: ArticlePageMeta;
    pagePath: string;
    assetManifest: AssetManifest;
    hasIslands: () => boolean;
    seriesInfo?: SeriesInfo;
    children?: ReactNode;
}

export default function ArticleLayout({
    meta,
    pagePath,
    assetManifest,
    hasIslands,
    seriesInfo,
    children,
}: ArticleLayoutProps) {
    return (
        <BaseLayout
            meta={meta}
            pagePath={pagePath}
            assetManifest={assetManifest}
            hasIslands={hasIslands}
            mainClassName="page page--article"
            seriesName={seriesInfo?.name}
        >
            <PageHeader title={meta.title} section={meta.section} />
            <article>
                <ArticleHeader
                    title={meta.title}
                    description={meta.description}
                    section={meta.section}
                    kickerType={
                        seriesInfo
                            ? `Part ${seriesInfo.currentOrder}`
                            : "Article"
                    }
                    published={meta.published}
                    revised={meta.revised}
                    words={meta.words}
                    readingTime={meta.readingTime}
                    note={meta.note}
                    titleTransitionName={getArticleTitleTransitionName(
                        pagePath,
                    )}
                    seriesName={seriesInfo?.name}
                />
                <div className="section article-body">{children}</div>
                {meta.revisions && meta.revisions.length > 0 && (
                    <RevisionHistory revisions={meta.revisions} />
                )}
                {seriesInfo && <SeriesNav seriesInfo={seriesInfo} />}
                <footer className="section article-footer label">
                    <a href="/index.html">← All articles</a>
                </footer>
            </article>
        </BaseLayout>
    );
}
