import {
  rateLimit,
  type Store,
  type IncrementResponse,
} from "express-rate-limit";
import type { Models } from "../models/index.js";
import { hmac } from "../lib/crypto.js";
import { mongoCode } from "../lib/errors.js";

export function persistentLimiter(
  models: Models,
  secret: string,
  namespace: string,
  max: number,
  windowMs: number,
) {
  const store: Store = {
    localKeys: false,
    prefix: `${namespace}:`,
    async increment(key: string): Promise<IncrementResponse> {
      const window = Math.floor(Date.now() / windowMs);
      const _id = `${namespace}:${window}:${hmac(secret, key)}`;
      const resetAt = new Date((window + 1) * windowMs);
      let bucket;
      try {
        bucket = await models.rate_limits
          .findOneAndUpdate(
            { _id },
            {
              $inc: { count: 1 },
              $setOnInsert: {
                resetAt,
                expiresAt: new Date(resetAt.getTime() + windowMs),
              },
            },
            { upsert: true, returnDocument: "after", runValidators: true },
          )
          .lean();
      } catch (error) {
        if (mongoCode(error) !== 11000) throw error;
        bucket = await models.rate_limits
          .findOneAndUpdate(
            { _id },
            { $inc: { count: 1 } },
            { returnDocument: "after" },
          )
          .lean();
      }
      if (!bucket) throw new Error("Rate limit storage failed");
      return { totalHits: bucket.count, resetTime: resetAt };
    },
    async decrement() {},
    async resetKey() {},
  };
  return rateLimit({
    windowMs,
    limit: max,
    store,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    // Forwarding headers are deliberately ignored unless Express trusts the sender.
    validate: { xForwardedForHeader: false },
    passOnStoreError: false,
    message: {
      error: "Слишком много запросов. Попробуйте позже",
      code: "RATE_LIMITED",
    },
  });
}
