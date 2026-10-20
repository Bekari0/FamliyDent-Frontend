import { MongoClient, type Db } from "mongodb";
import { config } from "./config";

let clientPromise: Promise<MongoClient> | undefined;

export async function getDatabase(): Promise<Db> {
  clientPromise ??= new MongoClient(config.mongoUri, {
    appName: "family-dent-web",
    maxPoolSize: 10,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 8_000,
  }).connect();

  return (await clientPromise).db(config.databaseName);
}

export async function ensureIndexes(): Promise<void> {
  const database = await getDatabase();
  await Promise.all([
    database.collection("website_users").createIndex({ email: 1 }, { unique: true, name: "website_users_email_unique" }),
    database.collection("website_sessions").createIndex({ tokenHash: 1 }, { unique: true, name: "website_sessions_token_unique" }),
    database.collection("website_sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "website_sessions_expiry" }),
    database.collection("bookings").createIndex({ createdAt: -1 }, { name: "website_bookings_created_at" }),
    database.collection("tourism_consultations").createIndex({ createdAt: -1 }, { name: "tourism_consultations_created_at" }),
  ]);
}

export async function closeDatabase(): Promise<void> {
  if (!clientPromise) return;
  const client = await clientPromise;
  clientPromise = undefined;
  await client.close();
}
