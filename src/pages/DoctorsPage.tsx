import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { DoctorCard } from "../components/team/doctor-card";
import { DoctorProfileDialog } from "../components/team/doctor-profile-dialog";
import { doctorsData } from "../lib/data/doctors";
import type { Doctor } from "../lib/data/types";

interface DoctorsPageProps {
  onOpenBooking: (doctorName?: string) => void;
}

const specialtyFilters = [
  { value: "all", label: "Все направления", terms: [] },
  { value: "therapy", label: "Терапия", terms: ["терапевт", "эндодонт", "лечение кариеса"] },
  { value: "surgery", label: "Хирургия и имплантация", terms: ["хирург", "имплант"] },
  { value: "orthopedics", label: "Ортопедия", terms: ["ортопед", "протезирование"] },
  { value: "orthodontics", label: "Ортодонтия", terms: ["ортодонт", "гнатолог"] },
  { value: "pediatric", label: "Детская стоматология", terms: ["детский"] },
  { value: "hygiene", label: "Гигиена", terms: ["гигиен"] },
] as const;

export function DoctorsPage({ onOpenBooking }: DoctorsPageProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [specialty, setSpecialty] = useState("all");
  const [branch, setBranch] = useState("all");
  const filteredDoctors = useMemo(() => {
    const selectedSpecialty = specialtyFilters.find((item) => item.value === specialty);
    return doctorsData.filter((doctor) => {
      const searchable = `${doctor.specialty} ${doctor.specialties.join(" ")}`.toLocaleLowerCase("ru");
      const matchesSpecialty = !selectedSpecialty?.terms.length || selectedSpecialty.terms.some((term) => searchable.includes(term));
      const matchesBranch = branch === "all" || doctor.branches?.includes(branch as "Айни" | "Молодёжный");
      return matchesSpecialty && matchesBranch;
    });
  }, [branch, specialty]);
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
        <div className="page-container flex flex-col gap-10">
          <motion.div style={{ x: introX }} className="flex max-w-3xl flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-accent-2">Команда клиники</p>
            <h2 id="doctors-list-title" className="max-w-2xl text-balance font-display text-2xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-3xl lg:text-4xl">
              Каждый профиль — открыто о подготовке и практике врача
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-paper/65 sm:text-base">
              Выберите специалиста, чтобы узнать об образовании, профессиональной подготовке и направлениях приёма.
            </p>
          </motion.div>

          <div className="grid gap-4 border-y border-paper/15 py-5 lg:grid-cols-[minmax(0,1fr)_16rem]" aria-label="Фильтры врачей">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по направлению">
              {specialtyFilters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSpecialty(item.value)}
                  aria-pressed={specialty === item.value}
                  className="min-h-11 rounded-pill border border-paper/20 px-4 text-sm font-semibold text-paper transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-ink"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="flex min-w-0 flex-col gap-2 font-mono text-xs uppercase tracking-wider text-paper/65">
              Филиал
              <select value={branch} onChange={(event) => setBranch(event.target.value)} className="min-h-11 rounded-lg border border-paper/20 bg-ink-2 px-3 font-body text-sm normal-case tracking-normal text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                <option value="all">Все филиалы</option>
                <option value="Айни">Айни</option>
                <option value="Молодёжный">Молодёжный</option>
              </select>
            </label>
          </div>

          <p className="text-sm text-paper/65" role="status">Найдено специалистов: {filteredDoctors.length}</p>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDoctors.map((doctor, index) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={index} onOpen={setSelectedDoctor} />
              ))}
            </div>
          ) : (
            <p className="border-y border-paper/15 py-10 text-paper/70">По выбранным фильтрам специалисты не найдены.</p>
          )}
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
