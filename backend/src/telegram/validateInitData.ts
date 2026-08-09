import { createHmac, timingSafeEqual } from "node:crypto";

export type TelegramUser = Readonly<{
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}>;

export type TelegramInitDataValidationResult =
  | Readonly<{ ok: true; user?: TelegramUser }>
  | Readonly<{ ok: false; reason: string }>;

const defaultMaxAgeSeconds = 24 * 60 * 60;

/** Validates Telegram Mini App init data using the bot-token HMAC rule. */
export function validateTelegramInitData(
  initData: string,
  botToken: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  maxAgeSeconds = defaultMaxAgeSeconds,
): TelegramInitDataValidationResult {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) {
    return { ok: false, reason: "Missing Telegram init data hash." };
  }

  const authDate = Number.parseInt(params.get("auth_date") ?? "", 10);

  if (!Number.isSafeInteger(authDate)) {
    return { ok: false, reason: "Missing Telegram auth date." };
  }

  if (nowSeconds - authDate > maxAgeSeconds) {
    return { ok: false, reason: "Telegram init data is stale." };
  }

  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const expectedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (!safeCompareHex(hash, expectedHash)) {
    return { ok: false, reason: "Invalid Telegram init data signature." };
  }

  return parseTelegramUser(params.get("user"));
}

function safeCompareHex(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function parseTelegramUser(rawUser: string | null): TelegramInitDataValidationResult {
  if (!rawUser) {
    return { ok: true };
  }

  const parsed = parseJson(rawUser);

  if (!parsed.ok || !isTelegramUser(parsed.value)) {
    return { ok: false, reason: "Invalid Telegram user payload." };
  }

  return { ok: true, user: parsed.value };
}

function parseJson(rawValue: string): Readonly<{ ok: true; value: unknown }> | Readonly<{ ok: false }> {
  try {
    return { ok: true, value: JSON.parse(rawValue) as unknown };
  } catch {
    return { ok: false };
  }
}

function isTelegramUser(value: unknown): value is TelegramUser {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number"
  );
}

