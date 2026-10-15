# Testing Strategy

**Status:** Section 2 reflects tests that actually exist and were run in the M1 foundation task. Sections 3 to 10 remain planned requirements.

## 1. General rules

- Add tests for changed behavior.
- Run the relevant tests and build checks before opening a PR.
- Report exact commands and results.
- Label unavailable or unrun checks **NOT TESTED**.
- Never use a passing unit test as proof that an untested real-device flow works.
- Keep test scope proportional to the change and update this document as coverage grows.

## 2. Foundation checks

Implemented as of the M1 foundation task. Commands run from the repository root.

| Check | Command | How it is covered |
| --- | --- | --- |
| Client development command starts | `npm run dev:client` | Manual/agent run: Vite serves `http://127.0.0.1:5173/` with HTTP 200. Not covered by an automated test. |
| Server starts and responds to its health check | `npm run dev:server`, `curl http://127.0.0.1:8787/health` | Automated: `apps/server/src/app.test.ts` binds an ephemeral port and asserts status, headers, and body. Also run manually with `curl`. |
| Shared package imports work in client and server | `npm test` | Automated: `tests/foundation.test.ts` imports `@smash-arena/shared` through the workspace link and asserts both a client module and the server health payload use it. |
| Automated test command runs | `npm test` | Vitest 5, single root config. `pretest` builds `packages/shared` first. |
| Typecheck | `npm run typecheck` | Runs `tsc` in all three workspaces. |
| Production/build command succeeds | `npm run build` | Builds `shared` (tsc), `server` (tsc), `client` (tsc --noEmit + vite build). `npm run preview:client` serves the result. |
| Everything CI runs | `npm run verify` | `typecheck` + `test` + `build`, mirrored by `.github/workflows/ci.yml`. |
| Placeholder screen renders | — | Partially automated: `apps/client/src/scenes/PlaceholderScene.test.ts` boots Phaser headlessly inside jsdom with a stubbed 2D context and asserts the scene activates and creates the expected display objects. **This is not a rendering test.** Visual confirmation in a real browser is still a manual step. |
| Setup instructions work from a clean checkout | `npm ci && npm run verify` | Covered by CI. Not re-verified by hand on a second machine. |

### What the headless client test does and does not prove

`apps/client/src/testing/headlessPhaser.ts` stubs `HTMLCanvasElement.getContext`, `Image` loading, and `window.focus` so Phaser can boot under jsdom in HEADLESS mode. It proves:

- the scene class loads, registers under its key, and becomes active;
- `create()` runs without throwing;
- the expected number and types of display objects exist, with the expected text.

It does not prove pixels, WebGL behaviour, real canvas text measurement, frame rate, or how the screen looks. Treat any visual claim as untested until a human opens the page.

## 3. Movement and physics

Test:
- Ground movement and direction changes.
- Jump and double-jump limits.
- Air control and fast-fall.
- Platform landing and collision boundaries.
- Blast-zone crossing and KO handling.
- Respawn placement and spawn protection.
- Consistent behavior at simulation boundaries.

## 4. Combat

Test:
- Startup, active, and recovery phases.
- Hitbox overlap and valid targets.
- Damage and knockback scaling.
- Hitstun and dodge timing.
- Attack hit tracking to prevent unintended repeated hits.
- Simultaneous attacks and simultaneous KOs.
- Stock decrement, respawn, and match-end conditions.
- Timeout ranking and tie-breaks.

## 5. Input

Test:
- Keyboard and gamepad mapping.
- Multiple simultaneous buttons.
- Correct press/release behavior.
- Focus loss and stale held inputs.
- Phone touch start/release and rapid taps.
- Disconnect clears held input safely.
- Reconnection does not duplicate player slots.

## 6. Phone controller and local hosting

Manual tests on actual supported devices are mandatory before declaring the feature complete.

Test:
- Laptop can host a session without internet.
- Phone and laptop share a reachable Wi-Fi or hotspot network.
- A phone can enter a valid code and join.
- Invalid, expired, and repeatedly guessed codes are handled safely.
- Each phone receives the intended player slot.
- The host displays connection state.
- Disconnect/reconnect restores the correct slot without duplicate players.
- Multiple phones and mixed keyboard/gamepad/phone inputs work together.
- Host shutdown invalidates the session and cleans up resources.
- Firewall, network isolation, changing local address, and browser restrictions produce understandable errors.
- No cloud service or paid API is needed for offline local play.

## 7. Online multiplayer

Test:
- Private-room creation and joining.
- Invalid membership and malformed messages.
- Input rate and payload limits.
- Authoritative movement/combat results.
- Snapshot processing and remote interpolation.
- Disconnect, reconnect, room cleanup, and expired credentials.
- Latency, jitter, packet loss, and out-of-order input behavior where supported by the test harness.

## 8. Security and privacy

- Never commit secrets, tokens, or private credentials.
- Do not log pairing credentials.
- Validate every network message.
- Do not trust client-reported positions, hits, damage, stocks, or victory.
- Rate-limit pairing attempts and input traffic.
- Keep local session exposure limited and document host binding behavior.
- Avoid collecting personal information unnecessary to play.

## 9. Performance

Measure rather than assume:
- Simulation update duration.
- Client frame rate on target low-end hardware.
- Message frequency and payload size.
- CPU and memory use during a four-player match.
- Behavior under simulated network delay and jitter.

A 60 Hz simulation is a target, not a verified guarantee until measurements support it.

## 10. Release readiness

Before release:
- Run automated tests and production builds.
- Complete manual local-device and online smoke tests.
- Verify setup and troubleshooting documentation.
- Review known issues and hosting limits.
- Confirm no paid service is required for local play.
- Confirm all critical acceptance criteria have evidence.
