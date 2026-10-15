# First Implementation PR — Project Foundation

**Status:** Proposed task. Do not execute until the project owner approves the planning pack.

## Goal

Create the smallest verified client/server/shared foundation for Smash Arena. Do not implement gameplay systems or phone pairing in this PR.

## Before implementation

- Read `README.md`, `PROJECT_STATUS.md`, and all relevant documents under `docs/`.
- Inspect the existing repository and recent commits.
- Validate the proposed stack and identify any compatibility concerns.
- Record the chosen package manager, test runner, and networking-library decision or clearly leave the network library open if it is not needed yet.

## Scope

- Establish the agreed client, server, and shared package boundaries.
- Add minimal development scripts and setup instructions.
- Add a minimal client placeholder screen.
- Add a basic server health check.
- Add baseline tests and build checks.
- Update `README.md`, `PROJECT_STATUS.md`, and relevant technical/decision documents to reflect what actually exists.

## Out of scope

- Combat and physics.
- Full match lifecycle.
- Phone pairing.
- Online rooms or matchmaking.
- Original art or animation.
- Ranked mode.
- Deployment to a production hosting provider.

## Acceptance criteria

1. The repository structure is clear and documented.
2. Client and server can be started using documented commands.
3. The client shows a minimal placeholder screen.
4. The server health check responds as documented.
5. The shared package can be imported by the intended applications.
6. Baseline tests and build checks pass, with actual output or credible CI evidence.
7. Setup instructions are accurate.
8. Project status accurately describes implemented work and remaining work.
9. One focused PR is opened.
10. The PR remains unmerged for manual review.

## Required report

Follow `AGENT_OPERATING_CONTRACT.md`. Mark each acceptance criterion PASS, FAIL, or NOT TESTED. Do not begin the next roadmap milestone in this PR.
