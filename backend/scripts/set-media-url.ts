import "dotenv/config";
import { MongoClient } from "mongodb";
import { config } from "../src/config/env.js";
import { isPublicMediaUrl } from "../src/lib/media-url.js";

const [localPath, cloudUrl] = process.argv.slice(2);
if (
  !localPath ||
  !/^\/(images|videos|icons)\//.test(localPath) ||
  !isPublicMediaUrl(cloudUrl)
) {
  throw new Error(
    'Usage: npm run media:set-url -- "/images/path.webp" "https://cdn.example/path.webp"',
  );
}

const mongoUri = process.env.MONGODB_URI?.trim();
if (!mongoUri) throw new Error("MONGODB_URI is required");

const client = await new MongoClient(mongoUri, {
  appName: "family-dent-media-update",
}).connect();
try {
  const result = await client
    .db(config.databaseName)
    .collection("media_assets")
    .updateOne(
      { localPath },
      { $set: { cloudUrl, status: "ready", updatedAt: new Date() } },
    );
  if (!result.matchedCount)
    throw new Error(`Unknown local media path: ${localPath}`);
  console.log(`Updated ${localPath}`);
} finally {
  await client.close();
}
