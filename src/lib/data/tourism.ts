import type { TourismFeature } from "./types";

export const tourismRoadmap = [
  { number: "01", title: "Знакомство", description: "Вы оставляете контакты и коротко описываете задачу." },
  { number: "02", title: "Онлайн-разбор", description: "Мы уточняем данные и подбираем профильного специалиста." },
  { number: "03", title: "Маршрут лечения", description: "Формируем предварительный порядок визитов и обсуждаем даты поездки." },
  { number: "04", title: "Душанбе", description: "Проводим очную диагностику и начинаем согласованное лечение." },
] as const;

export const tourismPlaces = [
  { name: "Памирский тракт", meta: "Дорога выше облаков", image: "/images/tourism/pamir-road.png", className: "place--dominant" },
  { name: "Фанские горы", meta: "Высота и тишина", image: "/images/tourism/fann-mountains.png", className: "place--tall" },
  { name: "Проспект Рудаки", meta: "Ритм столицы", image: "/images/tourism/dushanbe-architecture.png", className: "place--portrait" },
  { name: "Таджикский орнамент", meta: "Детали культуры", image: "/images/tourism/cultural-detail.png", className: "place--square" },
] as const;

const tourismFeaturesData: TourismFeature[] = [
  {
    id: "tf-plan",
    title: "Индивидуальный план лечения",
    description: "Врач изучит доступные материалы и подготовит предварительный маршрут до вашего приезда.",
  },
  {
    id: "tf-consultation",
    title: "Онлайн-консультация до приезда",
    description: "Разговор с профильным специалистом для обсуждения вариантов лечения и подготовки к очной диагностике.",
  },
  {
    id: "tf-schedule",
    title: "Согласованный график приёмов",
    description: "После уточнения медицинской задачи команда обсудит подходящую последовательность визитов.",
  },
];

export async function getTourismFeatures(): Promise<TourismFeature[]> {
  return [...tourismFeaturesData];
}
