import { buildFeed } from "./feed.ts";
import { buildHeaders } from "./headers.ts";
import { buildOgImage } from "./og-image.ts";
import { buildRobots } from "./robots.ts";
import { buildSitemap } from "./sitemap.ts";
import { isArticlePage } from "../content/article-index.ts";
import type { ArtifactContext } from "./context.ts";
import type { BuiltContent, ArticleIndexEntry } from "../../types/content.ts";

export interface AncillaryBuildSummary {
    feedEntries: number;
}

export async function buildAncillary(
    articleIndex: ArticleIndexEntry[],
    compiledPages: BuiltContent[],
): Promise<AncillaryBuildSummary> {
    const context: ArtifactContext = {
        articleIndex,
        compiledPages,
        compiledArticles: compiledPages.filter(isArticlePage),
    };
    buildSitemap(context);
    buildRobots(context);
    buildHeaders(context);
    buildOgImage(context);
    const feedEntries = await buildFeed(context);
    return { feedEntries };
}
