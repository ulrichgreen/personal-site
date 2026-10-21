import { createContext, useContext } from "preact/compat";
import type { ContentHeading } from "../types/content.ts";
import type { RegisterIslandInput } from "../types/islands.ts";

export interface RenderContextValue {
    headings: ContentHeading[];
    /** Only pages with code blocks load site.js, which runs their copy buttons. */
    hasCodeBlocks: boolean;
    registerIsland: (entry: RegisterIslandInput) => string;
    hasIslands: () => boolean;
    /** Only the front page is published, so nothing may link to the other pages. */
    frontPageOnly: boolean;
}

function missingContext(): never {
    throw new Error("Render context is not available for this component.");
}

export const RenderContext = createContext<RenderContextValue>({
    headings: [],
    hasCodeBlocks: false,
    registerIsland: missingContext,
    hasIslands: () => false,
    frontPageOnly: false,
});

export function useRenderContext(): RenderContextValue {
    return useContext(RenderContext);
}
