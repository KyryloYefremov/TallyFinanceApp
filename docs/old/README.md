# TallyFinanceApp

TallyFinanceApp is an iPhone personal finance tracker for fast local tracking of income, expenses, and transfers across multiple accounts and categories.

Current status: development has started after approval of `PLAN.md`. The app currently has a SwiftUI tab shell with placeholder Dashboard, History, and Settings screens while domain features are implemented.

## Product Goal

The app is designed for quick manual finance tracking from a phone:

- multiple accounts;
- categories/buckets inside accounts;
- expense, income, and transfer transactions;
- local-only data;
- manual exchange rates for CZK, EUR, and USD;
- fast Quick Add flow;
- simple transaction history;
- Shortcuts/Siri entry point for opening Quick Add.

## Platform

- iOS, iPhone.
- Target requirement: iOS 17+.
- Language: Swift.
- UI: SwiftUI.
- Storage: SwiftData for app data, UserDefaults for lightweight preferences.
- Network/server: none.
- Tests: XCTest unit test target with code coverage enabled in the shared scheme.

## Repository Structure

```text
.
├── CLAUDE.md
├── DESIGN.md
├── PLAN.md
├── README.md
├── TallyFinanceApp/
│   ├── ContentView.swift
│   ├── TallyFinanceAppApp.swift
│   └── Assets.xcassets/
└── TallyFinanceApp.xcodeproj/
```

Project documents:

- `DESIGN.md` - full product, UX, data, architecture, and technical design.
- `PLAN.md` - step-by-step development plan and stage deliverables.
- `CLAUDE.md` - working context and rules for AI agents contributing to the project.
- `README.md` - project overview and setup instructions.

## How to Open and Run

Requirements:

- macOS with Xcode that supports SwiftUI and iOS 17+ development.
- An iOS simulator or physical iPhone.

Steps:

1. Open `TallyFinanceApp.xcodeproj` in Xcode.
2. Select the `TallyFinanceApp` scheme.
3. Select an iPhone simulator.
4. Press `Run`.

At the current stage, the app will show the default placeholder screen until implementation begins.

## Planned MVP Features

- Dashboard with account balances and total converted balance.
- Account detail screen with categories and recent transactions.
- Quick Add screen optimized for fast transaction entry.
- History grouped by date with account filter and swipe delete.
- Settings for accounts, base currency, and manual exchange rates.
- Local persistence with SwiftData.
- Shortcut/Siri action for opening Quick Add directly.
- Haptic feedback on transaction save.
- Light and dark theme support.

## Out of Scope for MVP

- Bank synchronization.
- Server backend.
- Cloud sync.
- Push notifications.
- Face ID/authentication.
- Charts and analytics.
- Export.
- Automatic exchange rates.

## Development Notes

Detailed development workflow, Git rules, code documentation standards, test expectations, and coverage goals are documented in `DESIGN.md`, `PLAN.md`, and `CLAUDE.md`.
