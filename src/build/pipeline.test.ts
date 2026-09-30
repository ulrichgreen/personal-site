import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { compilePages } from "./content/compile.ts";
import { selectRenderablePages } from "./pipeline.ts";

describe("selectRenderablePages", () => {
    it("drops draft articles in production builds but keeps them in dev", async () => {
        const directory = mkdtempSync(join(tmpdir(), "pipeline-"));
        try {
            const draftPath = join(directory, "draft-page.mdx");
            const publishedPath = join(directory, "published-page.mdx");
            writeFileSync(
                draftPath,
                '---\ntitle: Draft Page\nlayout: article\npublished: "2025-01-01"\ndraft: true\n---\nDraft body.\n',
            );
            writeFileSync(
                publishedPath,
                '---\ntitle: Published Page\nlayout: article\npublished: "2025-01-02"\n---\nPublished body.\n',
            );

            const { compiled, failed } = await compilePages([
                draftPath,
                publishedPath,
            ]);
            assert.equal(failed.length, 0);

            const production = selectRenderablePages(compiled, false);
            assert.deepEqual(
                production.map((page) => page.sourcePath),
                [publishedPath],
            );

            const dev = selectRenderablePages(compiled, true);
            assert.deepEqual(
                dev.map((page) => page.sourcePath),
                [draftPath, publishedPath],
            );
        } finally {
            rmSync(directory, { recursive: true, force: true });
        }
    });

    it("keeps only the front page and the 404 in a front-page-only production build", async () => {
        const root = mkdtempSync(join(tmpdir(), "pipeline-"));
        const directory = join(root, "content");
        try {
            mkdirSync(directory);
            const paths = ["index.mdx", "404.mdx", "cv.mdx"].map((file) => join(directory, file));
            for (const path of paths) {
                writeFileSync(path, "---\ntitle: Page\n---\nBody.\n");
            }

            const { compiled, failed } = await compilePages(paths);
            assert.equal(failed.length, 0);

            assert.deepEqual(
                selectRenderablePages(compiled, false, true).map((page) => page.sourcePath),
                paths.slice(0, 2),
            );
            assert.equal(selectRenderablePages(compiled, true, true).length, 3);
        } finally {
            rmSync(root, { recursive: true, force: true });
        }
    });
});
