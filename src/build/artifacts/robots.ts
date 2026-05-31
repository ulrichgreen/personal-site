import { SITE_URL } from "../../config.ts";
import { writeDistFile } from "../shared/dist-fs.ts";
import type { Artifact } from "./context.ts";

export const buildRobots: Artifact = () => {
    const content = [
        "User-agent: *",
        "Allow: /",
        "",
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        "",
    ].join("\n");

    writeDistFile("robots.txt", content);
};
