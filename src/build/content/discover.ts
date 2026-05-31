import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import {
    contentDirectory,
    distDirectory,
    articlesDirectory,
    outputPathFromSource,
} from "../shared/paths.ts";

export function discoverSourceFiles(): string[] {
    const isContentFile = (file: string) =>
        file.endsWith(".mdx") && !file.startsWith("_");
    const topLevelPages = readdirSync(contentDirectory)
        .filter(isContentFile)
        .map((file) => join(contentDirectory, file));
    const articlePages = readdirSync(articlesDirectory)
        .filter(isContentFile)
        .map((file) => join(articlesDirectory, file));
    return [...topLevelPages, ...articlePages];
}

export const resolveOutputPath = outputPathFromSource;

export function cleanGeneratedPages(): void {
    mkdirSync(distDirectory, { recursive: true });
    for (const entry of readdirSync(distDirectory, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.endsWith(".html")) {
            rmSync(join(distDirectory, entry.name), { force: true });
        }
    }
    rmSync(join(distDirectory, "articles"), { recursive: true, force: true });
}
