import type { AcademyProgram } from "./types";
import { loadContent } from "../api";

export async function getAcademyPrograms(): Promise<AcademyProgram[]> {
  return loadContent<AcademyProgram>("academyPrograms");
}
