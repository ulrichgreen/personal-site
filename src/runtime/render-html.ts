import type { RawHtml, RenderableNode, VNode } from './jsx-runtime.ts';

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

function normalizeAttributeName(name: string): string {
  if (name === 'className') return 'class';
  if (name === 'htmlFor') return 'for';
  if (name === 'charSet') return 'charset';
  return name;
}

export function escapeHtml(value: string | number | bigint): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isRawHtml(node: RenderableNode): node is RawHtml {
  return typeof node === 'object' && node !== null && Object.prototype.hasOwnProperty.call(node, '__html');
}

function isVNode(node: RenderableNode): node is VNode {
  return typeof node === 'object' && node !== null && Object.prototype.hasOwnProperty.call(node, 'tag');
}

function renderAttribute([name, value]: [string, unknown]): string {
  if (value == null || value === false || name === 'children') {
    return '';
  }

  const attribute = normalizeAttributeName(name);

  if (value === true) {
    return ` ${attribute}`;
  }

  return ` ${attribute}="${escapeHtml(String(value))}"`;
}

export function renderToString(node: RenderableNode): string {
  if (node == null || node === false) {
    return '';
  }

  if (Array.isArray(node)) {
    return node.map(renderToString).join('');
  }

  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint') {
    return escapeHtml(node);
  }

  if (isRawHtml(node)) {
    return String(node.__html ?? '');
  }

  if (!isVNode(node)) {
    return '';
  }

  if (typeof node.tag === 'function') {
    return renderToString(node.tag({ ...(node.props || {}), children: node.children || [] }));
  }

  const props = node.props || {};
  const attrs = Object.entries(props).map(renderAttribute).join('');
  const children = node.children || [];

  if (VOID_ELEMENTS.has(node.tag)) {
    return `<${node.tag}${attrs}>`;
  }

  return `<${node.tag}${attrs}>${children.map(renderToString).join('')}</${node.tag}>`;
}