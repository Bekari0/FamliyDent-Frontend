import { createHash, createHmac, timingSafeEqual } from "node:crypto";
export const sha256 = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
export const hmac = (secret: string, value: string | Buffer) =>
  createHmac("sha256", secret).update(value).digest("hex");
export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
