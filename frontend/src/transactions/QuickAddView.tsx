import type { CurrencyCode, TransactionDraft, TransactionType } from "@tally/domain";
import { currencyCodes, parseMoneyInput } from "@tally/domain";
import type { FormEvent } from "react";
import { useState } from "react";
import type { FinanceStore } from "../app/useFinanceStore.js";
import type { TelegramAdapter } from "../telegram/useTelegramApp.js";

type QuickAddViewProps = Readonly<{
  store: FinanceStore;
  telegram: TelegramAdapter;
  onClose: () => void;
}>;

export function QuickAddView({ store, telegram, onClose }: QuickAddViewProps) {
  const settings = store.state.settings;
  const activeAccounts = store.state.accounts.filter((account) => !account.isArchived);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(settings.lastCurrency ?? "CZK");
  const [sourceAccountId, setSourceAccountId] = useState(settings.lastAccountId ?? activeAccounts[0]?.id ?? "");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [bucketId, setBucketId] = useState(settings.lastBucketId ?? "");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const sourceBuckets = store.state.buckets.filter(
    (bucket) => bucket.accountId === sourceAccountId && !bucket.isArchived,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const money = parseMoneyInput(amount, currency);
      const draft: TransactionDraft = {
        type,
        amountMinor: money.amountMinor,
        currency,
        sourceAccountId,
        ...(type === "transfer" ? { destinationAccountId } : {}),
        ...(type !== "transfer" && bucketId ? { bucketId } : {}),
        ...(comment.trim() ? { comment } : {}),
      };

      store.createTransaction(draft);
      telegram.notifySuccess();
      onClose();
    } catch (caught) {
      telegram.notifyError();
      setError(caught instanceof Error ? caught.message : "Transaction could not be saved.");
    }
  }

  return (
    <section className="modalBackdrop" role="dialog" aria-modal="true" aria-label="Quick add transaction">
      <form className="quickAddSheet" onSubmit={handleSubmit}>
        <div className="sectionHeader">
          <h2>Quick Add</h2>
          <button className="textButton" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="segmentedControl" aria-label="Transaction type">
          {(["expense", "income", "transfer"] as const).map((item) => (
            <button
              className={type === item ? "active" : ""}
              key={item}
              type="button"
              onClick={() => {
                setType(item);
                if (item === "transfer") {
                  setBucketId("");
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="fieldLabel">
          Amount
          <input
            autoFocus
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <label className="fieldLabel">
          Currency
          <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)}>
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>

        <label className="fieldLabel">
          Source account
          <select value={sourceAccountId} onChange={(event) => setSourceAccountId(event.target.value)}>
            {activeAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>

        {type === "transfer" ? (
          <label className="fieldLabel">
            Destination account
            <select value={destinationAccountId} onChange={(event) => setDestinationAccountId(event.target.value)}>
              <option value="">Choose destination</option>
              {activeAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {type !== "transfer" && sourceBuckets.length > 0 ? (
          <label className="fieldLabel">
            Category
            <select value={bucketId} onChange={(event) => setBucketId(event.target.value)}>
              <option value="">No category</option>
              {sourceBuckets.map((bucket) => (
                <option key={bucket.id} value={bucket.id}>
                  {bucket.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="fieldLabel">
          Comment
          <input value={comment} onChange={(event) => setComment(event.target.value)} />
        </label>

        {error ? <p className="errorText">{error}</p> : null}

        <button className="primaryButton" type="submit">
          Save transaction
        </button>
      </form>
    </section>
  );
}

