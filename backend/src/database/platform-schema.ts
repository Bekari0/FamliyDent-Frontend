import type { Document, IndexDescription } from "mongodb";

type Definition = {
  name: string;
  validator: Document;
  indexes: IndexDescription[];
};
const string = { bsonType: "string" };
const date = { bsonType: "date" };
const objectId = { bsonType: "objectId" };
const number = { bsonType: ["int", "long", "double"], minimum: 0 };

function definition(
  name: string,
  required: string[],
  properties: Document,
  indexes: IndexDescription[],
): Definition {
  return {
    name,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        additionalProperties: false,
        required: ["_id", ...required],
        properties: { _id: objectId, ...properties },
      },
    },
    indexes,
  };
}

export function extendPlatformCollections(
  definitions: Definition[],
): Definition[] {
  for (const item of definitions) {
    const fields = item.validator.$jsonSchema.properties;
    if (fields.id && fields.publicationStatus) fields.revision = number;
    if (item.name === "users")
      Object.assign(fields, {
        role: { enum: ["customer", "staff", "admin"] },
        status: { enum: ["active", "disabled"] },
        passwordVersion: { enum: [1, 2] },
        sessionVersion: number,
      });
    if (item.name === "sessions") fields.version = number;
    if (["bookings", "tourism_consultations"].includes(item.name)) {
      Object.assign(fields, { userId: objectId, botLastOccurredAt: date });
      item.indexes.push({
        key: { userId: 1, createdAt: -1 },
        name: "user_created",
      });
    }
  }
  const timestamps = { createdAt: date, updatedAt: date };
  return [
    ...definitions,
    definition(
      "outbox_events",
      [
        "eventId",
        "kind",
        "resourceId",
        "status",
        "attempts",
        "nextAttemptAt",
        "createdAt",
        "updatedAt",
      ],
      {
        eventId: string,
        kind: { enum: ["booking.created", "tourism_consultation.created"] },
        resourceId: objectId,
        status: { enum: ["pending", "delivering", "sent", "dead"] },
        attempts: number,
        nextAttemptAt: date,
        lockedUntil: date,
        lockToken: string,
        deliveredAt: date,
        lastErrorCode: string,
        ...timestamps,
      },
      [
        { key: { eventId: 1 }, name: "event_unique", unique: true },
        {
          key: { status: 1, nextAttemptAt: 1, lockedUntil: 1 },
          name: "delivery_queue",
        },
      ],
    ),
    definition(
      "idempotency_keys",
      ["_id", "bodyHash", "resourceId", "expiresAt"].filter((v) => v !== "_id"),
      {
        _id: string,
        bodyHash: string,
        resourceId: objectId,
        expiresAt: date,
      },
      [
        {
          key: { expiresAt: 1 },
          name: "idempotency_expiry",
          expireAfterSeconds: 0,
        },
      ],
    ),
    definition(
      "integration_events",
      ["eventId", "bodyHash", "processedAt", "expiresAt"],
      {
        eventId: string,
        bodyHash: string,
        processedAt: date,
        expiresAt: date,
      },
      [
        { key: { eventId: 1 }, name: "integration_event_unique", unique: true },
        { key: { expiresAt: 1 }, name: "event_expiry", expireAfterSeconds: 0 },
      ],
    ),
    definition(
      "rate_limits",
      ["count", "resetAt", "expiresAt"],
      {
        _id: string,
        count: number,
        resetAt: date,
        expiresAt: date,
      },
      [
        {
          key: { expiresAt: 1 },
          name: "rate_limit_expiry",
          expireAfterSeconds: 0,
        },
      ],
    ),
    definition(
      "audit_logs",
      ["actorId", "action", "entity", "entityId", "requestId", "createdAt"],
      {
        actorId: objectId,
        action: string,
        entity: string,
        entityId: string,
        requestId: string,
        createdAt: date,
        changedFields: { bsonType: "array", items: string },
      },
      [
        { key: { createdAt: -1 }, name: "audit_created" },
        {
          key: { entity: 1, entityId: 1, createdAt: -1 },
          name: "audit_entity",
        },
      ],
    ),
    definition(
      "ai_usage",
      ["userId", "count", "expiresAt"],
      {
        _id: string,
        userId: objectId,
        count: number,
        expiresAt: date,
      },
      [
        {
          key: { expiresAt: 1 },
          name: "ai_usage_expiry",
          expireAfterSeconds: 0,
        },
      ],
    ),
  ];
}
