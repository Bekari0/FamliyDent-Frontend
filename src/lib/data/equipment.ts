import type { EquipmentItem } from "./types";
import { loadContent } from "../api";

export async function getEquipmentItems(): Promise<EquipmentItem[]> {
  return loadContent<EquipmentItem>("equipment");
}
