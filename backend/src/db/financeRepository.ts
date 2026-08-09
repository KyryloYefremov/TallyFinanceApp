import type {
  Account,
  Bucket,
  CurrencyCode,
  ExchangeRate,
  Transaction,
  UserSettings,
} from "@tally/domain";
import type { TelegramUser } from "../telegram/validateInitData.js";

export type PersistedUser = Readonly<{
  id: string;
  telegramUserId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  createdAt: string;
  updatedAt: string;
}>;

export type BootstrapData = Readonly<{
  user: PersistedUser;
  accounts: Account[];
  buckets: Bucket[];
  transactions: Transaction[];
  exchangeRates: ExchangeRate[];
  settings: UserSettings;
}>;

export type FinanceRepository = Readonly<{
  upsertTelegramUser: (telegramUser: TelegramUser) => Promise<PersistedUser>;
  getBootstrapData: (userId: string) => Promise<BootstrapData>;
  accountBelongsToUser: (userId: string, accountId: string) => Promise<boolean>;
  bucketBelongsToUser: (userId: string, bucketId: string) => Promise<boolean>;
  transactionBelongsToUser: (userId: string, transactionId: string) => Promise<boolean>;
}>;

type UserOwned<T> = T & Readonly<{ userId: string }>;

export type InMemoryFinanceRepositorySeed = Readonly<{
  users?: PersistedUser[];
  accounts?: Array<UserOwned<Account>>;
  buckets?: Array<UserOwned<Bucket>>;
  transactions?: Array<UserOwned<Transaction>>;
  exchangeRates?: Array<UserOwned<ExchangeRate>>;
  settings?: Array<UserOwned<UserSettings>>;
}>;

export class InMemoryFinanceRepository implements FinanceRepository {
  private readonly users = new Map<string, PersistedUser>();
  private readonly accounts: Array<UserOwned<Account>>;
  private readonly buckets: Array<UserOwned<Bucket>>;
  private readonly transactions: Array<UserOwned<Transaction>>;
  private readonly exchangeRates: Array<UserOwned<ExchangeRate>>;
  private readonly settings = new Map<string, UserOwned<UserSettings>>();

  public constructor(seed: InMemoryFinanceRepositorySeed = {}) {
    for (const user of seed.users ?? []) {
      this.users.set(user.id, user);
    }

    this.accounts = [...(seed.accounts ?? [])];
    this.buckets = [...(seed.buckets ?? [])];
    this.transactions = [...(seed.transactions ?? [])];
    this.exchangeRates = [...(seed.exchangeRates ?? [])];

    for (const settings of seed.settings ?? []) {
      this.settings.set(settings.userId, settings);
    }
  }

  public async upsertTelegramUser(telegramUser: TelegramUser): Promise<PersistedUser> {
    const userId = createUserId(telegramUser.id);
    const existing = this.users.get(userId);
    const now = new Date().toISOString();
    const user: PersistedUser = {
      id: userId,
      telegramUserId: telegramUser.id,
      ...(telegramUser.username ? { username: telegramUser.username } : {}),
      ...(telegramUser.first_name ? { firstName: telegramUser.first_name } : {}),
      ...(telegramUser.last_name ? { lastName: telegramUser.last_name } : {}),
      ...(telegramUser.language_code ? { languageCode: telegramUser.language_code } : {}),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.users.set(userId, user);

    if (!this.settings.has(userId)) {
      this.settings.set(userId, {
        userId,
        baseCurrency: "CZK",
      });
    }

    return user;
  }

  public async getBootstrapData(userId: string): Promise<BootstrapData> {
    const user = this.users.get(userId);

    if (!user) {
      throw new Error("User was not found.");
    }

    return {
      user,
      accounts: stripUserId(this.accounts.filter((account) => account.userId === userId)),
      buckets: stripUserId(this.buckets.filter((bucket) => bucket.userId === userId)),
      transactions: stripUserId(this.transactions.filter((transaction) => transaction.userId === userId)),
      exchangeRates: stripUserId(this.exchangeRates.filter((rate) => rate.userId === userId)),
      settings: stripUserId(this.settings.get(userId) ?? createDefaultSettings(userId)),
    };
  }

  public async accountBelongsToUser(userId: string, accountId: string): Promise<boolean> {
    return this.accounts.some((account) => account.userId === userId && account.id === accountId);
  }

  public async bucketBelongsToUser(userId: string, bucketId: string): Promise<boolean> {
    return this.buckets.some((bucket) => bucket.userId === userId && bucket.id === bucketId);
  }

  public async transactionBelongsToUser(userId: string, transactionId: string): Promise<boolean> {
    return this.transactions.some(
      (transaction) => transaction.userId === userId && transaction.id === transactionId,
    );
  }
}

export function createUserId(telegramUserId: number): string {
  return `telegram-${telegramUserId}`;
}

function createDefaultSettings(userId: string): UserOwned<UserSettings> {
  return {
    userId,
    baseCurrency: "CZK" satisfies CurrencyCode,
  };
}

function stripUserId<T>(items: Array<UserOwned<T>>): T[];
function stripUserId<T>(item: UserOwned<T>): T;
function stripUserId<T>(value: Array<UserOwned<T>> | UserOwned<T>): T[] | T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUserId(item));
  }

  const { userId, ...item } = value;
  void userId;
  return item as T;
}
