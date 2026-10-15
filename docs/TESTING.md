# Testing Strategy

**Status:** Planned test requirements. No application tests are implied to have passed.

## 1. General rules

- Add tests for changed behavior.
- Run the relevant tests and build checks before opening a PR.
- Report exact commands and results.
- Label unavailable or unrun checks **NOT TESTED**.
- Never use a passing unit test as proof that an untested real-device flow works.
- Keep test scope proportional to the change and update this document as coverage grows.

## 2. Foundation checks

- Client development command starts successfully.
- Server starts and responds to its health check.
- Shared package imports work in client and server.
- Automated test command runs.
- Production/build command succeeds.
- Setup instructions work from a clean checkout, where practical.

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
