import "dotenv/config";
import { MongoClient, type AnyBulkWriteOperation } from "mongodb";
import { getAcademyPrograms } from "../src/lib/data/academy";
import { getBlogPosts } from "../src/lib/data/blog";
import { getClinicSpaces } from "../src/lib/data/clinic-spaces";
import { getConcernItems } from "../src/lib/data/concerns";
import { getDoctors } from "../src/lib/data/doctors";
import { getEquipmentItems } from "../src/lib/data/equipment";
import { getFaqItems } from "../src/lib/data/faq";
import { getClinicMetrics } from "../src/lib/data/metrics";
import { getPatientReviews } from "../src/lib/data/patient-reviews";
import { getPricingItems } from "../src/lib/data/pricing";
import { getServices } from "../src/lib/data/services";
import { getTeamMembers } from "../src/lib/data/team";
import {
  getTourismFeatures,
  tourismComparison,
  tourismPackages,
  tourismPlaces,
  tourismRoadmap,
} from "../src/lib/data/tourism";
import { getTreatmentCases } from "../src/lib/data/treatment-cases";

type ContentValue = Record<string, unknown>;

const slugify = (value: unknown) => String(value)
  .toLocaleLowerCase("ru")
  .normalize("NFKD")
  .replace(/[^\p{L}\p{N}]+/gu, "-")
  .replace(/^-|-$/g, "");

async function main() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri) throw new Error("MONGODB_URI is required");
  const client = await new MongoClient(mongoUri, { appName: "family-dent-content-migration" }).connect();

  try {
    const contentSets: Record<string, readonly ContentValue[]> = {
      doctors: await getDoctors() as unknown as ContentValue[],
      services: await getServices() as unknown as ContentValue[],
      reviews: await getPatientReviews() as unknown as ContentValue[],
      blogPosts: await getBlogPosts() as unknown as ContentValue[],
      clinicSpaces: await getClinicSpaces() as unknown as ContentValue[],
      concerns: await getConcernItems() as unknown as ContentValue[],
      equipment: await getEquipmentItems() as unknown as ContentValue[],
      faq: await getFaqItems() as unknown as ContentValue[],
      metrics: await getClinicMetrics() as unknown as ContentValue[],
      pricing: await getPricingItems() as unknown as ContentValue[],
      team: await getTeamMembers() as unknown as ContentValue[],
      treatmentCases: await getTreatmentCases() as unknown as ContentValue[],
      academyPrograms: await getAcademyPrograms() as unknown as ContentValue[],
      tourismFeatures: await getTourismFeatures() as unknown as ContentValue[],
      tourismRoadmap,
      tourismComparison,
      tourismPackages,
      tourismPlaces,
    };

    const collection = client.db(process.env.MONGODB_DATABASE || "FamilyDent").collection("website_content");
    const mediaCollection = client.db(process.env.MONGODB_DATABASE || "FamilyDent").collection("website_media");
    await collection.createIndex({ contentType: 1, contentId: 1 }, { unique: true, name: "website_content_type_id_unique" });
    await mediaCollection.createIndex({ localPath: 1 }, { unique: true, name: "website_media_local_path_unique" });
    const operations: AnyBulkWriteOperation[] = [];
    const mediaReferences = new Map<string, Array<{ contentType: string; contentId: string; field: string }>>();

    for (const [contentType, items] of Object.entries(contentSets)) {
      items.forEach((data, order) => {
        const rawId = data.id ?? data.slug ?? data.number ?? data.service ?? data.name ?? `${contentType}-${order + 1}`;
        const media = Object.entries(data)
          .filter(([field, value]) => typeof value === "string" && /(image|video|poster)/i.test(field))
          .map(([field, value]) => {
            const url = String(value);
            return {
              field,
              localPath: url.startsWith("/") ? url : null,
              cloudUrl: url.startsWith("http") ? url : null,
              status: url.startsWith("http") ? "ready" : "pending_upload",
            };
          });
        for (const asset of media) {
          if (!asset.localPath) continue;
          const references = mediaReferences.get(asset.localPath) ?? [];
          references.push({ contentType, contentId: slugify(rawId), field: asset.field });
          mediaReferences.set(asset.localPath, references);
        }

        operations.push({
          updateOne: {
            filter: { contentType, contentId: slugify(rawId) },
            update: { $set: { contentType, contentId: slugify(rawId), order, data, media, source: "frontend", schemaVersion: 1, syncedAt: new Date() } },
            upsert: true,
          },
        });
      });
    }

    const result = await collection.bulkWrite(operations, { ordered: false });
    for (const [contentType, items] of Object.entries(contentSets)) {
      const activeIds = items.map((data, order) => slugify(data.id ?? data.slug ?? data.number ?? data.service ?? data.name ?? `${contentType}-${order + 1}`));
      await collection.deleteMany({ contentType, contentId: { $nin: activeIds } });
    }
    const mediaOperations: AnyBulkWriteOperation[] = [...mediaReferences].map(([localPath, references]) => ({
      updateOne: {
        filter: { localPath },
        update: {
          $set: { localPath, references, updatedAt: new Date() },
          $setOnInsert: { cloudUrl: null, status: "pending_upload" },
        },
        upsert: true,
      },
    }));
    const mediaResult = await mediaCollection.bulkWrite(mediaOperations, { ordered: false });
    await mediaCollection.updateMany(
      { localPath: { $nin: [...mediaReferences.keys()] } },
      { $set: { status: "orphaned", updatedAt: new Date() } },
    );
    console.log(`Content synchronized: ${operations.length}; upserted: ${result.upsertedCount}; modified: ${result.modifiedCount}`);
    console.log(`Media synchronized: ${mediaOperations.length}; upserted: ${mediaResult.upsertedCount}; modified: ${mediaResult.modifiedCount}`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
