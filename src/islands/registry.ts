import type { ComponentType } from "preact/compat";
import { DemoWidget } from "../components/demo-widget/demo-widget.client.tsx";

export const islandRegistry = {
    DemoWidget,
} satisfies Record<string, ComponentType<any>>;

export type IslandName = keyof typeof islandRegistry;
