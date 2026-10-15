import { PROTOCOL_VERSION, type ProtocolVersion } from './version.js';

/**
 * Minimal message envelope.
 *
 * NOTE: this is scaffolding for the foundation milestone only. The real
 * transport, handshake, rate limits, and payload validation arrive with the
 * phone-pairing and online-room milestones. Nothing in this file is wired to a
 * socket yet, and the networking library is still an open decision (D-009).
 */
export const MESSAGE_KINDS = ['hello', 'inputState', 'error'] as const;

export type MessageKind = (typeof MESSAGE_KINDS)[number];

export interface ProtocolMessage<K extends MessageKind = MessageKind, P = unknown> {
  /** Protocol version the sender was built against. */
  v: ProtocolVersion;
  kind: K;
  /** Monotonically increasing per-sender counter, used for ordering and de-duplication. */
  seq: number;
  /** Sender clock, milliseconds since the Unix epoch. Never trusted as authoritative time. */
  sentAt: number;
  payload: P;
}

export function createMessage<K extends MessageKind, P>(
  kind: K,
  payload: P,
  seq: number,
  sentAt: number = Date.now(),
): ProtocolMessage<K, P> {
  return { v: PROTOCOL_VERSION, kind, seq, sentAt, payload };
}

export function isMessageKind(value: unknown): value is MessageKind {
  return typeof value === 'string' && (MESSAGE_KINDS as readonly string[]).includes(value);
}

/**
 * Structural guard for the envelope only. Payload schemas are intentionally
 * not validated here; per-message validation is a later milestone's job.
 */
export function isProtocolMessage(value: unknown): value is ProtocolMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    candidate.v === PROTOCOL_VERSION &&
    isMessageKind(candidate.kind) &&
    typeof candidate.seq === 'number' &&
    Number.isInteger(candidate.seq) &&
    candidate.seq >= 0 &&
    typeof candidate.sentAt === 'number' &&
    Number.isFinite(candidate.sentAt) &&
    'payload' in candidate
  );
}
