import { describe, expect, it } from "vitest";
import type { Account, Bucket, ExchangeRate, Transaction } from "@tally/domain";
import type { FinanceState } from "../app/createInitialState.js";
import {
  filterHistoryTransactions,
  getHistoryBucketOptions,
  getTransactionDisplayMoney,
} from "./historyModel.js";

const now = "2026-08-09T12:00:00.000Z";

const accounts: Account[] = [
  {
    id: "cash",
    name: "Cash",
    currency: "CZK",
    initialBalanceMinor: 25_000,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "eur",
    name: "Euro",
    currency: "EUR",
    initialBalanceMinor: 1_000,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  },
];

const buckets: Bucket[] = [
  {
    id: "laptop",
    accountId: "cash",
    name: "Laptop",
    budgetMinor: 25_000,
    sortOrder: 0,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "travel",
    accountId: "eur",
    name: "Travel",
    budgetMinor: 20_000,
    sortOrder: 0,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  },
];

const exchangeRates: ExchangeRate[] = [
  {
    id: "eur-czk",
    fromCurrency: "EUR",
    toCurrency: "CZK",
    rateDecimalString: "25",
    updatedAt: now,
  },
];

const transactions: Transaction[] = [
  {
    id: "laptop-eur-expense",
    type: "expense",
    amountMinor: 10_000,
    currency: "EUR",
    sourceAccountId: "cash",
    bucketId: "laptop",
    occurredAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "travel-expense",
    type: "expense",
    amountMinor: 500,
    currency: "EUR",
    sourceAccountId: "eur",
    bucketId: "travel",
    occurredAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cash-income",
    type: "income",
    amountMinor: 1_000,
    currency: "CZK",
    sourceAccountId: "cash",
    occurredAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

const state: FinanceState = {
  accounts,
  buckets,
  transactions,
  exchangeRates,
  settings: {
    baseCurrency: "CZK",
  },
};

describe("history model", () => {
  it("filters transactions by category", () => {
    expect(filterHistoryTransactions(transactions, { bucketId: "laptop" }).map((item) => item.id)).toEqual([
      "laptop-eur-expense",
    ]);
  });

  it("combines account and category filters", () => {
    expect(
      filterHistoryTransactions(transactions, {
        accountId: "cash",
        bucketId: "travel",
      }),
    ).toEqual([]);
  });

  it("limits category options to the selected account", () => {
    expect(getHistoryBucketOptions(buckets, "cash").map((bucket) => bucket.id)).toEqual(["laptop"]);
  });

  it("displays cross-currency expense amounts in the source account currency", () => {
    const [transaction] = transactions;

    if (!transaction) {
      throw new Error("Expected fixture transaction.");
    }

    expect(getTransactionDisplayMoney(transaction, state)).toEqual({
      primary: {
        amountMinor: 250_000,
        currency: "CZK",
      },
      original: {
        amountMinor: 10_000,
        currency: "EUR",
      },
    });
  });
});
