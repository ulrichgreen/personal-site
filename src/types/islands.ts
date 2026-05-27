import type { ComponentType } from "preact/compat";

export type HydrationStrategy = "load" | "visible" | "idle" | "interaction";

export interface RegisterIslandInput {
    name: string;
    props: Record<string, unknown>;
}

export interface SerializedIsland extends RegisterIslandInput {
    id: string;
}

export interface IslandDefinition {
    component: ComponentType<any>;
    hydrate: HydrationStrategy;
}
