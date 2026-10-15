/**
 * Logical input actions shared by keyboard, gamepad, and (later) phone
 * controllers. See docs/TECHNICAL_DESIGN.md section 5 and
 * docs/GAME_DESIGN.md section 2.
 *
 * This is the vocabulary only. Device mapping and transport are not part of
 * the foundation milestone.
 */
export const LOGICAL_ACTIONS = [
  'left',
  'right',
  'jump',
  'fastFall',
  'light',
  'heavy',
  'special',
  'dodge',
] as const;

export type LogicalAction = (typeof LOGICAL_ACTIONS)[number];

/** A full snapshot of every logical action as held/released. */
export type LogicalActionState = Readonly<Record<LogicalAction, boolean>>;

/** Returns a state where nothing is held. Used as the safe default and after disconnects. */
export function createEmptyActionState(): LogicalActionState {
  const state = {} as Record<LogicalAction, boolean>;
  for (const action of LOGICAL_ACTIONS) {
    state[action] = false;
  }
  return state;
}

export function isLogicalAction(value: unknown): value is LogicalAction {
  return typeof value === 'string' && (LOGICAL_ACTIONS as readonly string[]).includes(value);
}

/** Type guard for a complete action snapshot produced by {@link createEmptyActionState}. */
export function isLogicalActionState(value: unknown): value is LogicalActionState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return LOGICAL_ACTIONS.every((action) => typeof candidate[action] === 'boolean');
}
