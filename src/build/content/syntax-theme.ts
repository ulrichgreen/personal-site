/**
 * Shiki theme for syntax highlighting. Colors are emitted as CSS custom
 * properties (`--c*`) so the rendered tokens follow the site's light/dark
 * theme without re-highlighting. See `src/styles/code.css` for the values.
 */
export const CODE_THEME = {
    name: "site-code",
    settings: [
        {
            settings: {
                foreground: "var(--ct)",
            },
        },
        {
            scope: ["comment", "punctuation.definition.comment"],
            settings: {
                foreground: "var(--cc)",
                fontStyle: "italic",
            },
        },
        {
            scope: [
                "keyword",
                "storage",
                "storage.type",
                "keyword.control",
                "keyword.operator",
            ],
            settings: {
                foreground: "var(--ck)",
            },
        },
        {
            scope: [
                "entity.name.function",
                "support.function",
                "meta.function-call",
            ],
            settings: {
                foreground: "var(--cf)",
            },
        },
        {
            scope: ["string", "string.quoted", "string.template"],
            settings: {
                foreground: "var(--cs)",
            },
        },
        {
            scope: [
                "constant.numeric",
                "constant.language",
                "constant.character.escape",
            ],
            settings: {
                foreground: "var(--cn)",
            },
        },
        {
            scope: ["variable", "variable.parameter", "identifier"],
            settings: {
                foreground: "var(--cv)",
            },
        },
        {
            scope: ["entity.name.type", "support.type", "entity.name.class"],
            settings: {
                foreground: "var(--cy)",
            },
        },
        {
            scope: ["entity.name.tag", "support.class.component"],
            settings: {
                foreground: "var(--cg)",
            },
        },
        {
            scope: ["entity.other.attribute-name"],
            settings: {
                foreground: "var(--ca)",
            },
        },
        {
            scope: ["punctuation", "meta.brace", "meta.delimiter"],
            settings: {
                foreground: "var(--cp)",
            },
        },
    ],
};
