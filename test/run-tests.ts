import { spawn } from "node:child_process";
import { globSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAll } from "../src/build/build.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const nodeBin = process.execPath;
const skipBuild = process.argv.includes("--skip-build");

function nodeArgs(args: string[]): string[] {
    return ["--import", "tsx", ...args];
}

// Integration verifiers (each is a standalone script with its own output)
const integrationFiles = globSync("test/verify-*.ts", { cwd: root }).sort();

// Co-located unit test files (run via node:test, each as a standalone process)
const unitTestFiles = globSync("src/**/*.test.ts", { cwd: root }).sort();

if (integrationFiles.length === 0 || unitTestFiles.length === 0) {
    throw new Error(
        "run-tests.ts: test discovery found no unit tests or no verifiers",
    );
}

function runScript(file: string): Promise<{ ok: boolean; output: string }> {
    return new Promise((done) => {
        const chunks: Buffer[] = [];
        const proc = spawn(nodeBin, nodeArgs([resolve(root, file)]), {
            stdio: ["ignore", "pipe", "pipe"],
        });
        proc.stdout.on("data", (d: Buffer) => chunks.push(d));
        proc.stderr.on("data", (d: Buffer) => chunks.push(d));
        proc.on("close", (code) =>
            done({
                ok: code === 0,
                output: Buffer.concat(chunks).toString(),
            }),
        );
    });
}

function runUnitTests(
    files: string[],
): Promise<{ ok: boolean; output: string }> {
    return new Promise((done) => {
        const chunks: Buffer[] = [];
        const proc = spawn(
            nodeBin,
            nodeArgs([
                "--test",
                "--test-reporter",
                "spec",
                ...files.map((f) => resolve(root, f)),
            ]),
            { stdio: ["ignore", "pipe", "pipe"] },
        );
        proc.stdout.on("data", (d: Buffer) => chunks.push(d));
        proc.stderr.on("data", (d: Buffer) => chunks.push(d));
        proc.on("close", (code) =>
            done({
                ok: code === 0,
                output: Buffer.concat(chunks).toString(),
            }),
        );
    });
}

async function main() {
    if (!skipBuild) {
        process.stdout.write("Building site before running tests...\n");
        await buildAll();
    }

    const [unitResult, ...integrationResults] = await Promise.all([
        runUnitTests(unitTestFiles),
        ...integrationFiles.map(runScript),
    ]);

    const allResults = [unitResult, ...integrationResults];

    for (const { output } of allResults) {
        if (output) process.stdout.write(output);
    }

    if (allResults.some((r) => !r.ok)) {
        process.exit(1);
    }
}

main().catch((error) => {
    process.stderr.write(`${String(error)}\n`);
    process.exit(1);
});
