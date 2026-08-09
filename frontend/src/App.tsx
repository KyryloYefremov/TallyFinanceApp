import { useEffect, useState } from "react";
import { AccountDetail } from "./accounts/AccountDetail.js";
import { useFinanceStore } from "./app/useFinanceStore.js";
import { Dashboard } from "./reports/Dashboard.js";
import { SettingsView } from "./settings/SettingsView.js";
import { useTelegramApp } from "./telegram/useTelegramApp.js";
import { HistoryView } from "./transactions/HistoryView.js";
import { QuickAddView } from "./transactions/QuickAddView.js";

type ActiveTab = "dashboard" | "history" | "settings";

export function App() {
  const telegram = useTelegramApp();
  const store = useFinanceStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  useEffect(() => {
    telegram.ready();
    telegram.expand();
  }, [telegram]);

  const selectedAccount = store.state.accounts.find(
    (account) => account.id === store.selectedAccountId,
  );

  return (
    <main className="appShell">
      <header className="appHeader">
        <div>
          <p className="eyebrow">Telegram Mini App</p>
          <h1>TallyFinance</h1>
        </div>
        <button className="primaryIconButton" type="button" onClick={() => setQuickAddOpen(true)}>
          +
        </button>
      </header>

      {activeTab === "dashboard" ? (
        selectedAccount ? (
          <AccountDetail
            account={selectedAccount}
            store={store}
            onBack={() => store.selectAccount(undefined)}
            onOpenQuickAdd={() => setQuickAddOpen(true)}
          />
        ) : (
          <Dashboard store={store} onOpenQuickAdd={() => setQuickAddOpen(true)} />
        )
      ) : null}

      {activeTab === "history" ? <HistoryView store={store} /> : null}
      {activeTab === "settings" ? <SettingsView store={store} /> : null}

      {quickAddOpen ? (
        <QuickAddView
          store={store}
          telegram={telegram}
          onClose={() => setQuickAddOpen(false)}
        />
      ) : null}

      <nav className="bottomTabs" aria-label="Primary navigation">
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          type="button"
          onClick={() => {
            store.selectAccount(undefined);
            setActiveTab("dashboard");
          }}
        >
          Dashboard
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          type="button"
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          type="button"
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </nav>
    </main>
  );
}

