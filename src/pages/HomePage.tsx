import { Hero } from '@/components/Hero';
import { ClinicMetricsSection } from '@/components/home/clinic-metrics-section';
import { Services } from '@/components/Services';
import { Doctors } from '@/components/Doctors';
import { TreatmentResultsSection } from '@/components/home/treatment-results-section';
import { Reviews } from '@/components/Reviews';
import { FAQ } from '@/components/FAQ';
import { Contact } from '@/components/Contact';

export function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper text-ink">
      <Hero />
      <ClinicMetricsSection />
      <Services />
      <Doctors />
      <TreatmentResultsSection />
      <Reviews />
      <FAQ />
      <Contact />
    </div>
  );
}
