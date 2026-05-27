
interface PageHeaderProps {
    title?: string;
    section?: string;
}

export function PageHeader({ title, section }: PageHeaderProps) {
    return (
        <div className="page-header">
            {section && (
                <span className="page-header__section label">{section}</span>
            )}
            <span className="page-header__title body-sm">{title}</span>
            <nav className="page-header__nav body-sm" aria-label="Article">
                <a href="/index.html">← All articles</a>
            </nav>
        </div>
    );
}
