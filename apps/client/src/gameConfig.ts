/**
 * Base Phaser game configuration.
 *
 * Kept free of any runtime Phaser import so the values stay unit-testable in
 * Node. `SCALE_MODE` and `AUTO_CENTER` are the *names* of Phaser's
 * `Scale.ScaleModes` / `Scale.Center` enum members; `main.ts` resolves them
 * against the real enums, so a Phaser rename would be caught by the typechecker
 * rather than silently passing a string that Phaser ignores.
 */

export interface BaseGameConfig {
  width: number;
  height: number;
  backgroundColor: string;
  parent: HTMLElement;
  render: { antialias: boolean; pixelArt: boolean };
  banner: boolean;
}

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const BACKGROUND_COLOR = '#0b0f16';
export const SCALE_MODE = 'FIT';
export const AUTO_CENTER = 'CENTER_BOTH';

export function createBaseGameConfig(parent: HTMLElement): BaseGameConfig {
  return {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: BACKGROUND_COLOR,
    parent,
    // Geometric placeholders only (decision D-004): no sprite filtering needed.
    render: { antialias: false, pixelArt: false },
    banner: false,
  };
}
