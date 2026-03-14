import type { ComponentType } from "preact/compat";
import { DemoWidgetClient } from "./demo-widget.tsx";

export const islandRegistry = {
    DemoWidget: DemoWidgetClient,
} satisfies Record<string, ComponentType<any>>;

export type IslandName = keyof typeof islandRegistry;
