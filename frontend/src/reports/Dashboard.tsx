import { AlertTriangle } from "lucide-react";
import {
  calculateAccountBalanceMinor,
  calculateTotalBalance,
  formatMoney,
  type Money,
} from "@tally/domain";
import type { FinanceStore } from "../app/useFinanceStore.js";

type DashboardProps = Readonly<{
  store: FinanceStore;
  onOpenQuickAdd: () => void;
}>;

export function Dashboard({ store, onOpenQuickAdd }: DashboardProps) {
  const activeAccounts = store.state.accounts.filter((account) => !account.isArchived);
  const total = tryCalculateTotal(store);

  return (
    <section className="screenStack">
      <section className="heroPanel">
        <p className="eyebrow">Total balance</p>
        {total.ok ? (
          <strong className="heroAmount">{formatMoney(total.money)}</strong>
        ) : (
          <div className="warningLine">
            <AlertTriangle size={18} />
            <span>{total.message}</span>
          </div>
        )}
        <button className="primaryButton" type="button" onClick={onOpenQuickAdd}>
          Add transaction
        </button>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeader">
          <h2>Accounts</h2>
          <span>{activeAccounts.length} active</span>
        </div>

        {activeAccounts.length === 0 ? (
          <p className="emptyText">Add an account in Settings to start tracking.</p>
        ) : (
          <div className="rowList">
            {activeAccounts.map((account) => (
              <button
                className="accountButton"
                key={account.id}
                type="button"
                onClick={() => store.selectAccount(account.id)}
              >
                <span>
                  <strong>{account.name}</strong>
                  <small>{account.currency}</small>
                </span>
                <strong>
                  {formatMoney({
                    amountMinor: calculateAccountBalanceMinor(account, store.state.transactions),
                    currency: account.currency,
                  })}
                </strong>
              </button>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function tryCalculateTotal(store: FinanceStore):
  | Readonly<{ ok: true; money: Money }>
  | Readonly<{ ok: false; message: string }> {
  try {
    return {
      ok: true,
      money: calculateTotalBalance(
        store.state.accounts,
        store.state.transactions,
        store.state.exchangeRates,
        store.state.settings.baseCurrency,
      ),
    };
  } catch {
    return { ok: false, message: "Exchange rate required for total balance." };
  }
}
