import { ObjectId } from "mongodb";
import {
  setupDatabase,
  contentDefinitions,
  type ContentType,
} from "../src/database/schema.js";
import { flattenLegacyContent } from "../src/database/migration.js";
import { migrationClient, reportFailure, targetDatabase } from "./database.js";
import { loadSeedContent } from "./seeds/index.js";

const client = migrationClient();
try {
  await client.connect();
  const database = targetDatabase(client);
  await setupDatabase(database);
  const migration = database.collection<{ _id: string; completedAt: Date }>(
    "schema_migrations",
  );
  if (
    await migration.findOne({
      _id: { $in: ["002_legacy_website_split", "003_bootstrap_content"] },
    })
  ) {
    throw new Error(
      "Content has already been initialized; bootstrap data cannot overwrite website edits.",
    );
  }
  const resuming = await migration.findOne({ _id: "bootstrap_started" });
  for (const { collection } of Object.values(contentDefinitions)) {
    if (
      !resuming &&
      (await database.collection(collection).countDocuments({}, { limit: 1 }))
    ) {
      throw new Error(
        "Seed is only allowed in an empty website database. Existing content is never overwritten; use db:migrate for the legacy database.",
      );
    }
  }
  await migration.updateOne(
    { _id: "bootstrap_started" },
    { $setOnInsert: { completedAt: new Date() } },
    { upsert: true },
  );
  const sets = await loadSeedContent();
  const media = new Map<
    string,
    Array<{ collection: string; documentId: string; field: string }>
  >();
  for (const [type, items] of Object.entries(sets)) {
    const definition = contentDefinitions[type as ContentType];
    const documents = items.map((data, order) => {
      const rawId =
        data.id ??
        data.slug ??
        data.number ??
        data.service ??
        data.name ??
        `${type}-${order + 1}`;
      const contentId = String(rawId)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-|-$/g, "");
      const document = flattenLegacyContent({
        _id: new ObjectId(),
        contentType: type,
        contentId,
        data,
        order,
      });
      for (const [field, value] of Object.entries(data)) {
        if (
          typeof value !== "string" ||
          !/^\/(images|videos|icons)\//.test(value)
        )
          continue;
        const references = media.get(value) ?? [];
        references.push({
          collection: definition.collection,
          documentId: document.id,
          field,
        });
        media.set(value, references);
      }
      return document;
    });
    if (documents.length)
      await database.collection(definition.collection).bulkWrite(
        documents.map((document) => ({
          updateOne: {
            filter: { id: document.id },
            update: { $setOnInsert: document },
            upsert: true,
          },
        })),
      );
    console.log(`${definition.collection}: ${documents.length}`);
  }
  if (media.size)
    await database.collection("media_assets").bulkWrite(
      [...media].map(([localPath, references]) => ({
        updateOne: {
          filter: { localPath },
          update: {
            $setOnInsert: {
              localPath,
              cloudUrl: null,
              status: "pending_upload",
              references,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      })),
    );
  await migration.updateOne(
    { _id: "003_bootstrap_content" },
    { $set: { completedAt: new Date() } },
    { upsert: true },
  );
  console.log(
    "Seed completed. Bootstrap files are not part of the browser bundle.",
  );
} catch (error) {
  reportFailure(error);
} finally {
  await client.close();
}
