import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { DoctorCard } from "../components/team/doctor-card";
import { DoctorProfileDialog } from "../components/team/doctor-profile-dialog";
import { doctorsData } from "../lib/data/doctors";
import type { Doctor } from "../lib/data/types";

interface DoctorsPageProps {
  onOpenBooking: (doctorName?: string) => void;
}

export function DoctorsPage({ onOpenBooking }: DoctorsPageProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const introX = useTransform(scrollYProgress, [0, 0.28], reduceMotion ? [0, 0] : [0, 56]);

  useEffect(() => {
    document.title = "Врачи Family Dent — Стоматологи в Душанбе";
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-ink text-paper">
      <EditorialPageHero
        dark
        badge="Люди Family Dent"
        title="Врачи, которым доверяют улыбку"
        description="Познакомьтесь со специалистами клиники: опыт, образование и направления работы каждого врача собраны в подробном профиле."
      />

      <section className="w-full border-t border-paper/10 py-12 sm:py-16 lg:py-20" aria-labelledby="doctors-list-title">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 sm:px-6 lg:px-8">
          <motion.div style={{ x: introX }} className="flex max-w-3xl flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-accent-2">Команда клиники</p>
            <h1 id="doctors-list-title" className="text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Каждый профиль — открыто о подготовке и практике врача
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-paper/65 sm:text-base">
              Выберите специалиста, чтобы узнать об образовании, профессиональной подготовке и направлениях приёма.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {doctorsData.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} onOpen={setSelectedDoctor} />
            ))}
          </div>
        </div>
      </section>

      <DoctorProfileDialog
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onBook={(doctorName) => {
          setSelectedDoctor(null);
          onOpenBooking(doctorName);
        }}
      />
    </div>
  );
}
