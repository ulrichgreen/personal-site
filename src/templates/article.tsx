import { h, html } from '../runtime/jsx-runtime.ts';
import { ArticleHeader } from '../components/article-header.tsx';
import BaseLayout from './base.tsx';
import type { ArticleLayoutProps } from '../types/content.ts';

export default function ArticleLayout({
  title,
  description,
  section,
  published,
  revised,
  words,
  note,
  contentHtml,
}: ArticleLayoutProps) {
  return (
    <BaseLayout title={title} description={description} section={section}>
      <article>
        <ArticleHeader
          title={title}
          published={published}
          revised={revised}
          words={words}
          note={note}
        />
        <div class="article-body">{html(contentHtml || '')}</div>
        <footer class="article-footer">
          <a href="/index.html">← All writing</a>
        </footer>
      </article>
    </BaseLayout>
  );
}