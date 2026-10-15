import { describe, expect, it } from 'vitest';

import { PROTOCOL_VERSION, isProtocolVersion } from './version.js';
import { createMessage, isMessageKind, isProtocolMessage } from './messages.js';

describe('PROTOCOL_VERSION', () => {
  it('is 1 for the foundation milestone', () => {
    expect(PROTOCOL_VERSION).toBe(1);
    expect(isProtocolVersion(1)).toBe(true);
    expect(isProtocolVersion(2)).toBe(false);
  });
});

describe('createMessage', () => {
  it('stamps the protocol version, kind, sequence, and send time', () => {
    const message = createMessage('inputState', { left: true }, 7, 1_700_000_000_000);
    expect(message).toEqual({
      v: PROTOCOL_VERSION,
      kind: 'inputState',
      seq: 7,
      sentAt: 1_700_000_000_000,
      payload: { left: true },
    });
  });

  it('defaults sentAt to the current time', () => {
    const before = Date.now();
    const message = createMessage('hello', null, 0);
    const after = Date.now();
    expect(message.sentAt).toBeGreaterThanOrEqual(before);
    expect(message.sentAt).toBeLessThanOrEqual(after);
  });
});

describe('isMessageKind', () => {
  it.each(['hello', 'inputState', 'error'])('accepts %p', (kind) => {
    expect(isMessageKind(kind)).toBe(true);
  });

  it.each(['join', 'snapshot', 1, null, undefined])('rejects %p', (kind) => {
    expect(isMessageKind(kind)).toBe(false);
  });
});

describe('isProtocolMessage', () => {
  it('accepts a message produced by createMessage', () => {
    expect(isProtocolMessage(createMessage('hello', { slot: 1 }, 0))).toBe(true);
  });

  it.each([
    ['a non-object', 'hello'],
    ['null', null],
    ['a mismatched protocol version', { ...createMessage('hello', null, 0), v: 99 }],
    ['an unknown kind', { ...createMessage('hello', null, 0), kind: 'join' }],
    ['a non-integer sequence', { ...createMessage('hello', null, 0), seq: 1.5 }],
    ['a negative sequence', { ...createMessage('hello', null, 0), seq: -1 }],
    ['a missing payload', { v: 1, kind: 'hello', seq: 0, sentAt: 0 }],
  ])('rejects %s', (_label, value) => {
    expect(isProtocolMessage(value)).toBe(false);
  });
});
