# TallyFinanceApp
**Created**: 2026-08-09
**Updated**: 2026-08-09

TallyFinanceApp is a Telegram Mini App for fast personal finance tracking with
local-first data handling, simple balances, and manual currency management.

## Current State

This repository contains the first local-testable MVP for the Telegram Mini App
finance tracker.

The MVP includes:

- React/Vite Telegram Mini App frontend.
- Node.js backend with health, Telegram session validation, and bootstrap
  endpoints.
- Shared TypeScript domain package for financial rules.
- Browser `localStorage` persistence for the first testable finance workflow.
- PostgreSQL schema migration files for the server persistence foundation.
- Unit tests for financial calculations, Telegram init data validation,
  bootstrap ownership, and migration coverage.

## Product Direction

The MVP is centered on:

- fast transaction entry;
- reliable account balances;
- simple reports and history;
- manual exchange rates;
- Telegram Mini App delivery.

For the current product and architecture, see [docs/DESIGN.md](docs/DESIGN.md),
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), and [docs/PLAN.md](docs/PLAN.md).

## Repository Structure

Top-level layout:

```text
.
├── AGENTS.md
├── README.md
├── frontend/
├── backend/
├── packages/
├── docs/
└── .codex/
```

Key documentation:

- [docs/CODING_STYLE.md](docs/CODING_STYLE.md) - code and documentation rules.
- [docs/DESIGN.md](docs/DESIGN.md) - product design.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - technical architecture.
- [docs/PLAN.md](docs/PLAN.md) - implementation plan and status.
- [docs/old/](docs/old/) - archived iOS planning reference.

## Development Baseline

The first implementation steps should establish:

1. A frontend Telegram Mini App shell.
1. Backend/API boundaries for auth and persistence.
1. Shared domain types for money, accounts, transactions, and currency rules.
1. Tests for financial logic before UI polish.

## Setup

Current requirements:

- Git.
- Node.js `22+`.
- npm.

Install dependencies:

```bash
npm install
```

Run local development servers:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

Verification commands:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Telegram testing requires an HTTPS tunnel and a bot configured in BotFather. The
frontend also works outside Telegram for local testing.

Backend Telegram session validation requires:

```bash
TELEGRAM_BOT_TOKEN=<bot token> npm run dev --workspace backend
```

## MVP Limitations

- Finance data is stored in browser `localStorage` for the first testable MVP.
- PostgreSQL schema migrations and backend repository boundaries exist, but a
  provisioned database and frontend write-through APIs are not configured yet.
- Telegram bot setup and deployed HTTPS hosting are not configured yet.
- Automatic exchange rates, bank sync, charts, export, and notifications are out
  of scope for the MVP.

## Process Notes

- Follow [AGENTS.md](AGENTS.md) for repository-specific guidance.
- Keep documentation concise and single-purpose.
- Use TypeScript for web code unless a different stack is explicitly documented.
- Store money in minor units, never floating point as the source of truth.
