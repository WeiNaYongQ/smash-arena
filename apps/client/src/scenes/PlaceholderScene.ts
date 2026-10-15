import Phaser from 'phaser';

import { DEFAULT_MATCH_CONFIG } from '@smash-arena/shared';

import { buildPlaceholderInfo } from '../placeholder/info.js';
import { computePlaceholderLayout, type Rect } from '../placeholder/layout.js';

export const PLACEHOLDER_SCENE_KEY = 'PlaceholderScene';

const COLORS = {
  background: 0x0b0f16,
  arenaOutline: 0x2c3a4f,
  floor: 0x4b6584,
  platform: 0x33475f,
  spawn: 0xf0a500,
  title: '#e6edf3',
  muted: '#8b98a5',
} as const;

const SPAWN_MARKER_WIDTH = 20;
const SPAWN_MARKER_HEIGHT = 36;

/**
 * The only scene in the foundation build.
 *
 * It draws the arena placeholder described in docs/GAME_DESIGN.md section 7 and
 * prints the shared-contract build information. It intentionally contains no
 * simulation, input handling, or networking.
 */
export class PlaceholderScene extends Phaser.Scene {
  constructor() {
    super(PLACEHOLDER_SCENE_KEY);
  }

  create(): void {
    const { width, height } = this.scale;
    const info = buildPlaceholderInfo();
    const layout = computePlaceholderLayout({ width, height }, DEFAULT_MATCH_CONFIG.playerCount);

    this.cameras.main.setBackgroundColor(COLORS.background);

    const outline = this.add.graphics();
    outline.lineStyle(2, COLORS.arenaOutline, 1);
    outline.strokeRect(layout.bounds.x, layout.bounds.y, layout.bounds.width, layout.bounds.height);

    this.addCenteredRect(layout.floor, COLORS.floor);
    for (const platform of layout.platforms) {
      this.addCenteredRect(platform, COLORS.platform);
    }
    for (const spawn of layout.spawns) {
      this.add.rectangle(spawn.x, spawn.y - SPAWN_MARKER_HEIGHT / 2, SPAWN_MARKER_WIDTH, SPAWN_MARKER_HEIGHT, COLORS.spawn);
    }

    this.add
      .text(width / 2, 28, info.title, { fontFamily: 'monospace', fontSize: '44px', color: COLORS.title })
      .setOrigin(0.5, 0);
    this.add
      .text(width / 2, 80, info.subtitle, { fontFamily: 'monospace', fontSize: '20px', color: COLORS.muted })
      .setOrigin(0.5, 0);
    this.add
      .text(width / 2, 108, info.milestone, { fontFamily: 'monospace', fontSize: '16px', color: COLORS.muted })
      .setOrigin(0.5, 0);

    const detailBlock = this.add
      .text(24, layout.bounds.y + layout.bounds.height + 24, info.detailLines.join('\n'), {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: COLORS.muted,
        lineSpacing: 4,
      })
      .setOrigin(0, 0);

    // Keep the block inside the canvas even if the viewport is shorter than designed.
    const overflow = detailBlock.y + detailBlock.height - height;
    if (overflow > 0) {
      detailBlock.setY(detailBlock.y - overflow - 4);
    }
  }

  /** Phaser rectangles are positioned by their centre; our layout is top-left origin. */
  private addCenteredRect(rect: Rect, color: number): void {
    this.add.rectangle(rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width, rect.height, color);
  }
}
