import { Button, Container, Heading, Reveal, Text } from "@/ui-kit";
import { BackgroundVideo } from "../BackgroundVideo";
import { CentralLogo } from "../CentralLogo";
import "./home-hero.css";

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
      className="home-hero relative flex w-full flex-col justify-center overflow-hidden bg-ink text-on-dark"
      data-ui-scheme="inverse"
    >
      {/* Background ambient video / lighting */}
      <BackgroundVideo />

      {/* Intro, emblem and booking action share one responsive layout. */}
      <Container className="home-hero__layout relative z-10 grid items-center">
        {/* Left Column: Title & Subtitle */}
        <Reveal className="home-hero__intro flex flex-col items-start text-left">
          <Heading level={1} variant="hero" className="text-on-dark">
            Современная
            <br />
            стоматология
            <br />
            для всей семьи
            <br />
          </Heading>

          <Text variant="body-sm" className="mt-4 text-on-dark/70 max-w-sm">
            От первого молочного зуба до сложной имплантации — бережно, точно и
            без спешки.
          </Text>
        </Reveal>

        {/* Center Column: Glowing Tooth Emblem */}
        <div className="home-hero__emblem flex items-center justify-center relative overflow-visible">
          <CentralLogo colorMode="glowing-white" />
        </div>

        {/* Right Column: Title & Action Buttons */}
        <Reveal className="home-hero__action flex flex-col items-start text-left w-full min-w-0">
          <Heading level={2} className="text-on-dark mb-4 w-full max-w-full">
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
