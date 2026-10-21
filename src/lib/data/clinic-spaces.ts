import type { ClinicSpace } from "./types";
import { loadContent } from "../api";

export async function getClinicSpaces(): Promise<ClinicSpace[]> {
  return loadContent<ClinicSpace>("clinicSpaces");
}
