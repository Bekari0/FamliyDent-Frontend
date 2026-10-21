import { ConfigurationError } from "./lib/errors.js";
import { readConfig } from "./config/env.js";
import { connectDatabase, verifyReadiness } from "./database/connection.js";
import { createApp } from "./app.js";
import { createLogger } from "./lib/logger.js";
import { startBotWorker } from "./modules/bot/worker.js";

async function main() {
  const config = readConfig();
  const logger = createLogger(config.LOG_LEVEL);
  const connection = await connectDatabase(config);
  try {
    await verifyReadiness(connection);
  } catch (error) {
    await connection.close();
    throw error;
  }
  const { app, models } = createApp({ config, connection, logger });
  const stopWorker = config.WORKER_ENABLED
    ? startBotWorker(models, config, logger)
    : async () => {};
  const server = app.listen(config.PORT, config.HOST);
  server.once("listening", () =>
    logger.info({ port: config.PORT }, "Backend is ready"),
  );
  server.requestTimeout = 30_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  server.on("error", async () => {
    logger.error({ code: "LISTEN_FAILED" }, "Cannot bind backend port");
    await stopWorker();
    await connection.close();
    process.exitCode = 1;
  });
  let stopping = false;
  const shutdown = async () => {
    if (stopping) return;
    stopping = true;
    const force = setTimeout(() => process.exit(1), 30_000);
    force.unref();
    const closed = new Promise<void>((resolve) =>
      server.close(() => resolve()),
    );
    await stopWorker();
    await closed;
    await connection.close();
    clearTimeout(force);
  };
  process.once("SIGTERM", () => {
    void shutdown();
  });
  process.once("SIGINT", () => {
    void shutdown();
  });
}
main().catch((error) => {
  console.error(
    "Backend startup failed:",
    error instanceof ConfigurationError
      ? error.message
      : error instanceof Error
        ? error.name
        : "UnknownError",
  );
  process.exitCode = 1;
});
