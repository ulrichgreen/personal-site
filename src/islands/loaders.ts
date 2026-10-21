import type { ComponentType } from "preact";
import type { IslandName } from "./registry.ts";

// The browser's view of the registry: each island's code is imported only
// when an island of that name is about to hydrate, so it lands in its own
// chunk. The type makes sure every registered island has a loader.
export const islandLoaders = {
    GridPlayground: () =>
        import(
            "../components/examples/grid-playground/grid-playground.client.tsx"
        ).then((module) => module.GridPlayground),
} satisfies Record<IslandName, () => Promise<ComponentType<any>>>;
