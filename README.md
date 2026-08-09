# TallyFinanceApp
**Created**: 2026-08-09
**Updated**: 2026-08-09

TallyFinanceApp is a Telegram Mini App for fast personal finance tracking with
local-first data handling, simple balances, and manual currency management.

## Current State

This repository is in baseline setup mode. Git and documentation scaffolding are
being established first; the application framework has not yet been selected or
installed.

## Product Direction

The MVP is centered on:

- fast transaction entry;
- reliable account balances;
- simple reports and history;
- manual exchange rates;
- Telegram Mini App delivery.

For the product and domain model, see [docs/old/DESIGN.md](docs/old/DESIGN.md)
and [docs/old/PLAN.md](docs/old/PLAN.md).

## Repository Structure

Expected future top-level layout:

```text
.
├── AGENTS.md
├── README.md
├── frontend/
├── backend/
├── docs/
├── tests/
└── .codex/
```

Planned documentation:

- [docs/CODING_STYLE.md](docs/CODING_STYLE.md) - code and documentation rules.
- [docs/old/DESIGN.md](docs/old/DESIGN.md) - archived product and domain design.
- [docs/old/PLAN.md](docs/old/PLAN.md) - staged delivery plan.

## Development Baseline

The first implementation steps should establish:

1. A frontend Telegram Mini App shell.
1. Backend/API boundaries for auth and persistence.
1. Shared domain types for money, accounts, transactions, and currency rules.
1. Tests for financial logic before UI polish.

Exact commands will be documented once the runtime scaffold exists.

## Setup

Current requirements:

- Git.
- Node.js `22+` only for project metadata scripts in [package.json](package.json).

Current commands:

```bash
npm run dev
npm run build
npm test
```

These commands intentionally print placeholder messages until the app scaffold is
selected.

## Process Notes

- Follow [AGENTS.md](AGENTS.md) for repository-specific guidance.
- Keep documentation concise and single-purpose.
- Use TypeScript for web code unless a different stack is explicitly documented.
- Store money in minor units, never floating point as the source of truth.
