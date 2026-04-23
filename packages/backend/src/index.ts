import { createServer } from "node:http";
import cors from "cors";
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { env } from "./env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";
import { authRouter } from "./routes/auth.js";
import { agentRouter } from "./routes/agent.js";
import { saleRouter } from "./routes/sale.js";
import { verifyRouter } from "./routes/verify.js";
import { mountBattleNamespace } from "./ws/battleNamespace.js";

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: env.BLITZGUARD_CORS_ORIGIN, methods: ["GET", "POST"] },
  path: "/ws",
});

app.use(cors({ origin: env.BLITZGUARD_CORS_ORIGIN }));
app.use(express.json({ limit: "128kb" }));
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    mock: env.BLITZGUARD_MOCK,
    hasGithubToken: Boolean(env.GITHUB_TOKEN),
    time: new Date().toISOString(),
  });
});

app.use("/auth", authRouter);
app.use("/verify", verifyRouter);
app.use("/agent", agentRouter);
app.use("/sale", saleRouter);

app.use(errorHandler);

mountBattleNamespace(io);

server.listen(env.BLITZGUARD_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `[blitzguard] listening on :${env.BLITZGUARD_PORT} (mock=${env.BLITZGUARD_MOCK}, cors=${env.BLITZGUARD_CORS_ORIGIN})`,
  );
});
