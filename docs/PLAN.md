# Finance Tracker - Implementation Plan
**Created**: 2026-08-09
**Updated**: 2026-08-09

## Overview

This plan turns [DESIGN.md](DESIGN.md) and [ARCHITECTURE.md](ARCHITECTURE.md)
into staged implementation work. Each stage should be completed in a focused
branch with tests or documented manual checks.

The repository now contains the first local-testable MVP. It can be run outside
Telegram, stores finance data in browser `localStorage`, and includes backend
Telegram session validation.

## Delivery Principles

- Build the smallest working flow first.
- Keep financial rules centralized and tested.
- Avoid speculative features outside the MVP.
- Prefer clear domain names over generic utility layers.
- Update documentation when behavior, commands, or architecture changes.
- Keep every pull request small enough to review.

## Stage 0: Repository Baseline

Status: complete.

Deliverables:

- [x] Git repository initialized.
- [x] GitHub remote configured.
- [x] Baseline documentation added.
- [x] Pull request template added.
- [x] Minimal package metadata added.

## Stage 1: Stack Selection and Scaffold

Status: complete for the first MVP.

Goal: create the actual Telegram Mini App codebase.

Deliverables:

- [x] Select final web stack.
- [x] Create frontend scaffold.
- [x] Create backend scaffold.
- [x] Add shared domain package or equivalent domain module.
- [x] Add exact `dev`, `build`, `test`, and `lint` commands.
- [x] Update [README.md](../README.md) with real setup instructions.

Recommended branch: `chore/app-scaffold`.

## Stage 2: Telegram App Shell

Status: complete for local MVP, pending Telegram device verification.

Goal: make the app open correctly inside Telegram and locally.

Deliverables:

- [x] Load Telegram Web App SDK.
- [x] Call `ready()` after initial render.
- [x] Call `expand()` where supported.
- [x] Add safe-area handling.
- [x] Add theme variable support.
- [x] Add local development fallback when Telegram SDK is unavailable.

Recommended branch: `feature/telegram-shell`.

## Stage 3: Domain Model and Financial Rules

Status: complete for first MVP.

Goal: establish reliable financial logic before UI polish.

Deliverables:

- [x] Define currencies: `CZK`, `EUR`, `USD`.
- [x] Define transaction types: expense, income, transfer.
- [x] Define account, bucket, transaction, exchange-rate, and settings types.
- [x] Store money in integer minor units.
- [x] Add balance calculation service.
- [x] Add bucket spent and remaining calculation service.
- [x] Add manual currency conversion service.
- [x] Add unit tests for all financial invariants.

Recommended branch: `feature/domain-models`.

## Stage 4: Telegram Authentication and Persistence

Status: partial.

Goal: persist user-owned data securely.

Deliverables:

- [x] Add Telegram init data validation.
- [x] Reject stale or invalid auth payloads.
- [ ] Add database schema and migrations.
- [ ] Add user ownership checks.
- [ ] Add bootstrap endpoint.
- [x] Add API tests for auth validation.

Recommended branch: `feature/telegram-auth`.

## Stage 5: Accounts and Settings

Status: complete for local MVP.

Goal: let users prepare the data needed for tracking.

Deliverables:

- [x] Create accounts.
- [x] Rename accounts.
- [x] Archive or delete accounts safely.
- [x] Set base currency.
- [x] Enter manual exchange rates.
- [x] Persist remembered defaults.

Recommended branch: `feature/settings-accounts-rates`.

## Stage 6: Dashboard

Status: complete for local MVP.

Goal: show balances and the main entry point for transaction capture.

Deliverables:

- [x] Show total balance in base currency.
- [x] Show active accounts and balances.
- [x] Handle missing exchange rates clearly.
- [x] Add compact empty state.
- [x] Add primary Quick Add entry point.

Recommended branch: `feature/dashboard`.

## Stage 7: Categories and Account Detail

Status: complete for local MVP.

Goal: manage account-specific spending categories.

Deliverables:

- [x] Show account balance.
- [x] Show active categories.
- [x] Create and rename categories.
- [x] Archive or delete categories safely.
- [x] Show spent and remaining amounts.
- [x] Show recent account transactions.

Recommended branch: `feature/account-detail-buckets`.

## Stage 8: Quick Add

Status: complete for local MVP.

Goal: complete the core daily workflow.

Deliverables:

- [x] Add expense flow.
- [x] Add income flow.
- [x] Add transfer flow.
- [x] Validate amount and required accounts.
- [x] Validate exchange-rate requirements.
- [x] Remember last account, category, and currency.
- [x] Trigger haptic success feedback after save when Telegram is available.
- [x] Refresh Dashboard and History after save.

Recommended branch: `feature/quick-add`.

## Stage 9: History

Status: complete for local MVP.

Goal: provide a simple, trustworthy transaction ledger.

Deliverables:

- [x] Group transactions by date.
- [x] Filter transactions by account.
- [x] Show transaction details compactly.
- [x] Confirm destructive deletion.
- [x] Recalculate balances after deletion.

Recommended branch: `feature/transaction-history`.

## Stage 10: Deployment and Bot Setup

Goal: make the app usable through Telegram.

Deliverables:

- [ ] Configure HTTPS deployment.
- [ ] Configure environment variables.
- [ ] Configure BotFather Mini App URL.
- [ ] Document local tunnel setup.
- [ ] Add smoke test for deployed `/health` or equivalent endpoint.

Recommended branch: `chore/deployment-setup`.

## Stage 11: MVP Hardening

Goal: prepare for regular personal use.

Deliverables:

- [ ] Run all tests.
- [ ] Verify mobile layout in Telegram.
- [ ] Verify light and dark themes.
- [ ] Verify keyboard and safe-area behavior.
- [ ] Review all error states.
- [ ] Update docs with final commands and known limitations.

Recommended branch: `chore/mvp-hardening`.

## Manual Testing Fixes

Status: pending.

Manual testing found financial correctness and History filtering issues after
the first local MVP. Track the active issue list, severity, source analysis, and
planned fix branches in [AGENTS.md](../AGENTS.md). Remove each item from that
queue in the pull request that implements and tests the fix.
