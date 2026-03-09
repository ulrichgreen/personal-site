import { RunningHeader } from "../components/running-header.tsx";
import { SiteHead } from "../components/site-head.tsx";
import type { BaseLayoutProps } from "../types/content.ts";

export default function BaseLayout({
    title,
    description,
    section = "",
    children,
}: BaseLayoutProps) {
    return (
        <html lang="en">
            <SiteHead title={title} description={description} />
            <body>
                <RunningHeader section={section} title={title} />
                <main className="page page-arrival">{children}</main>
                <script src="/site.js" defer></script>
                <script src="/islands.js" defer></script>
            </body>
        </html>
    );
}
