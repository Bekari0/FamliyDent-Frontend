import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer, type ServerResponse } from "node:http";
import test from "node:test";
import { isApiReady, waitForApi } from "../scripts/dev-health.js";

async function withServer(
  handler: (response: ServerResponse) => void,
  check: (url: string) => Promise<void>,
) {
  const server = createServer((_request, response) => handler(response));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  try {
    await check(`http://127.0.0.1:${address.port}/api/health`);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

test("development waits until the API reports a working website database", async () => {
  let requests = 0;
  await withServer(
    (response) => {
      requests += 1;
      response.writeHead(requests < 3 ? 503 : 200, {
        "Content-Type": "application/json",
      });
      response.end(
        JSON.stringify({
          ok: requests >= 3,
          service: "familydent-backend",
          database: "familydent_web",
        }),
      );
    },
    async (url) => {
      await waitForApi(url, "familydent_web", {
        timeoutMs: 2_000,
        intervalMs: 10,
      });
      assert.equal(requests, 3);
    },
  );
});

test("an unrelated HTTP server is not reused as the website API", async () => {
  await withServer(
    (response) => {
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ ok: true, database: "unrelated" }));
    },
    async (url) => {
      assert.equal(await isApiReady(url, "familydent_web"), false);
      await assert.rejects(
        waitForApi(url, "familydent_web", { timeoutMs: 100, intervalMs: 10 }),
        /API is not ready/,
      );
    },
  );
});

test("a frontend HTML response does not count as a ready API", async () => {
  await withServer(
    (response) => response.end("<!doctype html><div>Website</div>"),
    async (url) => {
      assert.equal(await isApiReady(url, "familydent_web"), false);
    },
  );
});
