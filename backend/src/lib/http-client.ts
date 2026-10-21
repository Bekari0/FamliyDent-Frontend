import { HttpError } from "./errors.js";

export async function boundedJson(
  response: Response,
  maxBytes = 1_048_576,
): Promise<unknown> {
  if (Number(response.headers.get("content-length")) > maxBytes) {
    await response.body?.cancel();
    throw new HttpError(
      502,
      "UPSTREAM_TOO_LARGE",
      "Сервис вернул слишком большой ответ",
    );
  }
  if (!response.body)
    throw new HttpError(502, "UPSTREAM_EMPTY", "Сервис не вернул ответ");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes)
        throw new HttpError(
          502,
          "UPSTREAM_TOO_LARGE",
          "Сервис вернул слишком большой ответ",
        );
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } finally {
    await reader.cancel().catch(() => {});
  }
}
