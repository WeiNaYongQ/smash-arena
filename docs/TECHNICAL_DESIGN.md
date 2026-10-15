# Technical Design

**Status:** Proposed architecture. Validate choices in the foundation milestone before treating them as implemented.

## 1. Goals

- Keep rendering, simulation, input, and networking responsibilities separate.
- Reuse one logical input protocol across keyboard, gamepad, and phone controllers.
- Support laptop-hosted local matches without internet or paid services.
- Use authoritative server simulation for online matches.
- Keep hosting-provider details out of core game logic.
- Test core mechanics without requiring a live network.

## 2. Proposed stack

- Client: Phaser 3, TypeScript, Vite.
- Server: Node.js and TypeScript.
- Transport: WebSockets.
- Candidate room/network libraries: Socket.IO or Colyseus. Compare maintenance, local-host support, room lifecycle, deployment needs, and testing ergonomics in a small validation task before selecting one.
- Shared package: input actions, validated message schemas, fighter data, and common contracts.
- Testing: unit tests and browser/multiplayer integration tests. Select exact test tooling during the foundation task.

Do not add dependencies without a clear reason. Record significant decisions in `DECISIONS.md`.

## 3. Planned repository boundaries

- `apps/client`: scenes, rendering, menus, local device input, and network client.
- `apps/server`: sessions, simulation, physics, combat, validation, and room lifecycle.
- `packages/shared`: shared types, protocol schemas, and data definitions.
- `tests`: unit and integration tests.

The exact directory structure may be adjusted during foundation work if the rationale is documented and the public interfaces remain clear.

## 4. Simulation

Target a fixed 60 Hz simulation, subject to profiling on target hardware. Rendering must not determine simulation step size. Measure update duration and document any catch-up policy. Do not claim the target is met without evidence.

Keep physics, combat resolution, and match rules independent of rendering. Define collision tolerances, attack timing, ordering of simultaneous events, and deterministic match outcomes.

## 5. Input protocol

Normalize devices into logical actions:
- left, right
- jump, fast-fall
- light, heavy, special
- dodge

Messages should represent validated button state or input changes and include suitable sequence/order information. Handle button press/release, simultaneous inputs, focus loss, stale inputs, and disconnects. The server must not accept client-provided positions, damage, hit results, stocks, or victory claims as authoritative.

## 6. Local-host architecture

The laptop runs the game client and a local session server. The host owns local match state and displays the match. Phones connect as input devices through the same local session.

Expected flow:
1. User chooses **Local Play → Host a Match**.
2. The server creates a session with a short-lived, hard-to-guess join credential.
3. The laptop UI displays the join code and connection instructions, including the reachable local address or a tested discovery mechanism.
4. The phone controller page connects to the laptop through a local network path and presents the join code.
5. The server validates the credential and assigns a player slot.
6. The server accepts validated inputs and updates the match.
7. Session shutdown invalidates credentials and releases resources.

A numeric code alone cannot establish a route between devices. Phones and the laptop must share a reachable network, such as Wi-Fi or a laptop hotspot. Test firewall settings, network isolation, address changes, browser security restrictions, and supported phone browsers. Avoid depending on internet-based rendezvous or external APIs for offline local mode.

Use configurable binding and port settings. Avoid exposing the local server to wider networks unnecessarily. Display helpful errors when the server cannot bind or a phone cannot reach the host.

## 7. Online architecture

For online private rooms, a server owns match state and validates all gameplay outcomes. Clients send input messages; the server simulates and sends snapshots or state updates. Clients interpolate remote players. Prediction and reconciliation may be added after latency testing demonstrates a need.

Enforce:
- Room membership and session authorization.
- Message schemas and size limits.
- Input rate limits.
- Legal state transitions and cooldowns.
- Disconnect and reconnect handling.
- Room cleanup and credential expiry.
- No secrets embedded in client bundles.

## 8. Phone pairing and security

- Use short-lived, unguessable session credentials behind any human-friendly join code.
- Rate-limit code attempts and expire codes.
- Bind the phone to a specific room and slot.
- Invalidate or safely replace stale controller sessions.
- Avoid admin capabilities on the controller page.
- Do not collect unnecessary personal information.
- Use HTTPS/WSS in production; document local development exceptions.
- A phone reconnect must not create a duplicate player or inherit a different slot silently.

## 9. Hosting and portability

The local mode must not rely on a cloud server, paid provider, or internet access. Online deployment is separate and must support persistent WebSocket connections. Check free-tier limits, sleep policies, quotas, and current pricing before selecting a provider. Keep provider-specific configuration isolated and document migration options.

## 10. Observability and cleanup

Provide basic health reporting for the server, useful development logs, session lifecycle visibility, and clean shutdown behavior. Do not log join credentials or secrets. Remove stale rooms and disconnected controller state safely.

## 11. Performance and testing

Measure simulation tick duration, client frame rate, message frequency, payload sizes, and behavior under simulated latency/jitter. Test two or more actual devices before calling phone local multiplayer complete. See `TESTING.md`.
