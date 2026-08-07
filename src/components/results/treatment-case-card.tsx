import React from "react";
import type { TreatmentCase } from "../../lib/data/types";
import { BeforeAfterSlider } from "./before-after-slider";

interface TreatmentCaseCardProps {
  key?: React.Key;
  treatmentCase: TreatmentCase;
}

export function TreatmentCaseCard({ treatmentCase }: TreatmentCaseCardProps) {
  return (
    <div className="bg-surface border border-rule rounded-2xl p-5 shadow-card flex flex-col gap-4 hover:border-accent/40 transition-colors">
      <BeforeAfterSlider
        beforeImage={treatmentCase.beforeImage}
        afterImage={treatmentCase.afterImage}
        title={treatmentCase.title}
        disclaimer={treatmentCase.disclaimer}
      />
      <div>
        <h3 className="font-display text-base sm:text-lg font-bold text-ink mb-1">
          {treatmentCase.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed">
          {treatmentCase.shortDescription}
        </p>
      </div>
    </div>
  );
}
