import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { randomUUID } from "node:crypto";
import path from "node:path";
import type { Connection } from "mongoose";
import { ZodError } from "zod";
import type { Logger } from "pino";
import type { AppConfig } from "./config/env.js";
import { backendRoot } from "./config/env.js";
import { createModels } from "./models/index.js";
import { authService } from "./modules/auth/service.js";
import { authRoutes } from "./modules/auth/routes.js";
import { applicationRoutes } from "./modules/applications/routes.js";
import { botRoutes } from "./modules/bot/routes.js";
import { aiRoutes } from "./modules/ai/routes.js";
import { adminRoutes } from "./modules/admin/routes.js";
import { isContentType } from "./database/schema.js";
import { readPublicContent } from "./modules/content/service.js";
import { persistentLimiter } from "./middleware/rate-limit.js";
import { createLogger } from "./lib/logger.js";
import { HttpError, mongoCode } from "./lib/errors.js";

export function createApp({
  config,
  connection,
  fetcher = fetch,
  logger = createLogger(config.LOG_LEVEL),
}: {
  config: AppConfig;
  connection: Connection;
  fetcher?: typeof fetch;
  logger?: Logger;
}) {
  const app = express();
  const models = createModels(connection);
  const auth = authService(models, config);
  app.disable("x-powered-by");
  app.set("query parser", "simple");
  app.set(
    "trust proxy",
    config.TRUST_PROXY
      ? config.TRUST_PROXY.split(",").map((v) => v.trim())
      : false,
  );
  app.use(
    helmet({
      contentSecurityPolicy:
        config.NODE_ENV !== "production"
          ? false
          : {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: [
                  "'self'",
                  "'unsafe-inline'",
                  "https://fonts.googleapis.com",
                ],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:"],
                mediaSrc: ["'self'", "https:"],
                frameSrc: ["https://yandex.ru", "https://www.instagram.com"],
                connectSrc: ["'self'", ...config.origins],
                objectSrc: ["'none'"],
                frameAncestors: ["'none'"],
              },
            },
      strictTransportSecurity:
        config.NODE_ENV === "production"
          ? { maxAge: 31536000, includeSubDomains: true }
          : false,
    }),
  );
  app.use((request, response, next) => {
    const requestId = randomUUID();
    response.locals.requestId = requestId;
    response.setHeader("X-Request-Id", requestId);
    response.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
    const start = Date.now();
    response.once("finish", () =>
      logger.info(
        {
          requestId,
          method: request.method,
          path: request.path,
          status: response.statusCode,
          durationMs: Date.now() - start,
        },
        "request",
      ),
    );
    next();
  });
  app.use(
    cors({
      origin: (origin, callback) =>
        callback(null, !origin || config.origins.includes(origin)),
      credentials: true,
      methods: ["GET", "POST", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-CSRF-Token", "Idempotency-Key"],
      maxAge: 600,
    }),
  );
  app.get("/api/health/live", (_request, response) =>
    response.json({ ok: true }),
  );
  app.get(["/api/health", "/api/health/ready"], async (_request, response) => {
    try {
      await connection.db!.command({ ping: 1 });
      response.json({
        ok: true,
        service: "familydent-backend",
        database: config.MONGODB_DATABASE,
      });
    } catch {
      response.status(503).json({ ok: false });
    }
  });
  app.use(
    "/api",
    persistentLimiter(models, config.SESSION_SECRET, "global", 300, 60_000),
  );
  app.use(
    "/api/integrations/bot",
    express.raw({ type: "application/json", limit: "64kb" }),
    botRoutes(connection, models, config),
  );
  app.use(express.json({ limit: "64kb", strict: true }));
  app.use(cookieParser());
  app.use("/api", (request, _response, next) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      const origin = request.get("Origin");
      if (
        (origin && !config.origins.includes(origin)) ||
        (!origin && config.NODE_ENV === "production")
      )
        throw new HttpError(
          403,
          "ORIGIN_FORBIDDEN",
          "Недопустимый источник запроса",
        );
      if (
        !request.is("application/json") ||
        !request.body ||
        typeof request.body !== "object" ||
        Array.isArray(request.body)
      )
        throw new HttpError(400, "JSON_REQUIRED", "Ожидается JSON-объект");
    }
    next();
  });
  app.use("/api", auth.optional, auth.csrf, (_request, response, next) => {
    response.set("Cache-Control", "no-store");
    next();
  });
  app.use("/api/auth", authRoutes(models, config, auth));
  app.get("/api/content/:type", async (request, response) => {
    const type = String(request.params.type);
    if (!isContentType(type))
      throw new HttpError(404, "CONTENT_NOT_FOUND", "Неизвестный тип контента");
    const data = await readPublicContent(models, type);
    response
      .set("Cache-Control", "public, max-age=30, stale-while-revalidate=60")
      .json({ data });
  });
  app.use("/api", applicationRoutes(connection, models, config, auth));
  app.use("/api/ai", aiRoutes(models, config, auth, fetcher));
  app.use("/api/admin", adminRoutes(connection, models, auth));
  app.use("/api", (_request, _response) => {
    throw new HttpError(404, "NOT_FOUND", "API endpoint не найден");
  });
  if (config.SERVE_FRONTEND) {
    const directory = path.resolve(backendRoot, config.FRONTEND_DIST);
    app.use((request, _response, next) => {
      let decoded: string;
      try {
        decoded = decodeURIComponent(request.path);
      } catch {
        throw new HttpError(400, "INVALID_PATH", "Некорректный путь");
      }
      if (decoded.split("/").some((segment) => segment.startsWith("."))) {
        throw new HttpError(404, "NOT_FOUND", "Ресурс не найден");
      }
      next();
    });
    app.use(
      express.static(directory, {
        index: false,
        maxAge: "1h",
        dotfiles: "deny",
      }),
    );
    app.get("/{*path}", (request, response, next) => {
      if (!request.accepts("html") || path.extname(request.path)) {
        next();
        return;
      }
      response
        .set("Cache-Control", "no-cache")
        .sendFile(path.join(directory, "index.html"));
    });
  }
  app.use((_request, response) =>
    response.status(404).json({ error: "Ресурс не найден", code: "NOT_FOUND" }),
  );
  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction,
    ) => {
      let status = 500,
        code = "INTERNAL_ERROR",
        message = "Внутренняя ошибка сервера";
      if (error instanceof HttpError) {
        status = error.status;
        code = error.code;
        message = error.message;
      } else if (error instanceof ZodError) {
        status = 400;
        code = "VALIDATION_ERROR";
        message = "Проверьте заполненные поля";
      } else if (mongoCode(error) === 11000) {
        status = 409;
        code = "DUPLICATE";
        message = "Такая запись уже существует";
      } else if (
        mongoCode(error) === 121 ||
        (error instanceof Error &&
          ["ValidationError", "StrictModeError", "CastError"].includes(
            error.name,
          ))
      ) {
        status = 400;
        code = "VALIDATION_ERROR";
        message = "Некорректные данные";
      } else if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        [400, 413].includes(Number(error.status))
      ) {
        status = Number(error.status);
        code = status === 413 ? "PAYLOAD_TOO_LARGE" : "INVALID_JSON";
        message = "Некорректный запрос";
      }
      if (status >= 500)
        logger.error(
          {
            requestId: response.locals.requestId,
            code,
            errorType: error instanceof Error ? error.name : "UnknownError",
          },
          "Request failed",
        );
      response
        .set("Cache-Control", "no-store")
        .status(status)
        .json({
          error: message,
          code,
          requestId: response.locals.requestId,
          ...(error instanceof ZodError
            ? {
                fields: error.issues.map((issue) => ({
                  path: issue.path.join("."),
                  message: issue.message,
                })),
              }
            : {}),
        });
    },
  );
  return { app, models, auth };
}
