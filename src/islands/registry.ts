import { GridPlayground } from "../components/examples/grid-playground/grid-playground.client.tsx";
import type { IslandDefinition } from "../types/islands.ts";

export const islandRegistry = {
    GridPlayground: {
        component: GridPlayground,
        hydrate: "visible",
    },
} satisfies Record<string, IslandDefinition>;

export type IslandName = keyof typeof islandRegistry;
