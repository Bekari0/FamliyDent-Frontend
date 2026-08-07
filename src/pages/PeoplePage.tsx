import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { TeamCategoryNav } from "../components/team/team-category-nav";
import { TeamMemberCard } from "../components/team/team-member-card";
import { getTeamMembers } from "../lib/data/team";
import type { TeamMember, TeamCategory } from "../lib/data/types";

interface PeoplePageProps {
  onOpenBooking: (doctorName?: string) => void;
}

const CATEGORY_NAMES: Record<TeamCategory, string> = {
  doctors: "Врачи",
  nurses: "Медсёстры",
  administrators: "Администраторы",
  management: "Руководство клиники",
  technical: "Техническая и хозяйственная служба",
};

export function PeoplePage({ onOpenBooking }: PeoplePageProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory | "all">("all");
  const location = useLocation();

  useEffect(() => {
    document.title = "Люди Family Dent — Команда клиники в Душанбе";
    async function loadTeam() {
      const data = await getTeamMembers();
      setTeamMembers(data);
    }
    loadTeam();
  }, []);

  // Handle hash scrolling (#nurses, #administrators, etc.)
  useEffect(() => {
    if (location.hash) {
      const cat = location.hash.replace("#", "") as TeamCategory;
      if (CATEGORY_NAMES[cat]) {
        setSelectedCategory(cat);
      }
    }
  }, [location.hash]);

  const categoriesToRender: TeamCategory[] =
    selectedCategory === "all"
      ? ["doctors", "nurses", "administrators", "management", "technical"]
      : [selectedCategory];

  return (
    <div className="w-full flex flex-col min-h-screen bg-ink text-paper">
      <EditorialPageHero
        dark
        badge="Команда клиники"
        title="Люди Family Dent"
        description="Профессионалы, создающие атмосферу искренней заботы, бескомпромиссного качества и цифровой точности на каждом этапе вашего лечения."
      />

      <div className="max-w-7xl mx-auto px-5 w-full">
        <TeamCategoryNav
          dark
          activeCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        <div className="flex flex-col gap-12 my-8">
          {categoriesToRender.map((category) => {
            const members = teamMembers.filter((m) => m.category === category);
            if (members.length === 0) return null;

            return (
              <section key={category} id={category} className="scroll-mt-24">
                <div className="mb-6 border-b border-white/10 pb-3 flex items-center justify-between">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                    <span>{CATEGORY_NAMES[category]}</span>
                  </h2>
                  <span className="text-xs text-white/60">{members.length} сотрудников</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {members.map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      dark
                      onBookClick={
                        member.category === "doctors"
                          ? (docName) => onOpenBooking(docName)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
