/**
 * Default match parameters from docs/GAME_DESIGN.md section 3 and
 * PROJECT_STATUS.md "Initial gameplay defaults".
 *
 * These are configuration values, not an implemented match. The match
 * lifecycle itself is milestone M4.
 */
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;
export const SUPPORTED_PLAYER_COUNTS = [2, 3, 4] as const;
export const DEFAULT_STOCKS_PER_PLAYER = 3;
export const DEFAULT_MATCH_DURATION_SECONDS = 300;
export const DEFAULT_ITEMS_ENABLED = false;
export const DEFAULT_SIMULATION_HZ = 60;

export interface MatchConfig {
  playerCount: number;
  stocksPerPlayer: number;
  matchDurationSeconds: number;
  itemsEnabled: boolean;
  simulationHz: number;
}

export const DEFAULT_MATCH_CONFIG: Readonly<MatchConfig> = Object.freeze({
  playerCount: MIN_PLAYERS,
  stocksPerPlayer: DEFAULT_STOCKS_PER_PLAYER,
  matchDurationSeconds: DEFAULT_MATCH_DURATION_SECONDS,
  itemsEnabled: DEFAULT_ITEMS_ENABLED,
  simulationHz: DEFAULT_SIMULATION_HZ,
});

export function isSupportedPlayerCount(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    (SUPPORTED_PLAYER_COUNTS as readonly number[]).includes(value)
  );
}
