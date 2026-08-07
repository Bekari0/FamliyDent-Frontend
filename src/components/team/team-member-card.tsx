import React from "react";
import { Award } from "lucide-react";
import type { TeamMember } from "../../lib/data/types";

interface TeamMemberCardProps {
  key?: React.Key;
  member: TeamMember;
  onBookClick?: (doctorName: string) => void;
  dark?: boolean;
}

export function TeamMemberCard({ member, dark = false }: TeamMemberCardProps) {
  return (
    <div
      className={`h-full rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 ${
        dark
          ? "bg-white/5 border border-white/10 shadow-xl hover:border-accent/40"
          : "bg-surface border border-rule shadow-card hover:border-accent/40"
      }`}
    >
      {/* Portrait Image Container with fixed uniform aspect ratio */}
      <div className={`relative aspect-[3/4] w-full shrink-0 overflow-hidden ${dark ? "bg-black/40" : "bg-paper"}`}>
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            dark
              ? "from-black/80 via-transparent to-transparent opacity-90"
              : "from-surface/80 via-transparent to-transparent opacity-80"
          }`}
        />

        {/* Experience badge if present */}
        {member.experienceYears && member.experienceYears !== "" && (
          <div
            className={`absolute top-3 right-3 backdrop-blur-md px-2.5 py-1 rounded-pill text-[11px] font-medium flex items-center gap-1 max-w-[90%] truncate shadow-md ${
              dark
                ? "bg-black/80 border border-white/15 text-accent-soft"
                : "bg-ink/75 border border-white/10 text-paper"
            }`}
          >
            <Award className="w-3 h-3 text-accent shrink-0" />
            <span className="truncate">
              {typeof member.experienceYears === "number"
                ? `Стаж ${member.experienceYears} лет`
                : String(member.experienceYears).toLowerCase().includes("лет") ||
                  String(member.experienceYears).toLowerCase().includes("года") ||
                  String(member.experienceYears).toLowerCase().includes("специализация") ||
                  String(member.experienceYears).toLowerCase().includes("стаж")
                ? member.experienceYears
                : `Стаж ${member.experienceYears}`}
            </span>
          </div>
        )}
      </div>

      {/* Info Content - Unified Padding & Flex Layout */}
      <div className="flex flex-1 flex-col p-6">
        <div className="space-y-1.5">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-accent font-mono block">
            {member.position}
          </span>
          <h3 className={`font-display text-base sm:text-lg font-bold leading-tight ${dark ? "text-white" : "text-ink"}`}>
            {member.name}
          </h3>
          {member.shortBio && (
            <p className={`text-xs sm:text-sm font-normal leading-relaxed line-clamp-3 sm:line-clamp-4 pt-1 ${dark ? "text-white/70" : "text-muted"}`}>
              {member.shortBio}
            </p>
          )}
        </div>

        {/* Specialties / Tags - Always anchored to bottom */}
        {member.specialties && member.specialties.length > 0 && (
          <div className="mt-auto pt-5 flex flex-wrap gap-2">
            {member.specialties.map((spec, i) => (
              <span
                key={i}
                className={`inline-flex items-center text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-md border ${
                  dark
                    ? "bg-white/10 border-white/10 text-white/90"
                    : "bg-accent/10 border-accent/20 text-accent"
                }`}
              >
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


