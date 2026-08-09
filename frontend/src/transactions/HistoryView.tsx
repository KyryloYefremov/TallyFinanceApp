import { formatMoney } from "@tally/domain";
import type { FormEvent } from "react";
import { useState } from "react";
import type { FinanceStore } from "../app/useFinanceStore.js";
import { formatDateGroup, formatDateTime } from "../shared/date.js";
import {
  filterHistoryTransactions,
  getHistoryBucketOptions,
  getTransactionDisplayMoney,
  type TransactionDisplayMoney,
} from "./historyModel.js";

type HistoryViewProps = Readonly<{
  store: FinanceStore;
}>;

export function HistoryView({ store }: HistoryViewProps) {
  const [accountFilter, setAccountFilter] = useState("");
  const [bucketFilter, setBucketFilter] = useState("");
  const bucketOptions = getHistoryBucketOptions(store.state.buckets, accountFilter || undefined);
  const transactions = filterHistoryTransactions(
    store.state.transactions,
    {
      ...(accountFilter ? { accountId: accountFilter } : {}),
      ...(bucketFilter ? { bucketId: bucketFilter } : {}),
    },
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
          <div className="filterStack" aria-label="History filters">
            <select
              aria-label="Filter by account"
              value={accountFilter}
              onChange={(event) => {
                const nextAccountId = event.target.value;
                setAccountFilter(nextAccountId);

                const selectedBucket = store.state.buckets.find((bucket) => bucket.id === bucketFilter);
                if (selectedBucket && nextAccountId && selectedBucket.accountId !== nextAccountId) {
                  setBucketFilter("");
                }
              }}
            >
              <option value="">All accounts</option>
              {store.state.accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by category"
              value={bucketFilter}
              onChange={(event) => setBucketFilter(event.target.value)}
            >
              <option value="">All categories</option>
              {bucketOptions.map((bucket) => (
                <option key={bucket.id} value={bucket.id}>
                  {bucket.name}
                </option>
              ))}
            </select>
          </div>
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
                    const destination = store.state.accounts.find(
                      (account) => account.id === transaction.destinationAccountId,
                    );
                    const bucket = store.state.buckets.find((item) => item.id === transaction.bucketId);
                    const displayMoney = tryGetDisplayMoney(transaction, store);

                    return (
                      <article className="dataRow" key={transaction.id}>
                        <span>
                          <strong>{transaction.type}</strong>
                          <small>
                            {source?.name ?? "Unknown"}
                            {destination ? ` -> ${destination.name}` : ""}
                            {bucket ? ` • ${bucket.name}` : ""} • {formatDateTime(transaction.occurredAt)}
                          </small>
                          {transaction.comment ? <small>{transaction.comment}</small> : null}
                        </span>
                        <span className="amountStack">
                          {displayMoney.ok ? (
                            <>
                              <strong>{formatMoney(displayMoney.money.primary)}</strong>
                              {displayMoney.money.original ? (
                                <small>{formatMoney(displayMoney.money.original)} original</small>
                              ) : null}
                            </>
                          ) : (
                            <strong>Needs rate</strong>
                          )}
                        </span>
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

function tryGetDisplayMoney(
  transaction: Parameters<typeof getTransactionDisplayMoney>[0],
  store: FinanceStore,
): Readonly<{ ok: true; money: TransactionDisplayMoney }> | Readonly<{ ok: false }> {
  try {
    return { ok: true, money: getTransactionDisplayMoney(transaction, store.state) };
  } catch {
    return { ok: false };
  }
}

function groupByDate<T extends { occurredAt: string }>(items: readonly T[]): Array<Readonly<{ label: string; items: T[] }>> {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const label = formatDateGroup(item.occurredAt);
    groups.set(label, [...(groups.get(label) ?? []), item]);
  }

  return [...groups.entries()].map(([label, groupItems]) => ({ label, items: groupItems }));
}
