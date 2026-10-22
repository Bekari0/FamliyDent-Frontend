import { Container, Heading, Reveal, RevealGroup, Text } from "@/ui-kit";
import { useEffect, useMemo, useState } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { DoctorCard } from "../components/team/doctor-card";
import { DoctorProfileDialog } from "../components/team/doctor-profile-dialog";
import { getDoctors } from "../lib/data/doctors";
import type { Doctor } from "../lib/data/types";

interface DoctorsPageProps {
  onOpenBooking: (doctorName?: string) => void;
}

const specialtyFilters = [
  { value: "all", label: "Все направления", terms: [] },
  {
    value: "therapy",
    label: "Терапия",
    terms: ["терапевт", "эндодонт", "лечение кариеса"],
  },
  {
    value: "surgery",
    label: "Хирургия и имплантация",
    terms: ["хирург", "имплант"],
  },
  {
    value: "orthopedics",
    label: "Ортопедия",
    terms: ["ортопед", "протезирование"],
  },
  {
    value: "orthodontics",
    label: "Ортодонтия",
    terms: ["ортодонт", "гнатолог"],
  },
  { value: "pediatric", label: "Детская стоматология", terms: ["детский"] },
  { value: "hygiene", label: "Гигиена", terms: ["гигиен"] },
] as const;

export function DoctorsPage({ onOpenBooking }: DoctorsPageProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialty, setSpecialty] = useState("all");
  const [branch, setBranch] = useState("all");
  const filteredDoctors = useMemo(() => {
    const selectedSpecialty = specialtyFilters.find(
      (item) => item.value === specialty,
    );
    return doctors.filter((doctor) => {
      const searchable =
        `${doctor.specialty} ${doctor.specialties.join(" ")}`.toLocaleLowerCase(
          "ru",
        );
      const matchesSpecialty =
        !selectedSpecialty?.terms.length ||
        selectedSpecialty.terms.some((term) => searchable.includes(term));
      const matchesBranch =
        branch === "all" ||
        doctor.branches?.includes(branch as "Айни" | "Молодёжный");
      return matchesSpecialty && matchesBranch;
    });
  }, [branch, doctors, specialty]);
  useEffect(() => {
    document.title = "Врачи Family Dent — Стоматологи в Душанбе";
    void getDoctors().then(setDoctors);
  }, []);

  return (
    <div
      className="flex min-h-screen w-full flex-col bg-ink text-paper"
      data-ui-scheme="inverse"
    >
      <EditorialPageHero
        dark
        badge="Люди Family Dent"
        title="Врачи, которым доверяют улыбку"
        description="Познакомьтесь со специалистами клиники: опыт, образование и направления работы каждого врача собраны в подробном профиле."
      />

      <section
        className="w-full border-t border-paper/10 section-space"
        aria-labelledby="doctors-list-title"
      >
        <Container className="flex flex-col gap-10">
          <Reveal className="flex max-w-3xl flex-col gap-3">
            <Text variant="overline" className="uppercase text-accent-2">
              Команда клиники
            </Text>
            <Heading
              level={2}
              id="doctors-list-title"
              className="max-w-2xl text-balance"
            >
              Каждый профиль — открыто о подготовке и практике врача
            </Heading>
            <Text variant="body-sm" className="text-pretty text-paper/65">
              Выберите специалиста, чтобы узнать об образовании,
              профессиональной подготовке и направлениях приёма.
            </Text>
          </Reveal>

          <div
            className="grid gap-4 border-y border-paper/15 py-5 desktop:grid-cols-[minmax(0,1fr)_16rem]"
            aria-label="Фильтры врачей"
          >
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Фильтр по направлению"
            >
              {specialtyFilters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSpecialty(item.value)}
                  aria-pressed={specialty === item.value}
                  className="type-button min-h-11 rounded-pill border border-paper/35 px-4 text-paper transition-colors hover:border-paper/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper/70 aria-pressed:border-paper/90 aria-pressed:bg-paper aria-pressed:text-ink"
                  data-ui-scheme="default"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="type-overline flex min-w-0 flex-col gap-2 uppercase text-paper/65">
              Филиал
              <select
                value={branch}
                onChange={(event) => setBranch(event.target.value)}
                className="type-input min-h-11 rounded-lg border border-paper/35 bg-ink-2 px-3 normal-case text-paper transition-colors hover:border-paper/70 focus-visible:border-paper/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper/70"
              >
                <option value="all">Все филиалы</option>
                <option value="Айни">Айни</option>
                <option value="Молодёжный">Молодёжный</option>
              </select>
            </label>
          </div>

          <Text variant="body-sm" className="text-paper/65" role="status">
            Найдено специалистов: {filteredDoctors.length}
          </Text>

          {filteredDoctors.length > 0 ? (
            <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 desktop:grid-cols-3 xl:grid-cols-4">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onOpen={setSelectedDoctor}
                />
              ))}
            </RevealGroup>
          ) : (
            <Text
              variant="body"
              className="border-y border-paper/15 py-10 text-paper/70"
            >
              По выбранным фильтрам специалисты не найдены.
            </Text>
          )}
        </Container>
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
