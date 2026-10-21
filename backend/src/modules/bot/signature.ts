import { hmac, safeEqual } from "../../lib/crypto.js";
import { HttpError } from "../../lib/errors.js";

export function signBotBody(
  secret: string,
  timestamp: string,
  raw: Buffer | string,
): string {
  return hmac(
    secret,
    Buffer.concat([Buffer.from(`${timestamp}.`), Buffer.from(raw)]),
  );
}
export function verifyBotSignature(
  secret: string,
  timestamp: string | undefined,
  signature: string | undefined,
  raw: Buffer,
  now = Date.now(),
) {
  if (
    !timestamp ||
    !/^\d{10}$/.test(timestamp) ||
    Math.abs(now / 1000 - Number(timestamp)) > 300 ||
    !signature ||
    !/^[a-f0-9]{64}$/.test(signature) ||
    !safeEqual(signBotBody(secret, timestamp, raw), signature)
  ) {
    throw new HttpError(
      401,
      "BOT_SIGNATURE_INVALID",
      "Недействительная подпись запроса",
    );
  }
}
