import { setupDatabase } from "../src/database/schema.js";
import { migrationClient, reportFailure, targetDatabase } from "./database.js";

const client = migrationClient();
try {
  await client.connect();
  const database = targetDatabase(client);
  await setupDatabase(database);
  console.log(`Schema and indexes ready: ${database.databaseName}`);
} catch (error) {
  reportFailure(error);
} finally {
  await client.close();
}
