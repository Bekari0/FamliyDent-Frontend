import { Container, Heading, Text } from "@/ui-kit";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTreatmentCases } from "../../lib/data/treatment-cases";
import type { TreatmentCase } from "../../lib/data/types";
import { BeforeAfterSlider } from "../results/before-after-slider";
import {
  ScrollAnimate,
  StaggerContainer,
  StaggerItem,
} from "../shared/scroll-animate";

export function TreatmentResultsSection() {
  const [cases, setCases] = useState<TreatmentCase[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getTreatmentCases();
      setCases(data.slice(0, 2));
    }
    load();
  }, []);

  return (
    <section
      className="w-full border-b border-rule bg-paper py-16 text-ink sm:py-20"
      data-ui-scheme="default"
    >
      <Container>
        {/* Header */}
        <ScrollAnimate className="flex flex-col tablet:flex-row tablet:items-end justify-between mb-12 gap-4">
          <div>
            <span className="type-overline uppercase text-brand-text mb-2 block">
              Клинические кейсы
            </span>
            <Heading level={2} className="text-ink">
              Результаты лечения «До / После»
            </Heading>
            <Text variant="body-sm" className="text-muted mt-1">
              Перемещайте ползунок влево и вправо для наглядного сравнения
              эстетических результатов.
            </Text>
          </div>
          <Link
            to="/results"
            className="type-caption inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface text-ink border border-rule hover:bg-paper-2 transition-all self-start tablet:self-auto group shadow-2xs"
            data-ui-scheme="default"
          >
            <span>Все результаты</span>
            <ArrowRight className="w-4 h-4 text-brand-text group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollAnimate>

        {/* Treatment Case Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
          {cases.map((c) => (
            <StaggerItem
              key={c.id}
              className="bg-surface rounded-3xl p-6 sm:p-7 border border-rule shadow-whisper flex flex-col justify-between"
              data-ui-scheme="default"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="type-caption uppercase text-brand-text bg-accent-soft px-2.5 py-1 rounded-md border border-rule">
                    {c.category}
                  </span>
                  <div className="type-caption text-muted">
                    <span>Цифровая протоколизация</span>
                  </div>
                </div>

                <Heading
                  level={3}
                  variant="heading-5"
                  className="text-ink mb-2"
                >
                  {c.title}
                </Heading>
                <Text variant="body-sm" className="text-muted mb-6">
                  {c.shortDescription}
                </Text>

                {/* Interactive Slider */}
                <BeforeAfterSlider
                  beforeImage={c.beforeImage}
                  afterImage={c.afterImage}
                  title={c.title}
                  disclaimer={c.disclaimer}
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
