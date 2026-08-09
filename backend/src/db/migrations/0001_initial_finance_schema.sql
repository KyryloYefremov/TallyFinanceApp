CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL UNIQUE,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  language_code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  base_currency_code TEXT NOT NULL,
  last_account_id TEXT,
  last_bucket_id TEXT,
  last_currency_code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  initial_balance_minor BIGINT NOT NULL,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);

CREATE TABLE IF NOT EXISTS buckets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget_minor BIGINT NOT NULL,
  sort_order INTEGER NOT NULL,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS buckets_user_id_idx ON buckets(user_id);
CREATE INDEX IF NOT EXISTS buckets_account_id_idx ON buckets(account_id);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount_minor BIGINT NOT NULL,
  currency_code TEXT NOT NULL,
  source_account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  destination_account_id TEXT REFERENCES accounts(id) ON DELETE RESTRICT,
  bucket_id TEXT REFERENCES buckets(id) ON DELETE SET NULL,
  occurred_at TEXT NOT NULL,
  comment TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS transactions_user_id_occurred_at_idx ON transactions(user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS transactions_source_account_id_idx ON transactions(source_account_id);
CREATE INDEX IF NOT EXISTS transactions_destination_account_id_idx ON transactions(destination_account_id);
CREATE INDEX IF NOT EXISTS transactions_bucket_id_idx ON transactions(bucket_id);

CREATE TABLE IF NOT EXISTS exchange_rates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_currency_code TEXT NOT NULL,
  to_currency_code TEXT NOT NULL,
  rate_decimal_string TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (user_id, from_currency_code, to_currency_code)
);

CREATE INDEX IF NOT EXISTS exchange_rates_user_id_idx ON exchange_rates(user_id);
