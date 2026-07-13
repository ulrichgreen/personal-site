import sharp from "sharp";
import {
    copyFileSync,
    existsSync,
    mkdirSync,
    readdirSync,
    statSync,
} from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { distDirectory } from "../shared/paths.ts";

const imagesDir = fileURLToPath(new URL("../../images", import.meta.url));
const distImagesDir = join(distDirectory, "images");

export const RASTER_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const PASSTHROUGH_EXTS = new Set([".svg", ".avif", ".webp"]);

interface ProcessedImage {
    source: string;
    outputs: string[];
}

export interface ImageBuildSummary {
    sourceCount: number;
    outputCount: number;
}

export async function processImage(
    sourcePath: string,
    destDir: string,
): Promise<ProcessedImage> {
    const name = basename(sourcePath, extname(sourcePath));
    const ext = extname(sourcePath).toLowerCase();
    const destOriginal = join(destDir, basename(sourcePath));

    // Every planned output for this source, so freshness can be checked
    // up front and the whole set skipped when nothing changed.
    const jobs: { path: string; run: () => void | Promise<unknown> }[] = [
        { path: destOriginal, run: () => copyFileSync(sourcePath, destOriginal) },
    ];

    if (RASTER_EXTS.has(ext)) {
        const metadata = await sharp(sourcePath).metadata();

        // Full-size variants, plus half-width ones for large images (> 640px).
        const widths: (number | undefined)[] = [undefined];
        if (metadata.width && metadata.width > 640) {
            widths.push(Math.round(metadata.width / 2));
        }

        for (const width of widths) {
            const suffix = width === undefined ? "" : `-${width}w`;
            const resized = () => {
                const image = sharp(sourcePath);
                return width === undefined ? image : image.resize(width);
            };

            const webpPath = join(destDir, `${name}${suffix}.webp`);
            jobs.push({
                path: webpPath,
                run: () => resized().webp({ quality: 80, effort: 6 }).toFile(webpPath),
            });

            const avifPath = join(destDir, `${name}${suffix}.avif`);
            jobs.push({
                path: avifPath,
                run: () => resized().avif({ quality: 65, effort: 6 }).toFile(avifPath),
            });
        }
    }

    // Incremental skip: re-encode only when some output is missing or older
    // than the source.
    const sourceMtimeMs = statSync(sourcePath).mtimeMs;
    const upToDate = jobs.every(
        ({ path }) => existsSync(path) && statSync(path).mtimeMs >= sourceMtimeMs,
    );
    if (!upToDate) {
        for (const job of jobs) {
            await job.run();
        }
    }

    return { source: sourcePath, outputs: jobs.map((job) => job.path) };
}

export async function buildImages(
    sourceDir = imagesDir,
    destDir = distImagesDir,
): Promise<ImageBuildSummary> {
    if (!existsSync(sourceDir)) {
        return { sourceCount: 0, outputCount: 0 };
    }

    const allExts = new Set([...RASTER_EXTS, ...PASSTHROUGH_EXTS]);
    const files = readdirSync(sourceDir, { recursive: true, withFileTypes: true })
        .filter(
            (entry) =>
                entry.isFile() && allExts.has(extname(entry.name).toLowerCase()),
        )
        .map((entry) => join(entry.parentPath, entry.name));

    const results = await Promise.all(
        files.map((file) => {
            // Mirror the source subdirectory layout under dist/images.
            const outputDir = join(destDir, dirname(relative(sourceDir, file)));
            mkdirSync(outputDir, { recursive: true });
            return processImage(file, outputDir);
        }),
    );

    const totalOutputs = results.reduce((sum, r) => sum + r.outputs.length, 0);
    process.stdout.write(
        `  images: ${files.length} source → ${totalOutputs} output files\n`,
    );
    return { sourceCount: files.length, outputCount: totalOutputs };
}
