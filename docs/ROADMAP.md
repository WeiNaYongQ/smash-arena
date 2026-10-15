# Roadmap

**Status:** All milestones planned; none are marked complete by this document.

Each milestone may require multiple PRs. Each PR must have one focused scope, explicit acceptance criteria, relevant tests, a documentation update, and manual review before merging.

## M0 — Planning and repository setup

- Add and review the planning documents.
- Verify repository access for the selected agent workflow.
- Approve the architecture direction and first implementation task.

**Exit criteria:** Planning pack is committed; open questions and known limitations are documented.

## M1 — Project foundation

- Validate the proposed stack and choose package manager/test tooling.
- Establish client, server, and shared package boundaries.
- Add a minimal client placeholder screen and basic server health check.
- Add baseline tests and run/build instructions.

**Exit criteria:** Development commands and baseline tests run successfully; no combat or phone pairing is bundled into this milestone's first PR.

## M2 — Movement and stage

- Geometric test stage.
- Movement, jumping, platform collisions, blast zones.
- Unit tests for boundaries and edge cases.

**Exit criteria:** Prototype is playable and movement/collision tests pass.

## M3 — Combat engine

- Attack timing, hitboxes, damage, knockback, hitstun, dodge.
- Hit tracking and simultaneous-event rules.
- Automated combat tests.

**Exit criteria:** Defined combat scenarios pass tests and edge cases are documented.

## M4 — Match lifecycle

- Stocks, timer, respawns, scoring, results, rematch.
- Deterministic timeout/tie and simultaneous-KO rules.

**Exit criteria:** Complete match loop works and match-rule tests pass.

## M5 — Keyboard and gamepad

- Common logical input interface.
- Keyboard and gamepad mapping.
- Input release, simultaneous controls, focus-loss handling.

**Exit criteria:** Both input methods operate through the same gameplay interface.

## M6 — Phone-controller prototype

- Mobile controller page.
- Pairing credential and player-slot assignment.
- Button state, sequence handling, disconnect/reconnect.
- Real-device test.

**Exit criteria:** A real phone can control a designated player in a test session.

## M7 — Laptop-hosted local multiplayer

- Laptop hosts session and displays the match.
- Short join code plus reachable local address/instructions.
- Phones connect over Wi-Fi or laptop hotspot.
- Mixed keyboard, gamepad, and phone-controlled players.

**Exit criteria:** At least two players complete a match on actual devices without internet access, using a functioning local network path. Limitations and setup are documented.

## M8 — Online private rooms

- Room creation/joining and authorization.
- Server validation and lifecycle cleanup.
- Disconnect/reconnect and invalid-message tests.

**Exit criteria:** Multiple remote clients can join a private room and complete a test session.

## M9 — Online synchronization

- Authoritative state updates and snapshots.
- Input acknowledgement and remote interpolation.
- Consistency tests across clients.

**Exit criteria:** Remote clients observe consistent authoritative match outcomes.

## M10 — Reliability and security

- Simulate latency, jitter, loss, and disconnects.
- Measure performance and fix high-impact issues.
- Add prediction/reconciliation only when justified by evidence.

**Exit criteria:** Agreed test scenarios and thresholds pass; remaining limitations are documented.

## M11 — Original fighters and visuals

- Create original art and animations.
- Replace placeholders incrementally.
- Keep logic and fighter parameters data-driven.

**Exit criteria:** Initial fighters are visually distinct and gameplay regression tests pass.

## M12 — Menus and usability

- Fighter selection, room UI, instructions, results, rematch, accessibility.
- Clear controller status and troubleshooting.

**Exit criteria:** Users can navigate the supported flows without developer-only instructions.

## M13 — Online deployment

- Verify a currently suitable hosting option and its free-tier limits.
- Configure secure production connections.
- Document sleep, quota, and migration constraints.

**Exit criteria:** Production online rooms and local offline mode are both verified.

## M14 — Unranked matchmaking

- Queue lifecycle, cancellation, timeouts, opponent assignment.
- Matchmaking integration tests.

**Exit criteria:** Private rooms remain reliable and matchmaking edge cases pass.

## M15 — Ranked and post-launch

- Define ranking, integrity, and disconnect policies.
- Add rating and ranking systems only after reliable match results.
- Consider replays, more stages, balance tools, and further fighters.

**Exit criteria:** Each feature has separate design and acceptance criteria.

## PR sequencing rules

- Do not implement an entire milestone in one PR.
- Keep dependencies explicit and merge prerequisites first.
- Do not start the next task based on an unmerged PR.
- Agent reports must label each criterion PASS, FAIL, or NOT TESTED.
- The human owner manually reviews and merges every PR.
