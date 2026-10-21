import { Router } from "express";
import { z } from "zod";
import type { Models } from "../../models/index.js";
import type { AppConfig } from "../../config/env.js";
import type { AuthService, AuthIdentity } from "./service.js";
import { hashPassword, verifyPassword } from "./password.js";
import { HttpError, mongoCode } from "../../lib/errors.js";
import { persistentLimiter } from "../../middleware/rate-limit.js";

const email = z
  .string()
  .trim()
  .email()
  .max(200)
  .transform((v) => v.toLowerCase());
const loginInput = z
  .object({ email, password: z.string().min(1).max(200) })
  .strict();
const registerInput = z
  .object({
    name: z.string().trim().min(1).max(120),
    email,
    password: z.string().min(12).max(200),
  })
  .strict();

export function authRoutes(
  models: Models,
  config: AppConfig,
  auth: AuthService,
) {
  const router = Router();
  const limit = persistentLimiter(
    models,
    config.SESSION_SECRET,
    "auth",
    15,
    15 * 60_000,
  );
  router.post("/register", limit, async (request, response) => {
    const input = registerInput.parse(request.body);
    const password = await hashPassword(input.password);
    let user;
    try {
      user = await models.users.create({
        name: input.name,
        email: input.email,
        ...password,
        role: "customer",
        status: "active",
      });
    } catch (error) {
      if (mongoCode(error) === 11000)
        throw new HttpError(
          409,
          "EMAIL_EXISTS",
          "Пользователь с таким email уже существует",
        );
      throw error;
    }
    const csrfToken = await auth.createSession(
      user._id,
      response,
      request.cookies?.[auth.cookieName],
      user.sessionVersion ?? 0,
    );
    response.status(201).json({
      ok: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      csrfToken,
    });
  });
  router.post("/login", limit, async (request, response) => {
    const input = loginInput.parse(request.body);
    const user = await models.users
      .findOne({ email: input.email })
      .select("+passwordHash +passwordSalt")
      .lean();
    const valid = await verifyPassword(
      input.password,
      user?.passwordSalt ?? "0".repeat(32),
      user?.passwordHash ?? "0".repeat(128),
      user?.passwordVersion ?? 1,
    );
    if (!user || !valid || user.status === "disabled")
      throw new HttpError(
        401,
        "INVALID_CREDENTIALS",
        "Неверный email или пароль",
      );
    if ((user.passwordVersion ?? 1) === 1) {
      await models.users.updateOne(
        { _id: user._id, passwordHash: user.passwordHash },
        { $set: await hashPassword(input.password) },
      );
    }
    const csrfToken = await auth.createSession(
      user._id,
      response,
      request.cookies?.[auth.cookieName],
      user.sessionVersion ?? 0,
    );
    response.json({
      ok: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role ?? "customer",
      },
      csrfToken,
    });
  });
  router.get("/me", (request, response) => {
    const identity = response.locals.auth as AuthIdentity | undefined;
    response.set("Cache-Control", "no-store");
    response.json(
      identity
        ? {
            user: {
              id: identity.userId,
              name: identity.name,
              email: identity.email,
              role: identity.role,
            },
            csrfToken: identity.csrfToken,
          }
        : { user: null, csrfToken: null },
    );
  });
  router.post("/logout", async (request, response) => {
    await auth.logout(request, response);
    response.json({ ok: true });
  });
  router.post("/logout-all", auth.requireUser, async (_request, response) => {
    await models.users.db.transaction(async (session) => {
      await models.users.updateOne(
        { _id: response.locals.auth.userId },
        { $inc: { sessionVersion: 1 } },
        { session },
      );
      await models.sessions.deleteMany(
        { userId: response.locals.auth.userId },
        { session },
      );
    });
    response.clearCookie(auth.cookieName, {
      path: "/",
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
    });
    response.json({ ok: true });
  });
  router.post(
    "/password",
    auth.requireUser,
    limit,
    async (request, response) => {
      const input = z
        .object({
          currentPassword: z.string().min(1).max(200),
          newPassword: z.string().min(12).max(200),
        })
        .strict()
        .parse(request.body);
      const user = await models.users
        .findById(response.locals.auth.userId)
        .select("+passwordHash +passwordSalt")
        .lean();
      if (
        !user ||
        !(await verifyPassword(
          input.currentPassword,
          user.passwordSalt,
          user.passwordHash,
          user.passwordVersion ?? 1,
        ))
      ) {
        throw new HttpError(
          401,
          "INVALID_CREDENTIALS",
          "Неверный текущий пароль",
        );
      }
      const password = await hashPassword(input.newPassword);
      await models.users.db.transaction(async (session) => {
        const result = await models.users.updateOne(
          { _id: user._id, passwordHash: user.passwordHash },
          { $set: password, $inc: { sessionVersion: 1 } },
          { session },
        );
        if (!result.modifiedCount)
          throw new HttpError(
            409,
            "PASSWORD_CHANGED",
            "Пароль уже изменён, войдите заново",
          );
        await models.sessions.deleteMany({ userId: user._id }, { session });
      });
      const csrfToken = await auth.createSession(
        user._id,
        response,
        undefined,
        (user.sessionVersion ?? 0) + 1,
      );
      response.json({ ok: true, csrfToken });
    },
  );
  return router;
}
