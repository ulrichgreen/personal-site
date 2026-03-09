import matter from 'gray-matter';
import { createInterface } from 'node:readline';
import type { FrontmatterPayload } from '../types/content.ts';

const chunks: string[] = [];

const rl = createInterface({ input: process.stdin, terminal: false });
rl.on('line', line => chunks.push(line));
rl.on('close', () => {
  const raw = chunks.join('\n');
  if (!raw.trim()) {
    process.stderr.write('frontmatter.ts: stdin is empty\n');
    process.exit(1);
  }

  const { data, content } = matter(raw);
  const payload: FrontmatterPayload = {
    meta: data,
    body: content,
  };

  process.stdout.write(JSON.stringify(payload));
});