import mongoose from "mongoose";
import { ConfigurationError } from "../lib/errors.js";
import { PLATFORM_VERSION } from "./schema.js";
import type { AppConfig } from "../config/env.js";

export async function connectDatabase(config: AppConfig) {
  return mongoose
    .createConnection(config.MONGODB_URI, {
      dbName: config.MONGODB_DATABASE,
      appName: "familydent-backend",
      autoIndex: false,
      autoCreate: false,
      bufferCommands: false,
      maxPoolSize: 20,
      minPoolSize: 0,
      readPreference: "primary",
      writeConcern: { w: "majority", wtimeoutMS: 10_000 },
      serverSelectionTimeoutMS: 8_000,
      socketTimeoutMS: 20_000,
    })
    .asPromise();
}

export async function verifyReadiness(connection: mongoose.Connection) {
  if (!connection.db) throw new ConfigurationError("MongoDB is not connected");
  await connection.db.command({ ping: 1 });
  const migrations = connection.db.collection<{ _id: string }>(
    "schema_migrations",
  );
  const version = await migrations.findOne({ _id: PLATFORM_VERSION });
  if (!version)
    throw new ConfigurationError(
      "Run backend db:setup before starting the backend",
    );
  const content = await migrations.findOne({
    _id: { $in: ["002_legacy_website_split", "003_bootstrap_content"] },
  });
  if (!content)
    throw new ConfigurationError(
      "Complete content migration or seed before starting the backend",
    );
}
