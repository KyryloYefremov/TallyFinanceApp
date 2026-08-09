import { describe, expect, it } from "vitest";
import {
  accountRemovalMode,
  bucketRemovalMode,
  calculateAccountBalanceMinor,
  calculateBucketRemainingMinor,
  calculateBucketSpentMinor,
  calculateTotalBalance,
  convertMoney,
  createMoney,
  parseMoneyInput,
  validateTransactionDraft,
  type Account,
  type Bucket,
  type ExchangeRate,
  type Transaction,
} from "./index.js";

const now = "2026-08-09T12:00:00.000Z";

const cashAccount: Account = {
  id: "cash",
  name: "Cash",
  currency: "CZK",
  initialBalanceMinor: 10_000,
  isArchived: false,
  createdAt: now,
  updatedAt: now,
};

const cardAccount: Account = {
  id: "card",
  name: "Card",
  currency: "CZK",
  initialBalanceMinor: 20_000,
  isArchived: false,
  createdAt: now,
  updatedAt: now,
};

const eurAccount: Account = {
  id: "eur",
  name: "EUR",
  currency: "EUR",
  initialBalanceMinor: 1_000,
  isArchived: false,
  createdAt: now,
  updatedAt: now,
};

const accounts: Account[] = [cashAccount, cardAccount, eurAccount];

const bucket: Bucket = {
  id: "food",
  accountId: "card",
  name: "Food",
  budgetMinor: 5_000,
  sortOrder: 0,
  isArchived: false,
  createdAt: now,
  updatedAt: now,
};

const transactions: Transaction[] = [
  {
    id: "expense",
    type: "expense",
    amountMinor: 1_200,
    currency: "CZK",
    sourceAccountId: "card",
    bucketId: "food",
    occurredAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "income",
    type: "income",
    amountMinor: 3_000,
    currency: "CZK",
    sourceAccountId: "cash",
    occurredAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "transfer",
    type: "transfer",
    amountMinor: 2_000,
    currency: "CZK",
    sourceAccountId: "cash",
    destinationAccountId: "card",
    occurredAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

const rates: ExchangeRate[] = [
  {
    id: "eur-czk",
    fromCurrency: "EUR",
    toCurrency: "CZK",
    rateDecimalString: "25",
    updatedAt: now,
  },
  {
    id: "usd-czk",
    fromCurrency: "USD",
    toCurrency: "CZK",
    rateDecimalString: "23",
    updatedAt: now,
  },
];

describe("money", () => {
  it("stores safe integer minor units", () => {
    expect(createMoney(12345, "CZK")).toEqual({ amountMinor: 12345, currency: "CZK" });
  });

  it("parses decimal user input into minor units", () => {
    expect(parseMoneyInput("123,45", "EUR")).toEqual({ amountMinor: 12345, currency: "EUR" });
  });

  it("rejects invalid money input", () => {
    expect(() => parseMoneyInput("10.999", "CZK")).toThrow("up to 2 decimals");
  });
});

describe("financial calculations", () => {
  it("calculates account balances from ledger facts", () => {
    expect(calculateAccountBalanceMinor(cashAccount, transactions)).toBe(11_000);
    expect(calculateAccountBalanceMinor(cardAccount, transactions)).toBe(20_800);
  });

  it("calculates bucket spent and remaining from expenses only", () => {
    expect(calculateBucketSpentMinor(bucket, transactions)).toBe(1_200);
    expect(calculateBucketRemainingMinor(bucket, transactions)).toBe(3_800);
  });

  it("calculates total balance in base currency", () => {
    expect(calculateTotalBalance(accounts, transactions, rates, "CZK")).toEqual({
      amountMinor: 56_800,
      currency: "CZK",
    });
  });
});

describe("currency conversion", () => {
  it("uses direct and reverse rates", () => {
    expect(convertMoney({ amountMinor: 100, currency: "EUR" }, "CZK", rates)).toEqual({
      amountMinor: 2_500,
      currency: "CZK",
    });
    expect(convertMoney({ amountMinor: 2_500, currency: "CZK" }, "EUR", rates)).toEqual({
      amountMinor: 100,
      currency: "EUR",
    });
  });

  it("routes non-CZK pairs through CZK", () => {
    expect(convertMoney({ amountMinor: 100, currency: "EUR" }, "USD", rates)).toEqual({
      amountMinor: 109,
      currency: "USD",
    });
  });

  it("reports missing rates as recoverable errors", () => {
    expect(() => convertMoney({ amountMinor: 100, currency: "USD" }, "EUR", [])).toThrow(
      "Missing exchange rate",
    );
  });
});

describe("transaction validation", () => {
  it("accepts a valid expense draft", () => {
    expect(() =>
      validateTransactionDraft(
        {
          type: "expense",
          amountMinor: 250,
          currency: "CZK",
          sourceAccountId: "card",
          bucketId: "food",
        },
        accounts,
        [bucket],
        rates,
      ),
    ).not.toThrow();
  });

  it("rejects a transfer to the same account", () => {
    expect(() =>
      validateTransactionDraft(
        {
          type: "transfer",
          amountMinor: 500,
          currency: "CZK",
          sourceAccountId: "cash",
          destinationAccountId: "cash",
        },
        accounts,
        [bucket],
        rates,
      ),
    ).toThrow("different");
  });

  it("rejects categories from another account", () => {
    expect(() =>
      validateTransactionDraft(
        {
          type: "expense",
          amountMinor: 500,
          currency: "CZK",
          sourceAccountId: "cash",
          bucketId: "food",
        },
        accounts,
        [bucket],
        rates,
      ),
    ).toThrow("selected account");
  });
});

describe("archive rules", () => {
  it("archives accounts and buckets with transaction history", () => {
    expect(accountRemovalMode("cash", transactions)).toBe("archive");
    expect(bucketRemovalMode("food", transactions)).toBe("archive");
  });

  it("deletes accounts and buckets without transaction history", () => {
    expect(accountRemovalMode("unused", transactions)).toBe("delete");
    expect(bucketRemovalMode("unused", transactions)).toBe("delete");
  });
});
