# Decision Log

This file records durable product and engineering decisions. New decisions should include context, alternatives, consequences, and evidence where available.

## D-001 — Original browser-based platform fighter

**Status:** Accepted  
**Decision:** Build an original 2D browser platform fighter for up to four players.  
**Reason:** Browser access reduces installation friction and supports desktop plus phone-controller use.  
**Consequences:** Rendering, controls, performance, and browser compatibility must be tested. Use only original or appropriately licensed content.

## D-002 — Local-first play

**Status:** Accepted  
**Decision:** Local play must not require internet access, paid hosting, or mandatory accounts.  
**Reason:** The game must remain usable on a zero budget.  
**Consequences:** The laptop hosts local sessions. Phones require a reachable local network path. A join code is not a substitute for connectivity.

## D-003 — Laptop-hosted phone controllers

**Status:** Accepted  
**Decision:** The laptop runs and renders the match; phones connect through a controller webpage and send inputs only.  
**Reason:** Avoid streaming the game to phones and keep the laptop as the main game display.  
**Consequences:** Pairing, local address discovery/instructions, player-slot assignment, input release safety, and reconnection need dedicated tests.

## D-004 — Geometric placeholders before final art

**Status:** Accepted  
**Decision:** Use simple geometric shapes until movement, combat, and match rules are stable.  
**Reason:** Early art investment would slow iteration on mechanics.  
**Consequences:** Keep game logic independent of final sprites and animation.

## D-005 — Guest play first

**Status:** Accepted  
**Decision:** Do not require accounts for local play or initial private rooms.  
**Reason:** Minimize friction and infrastructure requirements.  
**Consequences:** Private-room access still needs safe session credentials. Revisit identity only when a specific feature requires it.

## D-006 — Private rooms before matchmaking

**Status:** Accepted  
**Decision:** Build online private rooms before unranked matchmaking; ranked mode is later.  
**Reason:** Room and network reliability must be demonstrated before adding queue and rating complexity.  
**Consequences:** Matchmaking and ranking are not part of early milestones.

## D-007 — Manual pull-request merge

**Status:** Accepted  
**Decision:** Each agent chat handles one focused task and opens one PR. The agent must not merge its own PR.  
**Reason:** Human review is the quality gate and limits the impact of mistakes.  
**Consequences:** Every PR needs scope, acceptance criteria, actual test results, documentation updates, and a handoff.

## D-008 — Proposed TypeScript client/server architecture

**Status:** Accepted for the foundation; gameplay architecture still to be proven  
**Decision:** Phaser 3 + TypeScript + Vite client; Node.js + TypeScript server; shared protocol package.  
**Reason:** Clear separation between rendering, simulation, and networking.  
**Consequences:** Validate dependencies and low-end hardware performance before expanding the scaffold.  
**Evidence:** The M1 foundation task installed and built this stack successfully: `npm run typecheck` exit 0, `npm test` 131 tests passed, `npm run build` succeeded for all three packages. Low-end hardware performance is still unmeasured.

## D-009 — WebSocket library not yet selected

**Status:** Open — confirmed still unnecessary as of the M1 foundation task  
**Decision needed:** Compare Socket.IO and Colyseus for room lifecycle, local hosting, client support, testability, maintenance, and deployment.  
**Rule:** Do not silently select one in a large implementation. Record the comparison and recommendation.  
**Note (M1):** The foundation PR adds no networking at all, so selecting a library there would have been a guess. The server currently uses plain `node:http` for a single health route. Run the comparison as its own task before milestone M6 (phone controller) or M8 (online rooms), whichever comes first.

## D-010 — Server-authoritative online combat

**Status:** Accepted design principle  
**Decision:** Online clients send validated inputs; server determines authoritative game outcomes.  
**Reason:** Clients should not be trusted to report their own hits, damage, stocks, or wins.  
**Consequences:** The server simulation and protocol require robust validation and tests. This does not guarantee perfect anti-cheat.

## D-011 — Foundation tooling: npm workspaces, Vitest, TypeScript 6

**Status:** Accepted (M1 foundation)  
**Decision:** One npm-workspaces monorepo (`apps/*`, `packages/*`) with a committed `package-lock.json`; Vitest 5 as the single test runner for every workspace; TypeScript 6.0.3 with strict options shared through `tsconfig.base.json`; GitHub Actions running `npm ci` + typecheck + test + build on Node 22.  
**Alternatives considered:** pnpm workspaces (faster and stricter isolation, but pnpm is not installed in the working environment and npm workspaces already satisfy the requirement); Jest (a second toolchain for no benefit, since Vitest shares Vite's resolver and the client is already Vite-based); TypeScript 7.0.2, the current registry `latest`, which is the native-port line (not adopted, to avoid pairing an unproven compiler with a brand-new toolchain in the same PR).  
**Reason:** Fewest moving parts that still give a real monorepo boundary, one command for all tests, and reproducible CI installs.  
**Consequences:** Contributors must use npm >= 10.9 and Node >= 22.12. `packages/shared` is consumed through its built `dist/` output, so `npm run pretest`/`pretypecheck`/`predev:*` build it first. TypeScript 7 and Vitest/Vite majors should be re-evaluated deliberately, not by a blind `npm update`.

## D-012 — Stay on Phaser 3 while Phaser 4 is the registry latest

**Status:** Accepted (M1 foundation); re-evaluate as a separate task  
**Decision:** Pin `phaser` to **3.90.0** in `apps/client`.  
**Context:** The planning documents specify Phaser 3. At the time of the foundation task, `phaser@latest` on the registry resolved to **4.2.1**, and `3.90.0` is the newest 3.x release. Phaser 4 is a major-version successor with breaking API changes.  
**Alternatives considered:** Adopting Phaser 4 immediately (rejected — it is an architectural migration, not a scaffolding detail, and doing it inside the foundation PR would hide a large change behind a small one).  
**Reason:** The foundation task's job is to validate the documented stack, not to change it.  
**Consequences:** A dedicated comparison task is needed before M2 grows much larger, because every scene written on Phaser 3 is migration work later. That task must cover the renderer API, physics plugins, input, asset loading, TypeScript typings, and bundle size.

## D-013 — Server uses plain node:http; health contract lives in the shared package

**Status:** Accepted (M1 foundation)  
**Decision:** The server is built directly on `node:http` with no framework. `GET /health` is the only route. The response shape (`status`, `service`, `version`, `protocolVersion`, `uptimeSeconds`, `timestamp`) is declared in `packages/shared/src/health.ts` with a runtime `isHealthStatus` guard, and the server binds to `127.0.0.1` unless `HOST` says otherwise.  
**Alternatives considered:** Express or Fastify (rejected — a single JSON route does not justify a dependency, and the eventual WebSocket layer may bring its own HTTP integration); defining the health shape only in the server (rejected — clients, CI probes, and monitoring would each invent their own copy).  
**Reason:** Fewest dependencies, and one contract both sides can assert against.  
**Consequences:** When rooms and simulation arrive, revisit whether a router/framework is worth adding, and keep provider- or framework-specific code out of the simulation. Loopback-by-default means local-LAN play must set `HOST=0.0.0.0` explicitly, which is the safer default for a laptop-hosted session.
