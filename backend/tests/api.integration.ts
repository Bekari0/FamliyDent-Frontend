import assert from "node:assert/strict";
import { randomUUID, randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, beforeEach, describe, test } from "node:test";
import request from "supertest";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import type { Connection } from "mongoose";
import { readConfig, type AppConfig } from "../src/config/env.js";
import {
  connectDatabase,
  verifyReadiness,
} from "../src/database/connection.js";
import {
  collectionDefinitions,
  setupDatabase,
} from "../src/database/schema.js";
import { createApp } from "../src/app.js";
import { createModels, type Models } from "../src/models/index.js";
import { deliverNext } from "../src/modules/bot/worker.js";
import { signBotBody } from "../src/modules/bot/signature.js";
import { createApplicationRecord } from "../src/modules/applications/service.js";
import { sha256 } from "../src/lib/crypto.js";

const origin = "http://localhost:3000";
const booking = {
  name: "Test patient",
  phone: "+992 000 000000",
  service: "Consultation",
};
let mongo: MongoMemoryReplSet,
  connection: Connection,
  config: AppConfig,
  models: Models;
const botConfig = () => ({
  ...config,
  BOT_ENABLED: true,
  BOT_API_URL: "https://bot.example/applications",
  BOT_SIGNING_SECRET: "s".repeat(48),
  BOT_WEBHOOK_SECRET: "w".repeat(48),
});

describe(
  "backend with a real isolated MongoDB replica set",
  { timeout: 240_000 },
  () => {
    before(async () => {
      mongo = await MongoMemoryReplSet.create({
        binary: { version: "8.0.17" },
        replSet: { count: 1, storageEngine: "wiredTiger" },
      });
      config = readConfig({
        NODE_ENV: "test",
        MONGODB_URI: mongo.getUri(),
        MONGODB_DATABASE: "familydent_web_test",
        SESSION_SECRET: "test-secret-".repeat(5),
        LOG_LEVEL: "silent",
      });
      connection = await connectDatabase(config);
      await setupDatabase(connection.db!);
      await connection
        .db!.collection<{ _id: string; completedAt: Date }>("schema_migrations")
        .insertOne({ _id: "003_bootstrap_content", completedAt: new Date() });
      await verifyReadiness(connection);
      models = createModels(connection);
    });
    after(async () => {
      await connection?.close();
      await mongo?.stop();
    });
    beforeEach(async () => {
      for (const definition of collectionDefinitions()) {
        if (definition.name !== "schema_migrations")
          await models[definition.name].deleteMany({});
      }
    });

    async function login(role = "customer", settings = config) {
      const app = createApp({ config: settings, connection }).app;
      const agent = request.agent(app);
      const response = await agent
        .post("/api/auth/register")
        .set("Origin", settings.origins[0])
        .send({
          name: "Patient",
          email: `${randomUUID()}@example.org`,
          password: "a strong password 123",
        })
        .expect(201);
      if (role !== "customer")
        await models.users.updateOne(
          { _id: response.body.user.id },
          { $set: { role } },
        );
      return {
        app,
        agent,
        csrf: response.body.csrfToken as string,
        userId: response.body.user.id as string,
        cookie: response.headers["set-cookie"],
      };
    }

    test("registration, session, CSRF, roles and logout enforce their boundaries", async () => {
      const { app, agent, csrf } = await login();
      const me = await agent.get("/api/auth/me").expect(200);
      assert.equal(me.body.user.role, "customer");
      assert.ok(!JSON.stringify(me.body).includes("password"));
      await request(app).get("/api/admin/applications").expect(401);
      await agent.get("/api/admin/applications").expect(403);
      await agent
        .post("/api/bookings")
        .set("Origin", origin)
        .send(booking)
        .expect(403);
      await agent
        .post("/api/bookings")
        .set("Origin", "https://evil.example")
        .set("X-CSRF-Token", csrf)
        .send(booking)
        .expect(403);
      await agent
        .post("/api/bookings")
        .set("Origin", origin)
        .set("X-CSRF-Token", csrf)
        .send(booking)
        .expect(201);
      await agent
        .post("/api/auth/logout")
        .set("Origin", origin)
        .set("X-CSRF-Token", csrf)
        .send({})
        .expect(200);
      assert.equal((await agent.get("/api/auth/me")).body.user, null);
      await request(app)
        .post("/api/auth/register")
        .set("Origin", origin)
        .send({
          name: "Admin",
          email: "attack@example.org",
          password: "a strong password 123",
          role: "admin",
        })
        .expect(400);
    });

    test("login rotates sessions, rejects bad passwords and disabled accounts", async () => {
      const { app, agent, csrf, userId } = await login();
      const user = await models.users.findById(userId).lean();
      await request(app)
        .post("/api/auth/login")
        .set("Origin", origin)
        .send({ email: user!.email, password: "wrong" })
        .expect(401);
      const response = await agent
        .post("/api/auth/login")
        .set("Origin", origin)
        .set("X-CSRF-Token", csrf)
        .send({ email: user!.email, password: "a strong password 123" })
        .expect(200);
      assert.notEqual(response.body.csrfToken, csrf);
      assert.equal(await models.sessions.countDocuments(), 1);
      await models.users.updateOne(
        { _id: userId },
        { $set: { status: "disabled" } },
      );
      assert.equal((await agent.get("/api/auth/me")).body.user, null);
      await request(app)
        .post("/api/auth/login")
        .set("Origin", origin)
        .send({ email: user!.email, password: "a strong password 123" })
        .expect(401);
    });

    test("legacy website passwords are upgraded after a successful login", async () => {
      const salt = randomBytes(16).toString("hex");
      const hash = (await promisify(scrypt)(
        "legacy password",
        salt,
        64,
      )) as Buffer;
      await models.users.collection.insertOne({
        name: "Legacy",
        email: "legacy@example.org",
        passwordSalt: salt,
        passwordHash: hash.toString("hex"),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const app = createApp({ config, connection }).app;
      await request(app)
        .post("/api/auth/login")
        .send({ email: "legacy@example.org", password: "legacy password" })
        .expect(200);
      const upgraded = await models.users
        .findOne({ email: "legacy@example.org" })
        .select("+passwordHash")
        .lean();
      assert.equal(upgraded!.passwordVersion, 2);
      assert.notEqual(upgraded!.passwordHash, hash.toString("hex"));
    });

    test("password changes revoke previous sessions and require the current password", async () => {
      const { app, agent, csrf, userId } = await login();
      const user = await models.users.findById(userId).lean();
      const another = request.agent(app);
      await another
        .post("/api/auth/login")
        .send({ email: user!.email, password: "a strong password 123" })
        .expect(200);
      const change = (currentPassword: string) =>
        agent
          .post("/api/auth/password")
          .set("X-CSRF-Token", csrf)
          .send({ currentPassword, newPassword: "new strong password 456" });
      await change("wrong password").expect(401);
      const response = await change("a strong password 123").expect(200);
      assert.notEqual(response.body.csrfToken, csrf);
      assert.ok((await agent.get("/api/auth/me")).body.user);
      assert.equal((await another.get("/api/auth/me")).body.user, null);
      await request(app)
        .post("/api/auth/login")
        .send({ email: user!.email, password: "a strong password 123" })
        .expect(401);
      await request(app)
        .post("/api/auth/login")
        .send({ email: user!.email, password: "new strong password 456" })
        .expect(200);
    });

    test("logout-all invalidates even an in-flight login with an older session version", async () => {
      const { app, agent, csrf, userId } = await login();
      await agent
        .post("/api/auth/logout-all")
        .set("X-CSRF-Token", csrf)
        .send({})
        .expect(200);
      const token = randomBytes(32).toString("base64url");
      await models.sessions.create({
        tokenHash: sha256(token),
        userId,
        version: 0,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 60_000),
      });
      assert.equal(
        (
          await request(app)
            .get("/api/auth/me")
            .set("Cookie", `fd_session=${token}`)
        ).body.user,
        null,
      );
    });

    test("production uses secure host cookies and requires an allowed Origin", async () => {
      const production = {
        ...config,
        NODE_ENV: "production" as const,
        origins: ["https://clinic.example"],
      };
      const { app, cookie } = await login("customer", production);
      const value = String(cookie);
      for (const flag of [
        "__Host-fd_session=",
        "HttpOnly",
        "Secure",
        "SameSite=Lax",
        "Path=/",
      ])
        assert.ok(value.includes(flag));
      await request(app).post("/api/bookings").send(booking).expect(403);
    });

    test("booking is durable and idempotent, with a single delivery event", async () => {
      const app = createApp({ config, connection }).app,
        key = randomUUID();
      const send = (body = booking) =>
        request(app)
          .post("/api/bookings")
          .set("Origin", origin)
          .set("Idempotency-Key", key)
          .send(body);
      const first = await send().expect(201),
        second = await send().expect(201);
      assert.equal(first.body.id, second.body.id);
      assert.equal(first.body.delivery, "pending_configuration");
      assert.equal(await models.bookings.countDocuments(), 1);
      assert.equal(await models.outbox_events.countDocuments(), 1);
      await send({ ...booking, name: "Other" }).expect(409);
      const record = await models.bookings.findOne().lean();
      assert.equal(record!.status, "new");
      assert.equal(record!.source, "website");
    });

    test("transaction rollback prevents an application without a delivery event", async () => {
      await connection.db!.command({
        collMod: "outbox_events",
        validator: { $jsonSchema: { required: ["force_failure"] } },
      });
      try {
        await assert.rejects(
          createApplicationRecord(
            connection,
            models,
            "booking",
            booking,
            config.SESSION_SECRET,
            randomUUID(),
          ),
        );
        assert.equal(await models.bookings.countDocuments(), 0);
        assert.equal(await models.idempotency_keys.countDocuments(), 0);
      } finally {
        const definition = collectionDefinitions().find(
          (value) => value.name === "outbox_events",
        )!;
        await connection.db!.command({
          collMod: "outbox_events",
          validator: definition.validator,
        });
      }
    });

    test("strict input validation rejects injected fields, impossible dates and oversized bodies", async () => {
      const app = createApp({ config, connection }).app;
      for (const payload of [
        { ...booking, status: "confirmed" },
        { ...booking, preferredDate: "2026-02-30" },
        { ...booking, phone: { $ne: null } },
      ]) {
        await request(app)
          .post("/api/bookings")
          .set("Origin", origin)
          .send(payload)
          .expect(400);
      }
      await request(app)
        .post("/api/bookings")
        .send({ message: "a".repeat(70_000) })
        .expect(413);
      await request(app).get("/api/content/users").expect(404);
      assert.equal(await models.bookings.countDocuments(), 0);
    });

    test("tourism requests use the same atomic delivery pipeline", async () => {
      const app = createApp({ config, connection }).app;
      await request(app)
        .post("/api/tourism-consultations")
        .set("Origin", origin)
        .send({
          ...booking,
          email: "patient@example.org",
          country: "TJ",
          telegram: "@example",
        })
        .expect(201);
      const job = await models.outbox_events.findOne().lean();
      assert.equal(job!.kind, "tourism_consultation.created");
      assert.equal(await models.tourism_consultations.countDocuments(), 1);
    });

    test("concurrent workers claim a single job and transmit only the bot contract", async () => {
      await createApplicationRecord(
        connection,
        models,
        "booking",
        { ...booking, requestIp: "192.0.2.1" },
        config.SESSION_SECRET,
      );
      let calls = 0;
      const fake: typeof fetch = async (_url, init) => {
        calls++;
        const body = String(init?.body),
          headers = new Headers(init?.headers);
        assert.equal(
          headers.get("X-Bot-Signature"),
          signBotBody(
            botConfig().BOT_SIGNING_SECRET,
            headers.get("X-Bot-Timestamp")!,
            body,
          ),
        );
        assert.equal(JSON.parse(body).type, "booking.created");
        assert.ok(!body.includes("requestIp"));
        assert.ok(!body.includes("userId"));
        return Response.json({ accepted: true });
      };
      await Promise.all([
        deliverNext(models, botConfig(), fake),
        deliverNext(models, botConfig(), fake),
      ]);
      assert.equal(calls, 1);
      assert.equal(
        (await models.outbox_events.findOne().lean())!.status,
        "sent",
      );
    });

    test("bot delivery retries transient failures, recovers expired leases and stops permanent failures", async () => {
      await createApplicationRecord(
        connection,
        models,
        "booking",
        booking,
        config.SESSION_SECRET,
      );
      await deliverNext(
        models,
        botConfig(),
        async () => new Response(null, { status: 503 }),
      );
      let job = (await models.outbox_events.findOne().lean())!;
      assert.equal(job.status, "pending");
      assert.equal(job.attempts, 1);
      assert.equal(job.lastErrorCode, "HTTP_503");
      assert.ok(job.nextAttemptAt > new Date());
      await models.outbox_events.updateOne(
        { _id: job._id },
        {
          $set: {
            status: "delivering",
            lockedUntil: new Date(0),
            lockToken: "stale",
          },
        },
      );
      await deliverNext(
        models,
        botConfig(),
        async () => new Response(null, { status: 400 }),
      );
      job = (await models.outbox_events.findOne().lean())!;
      assert.equal(job.status, "dead");
      assert.equal(job.attempts, 2);
      assert.equal(job.lockToken, undefined);
    });

    test("signed bot events are authenticated, deduplicated and cannot regress a completed booking", async () => {
      const { id } = await createApplicationRecord(
        connection,
        models,
        "booking",
        booking,
        config.SESSION_SECRET,
      );
      const app = createApp({ config: botConfig(), connection }).app;
      const event = {
        eventId: randomUUID(),
        type: "booking.status_changed",
        applicationId: id,
        status: "completed",
        occurredAt: new Date().toISOString(),
      };
      const send = (body: typeof event, signature?: string) => {
        const raw = JSON.stringify(body),
          timestamp = String(Math.floor(Date.now() / 1000));
        return request(app)
          .post("/api/integrations/bot/events")
          .set("Content-Type", "application/json")
          .set("X-Bot-Timestamp", timestamp)
          .set(
            "X-Bot-Signature",
            signature ??
              signBotBody(botConfig().BOT_WEBHOOK_SECRET, timestamp, raw),
          )
          .send(raw);
      };
      await send(event, "0".repeat(64)).expect(401);
      await send(event).expect(200);
      assert.equal((await send(event).expect(200)).body.duplicate, true);
      await send({ ...event, status: "cancelled" }).expect(409);
      await send({
        ...event,
        eventId: randomUUID(),
        status: "confirmed",
        occurredAt: new Date(Date.now() - 1000).toISOString(),
      }).expect(200);
      assert.equal(
        (await models.bookings.findById(id).lean())!.status,
        "completed",
      );
    });

    test("administrators edit content with revision checks and a private audit trail", async () => {
      const { app, agent, csrf } = await login("admin");
      const create = await agent
        .post("/api/admin/content/faq")
        .set("Origin", origin)
        .set("X-CSRF-Token", csrf)
        .send({ id: "faq-test", question: "Question", answer: "Answer" })
        .expect(201);
      assert.equal(create.body.data.publicationStatus, "draft");
      assert.equal(
        (await request(app).get("/api/content/faq")).body.data.length,
        0,
      );
      const update = () =>
        agent
          .patch("/api/admin/content/faq/faq-test")
          .set("Origin", origin)
          .set("X-CSRF-Token", csrf)
          .send({ expectedRevision: 0, publicationStatus: "published" });
      await update().expect(200);
      await update().expect(409);
      const publicContent = (await request(app).get("/api/content/faq")).body
        .data;
      assert.equal(publicContent.length, 1);
      assert.equal(publicContent[0].revision, undefined);
      assert.equal(publicContent[0]._id, undefined);
      const audit = (await agent.get("/api/admin/audit").expect(200)).body.data;
      assert.equal(audit.length, 2);
      assert.ok(!JSON.stringify(audit).includes('"answer":"Answer"'));
    });

    test("editing migrated content preserves valid empty strings", async () => {
      const { agent, csrf } = await login("admin");
      await models.team_members.collection.insertOne({
        id: "legacy-team",
        slug: "legacy-team",
        name: "Legacy",
        category: "doctors",
        position: "Dentist",
        shortBio: "",
        image: "/images/test.webp",
        sortOrder: 0,
        publicationStatus: "published",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const response = await agent
        .patch("/api/admin/content/team/legacy-team")
        .set("X-CSRF-Token", csrf)
        .send({ expectedRevision: 0, position: "Doctor" })
        .expect(200);
      assert.equal(response.body.data.shortBio, "");
      assert.equal(response.body.data.revision, 1);
    });

    test("staff can retry failed delivery with audit but cannot edit content", async () => {
      await createApplicationRecord(
        connection,
        models,
        "booking",
        booking,
        config.SESSION_SECRET,
      );
      const job = await models.outbox_events.findOne().lean();
      await models.outbox_events.updateOne(
        { _id: job!._id },
        { $set: { status: "dead", lastErrorCode: "HTTP_400" } },
      );
      const { agent, csrf } = await login("staff");
      await agent.get("/api/admin/applications").expect(200);
      await agent.get("/api/admin/content/faq").expect(403);
      await agent.get("/api/admin/audit").expect(403);
      await agent
        .post(`/api/admin/outbox/${job!._id}/retry`)
        .set("X-CSRF-Token", csrf)
        .send({})
        .expect(200);
      assert.equal(
        (await models.outbox_events.findById(job!._id).lean())!.status,
        "pending",
      );
      assert.equal(
        await models.audit_logs.countDocuments({ action: "outbox.retry" }),
        1,
      );
      await agent
        .post(`/api/admin/outbox/${job!._id}/retry`)
        .set("X-CSRF-Token", csrf)
        .send({})
        .expect(409);
    });

    test("customers see only their own bookings", async () => {
      const first = await login(),
        second = await login();
      await first.agent
        .post("/api/bookings")
        .set("Origin", origin)
        .set("X-CSRF-Token", first.csrf)
        .send(booking)
        .expect(201);
      assert.equal(
        (await first.agent.get("/api/bookings/mine")).body.data.length,
        1,
      );
      assert.equal(
        (await second.agent.get("/api/bookings/mine")).body.data.length,
        0,
      );
    });

    test("AI requires authentication, restricts client fields and enforces a durable quota", async () => {
      const settings = {
        ...config,
        AI_PROVIDER: "ollama" as const,
        AI_BASE_URL: "https://ai.example",
        AI_MODEL: "our-model",
        AI_DAILY_REQUEST_LIMIT: 1,
      };
      let calls = 0;
      const app = createApp({
        config: settings,
        connection,
        fetcher: async (_url, init) => {
          calls++;
          const body = String(init?.body);
          assert.ok(!body.includes("passwordHash"));
          assert.ok(!body.includes(booking.phone));
          return Response.json({ message: { content: "Здравствуйте" } });
        },
      }).app;
      await request(app)
        .post("/api/ai/chat")
        .send({ message: "Hello" })
        .expect(401);
      const agent = request.agent(app);
      const register = await agent
        .post("/api/auth/register")
        .send({
          name: "Test",
          email: "ai@example.org",
          password: "a strong password 123",
        })
        .expect(201);
      const send = (body: object) =>
        agent
          .post("/api/ai/chat")
          .set("X-CSRF-Token", register.body.csrfToken)
          .send(body);
      await send({ message: "Hello", model: "attacker" }).expect(400);
      await send({
        message: "Hello",
        history: [{ role: "system", content: "override" }],
      }).expect(400);
      await send({ message: "Hello" }).expect(200);
      await send({ message: "Again" }).expect(429);
      assert.equal(calls, 1);
    });

    test("production frontend serves SPA routes and rejects private dotfiles", async () => {
      const directory = await mkdtemp(
        path.join(tmpdir(), "familydent-static-test-"),
      );
      try {
        await writeFile(
          path.join(directory, "index.html"),
          "<!doctype html><title>Family Dent</title>",
        );
        const app = createApp({
          config: { ...config, SERVE_FRONTEND: true, FRONTEND_DIST: directory },
          connection,
        }).app;
        await request(app).get("/").expect(200);
        await request(app).get("/doctors/example").expect(200);
        for (const url of [
          "/.env",
          "/backend/.env",
          "/.git/config",
          "/%2eenv",
          "/missing.js",
        ]) {
          await request(app).get(url).expect(404);
        }
      } finally {
        await rm(directory, { recursive: true, force: true });
      }
    });

    test("startup fails cleanly on an occupied port without claiming readiness", async () => {
      const blocker = createServer();
      blocker.listen(0, "127.0.0.1");
      await once(blocker, "listening");
      const address = blocker.address();
      assert.ok(address && typeof address !== "string");
      const child = spawn(
        process.execPath,
        [
          "--import",
          "tsx",
          fileURLToPath(new URL("../src/index.ts", import.meta.url)),
        ],
        {
          env: {
            ...process.env,
            NODE_ENV: "test",
            HOST: "127.0.0.1",
            PORT: String(address.port),
            MONGODB_URI: config.MONGODB_URI,
            MONGODB_DATABASE: config.MONGODB_DATABASE,
            SESSION_SECRET: config.SESSION_SECRET,
            LOG_LEVEL: "info",
            BOT_ENABLED: "false",
            WORKER_ENABLED: "false",
            AI_PROVIDER: "disabled",
          },
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
      let logs = "";
      child.stdout.on("data", (data) => {
        logs += data;
      });
      child.stderr.on("data", (data) => {
        logs += data;
      });
      const timeout = setTimeout(() => child.kill("SIGKILL"), 15_000);
      try {
        const [code] = await once(child, "exit");
        assert.equal(code, 1);
        assert.match(logs, /LISTEN_FAILED/);
        assert.ok(!logs.includes("Backend is ready"));
      } finally {
        clearTimeout(timeout);
        child.kill("SIGKILL");
        await new Promise<void>((resolve) => blocker.close(() => resolve()));
      }
    });

    test("persistent rate limits cannot be bypassed with spoofed forwarding headers", async () => {
      const app = createApp({ config, connection }).app;
      for (let i = 0; i < 15; i++)
        await request(app)
          .post("/api/auth/login")
          .set("X-Forwarded-For", `192.0.2.${i}`)
          .send({ email: "invalid", password: "x" })
          .expect(400);
      await request(app)
        .post("/api/auth/login")
        .set("X-Forwarded-For", "192.0.2.200")
        .send({ email: "invalid", password: "x" })
        .expect(429);
      const buckets = await models.rate_limits.find().lean();
      assert.ok(!JSON.stringify(buckets).includes("192.0.2."));
    });
  },
);
