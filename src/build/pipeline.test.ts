import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
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
});
