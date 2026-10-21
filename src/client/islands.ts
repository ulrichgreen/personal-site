import { islandLoaders } from "../islands/loaders.ts";

// Nothing heavy is in this module. Preact and each island's code are
// imported only when that island's hydration trigger fires.
async function hydrateIsland(root: HTMLElement): Promise<void> {
    if (root.dataset.hydrated) return;
    root.dataset.hydrated = "true";

    const name = root.dataset.island;
    if (!name || !(name in islandLoaders)) return;

    let props: Record<string, unknown>;
    try {
        props = JSON.parse(root.dataset.islandProps || "{}");
    } catch {
        return;
    }

    const [Component, { hydrateIsland: hydrate }] = await Promise.all([
        islandLoaders[name as keyof typeof islandLoaders](),
        import("./hydrate.ts"),
    ]);
    hydrate(root, Component, props);
}

function scheduleVisible(root: HTMLElement): void {
    const observer = new IntersectionObserver(
        (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer.disconnect();
            hydrateIsland(root);
        },
        { rootMargin: "200px" },
    );
    observer.observe(root);
}

function scheduleIdle(root: HTMLElement): void {
    const callback = () => hydrateIsland(root);
    if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(callback);
    } else {
        setTimeout(callback, 200);
    }
}

function scheduleInteraction(root: HTMLElement): void {
    const events = ["click", "focusin", "mouseover", "touchstart"] as const;
    const handler = () => {
        for (const event of events) root.removeEventListener(event, handler);
        hydrateIsland(root);
    };
    for (const event of events) {
        root.addEventListener(event, handler, { passive: true });
    }
}

// A module script runs once the document is parsed.
for (const root of document.querySelectorAll<HTMLElement>("[data-island]")) {
    switch (root.dataset.hydrate) {
        case "visible":
            scheduleVisible(root);
            break;
        case "idle":
            scheduleIdle(root);
            break;
        case "interaction":
            scheduleInteraction(root);
            break;
        default:
            hydrateIsland(root);
    }
}
