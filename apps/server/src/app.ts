import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';

import { HEALTH_ROUTE } from '@smash-arena/shared';

import { buildHealthStatus } from './health.js';

export interface HealthServerOptions {
  /** Injected for deterministic uptime assertions in tests. Defaults to process start. */
  startedAt?: Date;
  /** Injected clock. Defaults to the real one. */
  now?: () => Date;
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown, headers: Record<string, string> = {}): void {
  const payload = Buffer.from(`${JSON.stringify(body)}\n`, 'utf8');
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': String(payload.byteLength),
    'Cache-Control': 'no-store',
    ...headers,
  });
  response.end(payload);
}

/**
 * Creates the Smash Arena HTTP server.
 *
 * Milestone M1 exposes exactly one route: `GET /health`. Rooms, simulation, and
 * WebSocket transport arrive in later milestones; the HTTP server is returned
 * un-listened so tests can bind an ephemeral port.
 */
export function createHealthServer(options: HealthServerOptions = {}): Server {
  const startedAt = options.startedAt ?? new Date();
  const now = options.now ?? ((): Date => new Date());

  return createServer((request: IncomingMessage, response: ServerResponse) => {
    const url = new URL(request.url ?? '/', 'http://localhost');

    if (url.pathname !== HEALTH_ROUTE) {
      sendJson(response, 404, { error: 'not_found', path: url.pathname });
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      sendJson(response, 405, { error: 'method_not_allowed', path: url.pathname }, { Allow: 'GET, HEAD' });
      return;
    }

    sendJson(response, 200, buildHealthStatus(now(), startedAt));
  });
}
