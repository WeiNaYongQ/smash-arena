import { once } from 'node:events';
import type { Server } from 'node:http';
import { describe, expect, it } from 'vitest';

import {
  HEALTH_ROUTE,
  PROTOCOL_VERSION,
  SERVER_SERVICE_NAME,
  SHARED_PACKAGE_NAME,
  SHARED_PACKAGE_VERSION,
  isHealthStatus,
} from '@smash-arena/shared';

// Resolved through the workspace package link, exactly as the applications do.
import { createHealthServer } from '../apps/server/src/app.js';
// Framework-free client module; proves the client sources resolve @smash-arena/shared too.
import { buildPlaceholderInfo } from '../apps/client/src/placeholder/info.js';

async function withServer<T>(run: (origin: string) => Promise<T>): Promise<T> {
  const server: Server = createHealthServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (address === null || typeof address === 'string') {
    throw new Error('expected a TCP address');
  }
  try {
    return await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

describe('foundation: shared package is importable by both applications', () => {
  it('exposes a stable contract identity', () => {
    expect(SHARED_PACKAGE_NAME).toBe('@smash-arena/shared');
    expect(SHARED_PACKAGE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    expect(PROTOCOL_VERSION).toBe(1);
  });

  it('is consumed by the client placeholder screen', () => {
    const info = buildPlaceholderInfo();
    expect(info.detailLines.join('\n')).toContain(`${SHARED_PACKAGE_NAME} v${SHARED_PACKAGE_VERSION}`);
  });

  it('is consumed by the server health payload', async () => {
    await withServer(async (origin) => {
      const body: unknown = await (await fetch(`${origin}${HEALTH_ROUTE}`)).json();
      expect(isHealthStatus(body)).toBe(true);
      expect((body as { protocolVersion: number }).protocolVersion).toBe(PROTOCOL_VERSION);
    });
  });
});

describe('foundation: server health check over real HTTP', () => {
  it(`GET ${HEALTH_ROUTE} returns 200 and the documented service name`, async () => {
    await withServer(async (origin) => {
      const response = await fetch(`${origin}${HEALTH_ROUTE}`);
      expect(response.status).toBe(200);
      const body: unknown = await response.json();
      expect(body).toMatchObject({ status: 'ok', service: SERVER_SERVICE_NAME });
    });
  });

  it('returns 404 for anything that is not the health route', async () => {
    await withServer(async (origin) => {
      expect((await fetch(`${origin}/`)).status).toBe(404);
      expect((await fetch(`${origin}/api/v1/rooms`)).status).toBe(404);
    });
  });
});
