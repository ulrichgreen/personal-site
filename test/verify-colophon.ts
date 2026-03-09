import { existsSync, readFileSync } from 'node:fs';

const colophonFile = new URL('../content/colophon.md', import.meta.url).pathname;
const indexFile = new URL('../content/index.md', import.meta.url).pathname;
const errors: string[] = [];

if (!existsSync(colophonFile)) {
  console.error('content/colophon.md not found');
  process.exit(1);
}

if (!existsSync(indexFile)) {
  console.error('content/index.md not found');
  process.exit(1);
}

const colophon = readFileSync(colophonFile, 'utf8');
const index = readFileSync(indexFile, 'utf8');

const requiredColophonContent = [
  '# Colophon',
  'MANIFESTO.md',
  'ARCHITECTURE.md',
  'STRUCTURE.md',
  'ROADMAP.md',
  'EXPERIMENTS.md',
  'static files',
  'raw CSS',
  'Vanilla JS',
  '8px baseline grid',
  'TypeScript',
];

for (const item of requiredColophonContent) {
  if (!colophon.includes(item)) {
    errors.push(`Missing colophon content: "${item}"`);
  }
}

if (!index.includes('./colophon.html')) {
  errors.push('Missing index link to ./colophon.html');
}

if (!index.includes('[colophon](./colophon.html)')) {
  errors.push('Missing visible colophon call-to-action on index page');
}

if (errors.length > 0) {
  console.error('colophon verification failed:');
  errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}

console.log('colophon verified: content/colophon.md present, repo-aligned content included, index link added.');