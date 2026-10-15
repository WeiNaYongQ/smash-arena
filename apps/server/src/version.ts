/**
 * Version of the server package.
 *
 * Kept as a constant rather than importing package.json so the same value works
 * from `tsx` (dev), from compiled `dist` output, and inside Vitest without
 * import-attribute support. `version.test.ts` fails the build if this drifts
 * from package.json.
 */
export const SERVER_VERSION = '0.1.0';
