export function PageHeader({
    section = "",
    title = "",
}: {
    section?: string;
    title?: string;
}) {
    return (
        <header className="page-header">
            <div className="page-header__title">
                <span>ULRICH</span> /{" "}
                <span className="page-header__section">
                    {section || "home"}
                </span>{" "}
                / <span>{title}</span>
            </div>
            <nav className="page-header__nav" aria-label="Primary">
                <a href="/index.html">Home</a>
                <a href="/cv.html">CV</a>
                <a href="/colophon.html">Colophon</a>
            </nav>
        </header>
    );
}
