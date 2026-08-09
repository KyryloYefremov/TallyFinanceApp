import {
  calculateAccountBalanceMinor,
  calculateBucketRemainingMinor,
  calculateBucketSpentMinor,
  formatMoney,
  type Account,
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

    store.createBucket({ accountId: account.id, name: bucketName, budget: budget || "0" });
    setBucketName("");
    setBudget("");
  }

  return (
    <section className="screenStack">
      <button className="textButton" type="button" onClick={onBack}>
        Back to dashboard
      </button>

      <section className="heroPanel compact">
        <p className="eyebrow">{account.currency} account</p>
        <h2>{account.name}</h2>
        <strong className="heroAmount">
          {formatMoney({
            amountMinor: calculateAccountBalanceMinor(
              account,
              store.state.transactions,
              store.state.exchangeRates,
            ),
            currency: account.currency,
          })}
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

        <div className="rowList">
          {activeBuckets.map((bucket) => {
            const spent = calculateBucketSpentMinor(bucket, store.state.transactions);
            const remaining = calculateBucketRemainingMinor(bucket, store.state.transactions);

            return (
              <article className="dataRow" key={bucket.id}>
                <span>
                  <strong>{bucket.name}</strong>
                  <small>
                    Spent {formatMoney({ amountMinor: spent, currency: account.currency })} of{" "}
                    {formatMoney({ amountMinor: bucket.budgetMinor, currency: account.currency })}
                  </small>
                </span>
                <span className={remaining < 0 ? "dangerText" : ""}>
                  {formatMoney({ amountMinor: remaining, currency: account.currency })}
                </span>
                <button type="button" onClick={() => store.removeBucket(bucket.id)}>
                  Archive
                </button>
              </article>
            );
          })}
        </div>

        {archivedBuckets.length > 0 ? (
          <p className="mutedText">{archivedBuckets.length} archived categories kept for history.</p>
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
