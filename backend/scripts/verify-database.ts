import "dotenv/config";
import { MongoClient } from "mongodb";
import { isDeepStrictEqual } from "node:util";
import { config } from "../src/config/env.js";
import {
  collectionDefinitions,
  contentDefinitions,
  SCHEMA_VERSION,
  PLATFORM_VERSION,
} from "../src/database/schema.js";

const client = new MongoClient(config.mongoUri, {
  serverSelectionTimeoutMS: 10_000,
});
try {
  await client.connect();
  const database = client.db(config.databaseName);
  for (const version of [SCHEMA_VERSION, PLATFORM_VERSION]) {
    const applied = await database
      .collection<{ _id: string }>("schema_migrations")
      .findOne({ _id: version });
    if (!applied) throw new Error(`Schema migration is missing: ${version}`);
  }
  const ready = await database
    .collection<{ _id: string }>("schema_migrations")
    .findOne({
      _id: { $in: ["002_legacy_website_split", "003_bootstrap_content"] },
    });
  if (!ready) throw new Error("Content initialization has not completed");
  const collections = await database
    .listCollections({}, { nameOnly: false })
    .toArray();
  const report: Record<string, { documents: number; indexes: number }> = {};
  for (const definition of collectionDefinitions()) {
    const info = collections.find(
      (collection) => collection.name === definition.name,
    );
    if (!info?.options?.validator)
      throw new Error(`Missing validator: ${definition.name}`);
    if (
      !isDeepStrictEqual(info.options.validator, definition.validator) ||
      info.options.validationLevel !== "strict" ||
      info.options.validationAction !== "error"
    ) {
      throw new Error(
        `Schema differs from the declared version: ${definition.name}`,
      );
    }
    const collection = database.collection(definition.name);
    const indexes = await collection.listIndexes().toArray();
    for (const expected of definition.indexes) {
      const actual = indexes.find((index) => index.name === expected.name);
      if (
        !actual ||
        (expected.unique && !actual.unique) ||
        (expected.expireAfterSeconds !== undefined &&
          actual.expireAfterSeconds !== expected.expireAfterSeconds)
      ) {
        throw new Error(
          `Missing or incorrect index: ${definition.name}.${expected.name}`,
        );
      }
    }
    const invalid = await collection.countDocuments({
      $nor: [definition.validator],
    });
    if (invalid)
      throw new Error(`Invalid documents: ${definition.name} (${invalid})`);
    report[definition.name] = {
      documents: await collection.countDocuments(),
      indexes: indexes.length,
    };
  }
  const contentIds = new Map(
    await Promise.all(
      Object.values(contentDefinitions).map(async ({ collection }) => {
        const records = await database
          .collection(collection)
          .find({}, { projection: { _id: 0, id: 1 } })
          .toArray();
        return [
          collection,
          new Set(records.map((record) => record.id)),
        ] as const;
      }),
    ),
  );
  const media = await database
    .collection("media_assets")
    .find({}, { projection: { references: 1 } })
    .toArray();
  const publicFields = new Map(
    Object.values(contentDefinitions).map((definition) => [
      definition.collection,
      new Set(Object.keys(definition.fields)),
    ]),
  );
  for (const asset of media) {
    for (const reference of asset.references ?? []) {
      if (!contentIds.get(reference.collection)?.has(reference.documentId))
        throw new Error("Dangling media reference");
      if (!publicFields.get(reference.collection)?.has(reference.field))
        throw new Error("Unknown media field reference");
    }
  }
  const danglingSessions = await database
    .collection("sessions")
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $match: { user: { $size: 0 } } },
      { $count: "count" },
    ])
    .next();
  if (danglingSessions?.count) throw new Error("Dangling user sessions");
  console.log(
    `Verified ${database.databaseName}: schema, documents, unique indexes, TTL indexes`,
  );
  console.table(report);
} catch (error) {
  console.error(
    error instanceof Error
      ? error.message.replace(/mongodb(?:\+srv)?:\/\/[^\s]+/g, "[REDACTED]")
      : "Verification failed",
  );
  process.exitCode = 1;
} finally {
  await client.close();
}
