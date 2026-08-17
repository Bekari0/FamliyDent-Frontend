import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { doctorsData } from "../../lib/data/doctors";
import type { TeamMember } from "../../lib/data/types";
import { TeamMemberCard } from "../team/team-member-card";
import { ScrollAnimate, StaggerContainer, StaggerItem } from "../shared/scroll-animate";

interface FeaturedDoctorsSectionProps {
  onOpenBooking?: (doctorName?: string) => void;
}

const featuredDoctors = doctorsData.filter((doctor) => doctor.image).slice(0, 3);

export function FeaturedDoctorsSection({ onOpenBooking: _onOpenBooking }: FeaturedDoctorsSectionProps) {
  return (
    <section className="w-full bg-ink text-paper py-16 sm:py-20 px-5 sm:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <ScrollAnimate className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-accent tracking-wider mb-2 block font-mono">Врачи клиники</span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Врачи Family Dent</h2>
            <p className="text-xs sm:text-sm text-white/70 font-normal mt-1">Познакомьтесь с образованием, опытом и направлениями работы наших специалистов.</p>
          </div>
          <Link to="/doctors" className="inline-flex min-h-11 items-center gap-2 px-5 py-2.5 rounded-pill bg-white/10 text-white border border-white/20 text-xs font-bold hover:bg-white/20 transition-all self-start md:self-auto group shadow-whisper">
            <span>Все врачи</span>
            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollAnimate>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
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

            return <StaggerItem key={doctor.id} className="flex flex-col"><TeamMemberCard member={member} dark /></StaggerItem>;
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
