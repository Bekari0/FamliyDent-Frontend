export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin",
}

export interface UserProfile {
  uid: string;
  id?: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  photoURL?: string;
  doctorId?: string;
  gender?: string;
  birthDate?: string;
  isEmailVerified?: boolean;
  createdAt: number;
}

export interface Booking {
  id: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  description: string;
  education: string[];
  achievements: string[];
  rating: number;
  reviewsCount: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number; // в минутах
  icon?: string;
  longDescription?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId?: string;
  date: string;
  image: string;
  tags: string[];
  category?: string;
  status?: "draft" | "published";
  createdAt?: number;
  updatedAt?: number;
}

export interface Review {
  id: string;
  patientId: string;
  patientName?: string;
  author?: string; // используется в некоторых компонентах
  avatar?: string; // используется в некоторых компонентах
  doctorId: string;
  rating: number;
  comment: string;
  text?: string; // используется в некоторых компонентах
  date?: string;
  createdAt: number;
}

export interface Message {
  id?: string;
  chatId?: string;
  senderId?: string;
  role?: "user" | "model" | "system";
  content?: string;
  text?: string;
  createdAt?: number;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  procedureTitle: string;
  details: string;
  toothNumber?: string;
  price?: number;
  files?: string[];
  createdAt: number;
}

export interface MedicalCard {
  id: string;
  patientId: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  lastDentalCheckup?: number;
  notes?: string;
  updatedAt: number;
}

export interface Scan {
  id: string;
  patientId: string;
  doctorId: string;
  imageUrl: string;
  description: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  type: "x-ray" | "photo" | "panorama" | "pdf";
  createdAt: number;
}

export interface Recommendation {
  id: string;
  patientId: string;
  doctorId: string;
  content: string;
  nextVisitDate?: string;
  isCompleted: boolean;
  createdAt: number;
}
