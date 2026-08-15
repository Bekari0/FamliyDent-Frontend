import { useMemo, useState } from "react";
import { EditorialPageHero } from "@/components/shared/editorial-page-hero";
import { TeamCategoryNav, getVisibleTeamCategories } from "@/components/team/team-category-nav";
import { TeamMemberCard } from "@/components/team/team-member-card";
import { teamMembers } from "@/lib/reference-content/team";
import type { TeamCategory } from "@/lib/reference-content/types";

export function PeoplePage() {
  const [category, setCategory] = useState<TeamCategory | "all">("all");
  const visible = useMemo(() => {
    const categories = getVisibleTeamCategories(category);
    return teamMembers.filter((member) => categories.includes(member.category));
  }, [category]);

  return <main className="min-h-screen bg-paper">
    <EditorialPageHero badge="Команда Family Dent" title="Люди, которым вы доверяете улыбку" description="Врачи, медицинские сёстры, администраторы и специалисты клиники работают как единая команда." />
    <section className="mx-auto max-w-7xl px-5 pb-20">
      <TeamCategoryNav activeCategory={category} onSelectCategory={setCategory} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map((member) => <TeamMemberCard key={member.id} member={member} />)}</div>
    </section>
  </main>;
}
