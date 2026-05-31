import type { ArticleIndexEntry, BuiltContent } from "../../types/content.ts";

/**
 * The data every ancillary artifact (feed, sitemap, robots, headers, og-image)
 * is built from. Each `build*` artifact takes this same context so the
 * orchestrator in `ancillary.ts` can run them through one uniform interface and
 * adding a new artifact is mechanical.
 */
export interface ArtifactContext {
    articleIndex: ArticleIndexEntry[];
    compiledArticles: BuiltContent[];
}

export type Artifact = (context: ArtifactContext) => void | Promise<unknown>;
