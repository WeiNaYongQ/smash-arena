import { MAX_PLAYERS, MIN_PLAYERS, isSupportedPlayerCount } from '@smash-arena/shared';

/**
 * Pure geometry for the foundation placeholder screen.
 *
 * Deliberately free of any Phaser/DOM reference so it can be unit-tested in
 * Node. It lays out one symmetrical arena region with a floor and three
 * platforms, matching docs/GAME_DESIGN.md section 7 ("one fixed, symmetrical
 * test arena made from simple geometric shapes").
 *
 * This is presentation scaffolding only. It is not the stage, its collision
 * data, or its blast zones; those arrive in milestone M2.
 */

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

/** Rectangle in top-left-origin pixels, the convention used across the client. */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlaceholderLayout {
  /** The arena region, centred in the viewport. */
  bounds: Rect;
  /** The solid floor band at the bottom of the arena region. */
  floor: Rect;
  /** Three platforms: left, centre, right. */
  platforms: Rect[];
  /** One marker per player, on the floor line, evenly spaced. */
  spawns: Point[];
}

export const ARENA_WIDTH_RATIO = 0.8;
export const ARENA_HEIGHT_RATIO = 0.5;
export const ARENA_BOTTOM_MARGIN_RATIO = 0.22;
export const FLOOR_HEIGHT = 24;
export const PLATFORM_HEIGHT = 12;
export const SIDE_PLATFORM_WIDTH_RATIO = 0.24;
export const CENTRE_PLATFORM_WIDTH_RATIO = 0.34;
export const SIDE_PLATFORM_INSET_RATIO = 0.1;
export const SIDE_PLATFORM_HEIGHT_RATIO = 0.58;
export const CENTRE_PLATFORM_HEIGHT_RATIO = 0.32;
export const SPAWN_SPAN_RATIO = 0.6;

function assertPositiveSize(viewport: Size): void {
  if (
    !Number.isFinite(viewport.width) ||
    !Number.isFinite(viewport.height) ||
    viewport.width <= 0 ||
    viewport.height <= 0
  ) {
    throw new RangeError(
      `viewport must have positive finite dimensions, received ${viewport.width}x${viewport.height}`,
    );
  }
}

/** Rejects player counts outside the documented 2-4 range instead of silently clamping. */
export function assertSupportedPlayerCount(playerCount: number): number {
  if (!isSupportedPlayerCount(playerCount)) {
    throw new RangeError(`playerCount must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}, received ${playerCount}`);
  }
  return playerCount;
}

export function computePlaceholderLayout(viewport: Size, playerCount: number): PlaceholderLayout {
  assertPositiveSize(viewport);
  assertSupportedPlayerCount(playerCount);

  const boundsWidth = Math.round(viewport.width * ARENA_WIDTH_RATIO);
  const boundsHeight = Math.round(viewport.height * ARENA_HEIGHT_RATIO);
  const bounds: Rect = {
    x: Math.round((viewport.width - boundsWidth) / 2),
    y: Math.round(viewport.height - boundsHeight - viewport.height * ARENA_BOTTOM_MARGIN_RATIO),
    width: boundsWidth,
    height: boundsHeight,
  };

  const floor: Rect = {
    x: bounds.x,
    y: bounds.y + bounds.height - FLOOR_HEIGHT,
    width: bounds.width,
    height: FLOOR_HEIGHT,
  };

  const sideWidth = Math.round(bounds.width * SIDE_PLATFORM_WIDTH_RATIO);
  const inset = Math.round(bounds.width * SIDE_PLATFORM_INSET_RATIO);
  const sideY = Math.round(bounds.y + bounds.height * SIDE_PLATFORM_HEIGHT_RATIO);
  const centreWidth = Math.round(bounds.width * CENTRE_PLATFORM_WIDTH_RATIO);
  const centreY = Math.round(bounds.y + bounds.height * CENTRE_PLATFORM_HEIGHT_RATIO);

  const platforms: Rect[] = [
    { x: bounds.x + inset, y: sideY, width: sideWidth, height: PLATFORM_HEIGHT },
    {
      x: bounds.x + Math.round((bounds.width - centreWidth) / 2),
      y: centreY,
      width: centreWidth,
      height: PLATFORM_HEIGHT,
    },
    {
      x: bounds.x + bounds.width - inset - sideWidth,
      y: sideY,
      width: sideWidth,
      height: PLATFORM_HEIGHT,
    },
  ];

  const spanStart = bounds.x + Math.round((bounds.width * (1 - SPAWN_SPAN_RATIO)) / 2);
  const spanWidth = Math.round(bounds.width * SPAWN_SPAN_RATIO);
  const spawnY = floor.y;
  const spawns: Point[] = [];
  for (let index = 0; index < playerCount; index += 1) {
    const t = playerCount === 1 ? 0.5 : index / (playerCount - 1);
    spawns.push({ x: Math.round(spanStart + spanWidth * t), y: spawnY });
  }

  return { bounds, floor, platforms, spawns };
}

/** True when every rectangle fits inside the given viewport. */
export function isWithinViewport(rect: Rect, viewport: Size): boolean {
  return (
    rect.x >= 0 &&
    rect.y >= 0 &&
    rect.width > 0 &&
    rect.height > 0 &&
    rect.x + rect.width <= viewport.width &&
    rect.y + rect.height <= viewport.height
  );
}
