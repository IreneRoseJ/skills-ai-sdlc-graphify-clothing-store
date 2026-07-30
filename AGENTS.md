# AGENTS.md

## Repository workflow

- This repository uses a strict two-step test-first workflow for feature development.
- Read the requirement ticket from the repository root file ticket.md.
- If ticket.md is missing, empty, or ambiguous, ask the user for clarification before writing tests or implementation.
- Do not combine test authoring and implementation in the same turn for a new feature.

## Draft tests instructions

- Phase 1 is test drafting only.
- Convert acceptance criteria from ticket.md into failing tests only.
- Do not modify implementation or production files during this phase.
- If acceptance criteria are vague, propose concrete testable behaviours and get confirmation before drafting tests.
- Write one behaviour per test.
- Assert user-visible or externally observable behaviour, not implementation details.
- For frontend work, cover both logic and UI behaviour when the ticket affects both.
- Discover the existing test layout and follow local conventions if tests already exist.
- If no tests exist in a touched area, place backend tests under ecommerce-backend/tests and frontend tests near the relevant files in ecommerce-frontend/src.
- Run only the new or changed tests to confirm they fail.
- Hand back the changed test files, a one-line mapping from each test to an acceptance criterion, and the exact commands used to observe RED.
- Remind the user to review the tests, confirm RED, and commit the tests alone before implementation begins.

## Implementation instructions

- Phase 2 starts only after the user provides a reference to a test-only commit.
- Read ticket.md again before implementing so ticket intent is available when interpreting frozen tests.
- Resolve the user-provided commit ref and inspect it with git show <ref> --stat.
- Treat the test files from that commit as the frozen contract.
- Never modify, skip, rename, weaken, delete, or bypass those frozen tests.
- If a frozen test appears wrong or impossible, stop and ask the user to correct it through a new draft-tests cycle.
- Before editing code, present a short plan describing which implementation files will change and in what order you will make tests pass.
- Wait for user approval before editing.
- Implement the smallest possible production changes to satisfy the frozen tests.
- Stay within ticket scope and do not add unrelated features or refactors.
- After each implementation change, run only the target tests from the frozen commit until they are green.
- After target tests are green, run final validation using the available project commands:
  - full relevant test suite
  - typecheck when tooling exists
- If a test or typecheck command is missing, report that clearly and use the broadest safe available validation command.
- Report the implementation files changed, exact commands run, and final validation status.
- Remind the user that the implementation commit should remain separate from the earlier test-only commit.

## Project structure tips

- Backend code lives in ecommerce-backend.
- Frontend code lives in ecommerce-frontend.
- Root package scripts may not include full test automation for both areas, so inspect local package.json files before choosing commands.
- Prefer targeted test execution over running the entire project during the inner loop.

## Validation instructions

- Prefer the smallest focused validation command after each change.
- Use full-suite validation only after targeted tests are green.
- If a command is unavailable, do not invent one. State the gap and ask for the canonical command if needed.

## Commit and PR instructions

- Keep test-only changes and implementation changes in separate commits.
- Do not commit on behalf of the user unless explicitly asked.
- In PR descriptions or handoff summaries, mention that the implementation commit is based on a frozen test-only diff anchor.

## Hard rules

- Do not write implementation during the draft-tests phase.
- Do not write new tests during the implementation phase.
- Do not weaken tests to force green.
- Do not silently infer missing requirements when ticket.md is ambiguous.
- Prefer small, reversible changes and keep scope tight to the ticket.
