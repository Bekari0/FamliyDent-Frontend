const viteEnv = (
  import.meta as ImportMeta & { env?: { VITE_API_URL?: string; DEV?: boolean } }
).env;
const apiBaseUrl = (viteEnv?.VITE_API_URL || "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function sessionToken(): Promise<string | null> {
  const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok)
    throw new ApiError("Не удалось проверить сессию", response.status);
  const session = (await response.json()) as { csrfToken: string | null };
  return session.csrfToken;
}

function idempotencyKey(): string {
  return (
    crypto.randomUUID?.() ??
    Array.from(crypto.getRandomValues(new Uint8Array(16)), (v) =>
      v.toString(16).padStart(2, "0"),
    ).join("")
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const mutation =
    init?.method && !["GET", "HEAD", "OPTIONS"].includes(init.method);
  const token = mutation ? await sessionToken() : null;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(mutation ? { "Content-Type": "application/json" } : {}),
      ...(token ? { "X-CSRF-Token": token } : {}),
      ...init?.headers,
    },
  });
  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
  };
  if (!response.ok)
    throw new ApiError(payload.error || "Ошибка запроса", response.status);
  return payload as T;
}

export async function getContent<T>(type: string): Promise<T[]> {
  const result = await request<{ data: T[] }>(
    `/api/content/${encodeURIComponent(type)}`,
  );
  if (!Array.isArray(result.data))
    throw new ApiError("Некорректный ответ сервера", 502);
  return result.data;
}

// An empty published collection stays empty; failed requests never resurrect bootstrap content.
export async function loadContent<T>(type: string): Promise<T[]> {
  try {
    return await getContent<T>(type);
  } catch {
    if (typeof window !== "undefined")
      window.dispatchEvent(new Event("familydent:content-unavailable"));
    return [];
  }
}

export async function createBooking(payload: {
  name: string;
  phone: string;
  doctor?: string;
  service?: string;
  preferredDate?: string;
}): Promise<void> {
  await request("/api/bookings", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey() },
    body: JSON.stringify(payload),
  });
}

export async function createTourismConsultation(
  payload: Record<string, string | undefined>,
): Promise<void> {
  await request("/api/tourism-consultations", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey() },
    body: JSON.stringify(payload),
  });
}

export async function authenticate(payload: {
  mode: "login" | "register";
  email: string;
  password: string;
  name?: string;
}): Promise<void> {
  const { mode, ...credentials } = payload;
  await request(`/api/auth/${mode}`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(credentials),
  });
}
