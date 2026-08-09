import {
  calculateAccountBalanceMinor,
  calculateBucketRemainingMinor,
  calculateBucketSpentMinor,
  formatMoney,
  type Account,
  type Bucket,
} from "@tally/domain";
import type { FormEvent } from "react";
import { useState } from "react";
import type { FinanceStore } from "../app/useFinanceStore.js";
import { formatDateTime } from "../shared/date.js";

type AccountDetailProps = Readonly<{
  account: Account;
  store: FinanceStore;
  onBack: () => void;
  onOpenQuickAdd: () => void;
}>;

export function AccountDetail({ account, store, onBack, onOpenQuickAdd }: AccountDetailProps) {
  const [bucketName, setBucketName] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");
  const buckets = store.state.buckets
    .filter((bucket) => bucket.accountId === account.id)
    .sort((left, right) => left.sortOrder - right.sortOrder);
  const activeBuckets = buckets.filter((bucket) => !bucket.isArchived);
  const archivedBuckets = buckets.filter((bucket) => bucket.isArchived);
  const recentTransactions = store.state.transactions
    .filter(
      (transaction) =>
        transaction.sourceAccountId === account.id || transaction.destinationAccountId === account.id,
    )
    .slice(0, 5);

  function handleCreateBucket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!bucketName.trim()) {
      return;
    }

    try {
      store.createBucket({ accountId: account.id, name: bucketName, budget: budget || "0" });
      setBucketName("");
      setBudget("");
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Category could not be created.");
    }
  }

  const balance = tryCalculateAccountBalance(account, store);

  return (
    <section className="screenStack">
      <button className="textButton" type="button" onClick={onBack}>
        Back to dashboard
      </button>

      <section className="heroPanel compact">
        <p className="eyebrow">{account.currency} account</p>
        <h2>{account.name}</h2>
        <strong className="heroAmount">
          {balance.ok
            ? formatMoney({ amountMinor: balance.amountMinor, currency: account.currency })
            : "Needs rate"}
        </strong>
        <button className="primaryButton" type="button" onClick={onOpenQuickAdd}>
          Add transaction
        </button>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeader">
          <h2>Categories</h2>
          <span>{activeBuckets.length} active</span>
        </div>
        <form className="inlineForm" onSubmit={handleCreateBucket}>
          <input
            aria-label="Category name"
            placeholder="Category"
            value={bucketName}
            onChange={(event) => setBucketName(event.target.value)}
          />
          <input
            aria-label="Category budget"
            inputMode="decimal"
            placeholder="Budget"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        {error ? <p className="errorText">{error}</p> : null}

        <div className="rowList">
          {activeBuckets.map((bucket) => {
            const bucketTotals = tryCalculateBucketTotals(bucket, account.currency, store);

            return (
              <article className="dataRow" key={bucket.id}>
                <span>
                  <strong>{bucket.name}</strong>
                  {bucketTotals.ok ? (
                    <small>
                      Spent {formatMoney({ amountMinor: bucketTotals.spentMinor, currency: account.currency })} of{" "}
                      {formatMoney({ amountMinor: bucket.budgetMinor, currency: account.currency })}
                    </small>
                  ) : (
                    <small>Exchange rate required for category spending.</small>
                  )}
                </span>
                <span className={bucketTotals.ok && bucketTotals.remainingMinor < 0 ? "dangerText" : ""}>
                  {bucketTotals.ok
                    ? formatMoney({ amountMinor: bucketTotals.remainingMinor, currency: account.currency })
                    : "Needs rate"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const nextName = window.prompt("Category name", bucket.name);
                    if (nextName?.trim()) {
                      store.updateBucketName(bucket.id, nextName);
                    }
                  }}
                >
                  Rename
                </button>
                <button type="button" onClick={() => store.removeBucket(bucket.id)}>
                  Archive
                </button>
              </article>
            );
          })}
        </div>

        {archivedBuckets.length > 0 ? (
          <div className="rowList">
            {archivedBuckets.map((bucket) => (
              <article className="dataRow" key={bucket.id}>
                <span>
                  <strong>{bucket.name}</strong>
                  <small>Archived category kept for history</small>
                </span>
                <button type="button" onClick={() => store.restoreBucket(bucket.id)}>
                  Restore
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="sectionBlock">
        <div className="sectionHeader">
          <h2>Recent</h2>
          <span>{recentTransactions.length}</span>
        </div>
        {recentTransactions.length === 0 ? (
          <p className="emptyText">No transactions for this account yet.</p>
        ) : (
          <div className="rowList">
            {recentTransactions.map((transaction) => (
              <article className="dataRow" key={transaction.id}>
                <span>
                  <strong>{transaction.type}</strong>
                  <small>{formatDateTime(transaction.occurredAt)}</small>
                </span>
                <strong>{formatMoney({ amountMinor: transaction.amountMinor, currency: transaction.currency })}</strong>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function tryCalculateBucketTotals(
  bucket: Bucket,
  accountCurrency: Account["currency"],
  store: FinanceStore,
):
  | Readonly<{ ok: true; spentMinor: number; remainingMinor: number }>
  | Readonly<{ ok: false }> {
  try {
    return {
      ok: true,
      spentMinor: calculateBucketSpentMinor(
        bucket,
        store.state.transactions,
        accountCurrency,
        store.state.exchangeRates,
      ),
      remainingMinor: calculateBucketRemainingMinor(
        bucket,
        store.state.transactions,
        accountCurrency,
        store.state.exchangeRates,
      ),
    };
  } catch {
    return { ok: false };
  }
}

function tryCalculateAccountBalance(
  account: Account,
  store: FinanceStore,
): Readonly<{ ok: true; amountMinor: number }> | Readonly<{ ok: false }> {
  try {
    return {
      ok: true,
      amountMinor: calculateAccountBalanceMinor(
        account,
        store.state.transactions,
        store.state.exchangeRates,
      ),
    };
  } catch {
    return { ok: false };
  }
}
