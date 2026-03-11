import { PageHeader } from "../components/page-header.tsx";
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
                <a className="skip-link" href="#main-content">
                    Skip to content
                </a>
                <PageHeader section={section} title={title} />
                <main id="main-content" className="page">
                    {children}
                </main>
                <script src="/site.js" defer></script>
                <script src="/islands.js" defer></script>
            </body>
        </html>
    );
}
