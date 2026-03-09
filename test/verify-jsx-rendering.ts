import assert from 'node:assert/strict';
import { renderMarkdown } from '../src/build/md2html.ts';
import { html, h } from '../src/runtime/jsx-runtime.ts';
import { importJsxModule } from '../src/runtime/load-jsx.ts';
import { renderToString } from '../src/runtime/render-html.ts';

async function main() {
  const escaped = renderToString(
    h(
      'div',
      { title: 'Quotes " & < >', hidden: true },
      '<unsafe>',
      false,
      null,
      undefined,
      html('<span>trusted</span>'),
    ),
  );

  assert.equal(
    escaped,
    '<div title="Quotes &quot; &amp; &lt; &gt;" hidden>&lt;unsafe&gt;<span>trusted</span></div>',
    'renderToString should escape text and attrs while preserving trusted HTML',
  );

  const { default: BaseLayout } = await importJsxModule('../templates/base.tsx');
  const { default: ArticleLayout } = await importJsxModule('../templates/article.tsx');

  const baseHtml = `<!doctype html>\n${renderToString(
    h(
      BaseLayout as never,
      {
        title: 'A < Title',
        description: 'Description & more',
        section: 'home',
      },
      html('<p>Rendered content</p>'),
    ),
  )}`;

  assert(baseHtml.includes('<title>A &lt; Title</title>'));
  assert(baseHtml.includes('<meta name="description" content="Description &amp; more">'));
  assert(baseHtml.includes('<main class="page page-arrival"><p>Rendered content</p></main>'));
  assert(baseHtml.includes('class="running-header__section">home</span>'));

  const noDescriptionHtml = renderToString(
    h(BaseLayout as never, {
      title: 'Untitled',
      section: 'home',
    }),
  );

  assert(noDescriptionHtml.includes('<meta name="description" content="">'));

  const articleBody = renderMarkdown({
    meta: {
      title: 'Essay',
      section: 'writing',
    },
    body: '\n# Essay\n\nBody copy',
  });

  assert.equal(articleBody.html, '<p>Body copy</p>\n');

  const pageBody = renderMarkdown({
    meta: {
      title: 'Colophon',
      section: 'colophon',
    },
    body: '# Colophon\n\nBody copy',
  });

  assert(pageBody.html.includes('<h1>Colophon</h1>'));

  const articleHtml = `<!doctype html>\n${renderToString(
    h(ArticleLayout as never, {
      title: 'Essay',
      description: 'Article page',
      section: 'writing',
      published: '2025-03-01',
      revised: '2025-03-02',
      words: 1234,
      note: 'Note <carefully>',
      contentHtml: '<p>Body copy</p>',
    }),
  )}`;

  assert(articleHtml.includes('<h1>Essay</h1>'));
  assert(articleHtml.includes('<time datetime="2025-03-01">March 1, 2025</time>'));
  assert(articleHtml.includes('<span class="revised">Revised <time datetime="2025-03-02">March 2, 2025</time></span>'));
  assert(articleHtml.includes('<span class="word-count">1234 words</span>'));
  assert(articleHtml.includes('<p class="author-note">Note &lt;carefully&gt;</p>'));
  assert(articleHtml.includes('<div class="article-body"><p>Body copy</p></div>'));

  console.log('JSX rendering verified: runtime, escaping, and TSX layouts render expected HTML.');
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});