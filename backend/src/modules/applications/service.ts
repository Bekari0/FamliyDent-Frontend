import { randomUUID } from "node:crypto";
import { Types, type Connection } from "mongoose";
import type { Models } from "../../models/index.js";
import { hmac, sha256 } from "../../lib/crypto.js";
import { HttpError, mongoCode } from "../../lib/errors.js";

export type ApplicationKind = "booking" | "tourism_consultation";
export const applicationCollection = (kind: ApplicationKind) =>
  kind === "booking" ? "bookings" : "tourism_consultations";

export async function createApplicationRecord(
  connection: Connection,
  models: Models,
  kind: ApplicationKind,
  data: Record<string, unknown>,
  secret: string,
  key?: string,
) {
  const { requestIp: _requestIp, ...applicationData } = data;
  const bodyHash = sha256(JSON.stringify(applicationData));
  const dedupeId = key ? hmac(secret, `${kind}:${key}`) : undefined;
  const replay = async () => {
    if (!dedupeId) return null;
    const existing = await models.idempotency_keys.findById(dedupeId).lean();
    if (!existing || existing.expiresAt <= new Date()) return null;
    if (existing.bodyHash !== bodyHash)
      throw new HttpError(
        409,
        "IDEMPOTENCY_CONFLICT",
        "Ключ повторного запроса уже использован для других данных",
      );
    return { id: String(existing.resourceId), replayed: true };
  };
  const previous = await replay();
  if (previous) return previous;
  const resourceId = new Types.ObjectId();
  try {
    await connection.transaction(async (session) => {
      if (dedupeId) {
        await models.idempotency_keys
          .deleteOne({ _id: dedupeId, expiresAt: { $lte: new Date() } })
          .session(session);
        await models.idempotency_keys.create(
          [
            {
              _id: dedupeId,
              bodyHash,
              resourceId,
              expiresAt: new Date(Date.now() + 86_400_000),
            },
          ],
          { session },
        );
      }
      await models[applicationCollection(kind)].create(
        [
          {
            _id: resourceId,
            ...data,
            status: "new",
            source: kind === "booking" ? "website" : "website-tourism",
          },
        ],
        { session },
      );
      await models.outbox_events.create(
        [
          {
            eventId: randomUUID(),
            kind: `${kind}.created`,
            resourceId,
            status: "pending",
            attempts: 0,
            nextAttemptAt: new Date(),
          },
        ],
        { session },
      );
    });
  } catch (error) {
    if (mongoCode(error) === 11000) {
      const previous = await replay();
      if (previous) return previous;
    }
    throw error;
  }
  return { id: String(resourceId), replayed: false };
}
