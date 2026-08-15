import type { Service } from "./types";

/* Mock data for Family Dent services */
export const servicesData: Service[] = [
  {
    id: "srv-therapy",
    slug: "therapy",
    title: "Терапия и лечение боли (Лечение кариеса)",
    category: "therapy",
    description: "Безболезненное лечение кариеса, пульпита и каналов с использованием операционного микроскопа.",
    priceFrom: "от 350 TJS",
    duration: "45–60 мин",
    details: ["Лечение под микроскопом", "Использование световых пломб премиум-класса", "Абсолютная анестезия"]
  },
  {
    id: "srv-implantation",
    slug: "implantation",
    title: "Дентальная имплантация",
    category: "implantation",
    description: "Восстановление утраченных зубов швейцарскими и южнокорейскими имплантами с пожизненной гарантией.",
    priceFrom: "от 2 800 TJS",
    duration: "30–60 мин",
    details: ["3D-моделирование", "Безопасные хиругические шаблоны", "Восстановление за 1 день"]
  },
  {
    id: "srv-orthodontics",
    slug: "orthodontics",
    title: "Ортодонтия (Брекеты и Элайнеры)",
    category: "orthodontics",
    description: "Исправление прикуса и выравнивание зубов современными невидимыми капами и брекетами Damon.",
    priceFrom: "от 4 500 TJS",
    duration: "Консультация 30 мин",
    details: ["Прозрачные элайнеры", "Брекет-системы", "Детские пластинки"]
  },
  {
    id: "srv-hygiene",
    slug: "hygiene",
    title: "Профессиональная гигиена и пародонтология",
    category: "hygiene",
    description: "Удаление зубного камня, налета AirFlow, укрепление эмали и комплексная забота о деснах.",
    priceFrom: "от 400 TJS",
    duration: "40–50 мин",
    details: ["Ультразвуковая чистка", "Полировка швейцарскими пастами", "Фторирование эмали"]
  },
  {
    id: "srv-diagnostics-tmj",
    slug: "diagnostics-tmj",
    title: "Диагностика ВНЧС и Гнатология",
    category: "diagnostics-tmj",
    description: "Исследование работы сустава челюсти при щелчках, болях и изготовление разгрузочных кап.",
    priceFrom: "от 600 TJS",
    duration: "60 мин",
    details: ["Аксиография", "Изготовление сплинт-кап", "Анализ окклюзии"]
  },
  {
    id: "srv-pediatric",
    slug: "pediatric",
    title: "Детская стоматология",
    category: "pediatric",
    description: "Лечение молочных и постоянных зубов без страха и боли в игровой форме.",
    priceFrom: "от 250 TJS",
    duration: "30–40 мин",
    details: ["Мультфильмы во время лечения", "Лечение кариеса без бормашины", "Подарки каждому ребенку"]
  },
  {
    id: "srv-aesthetics",
    slug: "aesthetics",
    title: "Эстетическая стоматология и Виниры",
    category: "aesthetics",
    description: "Создание идеальной «голливудской» улыбки тончайшими винирами E.max и безопасным отбеливанием.",
    priceFrom: "от 1 200 TJS",
    duration: "от 60 мин",
    details: ["Виниры E.max", "Безопасное отбеливание Zoom 4", "Художественная реставрация"]
  }
];

export async function getServices(): Promise<Service[]> {
  return [...servicesData];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return servicesData.find((s) => s.slug === slug) || null;
}
