import { Button, Container, Heading, Reveal, Text } from "@/ui-kit";
import { BackgroundVideo } from "../BackgroundVideo";
import { CentralLogo } from "../CentralLogo";

interface HomeHeroProps {
  onOpenBooking: () => void;
  onOpenAuth?: () => void;
}

export function HomeHero({ onOpenBooking }: HomeHeroProps) {
  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "auto" });
    } else {
      onOpenBooking();
    }
  };

  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-ink pt-24 pb-14 text-on-dark sm:pb-16"
      data-ui-scheme="inverse"
    >
      {/* Background ambient video / lighting */}
      <BackgroundVideo />

      {/* Main Hero Layout matching image.png */}
      <Container className="relative z-10 my-auto grid grid-cols-1 items-center gap-8 desktop:grid-cols-12 desktop:gap-6 xl:gap-8">
        {/* Left Column: Title & Subtitle */}
        <Reveal className="desktop:col-span-4 flex flex-col items-start text-left">
          <Heading level={1} variant="hero" className="text-on-dark">
            Современная
            <br />
            стоматология
            <br />
            для всей семьи
            <br />
          </Heading>

          <Text variant="body-sm" className="mt-6 text-on-dark/70 max-w-sm">
            От первого молочного зуба до сложной имплантации — бережно, точно и
            без спешки.
          </Text>
        </Reveal>

        {/* Center Column: Glowing Tooth Emblem */}
        <div className="desktop:col-span-4 flex items-center justify-center py-4 desktop:py-0 relative overflow-visible">
          <CentralLogo colorMode="glowing-white" />
        </div>

        {/* Right Column: Title & Action Buttons */}
        <Reveal className="desktop:col-span-4 flex flex-col items-start desktop:items-start text-left w-full min-w-0">
          <Heading level={2} className="text-on-dark mb-6 w-full max-w-full">
            <span className="block">Без боли.</span>
            <span className="block">Без спешки.</span>
            <span className="block">Без компромиссов.</span>
          </Heading>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" onClick={scrollToBooking}>
              Записаться
            </Button>
          </div>
        </Reveal>
      </Container>

      {/* Large Bottom Background Watermark positioned at bottom border */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 translate-y-[0.12em] overflow-hidden px-4 text-center z-10 select-none pointer-events-none"
      >
        <span className="type-wordmark block text-on-dark/10 uppercase whitespace-nowrap">
          FAMILY DENT<span className="hidden sm:inline"> • ДУШАНБЕ</span>
        </span>
      </div>
    </section>
  );
}
