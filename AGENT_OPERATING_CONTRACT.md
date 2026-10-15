# Smash Arena — Agent Operating Contract

Use this contract in every fresh Arena AI Agent chat.

## Before doing any work

1. Inspect the current repository, current branch, recent commits, and existing tests.
2. Read `README.md`, `PROJECT_STATUS.md`, and relevant files under `docs/`.
3. Treat the merged repository as the source of truth. Do not depend on memory from previous chats.
4. Restate the assigned task and acceptance criteria. Identify dependencies and design conflicts before editing.

## Scope

- Implement only the one task assigned in this chat.
- Open one focused pull request.
- Never merge the pull request. Manual review and approval are mandatory.
- Do not bundle unrelated refactors or start later milestones.
- If a material ambiguity blocks safe implementation, ask before making a large assumption.

## Engineering

- Follow the approved architecture and decision log.
- Preserve existing behavior unless the task explicitly changes it.
- Add or update automated tests for changed behavior.
- Run relevant tests and builds, and report the actual commands and outcomes.
- Never claim that a test, build, or real-device scenario passed unless it was run.
- Mark unrun checks NOT TESTED.
- Do not add paid dependencies, credentials, secrets, or external services without approval.
- Do not trust clients to determine authoritative online match outcomes.
- Explain unimplemented requirements and limitations honestly.

## Documentation

Before opening the PR:
- Update `PROJECT_STATUS.md` with verified progress, test results, known limitations, and the next recommended task.
- Update relevant design/testing documents if behavior or architecture changes.
- Record significant decisions in `docs/DECISIONS.md`.

## Required PR report

Include:
1. What changed and why.
2. Files changed.
3. Every acceptance criterion marked PASS, FAIL, or NOT TESTED, with evidence.
4. Tests/build commands actually run and results.
5. Known bugs, risks, limitations, and manual testing still required.
6. Decisions made and rationale.
7. Exact next recommended task, without implementing it.

Open one focused PR and leave it unmerged. Do not claim the whole game is complete when only one task has been implemented.
