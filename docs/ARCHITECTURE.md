# Architecture
**Created**: 2026-08-09
**Updated**: 2026-08-09

This document will hold the implementation architecture for the Telegram Mini
App baseline once the scaffold is in place.

## Scope

The initial implementation should separate the codebase into:

- `frontend/` for the Telegram Mini App UI and client state;
- `backend/` for API boundaries, auth validation, and persistence services;
- `docs/` for durable product and engineering references;
- `tests/` for automated validation of financial logic and user flows.

## Immediate Next Steps

1. Create the application scaffold.
1. Define shared domain types for money, accounts, transactions, and currency.
1. Add deterministic unit tests for financial rules.
1. Document the finalized setup commands in [README.md](../README.md).

