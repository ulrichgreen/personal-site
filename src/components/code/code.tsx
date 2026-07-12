import type { ReactNode } from "preact/compat";
import { formatCodeLanguage } from "../../format-code-language.ts";

interface CodeProps {
    children?: ReactNode;
    language?: string;
    title?: string;
}

/**
 * Authored code block. Renders the same figure shape the build pipeline
 * produces for fenced code: a figcaption toolbar (optional title, language
 * label, copy button), then the pre. The copy button ships disabled and is
 * enabled by the enhancement script.
 */
export function Code({ children, language, title }: CodeProps) {
    return (
        <figure data-language={language} data-rehype-pretty-code-figure="">
            <figcaption>
                {title && <span>{title}</span>}
                <span>{formatCodeLanguage(language)}</span>
                <button
                    type="button"
                    aria-label={`Copy ${language || "text"} code to clipboard`}
                    disabled
                >
                    Copy
                </button>
            </figcaption>
            <pre>
                <code>{children}</code>
            </pre>
        </figure>
    );
}
