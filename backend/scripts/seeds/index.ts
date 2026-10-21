import { getAcademyPrograms } from "./academy.js";
import { getBlogPosts } from "./blog.js";
import { getClinicSpaces } from "./clinic-spaces.js";
import { getConcernItems } from "./concerns.js";
import { getDoctors } from "./doctors.js";
import { getEquipmentItems } from "./equipment.js";
import { getFaqItems } from "./faq.js";
import { getClinicMetrics } from "./metrics.js";
import { getPatientReviews } from "./patient-reviews.js";
import { getPricingItems } from "./pricing.js";
import { getServices } from "./services.js";
import { getTeamMembers } from "./team.js";
import {
  getTourismFeatures,
  tourismComparison,
  tourismPackages,
  tourismPlaces,
  tourismRoadmap,
} from "./tourism.js";
import { getTreatmentCases } from "./treatment-cases.js";

export async function loadSeedContent(): Promise<Record<string, readonly Record<string, unknown>[]>> {
  return {
    doctors: await getDoctors() as unknown as Record<string, unknown>[],
    services: await getServices() as unknown as Record<string, unknown>[],
    reviews: await getPatientReviews() as unknown as Record<string, unknown>[],
    blogPosts: await getBlogPosts() as unknown as Record<string, unknown>[],
    clinicSpaces: await getClinicSpaces() as unknown as Record<string, unknown>[],
    concerns: await getConcernItems() as unknown as Record<string, unknown>[],
    equipment: await getEquipmentItems() as unknown as Record<string, unknown>[],
    faq: await getFaqItems() as unknown as Record<string, unknown>[],
    metrics: await getClinicMetrics() as unknown as Record<string, unknown>[],
    pricing: await getPricingItems() as unknown as Record<string, unknown>[],
    team: await getTeamMembers() as unknown as Record<string, unknown>[],
    treatmentCases: await getTreatmentCases() as unknown as Record<string, unknown>[],
    academyPrograms: await getAcademyPrograms() as unknown as Record<string, unknown>[],
    tourismFeatures: await getTourismFeatures() as unknown as Record<string, unknown>[],
    tourismRoadmap,
    tourismComparison,
    tourismPackages,
    tourismPlaces,
  };
}
