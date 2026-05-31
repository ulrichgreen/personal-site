import { createContext, useContext } from "preact/compat";
import type { ContentHeading } from "../types/content.ts";
import type { RegisterIslandInput } from "../types/islands.ts";

export interface RenderContextValue {
    headings: ContentHeading[];
    registerIsland: (entry: RegisterIslandInput) => string;
    hasIslands: () => boolean;
}

function missingContext(): never {
    throw new Error("Render context is not available for this component.");
}

export const RenderContext = createContext<RenderContextValue>({
    headings: [],
    registerIsland: missingContext,
    hasIslands: () => false,
});

export function useRenderContext(): RenderContextValue {
    return useContext(RenderContext);
}
