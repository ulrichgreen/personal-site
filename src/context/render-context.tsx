import { createContext, useContext } from "preact/compat";
import type { ContentHeading } from "../types/content.ts";
import type { RegisterIslandInput } from "../types/islands.ts";

export interface RenderContextValue {
    headings: ContentHeading[];
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
    registerIsland: missingContext,
    hasIslands: () => false,
    frontPageOnly: false,
});

export function useRenderContext(): RenderContextValue {
    return useContext(RenderContext);
}
