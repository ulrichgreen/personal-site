import { buildFeed } from "./feed.ts";
import { buildHeaders } from "./headers.ts";
import { buildOgImage } from "./og-image.ts";
import { buildRobots } from "./robots.ts";
import { buildSitemap } from "./sitemap.ts";
import type { ArtifactContext } from "./context.ts";
import type { BuiltContent, ArticleIndexEntry } from "../../types/content.ts";

export interface AncillaryBuildSummary {
    feedEntries: number;
}

export async function buildAncillary(
    articleIndex: ArticleIndexEntry[],
    compiledArticles: BuiltContent[],
): Promise<AncillaryBuildSummary> {
    const context: ArtifactContext = { articleIndex, compiledArticles };
    buildSitemap(context);
    buildRobots(context);
    buildHeaders(context);
    buildOgImage(context);
    const feedEntries = await buildFeed(context);
    return { feedEntries };
}
