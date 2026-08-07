import type { PatientReview } from "./types";

/* Mock data for Family Dent patient reviews across channels */
const patientReviewsData: PatientReview[] = [
  {
    id: "rev-1",
    authorName: "Азиз Касымов",
    source: "google",
    rating: 5,
    text: "Делал комплексную имплантацию All-on-4 у доктора Рахимова. Отличный сервис, внимательные администраторы и абсолютно безболезненно. Огромное спасибо всему коллективу Family Dent!",
    publishedAt: "2 недели назад"
  },
  {
    id: "rev-2",
    authorName: "Зарина Шарипова",
    source: "instagram",
    rating: 5,
    text: "Поставили виниры на верхнюю челюсть. Улыбка получилась настолько естественной и красивой! Все подруги спрашивают адрес клиники.",
    publishedAt: "1 месяц назад"
  },
  {
    id: "rev-3",
    authorName: "Махмуд Т.",
    source: "whatsapp",
    rating: 5,
    text: "Приводил сына на лечение кариеса к детскому врачу Малике Шариповой. Ребенок вышел из кабинета с подарком и счастливый, даже не плакал! Теперь только к вам.",
    publishedAt: "3 недели назад"
  },
  {
    id: "rev-4",
    authorName: "Елена Смирнова",
    source: "video",
    rating: 5,
    text: "Видеоотзыв о лечении и установке элайнеров в клинике Family Dent.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    videoPoster: "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: "2 месяца назад"
  },
  {
    id: "rev-5",
    authorName: "Фаррух Рустамов",
    source: "video",
    rating: 5,
    text: "Впечатления о посещении клиники во время стоматологического тура из Алматы.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    videoPoster: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: "3 месяца назад"
  }
];

export async function getPatientReviews(): Promise<PatientReview[]> {
  return [...patientReviewsData];
}
