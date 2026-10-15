import { PROTOCOL_VERSION, SERVER_SERVICE_NAME } from '@smash-arena/shared';
import type { HealthStatus } from '@smash-arena/shared';

import { SERVER_VERSION } from './version.js';

/**
 * Builds the documented `/health` response.
 *
 * `startedAt` is injected so the value is deterministic under test.
 */
export function buildHealthStatus(
  now: Date = new Date(),
  startedAt: Date = new Date(),
): HealthStatus {
  return {
    status: 'ok',
    service: SERVER_SERVICE_NAME,
    version: SERVER_VERSION,
    protocolVersion: PROTOCOL_VERSION,
    uptimeSeconds: Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000)),
    timestamp: now.toISOString(),
  };
}
