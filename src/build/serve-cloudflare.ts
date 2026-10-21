import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import http from "node:http";
import { extname, posix, resolve, sep } from "node:path";
import zlib from "node:zlib";
import { distDirectory } from "./shared/paths.ts";

// `pnpm start` serves dist/ the way Cloudflare serves ulrich.green (wrangler.jsonc: Workers static
// assets, html_handling "none", not_found_handling "404-page"), as observed with curl against the
// live site:
// - a URL serves only the file with exactly that path: no clean URLs, no directory index files;
//   _redirects can rewrite (200) or redirect (301, 302, 303, 307, 308)
// - a miss serves the nearest 404.html with status 404
// - Cache-Control defaults to "public, max-age=0, must-revalidate", and _headers adds to it by path
// - zstd, brotli or gzip, whichever the browser offers first in that order, for text types
// - a strong ETag on non-HTML files, weakened when compressed, and 304 for If-None-Match
// - repeated slashes redirect (307) to the single-slash path
// - _headers and _redirects themselves are never served

const MIME: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".xml": "application/xml",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".txt": "text/plain",
};

const COMPRESSIBLE = new Set([
    "text/html",
    "text/css",
    "text/javascript",
    "text/plain",
    "application/json",
    "application/xml",
    "image/svg+xml",
]);

const DEFAULT_CACHE_CONTROL = "public, max-age=0, must-revalidate";
const HIDDEN_FILES = new Set(["/_headers", "/_redirects"]);

type Encoding = "zstd" | "br" | "gzip";

interface HeaderRule {
    pattern: RegExp;
    headers: [string, string][];
}

interface RedirectRule {
    from: string;
    to: string;
    status: number;
}

export interface CloudflareResponse {
    status: number;
    headers: Record<string, string>;
    body: Buffer;
}

function contentTypeFor(filePath: string): string {
    return MIME[extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

// Cloudflare's _headers: a path line, then indented "Name: value" lines. `*` matches anything.
export function parseHeaders(text: string): HeaderRule[] {
    const rules: HeaderRule[] = [];
    for (const line of text.split("\n")) {
        if (!line.trim() || line.trim().startsWith("#")) continue;
        if (!/^\s/.test(line)) {
            const source = line
                .trim()
                .split("*")
                .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
                .join(".*");
            rules.push({ pattern: new RegExp(`^${source}$`), headers: [] });
            continue;
        }
        const rule = rules.at(-1);
        const colon = line.indexOf(":");
        if (rule && colon > 0) {
            rule.headers.push([
                line.slice(0, colon).trim().toLowerCase(),
                line.slice(colon + 1).trim(),
            ]);
        }
    }
    return rules;
}

// Cloudflare's _redirects: "from to [status]", static paths only (all this site uses).
export function parseRedirects(text: string): RedirectRule[] {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
            const [from, to, status] = line.split(/\s+/);
            return { from, to, status: status ? Number(status) : 302 };
        });
}

export function chooseEncoding(acceptEncoding: string | undefined): Encoding | undefined {
    const offered = new Set(
        (acceptEncoding ?? "")
            .split(",")
            .map((part) => part.trim().split(";"))
            .filter(([, q]) => q?.trim() !== "q=0")
            .map(([name]) => name.trim().toLowerCase()),
    );
    return (["zstd", "br", "gzip"] as const).find((encoding) => offered.has(encoding));
}

function compress(body: Buffer, encoding: Encoding): Buffer {
    if (encoding === "zstd") return zlib.zstdCompressSync(body);
    if (encoding === "br") {
        return zlib.brotliCompressSync(body, {
            params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 },
        });
    }
    return zlib.gzipSync(body);
}

function readIfFile(path: string): Buffer | undefined {
    return existsSync(path) && statSync(path).isFile() ? readFileSync(path) : undefined;
}

function isInsideDirectory(candidate: string, directory: string): boolean {
    return candidate.startsWith(directory + sep);
}

export function createCloudflareHandler(directory = distDirectory) {
    const root = resolve(directory);
    const headerRules = parseHeaders(readIfFile(resolve(root, "_headers"))?.toString() ?? "");
    const redirectRules = parseRedirects(
        readIfFile(resolve(root, "_redirects"))?.toString() ?? "",
    );
    const compressed = new Map<string, Buffer>();

    function fileAt(pathname: string): string | undefined {
        if (HIDDEN_FILES.has(pathname)) return undefined;
        const filePath = resolve(root, `.${pathname}`);
        if (!isInsideDirectory(filePath, root)) return undefined;
        return existsSync(filePath) && statSync(filePath).isFile() ? filePath : undefined;
    }

    function nearestNotFoundPage(pathname: string): string | undefined {
        let current = posix.dirname(pathname);
        while (true) {
            const page = fileAt(posix.join(current, "404.html"));
            if (page) return page;
            if (current === "/") return undefined;
            current = posix.dirname(current);
        }
    }

    return function handle(
        method: string,
        requestUrl: string,
        requestHeaders: http.IncomingHttpHeaders,
    ): CloudflareResponse {
        let pathname: string;
        let search: string;
        try {
            // Read the path as sent: URL parsing would resolve ".." and take "//x" for a host
            const [rawPath] = requestUrl.split(/[?#]/, 1);
            pathname = decodeURIComponent(rawPath);
            search = requestUrl.slice(rawPath.length).split("#", 1)[0];
        } catch {
            return { status: 400, headers: {}, body: Buffer.from("Bad request") };
        }
        if (pathname.includes("\0") || pathname.split("/").includes("..")) {
            return { status: 400, headers: {}, body: Buffer.from("Bad request") };
        }

        if (pathname.includes("//")) {
            return {
                status: 307,
                headers: {
                    location: pathname.replace(/\/{2,}/g, "/") + search,
                    "content-length": "0",
                },
                body: Buffer.alloc(0),
            };
        }

        let assetPath = pathname;
        const redirect = redirectRules.find((rule) => rule.from === pathname);
        if (redirect && redirect.status !== 200) {
            return {
                status: redirect.status,
                headers: { location: redirect.to, "content-length": "0" },
                body: Buffer.alloc(0),
            };
        }
        if (redirect) assetPath = redirect.to;

        let status = 200;
        let filePath = fileAt(assetPath);
        if (!filePath) {
            status = 404;
            filePath = nearestNotFoundPage(assetPath);
            if (!filePath) return { status, headers: {}, body: Buffer.alloc(0) };
        }

        const contentType = contentTypeFor(filePath);
        const headers: Record<string, string> = {
            "content-type": contentType,
            "cache-control": DEFAULT_CACHE_CONTROL,
        };
        // _headers matches the URL that was asked for, so a missing /x.css gets the css rules too
        for (const rule of headerRules) {
            if (!rule.pattern.test(pathname)) continue;
            for (const [name, value] of rule.headers) headers[name] = value;
        }

        let body: Buffer = readFileSync(filePath);
        const etag =
            status === 200 && contentType !== "text/html"
                ? createHash("sha256").update(body).digest("hex").slice(0, 32)
                : undefined;

        if (etag) {
            headers.etag = `"${etag}"`;
            const ifNoneMatch = requestHeaders["if-none-match"] ?? "";
            const matches = ifNoneMatch
                .split(",")
                .some((tag) => tag.trim().replace(/^W\//, "") === `"${etag}"`);
            if (matches) return { status: 304, headers, body: Buffer.alloc(0) };
        }

        const encoding = COMPRESSIBLE.has(contentType)
            ? chooseEncoding(requestHeaders["accept-encoding"] as string | undefined)
            : undefined;
        if (encoding) {
            const key = `${filePath}\0${statSync(filePath).mtimeMs}\0${encoding}`;
            const cached = compressed.get(key) ?? compress(body, encoding);
            compressed.set(key, cached);
            body = cached;
            headers["content-encoding"] = encoding;
            headers.vary = "Accept-Encoding";
            if (etag) headers.etag = `W/"${etag}"`;
        }
        headers["content-length"] = String(body.length);

        return { status, headers, body: method === "HEAD" ? Buffer.alloc(0) : body };
    };
}

export function createCloudflareLikeServer(directory = distDirectory): http.Server {
    const handle = createCloudflareHandler(directory);
    return http.createServer((req, res) => {
        const response = handle(req.method ?? "GET", req.url ?? "/", req.headers);
        res.writeHead(response.status, response.headers);
        res.end(response.body);
    });
}
