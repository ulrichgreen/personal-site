import { writeDistFile } from "../shared/dist-fs.ts";
import { SITE_DOMAIN, SITE_TITLE } from "../../config.ts";
import { escapeXml } from "../shared/xml.ts";
import type { Artifact } from "./context.ts";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f7f4eb"/>
  <rect x="60" y="60" width="1080" height="510" fill="none" stroke="#cfcbb6" stroke-width="1"/>
  <text x="600" y="300" font-size="76" text-anchor="middle" fill="#20241e" font-family="Georgia, 'Times New Roman', serif" letter-spacing="-0.01em">${escapeXml(SITE_TITLE)}</text>
  <line x1="576" y1="352" x2="624" y2="352" stroke="#cfcbb6" stroke-width="1"/>
  <text x="600" y="404" font-size="24" text-anchor="middle" fill="#3e6349" font-family="ui-monospace, 'Courier New', monospace" letter-spacing="0.25em">${escapeXml(SITE_DOMAIN.toUpperCase())}</text>
</svg>`;

export const buildOgImage: Artifact = () => {
  writeDistFile("og-image.svg", svg);
};
