import { randomUUID } from "node:crypto";
import type { Logger } from "pino";
import type { Models } from "../../models/index.js";
import type { AppConfig } from "../../config/env.js";
import { boundedJson } from "../../lib/http-client.js";
import { signBotBody } from "./signature.js";

class DeliveryFailure extends Error {
  constructor(
    public code: string,
    public permanent = false,
  ) {
    super(code);
  }
}

export async function deliverNext(
  models: Models,
  config: AppConfig,
  fetcher: typeof fetch = fetch,
) {
  if (!config.BOT_ENABLED) return false;
  const now = new Date();
  const lockToken = randomUUID();
  const job = await models.outbox_events
    .findOneAndUpdate(
      {
        $or: [
          { status: "pending", nextAttemptAt: { $lte: now } },
          { status: "delivering", lockedUntil: { $lte: now } },
        ],
      },
      {
        $set: {
          status: "delivering",
          lockToken,
          lockedUntil: new Date(now.getTime() + 60_000),
        },
        $inc: { attempts: 1 },
      },
      { returnDocument: "after", sort: { nextAttemptAt: 1 } },
    )
    .lean();
  if (!job) return false;
  try {
    const collection =
      job.kind === "booking.created" ? "bookings" : "tourism_consultations";
    const application = await models[collection]
      .findById(job.resourceId)
      .select(
        "name phone email telegram country service doctor preferredDate message createdAt",
      )
      .lean();
    if (!application) throw new DeliveryFailure("APPLICATION_MISSING", true);
    const { _id, ...data } = application;
    const body = JSON.stringify({
      eventId: job.eventId,
      type: job.kind,
      occurredAt: job.createdAt.toISOString(),
      data: { id: String(_id), ...data },
    });
    const timestamp = String(Math.floor(Date.now() / 1000));
    const result = await fetcher(config.BOT_API_URL, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(config.BOT_TIMEOUT_MS),
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": job.eventId,
        "X-Bot-Timestamp": timestamp,
        "X-Bot-Signature": signBotBody(
          config.BOT_SIGNING_SECRET,
          timestamp,
          body,
        ),
        ...(config.BOT_API_TOKEN
          ? { Authorization: `Bearer ${config.BOT_API_TOKEN}` }
          : {}),
      },
      body,
    });
    if (!result.ok) {
      await result.body?.cancel();
      throw new DeliveryFailure(
        `HTTP_${result.status}`,
        result.status >= 400 &&
          result.status < 500 &&
          ![408, 429].includes(result.status),
      );
    }
    const receipt = (await boundedJson(result, 16_384)) as {
      accepted?: unknown;
    };
    if (receipt.accepted !== true) throw new DeliveryFailure("ACK_INVALID");
    await models.outbox_events.updateOne(
      { _id: job._id, lockToken, status: "delivering" },
      {
        $set: { status: "sent", deliveredAt: new Date() },
        $unset: { lockToken: 1, lockedUntil: 1, lastErrorCode: 1 },
      },
    );
  } catch (error) {
    const code =
      error instanceof DeliveryFailure ? error.code : "UPSTREAM_UNAVAILABLE";
    const dead =
      (error instanceof DeliveryFailure && error.permanent) ||
      job.attempts >= config.BOT_MAX_ATTEMPTS;
    const backoff =
      Math.min(3_600_000, 10_000 * 2 ** Math.min(job.attempts, 10)) +
      Math.floor(Math.random() * 2000);
    await models.outbox_events.updateOne(
      { _id: job._id, lockToken, status: "delivering" },
      {
        $set: {
          status: dead ? "dead" : "pending",
          lastErrorCode: code,
          nextAttemptAt: new Date(Date.now() + backoff),
        },
        $unset: { lockToken: 1, lockedUntil: 1 },
      },
    );
  }
  return true;
}

export function startBotWorker(
  models: Models,
  config: AppConfig,
  logger: Logger,
  fetcher: typeof fetch = fetch,
) {
  let stopped = false;
  let active: Promise<void> | undefined;
  let timer: ReturnType<typeof setTimeout>;
  const tick = async () => {
    if (stopped) return;
    active = (async () => {
      try {
        for (let i = 0; i < 10 && !stopped; i++)
          if (!(await deliverNext(models, config, fetcher))) break;
      } catch {
        logger.error(
          { code: "OUTBOX_WORKER_ERROR" },
          "Bot delivery cycle failed",
        );
      }
    })();
    await active;
    if (!stopped) {
      timer = setTimeout(tick, 1000);
      timer.unref();
    }
  };
  if (config.BOT_ENABLED) void tick();
  return async () => {
    stopped = true;
    clearTimeout(timer);
    await active;
  };
}
