import { DemoWidget } from "../components/demo-widget/demo-widget.client.tsx";
import type { IslandDefinition } from "../types/islands.ts";

export const islandRegistry = {
    DemoWidget: {
        component: DemoWidget,
        hydrate: "load",
    },
} satisfies Record<string, IslandDefinition>;

export type IslandName = keyof typeof islandRegistry;
