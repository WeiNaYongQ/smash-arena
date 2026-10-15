import { describe, expect, it } from 'vitest';

import { PROTOCOL_VERSION } from '@smash-arena/shared';

import { buildHealthStatus } from './health.js';
import { SERVER_VERSION } from './version.js';

describe('buildHealthStatus', () => {
  it('emits the documented health contract', () => {
    const startedAt = new Date('2026-10-15T10:00:00.000Z');
    const now = new Date('2026-10-15T10:02:05.500Z');

    expect(buildHealthStatus(now, startedAt)).toEqual({
      status: 'ok',
      service: 'smash-arena-server',
      version: SERVER_VERSION,
      protocolVersion: PROTOCOL_VERSION,
      uptimeSeconds: 125,
      timestamp: '2026-10-15T10:02:05.500Z',
    });
  });

  it('never reports a negative uptime if the clock moves backwards', () => {
    const startedAt = new Date('2026-10-15T10:00:00.000Z');
    const now = new Date('2026-10-15T09:59:00.000Z');
    expect(buildHealthStatus(now, startedAt).uptimeSeconds).toBe(0);
  });
});
