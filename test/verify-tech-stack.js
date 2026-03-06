const fs = require('fs');
const path = require('path');

const text = fs.readFileSync(path.join(__dirname, '..', 'TECH-STACK.md'), 'utf8');

[
  '# Handcrafted Personal Site Tech Stack',
  '## Recommended stack',
  'Pandoc',
  'Plain CSS',
  'Vanilla JavaScript',
].forEach((requiredContent) => {
  if (!text.includes(requiredContent)) {
    throw new Error(`Missing required content: ${requiredContent}`);
  }
});

console.log('Verified TECH-STACK.md');
