import type { TreatmentCase } from "./types";

const DISCLAIMER = "Результат лечения индивидуален и зависит от клинической ситуации.";

const treatmentCasesData: TreatmentCase[] = [
  {
    id: "case-posterior-implants-24-25",
    slug: "vosstanovlenie-zubov-24-25",
    title: "Восстановление зубов 24 и 25",
    category: "implantation",
    shortDescription:
      "Имплантация с периодом приживления 3 месяца, адаптация на временных коронках и финальная фиксация коронок из диоксида циркония.",
    beforeImage: "/images/results/restoration-before.jpg",
    afterImage: "/images/results/restoration-after.jpg",
    disclaimer: DISCLAIMER,
  },
  {
    id: "case-anterior-zirconia-11-21",
    slug: "preobrazhenie-ulybki-11-21",
    title: "Преображение улыбки: зона 11–21",
    category: "veneers",
    shortDescription:
      "После лечения глубоких кариозных поражений фронтальная зона восстановлена циркониевыми коронками естественной формы и оттенка.",
    beforeImage: "/images/results/transformation-before.jpg",
    afterImage: "/images/results/transformation-after.jpg",
    disclaimer: DISCLAIMER,
  },
  {
    id: "case-all-on-4",
    slug: "polnaya-perezagruzka-ulybki-all-on-4",
    title: "Полная перезагрузка улыбки All-on-4",
    category: "implantation",
    shortDescription:
      "Полное восстановление обеих челюстей: имплантация All-on-4, период приживления, временные коронки и постоянное протезирование на балочной фиксации.",
    beforeImage: "/images/results/all-on-4-before.jpg",
    afterImage: "/images/results/all-on-4-after.jpg",
    disclaimer: DISCLAIMER,
  },
  {
    id: "case-professional-hygiene",
    slug: "professionalnaya-gigiena-polosti-rta",
    title: "Профессиональная гигиена полости рта",
    category: "restoration",
    shortDescription:
      "Удалили плотный налёт и зубной камень, вернув зубам естественную чистоту. Регулярная гигиена помогает поддерживать здоровье зубов и дёсен.",
    beforeImage: "/images/results/hygiene-before.jpg",
    afterImage: "/images/results/hygiene-after.jpg",
    disclaimer: DISCLAIMER,
  },
  {
    id: "case-anterior-restoration",
    slug: "kompleksnoe-vosstanovlenie-perednih-zubov",
    title: "Комплексное восстановление передних зубов",
    category: "restoration",
    shortDescription:
      "Восстановили сильно повреждённые зубы фронтальной зоны, вернув улыбке аккуратную форму, естественный оттенок и полноценную функцию.",
    beforeImage: "/images/results/anterior-before.jpg",
    afterImage: "/images/results/anterior-after.jpg",
    disclaimer: DISCLAIMER,
  },
];

export async function getTreatmentCases(): Promise<TreatmentCase[]> {
  return [...treatmentCasesData];
}

export async function getTreatmentCasesByCategory(category: string): Promise<TreatmentCase[]> {
  if (category === "all" || !category) return getTreatmentCases();
  return treatmentCasesData.filter((c) => c.category === category);
}
