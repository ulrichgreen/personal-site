import type { ReactNode } from "preact/compat";
import { useRenderContext } from "../../context/render-context.tsx";

/** Content that links into the rest of the site, left out while only the front page is published. */
export function FullSiteOnly({ children }: { children?: ReactNode }) {
    const { frontPageOnly } = useRenderContext();
    return frontPageOnly ? null : <>{children}</>;
}
