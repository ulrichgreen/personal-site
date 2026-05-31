import { createElement, type ComponentType } from "preact/compat";
import { ArticleList } from "./components/article-list/article-list.tsx";
import { Callout } from "./components/callout/callout.tsx";
import { Code } from "./components/code/code.tsx";
import { Figure } from "./components/figure/figure.tsx";
import { Hero } from "./components/hero/hero.tsx";
import { Manifesto } from "./components/manifesto/manifesto.tsx";
import { TableOfContents } from "./components/table-of-contents/table-of-contents.tsx";
import { Island } from "./islands/island.tsx";
import { islandRegistry, type IslandName } from "./islands/registry.ts";
import type {
    ArticleIndexEntry,
    ContentComponentMap,
} from "./types/content.ts";

// Every registered island is exposed to MDX automatically: authoring a new
// interactive example only requires adding it to the registry, not writing a
// matching wrapper here.
function createIslandComponent(
    name: IslandName,
): ComponentType<Record<string, unknown>> {
    return (props) => createElement(Island, { name, props });
}

const islandComponents = Object.fromEntries(
    (Object.keys(islandRegistry) as IslandName[]).map((name) => [
        name,
        createIslandComponent(name),
    ]),
) as Record<IslandName, ComponentType<Record<string, unknown>>>;

/**
 * The curated component surface MDX can reference. `articleIndex` is bound into
 * `ArticleList` here so the listing data flows in as a prop rather than through
 * cross-cutting render context.
 */
export function getContentComponents(
    articleIndex: ArticleIndexEntry[] = [],
): ContentComponentMap {
    return {
        ArticleList: (props: { items?: ArticleIndexEntry[] }) => (
            <ArticleList items={props.items} articleIndex={articleIndex} />
        ),
        Callout,
        Code,
        Figure,
        Hero,
        Manifesto,
        TableOfContents,
        ...islandComponents,
    };
}
