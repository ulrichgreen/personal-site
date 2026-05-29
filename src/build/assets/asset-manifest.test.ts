import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
    existsSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
    applyHashedFilenames,
    contentHash,
    devAssetManifest,
    generateAssetManifest,
} from "./asset-manifest.ts";

describe("contentHash", () => {
    let dir: string;

    before(() => {
        dir = mkdtempSync(join(tmpdir(), "asset-hash-"));
    });

    after(() => {
        rmSync(dir, { recursive: true, force: true });
    });

    it("returns the first 8 hex characters of the sha256 digest", () => {
        const file = join(dir, "content.txt");
        const body = "it's just text files";
        writeFileSync(file, body);

        const expected = createHash("sha256")
            .update(body)
            .digest("hex")
            .slice(0, 8);

        const hash = contentHash(file);
        assert.equal(hash, expected);
        assert.match(hash, /^[0-9a-f]{8}$/);
    });

    it("hashes by content, so identical bytes hash identically", () => {
        const a = join(dir, "a.txt");
        const b = join(dir, "b.txt");
        writeFileSync(a, "same");
        writeFileSync(b, "same");
        assert.equal(contentHash(a), contentHash(b));
    });

    it("throws when the asset is missing", () => {
        assert.throws(
            () => contentHash(join(dir, "does-not-exist.css")),
            /Asset not found/,
        );
    });
});

describe("generateAssetManifest", () => {
    let dir: string;

    before(() => {
        dir = mkdtempSync(join(tmpdir(), "asset-manifest-"));
        writeFileSync(join(dir, "style.css"), "body{}");
        writeFileSync(join(dir, "site.js"), "console.log(1)");
        writeFileSync(join(dir, "islands.js"), "export default 0");
    });

    after(() => {
        rmSync(dir, { recursive: true, force: true });
    });

    it("produces hashed filenames that embed the content hash", () => {
        const manifest = generateAssetManifest(dir);

        assert.equal(
            manifest["style.css"],
            `style.${contentHash(join(dir, "style.css"))}.css`,
        );
        assert.equal(
            manifest["site.js"],
            `site.${contentHash(join(dir, "site.js"))}.js`,
        );
        assert.equal(
            manifest["islands.js"],
            `islands.${contentHash(join(dir, "islands.js"))}.js`,
        );
    });

    it("preserves the original extension", () => {
        const manifest = generateAssetManifest(dir);
        assert.match(manifest["style.css"], /^style\.[0-9a-f]{8}\.css$/);
        assert.match(manifest["site.js"], /^site\.[0-9a-f]{8}\.js$/);
        assert.match(manifest["islands.js"], /^islands\.[0-9a-f]{8}\.js$/);
    });
});

describe("applyHashedFilenames", () => {
    it("renames each original asset to its hashed name", () => {
        const dir = mkdtempSync(join(tmpdir(), "asset-rename-"));
        writeFileSync(join(dir, "style.css"), "body{}");
        writeFileSync(join(dir, "site.js"), "1");
        writeFileSync(join(dir, "islands.js"), "1");

        const manifest = generateAssetManifest(dir);
        applyHashedFilenames(manifest, dir);

        assert.ok(!existsSync(join(dir, "style.css")));
        assert.ok(existsSync(join(dir, manifest["style.css"])));
        assert.ok(existsSync(join(dir, manifest["site.js"])));
        assert.ok(existsSync(join(dir, manifest["islands.js"])));
        assert.equal(readFileSync(join(dir, manifest["style.css"]), "utf8"), "body{}");

        rmSync(dir, { recursive: true, force: true });
    });

    it("throws when an asset to rename is missing", () => {
        const dir = mkdtempSync(join(tmpdir(), "asset-rename-missing-"));
        const manifest = {
            "style.css": "style.deadbeef.css",
            "site.js": "site.deadbeef.js",
            "islands.js": "islands.deadbeef.js",
        };
        assert.throws(
            () => applyHashedFilenames(manifest, dir),
            /Cannot rename missing asset/,
        );
        rmSync(dir, { recursive: true, force: true });
    });
});

describe("devAssetManifest", () => {
    it("maps each asset to its unhashed name for the dev server", () => {
        assert.deepEqual(devAssetManifest, {
            "style.css": "style.css",
            "site.js": "site.js",
            "islands.js": "islands.js",
        });
    });
});
