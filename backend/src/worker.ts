import { ConfigurationError } from "./lib/errors.js";
import { readConfig } from "./config/env.js";
import { connectDatabase, verifyReadiness } from "./database/connection.js";
import { createModels } from "./models/index.js";
import { startBotWorker } from "./modules/bot/worker.js";
import { createLogger } from "./lib/logger.js";

async function main() {
  const config = readConfig();
  if (!config.BOT_ENABLED)
    throw new ConfigurationError(
      "Enable the bot before starting a standalone worker",
    );
  const connection = await connectDatabase(config);
  try {
    await verifyReadiness(connection);
  } catch (error) {
    await connection.close();
    throw error;
  }
  const stop = startBotWorker(
    createModels(connection),
    config,
    createLogger(config.LOG_LEVEL),
  );
  const keepAlive = setInterval(() => {}, 60_000);
  let stopping = false;
  const shutdown = async () => {
    if (stopping) return;
    stopping = true;
    const force = setTimeout(() => process.exit(1), 30_000);
    force.unref();
    clearInterval(keepAlive);
    await stop();
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
    "Worker startup failed:",
    error instanceof ConfigurationError
      ? error.message
      : error instanceof Error
        ? error.name
        : "UnknownError",
  );
  process.exitCode = 1;
});
