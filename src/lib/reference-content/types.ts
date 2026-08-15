export interface ClinicMetric {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description?: string;
}

export interface TreatmentCase {
  id: string;
  slug: string;
  title: string;
  category: 'veneers' | 'braces' | 'implantation' | 'restoration' | 'orthodontics';
  shortDescription: string;
  beforeImage: string;
  afterImage: string;
  disclaimer: string;
}

export type TeamCategory =
  | "doctors"
  | "nurses"
  | "administrators"
  | "management"
  | "technical";

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  category: TeamCategory;
  position: string;
  shortBio: string;
  image: string;
  experienceYears?: number | string;
  specialties?: readonly string[];
  education?: readonly string[];
}

export interface ClinicSpace {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  order: number;
  panoramaUrl?: string;
}

export interface EquipmentItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  patientBenefit: string;
  image: string;
}

export interface TourismFeature {
  id: string;
  title: string;
  description: string;
}

export interface AcademyProgram {
  id: string;
  title: string;
  description: string;
}
