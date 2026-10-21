import type { TreatmentCase } from "./types";
import { loadContent } from "../api";

export async function getTreatmentCases(): Promise<TreatmentCase[]> {
  return loadContent<TreatmentCase>("treatmentCases");
}

export async function getTreatmentCasesByCategory(category: string): Promise<TreatmentCase[]> {
  return (await getTreatmentCases()).filter((item) => item.category === category);
}
