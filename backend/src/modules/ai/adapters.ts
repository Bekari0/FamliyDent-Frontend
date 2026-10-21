import { z } from "zod";
import type { AppConfig } from "../../config/env.js";
import { boundedJson } from "../../lib/http-client.js";
import { HttpError } from "../../lib/errors.js";

export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
export async function completeChat(
  config: AppConfig,
  messages: AiMessage[],
  fetcher: typeof fetch = fetch,
): Promise<string> {
  if (config.AI_PROVIDER === "disabled")
    throw new HttpError(503, "AI_DISABLED", "Помощник пока не подключён");
  const base = config.AI_BASE_URL.replace(/\/$/, "");
  const ollama = config.AI_PROVIDER === "ollama";
  const endpoint = ollama ? `${base}/api/chat` : `${base}/chat/completions`;
  try {
    const response = await fetcher(endpoint, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(config.AI_TIMEOUT_MS),
      headers: {
        "Content-Type": "application/json",
        ...(config.AI_API_KEY
          ? { Authorization: `Bearer ${config.AI_API_KEY}` }
          : {}),
      },
      body: JSON.stringify(
        ollama
          ? {
              model: config.AI_MODEL,
              messages,
              stream: false,
              options: { num_predict: config.AI_MAX_OUTPUT_TOKENS },
            }
          : {
              model: config.AI_MODEL,
              messages,
              stream: false,
              max_tokens: config.AI_MAX_OUTPUT_TOKENS,
            },
      ),
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error("AI_UPSTREAM_ERROR");
    }
    const data = await boundedJson(response);
    const text = ollama
      ? z
          .object({
            message: z.object({ content: z.string().min(1).max(16_000) }),
          })
          .parse(data).message.content
      : z
          .object({
            choices: z
              .array(
                z.object({
                  message: z.object({ content: z.string().min(1).max(16_000) }),
                }),
              )
              .min(1),
          })
          .parse(data).choices[0].message.content;
    return text;
  } catch {
    throw new HttpError(
      502,
      "AI_UNAVAILABLE",
      "Помощник временно недоступен. Попробуйте позже",
    );
  }
}
