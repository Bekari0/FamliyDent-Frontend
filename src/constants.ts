import { Service, Doctor, Review } from './types';

export const SERVICES: Service[] = [
 {
 id: '1',
 title: 'Лечение кариеса',
 description: 'Безболезненное лечение с использованием современных композитных материалов.',
 price: 300,
 icon: 'Stethoscope',
 category: 'therapy',
 duration: 60
 },
 {
 id: '2',
 title: 'Профессиональная гигиена',
 description: 'Ультразвуковая чистка и AirFlow для идеальной чистоты и здоровья десен.',
 price: 450,
 icon: 'Sparkles',
 category: 'hygiene',
 duration: 45
 },
 {
 id: '3',
 title: 'Имплантация зубов',
 description: 'Восстановление зубов с пожизненной гарантией на импланты.',
 price: 4500,
 icon: 'Zap',
 category: 'implants',
 duration: 120
 },
 {
 id: '4',
 title: 'Брекет-системы',
 description: 'Исправление прикуса любой сложности для детей и взрослых.',
 price: 6000,
 icon: 'Activity',
 category: 'orthodontics',
 duration: 90
 },
 {
 id: '5',
 title: 'Удаление зубов',
 description: 'Безопасное и быстрое удаление зубов мудрости любой сложности.',
 price: 200,
 icon: 'Scissors',
 category: 'surgery',
 duration: 30
 },
 {
 id: '6',
 title: 'Отбеливание зубов',
 description: 'Безопасное осветление эмали до 8 тонов за один визит.',
 price: 1200,
 icon: 'Sun',
 category: 'hygiene',
 duration: 60
 }
];

export const DOCTORS: Doctor[] = [
 {
 id: '1',
 name: 'Др. Ахмедов Саид',
 specialty: 'Главный врач, Хирург-имплантолог',
 experience: '15 лет опыта',
 image: 'https://picsum.photos/seed/doc1/400/500',
 description: 'Специалист экспертного уровня в области дентальной имплантации и костной пластики.',
 education: ['ТГМУ им. Абуали ибни Сино', 'Ординатура по челюстно-лицевой хирургии'],
 achievements: ['Более 5000 успешных имплантаций', 'Член международной ассоциации имплантологов'],
 rating: 5.0,
 reviewsCount: 124
 },
 {
 id: '2',
 name: 'Др. Каримова Мадина',
 specialty: 'Врач-ортодонт',
 experience: '8 лет опыта',
 image: 'https://picsum.photos/seed/doc2/400/500',
 description: 'Создает идеальные улыбки с помощью современных брекет-систем и элайнеров.',
 education: ['ТГМУ им. Абуали ибни Сино', 'Курсы повышения квалификации в Германии'],
 achievements: ['Сертифицированный специалист по элайнерам Invisalign', 'Лучший ортодонт 2023 года'],
 rating: 4.9,
 reviewsCount: 89
 },
 {
 id: '3',
 name: 'Др. Назаров Рустам',
 specialty: 'Стоматолог-терапевт',
 experience: '10 лет опыта',
 image: 'https://picsum.photos/seed/doc3/400/500',
 description: 'Мастер художественной реставрации и эндодонтического лечения под микроскопом.',
 education: ['ТГМУ им. Абуали ибни Сино', 'Магистратура в МГМСУ'],
 achievements: ['Победитель конкурса эстетической реставрации', 'Эксперт в лечении каналов'],
 rating: 4.8,
 reviewsCount: 156
 }
];

export const REVIEWS: Review[] = [
 {
 id: '1',
 patientId: 'u1',
 patientName: 'Алишер С.',
 doctorId: '1',
 rating: 5,
 comment: 'Лучшая клиника в городе! Лечил кариес, все прошло абсолютно безболезненно. Очень вежливый персонал.',
 date: '15.03.2024',
 createdAt: Date.now()
 },
 {
 id: '2',
 patientId: 'u2',
 patientName: 'Елена М.',
 doctorId: '2',
 rating: 5,
 comment: 'Ставила брекеты у доктора Каримовой. Результат превзошел все ожидания! Спасибо за мою новую улыбку.',
 date: '02.02.2024',
 createdAt: Date.now()
 },
 {
 id: '3',
 patientId: 'u3',
 patientName: 'Парвиз Т.',
 doctorId: '3',
 rating: 5,
 comment: 'Профессионалы своего дела. Делал чистку и отбеливание. Все на высшем уровне.',
 date: '20.01.2024',
 createdAt: Date.now()
 }
];
