import type { ClinicMetric } from "./types";
import { loadContent } from "../api";

export async function getClinicMetrics(): Promise<ClinicMetric[]> {
  return loadContent<ClinicMetric>("metrics");
}

export type { ClinicMetric } from "./types";
