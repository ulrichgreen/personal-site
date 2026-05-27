import { siteConfig } from "../site.config.ts";

export const SITE_URL = siteConfig.site.url;
export const SITE_TITLE = siteConfig.site.title;
export const SITE_AUTHOR = siteConfig.site.author;
export const SITE_DOMAIN = siteConfig.site.domain;
export const SITE_LOCALE = siteConfig.site.locale;
export const DEV_PORT = siteConfig.dev.port;
export const DEV_DEBOUNCE_MS = siteConfig.dev.debounceMs;
export const BROWSER_TARGETS = siteConfig.build.browserTargets;
export const ESBUILD_TARGET = [...siteConfig.build.esbuildTarget];
export const LIGHTNING_CSS_TARGET = siteConfig.build.lightningCssTarget;
