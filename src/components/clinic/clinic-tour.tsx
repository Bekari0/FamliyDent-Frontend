import type { ClinicSpace } from "@/lib/data/types";
import { Container, Heading, Text } from "@/ui-kit";
import { Camera } from "lucide-react";

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
    <section
      className="w-full py-10 sm:py-14"
      aria-labelledby="clinic-tour-title"
    >
      <Container className="mb-7 grid gap-4 tablet:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] tablet:items-end">
        <div>
          <Text
            variant="overline"
            className="mb-3 inline-flex items-center gap-2 uppercase text-brand-text"
          >
            <Camera className="size-4" aria-hidden="true" />
            Family Dent
          </Text>
          <Heading
            level={2}
            id="clinic-tour-title"
            className="text-balance text-ink"
          >
            {title}
          </Heading>
        </div>
        <Text
          variant="body"
          className="max-w-2xl text-pretty text-muted tablet:justify-self-end"
        >
          {subtitle}
        </Text>
      </Container>

      <div
        className="grid grid-cols-2 gap-px bg-paper sm:grid-cols-3 desktop:grid-cols-4 2xl:grid-cols-5"
        aria-label="Фотографии интерьера Family Dent"
        data-ui-scheme="default"
      >
        {spaces.map((space, index) => (
          <figure
            key={space.id}
            className="group relative aspect-[4/3] min-w-0 overflow-hidden bg-ink"
            data-ui-scheme="inverse"
          >
            <img
              src={space.image}
              alt={`Интерьер Family Dent, филиал «${space.title}», фотография ${index + 1}`}
              width={900}
              height={600}
              loading={index < 5 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]"
            />
            <figcaption
              className="type-caption pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-3 bg-ink/75 px-4 py-3 text-paper transition-transform duration-300 ease-out motion-safe:group-hover:translate-y-0 motion-reduce:translate-y-0"
              data-ui-scheme="inverse"
            >
              <span>Филиал «{space.title}»</span>
              <span className="font-mono text-paper/70">
                {String(index + 1).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
