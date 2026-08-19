import { useEffect, useRef } from "react";
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

  const initials = doctor.name.split(" ").slice(0, 2).map((part) => part[0]).join("");
  return (
    <div className="flex h-full w-full items-center justify-center bg-ink-2" role="img" aria-label={`Фотография врача ${doctor.name} пока не опубликована`}>
      <span className="font-display text-7xl font-semibold text-paper/35" aria-hidden="true">{initials}</span>
    </div>
  );
}

export function DoctorProfileDialog({ doctor, onClose, onBook }: DoctorProfileDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (doctor && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!doctor && dialog.open) {
      dialog.close();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [doctor]);

  if (!doctor) return null;

  const handleClose = () => {
    document.body.style.overflow = "";
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onCancel={(event) => {
        event.preventDefault();
        dialogRef.current?.close();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
      aria-labelledby="doctor-profile-title"
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-6xl overflow-hidden rounded-xl border border-rule bg-surface p-0 text-ink shadow-card backdrop:bg-ink/75 backdrop:backdrop-blur-sm open:animate-[dialog-in_var(--dur-long)_var(--ease-out)]"
    >
      <div className="grid h-[calc(100dvh-1.5rem)] grid-rows-[16rem_minmax(0,1fr)] md:grid-cols-[minmax(17rem,0.82fr)_minmax(0,1.18fr)] md:grid-rows-1">
        <div className="relative overflow-hidden bg-ink">
          <ProfilePortrait doctor={doctor} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 pt-16 md:hidden">
            <p className="font-mono text-xs text-accent-2">{doctor.specialty}</p>
          </div>
        </div>

        <div className="overflow-y-auto overscroll-contain">
          <div className="flex min-h-full flex-col gap-8 p-6 sm:p-8 lg:p-10">
            <header className="flex flex-col gap-3 border-b border-rule pb-6 pr-12">
              <p className="hidden font-mono text-xs leading-relaxed tracking-wide text-trust md:block">{doctor.specialty}</p>
              <h2 id="doctor-profile-title" className="text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl">
                {doctor.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                {doctor.qualification && <span className="rounded-pill bg-trust-soft px-3 py-1 text-xs font-semibold text-trust">{doctor.qualification}</span>}
                {doctor.experienceYears && <span className="rounded-pill bg-paper-3 px-3 py-1 text-xs font-semibold text-ink-2">Стаж: {doctor.experienceYears}</span>}
              </div>
            </header>

            <section className="flex flex-col gap-3" aria-labelledby="about-doctor">
              <h3 id="about-doctor" className="font-display text-xl font-semibold">О враче</h3>
              {doctor.bio.map((paragraph) => <p key={paragraph} className="text-pretty text-sm leading-relaxed text-muted sm:text-base">{paragraph}</p>)}
            </section>

            <section className="flex flex-col gap-4" aria-labelledby="doctor-specialties">
              <h3 id="doctor-specialties" className="flex items-center gap-2 font-display text-xl font-semibold">
                <Stethoscope className="h-5 w-5 text-trust" aria-hidden="true" /> Основные направления
              </h3>
              <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {doctor.specialties.map((item) => <li key={item} className="border-t border-rule pt-2 text-sm leading-relaxed text-ink-2">{item}</li>)}
              </ul>
            </section>

            {doctor.education.length > 0 && (
              <section className="flex flex-col gap-4" aria-labelledby="doctor-education">
                <h3 id="doctor-education" className="flex items-center gap-2 font-display text-xl font-semibold">
                  <GraduationCap className="h-5 w-5 text-trust" aria-hidden="true" /> Образование
                </h3>
                <ul className="flex flex-col gap-2">{doctor.education.map((item) => <li key={item} className="text-sm leading-relaxed text-muted">{item}</li>)}</ul>
              </section>
            )}

            {doctor.training && doctor.training.length > 0 && (
              <section className="flex flex-col gap-4" aria-labelledby="doctor-training">
                <h3 id="doctor-training" className="font-display text-xl font-semibold">Повышение квалификации</h3>
                <ul className="flex flex-col gap-2">{doctor.training.map((item) => <li key={item} className="border-l-2 border-accent pl-3 text-sm leading-relaxed text-muted">{item}</li>)}</ul>
              </section>
            )}

            {doctor.commonQuestions && doctor.commonQuestions.length > 0 && (
              <section className="flex flex-col gap-4" aria-labelledby="doctor-questions">
                <h3 id="doctor-questions" className="font-display text-xl font-semibold">С какими вопросами обращаются</h3>
                <ul className="flex flex-wrap gap-2">{doctor.commonQuestions.map((item) => <li key={item} className="rounded-md border border-rule bg-paper-2 px-3 py-2 text-xs leading-relaxed text-ink-2">{item}</li>)}</ul>
              </section>
            )}

            <button
              type="button"
              onClick={() => {
                dialogRef.current?.close();
                onBook(doctor.name);
              }}
              className="mt-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-pill bg-ink px-6 text-sm font-semibold text-paper transition duration-[var(--dur-short)] hover:bg-trust focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus sm:w-fit"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" /> Записаться к врачу
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        autoFocus
        onClick={() => dialogRef.current?.close()}
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-surface text-ink shadow-whisper transition hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        aria-label="Закрыть профиль врача"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </dialog>
  );
}
