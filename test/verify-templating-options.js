const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'docs', 'TEMPLATING-OPTIONS.md');

if (!fs.existsSync(file)) {
  console.error('TEMPLATING-OPTIONS.md not found');
  process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
const errors = [];

const sections = [
  'Philosophy',
  'The Assumption',
  'Why This Fits the Site',
  'What It Would Take',
  'Islands Without Betraying the Default',
  'Take It Up a Notch',
  'Feature Set for the Custom Framework',
  'Boundaries That Keep It Elegant',
  'Practical Migration Path'
];

for (const section of sections) {
  if (!content.includes(section)) {
    errors.push(`Missing required section: "${section}"`);
  }
}

const concepts = [
  'zero JavaScript in the browser by default',
  'React-like',
  'JSX',
  'renderToString',
  'escape',
  'islands',
  'Astro-like',
  'lightningcss',
  'newsletter signup',
  'self-contained React components',
  'prose-heavy'
];

for (const concept of concepts) {
  if (!content.toLowerCase().includes(concept.toLowerCase())) {
    errors.push(`Missing required concept: "${concept}"`);
  }
}

if (errors.length > 0) {
  console.error('Verification failed:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}

console.log(`TEMPLATING-OPTIONS.md verified: ${sections.length} sections and ${concepts.length} templating concepts covered.`);
