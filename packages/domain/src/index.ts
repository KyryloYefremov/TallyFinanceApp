export type CurrencyCode = "CZK" | "EUR" | "USD";

export const currencyCodes: readonly CurrencyCode[] = ["CZK", "EUR", "USD"];

export type TransactionType = "expense" | "income" | "transfer";

export type Money = Readonly<{
  amountMinor: number;
  currency: CurrencyCode;
}>;

export type Account = Readonly<{
  id: string;
  name: string;
  currency: CurrencyCode;
  initialBalanceMinor: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}>;

export type Bucket = Readonly<{
  id: string;
  accountId: string;
  name: string;
  budgetMinor: number;
  sortOrder: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}>;

export type Transaction = Readonly<{
  id: string;
  type: TransactionType;
  amountMinor: number;
  currency: CurrencyCode;
  sourceAccountId: string;
  destinationAccountId?: string;
  bucketId?: string;
  occurredAt: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}>;

export type ExchangeRate = Readonly<{
  id: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rateDecimalString: string;
  updatedAt: string;
}>;

export type UserSettings = Readonly<{
  baseCurrency: CurrencyCode;
  lastAccountId?: string;
  lastBucketId?: string;
  lastCurrency?: CurrencyCode;
}>;

export type TransactionDraft = Readonly<{
  type: TransactionType;
  amountMinor: number;
  currency: CurrencyCode;
  sourceAccountId?: string;
  destinationAccountId?: string;
  bucketId?: string;
  comment?: string;
}>;

export class DomainError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class MissingExchangeRateError extends DomainError {
  public constructor(fromCurrency: CurrencyCode, toCurrency: CurrencyCode) {
    super(`Missing exchange rate: ${fromCurrency} to ${toCurrency}.`);
    this.name = "MissingExchangeRateError";
  }
}

/** Creates a validated money value stored in minor units. */
export function createMoney(amountMinor: number, currency: CurrencyCode): Money {
  assertSafeInteger(amountMinor, "Money amount");

  return { amountMinor, currency };
}

/** Parses user-entered decimal money into integer minor units. */
export function parseMoneyInput(input: string, currency: CurrencyCode): Money {
  return parseDecimalMoneyInput(input, currency, false);
}

/** Parses user-entered decimal money where zero is a valid value. */
export function parseNonNegativeMoneyInput(input: string, currency: CurrencyCode): Money {
  return parseDecimalMoneyInput(input, currency, true);
}

function parseDecimalMoneyInput(input: string, currency: CurrencyCode, allowZero: boolean): Money {
  const normalized = input.trim().replace(",", ".");

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new DomainError("Amount must be a positive number with up to 2 decimals.");
  }

  const [majorPart = "0", minorPart = ""] = normalized.split(".");
  const amountMinor = Number.parseInt(majorPart, 10) * 100 + Number.parseInt(minorPart.padEnd(2, "0"), 10);

  if (amountMinor < 0 || (!allowZero && amountMinor === 0)) {
    throw new DomainError("Amount must be greater than zero.");
  }

  return createMoney(amountMinor, currency);
}

/** Formats minor units for display with a stable currency formatter. */
export function formatMoney(money: Money, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    currency: money.currency,
    style: "currency",
  }).format(money.amountMinor / 100);
}

/** Calculates an account balance in the account currency from transaction facts. */
export function calculateAccountBalanceMinor(
  account: Account,
  transactions: readonly Transaction[],
  rates: readonly ExchangeRate[] = [],
): number {
  return transactions.reduce((balance, transaction) => {
    if (transaction.sourceAccountId === account.id) {
      const amount = convertMoney(
        createMoney(transaction.amountMinor, transaction.currency),
        account.currency,
        rates,
      ).amountMinor;

      if (transaction.type === "expense" || transaction.type === "transfer") {
        return balance - amount;
      }

      return balance + amount;
    }

    if (transaction.destinationAccountId === account.id && transaction.type === "transfer") {
      const amount = convertMoney(
        createMoney(transaction.amountMinor, transaction.currency),
        account.currency,
        rates,
      ).amountMinor;

      return balance + amount;
    }

    return balance;
  }, account.initialBalanceMinor);
}

/** Calculates spending for a bucket from expense transactions only. */
export function calculateBucketSpentMinor(
  bucket: Bucket,
  transactions: readonly Transaction[],
  bucketCurrency: CurrencyCode,
  rates: readonly ExchangeRate[] = [],
): number {
  return transactions.reduce((spent, transaction) => {
    if (transaction.type !== "expense" || transaction.bucketId !== bucket.id) {
      return spent;
    }

    return (
      spent +
      convertMoney(
        createMoney(transaction.amountMinor, transaction.currency),
        bucketCurrency,
        rates,
      ).amountMinor
    );
  }, 0);
}

/** Returns the remaining bucket budget in minor units. */
export function calculateBucketRemainingMinor(
  bucket: Bucket,
  transactions: readonly Transaction[],
  bucketCurrency: CurrencyCode,
  rates: readonly ExchangeRate[] = [],
): number {
  return bucket.budgetMinor - calculateBucketSpentMinor(bucket, transactions, bucketCurrency, rates);
}

/** Converts money using direct, reverse, or CZK-routed manual exchange rates. */
export function convertMoney(
  money: Money,
  toCurrency: CurrencyCode,
  rates: readonly ExchangeRate[],
): Money {
  if (money.currency === toCurrency) {
    return money;
  }

  const rate = findRate(money.currency, toCurrency, rates);

  if (rate === undefined) {
    throw new MissingExchangeRateError(money.currency, toCurrency);
  }

  return createMoney(Math.round(money.amountMinor * rate), toCurrency);
}

/** Calculates a converted total across accounts. */
export function calculateTotalBalance(
  accounts: readonly Account[],
  transactions: readonly Transaction[],
  rates: readonly ExchangeRate[],
  baseCurrency: CurrencyCode,
): Money {
  const amountMinor = accounts
    .filter((account) => !account.isArchived)
    .reduce((total, account) => {
      const balance = createMoney(
        calculateAccountBalanceMinor(account, transactions, rates),
        account.currency,
      );
      return total + convertMoney(balance, baseCurrency, rates).amountMinor;
    }, 0);

  return createMoney(amountMinor, baseCurrency);
}

/** Validates a transaction draft before persistence. */
export function validateTransactionDraft(
  draft: TransactionDraft,
  accounts: readonly Account[],
  buckets: readonly Bucket[],
  rates: readonly ExchangeRate[],
  transactions: readonly Transaction[] = [],
): void {
  if (!Number.isSafeInteger(draft.amountMinor) || draft.amountMinor <= 0) {
    throw new DomainError("Amount must be greater than zero.");
  }

  const sourceAccount = accounts.find((account) => account.id === draft.sourceAccountId);

  if (!sourceAccount || sourceAccount.isArchived) {
    throw new DomainError("Choose an active source account.");
  }

  if (sourceAccount.currency !== draft.currency) {
    convertMoney(createMoney(draft.amountMinor, draft.currency), sourceAccount.currency, rates);
  }

  assertSourceAccountCanFundDraft(draft, sourceAccount, transactions, rates);

  if (draft.type === "transfer") {
    const destinationAccount = accounts.find((account) => account.id === draft.destinationAccountId);

    if (!destinationAccount || destinationAccount.isArchived) {
      throw new DomainError("Choose an active destination account.");
    }

    if (sourceAccount.id === destinationAccount.id) {
      throw new DomainError("Source and destination accounts must be different.");
    }

    if (draft.bucketId) {
      throw new DomainError("Transfers cannot use categories.");
    }

    if (destinationAccount.currency !== draft.currency) {
      convertMoney(createMoney(draft.amountMinor, draft.currency), destinationAccount.currency, rates);
    }

    return;
  }

  if (draft.destinationAccountId) {
    throw new DomainError("Only transfers can have a destination account.");
  }

  if (draft.bucketId) {
    const bucket = buckets.find((item) => item.id === draft.bucketId);

    if (!bucket || bucket.isArchived || bucket.accountId !== sourceAccount.id) {
      throw new DomainError("Choose an active category for the selected account.");
    }
  }
}

function assertSourceAccountCanFundDraft(
  draft: TransactionDraft,
  sourceAccount: Account,
  transactions: readonly Transaction[],
  rates: readonly ExchangeRate[],
): void {
  if (draft.type !== "expense" && draft.type !== "transfer") {
    return;
  }

  const withdrawalMinor = convertMoney(
    createMoney(draft.amountMinor, draft.currency),
    sourceAccount.currency,
    rates,
  ).amountMinor;
  const balanceMinor = calculateAccountBalanceMinor(sourceAccount, transactions, rates);

  if (withdrawalMinor > balanceMinor) {
    throw new DomainError("Insufficient account balance.");
  }
}

/** Determines whether an account should be deleted or archived. */
export function accountRemovalMode(accountId: string, transactions: readonly Transaction[]): "delete" | "archive" {
  return transactions.some(
    (transaction) => transaction.sourceAccountId === accountId || transaction.destinationAccountId === accountId,
  )
    ? "archive"
    : "delete";
}

/** Determines whether a bucket should be deleted or archived. */
export function bucketRemovalMode(bucketId: string, transactions: readonly Transaction[]): "delete" | "archive" {
  return transactions.some((transaction) => transaction.bucketId === bucketId) ? "archive" : "delete";
}

function findRate(
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  rates: readonly ExchangeRate[],
): number | undefined {
  const direct = parseRate(fromCurrency, toCurrency, rates);

  if (direct !== undefined) {
    return direct;
  }

  const reverse = parseRate(toCurrency, fromCurrency, rates);

  if (reverse !== undefined) {
    return 1 / reverse;
  }

  if (fromCurrency !== "CZK" && toCurrency !== "CZK") {
    const toCzk = findRate(fromCurrency, "CZK", rates);
    const fromCzk = findRate("CZK", toCurrency, rates);

    if (toCzk !== undefined && fromCzk !== undefined) {
      return toCzk * fromCzk;
    }
  }

  return undefined;
}

function parseRate(
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  rates: readonly ExchangeRate[],
): number | undefined {
  const rate = rates.find(
    (item) => item.fromCurrency === fromCurrency && item.toCurrency === toCurrency,
  );

  if (!rate) {
    return undefined;
  }

  const parsed = Number.parseFloat(rate.rateDecimalString);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new DomainError("Exchange rate must be greater than zero.");
  }

  return parsed;
}

function assertSafeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value)) {
    throw new DomainError(`${label} must be a safe integer.`);
  }
}
