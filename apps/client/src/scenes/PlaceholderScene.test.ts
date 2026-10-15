// @vitest-environment jsdom
/**
 * Boots the foundation placeholder screen under Phaser's HEADLESS renderer and
 * asserts the display objects it creates.
 *
 * Evidence scope: this proves the scene starts and builds the expected scene
 * graph with the expected text. It does NOT prove visual appearance in a real
 * browser — no browser is available in the sandbox. See PROJECT_STATUS.md.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type PhaserNamespace from 'phaser';

import { DEFAULT_MATCH_CONFIG } from '@smash-arena/shared';

import { GAME_HEIGHT, GAME_WIDTH } from '../gameConfig.js';
import { installHeadlessBrowserStubs } from '../testing/headlessPhaser.js';

import type { PlaceholderScene as PlaceholderSceneClass } from './PlaceholderScene.js';

let Phaser: typeof PhaserNamespace;
let PlaceholderScene: typeof PlaceholderSceneClass;
let PLACEHOLDER_SCENE_KEY: string;

beforeAll(async () => {
  installHeadlessBrowserStubs();
  Phaser = (await import('phaser')).default;
  ({ PlaceholderScene, PLACEHOLDER_SCENE_KEY } = await import('./PlaceholderScene.js'));
});

async function bootPlaceholderScene(): Promise<PhaserNamespace.Game> {
  const parent = document.createElement('div');
  document.body.appendChild(parent);

  const game = new Phaser.Game({
    type: Phaser.HEADLESS,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    banner: false,
    scene: [PlaceholderScene],
  });

  // Phaser activates the first scene from its own loop, so let it tick.
  // `Game#start` is typed protected but is the documented way to run the loop.
  (game as unknown as { start(): void }).start();
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 16));
    if (game.scene.isActive(PLACEHOLDER_SCENE_KEY)) {
      return game;
    }
  }
  game.destroy(true);
  throw new Error(`${PLACEHOLDER_SCENE_KEY} did not become active within 5s`);
}

describe('PlaceholderScene', () => {
  let game: PhaserNamespace.Game;

  beforeAll(async () => {
    game = await bootPlaceholderScene();
  });

  afterAll(() => {
    game.destroy(true);
  });

  it('registers under a stable scene key and becomes active', () => {
    expect(PLACEHOLDER_SCENE_KEY).toBe('PlaceholderScene');
    expect(game.scene.isActive(PLACEHOLDER_SCENE_KEY)).toBe(true);
  });

  it('builds the placeholder arena: outline, floor, three platforms, one marker per player', () => {
    const scene = game.scene.getScene(PLACEHOLDER_SCENE_KEY);
    const objects = scene.children.list;
    const byType = (type: string): number => objects.filter((child) => child.type === type).length;

    expect(byType('Graphics')).toBe(1);
    expect(byType('Rectangle')).toBe(1 + 3 + DEFAULT_MATCH_CONFIG.playerCount);
    expect(byType('Text')).toBe(4);
    expect(objects).toHaveLength(1 + 1 + 3 + DEFAULT_MATCH_CONFIG.playerCount + 4);
  });

  it('renders the title and the shared-contract build information', () => {
    const scene = game.scene.getScene(PLACEHOLDER_SCENE_KEY);
    const rendered = scene.children.list
      .filter((child) => child.type === 'Text')
      .map((child) => (child as PhaserNamespace.GameObjects.Text).text)
      .join('\n');

    expect(rendered).toContain('SMASH ARENA');
    expect(rendered).toContain('no gameplay implemented yet');
    expect(rendered).toContain('Milestone M1');
    expect(rendered).toContain('@smash-arena/shared v');
    expect(rendered).toContain('protocol version: 1');
    expect(rendered).toContain('not in this build');
  });
});
