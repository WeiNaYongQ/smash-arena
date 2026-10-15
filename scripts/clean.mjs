import { rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const targets = [
  'coverage',
  'apps/client/dist',
  'apps/server/dist',
  'packages/shared/dist',
  'node_modules/.vite',
  'apps/client/node_modules/.vite',
];

for (const target of targets) {
  const absolute = resolve(root, target);
  rmSync(absolute, { recursive: true, force: true });
  console.log(`removed ${target}`);
}
