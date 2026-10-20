const viteEnv = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string; DEV?: boolean } }).env;
const apiBaseUrl = (viteEnv?.VITE_API_URL || "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const payload = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) throw new ApiError(payload.error || "Ошибка запроса", response.status);
  return payload as T;
}

export async function getContent<T>(type: string): Promise<T[]> {
  const result = await request<{ data: T[] }>(`/api/content/${encodeURIComponent(type)}`);
  return result.data;
}

export async function getContentOrFallback<T>(type: string, fallback: T[]): Promise<T[]> {
  try {
    const content = await getContent<T>(type);
    return content.length > 0 ? content : fallback;
  } catch (error) {
    if (viteEnv?.DEV) {
      console.warn(`Using local fallback for ${type}`, error);
    }
    return fallback;
  }
}

export async function createBooking(payload: {
  name: string;
  phone: string;
  doctor?: string;
  service?: string;
  preferredDate?: string;
}): Promise<void> {
  await request("/api/bookings", { method: "POST", body: JSON.stringify(payload) });
}

export async function createTourismConsultation(payload: Record<string, string | undefined>): Promise<void> {
  await request("/api/tourism-consultations", { method: "POST", body: JSON.stringify(payload) });
}

export async function authenticate(payload: { mode: "login" | "register"; email: string; password: string; name?: string }): Promise<void> {
  await request(`/api/auth/${payload.mode}`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
