import { statSync } from "node:fs";
import { extname, relative, sep } from "node:path";
import { formatKiB, listFilesRecursive } from "./shared/dist-fs.ts";
import { distDirectory } from "./shared/paths.ts";
import type { ImageBuildSummary } from "./assets/images.ts";
import type { IslandUsage } from "./render/render-react-page.tsx";

export interface LargestOutputFile {
    label: string;
    path: string;
    bytes: number;
}

export interface BuildSummaryInput {
    pageCount: number;
    articleCount: number;
    feedEntries: number;
    imageSummary: ImageBuildSummary;
    cssBytes: number;
    jsBytes: number;
    islandPages: number;
    islands: IslandUsage;
    largestFiles: LargestOutputFile[];
}

const largestFileGroups = [
    { label: "HTML", extensions: [".html"] },
    { label: "CSS", extensions: [".css"] },
    { label: "JS", extensions: [".js"] },
    { label: "Images", extensions: [".avif", ".webp", ".png", ".jpg", ".jpeg", ".svg"] },
] as const;

function formatPlural(count: number, singular: string, plural = `${singular}s`): string {
    return `${count} ${count === 1 ? singular : plural}`;
}

export function sumOutputBytes(
    extensions: readonly string[],
    directory = distDirectory,
): number {
    const allowed = new Set(extensions);
    return listFilesRecursive(directory).reduce((total, filePath) => {
        if (!allowed.has(extname(filePath))) return total;
        return total + statSync(filePath).size;
    }, 0);
}

export function listLargestOutputFiles(
    directory = distDirectory,
): LargestOutputFile[] {
    const files = listFilesRecursive(directory);

    return largestFileGroups.flatMap(({ label, extensions }) => {
        const allowed = new Set<string>(extensions);
        const largest = files
            .filter((filePath) => allowed.has(extname(filePath)))
            .map((filePath) => ({
                label,
                path: relative(directory, filePath).split(sep).join("/"),
                bytes: statSync(filePath).size,
            }))
            .sort((left, right) => right.bytes - left.bytes)[0];

        return largest ? [largest] : [];
    });
}

export function formatBuildSummary(input: BuildSummaryInput): string {
    const islands = Object.entries(input.islands)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([name, count]) => `${name}×${count}`)
        .join(", ");

    const lines = [
        "build summary",
        `  pages ${input.pageCount} total, ${input.articleCount} articles, ${input.feedEntries} feed entries`,
        `  assets CSS ${formatKiB(input.cssBytes)}, JS ${formatKiB(input.jsBytes)}`,
        `  images ${input.imageSummary.sourceCount} source → ${input.imageSummary.outputCount} output files`,
        `  islands ${formatPlural(input.islandPages, "page")}${islands ? `, ${islands}` : ""}`,
    ];

    if (input.largestFiles.length > 0) {
        lines.push("  largest");
        for (const file of input.largestFiles) {
            lines.push(
                `    ${file.label.padEnd(6)} ${formatKiB(file.bytes).padStart(8)} ${file.path}`,
            );
        }
    }

    return `${lines.join("\n")}\n`;
}

export function writeBuildSummary(input: BuildSummaryInput): void {
    process.stdout.write(formatBuildSummary(input));
}
