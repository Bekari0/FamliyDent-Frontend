import { setTimeout as delay } from "node:timers/promises";

export async function isApiReady(
  url: string,
  database: string,
  signal?: AbortSignal,
): Promise<boolean> {
  try {
    const response = await fetch(url, {
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(1_500)])
        : AbortSignal.timeout(1_500),
    });
    if (!response.ok) return false;
    const payload = await response.json();
    return (
      payload.ok === true &&
      payload.service === "familydent-backend" &&
      payload.database === database
    );
  } catch {
    return false;
  }
}

export async function waitForApi(
  url: string,
  database: string,
  options: {
    signal?: AbortSignal;
    timeoutMs?: number;
    intervalMs?: number;
  } = {},
): Promise<void> {
  const signal = AbortSignal.any([
    AbortSignal.timeout(options.timeoutMs ?? 30_000),
    ...(options.signal ? [options.signal] : []),
  ]);
  try {
    while (!signal.aborted) {
      if (await isApiReady(url, database, signal)) return;
      await delay(options.intervalMs ?? 250, undefined, { signal });
    }
  } catch {
    // The timeout and process shutdown share the same cleanup path below.
  }
  throw new Error(
    `API is not ready at ${url}. Check its startup output and MongoDB connection.`,
  );
}
