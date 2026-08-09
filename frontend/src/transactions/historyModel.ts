import { convertMoney, createMoney, type Account, type Bucket, type Money, type Transaction } from "@tally/domain";
import type { FinanceState } from "../app/createInitialState.js";

export type HistoryFilters = Readonly<{
  accountId?: string;
  bucketId?: string;
}>;

export type TransactionDisplayMoney = Readonly<{
  primary: Money;
  original?: Money;
}>;

export function filterHistoryTransactions(
  transactions: readonly Transaction[],
  filters: HistoryFilters,
): Transaction[] {
  return transactions.filter((transaction) => {
    const matchesAccount =
      !filters.accountId ||
      transaction.sourceAccountId === filters.accountId ||
      transaction.destinationAccountId === filters.accountId;
    const matchesBucket = !filters.bucketId || transaction.bucketId === filters.bucketId;

    return matchesAccount && matchesBucket;
  });
}

export function getHistoryBucketOptions(
  buckets: readonly Bucket[],
  accountId?: string,
): Bucket[] {
  return buckets
    .filter((bucket) => !accountId || bucket.accountId === accountId)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function getTransactionDisplayMoney(
  transaction: Transaction,
  state: FinanceState,
): TransactionDisplayMoney {
  const sourceAccount = state.accounts.find((account) => account.id === transaction.sourceAccountId);

  if (!sourceAccount) {
    return {
      primary: createMoney(transaction.amountMinor, transaction.currency),
    };
  }

  const original = createMoney(transaction.amountMinor, transaction.currency);
  const primary = convertMoney(original, sourceAccount.currency, state.exchangeRates);

  return {
    primary,
    ...(primary.currency !== original.currency ? { original } : {}),
  };
}

export function findAccount(accounts: readonly Account[], accountId: string): Account | undefined {
  return accounts.find((account) => account.id === accountId);
}
