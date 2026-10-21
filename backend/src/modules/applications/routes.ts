import { Router } from "express";
import { z } from "zod";
import type { Connection } from "mongoose";
import type { AppConfig } from "../../config/env.js";
import type { Models } from "../../models/index.js";
import type { AuthService } from "../auth/service.js";
import { persistentLimiter } from "../../middleware/rate-limit.js";
import { createApplicationRecord } from "./service.js";
import { calendarDate } from "../../lib/calendar-date.js";

const text = (max: number) => z.string().trim().min(1).max(max);
const phone = z
  .string()
  .trim()
  .min(5)
  .max(40)
  .regex(/^[+\d\s()\-]+$/, "Укажите номер телефона");
const booking = z
  .object({
    name: text(120),
    phone,
    doctor: text(160).optional(),
    service: text(120).optional(),
    preferredDate: calendarDate.optional(),
  })
  .strict();
const tourism = z
  .object({
    name: text(120),
    phone,
    email: z.string().trim().email().max(200),
    telegram: z.string().trim().max(100).optional(),
    country: text(120),
    service: text(120),
    message: z.string().trim().max(2000).optional(),
  })
  .strict();

export function applicationRoutes(
  connection: Connection,
  models: Models,
  config: AppConfig,
  auth: AuthService,
) {
  const router = Router();
  const limit = persistentLimiter(
    models,
    config.SESSION_SECRET,
    "applications",
    10,
    15 * 60_000,
  );
  for (const [path, kind, input] of [
    ["/bookings", "booking", booking],
    ["/tourism-consultations", "tourism_consultation", tourism],
  ] as const) {
    router.post(path, limit, async (request, response) => {
      const data = input.parse(request.body);
      const key = request.get("Idempotency-Key");
      if (key)
        z.string()
          .min(16)
          .max(128)
          .regex(/^[\w-]+$/)
          .parse(key);
      const userId = response.locals.auth?.userId;
      const result = await createApplicationRecord(
        connection,
        models,
        kind,
        { ...data, ...(userId ? { userId } : {}), requestIp: request.ip },
        config.SESSION_SECRET,
        key,
      );
      response.status(201).json({
        ok: true,
        id: result.id,
        status: "new",
        delivery: config.BOT_ENABLED ? "queued" : "pending_configuration",
      });
    });
  }
  router.get("/bookings/mine", auth.requireUser, async (_request, response) => {
    const data = await models.bookings
      .find({ userId: response.locals.auth.userId })
      .select("service doctor preferredDate status createdAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    response.set("Cache-Control", "no-store").json({ data });
  });
  return router;
}
