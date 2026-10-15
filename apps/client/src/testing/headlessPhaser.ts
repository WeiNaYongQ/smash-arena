/**
 * Minimal browser-API stubs so Phaser can boot under jsdom in HEADLESS mode.
 *
 * jsdom implements the DOM but not `<canvas>` rendering, and it does not load
 * `<img>` resources. Phaser needs both to finish booting:
 *
 *   - `HTMLCanvasElement.getContext('2d')` for its canvas renderer and text
 *     measurement.
 *   - `new Image()` `onload` callbacks, because its TextureManager waits for
 *     the built-in placeholder textures to load before emitting `ready`
 *     (Phaser's `Game` will not activate any scene until then).
 *   - `window.focus()`, which jsdom reports as "Not implemented".
 *
 * These stubs make the scene graph real; they do NOT make pixels real. Nothing
 * here proves how the screen looks in a browser.
 *
 * Call `installHeadlessBrowserStubs()` before importing Phaser.
 */

const NOOP = (): void => undefined;

function createStubContext(canvas: HTMLCanvasElement): Record<string | symbol, unknown> {
  const gradient = { addColorStop: NOOP };
  return new Proxy({} as Record<string | symbol, unknown>, {
    get(_target, property) {
      switch (property) {
        case 'canvas':
          return canvas;
        case 'measureText':
          return () => ({ width: 10, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 });
        case 'createLinearGradient':
        case 'createRadialGradient':
          return () => gradient;
        case 'getImageData':
          return (_x: number, _y: number, width: number, height: number) => ({
            data: new Uint8ClampedArray(width * height * 4),
            width,
            height,
          });
        case 'createImageData':
          return (width: number, height: number) => ({
            data: new Uint8ClampedArray(width * height * 4),
            width,
            height,
          });
        case 'getLineDash':
          return () => [] as number[];
        case 'createPattern':
          return () => null;
        default:
          return NOOP;
      }
    },
    set() {
      return true;
    },
  });
}

function stubCanvasContext(): void {
  const stub = function (this: HTMLCanvasElement): unknown {
    return createStubContext(this);
  };
  HTMLCanvasElement.prototype.getContext = stub as unknown as HTMLCanvasElement['getContext'];
}

/** An `Image` whose `onload` fires on the next macrotask after `src` is assigned. */
class LoadableImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 32;
  height = 32;
  naturalWidth = 32;
  naturalHeight = 32;
  complete = true;
  crossOrigin: string | null = null;

  private source = '';

  get src(): string {
    return this.source;
  }

  set src(value: string) {
    this.source = value;
    setTimeout(() => {
      this.onload?.();
    }, 0);
  }

  addEventListener(type: string, callback: () => void): void {
    if (type === 'load') {
      setTimeout(callback, 0);
    }
  }

  removeEventListener(): void {
    NOOP();
  }
}

function stubImageLoading(): void {
  (globalThis as { Image?: unknown }).Image = LoadableImage;
}

/** jsdom logs "Not implemented" for window.focus(), which Phaser calls while booting. */
function stubWindowFocus(): void {
  window.focus = (): void => NOOP();
}

export function installHeadlessBrowserStubs(): void {
  stubCanvasContext();
  stubImageLoading();
  stubWindowFocus();
}

