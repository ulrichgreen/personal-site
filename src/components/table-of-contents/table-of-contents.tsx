import { useRenderContext } from "../../context/render-context.tsx";

export function TableOfContents() {
    const { headings } = useRenderContext();
    if (headings.length === 0) {
        return null;
    }

    return (
        <aside className="toc">
            {/* The inner div is the sticky box when the toc sits in the rail. */}
            <div>
                <p>On this page</p>
                <nav aria-label="Table of contents">
                    <ol>
                        {headings.map((heading) => (
                            <li key={heading.id} data-level={heading.level}>
                                <a href={`#${heading.id}`}>{heading.text}</a>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </aside>
    );
}
