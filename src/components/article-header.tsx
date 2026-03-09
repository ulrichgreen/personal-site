import { h } from '../runtime/jsx-runtime.ts';

function formatDate(value?: string): string {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function safeISODate(value?: string): string {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

export function ArticleHeader({
  title,
  published,
  revised,
  words,
  note,
}: {
  title?: string;
  published?: string;
  revised?: string;
  words?: number | string;
  note?: string;
}) {
  const publishedIso = safeISODate(published);
  const revisedIso = safeISODate(revised);
  const revisedDate = formatDate(revised);
  const publishedDate = formatDate(published);

  return (
    <header class="article-header">
      <h1>{title || ''}</h1>
      <div class="article-meta">
        <time datetime={publishedIso}>{publishedDate}</time>
        {revisedDate && (
          <span class="revised">
            Revised <time datetime={revisedIso}>{revisedDate}</time>
          </span>
        )}
        {words && <span class="word-count">{String(words)} words</span>}
      </div>
      {note && <p class="author-note">{note}</p>}
    </header>
  );
}