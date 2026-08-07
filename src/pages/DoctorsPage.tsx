import React, { useEffect, useState } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { TeamMemberCard } from "../components/team/team-member-card";
import { getDoctors } from "../lib/data/doctors";
import type { Doctor, TeamMember } from "../lib/data/types";

interface DoctorsPageProps {
  onOpenBooking: (doctorName?: string) => void;
}

export function DoctorsPage({ onOpenBooking }: DoctorsPageProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    document.title = "Врачи Family Dent — Стоматологи в Душанбе";
    async function loadDoctors() {
      const data = await getDoctors();
      setDoctors(data);
    }
    loadDoctors();
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-ink text-paper">
      <EditorialPageHero
        dark
        badge="Врачи клиники"
        title="Наши врачи-стоматологи"
        description="Высококвалифицированные специалисты с международным опытом, регулярно проходившие стажировки в ведущих клиниках Европы и Азии."
      />

      <div className="max-w-7xl mx-auto px-5 my-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doc) => {
            const member: TeamMember = {
              id: doc.id,
              slug: doc.slug,
              name: doc.name,
              category: "doctors",
              position: doc.specialty,
              shortBio: doc.bio,
              image: doc.image,
              experienceYears: doc.experienceYears,
              specialties: doc.specialties,
              education: doc.education,
            };

            return (
              <TeamMemberCard
                key={doc.id}
                member={member}
                dark
                onBookClick={(name) => onOpenBooking(name)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
