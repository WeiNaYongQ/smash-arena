import { describe, expect, it } from 'vitest';

import { HEALTH_ROUTE, SERVER_SERVICE_NAME, isHealthStatus } from './health.js';
import type { HealthStatus } from './health.js';

const valid: HealthStatus = {
  status: 'ok',
  service: SERVER_SERVICE_NAME,
  version: '0.1.0',
  protocolVersion: 1,
  uptimeSeconds: 12,
  timestamp: '2026-10-15T10:00:00.000Z',
};

describe('health contract constants', () => {
  it('documents the health route and service name', () => {
    expect(HEALTH_ROUTE).toBe('/health');
    expect(SERVER_SERVICE_NAME).toBe('smash-arena-server');
  });
});

describe('isHealthStatus', () => {
  it('accepts a well-formed payload', () => {
    expect(isHealthStatus(valid)).toBe(true);
  });

  it.each([
    ['a non-object', 'ok'],
    ['null', null],
    ['a non-ok status', { ...valid, status: 'degraded' }],
    ['a missing version', { ...valid, version: undefined }],
    ['a NaN uptime', { ...valid, uptimeSeconds: Number.NaN }],
    ['a negative uptime', { ...valid, uptimeSeconds: -1 }],
    ['an unparseable timestamp', { ...valid, timestamp: 'not-a-date' }],
  ])('rejects %s', (_label, value) => {
    expect(isHealthStatus(value)).toBe(false);
  });
});
