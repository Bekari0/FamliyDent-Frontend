import { createTourismConsultation } from "./api";

export type TourismConsultationPayload = {
  name: string;
  email: string;
  phone: string;
  telegram?: string;
  country: string;
  service: string;
  message?: string;
};

export type TourismConsultationResult =
  | { ok: true }
  | { ok: false; reason: "request-failed" };

/**
 * Persists consultation requests through the server; secrets never reach the browser.
 */
export async function submitTourismConsultation(
  payload: TourismConsultationPayload,
): Promise<TourismConsultationResult> {
  try {
    await createTourismConsultation(payload);
    return { ok: true };
  } catch {
    return { ok: false, reason: "request-failed" };
  }
}
