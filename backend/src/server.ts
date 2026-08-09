import cors from "cors";
import "dotenv/config";
import express from "express";
import { validateTelegramInitData } from "./telegram/validateInitData.js";

const app = express();
const port = Number.parseInt(process.env.PORT ?? "3000", 10);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/session", (request, response) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const initData = String(request.header("X-Telegram-Init-Data") ?? request.body?.initData ?? "");

  if (!botToken) {
    response.status(500).json({ error: "Telegram bot token is not configured." });
    return;
  }

  const result = validateTelegramInitData(initData, botToken);

  if (!result.ok) {
    response.status(401).json({ error: result.reason });
    return;
  }

  response.json({ ok: true, user: result.user ?? null });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
