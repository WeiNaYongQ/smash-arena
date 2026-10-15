# Cross-package tests

This directory holds tests that span more than one workspace — for example, checks that
`@smash-arena/shared` resolves correctly for both the client and the server, and that the
server's health endpoint matches the contract declared in the shared package.

Tests that cover a single workspace live next to the code they exercise:

- `packages/shared/src/**/*.test.ts`
- `apps/server/src/**/*.test.ts`
- `apps/client/src/**/*.test.ts`

Run everything from the repository root:

```bash
npm test          # single run
npm run test:watch
```

The root `pretest` hook builds `@smash-arena/shared` first, because these tests import it
through the workspace link (its `dist` output), not through its source.
