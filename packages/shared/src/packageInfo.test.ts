import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { SHARED_PACKAGE_NAME, SHARED_PACKAGE_VERSION } from './packageInfo.js';

function readManifest(): { name: string; version: string } {
  const manifestPath = fileURLToPath(new URL('../package.json', import.meta.url));
  return JSON.parse(readFileSync(manifestPath, 'utf8')) as { name: string; version: string };
}

describe('packageInfo', () => {
  it('matches the workspace manifest name', () => {
    expect(SHARED_PACKAGE_NAME).toBe(readManifest().name);
  });

  it('matches the workspace manifest version so displayed build info cannot drift', () => {
    expect(SHARED_PACKAGE_VERSION).toBe(readManifest().version);
  });
});
