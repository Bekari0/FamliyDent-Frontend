import { Service, Doctor, Review } from './types';

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Лечение кариеса',
    description: 'Безболезненное лечение с использованием современных композитных материалов.',
    price: 'от 300 смн',
    icon: 'Stethoscope',
    image: '/images/about/gallery2.jpg',
    category: 'therapy'
  },
  {
    id: '2',
    title: 'Профессиональная гигиена',
    description: 'Ультразвуковая чистка и AirFlow для идеальной чистоты и здоровья десен.',
    price: '450 смн',
    icon: 'Sparkles',
    image: '/images/about/gallery4.jpg',
    category: 'hygiene'
  },
  {
    id: '3',
    title: 'Имплантация зубов',
    description: 'Восстановление зубов с пожизненной гарантией на импланты.',
    price: 'от 4500 смн',
    icon: 'Zap',
    image: '/images/about/gallery1.jpg',
    category: 'implants'
  },
  {
    id: '4',
    title: 'Брекет-системы',
    description: 'Исправление прикуса любой сложности для детей и взрослых.',
    price: 'от 6000 смн',
    icon: 'Activity',
    image: '/images/about/gallery2.jpg',
    category: 'orthodontics'
  },
  {
    id: '5',
    title: 'Удаление зубов',
    description: 'Безопасное и быстрое удаление зубов мудрости любой сложности.',
    price: 'от 200 смн',
    icon: 'Scissors',
    image: '/images/about/gallery6.jpg',
    category: 'surgery'
  },
  {
    id: '6',
    title: 'Отбеливание зубов',
    description: 'Безопасное осветление эмали до 8 тонов за один визит.',
    price: '1200 смн',
    icon: 'Sun',
    image: '/images/about/gallery7.jpg',
    category: 'hygiene'
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Шарипова Нозанин Хурсандмуродовна',
    specialty: 'Врач-стоматолог-терапевт, ортопед',
    experience: '5 лет опыта',
    image: 'images/doctors/SharipovaNozanin.jpg',
    description: 'Специалист экспертного уровня в области дентальной имплантации и костной пластики.'
  },
  {
    id: '2',
    name: 'Халифаев Ромиз Парвизджонович',
    specialty: 'Врач-ортодонт',
    experience: '8 лет опыта',
    image: '/images/doctors/HalifaevRomiz.jpg',
    description: 'Создает идеальные улыбки с помощью современных брекет-систем и элайнеров.'
  },
  {
    id: '3',
    name: 'Назаров Сомон Муродаливиеч',
    specialty: 'Стоматолог-терапевт',
    experience: '10 лет опыта',
    image: '/images/doctors/NazarovSomon.jpg',
    description: 'Мастер художественной реставрации и эндodонтического лечения под микроскопом.'
  }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Алишер С.',
    rating: 5,
    text: 'Лучшая клиника в городе! Лечил кариес, все прошло абсолютно безболезненно. Очень вежливый персонал.',
    date: '15.03.2024',
    avatar: 'https://picsum.photos/seed/user1/100/100'
  },
  {
    id: '2',
    author: 'Елена М.',
    rating: 5,
    text: 'Ставила брекеты у доктора Каримовой. Результат превзошел все ожидания! Спасибо за мою новую улыбку.',
    date: '02.02.2024',
    avatar: 'https://picsum.photos/seed/user2/100/100'
  },
  {
    id: '3',
    author: 'Парвиз Т.',
    rating: 5,
    text: 'Профессионалы своего дела. Делал чистку и отбеливание. Все на высшем уровне.',
    date: '20.01.2024',
    avatar: 'https://picsum.photos/seed/user3/100/100'
  }
];
