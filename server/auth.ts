import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Response } from "express";
import { getDatabase } from "./db";

const scrypt = promisify(scryptCallback);
const sessionLifetimeMs = 1000 * 60 * 60 * 24 * 30;

export async function hashPassword(password: string): Promise<{ passwordHash: string; passwordSalt: string }> {
  const passwordSalt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, passwordSalt, 64) as Buffer;
  return { passwordHash: derived.toString("hex"), passwordSalt };
}

export async function verifyPassword(password: string, passwordSalt: string, passwordHash: string): Promise<boolean> {
  const derived = await scrypt(password, passwordSalt, 64) as Buffer;
  const expected = Buffer.from(passwordHash, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: unknown, response: Response, secure: boolean): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionLifetimeMs);
  await (await getDatabase()).collection("website_sessions").insertOne({
    tokenHash: tokenHash(token), userId, createdAt: new Date(), expiresAt,
  });
  response.cookie("fd_session", token, { httpOnly: true, sameSite: "lax", secure, maxAge: sessionLifetimeMs, path: "/" });
}

export async function deleteSession(cookieHeader: string | undefined): Promise<void> {
  const token = cookieHeader?.split(";").map((part) => part.trim()).find((part) => part.startsWith("fd_session="))?.slice("fd_session=".length);
  if (token) await (await getDatabase()).collection("website_sessions").deleteOne({ tokenHash: tokenHash(token) });
}

export function clearSession(response: Response, secure: boolean): void {
  response.clearCookie("fd_session", { httpOnly: true, sameSite: "lax", secure, path: "/" });
}
