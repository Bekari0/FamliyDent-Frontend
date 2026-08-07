import type { ConcernItem } from "./types";

/* Mock data for "Что вас беспокоит?" drawer */
const concernsData: ConcernItem[] = [
  {
    id: "concern-toothache",
    title: "Болит зуб",
    serviceHref: "/services#therapy",
    shortDescription: "Быстрая помощь при острой боли, лечение пульпита и глубокого кариеса под микроскопом."
  },
  {
    id: "concern-missing-tooth",
    title: "Отсутствует зуб",
    serviceHref: "/services#implantation",
    shortDescription: "Имплантация премиум-системами с восстановлением естественной жевательной функции."
  },
  {
    id: "concern-crooked-teeth",
    title: "Кривые зубы",
    serviceHref: "/services#orthodontics",
    shortDescription: "Исправление прикуса элайнерами и эстетическими брекетами без боли и дискомфорта."
  },
  {
    id: "concern-bleeding-gums",
    title: "Кровоточат дёсны",
    serviceHref: "/services#hygiene",
    shortDescription: "Лечение пародонтита, вектор-терапия и профессиональная ультразвуковая чистка."
  },
  {
    id: "concern-tmj-click",
    title: "Щёлкает челюсть",
    serviceHref: "/services#diagnostics-tmj",
    shortDescription: "Гнатологическая диагностика ВНЧС, изготовление сплинт-кап и нормализация прикуса."
  },
  {
    id: "concern-scared-child",
    title: "Ребёнок боится стоматолога",
    serviceHref: "/services#pediatric",
    shortDescription: "Адаптационный игровой прием, лечение без слез с любимыми мультфильмами."
  },
  {
    id: "concern-unhappy-smile",
    title: "Не нравится улыбка",
    serviceHref: "/services#aesthetics",
    shortDescription: "Установка виниров E.max, отбеливание Zoom 4 и художественная реставрация."
  }
];

export async function getConcernItems(): Promise<ConcernItem[]> {
  return [...concernsData];
}
