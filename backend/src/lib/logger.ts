import pino from "pino";
export function createLogger(level = "info") {
  return pino({
    level,
    base: { service: "familydent-backend" },
    redact: {
      paths: [
        "password",
        "passwordHash",
        "passwordSalt",
        "token",
        "secret",
        "authorization",
        "cookie",
        "req.headers.authorization",
        "req.headers.cookie",
        "body",
      ],
      censor: "[REDACTED]",
    },
  });
}
