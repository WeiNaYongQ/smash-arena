# Game Design Document

**Status:** Initial design baseline; details remain subject to playtesting.

## 1. Vision

Smash Arena is an original, competitive, anime-inspired 2D platform fighter for browsers. It prioritizes readable combat, responsive controls, local party play, and a path toward reliable online matches.

## 2. Target platforms and controls

- Desktop browsers for the rendered game.
- Keyboard and gamepad support.
- Phone browser as a touch controller.
- The phone sends control inputs only; it does not receive a stream of game frames.
- Local hosting and controller connection must be documented for supported browsers and operating systems.

Initial logical actions: left, right, jump, fast-fall, light attack, heavy attack, special attack, and dodge. The input abstraction must normalize all supported devices to the same logical actions.

## 3. Match format

Initial defaults:
- 2–4 players, free-for-all.
- Three stocks per player.
- Five-minute match timer.
- Items disabled in the initial competitive ruleset.
- One symmetrical stage with platforms and blast zones.

Victory:
- If only one player remains with stocks, that player wins.
- If the timer expires, resolve results using a documented deterministic ranking based on the agreed competitive rules.
- Tie-breaks, simultaneous KOs, self-destructs, disconnected players, and other edge cases must be explicitly specified before implementation of the match lifecycle is complete. Do not invent hidden rules in code.

## 4. Movement

Planned mechanics:
- Ground movement and running.
- Jump and double jump.
- Air control.
- Fast-fall.
- Platform collision.
- Blast-zone detection.
- Limited recovery options.

Movement values should be configurable and tuned through playtesting. Collision behavior and simulation timing must be documented. Inputs should behave consistently across keyboard, gamepad, and phone controllers.

## 5. Combat

Initial attacks:
- Light attack.
- Heavy attack.
- Special attack.
- Dodge with defined cooldown and invulnerability behavior.

Damage percentage increases knockback. Each attack must have explicit data for startup, active, and recovery frames, damage, knockback, hitstun, and hit-tracking behavior. Attack hitboxes and collision rules must be testable.

Requirements:
- Prevent unintended repeated hits from one attack.
- Define how simultaneous hits resolve.
- Define spawn protection and respawn safety.
- Avoid unbounded hitstun or infinite loops.
- Online hit, damage, KO, stock, and victory outcomes are authoritative on the server.

Not in the first combat version: grabs, complex cancels, parries, stage hazards, and items. Add them only through separately scoped, tested design changes.

## 6. Initial fighter archetypes

Use temporary geometric shapes initially. The following are gameplay archetypes, not finalized characters or art:

- **Duelist:** balanced movement and attack range.
- **Volt:** fast movement and close-range pressure.
- **Rift:** spacing and ranged pressure.

Fighter parameters should be data-driven. All final character names, designs, art, animations, and effects must be original or appropriately licensed.

## 7. Stages and visuals

Start with one fixed, symmetrical test arena made from simple geometric shapes. Verify platform collision, blast zones, spawn locations, and visibility before adding visual complexity. Original sprites and animations follow only after the core mechanics are stable.

## 8. Modes and rollout order

1. Training and single-client testing.
2. Local keyboard/gamepad match.
3. Local party match with multiple input devices.
4. Laptop-hosted local session with phone controllers.
5. Online private rooms.
6. Unranked matchmaking.
7. Ranked mode, only after reliability and integrity requirements are met.

## 9. Local phone controller

The laptop hosts and renders the match. It starts a local session and displays a short-lived code and connection instructions. Phones open the controller page, enter the code, connect over the local network, and receive a player slot.

The host must show connection state and allow a phone to reconnect to the correct slot. A code identifies a session; it does not create network connectivity by itself. Local play must work without internet when the devices have a functioning local network path.

## 10. Accessibility and usability

- Clear, configurable controls.
- Visible connected-player and assigned-slot status.
- Clear instructions for joining and recovering from disconnection.
- Readable hit effects and state changes.
- Keyboard access for menus where practical.
- Avoid relying only on color to communicate important game state.

## 11. Non-goals for the first release

- Mandatory accounts.
- Paid services required for local play.
- Ranked matchmaking before online reliability is demonstrated.
- A large roster or multiple complex stages before the core loop is stable.
- Copying protected characters, sprites, music, or other game assets.
