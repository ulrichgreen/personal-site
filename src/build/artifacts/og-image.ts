import { writeDistFile } from "../shared/dist-fs.ts";
import { SITE_DOMAIN, SITE_TITLE } from "../../config.ts";
import { escapeXml } from "../shared/xml.ts";
import type { Artifact } from "./context.ts";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#22c768"/>
  <text x="72" y="420" font-size="200" font-weight="900" fill="#06190d" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" letter-spacing="-0.05em">${escapeXml(SITE_TITLE)}</text>
  <text x="72" y="540" font-size="28" font-weight="700" fill="#0d3a1f" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" letter-spacing="0.08em">${escapeXml(SITE_DOMAIN.toUpperCase())}</text>
</svg>`;

export const buildOgImage: Artifact = () => {
  writeDistFile("og-image.svg", svg);
};
