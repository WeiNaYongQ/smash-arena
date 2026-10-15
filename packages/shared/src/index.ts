/**
 * @smash-arena/shared — the single source of truth for contracts shared by the
 * client and the server.
 *
 * Milestone M1 (foundation) only. Nothing here implements gameplay, pairing,
 * or transport.
 */
export { SHARED_PACKAGE_NAME, SHARED_PACKAGE_VERSION } from './packageInfo.js';

export {
  LOGICAL_ACTIONS,
  createEmptyActionState,
  isLogicalAction,
  isLogicalActionState,
} from './protocol/actions.js';
export type { LogicalAction, LogicalActionState } from './protocol/actions.js';

export { PROTOCOL_VERSION, isProtocolVersion } from './protocol/version.js';
export type { ProtocolVersion } from './protocol/version.js';

export {
  MESSAGE_KINDS,
  createMessage,
  isMessageKind,
  isProtocolMessage,
} from './protocol/messages.js';
export type { MessageKind, ProtocolMessage } from './protocol/messages.js';

export {
  DEFAULT_ITEMS_ENABLED,
  DEFAULT_MATCH_CONFIG,
  DEFAULT_MATCH_DURATION_SECONDS,
  DEFAULT_SIMULATION_HZ,
  DEFAULT_STOCKS_PER_PLAYER,
  MAX_PLAYERS,
  MIN_PLAYERS,
  SUPPORTED_PLAYER_COUNTS,
  isSupportedPlayerCount,
} from './match/matchDefaults.js';
export type { MatchConfig } from './match/matchDefaults.js';

export { HEALTH_ROUTE, SERVER_SERVICE_NAME, isHealthStatus } from './health.js';
export type { HealthStatus } from './health.js';
