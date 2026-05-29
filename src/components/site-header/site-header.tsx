export function SiteHeader() {
    return (
        <header className="site-header full-bleed">
            <nav className="site-nav label" aria-label="Primary">
                <div className="nav-links">
                    <a href="/index.html">Home</a>
                    <a href="/#articles">Articles</a>
                </div>
                <a
                    href="/index.html"
                    className="logo mono body-sm"
                    aria-label="ulrich.green — home"
                >
                    <span aria-hidden="true">{"{"}</span>
                    <span>
                        u<span className="logo-rest">lrich.green</span>
                    </span>
                    <span aria-hidden="true">{"}"}</span>
                </a>
                <div className="nav-links nav-links-end">
                    <a href="/cv.html">CV</a>
                    <a href="/colophon.html">Colophon</a>
                </div>
            </nav>
        </header>
    );
}
