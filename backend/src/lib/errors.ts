export class ConfigurationError extends Error {
  name = "ConfigurationError";
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export function mongoCode(error: unknown): number | undefined {
  return error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "number"
    ? error.code
    : undefined;
}
