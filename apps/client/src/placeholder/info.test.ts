import { describe, expect, it } from 'vitest';

import {
  DEFAULT_MATCH_CONFIG,
  LOGICAL_ACTIONS,
  PROTOCOL_VERSION,
  SHARED_PACKAGE_NAME,
  SHARED_PACKAGE_VERSION,
} from '@smash-arena/shared';

import { buildPlaceholderInfo } from './info.js';

describe('buildPlaceholderInfo', () => {
  const info = buildPlaceholderInfo();

  it('states clearly that this build has no gameplay', () => {
    expect(info.title).toBe('SMASH ARENA');
    expect(info.subtitle).toContain('no gameplay implemented yet');
    expect(info.milestone).toContain('M1');
  });

  it('surfaces the shared package the client was built against', () => {
    const joined = info.detailLines.join('\n');
    expect(joined).toContain(`${SHARED_PACKAGE_NAME} v${SHARED_PACKAGE_VERSION}`);
    expect(joined).toContain(`protocol version: ${PROTOCOL_VERSION}`);
  });

  it('surfaces the documented match defaults and the logical action list', () => {
    const joined = info.detailLines.join('\n');
    expect(joined).toContain(`stocks: ${DEFAULT_MATCH_CONFIG.stocksPerPlayer}`);
    expect(joined).toContain(`timer: ${DEFAULT_MATCH_CONFIG.matchDurationSeconds / 60} min`);
    expect(joined).toContain('items: off');
    expect(joined).toContain(LOGICAL_ACTIONS.join(', '));
  });

  it('lists what is deliberately missing from this milestone', () => {
    expect(info.detailLines.join('\n')).toContain('not in this build');
  });
});
