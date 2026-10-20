import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config";
import { closeDatabase, ensureIndexes, getDatabase } from "./db";
import { InputError, readString, requestIp } from "./validation";
import { clearSession, createSession, deleteSession, hashPassword, verifyPassword } from "./auth";

const app = express();
const requestBuckets = new Map<string, { count: number; resetAt: number }>();
const limitRequests = (max: number, windowMs: number) => (request: Request, response: Response, next: NextFunction) => {
  const key = `${request.ip}:${request.path}`;
  const now = Date.now();
  if (requestBuckets.size > 10_000) {
    for (const [bucketKey, value] of requestBuckets) if (value.resetAt <= now) requestBuckets.delete(bucketKey);
  }
  const bucket = requestBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + windowMs });
    next();
    return;
  }
  if (bucket.count >= max) {
    response.status(429).json({ error: "Слишком много запросов. Попробуйте позже" });
    return;
  }
  bucket.count += 1;
  next();
};
const allowedContentTypes = new Set([
  "doctors", "services", "reviews", "blogPosts", "clinicSpaces", "concerns",
  "equipment", "faq", "metrics", "pricing", "team", "treatmentCases",
  "academyPrograms", "tourismFeatures", "tourismRoadmap", "tourismComparison",
  "tourismPackages", "tourismPlaces",
]);

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", async (_request, response, next) => {
  try {
    const database = await getDatabase();
    await database.command({ ping: 1 });
    response.json({ ok: true, database: config.databaseName });
  } catch (error) {
    next(error);
  }
});

app.get("/api/content/:type", async (request, response, next) => {
  try {
    const contentType = request.params.type;
    if (!allowedContentTypes.has(contentType)) {
      response.status(404).json({ error: "Неизвестный тип контента" });
      return;
    }

    const database = await getDatabase();
    const documents = await database.collection("website_content")
      .find({ contentType }, { projection: { _id: 0, data: 1, media: 1 } })
      .sort({ order: 1 })
      .toArray();
    const localPaths = documents.flatMap((document) =>
      (Array.isArray(document.media) ? document.media : [])
        .map((asset) => asset?.localPath)
        .filter((value): value is string => typeof value === "string" && Boolean(value)),
    );
    const uploadedMedia = localPaths.length
      ? await database.collection("website_media")
        .find({ localPath: { $in: localPaths }, status: "ready" }, { projection: { _id: 0, localPath: 1, cloudUrl: 1 } })
        .toArray()
      : [];
    const cloudUrlByPath = new Map(uploadedMedia.map((asset) => [asset.localPath, asset.cloudUrl]));
    const data = documents.map((document) => {
      const item = { ...(document.data as Record<string, unknown>) };
      const media = Array.isArray(document.media) ? document.media : [];
      for (const asset of media) {
        if (!asset || typeof asset !== "object" || typeof asset.field !== "string") continue;
        const cloudUrl = typeof asset.localPath === "string"
          ? cloudUrlByPath.get(asset.localPath)
          : asset.cloudUrl;
        if (typeof cloudUrl === "string" && cloudUrl) {
          item[asset.field] = cloudUrl;
        }
      }
      return item;
    });
    response.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    response.json({ data });
  } catch (error) {
    next(error);
  }
});

app.post("/api/bookings", limitRequests(10, 15 * 60_000), async (request, response, next) => {
  try {
    const body = request.body as Record<string, unknown>;
    const booking = {
      name: readString(body, "name", { required: true, max: 120 }),
      phone: readString(body, "phone", { required: true, max: 40 }),
      doctor: readString(body, "doctor", { max: 160 }),
      service: readString(body, "service", { max: 120 }),
      preferredDate: readString(body, "preferredDate", { max: 40 }),
      status: "new",
      source: "website",
      createdAt: new Date(),
      requestIp: requestIp(request.header("x-forwarded-for") || request.ip),
    };
    const result = await (await getDatabase()).collection("bookings").insertOne(booking);
    response.status(201).json({ ok: true, id: result.insertedId.toString() });
  } catch (error) {
    next(error);
  }
});

app.post("/api/tourism-consultations", limitRequests(10, 15 * 60_000), async (request, response, next) => {
  try {
    const body = request.body as Record<string, unknown>;
    const consultation = {
      name: readString(body, "name", { required: true, max: 120 }),
      email: readString(body, "email", { required: true, max: 200 }),
      phone: readString(body, "phone", { required: true, max: 40 }),
      telegram: readString(body, "telegram", { max: 100 }),
      country: readString(body, "country", { required: true, max: 120 }),
      service: readString(body, "service", { required: true, max: 120 }),
      message: readString(body, "message", { max: 2_000 }),
      status: "new",
      source: "website-tourism",
      createdAt: new Date(),
      requestIp: requestIp(request.header("x-forwarded-for") || request.ip),
    };
    const result = await (await getDatabase()).collection("tourism_consultations").insertOne(consultation);
    response.status(201).json({ ok: true, id: result.insertedId.toString() });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/register", limitRequests(10, 15 * 60_000), async (request, response, next) => {
  try {
    const body = request.body as Record<string, unknown>;
    const name = readString(body, "name", { required: true, max: 120 })!;
    const email = readString(body, "email", { required: true, max: 200 })!.toLocaleLowerCase("en-US");
    const password = readString(body, "password", { required: true, max: 200 })!;
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new InputError("Некорректный email");
    if (password.length < 8) throw new InputError("Пароль должен содержать минимум 8 символов");
    const credentials = await hashPassword(password);
    const result = await (await getDatabase()).collection("website_users").insertOne({
      name, email, ...credentials, createdAt: new Date(), updatedAt: new Date(),
    });
    await createSession(result.insertedId, response, config.nodeEnv === "production");
    response.status(201).json({ ok: true, user: { name, email } });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      response.status(409).json({ error: "Пользователь с таким email уже существует" });
      return;
    }
    next(error);
  }
});

app.post("/api/auth/login", limitRequests(10, 15 * 60_000), async (request, response, next) => {
  try {
    const body = request.body as Record<string, unknown>;
    const email = readString(body, "email", { required: true, max: 200 })!.toLocaleLowerCase("en-US");
    const password = readString(body, "password", { required: true, max: 200 })!;
    const user = await (await getDatabase()).collection("website_users").findOne({ email });
    const valid = user && await verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!valid) {
      response.status(401).json({ error: "Неверный email или пароль" });
      return;
    }
    await createSession(user._id, response, config.nodeEnv === "production");
    response.json({ ok: true, user: { name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", async (request, response, next) => {
  try {
    await deleteSession(request.header("cookie"));
    clearSession(response, config.nodeEnv === "production");
    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(currentDirectory, "../dist");
if (config.nodeEnv === "production") {
  app.use(express.static(distDirectory, { maxAge: "1d", index: false }));
  app.get("*", (_request, response) => response.sendFile(path.join(distDirectory, "index.html")));
}

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof InputError) {
    response.status(400).json({ error: error.message });
    return;
  }
  console.error(error);
  response.status(500).json({ error: "Внутренняя ошибка сервера" });
});

const server = app.listen(config.port, () => {
  console.log(`Family Dent API listening on http://localhost:${config.port}`);
  void ensureIndexes().catch((error) => console.error("Failed to create indexes", error));
});

const shutdown = async () => {
  server.close();
  await closeDatabase();
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
