import { describe, expect, it } from 'vitest';

import {
  LOGICAL_ACTIONS,
  createEmptyActionState,
  isLogicalAction,
  isLogicalActionState,
} from './actions.js';

describe('LOGICAL_ACTIONS', () => {
  it('contains exactly the actions specified in the game design document', () => {
    expect(LOGICAL_ACTIONS).toEqual([
      'left',
      'right',
      'jump',
      'fastFall',
      'light',
      'heavy',
      'special',
      'dodge',
    ]);
  });

  it('has no duplicates', () => {
    expect(new Set(LOGICAL_ACTIONS).size).toBe(LOGICAL_ACTIONS.length);
  });
});

describe('createEmptyActionState', () => {
  it('releases every logical action', () => {
    const state = createEmptyActionState();
    for (const action of LOGICAL_ACTIONS) {
      expect(state[action], action).toBe(false);
    }
  });

  it('returns an independent object on each call', () => {
    const a = createEmptyActionState();
    const b = createEmptyActionState();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});

describe('isLogicalAction', () => {
  it('accepts known actions', () => {
    for (const action of LOGICAL_ACTIONS) {
      expect(isLogicalAction(action), action).toBe(true);
    }
  });

  it.each([undefined, null, 0, {}, [], 'up', 'Left', ''])('rejects %p', (value) => {
    expect(isLogicalAction(value)).toBe(false);
  });
});

describe('isLogicalActionState', () => {
  it('accepts a state created by createEmptyActionState', () => {
    expect(isLogicalActionState(createEmptyActionState())).toBe(true);
  });

  it('rejects a state that is missing an action', () => {
    const partial = createEmptyActionState() as Record<string, boolean>;
    delete partial.dodge;
    expect(isLogicalActionState(partial)).toBe(false);
  });

  it.each([undefined, null, 42, 'left', [], { left: 'yes' }])('rejects %p', (value) => {
    expect(isLogicalActionState(value)).toBe(false);
  });
});
