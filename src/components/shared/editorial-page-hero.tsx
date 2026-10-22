import { Heading, Reveal, Text } from "@/ui-kit";

interface EditorialPageHeroProps {
  badge?: string;
  title: string;
  description: string;
  dark?: boolean;
  backgroundImage?: string;
}

export function EditorialPageHero({
  badge,
  title,
  description,
  dark = false,
  backgroundImage,
}: EditorialPageHeroProps) {
  const hasBackgroundImage = Boolean(backgroundImage);
  const isDark = dark || hasBackgroundImage;

  return (
    <section
      className={`relative w-full overflow-hidden pt-28 pb-12 text-center sm:pt-36 sm:pb-16 ${hasBackgroundImage ? "min-h-[25rem] sm:min-h-[30rem]" : ""}`}
    >
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 size-full object-cover"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-ink/60"
            aria-hidden="true"
            data-ui-scheme="inverse"
          />
        </>
      )}
      <Reveal className="page-container relative z-10 flex flex-col items-center">
        <div className="flex w-full max-w-4xl flex-col items-center">
          {badge && (
            <span
              className={`type-overline px-3.5 py-1 rounded-pill mb-4 uppercase whitespace-nowrap max-w-full overflow-hidden text-ellipsis ${
                isDark
                  ? "bg-surface/10 border border-on-dark/20 text-accent-soft"
                  : "bg-accent/15 border border-accent/25 text-brand-text"
              }`}
              data-ui-scheme={isDark ? "inverse" : "default"}
            >
              {badge}
            </span>
          )}
          <Heading
            level={1}
            className={`max-w-[22ch] text-balance mb-4 ${
              isDark ? "text-on-dark" : "text-ink"
            }`}
          >
            {title}
          </Heading>
          <Text
            variant="body"
            className={`text-pretty max-w-2xl ${
              isDark ? "text-on-dark/80" : "text-muted"
            }`}
          >
            {description}
          </Text>
        </div>
      </Reveal>
    </section>
  );
}
