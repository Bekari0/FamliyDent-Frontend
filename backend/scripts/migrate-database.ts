import { setupDatabase } from "../src/database/schema.js";
import { migrateLegacyWebsite } from "../src/database/migration.js";
import { migrationClient, reportFailure, targetDatabase } from "./database.js";

const client = migrationClient();
try {
  await client.connect();
  const target = targetDatabase(client);
  await setupDatabase(target);
  const sourceName = process.env.MONGODB_LEGACY_DATABASE || "FamilyDent";
  const counts = await migrateLegacyWebsite(client.db(sourceName), target);
  console.log(
    `Migrated website into independent database ${target.databaseName}`,
  );
  console.table(counts);
} catch (error) {
  reportFailure(error);
} finally {
  await client.close();
}
