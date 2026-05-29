import chokidar from "chokidar";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";
import { DEV_DEBOUNCE_MS, DEV_PORT } from "../config.ts";
import { buildClient } from "./assets/client.ts";
import { buildCss } from "./assets/css.ts";
import { rebuildPages } from "./pipeline.ts";
import { createStaticSiteServer } from "./serve.ts";
const LIVE_RELOAD_SCRIPT = `<script>
(() => {
    if (window.__siteLiveReloadSocket) {
        return;
    }

    const socket = new WebSocket(\`ws://\${location.host}\`);
    socket.addEventListener("message", () => {
        location.reload();
    });
    window.__siteLiveReloadSocket = socket;
})();
</script>`;

// Changes under these paths alter rendering/build code, so the in-process
// module graph is stale and a fresh subprocess is required.
const RENDER_PATH_PREFIXES = [
    "src/templates/",
    "src/components/",
    "src/content-components.tsx",
    "src/build/render/",
    "src/build/content/",
    "src/build/pipeline.ts",
    "src/context/",
    "src/islands/",
    "src/types/",
];

type FreshBuildMode = "full" | "render";

type RebuildKind = "content" | "styles" | "client" | "render" | "full";

function classifyChange(changedPath: string): RebuildKind {
    if (changedPath.startsWith("content")) return "content";
    if (
        changedPath.startsWith("src/styles") ||
        changedPath.startsWith("src/fonts")
    )
        return "styles";
    if (changedPath.startsWith("src/client")) return "client";

    if (RENDER_PATH_PREFIXES.some((prefix) => changedPath.startsWith(prefix))) {
        return "render";
    }

    return "full";
}

function runFreshBuild(mode: FreshBuildMode): Promise<void> {
    return new Promise((resolve, reject) => {
        const scriptPath =
            mode === "full" ? "./src/build/build.ts" : "./src/build/pipeline.ts";
        const scriptArgs = mode === "full" ? ["--dev"] : [];
        const child = spawn(
            process.execPath,
            ["--import", "tsx", scriptPath, ...scriptArgs],
            {
                cwd: process.cwd(),
                stdio: "inherit",
                env: process.env,
            },
        );

        child.on("error", reject);
        child.on("exit", (code, signal) => {
            if (code === 0) {
                resolve();
                return;
            }

            if (signal) {
                reject(new Error(`Build terminated by signal ${signal}`));
                return;
            }

            reject(new Error(`Build exited with code ${String(code)}`));
        });
    });
}

export function startDevServer(): void {
    const server = createStaticSiteServer({
        transformHtml: (html) =>
            html.replace("</body>", `${LIVE_RELOAD_SCRIPT}</body>`),
    });

    const wss = new WebSocketServer({ server });

    const pendingChanges = new Set<string>();
    let buildQueued = false;
    let buildRunning = false;
    // Once rendering/build code changes, this long-lived process holds stale
    // modules, so all later content rebuilds must also use a fresh subprocess.
    let codeStale = false;
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    function reload() {
        wss.clients.forEach((client) => {
            try {
                if (client.readyState === 1) client.send("reload");
            } catch {
                /* ignore stale connections */
            }
        });
    }

    async function runBuild() {
        if (buildRunning) {
            buildQueued = true;
            return;
        }

        buildRunning = true;

        while (true) {
            const changedPaths = [...pendingChanges];
            pendingChanges.clear();

            try {
                if (changedPaths.length === 0) {
                    await runFreshBuild("full");
                } else {
                    const kinds = new Set(changedPaths.map(classifyChange));
                    if (kinds.has("full")) {
                        codeStale = true;
                        await runFreshBuild("full");
                    } else {
                        const tasks: Promise<unknown>[] = [];
                        if (kinds.has("styles")) tasks.push(buildCss());
                        if (kinds.has("client")) tasks.push(buildClient());
                        if (kinds.has("render")) {
                            // Template/build code changed: rebuild pages in a
                            // fresh subprocess so updated modules are used.
                            codeStale = true;
                            tasks.push(runFreshBuild("render"));
                        } else if (kinds.has("content")) {
                            // Only MDX changed: rebuild in-process (content is
                            // read fresh) unless code modules are already stale.
                            tasks.push(
                                codeStale
                                    ? runFreshBuild("render")
                                    : rebuildPages(),
                            );
                        }
                        await Promise.all(tasks);
                    }
                }
                reload();
            } catch (error) {
                process.stderr.write(
                    `\n  error  ${error instanceof Error ? error.message : String(error)}\n\n`,
                );
            }

            if (buildQueued) {
                buildQueued = false;
                continue;
            }

            buildRunning = false;
            break;
        }
    }

    function debouncedBuild() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => void runBuild(), DEV_DEBOUNCE_MS);
    }

    chokidar
        .watch(["content", "src"], { ignoreInitial: true })
        .on("all", (_event, path) => {
            process.stdout.write(`  ~ ${path}\n`);
            pendingChanges.add(path);
            debouncedBuild();
        });

    void runBuild();

    server.listen(DEV_PORT, () =>
        process.stdout.write(`\n  http://localhost:${DEV_PORT}\n\n`),
    );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startDevServer();
}
