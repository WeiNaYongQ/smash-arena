# Project Status

**Status:** Planning baseline prepared; implementation not started.  
**Current milestone:** M0 — planning and repository setup.  
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

## Current implementation state

No gameplay, networking, or application scaffold has been verified as implemented by this planning pack. Do not mark features complete merely because they appear in the specification.

## Technical decisions still requiring validation

- Select Socket.IO or Colyseus after a small, documented comparison.
- Confirm the package manager and test runner during the foundation task.
- Verify local address discovery and phone connectivity on the target laptop, browsers, and phones.
- Choose a production hosting provider only after checking current free-tier limits and WebSocket support.

## Known constraints and risks

- A session code identifies a room but cannot replace a network path to the laptop.
- Wi-Fi client isolation, firewall settings, hotspot limitations, and mobile browser behavior may prevent local connection.
- Free online hosting can sleep, impose quotas, change pricing, or be discontinued.
- Low-end hardware performance must be measured; do not assume a 60 Hz simulation is achieved without profiling.
- A server-authoritative architecture improves integrity but does not guarantee perfect anti-cheat.

## Next recommended task

**Planning/repository task:** Verify that this planning pack is present on the repository's default branch and that the README and status file reflect reality. Then assign the first implementation PR only after the owner approves the documents.

**First implementation PR:** Establish the smallest verified project foundation: client/server/shared package structure, development scripts, baseline tests, a minimal client placeholder screen, a basic server health check, and updated documentation. Do not implement combat, phone pairing, matchmaking, or polished art in that PR.

## Test evidence

No project build or application tests have been run as part of preparing these planning documents. Application checks are therefore **NOT TESTED**.
