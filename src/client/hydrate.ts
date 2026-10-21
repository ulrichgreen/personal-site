import { createElement, hydrate, type ComponentType } from "preact";

export function hydrateIsland(
    root: HTMLElement,
    Component: ComponentType<any>,
    props: Record<string, unknown>,
): void {
    hydrate(createElement(Component, props), root);
}
