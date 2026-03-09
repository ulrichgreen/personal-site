import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { h } from '../runtime/jsx-runtime.ts';
import { importJsxModule } from '../runtime/load-jsx.ts';
import { renderToString } from '../runtime/render-html.ts';
import type { PageMeta, WritingIndexEntry } from '../types/content.ts';

const writingDir = new URL('../../content/writing', import.meta.url).pathname;

const articles = readdirSync(writingDir)
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const raw = readFileSync(join(writingDir, file), 'utf8');
    const { data } = matter(raw);
    const slug = file.replace(/\.md$/, '');
    return {
      ...(data as PageMeta),
      slug,
      title: String(data.title || ''),
      published: String(data.published || ''),
    } satisfies WritingIndexEntry;
  })
  .filter(article => article.published && !Number.isNaN(new Date(article.published).getTime()))
  .sort((left, right) => new Date(right.published).getTime() - new Date(left.published).getTime());

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

const meta: PageMeta = {
  title: 'Ulrich Green',
  description: 'Writing on design, engineering, and the considered web.',
  section: 'home',
};

async function main() {
  const { default: BaseLayout } = await importJsxModule('../templates/base.tsx');

  const content = h(
    'ul',
    { class: 'writing-list' },
    articles.map(article => {
      const iso = new Date(article.published).toISOString().slice(0, 10);

      return h(
        'li',
        null,
        h('a', { href: `/writing/${article.slug}.html` }, article.title),
        ' ',
        h('time', { datetime: iso }, formatDate(article.published)),
      );
    }),
  );

  process.stdout.write(`<!doctype html>\n${renderToString(h(BaseLayout as never, meta, content))}`);
}

main().catch(error => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});