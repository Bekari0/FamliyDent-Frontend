import "dotenv/config";
import { MongoClient } from "mongodb";

const [localPath, cloudUrl] = process.argv.slice(2);
if (!localPath?.startsWith("/") || !cloudUrl || !/^https:\/\//i.test(cloudUrl)) {
  throw new Error('Usage: npm run media:set-url -- "/images/path.webp" "https://cdn.example/path.webp"');
}

const mongoUri = process.env.MONGODB_URI?.trim();
if (!mongoUri) throw new Error("MONGODB_URI is required");

const client = await new MongoClient(mongoUri, { appName: "family-dent-media-update" }).connect();
try {
  const result = await client
    .db(process.env.MONGODB_DATABASE || "FamilyDent")
    .collection("website_media")
    .updateOne(
      { localPath },
      { $set: { cloudUrl, status: "ready", updatedAt: new Date() } },
    );
  if (!result.matchedCount) throw new Error(`Unknown local media path: ${localPath}`);
  console.log(`Updated ${localPath}`);
} finally {
  await client.close();
}
