import { SiteHeader } from "../components/site-header/site-header.tsx";
import { SiteFooter } from "../components/site-footer/site-footer.tsx";
import { SiteHead } from "../components/site-head.tsx";
import { useRenderContext } from "../context/render-context.tsx";
import type { ReactNode } from "preact/compat";
import type { AssetManifest } from "../build/assets/asset-manifest.ts";
import type { PageMeta } from "../types/content.ts";

const speculationRules = JSON.stringify({
    prerender: [{ where: { href_matches: "/*" }, eagerness: "moderate" }],
});

interface BaseLayoutProps {
    meta: PageMeta;
    pagePath: string;
    assetManifest: AssetManifest;
    hasIslands: () => boolean;
    seriesName?: string;
    children?: ReactNode;
}

// hasIslands() is only accurate because this renders AFTER {children} in the
// same synchronous render pass. Keep IslandsScript below <main>; moving it
// earlier (e.g. into <head>) would silently stop shipping islands.js.
function IslandsScript({
    assetManifest,
    hasIslands,
}: Pick<BaseLayoutProps, "assetManifest" | "hasIslands">) {
    if (!hasIslands()) return null;
    return <script type="module" src={`/${assetManifest["islands.js"]}`} />;
}

export default function BaseLayout({
    meta,
    pagePath,
    assetManifest,
    hasIslands,
    seriesName,
    children,
}: BaseLayoutProps) {
    const { hasCodeBlocks } = useRenderContext();
    return (
        <html lang="en">
            <SiteHead
                title={meta.title}
                description={meta.description}
                pagePath={pagePath}
                published={meta.published}
                revised={meta.revised}
                seriesName={seriesName}
            />
            <body>
                <a className="skip-link" href="#main-content">
                    Skip to content
                </a>
                <SiteHeader pagePath={pagePath} />
                <main id="main-content">
                    {children}
                    <SiteFooter />
                </main>
                {hasCodeBlocks && (
                    <script src={`/${assetManifest["site.js"]}`} defer></script>
                )}
                <IslandsScript
                    assetManifest={assetManifest}
                    hasIslands={hasIslands}
                />
                <script
                    type="speculationrules"
                    dangerouslySetInnerHTML={{ __html: speculationRules }}
                />
            </body>
        </html>
    );
}
