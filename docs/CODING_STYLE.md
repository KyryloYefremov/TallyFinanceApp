# Coding Style

**Created**: 2026-08-09
**Updated**: 2026-08-09

## Design Principles

Follow DRY, KISS, and YAGNI in all implementation work.

DRY means every piece of knowledge should have one clear, unambiguous
representation. Do not duplicate financial rules, validation logic, formatting
behavior, or Telegram integration details across unrelated files. Extract shared
logic when duplication creates real maintenance risk.

KISS means prefer simple, readable solutions over clever abstractions. A direct
service, function, or component is better than a flexible framework that the app
does not yet need.

YAGNI means do not build features, extension points, or abstractions before
there is an immediate product need. Keep the MVP focused on fast transaction
entry, reliable balances, simple reports, and Telegram Mini App delivery.

## File Organization

- Keep files around 500-600 lines maximum.
- One file should have one primary responsibility.
- Split large functionality into smaller, focused files.
- Organize code by feature or domain, not by file type.
- Prefer folders such as `transactions/`, `accounts/`, `reports/`, and
  `telegram/` over broad buckets like `components/` or `utils/` when the app
  scaffold is created.

## Documentation Standards

- Document all non-trivial functionality.
- Add concise comments for complex logic, edge cases, and financial invariants.
- Use docstrings such as JSDoc for exported functions, classes, services, and
  domain types.
- Comments should explain why a decision exists, not restate what the code
  already says.
- Keep documentation close to the code when it describes implementation behavior.
- Update product and architecture docs when behavior, data shape, or workflow changes.
- Follow the documentation consolidation rule in [AGENTS.md](../AGENTS.md):
  prefer links to the source of truth over repeated detail.

## Code Implementation Standards

- Optimize for correctness, clarity, and reliability over speed.
- Avoid risky shortcuts, speculative changes, and messy hacks.
- Cover root causes, not just symptoms.
- Conform to existing codebase conventions, patterns, and naming.
- Preserve intended behavior; gate intentional changes when they shift behavior.
- Use tight error handling: propagate errors explicitly and avoid broad
  `try/catch` blocks.
- Keep type safety: avoid unnecessary casts and use proper types and guards.
- Search for existing helpers before adding new ones; reuse code where appropriate.
- Use ASCII by default; only introduce other characters with clear justification.
- Batch logical edits together instead of making repeated micro-edits.

## Git Workflow

- Create a branch for each feature, step, or bug fix.
- Use branch names such as `feature/quick-add`, `fix/telegram-auth`,
  `docs/architecture`, or `chore/project-setup`.
- Make atomic commits with clear imperative messages, for example
  `Add transaction validation service`.
- Prepare pull requests using the repository PR template when it exists.
- Include summary, rationale, tests, screenshots for UI changes, and known risks
  in each PR.
- After approval, merge and delete the branch.
- Update [AGENTS.md](../AGENTS.md) when relevant to track durable process,
  architecture, or workflow decisions.
