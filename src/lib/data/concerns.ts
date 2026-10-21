import type { ConcernItem } from "./types";
import { loadContent } from "../api";

export async function getConcernItems(): Promise<ConcernItem[]> {
  return loadContent<ConcernItem>("concerns");
}
