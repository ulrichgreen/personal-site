import { SiteHeader } from "../components/site-header/site-header.tsx";
import { SiteFooter } from "../components/site-footer/site-footer.tsx";
import { SiteHead } from "../components/site-head.tsx";
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
    mainClassName?: string;
    seriesName?: string;
    children?: ReactNode;
}

function IslandsScript({
    assetManifest,
    hasIslands,
}: Pick<BaseLayoutProps, "assetManifest" | "hasIslands">) {
    if (!hasIslands()) return null;
    return <script src={`/${assetManifest["islands.js"]}`} defer />;
}

export default function BaseLayout({
    meta,
    pagePath,
    assetManifest,
    hasIslands,
    mainClassName = "page",
    seriesName,
    children,
}: BaseLayoutProps) {
    return (
        <html lang="en">
            <SiteHead
                title={meta.title}
                description={meta.description}
                pagePath={pagePath}
                published={meta.published}
                revised={meta.revised}
                cssHref={`/${assetManifest["style.css"]}`}
                seriesName={seriesName}
            />
            <body>
                <div id="progress" aria-hidden="true"></div>
                <a className="skip-link" href="#main-content">
                    <span className="body-sm">Skip to content</span>
                </a>
                <SiteHeader />
                <main id="main-content" className={mainClassName}>
                    {children}
                    <SiteFooter />
                </main>
                <script src={`/${assetManifest["site.js"]}`} defer></script>
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
