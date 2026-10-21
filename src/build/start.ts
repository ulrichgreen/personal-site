import { fileURLToPath } from "node:url";
import { DEV_PORT } from "../config.ts";
import { createCloudflareLikeServer } from "./serve-cloudflare.ts";

// Serves dist/ the way Cloudflare serves ulrich.green, so what you see here is what visitors get
export function startStaticServer(): void {
    const server = createCloudflareLikeServer();
    server.listen(DEV_PORT, "127.0.0.1", () =>
        process.stdout.write(`\n  http://localhost:${DEV_PORT}\n\n`),
    );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startStaticServer();
}
