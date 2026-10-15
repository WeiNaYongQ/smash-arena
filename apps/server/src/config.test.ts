import { describe, expect, it } from 'vitest';

import {
  DEFAULT_HOST,
  DEFAULT_PORT,
  ServerConfigError,
  loadServerConfig,
  parseHost,
  parsePort,
} from './config.js';

describe('defaults', () => {
  it('binds loopback on port 8787 with an empty environment', () => {
    expect(loadServerConfig({})).toEqual({ host: DEFAULT_HOST, port: DEFAULT_PORT });
    expect(DEFAULT_HOST).toBe('127.0.0.1');
    expect(DEFAULT_PORT).toBe(8787);
  });
});

describe('parsePort', () => {
  it.each([
    [undefined, DEFAULT_PORT],
    ['', DEFAULT_PORT],
    ['   ', DEFAULT_PORT],
    ['1', 1],
    ['3000', 3000],
    ['65535', 65_535],
  ])('parses %p as %p', (raw, expected) => {
    expect(parsePort(raw)).toBe(expected);
  });

  it.each(['0', '70000', 'abc', '3000.5', '-1'])('rejects %p', (raw) => {
    expect(() => parsePort(raw)).toThrow(ServerConfigError);
  });

  it('names the offending variable in the error', () => {
    try {
      parsePort('abc');
      expect.unreachable('parsePort should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ServerConfigError);
      expect((error as ServerConfigError).variable).toBe('PORT');
      expect((error as ServerConfigError).received).toBe('abc');
    }
  });
});

describe('parseHost', () => {
  it('falls back to loopback when unset or blank', () => {
    expect(parseHost(undefined)).toBe(DEFAULT_HOST);
    expect(parseHost('  ')).toBe(DEFAULT_HOST);
  });

  it('accepts an explicit bind address so LAN play can be opted into', () => {
    expect(parseHost('0.0.0.0')).toBe('0.0.0.0');
    expect(parseHost('  192.168.1.10  ')).toBe('192.168.1.10');
  });
});

describe('loadServerConfig', () => {
  it('reads HOST and PORT from the environment', () => {
    expect(loadServerConfig({ HOST: '0.0.0.0', PORT: '9000' })).toEqual({
      host: '0.0.0.0',
      port: 9000,
    });
  });
});
