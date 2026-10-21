import { randomBytes } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import type { AppConfig } from "../../config/env.js";
import type { Models } from "../../models/index.js";
import { hmac, safeEqual, sha256 } from "../../lib/crypto.js";
import { HttpError } from "../../lib/errors.js";

export type AuthIdentity = {
  userId: string;
  name: string;
  email: string;
  role: "customer" | "staff" | "admin";
  csrfToken: string;
};

export function authService(models: Models, config: AppConfig) {
  const cookieName =
    config.NODE_ENV === "production" ? "__Host-fd_session" : "fd_session";
  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
  const csrfToken = (token: string) =>
    hmac(config.SESSION_SECRET, `csrf:${token}`);
  async function createSession(
    userId: unknown,
    response: Response,
    previousToken?: string,
    version = 0,
  ) {
    if (previousToken)
      await models.sessions.deleteOne({ tokenHash: sha256(previousToken) });
    const token = randomBytes(32).toString("base64url");
    const lifetime = config.SESSION_DAYS * 86_400_000;
    await models.sessions.create({
      tokenHash: sha256(token),
      userId,
      version,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + lifetime),
    });
    response.cookie(cookieName, token, { ...cookieOptions, maxAge: lifetime });
    return csrfToken(token);
  }
  async function optional(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const token = request.cookies?.[cookieName];
    if (typeof token !== "string" || !/^[\w-]{43}$/.test(token)) {
      next();
      return;
    }
    const session = await models.sessions
      .findOne({ tokenHash: sha256(token), expiresAt: { $gt: new Date() } })
      .lean();
    if (session) {
      const user = await models.users.findById(session.userId).lean();
      if (
        user &&
        user.status !== "disabled" &&
        (session.version ?? 0) === (user.sessionVersion ?? 0)
      ) {
        response.locals.auth = {
          userId: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role ?? "customer",
          csrfToken: csrfToken(token),
        } satisfies AuthIdentity;
      }
    }
    next();
  }
  function requireUser(
    _request: Request,
    response: Response,
    next: NextFunction,
  ) {
    if (!response.locals.auth)
      throw new HttpError(401, "UNAUTHENTICATED", "Войдите в аккаунт");
    next();
  }
  function requireRole(...roles: AuthIdentity["role"][]) {
    return (_request: Request, response: Response, next: NextFunction) => {
      const auth = response.locals.auth as AuthIdentity | undefined;
      if (!auth)
        throw new HttpError(401, "UNAUTHENTICATED", "Войдите в аккаунт");
      if (!roles.includes(auth.role))
        throw new HttpError(403, "FORBIDDEN", "Недостаточно прав");
      next();
    };
  }
  function csrf(request: Request, response: Response, next: NextFunction) {
    const auth = response.locals.auth as AuthIdentity | undefined;
    if (
      auth &&
      !["GET", "HEAD", "OPTIONS"].includes(request.method) &&
      !safeEqual(request.get("X-CSRF-Token") ?? "", auth.csrfToken)
    ) {
      throw new HttpError(
        403,
        "CSRF_INVALID",
        "Обновите страницу и повторите запрос",
      );
    }
    next();
  }
  async function logout(request: Request, response: Response) {
    const token = request.cookies?.[cookieName];
    if (typeof token === "string")
      await models.sessions.deleteOne({ tokenHash: sha256(token) });
    response.clearCookie(cookieName, cookieOptions);
  }
  return {
    cookieName,
    createSession,
    optional,
    requireUser,
    requireRole,
    csrf,
    logout,
  };
}
export type AuthService = ReturnType<typeof authService>;
