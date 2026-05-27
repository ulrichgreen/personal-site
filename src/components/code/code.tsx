import type { ReactNode } from "preact/compat";
import { formatCodeLanguage } from "../../format-code-language.ts";

interface CodeProps {
    children?: ReactNode;
    language?: string;
    title?: string;
}

export function Code({ children, language, title }: CodeProps) {
    return (
        <figure
            className="code-block"
            data-language={language}
            data-rehype-pretty-code-figure=""
        >
            <div className="code-block__toolbar">
                {title && <span className="code-block__title">{title}</span>}
                <span className="code-block__language">
                    {formatCodeLanguage(language)}
                </span>
                <button
                    className="code-block__copy"
                    type="button"
                    aria-label={`Copy ${language || "text"} code to clipboard`}
                    disabled
                >
                    Copy
                </button>
            </div>
            <pre>
                <code>{children}</code>
            </pre>
        </figure>
    );
}
