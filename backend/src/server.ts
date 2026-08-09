import cors from "cors";
import "dotenv/config";
import express, { type Request, type Response } from "express";
import {
  InMemoryFinanceRepository,
  type FinanceRepository,
  type PersistedUser,
} from "./db/financeRepository.js";
import { validateTelegramInitData } from "./telegram/validateInitData.js";

export type ServerOptions = Readonly<{
  botToken?: string;
  repository?: FinanceRepository;
}>;

export function createApp(options: ServerOptions = {}) {
  const app = express();
  const repository = options.repository ?? new InMemoryFinanceRepository();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.post("/api/session", async (request, response, next) => {
    try {
      const result = await authenticateRequest(request, repository, options.botToken);

      if (!result.ok) {
        response.status(result.status).json({ error: result.error });
        return;
      }

      response.json({ ok: true, user: result.user });
    } catch (caught) {
      next(caught);
    }
  });

  app.get("/api/bootstrap", async (request, response, next) => {
    try {
      const result = await authenticateRequest(request, repository, options.botToken);

      if (!result.ok) {
        response.status(result.status).json({ error: result.error });
        return;
      }

      const data = await repository.getBootstrapData(result.user.id);
      response.json({ ok: true, data });
    } catch (caught) {
      next(caught);
    }
  });

  app.use((error: unknown, _request: Request, response: Response, next: unknown) => {
    void next;
    response.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected server error.",
    });
  });

  return app;
}

const port = Number.parseInt(process.env.PORT ?? "3000", 10);

if (process.env.NODE_ENV !== "test") {
  createApp({
    ...(process.env.TELEGRAM_BOT_TOKEN ? { botToken: process.env.TELEGRAM_BOT_TOKEN } : {}),
  }).listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

async function authenticateRequest(
  request: Request,
  repository: FinanceRepository,
  botToken = process.env.TELEGRAM_BOT_TOKEN,
): Promise<
  | Readonly<{ ok: true; user: PersistedUser }>
  | Readonly<{ ok: false; status: number; error: string }>
> {
  if (!botToken) {
    return { ok: false, status: 500, error: "Telegram bot token is not configured." };
  }

  const initData = String(request.header("X-Telegram-Init-Data") ?? request.body?.initData ?? "");
  const validation = validateTelegramInitData(initData, botToken);

  if (!validation.ok) {
    return { ok: false, status: 401, error: validation.reason };
  }

  if (!validation.user) {
    return { ok: false, status: 401, error: "Telegram user is required." };
  }

  return {
    ok: true,
    user: await repository.upsertTelegramUser(validation.user),
  };
}
