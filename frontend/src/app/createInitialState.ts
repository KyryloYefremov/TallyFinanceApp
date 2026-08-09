import type { Account, Bucket, ExchangeRate, Transaction, UserSettings } from "@tally/domain";

export type FinanceState = Readonly<{
  accounts: Account[];
  buckets: Bucket[];
  transactions: Transaction[];
  exchangeRates: ExchangeRate[];
  settings: UserSettings;
}>;

const createdAt = "2026-08-09T12:00:00.000Z";

export function createInitialState(): FinanceState {
  return {
    accounts: [
      {
        id: "account-cash",
        name: "Cash",
        currency: "CZK",
        initialBalanceMinor: 12_000,
        isArchived: false,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: "account-card",
        name: "Card",
        currency: "CZK",
        initialBalanceMinor: 35_000,
        isArchived: false,
        createdAt,
        updatedAt: createdAt,
      },
    ],
    buckets: [
      {
        id: "bucket-food",
        accountId: "account-card",
        name: "Food",
        budgetMinor: 8_000,
        sortOrder: 0,
        isArchived: false,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: "bucket-transport",
        accountId: "account-card",
        name: "Transport",
        budgetMinor: 3_000,
        sortOrder: 1,
        isArchived: false,
        createdAt,
        updatedAt: createdAt,
      },
    ],
    transactions: [],
    exchangeRates: [
      {
        id: "rate-eur-czk",
        fromCurrency: "EUR",
        toCurrency: "CZK",
        rateDecimalString: "25",
        updatedAt: createdAt,
      },
      {
        id: "rate-usd-czk",
        fromCurrency: "USD",
        toCurrency: "CZK",
        rateDecimalString: "23",
        updatedAt: createdAt,
      },
    ],
    settings: {
      baseCurrency: "CZK",
      lastCurrency: "CZK",
      lastAccountId: "account-card",
      lastBucketId: "bucket-food",
    },
  };
}

