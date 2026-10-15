export const DEFAULT_PORT = 8787;

/**
 * Defaults to the loopback interface.
 *
 * docs/TECHNICAL_DESIGN.md section 6 asks that the local server not be exposed
 * to wider networks unnecessarily, so binding to every interface must be an
 * explicit, documented opt-in (HOST=0.0.0.0).
 */
export const DEFAULT_HOST = '127.0.0.1';

export interface ServerConfig {
  host: string;
  port: number;
}

export class ServerConfigError extends Error {
  constructor(
    message: string,
    readonly variable: string,
    readonly received: string,
  ) {
    super(message);
    this.name = 'ServerConfigError';
  }
}

export function parsePort(raw: string | undefined): number {
  if (raw === undefined || raw.trim() === '') {
    return DEFAULT_PORT;
  }
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new ServerConfigError(
      `PORT must be an integer between 1 and 65535, received "${raw}".`,
      'PORT',
      raw,
    );
  }
  return port;
}

export function parseHost(raw: string | undefined): string {
  const host = raw?.trim();
  if (host === undefined || host === '') {
    return DEFAULT_HOST;
  }
  return host;
}

export function loadServerConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  return { host: parseHost(env.HOST), port: parsePort(env.PORT) };
}
