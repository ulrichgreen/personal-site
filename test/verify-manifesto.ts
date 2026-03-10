import { existsSync, readFileSync } from 'node:fs';

const file = new URL('../docs/manifesto.md', import.meta.url).pathname;

if (!existsSync(file)) {
  console.error('manifesto.md not found');
  process.exit(1);
}

const content = readFileSync(file, 'utf8');
const required = [
  'personal site',
  'authored',
  'islands',
  'TypeScript',
  'HTML',
  'What It Optimizes For',
  'What The Code Must Keep True',
  'What It Refuses',
  'What Success Looks Like',
];

const errors = required.filter(item => !content.includes(item));

if (errors.length > 0) {
  console.error('manifesto.md verification failed:');
  errors.forEach(item => console.error(`  - Missing: ${item}`));
  process.exit(1);
}

console.log(`manifesto.md verified: ${required.length} core ideas present.`);