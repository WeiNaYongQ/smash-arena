# Project Status

**Status:** M1 project foundation implemented; no gameplay implemented.  
**Current milestone:** M1 — project foundation (first PR open, awaiting manual review).  
**Last updated:** 2026-10-15

## Confirmed product decisions

- Original browser-based 2D platform fighter, up to four players.
- Balanced development across gameplay, architecture, and networking.
- Keyboard and gamepad support are launch goals.
- Phone browser can act as a controller without streaming game video.
- Local sessions use a laptop-hosted server. Phones join by entering a short session code and connecting over a reachable local network.
- Local play must not require internet, paid hosting, or an account.
- Use geometric placeholders before investing in original sprites and animation.
- Guest play first; do not require player accounts for local play or initial private rooms.
- Online private rooms precede unranked matchmaking; ranked play is later.
- Arena AI Agent must create one focused PR per chat and must never merge its own PR.
- Every PR requires manual review.

## Initial gameplay defaults

- 2–4 players, free-for-all.
- Three stocks per player.
- Five-minute timer.
- Percentage-based damage and knockback.
- Light, heavy, and special attacks; dodge; run, jump, double jump, air control, and fast-fall.
- Items off in the initial competitive ruleset.
- One symmetrical stage with platforms and blast zones.

Timeout ranking, tie-breaking, simultaneous KOs, self-destruct scoring, respawn timing, and exact attack data must be fully specified before the match lifecycle is considered complete.

These values are now encoded as constants in `packages/shared/src/match/matchDefaults.ts` and covered by tests. **Encoding a default is not implementing the rule** — the match lifecycle is still milestone M4.

## Current implementation state

Implemented and verified in this repository:

- **Monorepo scaffold.** npm workspaces with three packages: `apps/client`, `apps/server`, `packages/shared`. One root `package.json`, one `tsconfig.base.json`, one `vitest.config.ts`.
- **`@smash-arena/shared`.** Logical input action vocabulary, a message envelope (not connected to any socket), the wire protocol version (`1`), documented match defaults, and the server health contract with a runtime type guard. Builds to `dist/` with declaration files and is consumed by both applications through the npm workspace link.
- **Server (`@smash-arena/server`).** A plain `node:http` server exposing `GET /health` only. `HOST`/`PORT` configuration with validation, loopback bind by default, `EADDRINUSE` handling, and SIGINT/SIGTERM graceful shutdown. No HTTP framework dependency.
- **Client (`@smash-arena/client`).** Phaser 3 + Vite. One scene, `PlaceholderScene`, drawing a symmetrical arena region, a floor, three platforms, one spawn marker per player, and text showing the shared-contract build information. No simulation, no input handling, no networking.
- **Tests.** 131 tests across 14 files (shared unit tests, server unit and HTTP tests, client unit tests, a headless Phaser scene test, and cross-package integration tests in `tests/`).
- **CI.** `.github/workflows/ci.yml` runs `npm ci`, typecheck, tests, and build on Node 22.

Deliberately **not** implemented: movement, physics, collision, combat, match lifecycle, stocks/timer, keyboard or gamepad input, phone pairing, local session codes, online rooms, matchmaking, ranked play, art, audio, and deployment.

## Technical decisions still requiring validation

- **Socket.IO or Colyseus.** Still open (D-009). Nothing in the repository opens a socket, so no library was needed. The comparison should be run as its own task before milestone M6/M8.
- **Phaser 3 vs Phaser 4.** `phaser@latest` on the registry is now **4.2.1**; the planning documents specify Phaser 3. This PR pins **Phaser 3.90.0** to follow the documented plan and records the finding as D-012. Migrating to Phaser 4 is a separate, scoped decision — do not fold it into a gameplay milestone.
- **TypeScript major version.** Installed: 6.0.3. The registry `latest` is 7.0.2 (the native-port line). Not evaluated here; recorded in D-011.
- **Local address discovery and phone connectivity.** Still unverified on real laptops, browsers, and phones.
- **Production hosting provider.** Unchanged; check current free-tier limits and WebSocket support before choosing.

## Known constraints and risks

- A session code identifies a room but cannot replace a network path to the laptop.
- Wi-Fi client isolation, firewall settings, hotspot limitations, and mobile browser behavior may prevent local connection.
- Free online hosting can sleep, impose quotas, change pricing, or be discontinued.
- Low-end hardware performance must be measured; do not assume a 60 Hz simulation is achieved without profiling.
- A server-authoritative architecture improves integrity but does not guarantee perfect anti-cheat.
- The production client bundle is ~1.2 MB uncompressed (320 KB gzipped), dominated by Phaser. Vite warns about the chunk size. Acceptable for a placeholder; code-splitting should be revisited before shipping.
- The placeholder screen is verified headlessly, not in a real browser (see Test evidence).

## Next recommended task

**M2 — Movement and stage, first PR:** Add a geometric test stage and horizontal ground movement driven by the logical `left`/`right` actions, with a fixed-timestep update loop decoupled from rendering, plus unit tests for boundaries and edge cases.

Keep it to that. Do not bundle jumping, collision, combat, input-device mapping, or networking into that PR.

## Test evidence

Environment: Node.js v22.22.3, npm 10.9.8, Linux (agent sandbox). All commands below were actually run.

| Command | Result |
| --- | --- |
| `npm install` | 46 packages added, no errors. |
| `npm run typecheck` | Exit code 0. No TypeScript errors in client, server, or shared. |
| `npm test` | **14 test files passed, 131 tests passed, 0 failed** (Vitest 5.0.4). |
| `npm run build` | Succeeded for shared (`tsc`), server (`tsc`), client (`tsc --noEmit` + `vite build`). Only warning: client chunk > 500 kB (Phaser). |
| `npm run dev:server` then `curl -i http://127.0.0.1:8787/health` | `HTTP/1.1 200 OK`, body `{"status":"ok","service":"smash-arena-server","version":"0.1.0","protocolVersion":1,"uptimeSeconds":5,"timestamp":"2026-10-15T10:46:33.028Z"}`. `POST /health` → `405` with `Allow: GET, HEAD`. `GET /nope` → `404`. |
| `npm run dev:client` then `curl -i http://127.0.0.1:5173/` | `HTTP/1.1 200 OK`, `text/html`. Vite serves `/src/main.ts`, and `/src/placeholder/info.ts` resolves `@smash-arena/shared` to `packages/shared/dist/index.js`. |
| `npm run preview:client` then `curl http://127.0.0.1:4173/` | `HTTP/1.1 200 OK`, serving the production bundle `assets/index-BHVrDVrn.js`. The bundle contains the placeholder strings built from the shared package. |
| `npm run verify` (CI equivalent) | Exit code 0, run after deleting every `node_modules` directory and reinstalling with `npm ci` (83 packages). |
| GitHub Actions CI (`.github/workflows/ci.yml`) | **PASS.** Run 38724118214 on `pull_request` for this branch: status `completed`, conclusion `success`, job "Typecheck, test, build" with all steps successful, 29s (started 2026-10-15T10:59:16Z). The raw log could not be downloaded from the agent sandbox because `results-receiver.actions.githubusercontent.com` is outside the sandbox's allowed hosts, so this is the run conclusion from the GitHub API, not quoted log lines. |
| Real browser rendering of the placeholder screen | **NOT TESTED.** No browser is available in the sandbox. `PlaceholderScene` is booted under Phaser's HEADLESS renderer inside jsdom with a stubbed 2D context, which verifies the scene starts and creates 1 graphics outline, 6 rectangles, and 4 text objects with the expected content. It does not verify pixels, layout appearance, WebGL, or performance. A human must open the page once to confirm it looks right. |
| Phone, gamepad, and multi-device scenarios | **NOT TESTED** — not implemented. |
