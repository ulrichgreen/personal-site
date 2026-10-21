import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import zlib from "node:zlib";
import { chooseEncoding, createCloudflareHandler } from "./serve-cloudflare.ts";

const directory = mkdtempSync(join(tmpdir(), "cloudflare-serve-"));
writeFileSync(join(directory, "index.html"), "<h1>home</h1>".repeat(50));
writeFileSync(join(directory, "404.html"), "<h1>missing</h1>");
writeFileSync(join(directory, "style.css"), "body{color:red}".repeat(50));
writeFileSync(join(directory, "_redirects"), "/ /index.html 200\n/old.html /index.html 301\n");
writeFileSync(join(directory, "_headers"), "/*.css\n  Cache-Control: public, max-age=31536000, immutable\n");
mkdirSync(join(directory, "articles"));
writeFileSync(join(directory, "articles/index.html"), "articles");
const handle = createCloudflareHandler({ directory });
const get = (url: string, headers = {}) => handle("GET", url, headers);

after(() => rmSync(directory, { recursive: true, force: true }));

describe("Cloudflare-like serving", () => {
    it("rewrites the root to index.html through _redirects", () => {
        const response = get("/");
        assert.equal(response.status, 200);
        assert.equal(response.headers["content-type"], "text/html");
        assert.equal(response.headers["cache-control"], "public, max-age=0, must-revalidate");
    });

    it("serves only exact paths, with the 404 page for anything else", () => {
        for (const url of ["/index", "/articles/", "/articles", "/_headers", "/_redirects"]) {
            const response = get(url);
            assert.equal(response.status, 404, url);
            assert.equal(response.body.toString(), "<h1>missing</h1>");
        }
        assert.equal(get("/articles/index.html").status, 200);
    });

    it("follows _redirects and collapses repeated slashes", () => {
        assert.equal(get("/old.html").headers.location, "/index.html");
        assert.equal(get("/old.html").status, 301);
        assert.equal(get("//index.html?a=1").status, 307);
        assert.equal(get("//index.html?a=1").headers.location, "/index.html?a=1");
    });

    it("applies _headers by path", () => {
        assert.equal(get("/style.css").headers["cache-control"], "public, max-age=31536000, immutable");
    });

    it("compresses text with the best encoding offered", () => {
        assert.equal(chooseEncoding("gzip, deflate, br, zstd"), "zstd");
        assert.equal(chooseEncoding("gzip, br"), "br");
        assert.equal(chooseEncoding("gzip, br;q=0"), "gzip");
        assert.equal(chooseEncoding(undefined), undefined);

        const response = get("/style.css", { "accept-encoding": "br" });
        assert.equal(response.headers["content-encoding"], "br");
        assert.equal(zlib.brotliDecompressSync(response.body).toString(), "body{color:red}".repeat(50));
        assert.match(response.headers.etag, /^W\/"[0-9a-f]{32}"$/);
        assert.equal(get("/style.css").headers["content-encoding"], undefined);
    });

    it("answers a matching If-None-Match with 304", () => {
        const { etag } = get("/style.css").headers;
        assert.match(etag, /^"[0-9a-f]{32}"$/);
        assert.equal(get("/style.css", { "if-none-match": etag }).status, 304);
        assert.equal(get("/style.css", { "if-none-match": `W/${etag}` }).status, 304);
        assert.equal(get("/", {}).headers.etag, undefined);
    });

    it("runs transformHtml on pages only", () => {
        const withScript = createCloudflareHandler({
            directory,
            transformHtml: (html) => `${html}<script></script>`,
        });
        assert.match(withScript("GET", "/", {}).body.toString(), /<script><\/script>$/);
        assert.doesNotMatch(withScript("GET", "/style.css", {}).body.toString(), /script/);
    });

    it("rejects traversal", () => {
        assert.equal(get("/%2e%2e/package.json").status, 400);
        assert.equal(get("/%E0%A4%A").status, 400);
    });
});
