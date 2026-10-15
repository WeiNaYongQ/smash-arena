import { describe, expect, it } from 'vitest';

import {
  ARENA_WIDTH_RATIO,
  FLOOR_HEIGHT,
  computePlaceholderLayout,
  isWithinViewport,
  type Size,
} from './layout.js';

const VIEWPORT: Size = { width: 1280, height: 720 };

describe('computePlaceholderLayout', () => {
  it('centres an arena region inside the viewport', () => {
    const { bounds } = computePlaceholderLayout(VIEWPORT, 2);
    expect(bounds.width).toBe(Math.round(VIEWPORT.width * ARENA_WIDTH_RATIO));
    expect(bounds.x).toBe(Math.round((VIEWPORT.width - bounds.width) / 2));
    expect(isWithinViewport(bounds, VIEWPORT)).toBe(true);
  });

  it('puts a full-width floor at the bottom of the arena region', () => {
    const { bounds, floor } = computePlaceholderLayout(VIEWPORT, 2);
    expect(floor).toEqual({
      x: bounds.x,
      y: bounds.y + bounds.height - FLOOR_HEIGHT,
      width: bounds.width,
      height: FLOOR_HEIGHT,
    });
  });

  it('produces exactly three platforms, all above the floor and inside the arena', () => {
    const { bounds, floor, platforms } = computePlaceholderLayout(VIEWPORT, 2);
    expect(platforms).toHaveLength(3);
    for (const platform of platforms) {
      expect(isWithinViewport(platform, VIEWPORT)).toBe(true);
      expect(platform.y + platform.height).toBeLessThanOrEqual(floor.y);
      expect(platform.x).toBeGreaterThanOrEqual(bounds.x);
      expect(platform.x + platform.width).toBeLessThanOrEqual(bounds.x + bounds.width);
    }
  });

  it('is symmetrical left-to-right', () => {
    const { bounds, platforms } = computePlaceholderLayout(VIEWPORT, 4);
    const [left, centre, right] = platforms;
    expect(left).toBeDefined();
    expect(centre).toBeDefined();
    expect(right).toBeDefined();

    const centreX = bounds.x + bounds.width / 2;
    expect(centre!.x + centre!.width / 2).toBeCloseTo(centreX, 0);

    const leftGap = left!.x - bounds.x;
    const rightGap = bounds.x + bounds.width - (right!.x + right!.width);
    expect(leftGap).toBe(rightGap);
    expect(left!.width).toBe(right!.width);
    expect(left!.y).toBe(right!.y);
  });

  it.each([2, 3, 4])('creates one spawn marker per player for %p players', (playerCount) => {
    const { floor, spawns } = computePlaceholderLayout(VIEWPORT, playerCount);
    expect(spawns).toHaveLength(playerCount);
    for (const spawn of spawns) {
      expect(spawn.y).toBe(floor.y);
    }
    const xs = spawns.map((spawn) => spawn.x);
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
  });

  it('keeps every spawn inside the arena horizontally', () => {
    const { bounds, spawns } = computePlaceholderLayout(VIEWPORT, 4);
    for (const spawn of spawns) {
      expect(spawn.x).toBeGreaterThanOrEqual(bounds.x);
      expect(spawn.x).toBeLessThanOrEqual(bounds.x + bounds.width);
    }
  });

  it('stays inside the viewport for a small canvas too', () => {
    const small: Size = { width: 480, height: 270 };
    const layout = computePlaceholderLayout(small, 4);
    expect(isWithinViewport(layout.bounds, small)).toBe(true);
    expect(isWithinViewport(layout.floor, small)).toBe(true);
    for (const platform of layout.platforms) {
      expect(isWithinViewport(platform, small)).toBe(true);
    }
  });
});

describe('input validation', () => {
  it.each([1, 5, 0, -2, 2.5, Number.NaN])('rejects unsupported player count %p', (playerCount) => {
    expect(() => computePlaceholderLayout(VIEWPORT, playerCount)).toThrow(RangeError);
  });

  it.each([
    [{ width: 0, height: 720 }, 2],
    [{ width: 1280, height: 0 }, 2],
    [{ width: -1, height: 720 }, 2],
    [{ width: Number.NaN, height: 720 }, 2],
  ])('rejects invalid viewport %p', (viewport, playerCount) => {
    expect(() => computePlaceholderLayout(viewport as Size, playerCount)).toThrow(RangeError);
  });
});

describe('isWithinViewport', () => {
  it('rejects rectangles that overflow the viewport', () => {
    expect(isWithinViewport({ x: 1270, y: 0, width: 20, height: 10 }, VIEWPORT)).toBe(false);
    expect(isWithinViewport({ x: 0, y: 715, width: 10, height: 20 }, VIEWPORT)).toBe(false);
    expect(isWithinViewport({ x: 0, y: 0, width: 0, height: 10 }, VIEWPORT)).toBe(false);
  });
});
