import { defineConfig } from 'vitest/config';

/**
 * Single Vitest configuration for the whole monorepo.
 *
 * Unit tests live next to the source they cover:
 *   - packages/shared/src/...  (*.test.ts)
 *   - apps/server/src/...      (*.test.ts)
 *   - apps/client/src/...      (*.test.ts)
 *
 * Cross-package integration tests live in `tests/` so that the documented
 * repository map (see README.md) keeps a dedicated place for checks that span
 * more than one workspace.
 *
 * The default environment is Node. One client test opts into jsdom via a
 * `// @vitest-environment jsdom` header so it can boot Phaser headlessly; see
 * apps/client/src/scenes/PlaceholderScene.test.ts.
 */
export default defineConfig({
  resolve: {
    // Phaser's `main` field points at unbundled sources that require a
    // dev-only debug module (`phaser3spectorjs`). Prefer the `browser` build,
    // which is also what the real client bundle resolves to, so tests exercise
    // the same artifact the browser loads.
    mainFields: ['browser', 'module', 'jsnext:main', 'jsnext', 'main'],
  },
  test: {
    environment: 'node',
    include: [
      'packages/*/src/**/*.test.ts',
      'apps/*/src/**/*.test.ts',
      'tests/**/*.test.ts',
    ],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
