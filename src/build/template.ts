import { html as rawHtml, h } from '../runtime/jsx-runtime.ts';
import { importJsxModule } from '../runtime/load-jsx.ts';
import { renderToString } from '../runtime/render-html.ts';
import type { HtmlPayload, PageMeta } from '../types/content.ts';

const chunks: Buffer[] = [];

process.stdin.on('data', chunk => chunks.push(chunk));
process.stdin.on('end', async () => {
  const { meta, html } = JSON.parse(Buffer.concat(chunks).toString()) as HtmlPayload;
  const pageMeta = meta as PageMeta;
  const section = pageMeta.section || '';
  const [{ default: BaseLayout }, { default: ArticleLayout }] = await Promise.all([
    importJsxModule('../templates/base.tsx'),
    importJsxModule('../templates/article.tsx'),
  ]);

  const page = section === 'writing'
    ? h(ArticleLayout as never, { ...pageMeta, contentHtml: html }, '')
    : h(BaseLayout as never, pageMeta, html && html.length > 0 ? rawHtml(html) : '');

  process.stdout.write(`<!doctype html>\n${renderToString(page)}`);
});