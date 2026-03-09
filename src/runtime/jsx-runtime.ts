export interface RawHtml {
  __html: string;
}

export type Primitive = string | number | bigint | boolean | null | undefined;
export type Props = Record<string, unknown> | null;
export type Component<P = Record<string, unknown>> = (props: P & { children?: RenderableNode[] }) => RenderableNode;

export interface VNode {
  tag: string | Component<any>;
  props: Record<string, unknown> | null;
  children: RenderableNode[];
}

export type RenderableNode = Primitive | RawHtml | VNode | RenderableNode[];

export function h(
  tag: string | Component<any>,
  props: Record<string, unknown> | null,
  ...children: RenderableNode[]
): VNode {
  return {
    tag,
    props,
    children: children.flat(),
  };
}

export function Fragment({ children = [] }: { children?: RenderableNode[] }): RenderableNode[] {
  return children;
}

export function html(value: string): RawHtml {
  return { __html: value };
}