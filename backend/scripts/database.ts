import { config as loadEnv } from "dotenv";
import { MongoClient } from "mongodb";
import { config, backendRoot } from "../src/config/env.js";

loadEnv({ path: `${backendRoot}/.env.migration.local`, quiet: true });

export function migrationClient(): MongoClient {
  const uri = process.env.MONGODB_MIGRATION_URI?.trim();
  if (!uri)
    throw new Error(
      "MONGODB_MIGRATION_URI is required; use migration credentials, not the application user",
    );
  return new MongoClient(uri, {
    appName: "familydent-web-migration",
    serverSelectionTimeoutMS: 10_000,
    ignoreUndefined: true,
  });
}

export function targetDatabase(client: MongoClient) {
  return client.db(config.databaseName);
}

export function reportFailure(error: unknown): void {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(
    message.replace(
      /mongodb(?:\+srv)?:\/\/[^\s]+/g,
      "[REDACTED CONNECTION STRING]",
    ),
  );
  process.exitCode = 1;
}
