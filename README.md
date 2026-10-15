# Smash Arena

**Smash Arena** is a planned original browser-based 2D platform fighter inspired by the broad genre of competitive platform fighters. It aims to support up to four players, keyboard and gamepad controls, browser-based phone controllers, local play hosted by a laptop, and online private rooms.

> **Project status:** Planning. Gameplay implementation has not started. Items in this repository are plans until verified in the code and tests.

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

## Planned technology direction

- Client: Phaser 3, TypeScript, Vite.
- Server: Node.js and TypeScript.
- Network transport: WebSockets. Socket.IO and Colyseus remain candidates until a small validation task compares their fit.
- Shared package: input types, message schemas, fighter data, and shared contracts.
- Testing: unit tests plus browser and multiplayer integration tests.

These are planning choices, not proof that a scaffold already exists. The initial foundation task must validate dependency compatibility and record the chosen networking library before it becomes a permanent architectural commitment.

## Local phone-controller flow

1. On the laptop, select **Local Play → Host a Match**.
2. The laptop starts a local session server and displays a short-lived code plus clear connection instructions.
3. A phone opens the controller page and enters the code.
4. The phone connects to the laptop over the same Wi-Fi network or a laptop hotspot, then receives a player slot.
5. The laptop renders the match and remains authoritative for local match state.

A code identifies a session; it does not by itself create a network route. The phone still needs to reach the laptop over a local network. Network isolation, firewall rules, hotspot behavior, and browser security restrictions must be tested and documented. Local play must not require an internet connection, external cloud server, or paid service.

## Repository map

```text
smash-arena/
├── README.md
├── PROJECT_STATUS.md
├── docs/
│   ├── GAME_DESIGN.md
│   ├── TECHNICAL_DESIGN.md
│   ├── DECISIONS.md
│   ├── ROADMAP.md
│   └── TESTING.md
├── apps/
│   ├── client/
│   └── server/
├── packages/
│   └── shared/
└── tests/
```

The application folders are planned locations. Create them only as part of the approved foundation PR.

## Documents

- [Project status](PROJECT_STATUS.md)
- [Game design](docs/GAME_DESIGN.md)
- [Technical design](docs/TECHNICAL_DESIGN.md)
- [Decision log](docs/DECISIONS.md)
- [Roadmap](docs/ROADMAP.md)
- [Testing strategy](docs/TESTING.md)

## Development workflow

1. Read `README.md`, `PROJECT_STATUS.md`, and relevant documents before every task.
2. Work on exactly one assigned task per agent chat.
3. Run relevant tests and build commands; report anything not run as **NOT TESTED**.
4. Update status and relevant design documents in the same PR.
5. Open one focused PR and leave it unmerged for manual review.
6. Do not begin the next task until the current PR has been reviewed and merged.

See `docs/ROADMAP.md` for the planned milestones and first task.
