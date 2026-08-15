import { ClinicTour } from "@/components/clinic/clinic-tour";
import { EditorialPageHero } from "@/components/shared/editorial-page-hero";
import { clinicSpaces } from "@/lib/reference-content/clinic-spaces";

export function ClinicTourPage() {
  return <main className="min-h-screen bg-paper"><EditorialPageHero badge="Экскурсия" title="Клиника изнутри" description="Посмотрите кабинеты, диагностические зоны и пространства Family Dent до первого визита." /><ClinicTour spaces={clinicSpaces} /></main>;
}
