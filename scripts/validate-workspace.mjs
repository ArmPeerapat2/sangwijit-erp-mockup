import fs from 'node:fs';

const requiredPaths = [
  'apps/web/package.json',
  'apps/api/package.json',
  'packages/ui/package.json',
  'packages/types/package.json',
  'packages/utils/package.json',
  'packages/config/package.json',
  'docs/domain-model.md',
  'docs/api-contracts.md'
];

const missing = requiredPaths.filter((path) => !fs.existsSync(path));

if (missing.length > 0) {
  console.error('Missing required workspace files:');
  for (const path of missing) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log(`Workspace validation passed (${requiredPaths.length} checks).`);
