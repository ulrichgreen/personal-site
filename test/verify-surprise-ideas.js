const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'SURPRISE-IDEAS.md');

if (!fs.existsSync(file)) {
  console.error('SURPRISE-IDEAS.md not found');
  process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
const errors = [];

const sections = [
  'The Big Idea',
  'Button Copy Ideas',
  'What Happens First',
  'What the Alternate Mode Becomes',
  'Why This Idea Works',
  'How to Make It Convincing Instead of Gimmicky',
  'Other Completely Different Surprise Ideas',
  'Strong Concepts That Balance Surprise and Craft',
  'Rules for Any Surprise Layer',
  'Anti-Ideas',
  'Recommended Next Move'
];

for (const section of sections) {
  if (!content.includes(section)) {
    errors.push(`Missing required section: "${section}"`);
  }
}

const concepts = [
  'Load Full Experience',
  'prefers-reduced-motion',
  'footer',
  'Flash',
  'view source',
  'print',
  'CV',
  '404',
  'performance',
  'readability'
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

console.log(`SURPRISE-IDEAS.md verified: ${sections.length} sections and ${concepts.length} surprise concepts covered.`);
