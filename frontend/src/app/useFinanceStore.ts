import { useEffect, useState } from "react";
import {
  accountRemovalMode,
  bucketRemovalMode,
  parseNonNegativeMoneyInput,
  validateTransactionDraft,
  type CurrencyCode,
  type ExchangeRate,
  type Transaction,
  type TransactionDraft,
} from "@tally/domain";
import { createInitialState, type FinanceState } from "./createInitialState.js";

const storageKey = "tally-finance-state-v1";

export type FinanceStore = Readonly<{
  state: FinanceState;
  selectedAccountId: string | undefined;
  selectAccount: (accountId: string | undefined) => void;
  createAccount: (input: { name: string; currency: CurrencyCode; initialBalance: string }) => void;
  updateAccountName: (accountId: string, name: string) => void;
  removeAccount: (accountId: string) => void;
  createBucket: (input: { accountId: string; name: string; budget: string }) => void;
  updateBucketName: (bucketId: string, name: string) => void;
  removeBucket: (bucketId: string) => void;
  createTransaction: (draft: TransactionDraft) => void;
  deleteTransaction: (transactionId: string) => void;
  updateBaseCurrency: (currency: CurrencyCode) => void;
  updateExchangeRate: (fromCurrency: CurrencyCode, toCurrency: CurrencyCode, rateDecimalString: string) => void;
  resetDemoData: () => void;
}>;

export function useFinanceStore(): FinanceStore {
  const [state, setState] = useState<FinanceState>(() => loadState());
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return {
    state,
    selectedAccountId,
    selectAccount: setSelectedAccountId,
    createAccount(input) {
      const now = new Date().toISOString();
      const initialBalance = parseNonNegativeMoneyInput(input.initialBalance || "0", input.currency);

      setState((current) => ({
        ...current,
        accounts: [
          ...current.accounts,
          {
            id: crypto.randomUUID(),
            name: input.name.trim(),
            currency: input.currency,
            initialBalanceMinor: initialBalance.amountMinor,
            isArchived: false,
            createdAt: now,
            updatedAt: now,
          },
        ],
      }));
    },
    updateAccountName(accountId, name) {
      const now = new Date().toISOString();
      setState((current) => ({
        ...current,
        accounts: current.accounts.map((account) =>
          account.id === accountId ? { ...account, name: name.trim(), updatedAt: now } : account,
        ),
      }));
    },
    removeAccount(accountId) {
      setState((current) => {
        const mode = accountRemovalMode(accountId, current.transactions);

        if (mode === "delete") {
          return {
            ...current,
            accounts: current.accounts.filter((account) => account.id !== accountId),
            buckets: current.buckets.filter((bucket) => bucket.accountId !== accountId),
          };
        }

        return {
          ...current,
          accounts: current.accounts.map((account) =>
            account.id === accountId ? { ...account, isArchived: true, updatedAt: new Date().toISOString() } : account,
          ),
        };
      });
    },
    createBucket(input) {
      const account = state.accounts.find((item) => item.id === input.accountId);

      if (!account) {
        throw new Error("Account was not found.");
      }

      const now = new Date().toISOString();
      const budget = parseNonNegativeMoneyInput(input.budget || "0", account.currency);
      const nextSortOrder = state.buckets.filter((bucket) => bucket.accountId === input.accountId).length;

      setState((current) => ({
        ...current,
        buckets: [
          ...current.buckets,
          {
            id: crypto.randomUUID(),
            accountId: input.accountId,
            name: input.name.trim(),
            budgetMinor: budget.amountMinor,
            sortOrder: nextSortOrder,
            isArchived: false,
            createdAt: now,
            updatedAt: now,
          },
        ],
      }));
    },
    updateBucketName(bucketId, name) {
      const now = new Date().toISOString();
      setState((current) => ({
        ...current,
        buckets: current.buckets.map((bucket) =>
          bucket.id === bucketId ? { ...bucket, name: name.trim(), updatedAt: now } : bucket,
        ),
      }));
    },
    removeBucket(bucketId) {
      setState((current) => {
        const mode = bucketRemovalMode(bucketId, current.transactions);

        if (mode === "delete") {
          return {
            ...current,
            buckets: current.buckets.filter((bucket) => bucket.id !== bucketId),
          };
        }

        return {
          ...current,
          buckets: current.buckets.map((bucket) =>
            bucket.id === bucketId ? { ...bucket, isArchived: true, updatedAt: new Date().toISOString() } : bucket,
          ),
        };
      });
    },
    createTransaction(draft) {
      validateTransactionDraft(draft, state.accounts, state.buckets, state.exchangeRates);

      const now = new Date().toISOString();
      const sourceAccountId = draft.sourceAccountId;

      if (!sourceAccountId) {
        throw new Error("Choose an active source account.");
      }

      const transaction: Transaction = {
        id: crypto.randomUUID(),
        type: draft.type,
        amountMinor: draft.amountMinor,
        currency: draft.currency,
        sourceAccountId,
        occurredAt: now,
        createdAt: now,
        updatedAt: now,
        ...(draft.destinationAccountId ? { destinationAccountId: draft.destinationAccountId } : {}),
        ...(draft.bucketId && draft.type !== "transfer" ? { bucketId: draft.bucketId } : {}),
        ...(draft.comment?.trim() ? { comment: draft.comment.trim() } : {}),
      };

      setState((current) => ({
        ...current,
        transactions: [transaction, ...current.transactions],
        settings: {
          ...current.settings,
          lastAccountId: sourceAccountId,
          ...(draft.bucketId ? { lastBucketId: draft.bucketId } : {}),
          lastCurrency: draft.currency,
        },
      }));
    },
    deleteTransaction(transactionId) {
      setState((current) => ({
        ...current,
        transactions: current.transactions.filter((transaction) => transaction.id !== transactionId),
      }));
    },
    updateBaseCurrency(currency) {
      setState((current) => ({
        ...current,
        settings: { ...current.settings, baseCurrency: currency },
      }));
    },
    updateExchangeRate(fromCurrency, toCurrency, rateDecimalString) {
      const now = new Date().toISOString();
      setState((current) => ({
        ...current,
        exchangeRates: upsertRate(current.exchangeRates, {
          id: `rate-${fromCurrency.toLowerCase()}-${toCurrency.toLowerCase()}`,
          fromCurrency,
          toCurrency,
          rateDecimalString: rateDecimalString.trim().replace(",", "."),
          updatedAt: now,
        }),
      }));
    },
    resetDemoData() {
      setState(createInitialState());
      setSelectedAccountId(undefined);
    },
  };
}

function loadState(): FinanceState {
  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return createInitialState();
  }

  try {
    return JSON.parse(raw) as FinanceState;
  } catch {
    return createInitialState();
  }
}

function upsertRate(rates: readonly ExchangeRate[], nextRate: ExchangeRate): ExchangeRate[] {
  return rates.some(
    (rate) => rate.fromCurrency === nextRate.fromCurrency && rate.toCurrency === nextRate.toCurrency,
  )
    ? rates.map((rate) =>
        rate.fromCurrency === nextRate.fromCurrency && rate.toCurrency === nextRate.toCurrency ? nextRate : rate,
      )
    : [...rates, nextRate];
}
