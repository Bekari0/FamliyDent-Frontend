import { Camera } from "lucide-react";
import type { ClinicSpace } from "@/lib/data/types";

interface ClinicTourProps {
  spaces: ClinicSpace[];
  title?: string;
  subtitle?: string;
}

export function ClinicTour({
  spaces,
  title = "Фото клиники",
  subtitle = "Посмотрите, как мы организовали пространство для комфорта наших пациентов.",
}: ClinicTourProps) {
  if (spaces.length === 0) return null;

  return (
    <section className="w-full py-10 sm:py-14" aria-labelledby="clinic-tour-title">
      <div className="page-container mb-7 grid gap-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-end">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent">
            <Camera className="size-4" aria-hidden="true" />
            Family Dent
          </p>
          <h2 id="clinic-tour-title" className="text-balance font-display text-3xl font-semibold leading-none text-ink sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        </div>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted md:justify-self-end">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-paper sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5" aria-label="Фотографии интерьера Family Dent">
        {spaces.map((space, index) => (
          <figure key={space.id} className="group relative min-w-0 overflow-hidden bg-ink">
            <img
              src={space.image}
              alt={`Интерьер Family Dent, филиал «${space.title}», фотография ${index + 1}`}
              width={900}
              height={600}
              loading={index < 5 ? "eager" : "lazy"}
              decoding="async"
              className="aspect-[4/3] size-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]"
            />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-3 bg-ink/75 px-4 py-3 text-xs text-paper transition-transform duration-300 ease-out motion-safe:group-hover:translate-y-0 motion-reduce:translate-y-0">
              <span>Филиал «{space.title}»</span>
              <span className="font-mono text-paper/70">{String(index + 1).padStart(2, "0")}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
