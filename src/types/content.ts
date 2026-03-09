export interface PageMeta {
  title?: string;
  description?: string;
  section?: string;
  published?: string;
  revised?: string;
  words?: number | string;
  note?: string;
  summary?: string;
  [key: string]: unknown;
}

export interface FrontmatterPayload {
  meta: PageMeta;
  body: string;
}

export interface HtmlPayload {
  meta: PageMeta;
  html: string;
}

export interface WritingIndexEntry extends PageMeta {
  title: string;
  published: string;
  slug: string;
}

export interface BaseLayoutProps {
  title?: string;
  description?: string;
  section?: string;
  children?: unknown;
}

export interface ArticleLayoutProps extends BaseLayoutProps {
  published?: string;
  revised?: string;
  words?: number | string;
  note?: string;
  contentHtml?: string;
}