import { statSync } from "node:fs";
import { extname } from "node:path";
import { siteConfig } from "../../site.config.ts";
import { formatKiB, listFilesRecursive } from "./shared/dist-fs.ts";
import { distDirectory } from "./shared/paths.ts";

export interface PerformanceBudget {
    label: string;
    extensions: readonly string[];
    warnAtBytes: number;
    maximumBytes: number;
    /** Sum every matching file ("total", default) or take only the single
     *  largest one ("largestFile") — for per-page budgets that shouldn't
     *  fail just because more pages exist. */
    measure?: "total" | "largestFile";
}

export interface PerformanceBudgetResult extends PerformanceBudget {
    bytes: number;
    status: "pass" | "warn" | "fail";
}

export const performanceBudgets = siteConfig.performance
    .budgets satisfies readonly PerformanceBudget[];

function measureBytes(paths: string[], budget: PerformanceBudget): number {
    const allowed = new Set(budget.extensions);
    const sizes = paths
        .filter((filePath) => allowed.has(extname(filePath)))
        .map((filePath) => statSync(filePath).size);

    if (budget.measure === "largestFile") {
        return sizes.length > 0 ? Math.max(...sizes) : 0;
    }
    return sizes.reduce((total, size) => total + size, 0);
}

function resolveBudgetStatus(
    bytes: number,
    budget: PerformanceBudget,
): PerformanceBudgetResult["status"] {
    if (bytes > budget.maximumBytes) return "fail";
    if (bytes > budget.warnAtBytes) return "warn";
    return "pass";
}

export function measurePerformanceBudgets(
    directory = distDirectory,
    budgets: readonly PerformanceBudget[] = performanceBudgets,
): PerformanceBudgetResult[] {
    const files = listFilesRecursive(directory);
    return budgets.map((budget) => {
        const bytes = measureBytes(files, budget);
        return {
            ...budget,
            bytes,
            status: resolveBudgetStatus(bytes, budget),
        };
    });
}

export function formatPerformanceBudgetReport(
    results: PerformanceBudgetResult[],
): string {
    const lines = ["performance budgets"];
    for (const result of results) {
        const marker =
            result.status === "pass"
                ? "✓"
                : result.status === "warn"
                  ? "!"
                  : "✕";
        const overBy =
            result.status === "fail"
                ? ` (+${formatKiB(result.bytes - result.maximumBytes)})`
                : "";
        lines.push(
            `  ${marker} ${result.label.padEnd(5)} ${formatKiB(result.bytes)} / ${formatKiB(result.maximumBytes)}${overBy}`,
        );
    }
    return `${lines.join("\n")}\n`;
}

export function enforcePerformanceBudgets(
    directory = distDirectory,
    budgets: readonly PerformanceBudget[] = performanceBudgets,
): PerformanceBudgetResult[] {
    const results = measurePerformanceBudgets(directory, budgets);
    process.stdout.write(formatPerformanceBudgetReport(results));

    const failures = results.filter((result) => result.status === "fail");
    if (failures.length > 0) {
        const labels = failures.map((result) => result.label).join(", ");
        throw new Error(`Performance budget exceeded for ${labels}`);
    }

    return results;
}
