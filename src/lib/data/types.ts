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
  specialties?: string[];
  education?: string[];
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

export interface TreatmentCase {
  id: string;
  slug: string;
  title: string;
  category:
    | "veneers"
    | "braces"
    | "implantation"
    | "restoration"
    | "orthodontics";
  shortDescription: string;
  beforeImage: string;
  afterImage: string;
  disclaimer: string;
}

export interface EquipmentItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  patientBenefit: string;
  image: string;
}

export interface PatientReview {
  id: string;
  authorName: string;
  source: "google" | "yandex" | "2gis" | "instagram" | "whatsapp" | "video";
  rating?: number;
  text?: string;
  videoUrl?: string;
  videoPoster?: string;
  publishedAt?: string;
  branch?: string;
  sourceUrl?: string;
}

export interface ConcernItem {
  id: string;
  title: string;
  serviceHref: string;
  shortDescription?: string;
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

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  qualification?: string;
  experienceYears?: string;
  bio: string[];
  image?: string;
  imagePosition?: string;
  education: string[];
  specialties: string[];
  training?: string[];
  highlights?: string[];
  commonQuestions?: string[];
  branches?: ("Айни" | "Молодёжный")[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  priceFrom: string;
  duration?: string;
  details?: string[];
  image: string;
  imagePosition?: string;
  mobileImagePosition?: string;
}

export interface PricingItem {
  id: string;
  category: string;
  name: string;
  price: string;
  description?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
