import { Router } from "express";
import { randomUUID } from "node:crypto";
import type { Connection } from "mongoose";
import { z } from "zod";
import type { Models } from "../../models/index.js";
import type { AuthService } from "../auth/service.js";
import { contentDefinitions, isContentType } from "../../database/schema.js";
import { HttpError } from "../../lib/errors.js";

const pageInput = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});
function contentType(value: string) {
  if (!isContentType(value))
    throw new HttpError(404, "CONTENT_NOT_FOUND", "Неизвестный тип контента");
  return value;
}

export function adminRoutes(
  connection: Connection,
  models: Models,
  auth: AuthService,
) {
  const router = Router();
  router.use(auth.requireRole("staff", "admin"));
  router.get("/applications", async (request, response) => {
    const input = pageInput
      .extend({
        kind: z.enum(["booking", "tourism_consultation"]).default("booking"),
        status: z
          .enum(["new", "confirmed", "completed", "cancelled"])
          .optional(),
      })
      .strict()
      .parse(request.query);
    const model =
      models[input.kind === "booking" ? "bookings" : "tourism_consultations"];
    const query = input.status ? { status: input.status } : {};
    const data = await model
      .find(query)
      .select("-requestIp")
      .sort({ createdAt: -1 })
      .skip((input.page - 1) * input.limit)
      .limit(input.limit)
      .lean();
    response.json({
      data,
      page: input.page,
      total: await model.countDocuments(query),
    });
  });
  router.get("/outbox", async (request, response) => {
    const input = pageInput
      .extend({
        status: z.enum(["pending", "delivering", "sent", "dead"]).optional(),
      })
      .strict()
      .parse(request.query);
    const query = input.status ? { status: input.status } : {};
    const data = await models.outbox_events
      .find(query)
      .select("-lockToken")
      .sort({ createdAt: -1 })
      .skip((input.page - 1) * input.limit)
      .limit(input.limit)
      .lean();
    response.json({
      data,
      page: input.page,
      total: await models.outbox_events.countDocuments(query),
    });
  });
  router.post("/outbox/:id/retry", async (request, response) => {
    const id = z
      .string()
      .regex(/^[a-f\d]{24}$/i)
      .parse(request.params.id);
    await connection.transaction(async (session) => {
      const job = await models.outbox_events.findOneAndUpdate(
        { _id: id, status: "dead" },
        {
          $set: { status: "pending", attempts: 0, nextAttemptAt: new Date() },
          $unset: { lockToken: 1, lockedUntil: 1, lastErrorCode: 1 },
        },
        { session, returnDocument: "after", runValidators: true },
      );
      if (!job)
        throw new HttpError(
          409,
          "DELIVERY_NOT_RETRYABLE",
          "Повторить можно только неудачную доставку",
        );
      await models.audit_logs.create(
        [
          {
            actorId: response.locals.auth.userId,
            action: "outbox.retry",
            entity: "outbox_events",
            entityId: id,
            requestId: response.locals.requestId,
          },
        ],
        { session },
      );
    });
    response.json({ ok: true });
  });
  router.use(auth.requireRole("admin"));
  router.get("/audit", async (request, response) => {
    const { page, limit } = pageInput.strict().parse(request.query);
    response.json({
      data: await models.audit_logs
        .find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      page,
    });
  });
  router.get("/content/:type", async (request, response) => {
    const type = contentType(String(request.params.type));
    const { page, limit } = pageInput.strict().parse(request.query);
    const model = models[contentDefinitions[type].collection];
    response.json({
      data: await model
        .find({})
        .sort({ sortOrder: 1, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      page,
      total: await model.countDocuments(),
    });
  });
  router.post("/content/:type", async (request, response) => {
    const type = contentType(String(request.params.type));
    const definition = contentDefinitions[type];
    const allowed = new Set([
      "id",
      "sortOrder",
      "publicationStatus",
      ...Object.keys(definition.fields),
    ]);
    const data = z.record(z.string(), z.unknown()).parse(request.body);
    if (Object.keys(data).some((key) => !allowed.has(key)))
      throw new HttpError(400, "UNKNOWN_FIELD", "Неизвестное поле документа");
    let created: unknown;
    await connection.transaction(async (session) => {
      const [record] = await models[definition.collection].create(
        [
          {
            ...data,
            id: data.id ?? randomUUID(),
            sortOrder: data.sortOrder ?? 0,
            publicationStatus: data.publicationStatus ?? "draft",
            revision: 0,
          },
        ],
        { session },
      );
      created = record.toObject();
      await models.audit_logs.create(
        [
          {
            actorId: response.locals.auth.userId,
            action: "content.create",
            entity: definition.collection,
            entityId: record.id,
            requestId: response.locals.requestId,
            changedFields: Object.keys(data),
          },
        ],
        { session },
      );
    });
    response.status(201).json({ data: created });
  });
  router.patch("/content/:type/:id", async (request, response) => {
    const type = contentType(String(request.params.type));
    const definition = contentDefinitions[type];
    const data = z.record(z.string(), z.unknown()).parse(request.body);
    const revision = z.number().int().min(0).parse(data.expectedRevision);
    const { expectedRevision: _revision, ...changes } = data;
    const allowed = new Set([
      "sortOrder",
      "publicationStatus",
      ...Object.keys(definition.fields),
    ]);
    if (Object.keys(changes).some((key) => !allowed.has(key)))
      throw new HttpError(400, "UNKNOWN_FIELD", "Неизвестное поле документа");
    let updated: unknown;
    await connection.transaction(async (session) => {
      const record = await models[definition.collection]
        .findOne({ id: String(request.params.id) })
        .session(session);
      if (!record)
        throw new HttpError(404, "CONTENT_NOT_FOUND", "Документ не найден");
      if ((record.revision ?? 0) !== revision)
        throw new HttpError(
          409,
          "REVISION_CONFLICT",
          "Документ уже изменён. Загрузите актуальную версию",
        );
      record.set({ ...changes, revision: revision + 1 });
      await record.save({ session });
      updated = record.toObject();
      await models.audit_logs.create(
        [
          {
            actorId: response.locals.auth.userId,
            action: "content.update",
            entity: definition.collection,
            entityId: record.id,
            requestId: response.locals.requestId,
            changedFields: Object.keys(changes),
          },
        ],
        { session },
      );
    });
    response.json({ data: updated });
  });
  return router;
}
