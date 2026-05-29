import { existsSync, readFileSync, statSync } from "node:fs";
import http from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { distDirectory } from "./shared/paths.ts";

const MIME: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".xml": "application/xml",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".txt": "text/plain",
};

export interface StaticServerFileResolution {
    status: 200 | 400 | 404;
    filePath?: string;
}

export interface CreateStaticSiteServerOptions {
    directory?: string;
    transformHtml?: (html: string) => string;
}

function isInsideDirectory(candidate: string, directory: string): boolean {
    return candidate.startsWith(directory + sep) || candidate === directory;
}

export function resolveStaticServerFilePath(
    requestUrl: string | undefined,
    directory = distDirectory,
): StaticServerFileResolution {
    if (!requestUrl) return { status: 400 };

    let pathname: string;
    try {
        const decodedRawPath = decodeURIComponent(requestUrl.split(/[?#]/, 1)[0]);
        if (decodedRawPath.split("/").includes("..")) {
            return { status: 400 };
        }
        pathname = decodeURIComponent(
            new URL(requestUrl, "http://localhost").pathname,
        );
    } catch {
        return { status: 400 };
    }

    if (pathname.includes("\0")) return { status: 400 };

    let filePath = resolve(
        directory,
        pathname === "/" ? "index.html" : `.${pathname}`,
    );
    if (!isInsideDirectory(filePath, directory)) return { status: 400 };

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        const candidate = resolve(directory, `.${pathname}`, "index.html");
        if (
            isInsideDirectory(candidate, directory) &&
            existsSync(candidate) &&
            statSync(candidate).isFile()
        ) {
            filePath = candidate;
        }
    }

    if (
        !existsSync(filePath) ||
        !statSync(filePath).isFile() ||
        !isInsideDirectory(filePath, directory)
    ) {
        return { status: 404 };
    }

    return { status: 200, filePath };
}

function readResponseBody(
    filePath: string,
    transformHtml?: (html: string) => string,
): Buffer {
    let body = readFileSync(filePath);
    if (extname(filePath) === ".html" && transformHtml) {
        body = Buffer.from(transformHtml(body.toString()));
    }
    return body;
}

export function createStaticSiteServer(
    options: CreateStaticSiteServerOptions = {},
): http.Server {
    const directory = options.directory ?? distDirectory;

    return http.createServer((req, res) => {
        const resolved = resolveStaticServerFilePath(req.url, directory);
        if (resolved.status === 400) {
            res.writeHead(400);
            res.end("Bad request");
            return;
        }

        if (resolved.status === 404 || !resolved.filePath) {
            const notFoundPage = join(directory, "404.html");
            if (existsSync(notFoundPage) && statSync(notFoundPage).isFile()) {
                const body = readResponseBody(notFoundPage, options.transformHtml);
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(body);
            } else {
                res.writeHead(404);
                res.end("Not found");
            }
            return;
        }

        const filePath = resolved.filePath;
        const mime = MIME[extname(filePath)] || "text/plain";
        const body = readResponseBody(filePath, options.transformHtml);
        res.writeHead(200, { "Content-Type": mime });
        res.end(body);
    });
}