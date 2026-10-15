# Smash Arena

**Smash Arena** is an original browser-based 2D platform fighter inspired by the broad genre of competitive platform fighters. It aims to support up to four players, keyboard and gamepad controls, browser-based phone controllers, local play hosted by a laptop, and online private rooms.

> **Project status:** Milestone M1 (project foundation) is implemented in the repository; no gameplay is implemented yet. The client renders a placeholder screen and the server exposes a health check. Everything else in this repository is still a plan. See [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Core principles

- **Local-first:** Local matches should work without internet or paid services.
- **Laptop-hosted local sessions:** A laptop runs the game and local session server; phones join using a short session code and a network address or supported discovery flow.
- **Phone as controller:** Phones send input only. The laptop renders the game; phones do not stream game video.
- **Authoritative online simulation:** The server decides online movement validity, hits, damage, stocks, KOs, and results.
- **Small reviewed changes:** Each agent session implements one focused task and opens one pull request. Pull requests must not be merged by the agent.
- **Original content:** Character designs, names, artwork, animations, and effects should be original or appropriately licensed.
- **Honest verification:** Never claim a test passed unless it was actually run.

## Initial gameplay target

- 2–4 players, free-for-all.
- Three stocks per player and a five-minute timer as initial defaults.
- Percentage-based damage and knockback.
- Light, heavy, and special attacks; dodge; run, jump, double jump, air control, and fast-fall.
- Items disabled in the initial competitive ruleset.
- One symmetrical stage with platforms and blast zones.
- Geometric placeholders first; original art after core mechanics are stable.

The detailed rules, including simultaneous KOs and timeout tie-breaks, must be specified and tested before the match lifecycle is considered complete.

## Technology direction

| Concern | Choice | Status |
| --- | --- | --- |
| Monorepo / package manager | npm workspaces (npm >= 10.9) | **In use** |
| Language | TypeScript | **In use** |
| Client | Phaser 3 + Vite | **In use** |
| Server | Node.js `node:http`, no framework | **In use** |
| Test runner | Vitest | **In use** |
| Shared package | `@smash-arena/shared` | **In use** |
| Network transport | WebSockets | Planned |
| Room/network library | Socket.IO **or** Colyseus | **Open decision (D-009)** — not needed yet |
| Hosting provider | Undecided | Planned (M13) |

These choices were validated during the M1 foundation task and recorded in [docs/DECISIONS.md](docs/DECISIONS.md). The networking library is deliberately still undecided: nothing in this repository opens a socket yet.

## Getting started

Requirements: **Node.js >= 22.12** (developed and tested on 22.22.3) and **npm >= 10.9**. `pnpm` and `yarn` are not supported.

```bash
npm install     # installs all workspaces from package-lock.json
npm test        # 131 tests across 14 files
npm run build   # builds shared -> server -> client
```

### Run the client

```bash
npm run dev:client
```

Serves the Vite dev server on <http://localhost:5173>. It shows a placeholder arena with geometric shapes and the shared-contract build information. There is no gameplay, no input handling, and no networking in this build.

### Run the server

In a second terminal:

```bash
npm run dev:server
```

Starts the session server on <http://127.0.0.1:8787>. Check it with:

```bash
curl http://127.0.0.1:8787/health
```

```json
{
  "status": "ok",
  "service": "smash-arena-server",
  "version": "0.1.0",
  "protocolVersion": 1,
  "uptimeSeconds": 5,
  "timestamp": "2026-10-15T10:46:33.028Z"
}
```

Any other path returns `404`; a non-`GET`/`HEAD` request to `/health` returns `405` with an `Allow` header. The contract is declared in `packages/shared/src/health.ts` and asserted by tests on both sides.

### Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORT` | `8787` | Server TCP port. |
| `HOST` | `127.0.0.1` | Bind address. Set `0.0.0.0` explicitly to expose the server on the local network. |
| `VITE_DEV_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated Host headers the Vite dev/preview server accepts. Needed when reaching the dev server through another hostname (for example a LAN address or a tunnel). |

The server binds to loopback by default on purpose: `docs/TECHNICAL_DESIGN.md` section 6 asks that the local server not be exposed to wider networks unnecessarily.

### All commands

| Command | What it does |
| --- | --- |
| `npm install` | Install every workspace. |
| `npm test` | Run all unit and integration tests once (builds `shared` first). |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run typecheck` | Typecheck client, server, and shared. |
| `npm run build` | Build `shared`, then `server`, then `client`. |
| `npm run dev:client` | Vite dev server for the client. |
| `npm run dev:server` | `tsx watch` dev server for the session server. |
| `npm run start:server` | Run the compiled server from `apps/server/dist`. |
| `npm run preview:client` | Serve the production client build. |
| `npm run verify` | `typecheck` + `test` + `build`; this is what CI runs. |
| `npm run clean` | Delete build output and caches. |

## Local phone-controller flow (planned)

1. On the laptop, select **Local Play → Host a Match**.
2. The laptop starts a local session server and displays a short-lived code plus clear connection instructions.
3. A phone opens the controller page and enters the code.
4. The phone connects to the laptop over the same Wi-Fi network or a laptop hotspot, then receives a player slot.
5. The laptop renders the match and remains authoritative for local match state.

None of this is implemented yet. A code identifies a session; it does not by itself create a network route. The phone still needs to reach the laptop over a local network. Network isolation, firewall rules, hotspot behavior, and browser security restrictions must be tested and documented. Local play must not require an internet connection, external cloud server, or paid service.

## Repository map

```text
smash-arena/
├── README.md                  # this file
├── PROJECT_STATUS.md          # verified progress and next task
├── AGENT_OPERATING_CONTRACT.md
├── FIRST_PR_TASK.md
├── package.json               # npm workspaces root + dev scripts
├── package-lock.json          # committed; CI runs `npm ci`
├── tsconfig.base.json         # shared strict compiler options
├── vitest.config.ts           # one test runner config for the whole repo
├── docs/
│   ├── GAME_DESIGN.md
│   ├── TECHNICAL_DESIGN.md
│   ├── DECISIONS.md
│   ├── ROADMAP.md
│   └── TESTING.md
├── apps/
│   ├── client/                # Phaser 3 + Vite browser client
│   │   └── src/
│   │       ├── main.ts                 # boots Phaser
│   │       ├── gameConfig.ts           # framework-free game settings
│   │       ├── scenes/PlaceholderScene.ts
│   │       ├── placeholder/layout.ts   # pure arena geometry
│   │       ├── placeholder/info.ts     # text built from @smash-arena/shared
│   │       └── testing/headlessPhaser.ts  # jsdom stubs for headless Phaser
│   └── server/                # Node.js session server
│       └── src/
│           ├── index.ts       # bootstrap, logging, graceful shutdown
│           ├── app.ts         # node:http server, GET /health
│           ├── health.ts      # builds the health payload
│           ├── config.ts      # HOST/PORT parsing
│           └── version.ts
├── packages/
│   └── shared/                # @smash-arena/shared
│       └── src/
│           ├── protocol/actions.ts     # logical input action vocabulary
│           ├── protocol/messages.ts    # message envelope (not wired to a socket)
│           ├── protocol/version.ts     # wire protocol version
│           ├── match/matchDefaults.ts  # documented gameplay defaults
│           └── health.ts               # server health contract
├── tests/                     # cross-package integration tests
└── scripts/clean.mjs
```

Unit tests live next to the source they cover (`**/*.test.ts`). `tests/` holds checks that span more than one workspace. This is a documented adjustment to the original planned layout — see `docs/TECHNICAL_DESIGN.md` section 3.

## Documents

- [Project status](PROJECT_STATUS.md)
- [Game design](docs/GAME_DESIGN.md)
- [Technical design](docs/TECHNICAL_DESIGN.md)
- [Decision log](docs/DECISIONS.md)
- [Roadmap](docs/ROADMAP.md)
- [Testing strategy](docs/TESTING.md)
- [Cross-package tests](tests/README.md)

## Development workflow

1. Read `README.md`, `PROJECT_STATUS.md`, and relevant documents before every task.
2. Work on exactly one assigned task per agent chat.
3. Run relevant tests and build commands; report anything not run as **NOT TESTED**.
4. Update status and relevant design documents in the same PR.
5. Open one focused PR and leave it unmerged for manual review.
6. Do not begin the next task until the current PR has been reviewed and merged.

See `docs/ROADMAP.md` for the planned milestones and first task.
