import { config } from "../src/config/env.js";
import { contentDefinitions } from "../src/database/schema.js";
import { reportFailure } from "./database.js";

async function main() {
  const base = process.env.SMOKE_BASE_URL || `http://127.0.0.1:${config.port}`;
  for (const endpoint of [
    "/api/health/ready",
    ...Object.keys(contentDefinitions).map((type) => `/api/content/${type}`),
  ]) {
    const response = await fetch(`${base}${endpoint}`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok)
      throw new Error(
        `Smoke check failed: ${endpoint} returned ${response.status}`,
      );
    const payload = await response.json();
    if (endpoint.includes("content") && !Array.isArray(payload.data))
      throw new Error(`Invalid content response: ${endpoint}`);
    console.log(
      `${endpoint}: OK${Array.isArray(payload.data) ? ` (${payload.data.length})` : ""}`,
    );
  }
}
main().catch(reportFailure);
