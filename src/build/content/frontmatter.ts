import matter from "gray-matter";
import { createInterface } from "node:readline";
import { z } from "zod";
import type { PageMeta, FrontmatterPayload } from "../../types/content.ts";

const yamlDateString = z.preprocess(
    (value) =>
        value instanceof Date ? value.toISOString().slice(0, 10) : value,
    z.string().trim().min(1),
);

const revisionSchema = z.object({
    date: yamlDateString,
    note: z.string().trim().min(1),
});

const contentMetaSchema = z
    .object({
        title: z.string().trim().min(1, "title is required"),
        description: z.string().trim().min(1).optional(),
        layout: z.enum(["article", "base"]).optional(),
        section: z.string().trim().min(1).optional(),
        published: yamlDateString.optional(),
        revised: yamlDateString.optional(),
        draft: z.boolean().optional(),
        words: z
            .union([z.number().positive(), z.string().trim().min(1)])
            .optional(),
        note: z.string().trim().min(1).optional(),
        series: z.string().trim().min(1).optional(),
        seriesOrder: z.number().int().positive().optional(),
        revisions: z.array(revisionSchema).optional(),
    })
    .superRefine((data, ctx) => {
        // `series` and `seriesOrder` are meaningless apart; require both or neither.
        if (data.series && data.seriesOrder === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["seriesOrder"],
                message: "seriesOrder is required when series is set",
            });
        }
        if (data.seriesOrder !== undefined && !data.series) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["series"],
                message: "series is required when seriesOrder is set",
            });
        }
        // Edit dates cannot predate publication (ISO yyyy-mm-dd sorts lexically).
        if (data.published && data.revised && data.revised < data.published) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["revised"],
                message: "revised cannot be earlier than published",
            });
        }
        if (data.published && data.revisions) {
            for (const [index, revision] of data.revisions.entries()) {
                if (revision.date < data.published) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["revisions", index, "date"],
                        message: "revision date cannot be earlier than published",
                    });
                }
            }
        }
    });

const ARTICLE_PATH_PATTERN = /(^|\/)articles\/[^/]+\.mdx$/;

/**
 * Articles live under `content/articles/`, so a file in that directory is an
 * article by default. Authors only need to write `layout` to override this.
 */
function resolveLayout(
    explicit: "article" | "base" | undefined,
    filePath: string,
): "article" | "base" {
    if (explicit) return explicit;
    return ARTICLE_PATH_PATTERN.test(filePath) ? "article" : "base";
}

function formatFrontmatterError(filePath: string, error: z.ZodError): Error {
    const details = error.issues
        .map((issue) => {
            const path =
                issue.path.length > 0 ? issue.path.join(".") : "frontmatter";
            return `- ${path}: ${issue.message}`;
        })
        .join("\n");

    return new Error(`${filePath}: invalid frontmatter\n${details}`);
}

export function parseFrontmatter(
    raw: string,
    filePath = "frontmatter",
): FrontmatterPayload {
    if (!raw.trim()) {
        throw new Error("frontmatter.ts: input is empty");
    }

    const { data, content } = matter(raw);
    const meta = contentMetaSchema.safeParse(data);

    if (!meta.success) {
        throw formatFrontmatterError(filePath, meta.error);
    }

    const validated = meta.data;
    const layout = resolveLayout(validated.layout, filePath);

    if (layout === "article" && !validated.published) {
        throw new Error(
            `${filePath}: invalid frontmatter\n- published: published is required when layout is article`,
        );
    }

    const typedMeta: PageMeta =
        layout === "article"
            ? {
                title: validated.title,
                layout: "article" as const,
                description: validated.description,
                section: validated.section,
                published: validated.published!,
                revised: validated.revised,
                draft: validated.draft,
                words: validated.words,
                note: validated.note,
                revisions: validated.revisions,
                series: validated.series,
                seriesOrder: validated.seriesOrder,
            }
            : {
                title: validated.title,
                layout: "base" as const,
                description: validated.description,
                section: validated.section,
                published: validated.published,
                revised: validated.revised,
                words: validated.words,
            };

    return {
        meta: typedMeta,
        body: content,
    };
}

function main() {
    const chunks: string[] = [];
    const rl = createInterface({ input: process.stdin, terminal: false });

    rl.on("line", (line) => chunks.push(line));
    rl.on("close", () => {
        try {
            process.stdout.write(
                JSON.stringify(parseFrontmatter(chunks.join("\n"))),
            );
        } catch (error) {
            process.stderr.write(`${String(error)}\n`);
            process.exit(1);
        }
    });
}

if (
    process.argv[1] &&
    new URL(process.argv[1], "file:").href === import.meta.url
) {
    main();
}
