import assert from "node:assert/strict";
import test from "node:test";
import { readConfig, integrationUrl } from "../src/config/env.js";
import {
  signBotBody,
  verifyBotSignature,
} from "../src/modules/bot/signature.js";
import { completeChat } from "../src/modules/ai/adapters.js";
import { boundedJson } from "../src/lib/http-client.js";
import { isPublicMediaUrl } from "../src/lib/media-url.js";

const env = {
  MONGODB_URI: "mongodb://127.0.0.1:27017",
  SESSION_SECRET: "s".repeat(48),
};

test("production configuration rejects unsafe origins, database names and proxy settings", () => {
  assert.throws(() => readConfig({ ...env, NODE_ENV: "production" }), /HTTPS/);
  assert.throws(
    () => readConfig({ ...env, MONGODB_DATABASE: "FamilyDent" }),
    /MONGODB_DATABASE/,
  );
  assert.throws(() => readConfig({ ...env, APP_ORIGINS: "*" }), /APP_ORIGINS/);
  assert.throws(
    () => readConfig({ ...env, TRUST_PROXY: "true" }),
    /TRUST_PROXY/,
  );
  assert.equal(
    readConfig({
      ...env,
      NODE_ENV: "production",
      APP_ORIGINS: "https://clinic.example",
    }).NODE_ENV,
    "production",
  );
});

test("proxy trust accepts only valid IPs and CIDRs", () => {
  for (const proxy of [
    "172.30.0.2/99",
    "untrusted.example",
    "false",
    "127.0.0.1/",
  ]) {
    assert.throws(
      () => readConfig({ ...env, TRUST_PROXY: proxy }),
      /TRUST_PROXY/,
    );
  }
  assert.equal(
    readConfig({ ...env, TRUST_PROXY: "172.30.0.2/32,::1/128" }).TRUST_PROXY,
    "172.30.0.2/32,::1/128",
  );
});

test("integration endpoints must be fixed HTTPS URLs without embedded secrets", () => {
  for (const url of [
    "http://example.org",
    "https://user:pass@example.org",
    "https://example.org?token=secret",
    "file:///tmp/key",
  ])
    assert.throws(() => integrationUrl(url, false));
  assert.equal(
    integrationUrl("http://127.0.0.1:11434", true).protocol,
    "http:",
  );
  assert.throws(
    () =>
      readConfig({
        ...env,
        BOT_ENABLED: "true",
        BOT_API_URL: "https://bot.example",
        BOT_SIGNING_SECRET: "a".repeat(32),
        BOT_WEBHOOK_SECRET: "a".repeat(32),
      }),
    /different secrets/,
  );
});

test("bot signature authenticates exact bytes and rejects expired or forged messages", () => {
  const secret = "s".repeat(32),
    body = Buffer.from('{"ok":true}'),
    timestamp = String(Math.floor(Date.now() / 1000));
  const signature = signBotBody(secret, timestamp, body);
  assert.doesNotThrow(() =>
    verifyBotSignature(secret, timestamp, signature, body),
  );
  assert.throws(() =>
    verifyBotSignature(
      secret,
      timestamp,
      signature,
      Buffer.from('{"ok":false}'),
    ),
  );
  assert.throws(() =>
    verifyBotSignature(
      secret,
      timestamp,
      signature,
      body,
      Date.now() + 301_000,
    ),
  );
  assert.throws(() => verifyBotSignature(secret, undefined, signature, body));
});

test("both AI adapters send bounded non-streaming requests to the configured provider", async () => {
  for (const provider of ["openai-compatible", "ollama"] as const) {
    const config = readConfig({
      ...env,
      AI_PROVIDER: provider,
      AI_BASE_URL: "https://ai.example/v1",
      AI_MODEL: "our-model",
    });
    const fake: typeof fetch = async (url, init) => {
      assert.equal(
        String(url),
        `https://ai.example/v1/${provider === "ollama" ? "api/chat" : "chat/completions"}`,
      );
      const body = JSON.parse(String(init?.body));
      assert.equal(body.stream, false);
      assert.equal(body.model, "our-model");
      assert.equal(init?.redirect, "error");
      return Response.json(
        provider === "ollama"
          ? { message: { content: "Ответ" } }
          : { choices: [{ message: { content: "Ответ" } }] },
      );
    };
    assert.equal(
      await completeChat(config, [{ role: "user", content: "Привет" }], fake),
      "Ответ",
    );
    await assert.rejects(
      completeChat(
        config,
        [],
        async () => new Response("upstream-secret", { status: 500 }),
      ),
      (error: Error) => !error.message.includes("upstream-secret"),
    );
  }
  await assert.rejects(completeChat(readConfig(env), []), /не подключён/);
});

test("public media URLs cannot disclose embedded credentials", () => {
  assert.equal(
    isPublicMediaUrl("https://cdn.example/image.webp?width=800"),
    true,
  );
  for (const value of [
    "https://user:password@cdn.example/image.webp",
    "http://cdn.example/a.webp",
    "javascript:alert(1)",
    "invalid",
    null,
  ])
    assert.equal(isPublicMediaUrl(value), false);
});

test("upstream responses cannot allocate an unbounded JSON payload", async () => {
  await assert.rejects(
    boundedJson(new Response('"' + "a".repeat(100) + '"'), 16),
  );
});
