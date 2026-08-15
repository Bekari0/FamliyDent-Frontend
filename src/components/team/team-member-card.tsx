import { Award } from "lucide-react";
import type { TeamMember } from "@/lib/reference-content/types";

function formatExperience(experience: TeamMember["experienceYears"]): string | undefined {
  if (experience === undefined || experience === "") return undefined;
  if (typeof experience === "number") return `Стаж ${experience} лет`;
  const normalized = experience.toLocaleLowerCase("ru");
  return ["лет", "года", "стаж", "специализация"].some((word) => normalized.includes(word)) ? experience : `Стаж ${experience}`;
}

export function TeamMemberCard({ member, dark = false }: { member: TeamMember; dark?: boolean }) {
  const experience = formatExperience(member.experienceYears);
  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-colors motion-reduce:transition-none ${dark ? "border-white/10 bg-white/5 shadow-xl hover:border-accent/40" : "border-rule bg-surface shadow-card hover:border-accent/40"}`}>
      <div className={`relative aspect-[3/4] w-full shrink-0 overflow-hidden ${dark ? "bg-black/40" : "bg-paper"}`}>
        <img src={member.image} alt={`Портрет: ${member.name}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105 motion-reduce:group-hover:scale-100" />
        {experience && <span className={`absolute right-3 top-3 flex max-w-[90%] items-center gap-1 truncate rounded-pill px-2.5 py-1 text-[11px] font-medium shadow-md ${dark ? "border border-white/15 bg-black/80 text-accent-soft" : "border border-white/10 bg-ink/75 text-paper"}`}><Award aria-hidden="true" className="h-3 w-3 shrink-0 text-accent" />{experience}</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent sm:text-[11px]">{member.position}</span>
        <h2 className={`mt-1.5 font-display text-base font-bold leading-tight sm:text-lg ${dark ? "text-white" : "text-ink"}`}>{member.name}</h2>
        <p className={`mt-2 text-xs leading-relaxed sm:text-sm ${dark ? "text-white/70" : "text-editorial-muted"}`}>{member.shortBio}</p>
        {member.specialties && member.specialties.length > 0 && <ul className="mt-auto flex flex-wrap gap-2 pt-5" aria-label="Специализации">{member.specialties.map((specialty) => <li key={specialty} className={`rounded-md border px-2.5 py-1 text-[10px] font-medium sm:text-[11px] ${dark ? "border-white/10 bg-white/10 text-white/90" : "border-accent/20 bg-accent/10 text-accent"}`}>{specialty}</li>)}</ul>}
      </div>
    </article>
  );
}
