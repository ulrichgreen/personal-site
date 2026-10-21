import { useRenderContext } from "../../context/render-context.tsx";

const links = [
    { href: "/index.html", label: "Home" },
    { href: "/#articles", label: "Articles" },
    { href: "/cv.html", label: "CV" },
    { href: "/colophon.html", label: "Colophon" },
];

// "page" marks the link to this very page. An article is not the
// Articles link itself, but it lives there, so that link gets "true".
function currentFor(href: string, pagePath: string) {
    if (href === pagePath) return "page";
    if (href === "/#articles" && pagePath.startsWith("/articles/")) return "true";
    return undefined;
}

export function SiteHeader({ pagePath }: { pagePath: string }) {
    const { frontPageOnly } = useRenderContext();
    return (
        <header>
            <nav aria-label="Primary">
                <a href="/index.html" className="logo">
                    ulrich.green
                </a>
                {!frontPageOnly &&
                    links.map(({ href, label }) => (
                        <a href={href} aria-current={currentFor(href, pagePath)}>
                            {label}
                        </a>
                    ))}
            </nav>
        </header>
    );
}
