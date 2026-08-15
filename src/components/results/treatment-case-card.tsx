import type { TreatmentCase } from "@/lib/reference-content/types";
import { BeforeAfterSlider } from "./before-after-slider";

export function TreatmentCaseCard({ treatmentCase }: { treatmentCase: TreatmentCase }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-rule bg-surface p-5 shadow-card transition-colors motion-reduce:transition-none hover:border-accent/40">
      <BeforeAfterSlider beforeImage={treatmentCase.beforeImage} afterImage={treatmentCase.afterImage} title={treatmentCase.title} disclaimer={treatmentCase.disclaimer} />
      <div><h2 className="font-display text-base font-bold text-ink sm:text-lg">{treatmentCase.title}</h2><p className="mt-1 text-xs leading-relaxed text-editorial-muted sm:text-sm">{treatmentCase.shortDescription}</p></div>
    </article>
  );
}
