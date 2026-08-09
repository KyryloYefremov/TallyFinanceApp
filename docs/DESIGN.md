# Finance Tracker - Product Design
**Created**: 2026-08-09
**Updated**: 2026-08-09

## Overview

TallyFinanceApp is a Telegram Mini App for quick personal finance tracking. It
helps users manually record income, expenses, and transfers across a small set
of accounts, then immediately understand current balances and recent activity.

The product is intentionally practical. It is not a banking app, accounting
system, investment tracker, or analytics suite. Its value is speed, clarity, and
trustworthy manual records inside a place the user already opens every day:
Telegram.

Technical implementation details are covered in
[ARCHITECTURE.md](ARCHITECTURE.md). Delivery sequencing is covered in
[PLAN.md](PLAN.md).

## Target Users

The app is designed for individuals who want a lightweight daily finance habit
without spreadsheets or bank integrations.

Primary users:

- people who track spending manually;
- people with several accounts, cards, or cash balances;
- people who budget by practical categories such as food, transport, documents,
  travel, and subscriptions;
- people living across currencies, especially `CZK`, `EUR`, and `USD`;
- people who prefer a fast mobile flow over detailed accounting tools.

## Business Goals

The MVP should prove that users can maintain accurate personal finance records
with minimal effort.

Success means:

- a user can add the most common expense in a few seconds;
- account balances stay understandable and reliable;
- category spending helps users answer "how much remains";
- the app feels natural inside Telegram;
- the product stays small enough to use daily without setup fatigue.

## Key Features

### Dashboard

The Dashboard gives the user a quick answer to the most important question:
"How much money do I have right now?"

It shows:

- total balance in the selected base currency;
- active accounts with their current balances;
- a clear action to add a transaction;
- an empty state that guides first-time setup.

If some balances cannot be converted because exchange rates are missing, the
Dashboard should say that clearly instead of showing a misleading total.

### Accounts

Accounts represent places where money exists, such as a bank account, card,
cash wallet, or other balance.

Users can:

- create accounts;
- name accounts in their own language;
- choose an account currency;
- set an initial balance;
- rename accounts;
- archive accounts when they have transaction history;
- delete accounts only when it is safe to do so.

Archived accounts are hidden from everyday views but remain available for
history and recovery.

### Categories

Categories help users understand spending inside each account.

Users can:

- create categories inside an account;
- assign budgets or limits;
- see spent and remaining amounts;
- rename categories;
- archive categories without breaking old transactions;
- restore archived categories when needed.

Income can exist without a category. Transfers do not affect category spending.

### Quick Add

Quick Add is the core workflow. It should be the fastest path in the product and
must stay focused.

Users can record:

- expenses;
- income;
- transfers between accounts.

The flow should prioritize:

- large amount entry;
- clear transaction type selection;
- fast account selection;
- category selection for expenses;
- optional comments;
- remembered defaults for the last account, category, and currency;
- immediate success feedback.

The default transaction type should be expense unless usage data later shows a
better default.

### History

History gives users a simple ledger of financial activity.

Users can:

- browse transactions grouped by date;
- see the transaction type, amount, account, category, comment, and time;
- filter by account;
- delete an incorrect transaction after confirmation.

Deleting a transaction must update balances and category totals immediately.

### Currency Management

The MVP supports `CZK`, `EUR`, and `USD`.

Users can:

- choose a base currency;
- enter manual exchange rates;
- update rates when needed;
- see converted totals when rates are available.

The app does not fetch exchange rates automatically in the MVP.

### Telegram Experience

The app should feel like a focused utility inside Telegram.

Relevant Telegram behavior:

- launch from a bot menu or Mini App entry point;
- respect Telegram light and dark themes;
- use Telegram-native confirmation and feedback patterns where appropriate;
- handle mobile viewport and safe areas so controls are not hidden;
- support fast return to the main Telegram context.

## User Experience

### First Run

The user opens the app and sees a compact setup path:

1. Add the first account.
1. Choose currency.
1. Set initial balance.
1. Add the first category if desired.
1. Start tracking transactions.

The first-run experience should avoid explaining every feature. The user should
be able to start with one account and improve setup over time.

### Daily Use

Daily use centers on the Dashboard and Quick Add:

1. Open the Mini App from Telegram.
1. Check balances if needed.
1. Tap the primary add action.
1. Enter amount and confirm.
1. Return to Telegram or continue browsing history.

The app should minimize repeated choices by remembering recent selections.

### Error Handling

Errors should be short, specific, and recoverable.

Examples:

- amount must be greater than zero;
- source and destination accounts must be different;
- exchange rate is required;
- account is archived;
- transaction cannot be saved.

The app should never show partial financial totals without explaining what is
missing.

## MVP Scope

Included:

- account management;
- category management;
- expense, income, and transfer entry;
- transaction history;
- manual exchange rates;
- base currency;
- archive behavior for accounts and categories with history;
- Telegram launch, theming, safe-area handling, and feedback;
- tests for financial logic.

Not included:

- bank synchronization;
- automatic exchange rates;
- charts and advanced analytics;
- push notifications;
- social or shared budgets;
- export;
- receipts and attachments;
- subscription billing;
- complex multi-user permissions.

## Product Principles

- **Fast first**: common expense entry should take only a few seconds.
- **Reliable balances**: balances must be derived from transaction facts.
- **Simple vocabulary**: accounts, categories, transactions, and rates are
  enough for the MVP.
- **Recoverable changes**: archive historical entities instead of breaking old
  records.
- **Small surface area**: every feature must support daily manual tracking.
