export function SiteHeader() {
    return (
        <header>
            <nav aria-label="Primary">
                <a href="/index.html">Home</a>
                <a href="/#articles">Articles</a>
                <a
                    href="/index.html"
                    className="logo"
                    aria-label="ulrich.green — home"
                >
                    <span aria-hidden="true">{"{"}</span>
                    <span>
                        u<i>lrich.green</i>
                    </span>
                    <span aria-hidden="true">{"}"}</span>
                </a>
                <a href="/cv.html">CV</a>
                <a href="/colophon.html">Colophon</a>
            </nav>
        </header>
    );
}
