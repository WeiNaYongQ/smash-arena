import {
  DEFAULT_MATCH_CONFIG,
  LOGICAL_ACTIONS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  PROTOCOL_VERSION,
  SHARED_PACKAGE_NAME,
  SHARED_PACKAGE_VERSION,
} from '@smash-arena/shared';

/**
 * Everything the placeholder screen prints, derived from `@smash-arena/shared`.
 *
 * Keeping this in one framework-free module does two jobs: it gives the client
 * a single place to render build/contract information, and it makes "the
 * client imports the shared package" an assertion that can fail in CI.
 */

export interface PlaceholderInfo {
  title: string;
  subtitle: string;
  milestone: string;
  detailLines: string[];
}

export function buildPlaceholderInfo(): PlaceholderInfo {
  return {
    title: 'SMASH ARENA',
    subtitle: 'Foundation placeholder — no gameplay implemented yet',
    milestone: 'Milestone M1: project foundation',
    detailLines: [
      `shared contract: ${SHARED_PACKAGE_NAME} v${SHARED_PACKAGE_VERSION}`,
      `protocol version: ${PROTOCOL_VERSION}`,
      `players: ${MIN_PLAYERS}-${MAX_PLAYERS}  |  stocks: ${DEFAULT_MATCH_CONFIG.stocksPerPlayer}  |  timer: ${DEFAULT_MATCH_CONFIG.matchDurationSeconds / 60} min  |  items: ${DEFAULT_MATCH_CONFIG.itemsEnabled ? 'on' : 'off'}`,
      `logical actions: ${LOGICAL_ACTIONS.join(', ')}`,
      'not in this build: movement, combat, match lifecycle, phone pairing, online rooms',
    ],
  };
}
