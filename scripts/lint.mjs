import fs from 'node:fs';

const filesToCheck = [
  'README.md',
  'docs/domain-model.md',
  'docs/api-contracts.md'
];

const failures = [];

for (const file of filesToCheck) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('TODO')) {
    failures.push(`${file} contains TODO marker`);
  }
  if (content.trim().length === 0) {
    failures.push(`${file} is empty`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log(`Lint checks passed (${filesToCheck.length} files).`);
