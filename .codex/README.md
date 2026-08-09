# Codex Workspace Notes

**Created**: 2026-08-09
**Updated**: 2026-08-09

## Main Point

The `.codex/` folder stores reusable guidance for working with Codex on this
repository and future projects. It is not application source code. Use it to
keep prompts, documentation standards, and Codex workflow references separate
from the Telegram Mini App implementation.

These files support agent setup and documentation quality. They should inform
how Codex works, but they should not replace product docs such as `README.md`,
`DESIGN.md`, `ARCHITECTURE.md`, or `PLAN.md` when those project documents are
created.

## Folder Guide

### `defs/`

Reusable definitions, standards, and templates.

Current files:

- [`defs/md_doc_standards.md`](defs/md_doc_standards.md) - Markdown writing
  and formatting standards.
- [`defs/prompt_structure.md`](defs/prompt_structure.md) - preferred prompt
  structure for reusable prompts.

Use this folder when creating or editing project documentation, prompt
templates, contributor guides, or other durable standards.

### `helpful/`

Reference material that helps configure and use Codex more effectively.

Current files:

- [`helpful/codex_best_practices.md`](helpful/codex_best_practices.md) -
  practical Codex workflow guidance, including context, planning, testing,
  review, configuration, MCP, and skills.

Use this folder when improving agent workflow, debugging Codex process issues,
or updating `AGENTS.md`.

### `prompts/`

Archived prompts that were previously used to set up Codex behavior.

Current files:

- [`prompts/fixes_list.md`](prompts/fixes_list.md) - template for processing
  manual testing issues and planning fixes.
- [`prompts/init_conversation_rules.md`](prompts/init_conversation_rules.md) -
  earlier conversation behavior prompt.
- [`prompts/system_prompt.md`](prompts/system_prompt.md) - system prompt used
  during initial setup.

Do not reuse these prompts directly for this project from now on. Treat them as
a collection of successful setup material that may be adapted for a future
project.

## Maintenance Rules

- Keep `.codex/` docs concise and single-purpose.
- Update this README when folders are added, renamed, or repurposed.
- Use relative links when referencing files in this folder.
- Follow [`defs/md_doc_standards.md`](defs/md_doc_standards.md) for Markdown edits.
