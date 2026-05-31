import { writeDistFile } from "../shared/dist-fs.ts";
import type { Artifact } from "./context.ts";

export const buildHeaders: Artifact = () => {
    const headers = [
        "/*.css",
        "  Cache-Control: public, max-age=31536000, immutable",
        "",
        "/*.js",
        "  Cache-Control: public, max-age=31536000, immutable",
        "",
        "/fonts/*",
        "  Cache-Control: public, max-age=31536000, immutable",
        "",
    ].join("\n");

    writeDistFile("_headers", headers);
};
