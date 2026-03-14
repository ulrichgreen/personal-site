import { createElement, type ComponentType } from "preact/compat";
import { renderToString } from "preact-render-to-string";
import { useRenderContext } from "../context/render-context.tsx";
import type { IslandName } from "./registry.ts";

export type HydrationStrategy = "load" | "visible" | "idle" | "interaction";

interface IslandProps<Props extends object> {
    name: IslandName;
    component: ComponentType<Props>;
    props: Props;
    hydrate?: HydrationStrategy;
}

export function Island<Props extends object>({
    name,
    component,
    props,
    hydrate,
}: IslandProps<Props>) {
    const { registerIsland } = useRenderContext();
    const id = registerIsland({
        name,
        props: props as Record<string, unknown>,
    });

    return (
        <div
            className="island-root"
            data-island={name}
            data-island-id={id}
            data-island-props={JSON.stringify(props)}
            data-hydrate={hydrate || "load"}
            dangerouslySetInnerHTML={{
                __html: renderToString(createElement(component, props)),
            }}
        />
    );
}
