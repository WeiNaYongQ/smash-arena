import { describe, expect, it } from 'vitest';

import {
  AUTO_CENTER,
  BACKGROUND_COLOR,
  GAME_HEIGHT,
  GAME_WIDTH,
  SCALE_MODE,
  createBaseGameConfig,
} from './gameConfig.js';

describe('createBaseGameConfig', () => {
  const parent = { id: 'game' } as unknown as HTMLElement;
  const config = createBaseGameConfig(parent);

  it('uses the documented 1280x720 design resolution', () => {
    expect(GAME_WIDTH).toBe(1280);
    expect(GAME_HEIGHT).toBe(720);
    expect(config.width).toBe(GAME_WIDTH);
    expect(config.height).toBe(GAME_HEIGHT);
  });

  it('mounts into the element supplied by index.html', () => {
    expect(config.parent).toBe(parent);
  });

  it('requests the scale settings main.ts maps onto Phaser enums', () => {
    expect(SCALE_MODE).toBe('FIT');
    expect(AUTO_CENTER).toBe('CENTER_BOTH');
  });

  it('disables the Phaser boot banner and matches the page background', () => {
    expect(config.banner).toBe(false);
    expect(config.backgroundColor).toBe(BACKGROUND_COLOR);
  });

  it('uses simple rendering suitable for geometric placeholders', () => {
    expect(config.render).toEqual({ antialias: false, pixelArt: false });
  });
});
