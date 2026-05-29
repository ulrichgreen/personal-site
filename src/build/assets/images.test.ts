import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import sharp from "sharp";
import { processImage } from "./images.ts";

describe("processImage", () => {
    let dir: string;
    let srcDir: string;
    let destDir: string;

    before(() => {
        dir = mkdtempSync(join(tmpdir(), "images-"));
        srcDir = join(dir, "src");
        destDir = join(dir, "dist");
        mkdirSync(srcDir, { recursive: true });
        mkdirSync(destDir, { recursive: true });
    });

    after(() => {
        rmSync(dir, { recursive: true, force: true });
    });

    async function writePng(name: string, width: number, height: number) {
        const path = join(srcDir, name);
        await sharp({
            create: {
                width,
                height,
                channels: 3,
                background: { r: 180, g: 90, b: 50 },
            },
        })
            .png()
            .toFile(path);
        return path;
    }

    it("derives webp + avif variants from a raster source", async () => {
        const source = await writePng("small.png", 400, 200);
        const result = await processImage(source, destDir);

        // original + webp + avif (no small variant under 640px wide)
        assert.equal(result.outputs.length, 3);
        assert.ok(existsSync(join(destDir, "small.png")));
        assert.ok(existsSync(join(destDir, "small.webp")));
        assert.ok(existsSync(join(destDir, "small.avif")));
    });

    it("adds half-width variants when the source is wider than 640px", async () => {
        const source = await writePng("wide.png", 800, 200);
        const result = await processImage(source, destDir);

        // original + webp + avif + small webp + small avif
        assert.equal(result.outputs.length, 5);
        assert.ok(existsSync(join(destDir, "wide.png")));
        assert.ok(existsSync(join(destDir, "wide.webp")));
        assert.ok(existsSync(join(destDir, "wide.avif")));
        assert.ok(existsSync(join(destDir, "wide-400w.webp")));
        assert.ok(existsSync(join(destDir, "wide-400w.avif")));
    });

    it("passes non-raster sources through untouched", async () => {
        const source = join(srcDir, "diagram.svg");
        writeFileSync(
            source,
            '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>',
        );
        const result = await processImage(source, destDir);

        // only the original is copied, no derivatives
        assert.equal(result.outputs.length, 1);
        assert.equal(basename(result.outputs[0]), "diagram.svg");
        assert.ok(existsSync(join(destDir, "diagram.svg")));
        assert.ok(!existsSync(join(destDir, "diagram.webp")));
        assert.ok(!existsSync(join(destDir, "diagram.avif")));
    });
});
