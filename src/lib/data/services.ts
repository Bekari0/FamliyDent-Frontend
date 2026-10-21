import type { Service } from "./types";
import { loadContent } from "../api";

export async function getServices(): Promise<Service[]> {
  return loadContent<Service>("services");
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return (await getServices()).find((service) => service.slug === slug) ?? null;
}
