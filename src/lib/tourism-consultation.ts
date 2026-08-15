export type TourismConsultationPayload = {
  name: string;
  contact: string;
  country: string;
  service: string;
  message?: string;
};

export type TourismConsultationResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" };

/**
 * Integration point for the future server-side Telegram endpoint.
 * Never place Telegram bot credentials in this client module.
 */
export async function submitTourismConsultation(
  _payload: TourismConsultationPayload,
): Promise<TourismConsultationResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 450));
  return { ok: false, reason: "not-configured" };
}
