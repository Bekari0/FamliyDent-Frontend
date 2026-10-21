import type { Db, Document } from "mongodb";
import {
  contentDefinitions,
  isContentType,
  assertWebsiteDatabase,
} from "./schema.js";

export const LEGACY_MIGRATION = "002_legacy_website_split";

export function migrationDate(value: unknown): Date {
  if (value == null) return new Date();
  if (value instanceof Date && Number.isFinite(value.getTime())) return value;
  const raw =
    value && typeof value === "object" && "$date" in value
      ? value.$date
      : value;
  const date = new Date(raw as string | number);
  if (!Number.isFinite(date.getTime()))
    throw new Error("Invalid legacy timestamp; source data was not modified");
  return date;
}

export function flattenLegacyContent(document: Document): Document {
  if (
    !isContentType(document.contentType) ||
    !document.data ||
    typeof document.data !== "object"
  ) {
    throw new Error(
      "Unrecognized legacy website content; migration stopped without deleting source data",
    );
  }
  const definition = contentDefinitions[document.contentType];
  const allowedFields = new Set(["id", ...Object.keys(definition.fields)]);
  const data = Object.fromEntries(
    Object.entries(document.data).filter(([key]) => allowedFields.has(key)),
  );
  // Older team snapshots used bio[0], which omitted shortBio for an empty biography.
  if (document.contentType === "team" && data.shortBio == null)
    data.shortBio = "";
  return {
    ...data,
    _id: document._id,
    id: String(document.data.id ?? document.contentId),
    sortOrder: document.order ?? 0,
    publicationStatus: "published",
    createdAt: migrationDate(document.createdAt ?? document.syncedAt),
    updatedAt: migrationDate(document.syncedAt),
  };
}

export function resolveLegacyMediaReference(
  reference: Document,
  documents: Document[],
): Document {
  const matches = documents.filter(
    (document) =>
      document.contentType === reference.contentType &&
      [
        document.contentId,
        document.data.id,
        document.data.slug,
        document.data.number,
        document.data.service,
        document.data.name,
      ].some(
        (alias) =>
          alias != null && String(alias) === String(reference.contentId),
      ),
  );
  if (matches.length !== 1)
    throw new Error(
      "A legacy media reference is missing or ambiguous; source data was not modified",
    );
  const document = matches[0];
  if (!isContentType(document.contentType))
    throw new Error("Unknown media collection");
  return {
    collection: contentDefinitions[document.contentType].collection,
    documentId: String(document.data.id ?? document.contentId),
    field: reference.field,
  };
}

export async function migrateLegacyWebsite(
  source: Db,
  target: Db,
): Promise<Record<string, number>> {
  assertWebsiteDatabase(target.databaseName);
  if (source.databaseName === target.databaseName)
    throw new Error("Migration source and destination must differ");
  const counts: Record<string, number> = {};
  const alreadyCompleted = await target
    .collection<{ _id: string }>("schema_migrations")
    .findOne({ _id: LEGACY_MIGRATION });
  if (alreadyCompleted)
    throw new Error(
      "Legacy migration already completed. Re-running would overwrite new website edits; use db:verify instead.",
    );

  const documents = await source
    .collection("website_content")
    .find({})
    .toArray();
  if (!documents.length)
    throw new Error(
      "Legacy website_content is empty; no source data was migrated",
    );
  const byCollection = new Map<string, Document[]>();
  for (const document of documents) {
    const flat = flattenLegacyContent(document);
    const collection =
      contentDefinitions[
        document.contentType as keyof typeof contentDefinitions
      ].collection;
    const batch = byCollection.get(collection) ?? [];
    batch.push(flat);
    byCollection.set(collection, batch);
  }
  for (const [name, documents] of byCollection) {
    // Insert-only makes interrupted migrations resumable without overwriting new edits.
    try {
      await target.collection(name).bulkWrite(
        documents.map((document) => ({
          updateOne: {
            filter: { _id: document._id },
            update: { $setOnInsert: document },
            upsert: true,
          },
        })),
      );
    } catch (error) {
      if (error && typeof error === "object" && "writeErrors" in error) {
        const errors = error.writeErrors as Array<{
          err?: { errInfo?: unknown };
        }>;
        const collect = (value: unknown): string[] => {
          if (Array.isArray(value)) return value.flatMap(collect);
          if (!value || typeof value !== "object") return [];
          return Object.entries(value).flatMap(([key, item]) =>
            key === "propertyName" ||
            key === "missingProperties" ||
            key === "operatorName"
              ? [JSON.stringify(item)]
              : key === "consideredValue"
                ? []
                : collect(item),
          );
        };
        throw new Error(
          `Migration validation failed in ${name}: ${errors.flatMap((item) => collect(item.err?.errInfo)).join(", ")}`,
        );
      }
      throw new Error(
        `Migration failed in ${name}: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    }
    const count = await target
      .collection(name)
      .countDocuments({ _id: { $in: documents.map((d) => d._id) } });
    if (count !== documents.length)
      throw new Error(`Verification failed for ${name}`);
    counts[name] = count;
  }

  const media = await source.collection("website_media").find({}).toArray();
  if (media.length) {
    await target.collection("media_assets").bulkWrite(
      media.map((asset) => ({
        updateOne: {
          filter: { localPath: asset.localPath },
          update: {
            $setOnInsert: {
              _id: asset._id,
              localPath: asset.localPath,
              cloudUrl: asset.cloudUrl ?? null,
              status: asset.status ?? "pending_upload",
              createdAt: migrationDate(asset.createdAt ?? asset.updatedAt),
              updatedAt: migrationDate(asset.updatedAt),
              references: (asset.references ?? []).map((ref: Document) =>
                resolveLegacyMediaReference(ref, documents),
              ),
            },
          },
          upsert: true,
        },
      })),
    );
  }
  counts.media_assets = media.length;

  // Only website-owned records are copied. Clinical users/patients/records are never read.
  for (const [from, to] of [
    ["website_users", "users"],
    ["website_sessions", "sessions"],
    ["bookings", "bookings"],
    ["tourism_consultations", "tourism_consultations"],
  ]) {
    const websiteOnly =
      from === "bookings"
        ? { source: "website" }
        : from === "tourism_consultations"
          ? { source: "website-tourism" }
          : {};
    const rows = await source.collection(from).find(websiteOnly).toArray();
    if (rows.length) {
      const normalized = rows.map((row) => {
        row.createdAt = migrationDate(row.createdAt);
        if (to !== "sessions")
          row.updatedAt = migrationDate(row.updatedAt ?? row.createdAt);
        else row.expiresAt = migrationDate(row.expiresAt);
        if (to === "users") row.email = row.email.trim().toLowerCase();
        if (row.preferredDate) {
          const date =
            row.preferredDate instanceof Date
              ? row.preferredDate
              : new Date(row.preferredDate);
          if (!Number.isFinite(date.getTime()))
            throw new Error("Invalid booking date in legacy website records");
          row.preferredDate = date;
        } else delete row.preferredDate;
        return row;
      });
      await target.collection(to).bulkWrite(
        normalized.map((document) => ({
          updateOne: {
            filter: { _id: document._id },
            update: { $setOnInsert: document },
            upsert: true,
          },
        })),
      );
      if (
        (await target
          .collection(to)
          .countDocuments({ _id: { $in: rows.map((r) => r._id) } })) !==
        rows.length
      ) {
        throw new Error(`Verification failed for ${to}`);
      }
    }
    counts[to] = rows.length;
  }
  await target
    .collection<{
      _id: string;
      completedAt: Date;
      sourceDatabase: string;
      counts: Record<string, number>;
    }>("schema_migrations")
    .insertOne({
      _id: LEGACY_MIGRATION,
      completedAt: new Date(),
      sourceDatabase: source.databaseName,
      counts,
    });
  return counts;
}
