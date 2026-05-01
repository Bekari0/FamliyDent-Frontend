import { Doctor, Review } from './types';

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
