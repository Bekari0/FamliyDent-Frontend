import type { PricingItem } from "./types";
import { loadContent } from "../api";

export async function getPricingItems(): Promise<PricingItem[]> {
  return loadContent<PricingItem>("pricing");
}
