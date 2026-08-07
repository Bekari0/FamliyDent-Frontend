import type { EquipmentItem } from "./types";

/* Mock data for Family Dent advanced equipment */
const equipmentData: EquipmentItem[] = [
  {
    id: "eq-axiograph",
    slug: "axiograph",
    name: "Электронный аксиограф",
    description: "Цифровой прибор для точной записи и анализа траекторий движения нижней челюсти и работы ВНЧС.",
    patientBenefit: "Более точное определение причин щелчков, боли или дискомфорта в суставе и индивидуально подобранная капа без неприятных ощущений.",
    image: "https://images.pexels.com/photos/3845722/pexels-photo-3845722.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    id: "eq-microscope",
    slug: "microscope",
    name: "Дентальный операционный микроскоп",
    description: "Оптическая система с 25-кратным увеличением и бестеневым светодиодным освещением канала.",
    patientBenefit: "Максимально бережное сохранение собственных тканей зуба, обнаружение скрытых каналов и ювелирная точность реставрации.",
    image: "https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    id: "eq-ct",
    slug: "3d-ct-scan",
    name: "3D Компьютерный томограф (КТ)",
    description: "Высокоточный конусно-лучевой томограф с минимальной лучевой нагрузкой за 14 секунд сканирования.",
    patientBenefit: "Полная безопасная виртуальная 3D-модель челюсти для планирования имплантации и удаления без риска задеть нервные окончания.",
    image: "https://images.pexels.com/photos/4270371/pexels-photo-4270371.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    id: "eq-intraoral-scanner",
    slug: "intraoral-scanner",
    name: "Интраоральный 3D-сканер",
    description: "Компактная камера для создания сверхточных 3D-слепков зубных рядов в режиме реального времени.",
    patientBenefit: "Лечение без липких слепочных масс и рвотного рефлекса, с мгновенной визуализацией будущей улыбки на экране.",
    image: "https://images.pexels.com/photos/3845736/pexels-photo-3845736.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    id: "eq-digital-diagnostics",
    slug: "digital-diagnostics",
    name: "Цифровой комплекс DSD (Digital Smile Design)",
    description: "Программное обеспечение для фотометрии, лицевого анализа и виртуального моделирования формы зубов.",
    patientBenefit: "Возможность увидеть и примерить примерный результат своей новой улыбки еще до начала обтачивания зубов.",
    image: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    id: "eq-sterilization",
    slug: "autoclave-sterilization",
    name: "Автоклав класса B и ультразвуковая очистка",
    description: "Автоматизированная стерилизационная система с фракционированным вакуумом и вакуумной сушкой.",
    patientBenefit: "100% инфекционная безопасность каждого инструмента в индивидуальном герметичном крафт-пакете, вскрываемом при пациенте.",
    image: "https://images.pexels.com/photos/6627618/pexels-photo-6627618.jpeg?auto=compress&cs=tinysrgb&w=1000"
  }
];

export async function getEquipmentItems(): Promise<EquipmentItem[]> {
  return [...equipmentData];
}
