import { Container, Heading, Reveal, RevealGroup, Text } from "@/ui-kit";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctors } from "../../lib/data/doctors";
import type { Doctor } from "../../lib/data/types";
import { DoctorCard } from "../team/doctor-card";
import { DoctorProfileDialog } from "../team/doctor-profile-dialog";

interface FeaturedDoctorsSectionProps {
  onOpenBooking?: (doctorName?: string) => void;
}

export function FeaturedDoctorsSection({
  onOpenBooking,
}: FeaturedDoctorsSectionProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [featuredDoctors, setFeaturedDoctors] = useState<
    Awaited<ReturnType<typeof getDoctors>>
  >([]);
  useEffect(() => {
    void getDoctors().then((doctors) =>
      setFeaturedDoctors(doctors.filter((doctor) => doctor.image).slice(0, 3)),
    );
  }, []);

  return (
    <section
      className="w-full border-b border-on-dark/10 bg-ink section-space text-paper"
      data-ui-scheme="inverse"
    >
      <Container>
        <Reveal className="flex flex-col tablet:flex-row tablet:items-end justify-between section-heading-gap gap-4">
          <div>
            <span className="type-overline uppercase text-brand-text mb-2 block">
              Врачи клиники
            </span>
            <Heading level={2} className="text-on-dark">
              Врачи Family Dent
            </Heading>
            <Text variant="body-sm" className="text-on-dark/70 mt-1">
              Познакомьтесь с образованием, опытом и направлениями работы наших
              специалистов.
            </Text>
          </div>
          <Link
            to="/doctors"
            className="type-caption inline-flex min-h-11 items-center gap-2 px-5 py-2.5 rounded-pill bg-surface/10 text-on-dark border border-on-dark/20 hover:bg-surface/20 transition-all self-start tablet:self-auto group shadow-whisper"
          >
            <span>Все врачи</span>
            <ArrowRight className="w-4 h-4 text-brand-text group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 tablet:grid-cols-3 gap-6 items-stretch">
          {featuredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              headingLevel={3}
              onOpen={setSelectedDoctor}
            />
          ))}
        </RevealGroup>
      </Container>
      <DoctorProfileDialog
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onBook={(doctorName) => {
          setSelectedDoctor(null);
          onOpenBooking?.(doctorName);
        }}
      />
    </section>
  );
}
