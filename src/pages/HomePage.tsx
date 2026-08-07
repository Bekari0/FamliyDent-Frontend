import React, { useEffect } from "react";
import { HomeHero } from "../components/home/home-hero";
import { ClinicMetricsSection } from "../components/home/clinic-metrics-section";
import { FeaturedServicesSection } from "../components/home/featured-services-section";
import { FeaturedDoctorsSection } from "../components/home/featured-doctors-section";
import { TreatmentResultsSection } from "../components/home/treatment-results-section";
import { PatientReviewsSection } from "../components/home/patient-reviews-section";
import { HomeFaqSection } from "../components/home/home-faq-section";
import { BookingSection } from "../components/home/booking-section";

interface HomePageProps {
  onOpenBooking: (doctorName?: string) => void;
  onOpenAuth?: () => void;
}

export function HomePage({ onOpenBooking, onOpenAuth }: HomePageProps) {
  useEffect(() => {
    document.title = "Family Dent — Семейная стоматология в Душанбе";
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      {/* 1. HERO SECTION */}
      <HomeHero onOpenBooking={() => onOpenBooking()} onOpenAuth={onOpenAuth} />

      {/* 2. DYNAMIC CLINIC METRICS SECTION (2block reference layout) */}
      <ClinicMetricsSection />

      {/* 3. CLINIC SERVICES SECTION */}
      <FeaturedServicesSection onOpenBooking={() => onOpenBooking()} />

      {/* 4. DOCTORS SECTION */}
      <FeaturedDoctorsSection onOpenBooking={(doctor) => onOpenBooking(doctor)} />

      {/* 5. TREATMENT RESULTS "BEFORE / AFTER" SECTION */}
      <TreatmentResultsSection />

      {/* 6. PATIENT REVIEWS SECTION */}
      <PatientReviewsSection />

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION */}
      <HomeFaqSection />

      {/* 8. BOOKING SECTION (`/#booking`) */}
      <BookingSection onOpenBookingModal={() => onOpenBooking()} />
    </div>
  );
}
