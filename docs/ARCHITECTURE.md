# Finance Tracker - Technical Architecture
**Created**: 2026-08-09
**Updated**: 2026-08-09

## Overview

This document describes how the product requirements in
[DESIGN.md](DESIGN.md) should be implemented as a Telegram Mini App. It is the
technical source of truth for stack choice, component boundaries, data flow,
storage, authentication, and deployment.

The delivery sequence is documented in [PLAN.md](PLAN.md). The archived iOS
design remains in [old/DESIGN.md](old/DESIGN.md) for domain reference only.

## Technology Stack

Recommended MVP stack:

- **Language**: TypeScript.
- **Frontend**: React with Vite.
- **Telegram integration**: Telegram Web App SDK script loaded in the Mini App
  HTML entry point.
- **Backend**: Node.js TypeScript API.
- **API style**: JSON over HTTPS.
- **Database**: PostgreSQL.
- **ORM/query layer**: Drizzle ORM or Prisma, selected during scaffold setup.
- **Validation**: schema validation at API boundaries.
- **Testing**: unit tests for domain services, API tests for auth and validation,
  and a small number of end-to-end checks for key flows.
- **Deployment**: HTTPS-hosted frontend plus HTTPS API, or a single host that
  serves both static assets and API routes.

The stack should stay dependency-light until the MVP workflow is proven.

## Current MVP Implementation

The first testable MVP uses a smaller persistence path than the target
architecture:

- frontend finance data is persisted in browser `localStorage`;
- backend exposes `/health` and `/api/session`;
- `/api/session` validates Telegram `initData` when `TELEGRAM_BOT_TOKEN` is
  configured;
- PostgreSQL schema and server-side finance persistence remain planned work.

This keeps the app testable locally before Telegram bot credentials, database
provisioning, and HTTPS deployment are available.

## System Architecture

The app has four primary runtime boundaries:

- Telegram client hosts the Mini App WebView and provides launch context.
- Frontend renders the finance UI and sends requests with Telegram init data.
- Backend validates Telegram identity and owns financial writes.
- Database stores user-owned financial records.

Architecture diagram:

- [diagrams/finance-tracker-architecture.excalidraw](diagrams/finance-tracker-architecture.excalidraw)

High-level flow:

```text
Telegram WebView -> Mini App frontend -> Backend API -> Domain services -> PostgreSQL
```

## Components

### Telegram Shell

Responsibilities:

- load Telegram Web App SDK;
- call `ready()` after initial UI render;
- call `expand()` for better mobile usability;
- read `initData` and send it to the backend for validation;
- react to `themeChanged`, `viewportChanged`, and safe-area events;
- use Telegram native buttons, haptics, and popups where they improve the flow.

The frontend must not trust `initDataUnsafe` for authorization.

### Frontend App

Responsibilities:

- render Dashboard, Account Detail, Quick Add, History, and Settings;
- keep forms fast and mobile-first;
- use Telegram theme CSS variables for colors;
- respect safe areas and bottom button spacing;
- maintain local UI state and optimistic form drafts;
- call backend APIs for persisted financial data.

Recommended folders after scaffold:

```text
frontend/
├── src/
│   ├── app/
│   ├── telegram/
│   ├── accounts/
│   ├── transactions/
│   ├── buckets/
│   ├── reports/
│   └── shared/
```

### Backend API

Responsibilities:

- validate Telegram `initData` with the bot token;
- map Telegram users to internal users;
- validate request payloads;
- execute financial services in transactions;
- return predictable API errors;
- enforce ownership on every user-owned record.

Recommended folders after scaffold:

```text
backend/
├── src/
│   ├── server/
│   ├── telegram/
│   ├── auth/
│   ├── accounts/
│   ├── transactions/
│   ├── buckets/
│   ├── rates/
│   └── db/
```

### Shared Domain

Financial rules should be isolated from UI and transport code.

Responsibilities:

- money parsing and formatting;
- minor-unit arithmetic;
- transaction validation;
- account balance calculations;
- bucket spent and remaining calculations;
- exchange-rate conversion;
- safe archive/delete rules.

Implemented folder:

```text
packages/domain/
```

## Data Model

Money is stored in minor units as integers. Floating-point numbers must not be
used as financial source-of-truth values.

### User

Stores the validated Telegram user identity.

Fields:

- `id`
- `telegram_user_id`
- `username`
- `first_name`
- `last_name`
- `language_code`
- `created_at`
- `updated_at`

### Account

Fields:

- `id`
- `user_id`
- `name`
- `currency_code`
- `initial_balance_minor`
- `is_archived`
- `created_at`
- `updated_at`

### Bucket

Fields:

- `id`
- `user_id`
- `account_id`
- `name`
- `budget_minor`
- `limit_minor`
- `goal_minor`
- `sort_order`
- `is_archived`
- `created_at`
- `updated_at`

### Transaction

Fields:

- `id`
- `user_id`
- `type`
- `amount_minor`
- `currency_code`
- `source_account_id`
- `destination_account_id`
- `bucket_id`
- `occurred_at`
- `comment`
- `created_at`
- `updated_at`

Rules:

- expense decreases source account balance;
- income increases source account balance;
- transfer decreases source account and increases destination account;
- transfer must not write a bucket;
- deletion removes the transaction fact and derived values are recalculated.

### ExchangeRate

Fields:

- `id`
- `user_id`
- `from_currency_code`
- `to_currency_code`
- `rate_decimal_string`
- `created_at`
- `updated_at`

Rates are user-managed. Missing, zero, negative, or invalid rates are recoverable
validation errors.

### UserSettings

Fields:

- `user_id`
- `base_currency_code`
- `last_account_id`
- `last_bucket_id`
- `last_currency_code`
- `created_at`
- `updated_at`

## API Structure

All authenticated routes require Telegram init data, usually through an
`X-Telegram-Init-Data` header.

Initial endpoints:

- `POST /api/session` validates Telegram init data and returns the current user.
- `GET /api/bootstrap` returns accounts, buckets, settings, rates, and recent
  transactions for initial app load.
- `POST /api/accounts` creates an account.
- `PATCH /api/accounts/:accountId` updates or archives an account.
- `POST /api/accounts/:accountId/buckets` creates a category.
- `PATCH /api/buckets/:bucketId` updates or archives a category.
- `POST /api/transactions` creates an expense, income, or transfer.
- `GET /api/transactions` returns history with optional account filter.
- `DELETE /api/transactions/:transactionId` deletes a transaction.
- `PUT /api/settings/base-currency` updates base currency.
- `PUT /api/exchange-rates` upserts manual exchange rates.

## Data Flow

### App Launch

1. Telegram opens the Mini App WebView.
1. Frontend loads the Telegram SDK and renders the initial shell.
1. Frontend calls `ready()` and `expand()`.
1. Frontend sends raw `initData` to `POST /api/session`.
1. Backend validates the HMAC signature and `auth_date` freshness.
1. Backend creates or updates the internal user record.
1. Frontend loads bootstrap data.

### Quick Add

1. User opens Quick Add from Dashboard.
1. Frontend preselects remembered account, category, and currency.
1. User enters amount and confirms.
1. Frontend sends a transaction draft to the backend.
1. Backend validates ownership, account state, amount, currency, and transfer
   rules.
1. Backend writes the transaction in a database transaction.
1. Frontend refreshes derived balances and shows Telegram haptic success
   feedback.

### Balance Calculation

Balances are derived, not manually stored:

```text
current balance = initial balance + transaction effects
```

If caching is introduced later for performance, tests must prove the cache stays
consistent with the transaction ledger.

## Authentication and Security

Telegram Mini App auth requirements:

- use raw `initData`, not `initDataUnsafe`, for backend trust decisions;
- validate the `hash` using HMAC-SHA256 and the bot token;
- reject stale `auth_date` values;
- compare hashes with timing-safe comparison;
- never expose the bot token to the frontend.

Application security requirements:

- enforce user ownership in every query;
- validate all request bodies;
- store secrets in environment variables;
- use HTTPS in every Telegram-facing environment;
- avoid logging raw init data, bot tokens, or full financial payloads;
- keep destructive operations confirmable and auditable.

## UI Implementation Notes

The product requirements in [DESIGN.md](DESIGN.md) should be implemented with:

- Dashboard as the default route;
- Quick Add as a fast modal or route optimized for thumb reach;
- History with account filtering and deletion confirmation;
- Settings for accounts, base currency, and manual exchange rates;
- Telegram theme variables for all colors;
- safe-area padding for mobile WebViews;
- native Telegram MainButton where it improves save flows;
- native BackButton for nested navigation;
- haptic feedback after successful transaction save.

## Testing Strategy

Required unit tests:

- money parsing rejects invalid amounts;
- expense decreases source account;
- income increases source account;
- transfer affects both accounts;
- category spending includes expenses only;
- deleting a transaction changes derived balances;
- conversion works for direct, reverse, and CZK-routed rates;
- missing or invalid rates produce recoverable errors;
- Telegram init data validation rejects invalid signatures and stale payloads.

Required integration checks:

- first-run setup creates an account;
- Quick Add persists an expense;
- History shows and deletes the transaction;
- Settings updates base currency and exchange rates.

## Deployment

Telegram requires HTTPS. The deployment setup must provide:

- a public HTTPS Mini App URL for BotFather configuration;
- a public HTTPS API URL or same-origin API routes;
- environment variables for Telegram bot token and database URL;
- database migrations;
- preview deployments for pull requests when available.

The first production deployment should happen only after auth validation,
financial tests, and the Quick Add happy path are working.
