declare global {
  namespace JSX {
    type Element = import('./jsx-runtime.ts').RenderableNode;

    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicElements {
      [elementName: string]: Record<string, unknown>;
    }
  }
}

export {};