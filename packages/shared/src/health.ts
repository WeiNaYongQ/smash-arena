/**
 * Server health contract.
 *
 * Defined here so the server implementation and any future consumer (CI probe,
 * client status indicator, monitoring) agree on one shape. See
 * docs/TECHNICAL_DESIGN.md section 10.
 */
export const HEALTH_ROUTE = '/health';

export const SERVER_SERVICE_NAME = 'smash-arena-server';

export interface HealthStatus {
  status: 'ok';
  service: string;
  /** Server package version. */
  version: string;
  /** Protocol version the server was built against. */
  protocolVersion: number;
  /** Whole seconds since the process started. */
  uptimeSeconds: number;
  /** ISO-8601 UTC timestamp of the response. */
  timestamp: string;
}

export function isHealthStatus(value: unknown): value is HealthStatus {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    candidate.status === 'ok' &&
    typeof candidate.service === 'string' &&
    typeof candidate.version === 'string' &&
    typeof candidate.protocolVersion === 'number' &&
    typeof candidate.uptimeSeconds === 'number' &&
    Number.isFinite(candidate.uptimeSeconds) &&
    candidate.uptimeSeconds >= 0 &&
    typeof candidate.timestamp === 'string' &&
    !Number.isNaN(Date.parse(candidate.timestamp))
  );
}
