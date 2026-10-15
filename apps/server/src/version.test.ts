import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { SERVER_VERSION } from './version.js';

function readManifest(): { version: string } {
  const manifestPath = fileURLToPath(new URL('../package.json', import.meta.url));
  return JSON.parse(readFileSync(manifestPath, 'utf8')) as { version: string };
}

describe('SERVER_VERSION', () => {
  it('stays in sync with apps/server/package.json', () => {
    expect(SERVER_VERSION).toBe(readManifest().version);
  });
});
