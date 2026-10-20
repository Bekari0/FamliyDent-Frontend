export class InputError extends Error {}

export function readString(
  body: Record<string, unknown>,
  field: string,
  options: { required?: boolean; max?: number } = {},
): string | undefined {
  const value = body[field];
  if (value == null || value === "") {
    if (options.required) throw new InputError(`Поле «${field}» обязательно`);
    return undefined;
  }
  if (typeof value !== "string") throw new InputError(`Поле «${field}» должно быть строкой`);
  const normalized = value.trim();
  if (options.required && !normalized) throw new InputError(`Поле «${field}» обязательно`);
  if (normalized.length > (options.max ?? 500)) throw new InputError(`Поле «${field}» слишком длинное`);
  return normalized;
}

export function requestIp(value: string | undefined): string | undefined {
  return value?.split(",")[0]?.trim().slice(0, 64);
}
