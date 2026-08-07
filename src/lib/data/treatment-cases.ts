import type { TreatmentCase } from "./types";

/* Mock data for Family Dent before & after treatment cases */
const DISCLAIMER = "Результат лечения индивидуален и зависит от клинической ситуации.";

const treatmentCasesData: TreatmentCase[] = [
  {
    id: "case-veneers-1",
    slug: "estetika-ulibki-vinirami",
    title: "Преображение улыбки керамическими винирами E.max",
    category: "veneers",
    shortDescription: "Коррекция формы, пропорций и цвета верхних 8 зубов керамическими винирами за 2 посещения.",
    beforeImage: "https://images.pexels.com/photos/6627532/pexels-photo-6627532.jpeg?auto=compress&cs=tinysrgb&w=800",
    afterImage: "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=800",
    disclaimer: DISCLAIMER
  },
  {
    id: "case-braces-1",
    slug: "исправление-прикуса-брекетами",
    title: "Исправление скученности и глубокого прикуса",
    category: "braces",
    shortDescription: "Лечение самолигирующей брекет-системой Damon в течение 14 месяцев без удаления здоровых зубов.",
    beforeImage: "https://images.pexels.com/photos/6812561/pexels-photo-6812561.jpeg?auto=compress&cs=tinysrgb&w=800",
    afterImage: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800",
    disclaimer: DISCLAIMER
  },
  {
    id: "case-implantation-1",
    slug: "имплантация-переднего-зуба",
    title: "Одномоментная имплантация в эстетически значимой зоне",
    category: "implantation",
    shortDescription: "Удаление разрушенного резца с одновременной установкой импланта и временной коронки в один день.",
    beforeImage: "https://images.pexels.com/photos/6528859/pexels-photo-6528859.jpeg?auto=compress&cs=tinysrgb&w=800",
    afterImage: "https://images.pexels.com/photos/3779705/pexels-photo-3779705.jpeg?auto=compress&cs=tinysrgb&w=800",
    disclaimer: DISCLAIMER
  },
  {
    id: "case-restoration-1",
    slug: "художественная-реставрация",
    title: "Художественная реставрация передних зубов под микроскопом",
    category: "restoration",
    shortDescription: "Восстановление скола и прозрачности эмали светоотверждаемым композитом с сохранением естественной анатомии.",
    beforeImage: "https://images.pexels.com/photos/6528852/pexels-photo-6528852.jpeg?auto=compress&cs=tinysrgb&w=800",
    afterImage: "https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=800",
    disclaimer: DISCLAIMER
  },
  {
    id: "case-orthodontics-1",
    slug: "лечение-прозрачными-элайнерами",
    title: "Выравнивание зубов элайнерами",
    category: "orthodontics",
    shortDescription: "Комфортное незаметное лечение дистального прикуса капами в течение 10 месяцев.",
    beforeImage: "https://images.pexels.com/photos/6812555/pexels-photo-6812555.jpeg?auto=compress&cs=tinysrgb&w=800",
    afterImage: "https://images.pexels.com/photos/3845806/pexels-photo-3845806.jpeg?auto=compress&cs=tinysrgb&w=800",
    disclaimer: DISCLAIMER
  }
];

export async function getTreatmentCases(): Promise<TreatmentCase[]> {
  return [...treatmentCasesData];
}

export async function getTreatmentCasesByCategory(category: string): Promise<TreatmentCase[]> {
  if (category === "all" || !category) return getTreatmentCases();
  return treatmentCasesData.filter((c) => c.category === category);
}
