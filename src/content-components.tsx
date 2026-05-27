import { ArticleList } from "./components/article-list/article-list.tsx";
import { Callout } from "./components/callout/callout.tsx";
import { Code } from "./components/code/code.tsx";
import type { DemoWidgetProps } from "./components/demo-widget/demo-widget.client.tsx";
import { Figure } from "./components/figure/figure.tsx";
import { Hero } from "./components/hero/hero.tsx";
import { Manifesto } from "./components/manifesto/manifesto.tsx";
import { TableOfContents } from "./components/table-of-contents/table-of-contents.tsx";
import { Island } from "./islands/island.tsx";
import type { ContentComponentMap } from "./types/content.ts";

function DemoWidget(props: DemoWidgetProps) {
    return <Island name="DemoWidget" props={props} />;
}

const contentComponents = {
    ArticleList,
    Callout,
    Code,
    Figure,
    Hero,
    Manifesto,
    TableOfContents,
    DemoWidget,
} satisfies ContentComponentMap;

export function getContentComponents(): ContentComponentMap {
    return contentComponents;
}
