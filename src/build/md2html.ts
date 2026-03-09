import { marked } from 'marked';
import { pathToFileURL } from 'node:url';
import type { FrontmatterPayload, HtmlPayload } from '../types/content.ts';

const renderer = new marked.Renderer();
renderer.hr = () => '<div class="section-break" aria-hidden="true">⁂</div>\n';
marked.use({ renderer });

function normalizeTitle(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function stripDuplicateArticleTitle(input: FrontmatterPayload): string {
  const tokens = marked.lexer(input.body);
  const firstContentIndex = tokens.findIndex(token => token.type !== 'space');
  const firstToken = firstContentIndex >= 0 ? tokens[firstContentIndex] : undefined;

  if (
    input.meta.section === 'writing' &&
    input.meta.title &&
    firstToken?.type === 'heading' &&
    firstToken.depth === 1 &&
    normalizeTitle(firstToken.text) === normalizeTitle(String(input.meta.title))
  ) {
    tokens.splice(firstContentIndex, 1);
  }

  return marked.parser(tokens);
}

export function renderMarkdown(input: FrontmatterPayload): HtmlPayload {
  return {
    meta: input.meta,
    html: stripDuplicateArticleTitle(input),
  };
}

function isCliEntryPoint(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  return pathToFileURL(entry).href === import.meta.url;
}

if (isCliEntryPoint()) {
  const chunks: Buffer[] = [];
  process.stdin.on('data', chunk => chunks.push(chunk));
  process.stdin.on('end', () => {
    const input = JSON.parse(Buffer.concat(chunks).toString()) as FrontmatterPayload;
    const payload = renderMarkdown(input);

    process.stdout.write(JSON.stringify(payload));
  });
}