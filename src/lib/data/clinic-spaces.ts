import type { ClinicSpace } from "./types";

/* Mock data for Family Dent clinic spaces (clinic tour) */
const clinicSpacesData: ClinicSpace[] = [
  {
    id: "space-reception",
    slug: "reception",
    title: "Ресепшн и зона встреч",
    description: "Светлое и просторное пространство с вежливыми администраторами, свежим кофе и системой быстрой регистрации.",
    image: "https://images.pexels.com/photos/6627618/pexels-photo-6627618.jpeg?auto=compress&cs=tinysrgb&w=1200",
    order: 1
  },
  {
    id: "space-treatment-room",
    slug: "treatment-room",
    title: "Лечебные кабинеты",
    description: "Эргономичные кабинеты с бесшумными немецкими стоматологическими установками, операционными микроскопами и климат-контролем.",
    image: "https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg?auto=compress&cs=tinysrgb&w=1200",
    order: 2
  },
  {
    id: "space-equipment",
    slug: "equipment-room",
    title: "Зал цифровой диагностики",
    description: "Оснащен современными 3D-сканерами и диагностическим комплексом для построения точной цифровой модели челюсти.",
    image: "https://images.pexels.com/photos/3845722/pexels-photo-3845722.jpeg?auto=compress&cs=tinysrgb&w=1200",
    order: 3
  },
  {
    id: "space-ct",
    slug: "ct-room",
    title: "Кабинет компьютерной томографии (КТ)",
    description: "Высокоточный 3D-томограф с низкой дозой облучения за несколько секунд выполняет панорамные снимки и 3D-реконструкцию.",
    image: "https://images.pexels.com/photos/4270371/pexels-photo-4270371.jpeg?auto=compress&cs=tinysrgb&w=1200",
    order: 4
  },
  {
    id: "space-sterilization",
    slug: "sterilization-room",
    title: "Стерилизационный блок",
    description: "Многоступенчатая автоматизированная стерилизация инструментов по международным протоколам Анти-СПИД и Анти-Гепатит.",
    image: "https://images.pexels.com/photos/3845736/pexels-photo-3845736.jpeg?auto=compress&cs=tinysrgb&w=1200",
    order: 5
  },
  {
    id: "space-pediatric",
    slug: "pediatric-room",
    title: "Детский кабинет",
    description: "Яркое, дружелюбное пространство с мультфильмами на потолочном экране и подарками за храбрость после каждого приема.",
    image: "https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=1200",
    order: 6
  },
  {
    id: "space-waiting",
    slug: "waiting-area",
    title: "Зона ожидания и отдыха",
    description: "Уютная атмосфера с мягкими креслами, высокой шумоизоляцией и бесплатным Wi-Fi для комфортного времени перед приемом.",
    image: "https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=1200",
    order: 7
  }
];

export async function getClinicSpaces(): Promise<ClinicSpace[]> {
  return [...clinicSpacesData].sort((a, b) => a.order - b.order);
}
