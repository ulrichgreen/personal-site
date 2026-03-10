import { existsSync, readFileSync } from "node:fs";

const file = new URL("../docs/architecture.md", import.meta.url).pathname;

if (!existsSync(file)) {
    console.error("architecture.md not found");
    process.exit(1);
}

const content = readFileSync(file, "utf8");
const required = [
    "make build",
    "renderToStaticMarkup",
    "hydrateRoot",
    "section: writing",
    "progressive enhancement",
    "content-components.tsx",
    "Make",
    "TypeScript",
    "React",
    "react-dom/server",
    "MDX",
    "gray-matter",
    "lightningcss",
    "esbuild",
    "No full-page hydration",
    "content/",
    "src/build/",
    "src/templates/",
    "src/client/",
    "src/islands/",
    "src/styles/",
    "dist/",
];

const errors = required.filter((item) => !content.includes(item));

if (errors.length > 0) {
    console.error("architecture.md verification failed:");
    errors.forEach((item) => console.error(`  - Missing: ${item}`));
    process.exit(1);
}

console.log(
    `architecture.md verified: ${required.length} anchors present.`,
);
