import { Server } from 'node:http';
import { once } from 'node:events';
import { describe, expect, it } from 'vitest';

import { isHealthStatus, PROTOCOL_VERSION, SERVER_SERVICE_NAME } from '@smash-arena/shared';

import { createHealthServer } from './app.js';
import { SERVER_VERSION } from './version.js';

interface Listening {
  server: Server;
  origin: string;
  close: () => Promise<void>;
}

async function listen(server: Server): Promise<Listening> {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (address === null || typeof address === 'string') {
    throw new Error('expected a TCP address');
  }
  return {
    server,
    origin: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}

describe('GET /health', () => {
  it('responds 200 with the documented contract', async () => {
    const { origin, close } = await listen(createHealthServer());
    try {
      const response = await fetch(`${origin}/health`);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/json');

      const body: unknown = await response.json();
      expect(isHealthStatus(body)).toBe(true);
      expect(body).toMatchObject({
        status: 'ok',
        service: SERVER_SERVICE_NAME,
        version: SERVER_VERSION,
        protocolVersion: PROTOCOL_VERSION,
      });
    } finally {
      await close();
    }
  });

  it('reports a non-negative uptime that grows with wall-clock time', async () => {
    const startedAt = new Date('2026-10-15T10:00:00.000Z');
    const { origin, close } = await listen(
      createHealthServer({ startedAt, now: () => new Date('2026-10-15T10:01:30.000Z') }),
    );
    try {
      const body = (await (await fetch(`${origin}/health`)).json()) as { uptimeSeconds: number };
      expect(body.uptimeSeconds).toBe(90);
    } finally {
      await close();
    }
  });

  it('supports HEAD without a body', async () => {
    const { origin, close } = await listen(createHealthServer());
    try {
      const response = await fetch(`${origin}/health`, { method: 'HEAD' });
      expect(response.status).toBe(200);
      expect(await response.text()).toBe('');
    } finally {
      await close();
    }
  });
});

describe('routing', () => {
  it('returns 404 JSON for an unknown path', async () => {
    const { origin, close } = await listen(createHealthServer());
    try {
      const response = await fetch(`${origin}/rooms`);
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: 'not_found', path: '/rooms' });
    } finally {
      await close();
    }
  });

  it('returns 405 with an Allow header for POST /health', async () => {
    const { origin, close } = await listen(createHealthServer());
    try {
      const response = await fetch(`${origin}/health`, { method: 'POST' });
      expect(response.status).toBe(405);
      expect(response.headers.get('allow')).toBe('GET, HEAD');
      expect(await response.json()).toEqual({ error: 'method_not_allowed', path: '/health' });
    } finally {
      await close();
    }
  });

  it('ignores query strings when matching the health route', async () => {
    const { origin, close } = await listen(createHealthServer());
    try {
      const response = await fetch(`${origin}/health?probe=1`);
      expect(response.status).toBe(200);
    } finally {
      await close();
    }
  });
});

describe('server construction', () => {
  it('does not listen until the caller asks it to', () => {
    const server = createHealthServer();
    expect(server.listening).toBe(false);
    server.close();
  });

  it('is a plain node:http server, so no HTTP framework dependency is introduced', () => {
    const server = createHealthServer();
    expect(server).toBeInstanceOf(Server);
    expect(typeof server.listen).toBe('function');
    server.close();
  });
});
