# Finance Tracker - Implementation Plan
**Created**: 2026-08-09
**Updated**: 2026-08-09

## Overview

This plan turns [DESIGN.md](DESIGN.md) and [ARCHITECTURE.md](ARCHITECTURE.md)
into staged implementation work. Each stage should be completed in a focused
branch with tests or documented manual checks.

The repository is currently initialized as a simple documentation-first
baseline. No application scaffold has been installed yet.

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

Goal: create the actual Telegram Mini App codebase.

Deliverables:

- [ ] Select final web stack.
- [ ] Create frontend scaffold.
- [ ] Create backend scaffold.
- [ ] Add shared domain package or equivalent domain module.
- [ ] Add exact `dev`, `build`, `test`, and `lint` commands.
- [ ] Update [README.md](../README.md) with real setup instructions.

Recommended branch: `chore/app-scaffold`.

## Stage 2: Telegram App Shell

Goal: make the app open correctly inside Telegram and locally.

Deliverables:

- [ ] Load Telegram Web App SDK.
- [ ] Call `ready()` after initial render.
- [ ] Call `expand()` where supported.
- [ ] Add safe-area handling.
- [ ] Add theme variable support.
- [ ] Add local development fallback when Telegram SDK is unavailable.

Recommended branch: `feature/telegram-shell`.

## Stage 3: Domain Model and Financial Rules

Goal: establish reliable financial logic before UI polish.

Deliverables:

- [ ] Define currencies: `CZK`, `EUR`, `USD`.
- [ ] Define transaction types: expense, income, transfer.
- [ ] Define account, bucket, transaction, exchange-rate, and settings types.
- [ ] Store money in integer minor units.
- [ ] Add balance calculation service.
- [ ] Add bucket spent and remaining calculation service.
- [ ] Add manual currency conversion service.
- [ ] Add unit tests for all financial invariants.

Recommended branch: `feature/domain-models`.

## Stage 4: Telegram Authentication and Persistence

Goal: persist user-owned data securely.

Deliverables:

- [ ] Add Telegram init data validation.
- [ ] Reject stale or invalid auth payloads.
- [ ] Add database schema and migrations.
- [ ] Add user ownership checks.
- [ ] Add bootstrap endpoint.
- [ ] Add API tests for auth and ownership.

Recommended branch: `feature/telegram-auth`.

## Stage 5: Accounts and Settings

Goal: let users prepare the data needed for tracking.

Deliverables:

- [ ] Create accounts.
- [ ] Rename accounts.
- [ ] Archive or delete accounts safely.
- [ ] Set base currency.
- [ ] Enter manual exchange rates.
- [ ] Persist remembered defaults.

Recommended branch: `feature/settings-accounts-rates`.

## Stage 6: Dashboard

Goal: show balances and the main entry point for transaction capture.

Deliverables:

- [ ] Show total balance in base currency.
- [ ] Show active accounts and balances.
- [ ] Handle missing exchange rates clearly.
- [ ] Add compact empty state.
- [ ] Add primary Quick Add entry point.

Recommended branch: `feature/dashboard`.

## Stage 7: Categories and Account Detail

Goal: manage account-specific spending categories.

Deliverables:

- [ ] Show account balance.
- [ ] Show active categories.
- [ ] Create and rename categories.
- [ ] Archive or delete categories safely.
- [ ] Show spent and remaining amounts.
- [ ] Show recent account transactions.

Recommended branch: `feature/account-detail-buckets`.

## Stage 8: Quick Add

Goal: complete the core daily workflow.

Deliverables:

- [ ] Add expense flow.
- [ ] Add income flow.
- [ ] Add transfer flow.
- [ ] Validate amount and required accounts.
- [ ] Validate exchange-rate requirements.
- [ ] Remember last account, category, and currency.
- [ ] Trigger haptic success feedback after save.
- [ ] Refresh Dashboard and History after save.

Recommended branch: `feature/quick-add`.

## Stage 9: History

Goal: provide a simple, trustworthy transaction ledger.

Deliverables:

- [ ] Group transactions by date.
- [ ] Filter transactions by account.
- [ ] Show transaction details compactly.
- [ ] Confirm destructive deletion.
- [ ] Recalculate balances after deletion.

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
