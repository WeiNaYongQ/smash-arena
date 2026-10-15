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

**Status:** Proposed; validate in foundation milestone  
**Decision:** Phaser 3 + TypeScript + Vite client; Node.js + TypeScript server; shared protocol package.  
**Reason:** Clear separation between rendering, simulation, and networking.  
**Consequences:** Validate dependencies and low-end hardware performance before expanding the scaffold.

## D-009 — WebSocket library not yet selected

**Status:** Open  
**Decision needed:** Compare Socket.IO and Colyseus for room lifecycle, local hosting, client support, testability, maintenance, and deployment.  
**Rule:** Do not silently select one in a large implementation. Record the comparison and recommendation.

## D-010 — Server-authoritative online combat

**Status:** Accepted design principle  
**Decision:** Online clients send validated inputs; server determines authoritative game outcomes.  
**Reason:** Clients should not be trusted to report their own hits, damage, stocks, or wins.  
**Consequences:** The server simulation and protocol require robust validation and tests. This does not guarantee perfect anti-cheat.
