import { z } from "zod";
import { readConfig } from "../src/config/env.js";
import {
  connectDatabase,
  verifyReadiness,
} from "../src/database/connection.js";
import { createModels } from "../src/models/index.js";
import { hashPassword } from "../src/modules/auth/password.js";
import { reportFailure } from "./database.js";

async function main() {
  const input = z
    .object({
      ADMIN_EMAIL: z
        .string()
        .email()
        .max(200)
        .transform((v) => v.toLowerCase()),
      ADMIN_NAME: z.string().trim().min(1).max(120),
      ADMIN_PASSWORD: z.string().min(12).max(200),
    })
    .safeParse(process.env);
  if (!input.success)
    throw new Error(
      "Set ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD (12–200 characters) in the process environment",
    );
  const connection = await connectDatabase(readConfig());
  try {
    await verifyReadiness(connection);
    const models = createModels(connection);
    const {
      ADMIN_EMAIL: email,
      ADMIN_NAME: name,
      ADMIN_PASSWORD: password,
    } = input.data;
    if (await models.users.exists({ email }))
      throw new Error(
        "User already exists; admin creation does not overwrite accounts",
      );
    const user = await models.users.create({
      email,
      name,
      ...(await hashPassword(password)),
      role: "admin",
      status: "active",
    });
    console.log(`Created administrator ${user._id}`);
  } finally {
    await connection.close();
  }
}
main().catch(reportFailure);
