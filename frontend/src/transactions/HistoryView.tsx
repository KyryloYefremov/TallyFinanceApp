import { formatMoney } from "@tally/domain";
import type { FormEvent } from "react";
import { useState } from "react";
import type { FinanceStore } from "../app/useFinanceStore.js";
import { formatDateGroup, formatDateTime } from "../shared/date.js";

type HistoryViewProps = Readonly<{
  store: FinanceStore;
}>;

export function HistoryView({ store }: HistoryViewProps) {
  const [accountFilter, setAccountFilter] = useState("");
  const transactions = store.state.transactions.filter(
    (transaction) =>
      !accountFilter ||
      transaction.sourceAccountId === accountFilter ||
      transaction.destinationAccountId === accountFilter,
  );
  const grouped = groupByDate(transactions);

  function handleDelete(event: FormEvent<HTMLButtonElement>, transactionId: string) {
    event.preventDefault();

    if (window.confirm("Delete this transaction? Balances will be recalculated.")) {
      store.deleteTransaction(transactionId);
    }
  }

  return (
    <section className="screenStack">
      <section className="sectionBlock">
        <div className="sectionHeader">
          <h2>History</h2>
          <select value={accountFilter} onChange={(event) => setAccountFilter(event.target.value)}>
            <option value="">All accounts</option>
            {store.state.accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        {grouped.length === 0 ? (
          <p className="emptyText">No transactions yet.</p>
        ) : (
          <div className="historyGroups">
            {grouped.map((group) => (
              <section key={group.label}>
                <h3>{group.label}</h3>
                <div className="rowList">
                  {group.items.map((transaction) => {
                    const source = store.state.accounts.find((account) => account.id === transaction.sourceAccountId);
                    const bucket = store.state.buckets.find((item) => item.id === transaction.bucketId);

                    return (
                      <article className="dataRow" key={transaction.id}>
                        <span>
                          <strong>{transaction.type}</strong>
                          <small>
                            {source?.name ?? "Unknown"} {bucket ? `• ${bucket.name}` : ""} •{" "}
                            {formatDateTime(transaction.occurredAt)}
                          </small>
                          {transaction.comment ? <small>{transaction.comment}</small> : null}
                        </span>
                        <strong>{formatMoney({ amountMinor: transaction.amountMinor, currency: transaction.currency })}</strong>
                        <button type="button" onClick={(event) => handleDelete(event, transaction.id)}>
                          Delete
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function groupByDate<T extends { occurredAt: string }>(items: readonly T[]): Array<Readonly<{ label: string; items: T[] }>> {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const label = formatDateGroup(item.occurredAt);
    groups.set(label, [...(groups.get(label) ?? []), item]);
  }

  return [...groups.entries()].map(([label, groupItems]) => ({ label, items: groupItems }));
}

