import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { migrations } from "./migrations.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

describe("database migrations", () => {
  it("registers the initial finance schema migration", () => {
    expect(migrations.map((migration) => migration.id)).toEqual(["0001_initial_finance_schema"]);
  });

  it("defines user-owned finance tables and indexes", async () => {
    const sql = await readFile(
      join(currentDir, "migrations", "0001_initial_finance_schema.sql"),
      "utf8",
    );

    expect(sql).toContain("CREATE TABLE IF NOT EXISTS users");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS accounts");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS buckets");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS transactions");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS exchange_rates");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS user_settings");
    expect(sql).toContain("user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE");
    expect(sql).toContain("transactions_user_id_occurred_at_idx");
    expect(sql).toContain("UNIQUE (user_id, from_currency_code, to_currency_code)");
  });
});
