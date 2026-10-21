import type { Doctor } from "./types";
import { loadContent } from "../api";

export async function getDoctors(): Promise<Doctor[]> {
  return loadContent<Doctor>("doctors");
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  return (await getDoctors()).find((doctor) => doctor.slug === slug) ?? null;
}
