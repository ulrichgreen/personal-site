import { fileURLToPath } from "node:url";
import { DEV_PORT } from "../config.ts";
import { createStaticSiteServer } from "./serve.ts";

export function startStaticServer(): void {
    const server = createStaticSiteServer();
    server.listen(DEV_PORT, "127.0.0.1", () =>
        process.stdout.write(`\n  http://localhost:${DEV_PORT}\n\n`),
    );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startStaticServer();
}