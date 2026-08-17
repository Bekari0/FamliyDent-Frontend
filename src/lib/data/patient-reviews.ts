import type { PatientReview } from "./types";

export const reviewSourceLinks = {
  yandex:
    "https://yandex.ru/maps/org/femili_dent/16415187433/reviews/?ll=68.804420%2C38.563485&tab=reviews&z=16.54",
  googleFamilyDent:
    "https://www.google.com/maps/place/Family+Dent/@38.563438,68.8018967,17z/data=!4m8!3m7!1s0x38b5d1aba35cafc3:0xd10cb723db2752e2!8m2!3d38.563438!4d68.8044716!9m1!1b1!16s%2Fg%2F11jv8kdh_9?entry=ttu",
  googleFamilyDent2:
    "https://www.google.com/maps/place/Family+Dent+2/@38.5489051,68.7583137,17z/data=!4m8!3m7!1s0x6bdc250bce99c505:0x19fb711797678402!8m2!3d38.5489009!4d68.7608886!9m1!1b1!16s%2Fg%2F11ymnbcpkx?entry=ttu",
  instagram: "https://www.instagram.com/p/DafePwMA6x_/",
} as const;

export const googleReviewSources = [
  {
    id: "google-family-dent",
    name: "Family Dent",
    branch: "улица Айни, 45",
    href: reviewSourceLinks.googleFamilyDent,
  },
  {
    id: "google-family-dent-2",
    name: "Family Dent 2",
    branch: "второй филиал",
    href: reviewSourceLinks.googleFamilyDent2,
  },
] as const;

const yandexReviewsUrl = reviewSourceLinks.yandex;

// Public reviews verified against the Family Dent listing on Yandex Maps.
const patientReviewsData: PatientReview[] = [
  {
    id: "instagram-dafepwma6x",
    authorName: "Видеоотзыв пациента Family Dent",
    source: "instagram",
    text: "История пациента о лечении в Family Dent.",
    videoUrl: "https://www.instagram.com/p/DafePwMA6x_/embed/",
    sourceUrl: reviewSourceLinks.instagram,
  },
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
