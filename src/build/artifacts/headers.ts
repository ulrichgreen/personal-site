import { writeDistFile } from "../shared/dist-fs.ts";
import type { Artifact } from "./context.ts";

// Hashed assets never change, so browsers may keep them for a year. Each file gets its own rule: a
// wildcard like /*.css would also mark the 404 page for a missing .css URL immutable, because
// Cloudflare applies _headers by the URL asked for.
export const buildHeaders: Artifact = ({ hashedAssets }) => {
    const headers = hashedAssets
        .map((file) => `/${file}\n  Cache-Control: public, max-age=31536000, immutable\n`)
        .join("\n");

    writeDistFile("_headers", headers);
};
