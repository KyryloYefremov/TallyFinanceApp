import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createApp } from "../server.js";
import { createUserId, InMemoryFinanceRepository, type PersistedUser } from "../db/financeRepository.js";

const botToken = "123456:test-token";
const now = "2026-08-09T12:00:00.000Z";
const owner: PersistedUser = {
  id: createUserId(42),
  telegramUserId: 42,
  firstName: "Owner",
  createdAt: now,
  updatedAt: now,
};
const other: PersistedUser = {
  id: createUserId(84),
  telegramUserId: 84,
  firstName: "Other",
  createdAt: now,
  updatedAt: now,
};

describe("bootstrap API", () => {
  it("rejects requests without valid Telegram init data", async () => {
    const app = createApp({ botToken, repository: new InMemoryFinanceRepository() });
    const response = await request(app, "/api/bootstrap", {
      headers: { "X-Telegram-Init-Data": "bad=payload" },
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Missing Telegram init data hash.",
    });
  });

  it("returns only bootstrap data owned by the validated Telegram user", async () => {
    const repository = new InMemoryFinanceRepository({
      users: [owner, other],
      accounts: [
        {
          userId: owner.id,
          id: "owner-account",
          name: "Owner account",
          currency: "CZK",
          initialBalanceMinor: 12_000,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: other.id,
          id: "other-account",
          name: "Other account",
          currency: "CZK",
          initialBalanceMinor: 99_000,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
    });
    const app = createApp({ botToken, repository });
    const response = await request(app, "/api/bootstrap", {
      headers: {
        "X-Telegram-Init-Data": signInitData({
          auth_date: String(Math.floor(Date.now() / 1000)),
          user: JSON.stringify({ id: owner.telegramUserId, first_name: "Owner" }),
        }),
      },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      data: {
        user: { id: owner.id, telegramUserId: owner.telegramUserId },
        accounts: [{ id: "owner-account" }],
        buckets: [],
        transactions: [],
        exchangeRates: [],
        settings: { baseCurrency: "CZK" },
      },
    });
  });
});

function request(
  app: ReturnType<typeof createApp>,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, async () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Expected TCP server address."));
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:${address.port}${path}`, init);
        resolve(response);
      } catch (caught) {
        reject(caught);
      } finally {
        server.close();
      }
    });
  });
}

function signInitData(values: Record<string, string>): string {
  const dataCheckString = Object.entries(values)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const hash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return new URLSearchParams({ ...values, hash }).toString();
}
