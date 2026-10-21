import { Container, Heading, Text } from "@/ui-kit";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctors } from "../../lib/data/doctors";
import type { TeamMember } from "../../lib/data/types";
import {
  ScrollAnimate,
  StaggerContainer,
  StaggerItem,
} from "../shared/scroll-animate";
import { TeamMemberCard } from "../team/team-member-card";

interface FeaturedDoctorsSectionProps {
  onOpenBooking?: (doctorName?: string) => void;
}

export function FeaturedDoctorsSection({
  onOpenBooking: _onOpenBooking,
}: FeaturedDoctorsSectionProps) {
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
      className="w-full border-b border-on-dark/10 bg-ink py-16 text-paper sm:py-20"
      data-ui-scheme="inverse"
    >
      <Container>
        <ScrollAnimate className="flex flex-col tablet:flex-row tablet:items-end justify-between mb-12 gap-4">
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
        </ScrollAnimate>

        <StaggerContainer className="grid grid-cols-1 tablet:grid-cols-3 gap-6 items-stretch">
          {featuredDoctors.map((doctor) => {
            const member: TeamMember = {
              id: doctor.id,
              slug: doctor.slug,
              name: doctor.name,
              category: "doctors",
              position: doctor.specialty,
              shortBio: doctor.bio[0],
              image: doctor.image!,
              experienceYears: doctor.experienceYears,
              specialties: doctor.specialties,
            };

            return (
              <StaggerItem key={doctor.id} className="flex flex-col">
                <TeamMemberCard member={member} dark />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}
