/**
 * Wire protocol version.
 *
 * Bump this whenever the shape of any message in `messages.ts` changes in a
 * way that older clients could not interpret. Peers are expected to compare
 * this value during the future handshake and refuse mismatched connections.
 */
export const PROTOCOL_VERSION = 1 as const;

export type ProtocolVersion = typeof PROTOCOL_VERSION;

export function isProtocolVersion(value: unknown): value is ProtocolVersion {
  return value === PROTOCOL_VERSION;
}
