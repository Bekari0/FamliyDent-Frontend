import { Router } from "express";
import { Types, type Connection } from "mongoose";
import { z } from "zod";
import type { AppConfig } from "../../config/env.js";
import type { Models } from "../../models/index.js";
import { HttpError, mongoCode } from "../../lib/errors.js";
import { sha256 } from "../../lib/crypto.js";
import { verifyBotSignature } from "./signature.js";

const eventInput = z
  .object({
    eventId: z.string().uuid(),
    type: z.enum([
      "booking.status_changed",
      "tourism_consultation.status_changed",
    ]),
    applicationId: z.string().regex(/^[a-f\d]{24}$/i),
    status: z.enum(["confirmed", "completed", "cancelled"]),
    occurredAt: z.iso.datetime().transform((v) => new Date(v)),
  })
  .strict();

export function botRoutes(
  connection: Connection,
  models: Models,
  config: AppConfig,
) {
  const router = Router();
  router.post("/events", async (request, response) => {
    if (!config.BOT_ENABLED)
      throw new HttpError(
        503,
        "BOT_DISABLED",
        "Интеграция с ботом не настроена",
      );
    if (!Buffer.isBuffer(request.body))
      throw new HttpError(415, "JSON_REQUIRED", "Ожидается application/json");
    verifyBotSignature(
      config.BOT_WEBHOOK_SECRET,
      request.get("X-Bot-Timestamp"),
      request.get("X-Bot-Signature"),
      request.body,
    );
    let json: unknown;
    try {
      json = JSON.parse(request.body.toString("utf8"));
    } catch {
      throw new HttpError(400, "INVALID_JSON", "Некорректный JSON");
    }
    const input = eventInput.parse(json);
    if (input.occurredAt.getTime() > Date.now() + 300_000)
      throw new HttpError(
        400,
        "EVENT_TIME_INVALID",
        "Некорректное время события",
      );
    const bodyHash = sha256(request.body);
    const existing = await models.integration_events
      .findOne({ eventId: input.eventId })
      .lean();
    if (existing) {
      if (existing.bodyHash !== bodyHash)
        throw new HttpError(
          409,
          "EVENT_CONFLICT",
          "Идентификатор события уже использован",
        );
      response.json({ ok: true, duplicate: true });
      return;
    }
    const collection = input.type.startsWith("booking.")
      ? "bookings"
      : "tourism_consultations";
    try {
      await connection.transaction(async (session) => {
        const record = await models[collection]
          .findById(input.applicationId)
          .session(session)
          .lean();
        if (!record)
          throw new HttpError(
            404,
            "APPLICATION_NOT_FOUND",
            "Заявка не найдена",
          );
        await models.integration_events.create(
          [
            {
              eventId: input.eventId,
              bodyHash,
              processedAt: new Date(),
              expiresAt: new Date(Date.now() + 7 * 86_400_000),
            },
          ],
          { session },
        );
        const stale =
          record.botLastOccurredAt &&
          record.botLastOccurredAt >= input.occurredAt;
        const allowed =
          record.status === "new"
            ? ["confirmed", "completed", "cancelled"]
            : record.status === "confirmed"
              ? ["completed", "cancelled"]
              : [];
        if (!stale && allowed.includes(input.status)) {
          await models[collection].updateOne(
            {
              _id: new Types.ObjectId(input.applicationId),
              status: record.status,
            },
            {
              $set: {
                status: input.status,
                botLastOccurredAt: input.occurredAt,
              },
            },
            { session, runValidators: true },
          );
        }
      });
    } catch (error) {
      if (mongoCode(error) !== 11000) throw error;
      const duplicate = await models.integration_events
        .findOne({ eventId: input.eventId })
        .lean();
      if (!duplicate || duplicate.bodyHash !== bodyHash)
        throw new HttpError(
          409,
          "EVENT_CONFLICT",
          "Идентификатор события уже использован",
        );
    }
    response.json({ ok: true });
  });
  return router;
}
