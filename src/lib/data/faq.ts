import type { FaqItem } from "./types";
import { loadContent } from "../api";

export async function getFaqItems(): Promise<FaqItem[]> {
  return loadContent<FaqItem>("faq");
}
