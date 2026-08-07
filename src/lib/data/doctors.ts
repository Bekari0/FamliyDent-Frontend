import type { Doctor } from "./types";

/* Mock data for Family Dent medical team */
const doctorsData: Doctor[] = [
  {
    id: "doc-shodmonov",
    slug: "shodmonov-sabur",
    name: "Шодмонов Сабур",
    specialty: "Врач-стоматолог, терапевт-ортопед",
    experienceYears: "Более 8 лет",
    bio: "Эксперт в области функциональной и эстетической стоматологии. Более 500 успешных тотальных реставраций и цифровых виртуальных улыбок.",
    image: "https://i.ibb.co/whR8CjHF/Shodmonov-Sabur.jpg",
    education: [
      "ТГМУ им. Абуали ибни Сино"
    ],
    specialties: ["Функциональная стоматология", "Эстетическая реставрация", "Терапия и ортопедия"]
  },
  {
    id: "doc-ahmedova",
    slug: "ahmedova-ruhshona",
    name: "Ахмедова Рухшона",
    specialty: "Врач-стоматолог первой категории",
    experienceYears: "13 лет",
    bio: "Врач-стоматолог первой категории. Прошла обучение по детской стоматологии, адаптивной гигиене и бережному лечению без боли.",
    image: "https://i.ibb.co/sJ3yNLTB/Ahmedova-Ruhshona.jpg",
    education: [],
    specialties: ["Детская стоматология", "Адаптивная гигиена", "Лечение без боли"]
  },
  {
    id: "doc-nazarov",
    slug: "nazarov-somon",
    name: "Назаров Сомон",
    specialty: "Врач-стоматолог-терапевт, ортопед",
    experienceYears: "Специализация: сложная эндодонтия",
    bio: "Специализируется на лечении сложных случаев корневых каналов с применением дентального микроскопа и микрохирургии.",
    image: "https://i.ibb.co/LTG7YNr/Nazarov-Somon.jpg",
    education: [
      "Хатлонский государственный медицинский университет (2017-2022)"
    ],
    specialties: ["Сложная эндодонтия", "Лечение под микроскопом", "Ортопедическое восстановление"]
  },
  {
    id: "doc-kosimov",
    slug: "kosimov-husrav",
    name: "Косимов Хусрав",
    specialty: "Врач-стоматолог терапевт-ортопед",
    experienceYears: "",
    bio: "Специализируется на художественных реставрациях всех групп зубов.",
    image: "https://i.ibb.co/tpGBsMFm/Kosimov-Husrav.jpg",
    education: [
      "Медицинский университет имени Абуали ибни Сино (2022)"
    ],
    specialties: ["Художественная реставрация", "Терапевтическое лечение", "Ортопедия"]
  },
  {
    id: "doc-bekova",
    slug: "bekova-aziza",
    name: "Бекова Азиза",
    specialty: "Врач стоматолог-ортодонт",
    experienceYears: "5 лет",
    bio: "Ординатор 2 курса. Специализируется на ортодонтии и детской ортодонтии (исправление прикуса элайнерами и брекетами).",
    image: "https://i.ibb.co/s9wF2yFP/Bekova-Aziza.jpg",
    education: [
      "Медицинский университет имени Абуали ибни Сино (2022)"
    ],
    specialties: ["Ортодонтия", "Детская ортодонтия", "Исправление прикуса"]
  },
  {
    id: "doc-bashirov",
    slug: "bashirov-amin",
    name: "Баширов Амин",
    specialty: "Врач стоматолог-хирург",
    experienceYears: "",
    bio: "Специализируется на хирургической стоматологии, имплантологии и костно-пластических операциях повышенной сложности.",
    image: "https://i.ibb.co/VWwPCynt/Bashirov-Amin.jpg",
    education: [
      "Санкт-Петербургский Медико-Социальный Институт (2020)"
    ],
    specialties: ["Хирургическая стоматология", "Имплантология", "Костная пластика"]
  }
];

export async function getDoctors(): Promise<Doctor[]> {
  return [...doctorsData];
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  return doctorsData.find((d) => d.slug === slug) || null;
}
