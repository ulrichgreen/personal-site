import { h } from '../runtime/jsx-runtime.ts';

export function RunningHeader({ section = '', title = '' }: { section?: string; title?: string }) {
  return (
    <header class="running-header">
      <div class="running-header__title">
        <span>ULRICH</span> / <span class="running-header__section">{section || 'home'}</span> / <span>{title}</span>
      </div>
      <nav class="running-header__nav" aria-label="Primary">
        <a href="/index.html">Home</a>
        <a href="/cv.html">CV</a>
        <a href="/colophon.html">Colophon</a>
      </nav>
    </header>
  );
}