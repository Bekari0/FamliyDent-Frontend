import type { TourismFeature } from "./types";

/* Mock data for Family Dent Dental Tourism Features */
const tourismFeaturesData: TourismFeature[] = [
  {
    id: "tf-plan",
    title: "Индивидуальный план лечения",
    description: "Наши врачи изучат ваши снимки КТ и подготовят точный предварительный план с прозрачной стоимостью еще до вашего вылета."
  },
  {
    id: "tf-consultation",
    title: "Онлайн-консультация до приезда",
    description: "Видеовстреча с профильным специалистом или главным врачом для обсуждения вариантов лечения и ответов на вопросы."
  },
  {
    id: "tf-schedule",
    title: "Оптимизированный график приемов",
    description: "Подбираем удобные даты и время процедур без долгого ожидания, чтобы вы максимально эффективно использовали время поездки."
  },
  {
    id: "tf-fast-track",
    title: "Комплексное лечение за короткий срок",
    description: "Применение цифровых технологий (DSD, CAD/CAM, экспресс-имплантация) позволяет пройти полный курс за 3–7 дней."
  }
];

export async function getTourismFeatures(): Promise<TourismFeature[]> {
  return [...tourismFeaturesData];
}
