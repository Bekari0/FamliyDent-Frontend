import type { TourismFeature } from "./types";

export const tourismRoadmap = [
  { number: "01", title: "Вы пишете нам", description: "Оставляете контакты и коротко описываете медицинскую задачу." },
  { number: "02", title: "Онлайн-консультация", description: "Команда уточняет данные и организует предварительный разбор без оплаты." },
  { number: "03", title: "План лечения", description: "После изучения доступных материалов формируем предварительный медицинский маршрут." },
  { number: "04", title: "План поездки", description: "В соответствии с лечением согласуем даты визитов и удобный ритм поездки." },
  { number: "05", title: "Визит в клинику", description: "После очной диагностики врач подтверждает план и начинает согласованное лечение." },
  { number: "06", title: "Лечение и отдых", description: "Свободное время можно посвятить Душанбе, горам и знакомству с Таджикистаном." },
] as const;

export const tourismComparison = [
  { service: "Консультация", tajikistan: "$10–20", russia: "$30–60", kazakhstan: "$20–50", europe: "$80–200", usa: "$150–300" },
  { service: "Профессиональная чистка", tajikistan: "$25–50", russia: "$70–150", kazakhstan: "$50–120", europe: "$120–250", usa: "$200–500" },
  { service: "Лечение кариеса", tajikistan: "$30–80", russia: "$80–150", kazakhstan: "$60–120", europe: "$150–350", usa: "$200–600" },
  { service: "Лечение каналов", tajikistan: "$80–200", russia: "$150–600", kazakhstan: "$120–500", europe: "$400–1200", usa: "$700–2000" },
  { service: "Керамическая коронка", tajikistan: "$120–300", russia: "$400–900", kazakhstan: "$300–700", europe: "$700–1500", usa: "$1200–2500" },
  { service: "Винир, 1 зуб", tajikistan: "$150–350", russia: "$500–1000", kazakhstan: "$400–900", europe: "$800–2000", usa: "$1200–2500" },
  { service: "Имплант с коронкой", tajikistan: "$500–1200", russia: "$1800–3000", kazakhstan: "$1200–2500", europe: "$2500–5000", usa: "$4000–7000" },
  { service: "Отбеливание", tajikistan: "$100–250", russia: "$250–600", kazakhstan: "$200–500", europe: "$400–1000", usa: "$500–1500" },
] as const;

export const tourismPackages = [
  { number: "01", name: "Express Smile", duration: "2–3 дня", audience: "Для деловой поездки", description: "Компактный маршрут консультации, диагностики и процедур, которые возможно безопасно выполнить за короткий визит.", image: "/images/tourism/packages/presentation-package-3.jpeg", imageAlt: "Деловые путешественники в аэропорту" },
  { number: "02", name: "Улыбка + Горы", duration: "3–7 дней", audience: "Лечение и впечатления", description: "График приёмов с окнами для отдыха и самостоятельного знакомства с Душанбе и природой страны.", image: "/images/tourism/packages/presentation-package-2.jpeg", imageAlt: "Горное озеро в Таджикистане" },
  { number: "03", name: "Имплантация под ключ", duration: "10–14 дней", audience: "По показаниям врача", description: "Индивидуальный маршрут диагностики, хирургического этапа и наблюдения. Финальный объём определяется очно.", image: "/images/tourism/packages/presentation-package-1.jpeg", imageAlt: "Панорама Душанбе" },
  { number: "04", name: "Family Smile Tour", duration: "Индивидуально", audience: "Семейный формат", description: "Согласованный график консультаций и лечения для нескольких членов семьи в рамках одной поездки.", image: "/images/tourism/packages/presentation-package-4.jpeg", imageAlt: "Семья отдыхает у горного озера" },
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
