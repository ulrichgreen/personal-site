import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { distDirectory } from "./paths.ts";

const kibibyte = 1024;

export function writeDistFile(
    relativePath: string,
    content: string | Buffer,
): void {
    const fullPath = join(distDirectory, relativePath);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, content);
}

/** Recursively lists every file under `directory`; empty when it is missing. */
export function listFilesRecursive(directory: string): string[] {
    const files: string[] = [];
    if (!existsSync(directory)) return files;

    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const entryPath = join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...listFilesRecursive(entryPath));
            continue;
        }
        if (entry.isFile()) files.push(entryPath);
    }

    return files;
}

export function formatKiB(bytes: number): string {
    return `${(bytes / kibibyte).toFixed(1)} KiB`;
}
