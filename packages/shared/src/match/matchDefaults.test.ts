import { describe, expect, it } from 'vitest';

import {
  DEFAULT_MATCH_CONFIG,
  DEFAULT_MATCH_DURATION_SECONDS,
  DEFAULT_STOCKS_PER_PLAYER,
  MAX_PLAYERS,
  MIN_PLAYERS,
  isSupportedPlayerCount,
} from './matchDefaults.js';

describe('documented initial gameplay defaults', () => {
  it('supports 2 to 4 players', () => {
    expect(MIN_PLAYERS).toBe(2);
    expect(MAX_PLAYERS).toBe(4);
  });

  it('uses three stocks per player', () => {
    expect(DEFAULT_STOCKS_PER_PLAYER).toBe(3);
  });

  it('uses a five-minute timer', () => {
    expect(DEFAULT_MATCH_DURATION_SECONDS).toBe(300);
  });

  it('disables items and targets a 60 Hz simulation', () => {
    expect(DEFAULT_MATCH_CONFIG).toEqual({
      playerCount: 2,
      stocksPerPlayer: 3,
      matchDurationSeconds: 300,
      itemsEnabled: false,
      simulationHz: 60,
    });
  });

  it('freezes the shared default so consumers cannot mutate it', () => {
    expect(Object.isFrozen(DEFAULT_MATCH_CONFIG)).toBe(true);
  });
});

describe('isSupportedPlayerCount', () => {
  it.each([2, 3, 4])('accepts %p', (count) => {
    expect(isSupportedPlayerCount(count)).toBe(true);
  });

  it.each([0, 1, 5, 2.5, NaN, '2', null, undefined])('rejects %p', (count) => {
    expect(isSupportedPlayerCount(count)).toBe(false);
  });
});
