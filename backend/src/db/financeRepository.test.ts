import { describe, expect, it } from "vitest";
import { createUserId, InMemoryFinanceRepository, type PersistedUser } from "./financeRepository.js";

const now = "2026-08-09T12:00:00.000Z";
const user: PersistedUser = {
  id: createUserId(100),
  telegramUserId: 100,
  firstName: "Owner",
  createdAt: now,
  updatedAt: now,
};
const otherUser: PersistedUser = {
  id: createUserId(200),
  telegramUserId: 200,
  firstName: "Other",
  createdAt: now,
  updatedAt: now,
};

describe("InMemoryFinanceRepository", () => {
  it("returns only records owned by the requested user", async () => {
    const repository = new InMemoryFinanceRepository({
      users: [user, otherUser],
      accounts: [
        {
          userId: user.id,
          id: "owner-account",
          name: "Owner card",
          currency: "CZK",
          initialBalanceMinor: 10_000,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: otherUser.id,
          id: "other-account",
          name: "Other card",
          currency: "CZK",
          initialBalanceMinor: 99_000,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
    });

    await expect(repository.getBootstrapData(user.id)).resolves.toMatchObject({
      accounts: [{ id: "owner-account" }],
    });
  });

  it("checks account, bucket, and transaction ownership explicitly", async () => {
    const repository = new InMemoryFinanceRepository({
      users: [user, otherUser],
      accounts: [
        {
          userId: user.id,
          id: "account",
          name: "Card",
          currency: "CZK",
          initialBalanceMinor: 10_000,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      buckets: [
        {
          userId: user.id,
          id: "bucket",
          accountId: "account",
          name: "Food",
          budgetMinor: 2_000,
          sortOrder: 0,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      transactions: [
        {
          userId: user.id,
          id: "transaction",
          type: "expense",
          amountMinor: 500,
          currency: "CZK",
          sourceAccountId: "account",
          occurredAt: now,
          createdAt: now,
          updatedAt: now,
        },
      ],
    });

    await expect(repository.accountBelongsToUser(user.id, "account")).resolves.toBe(true);
    await expect(repository.accountBelongsToUser(otherUser.id, "account")).resolves.toBe(false);
    await expect(repository.bucketBelongsToUser(user.id, "bucket")).resolves.toBe(true);
    await expect(repository.bucketBelongsToUser(otherUser.id, "bucket")).resolves.toBe(false);
    await expect(repository.transactionBelongsToUser(user.id, "transaction")).resolves.toBe(true);
    await expect(repository.transactionBelongsToUser(otherUser.id, "transaction")).resolves.toBe(false);
  });
});
