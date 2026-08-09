import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { validateTelegramInitData } from "./validateInitData.js";

const botToken = "123456:test-token";
const nowSeconds = 1_786_280_000;

describe("validateTelegramInitData", () => {
  it("accepts valid signed Telegram init data", () => {
    const initData = signInitData({
      auth_date: String(nowSeconds),
      query_id: "AAHdF6IQAAAAAN0XohDhrOrc",
      user: JSON.stringify({ id: 42, first_name: "Kyrylo" }),
    });

    expect(validateTelegramInitData(initData, botToken, nowSeconds)).toEqual({
      ok: true,
      user: { id: 42, first_name: "Kyrylo" },
    });
  });

  it("rejects invalid signatures", () => {
    const initData = `${signInitData({ auth_date: String(nowSeconds) })}bad`;

    expect(validateTelegramInitData(initData, botToken, nowSeconds)).toEqual({
      ok: false,
      reason: "Invalid Telegram init data signature.",
    });
  });

  it("rejects stale auth dates", () => {
    const initData = signInitData({ auth_date: String(nowSeconds - 90_000) });

    expect(validateTelegramInitData(initData, botToken, nowSeconds)).toEqual({
      ok: false,
      reason: "Telegram init data is stale.",
    });
  });
});

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

