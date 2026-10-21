import { config as dotenv } from "dotenv";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { isIP } from "node:net";
import { ConfigurationError } from "../lib/errors.js";
import { assertWebsiteDatabase, DEFAULT_DATABASE } from "../database/schema.js";

export const backendRoot = fileURLToPath(new URL("../../", import.meta.url));
dotenv({ path: `${backendRoot}/.env`, quiet: true });

const boolean = z.enum(["true", "false"]).transform((v) => v === "true");
const settings = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(8787),
  HOST: z.string().default("0.0.0.0"),
  MONGODB_URI: z.string().min(1),
  MONGODB_DATABASE: z
    .string()
    .default(DEFAULT_DATABASE)
    .transform(assertWebsiteDatabase),
  APP_ORIGINS: z
    .string()
    .default("http://localhost:3000,http://127.0.0.1:3000"),
  TRUST_PROXY: z.string().default(""),
  SESSION_SECRET: z.string().min(32),
  SESSION_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  LOG_LEVEL: z
    .enum(["silent", "fatal", "error", "warn", "info", "debug"])
    .default("info"),
  SERVE_FRONTEND: boolean.default(false),
  FRONTEND_DIST: z.string().default("../dist"),
  WORKER_ENABLED: boolean.default(true),
  BOT_ENABLED: boolean.default(false),
  BOT_API_URL: z.string().default(""),
  BOT_API_TOKEN: z.string().default(""),
  BOT_SIGNING_SECRET: z.string().default(""),
  BOT_WEBHOOK_SECRET: z.string().default(""),
  BOT_TIMEOUT_MS: z.coerce.number().int().min(100).max(30_000).default(10_000),
  BOT_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(20).default(8),
  AI_PROVIDER: z
    .enum(["disabled", "openai-compatible", "ollama"])
    .default("disabled"),
  AI_BASE_URL: z.string().default(""),
  AI_API_KEY: z.string().default(""),
  AI_MODEL: z.string().max(200).default(""),
  AI_TIMEOUT_MS: z.coerce.number().int().min(100).max(60_000).default(20_000),
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().int().min(32).max(2048).default(512),
  AI_DAILY_REQUEST_LIMIT: z.coerce.number().int().min(1).max(1000).default(30),
  INTEGRATIONS_ALLOW_HTTP: boolean.default(false),
});

export function integrationUrl(value: string, allowHttp: boolean): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ConfigurationError("Invalid integration URL");
  }
  if (
    url.username ||
    url.password ||
    url.hash ||
    url.search ||
    !["https:", ...(allowHttp ? ["http:"] : [])].includes(url.protocol)
  ) {
    throw new ConfigurationError(
      "Integration URLs must use HTTPS, contain no credentials, query parameters, or fragments",
    );
  }
  return url;
}

export function readConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = settings.safeParse(env);
  if (!parsed.success)
    throw new ConfigurationError(
      `Invalid backend configuration: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`,
    );
  const value = parsed.data;
  const origins = value.APP_ORIGINS.split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  if (
    !origins.length ||
    origins.some((v) => {
      try {
        const u = new URL(v);
        return u.origin !== v || !["https:", "http:"].includes(u.protocol);
      } catch {
        return true;
      }
    })
  )
    throw new ConfigurationError("APP_ORIGINS must list exact HTTP(S) origins");
  if (
    value.NODE_ENV === "production" &&
    (origins.some((origin) => !origin.startsWith("https://")) ||
      /^(change|example|development)/i.test(value.SESSION_SECRET))
  ) {
    throw new ConfigurationError(
      "Production requires HTTPS origins and a unique SESSION_SECRET",
    );
  }
  if (/^(true|\d+)$/.test(value.TRUST_PROXY))
    throw new ConfigurationError(
      "TRUST_PROXY must specify trusted IPs/CIDRs, not a hop count or true",
    );
  if (
    value.TRUST_PROXY &&
    value.TRUST_PROXY.split(",").some((entry) => {
      const [address, mask, ...extra] = entry.trim().split("/");
      const family = isIP(address);
      return (
        !family ||
        extra.length > 0 ||
        (mask !== undefined &&
          (!/^\d+$/.test(mask) || Number(mask) > (family === 4 ? 32 : 128)))
      );
    })
  )
    throw new ConfigurationError("TRUST_PROXY must contain valid IPs or CIDRs");
  if (value.BOT_ENABLED) {
    integrationUrl(value.BOT_API_URL, value.INTEGRATIONS_ALLOW_HTTP);
    if (
      value.BOT_SIGNING_SECRET.length < 32 ||
      value.BOT_WEBHOOK_SECRET.length < 32
    )
      throw new ConfigurationError(
        "Enabled bot integration requires distinct signing and webhook secrets of at least 32 characters",
      );
    if (value.BOT_SIGNING_SECRET === value.BOT_WEBHOOK_SECRET)
      throw new ConfigurationError(
        "Use different secrets for outgoing bot requests and incoming webhooks",
      );
  }
  if (value.AI_PROVIDER !== "disabled") {
    integrationUrl(value.AI_BASE_URL, value.INTEGRATIONS_ALLOW_HTTP);
    if (!value.AI_MODEL)
      throw new ConfigurationError(
        "AI_MODEL is required when an AI provider is enabled",
      );
  }
  return { ...value, origins };
}

export type AppConfig = ReturnType<typeof readConfig>;

// Provisioning commands use these getters without requiring unrelated integration settings.
export const config = {
  get mongoUri() {
    if (!process.env.MONGODB_URI)
      throw new ConfigurationError("MONGODB_URI is required");
    return process.env.MONGODB_URI;
  },
  get databaseName() {
    return assertWebsiteDatabase(
      process.env.MONGODB_DATABASE || DEFAULT_DATABASE,
    );
  },
  get port() {
    return Number(process.env.PORT || 8787);
  },
};
