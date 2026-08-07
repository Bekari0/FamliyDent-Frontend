import type { PricingItem } from "./types";

/* Mock data for Family Dent prices */
const pricingData: PricingItem[] = [
  { id: "p-1", category: "Консультация", name: "Первичный осмотр и составление плана лечения", price: "Бесплатно" },
  { id: "p-2", category: "Консультация", name: "3D Компьютерная томография (КТ)", price: "200 TJS" },
  { id: "p-3", category: "Терапия", name: "Лечение кариеса (1 зуб)", price: "от 350 TJS" },
  { id: "p-4", category: "Терапия", name: "Лечение пульпита / каналов под микроскопом", price: "от 650 TJS" },
  { id: "p-5", category: "Имплантация", name: "Установка импланта Dentium (Юж. Корея)", price: "от 2 800 TJS" },
  { id: "p-6", category: "Имплантация", name: "Установка импланта Straumann (Швейцария)", price: "от 5 500 TJS" },
  { id: "p-7", category: "Ортодонтия", name: "Брекет-система Damon (1 челюсть)", price: "от 4 500 TJS" },
  { id: "p-8", category: "Эстетика", name: "Керамический винир E.max (1 единица)", price: "от 1 800 TJS" },
  { id: "p-9", category: "Гигиена", name: "Комплексная чистка AirFlow + ультразвук", price: "от 400 TJS" }
];

export async function getPricingItems(): Promise<PricingItem[]> {
  return [...pricingData];
}
