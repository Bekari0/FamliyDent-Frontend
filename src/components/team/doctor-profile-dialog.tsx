import { Dialog, Heading, Text } from "@/ui-kit";
import { Calendar, GraduationCap, Stethoscope, X } from "lucide-react";
import type { Doctor } from "../../lib/data/types";

interface DoctorProfileDialogProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (doctorName: string) => void;
}

function ProfilePortrait({ doctor }: { doctor: Doctor }) {
  if (doctor.image) {
    return (
      <img
        src={doctor.image}
        alt={`Врач ${doctor.name}`}
        className="h-full w-full object-cover"
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
    <div
      className="flex h-full w-full items-center justify-center bg-ink-2"
      role="img"
      aria-label={`Фотография врача ${doctor.name} пока не опубликована`}
    >
      <span className="type-display text-paper/35" aria-hidden="true">
        {initials}
      </span>
    </div>
  );
}

export function DoctorProfileDialog({
  doctor,
  onClose,
  onBook,
}: DoctorProfileDialogProps) {
  if (!doctor) return null;

  return (
    <Dialog
      label={doctor.name}
      onClose={onClose}
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-6xl overflow-hidden rounded-xl border border-rule bg-surface p-0 text-ink shadow-card backdrop:bg-ink/75 backdrop:backdrop-blur-sm open:animate-[dialog-in_var(--dur-long)_var(--ease-out)]"
    >
      <div className="grid h-[calc(100dvh-1.5rem)] grid-rows-[16rem_minmax(0,1fr)] tablet:grid-cols-[minmax(17rem,0.82fr)_minmax(0,1.18fr)] tablet:grid-rows-1">
        <div
          className="relative overflow-hidden bg-ink"
          data-ui-scheme="inverse"
        >
          <ProfilePortrait doctor={doctor} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 pt-16 tablet:hidden">
            <Text variant="overline" className="text-accent-2">
              {doctor.specialty}
            </Text>
          </div>
        </div>

        <div className="overflow-y-auto overscroll-contain">
          <div className="flex min-h-full flex-col gap-8 p-6 sm:p-8 desktop:p-10">
            <header className="flex flex-col gap-3 border-b border-rule pb-6 pr-12">
              <Text
                variant="overline"
                className="hidden text-trust tablet:block"
              >
                {doctor.specialty}
              </Text>
              <Heading
                level={2}
                variant="heading-3"
                id="doctor-profile-title"
                className="text-balance"
              >
                {doctor.name}
              </Heading>
              <div className="flex flex-wrap gap-2">
                {doctor.qualification && (
                  <span className="type-caption rounded-pill bg-trust-soft px-3 py-1 text-trust">
                    {doctor.qualification}
                  </span>
                )}
                {doctor.experienceYears && (
                  <span className="type-caption rounded-pill bg-paper-3 px-3 py-1 text-ink-2">
                    Стаж: {doctor.experienceYears}
                  </span>
                )}
              </div>
            </header>

            <section
              className="flex flex-col gap-3"
              aria-labelledby="about-doctor"
            >
              <Heading level={3} variant="heading-4" id="about-doctor">
                О враче
              </Heading>
              {doctor.bio.map((paragraph) => (
                <Text
                  variant="body-sm"
                  key={paragraph}
                  className="text-pretty text-muted"
                >
                  {paragraph}
                </Text>
              ))}
            </section>

            <section
              className="flex flex-col gap-4"
              aria-labelledby="doctor-specialties"
            >
              <Heading
                level={3}
                variant="heading-4"
                id="doctor-specialties"
                className="flex items-center gap-2"
              >
                <Stethoscope
                  className="h-5 w-5 text-trust"
                  aria-hidden="true"
                />{" "}
                Основные направления
              </Heading>
              <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {doctor.specialties.map((item) => (
                  <li
                    key={item}
                    className="type-body-sm border-t border-rule pt-2 text-ink-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {doctor.education.length > 0 && (
              <section
                className="flex flex-col gap-4"
                aria-labelledby="doctor-education"
              >
                <Heading
                  level={3}
                  variant="heading-4"
                  id="doctor-education"
                  className="flex items-center gap-2"
                >
                  <GraduationCap
                    className="h-5 w-5 text-trust"
                    aria-hidden="true"
                  />{" "}
                  Образование
                </Heading>
                <ul className="flex flex-col gap-2">
                  {doctor.education.map((item) => (
                    <li key={item} className="type-body-sm text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {doctor.training && doctor.training.length > 0 && (
              <section
                className="flex flex-col gap-4"
                aria-labelledby="doctor-training"
              >
                <Heading level={3} variant="heading-4" id="doctor-training">
                  Повышение квалификации
                </Heading>
                <ul className="flex flex-col gap-2">
                  {doctor.training.map((item) => (
                    <li
                      key={item}
                      className="type-body-sm border-l-2 border-accent pl-3 text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {doctor.commonQuestions && doctor.commonQuestions.length > 0 && (
              <section
                className="flex flex-col gap-4"
                aria-labelledby="doctor-questions"
              >
                <Heading level={3} variant="heading-4" id="doctor-questions">
                  С какими вопросами обращаются
                </Heading>
                <ul className="flex flex-wrap gap-2">
                  {doctor.commonQuestions.map((item) => (
                    <li
                      key={item}
                      className="type-caption rounded-md border border-rule bg-paper-2 px-3 py-2 text-ink-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <button
              type="button"
              onClick={() => onBook(doctor.name)}
              className="type-button mt-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-pill bg-ink px-6 text-paper transition duration-[var(--dur-short)] hover:bg-trust focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus sm:w-fit"
              data-ui-scheme="inverse"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" /> Записаться к
              врачу
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        autoFocus
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-surface text-ink shadow-whisper transition hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        aria-label="Закрыть профиль врача"
        data-ui-scheme="default"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </Dialog>
  );
}
