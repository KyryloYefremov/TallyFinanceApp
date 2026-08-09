import type { CurrencyCode } from "@tally/domain";
import { currencyCodes } from "@tally/domain";
import type { FormEvent } from "react";
import { useState } from "react";
import type { FinanceStore } from "../app/useFinanceStore.js";

type SettingsViewProps = Readonly<{
  store: FinanceStore;
}>;

export function SettingsView({ store }: SettingsViewProps) {
  const [accountName, setAccountName] = useState("");
  const [accountCurrency, setAccountCurrency] = useState<CurrencyCode>("CZK");
  const [initialBalance, setInitialBalance] = useState("0");

  function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accountName.trim()) {
      return;
    }

    store.createAccount({
      name: accountName,
      currency: accountCurrency,
      initialBalance,
    });
    setAccountName("");
    setInitialBalance("0");
  }

  return (
    <section className="screenStack">
      <section className="sectionBlock">
        <div className="sectionHeader">
          <h2>Accounts</h2>
          <span>{store.state.accounts.length}</span>
        </div>
        <form className="inlineForm" onSubmit={handleCreateAccount}>
          <input
            aria-label="Account name"
            placeholder="Account name"
            value={accountName}
            onChange={(event) => setAccountName(event.target.value)}
          />
          <select
            aria-label="Account currency"
            value={accountCurrency}
            onChange={(event) => setAccountCurrency(event.target.value as CurrencyCode)}
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <input
            aria-label="Initial balance"
            inputMode="decimal"
            value={initialBalance}
            onChange={(event) => setInitialBalance(event.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        <div className="rowList">
          {store.state.accounts.map((account) => (
            <article className="dataRow" key={account.id}>
              <span>
                <strong>{account.name}</strong>
                <small>
                  {account.currency} {account.isArchived ? "• archived" : ""}
                </small>
              </span>
              <button
                type="button"
                onClick={() => {
                  const nextName = window.prompt("Account name", account.name);
                  if (nextName?.trim()) {
                    store.updateAccountName(account.id, nextName);
                  }
                }}
              >
                Rename
              </button>
              <button type="button" onClick={() => store.removeAccount(account.id)}>
                {account.isArchived ? "Archived" : "Remove"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeader">
          <h2>Currency</h2>
          <span>Manual rates</span>
        </div>
        <label className="fieldLabel">
          Base currency
          <select
            value={store.state.settings.baseCurrency}
            onChange={(event) => store.updateBaseCurrency(event.target.value as CurrencyCode)}
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
        <RateField fromCurrency="EUR" store={store} />
        <RateField fromCurrency="USD" store={store} />
      </section>

      <section className="sectionBlock">
        <div className="sectionHeader">
          <h2>App</h2>
          <span>Local MVP</span>
        </div>
        <p className="mutedText">Data is stored in this browser for the first testable MVP.</p>
        <button type="button" onClick={store.resetDemoData}>
          Reset demo data
        </button>
      </section>
    </section>
  );
}

type RateFieldProps = Readonly<{
  fromCurrency: Exclude<CurrencyCode, "CZK">;
  store: FinanceStore;
}>;

function RateField({ fromCurrency, store }: RateFieldProps) {
  const rate = store.state.exchangeRates.find(
    (item) => item.fromCurrency === fromCurrency && item.toCurrency === "CZK",
  );

  return (
    <label className="fieldLabel">
      1 {fromCurrency} = CZK
      <input
        inputMode="decimal"
        value={rate?.rateDecimalString ?? ""}
        onChange={(event) => store.updateExchangeRate(fromCurrency, "CZK", event.target.value)}
      />
    </label>
  );
}

