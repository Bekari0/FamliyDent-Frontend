import { ArrowUpRight, Award } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Doctor } from "../../lib/data/types";

interface DoctorCardProps {
  doctor: Doctor;
  onOpen: (doctor: Doctor) => void;
  index: number;
}

function DoctorPortrait({ doctor }: { doctor: Doctor }) {
  if (doctor.image) {
    return (
      <img
        src={doctor.image}
        alt={`Врач ${doctor.name}`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[var(--dur-long)] ease-out group-hover:scale-[1.035]"
        style={{ objectPosition: doctor.imagePosition ?? "center top" }}
      />
    );
  }

  const initials = doctor.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div className="flex h-full w-full items-center justify-center bg-ink-2" aria-hidden="true">
      <span className="font-display text-5xl font-semibold tracking-tight text-paper/35">{initials}</span>
    </div>
  );
}

export function DoctorCard({ doctor, onOpen, index }: DoctorCardProps) {
  const reduceMotion = useReducedMotion();
  const fact = doctor.experienceYears ?? doctor.qualification ?? doctor.highlights?.[0];

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.6, delay: Math.min(index % 4, 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-paper/15 bg-paper/[0.06] transition duration-[var(--dur-long)] hover:-translate-y-1 hover:border-accent/60 focus-within:border-accent"
    >
      <div className="aspect-[4/5] w-full shrink-0 overflow-hidden bg-ink-2">
        <DoctorPortrait doctor={doctor} />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs leading-relaxed tracking-wide text-accent-2">{doctor.specialty}</p>
          <h2 className="text-pretty font-display text-xl font-semibold leading-tight text-paper">{doctor.name}</h2>
        </div>
        {fact && (
          <p className="flex items-start gap-2 text-sm leading-relaxed text-paper/65">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{fact}</span>
          </p>
        )}
        <span className="mt-auto inline-flex items-center justify-between border-t border-paper/10 pt-4 text-sm font-semibold text-paper">
          Подробнее
          <ArrowUpRight className="h-4 w-4 transition-transform duration-[var(--dur-short)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
      <button
        type="button"
        onClick={() => onOpen(doctor)}
        className="absolute inset-0 cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
        aria-label={`Подробнее о враче ${doctor.name}`}
      />
    </motion.article>
  );
}
