import { createContext, useContext } from "preact/compat";
import type { ArticleIndexEntry, ContentHeading } from "../types/content.ts";
import type { RegisterIslandInput } from "../types/islands.ts";

export interface RenderContextValue {
    articleIndex: ArticleIndexEntry[];
    headings: ContentHeading[];
    registerIsland: (entry: RegisterIslandInput) => string;
    hasIslands: () => boolean;
}

function missingContext(): never {
    throw new Error("Render context is not available for this component.");
}

export const RenderContext = createContext<RenderContextValue>({
    articleIndex: [],
    headings: [],
    registerIsland: missingContext,
    hasIslands: () => false,
});

export function useRenderContext(): RenderContextValue {
    return useContext(RenderContext);
}
