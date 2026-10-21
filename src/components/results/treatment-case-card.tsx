import { Heading, Reveal, Text } from "@/ui-kit";
import React from "react";
import type { TreatmentCase } from "../../lib/data/types";
import { BeforeAfterSlider } from "./before-after-slider";

interface TreatmentCaseCardProps {
  key?: React.Key;
  treatmentCase: TreatmentCase;
}

export function TreatmentCaseCard({ treatmentCase }: TreatmentCaseCardProps) {
  return (
    <Reveal
      className="bg-surface border border-rule rounded-2xl p-5 shadow-card flex flex-col gap-4 hover:border-accent/40 transition-colors"
      data-ui-scheme="default"
    >
      <BeforeAfterSlider
        beforeImage={treatmentCase.beforeImage}
        afterImage={treatmentCase.afterImage}
        title={treatmentCase.title}
        disclaimer={treatmentCase.disclaimer}
      />
      <div>
        <Heading level={3} variant="heading-6" className="text-ink mb-1">
          {treatmentCase.title}
        </Heading>
        <Text variant="body-sm" className="text-muted">
          {treatmentCase.shortDescription}
        </Text>
      </div>
    </Reveal>
  );
}
