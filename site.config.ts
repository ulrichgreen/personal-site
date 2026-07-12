const kibibyte = 1024;

const browserTargets = {
    chrome: 120,
    firefox: 121,
    safari: 17,
} as const;

function toEsbuildTarget(targets: typeof browserTargets): string[] {
    return Object.entries(targets).map(([browser, version]) => `${browser}${version}`);
}

function toLightningCssTarget(targets: typeof browserTargets): Record<keyof typeof browserTargets, number> {
    // Lightning CSS encodes each browser version as major << 16.
    return Object.fromEntries(
        Object.entries(targets).map(([browser, version]) => [browser, version << 16]),
    ) as Record<keyof typeof browserTargets, number>;
}

export const siteConfig = {
    site: {
        url: "https://ulrich.green",
        title: "Ulrich Green",
        author: "Ulrich Green",
        domain: "ulrich.green",
        locale: "en",
    },
    dev: {
        port: 3009,
        debounceMs: 80,
    },
    build: {
        browserTargets,
        esbuildTarget: toEsbuildTarget(browserTargets),
        lightningCssTarget: toLightningCssTarget(browserTargets),
    },
    performance: {
        budgets: [
            {
                label: "HTML",
                extensions: [".html"],
                // Per page, not summed, so publishing more articles can't
                // fail the build. Largest page today is ~27 KiB.
                measure: "largestFile",
                warnAtBytes: 48 * kibibyte,
                maximumBytes: 64 * kibibyte,
            },
            {
                label: "CSS",
                extensions: [".css"],
                warnAtBytes: 28 * kibibyte,
                maximumBytes: 33 * kibibyte,
            },
            {
                label: "JS",
                extensions: [".js"],
                warnAtBytes: 36 * kibibyte,
                maximumBytes: 41 * kibibyte,
            },
            {
                label: "Fonts",
                // The font pipeline only ships woff2/woff (see assets/css.ts).
                extensions: [".woff2", ".woff"],
                warnAtBytes: 288 * kibibyte,
                maximumBytes: 320 * kibibyte,
            },
        ],
    },
} as const;
