import type { PatientReview } from "./types";

const yandexReviewsUrl =
  "https://yandex.ru/maps/org/femili_dent/16415187433/reviews/?ll=68.804420%2C38.563485&tab=reviews&z=16.54";

// Public reviews verified against the Family Dent listing on Yandex Maps.
const patientReviewsData: PatientReview[] = [
  {
    id: "yandex-manizha-t",
    authorName: "Манижа Т.",
    source: "yandex",
    rating: 5,
    text: "Хочу отдельно поблагодарить сотрудника регистратуры Насиму за внимательное отношение! При записи на приём всё подробно объяснила, помогла выбрать удобное время и учла все мои пожелания.",
    publishedAt: "13 июля 2026",
    branch: "Family Dent",
    sourceUrl: yandexReviewsUrl,
  },
  {
    id: "yandex-shakhnoza-khadzhibaeva",
    authorName: "Шахноза Хаджибаева",
    source: "yandex",
    rating: 5,
    text: "Приём проводится по новейшей технологии, быстро, качественно, вовремя и по доступной цене. Я получила все необходимые процедуры и ответы на свои вопросы.",
    publishedAt: "1 июля 2024",
    branch: "Family Dent",
    sourceUrl: yandexReviewsUrl,
  },
  {
    id: "yandex-natalya-n",
    authorName: "Наталья Н.",
    source: "yandex",
    rating: 5,
    text: "Дилшод Истамович, огромное вам спасибо, что вернули мне мою красивую улыбку. Никто не верит, что у меня импланты — настолько всё естественно.",
    publishedAt: "2 декабря 2023",
    branch: "Family Dent",
    sourceUrl: yandexReviewsUrl,
  },
  {
    id: "yandex-tatyana-lissitsyna",
    authorName: "Tatyana Lissitsyna",
    source: "yandex",
    rating: 5,
    text: "Была на консультации, всё понравилось. Видно, что специалисты своего дела. С удовольствием вернусь, если снова отправлюсь в Таджикистан.",
    publishedAt: "21 августа 2023",
    branch: "Family Dent",
    sourceUrl: yandexReviewsUrl,
  },
  {
    id: "yandex-ilyas-toktarov",
    authorName: "Ильяс Токтаров",
    source: "yandex",
    rating: 5,
    text: "Доктор Сакина — лучший детский стоматолог!",
    publishedAt: "17 сентября 2025",
    branch: "Family Dent",
    sourceUrl: yandexReviewsUrl,
  },
  {
    id: "yandex-firdavs-turaev",
    authorName: "Firdavs Turaev",
    source: "yandex",
    rating: 5,
    text: "Классный коллектив, хороший сервис.",
    publishedAt: "9 октября 2025",
    branch: "Family Dent",
    sourceUrl: yandexReviewsUrl,
  },
];

export async function getPatientReviews(): Promise<PatientReview[]> {
  return [...patientReviewsData];
}
