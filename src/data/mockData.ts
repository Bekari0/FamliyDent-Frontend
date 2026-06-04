
import { Doctor, Service, Article, Booking, UserRole } from '../types';

// 1. Услуги
export const MOCK_SERVICES: Service[] = [
 { id: 's1', title: 'Лечение кариеса', category: 'Терапия', price: 350, duration: 60, description: 'Профессиональное лечение кариеса любой сложности.' },
 { id: 's2', title: 'Профгигиена AirFlow', category: 'Гигиена', price: 450, duration: 45, description: 'Удаление налета и зубного камня современным методом.' },
 { id: 's3', title: 'Отбеливание Zoom 4', category: 'Эстетика', price: 2500, duration: 90, description: 'Безопасное отбеливание зубов на 8-10 тонов.' },
 { id: 's4', title: 'Установка импланта', category: 'Хирургия', price: 15000, duration: 120, description: 'Имплантация зубов премиальными системами.' },
 { id: 's5', title: 'Керамические виниры', category: 'Эстетика', price: 12000, duration: 180, description: 'Создание идеальной улыбки.' },
 { id: 's6', title: 'Брекет-система', category: 'Ортодонтия', price: 45000, duration: 60, description: 'Исправление прикуса современными системами.' },
 { id: 's7', title: 'Детский осмотр', category: 'Детская', price: 200, duration: 30, description: 'Первый визит к стоматологу без страха.' },
 { id: 's8', title: 'Удаление зуба', category: 'Хирургия', price: 800, duration: 40, description: 'Быстрое и безболезненное удаление.' },
 { id: 's9', title: 'Протезирование', category: 'Ортопедия', price: 8000, duration: 120, description: 'Восстановление зубов коронками.' },
 { id: 's10', title: 'Лечение каналов', category: 'Эндодонтия', price: 1200, duration: 90, description: 'Спасение зуба при пульпите.' },
 // Дополнительные позиции для разнообразия
 { id: 's11', title: 'Установка элайнеров', category: 'Ортодонтия', price: 120000, duration: 60, description: 'Прозрачные каппы для выравнивания.' },
 { id: 's12', title: 'КТ челюсти', category: 'Диагностика', price: 1500, duration: 20, description: '3D диагностика высокого разрешения.' },
 { id: 's13', title: 'Синус-лифтинг', category: 'Хирургия', price: 25000, duration: 90, description: 'Наращивание костной ткани.' },
 { id: 's14', title: 'Серебрение зубов', category: 'Детская', price: 300, duration: 30, description: 'Остановка кариеса у малышей.' },
 { id: 's15', title: 'Ночная капа', category: 'Терапия', price: 3000, duration: 30, description: 'Защита зубов от бруксизма.' },
];

// 2. Врачи
export const MOCK_DOCTORS: Doctor[] = Array.from({ length: 20 }, (_, i) => ({
 id: `d${i + 1}`,
 name: i % 2 === 0 ? `Др. Имя${i + 1} Фамилия${i + 1}` : `Дарья Александровна ${i + 1}`,
 specialty: ['Терапевт', 'Хирург', 'Ортодонт', 'Детский стоматолог', 'Ортопед'][i % 5],
 experience: `${5 + (i % 20)} лет`,
 image: `https://i.pravatar.cc/300?img=${i + 10}`,
 description: 'Высококвалифицированный специалист с международным опытом.',
 education: ['МГМУ им. Сеченова', 'Стажировка в Германии'],
 achievements: ['Врач высшей категории', 'Автор 5 научных работ'],
 rating: 4.5 + (Math.random() * 0.5),
 reviewsCount: 10 + i * 5
}));

// 3. Статьи
export const MOCK_ARTICLES: Article[] = Array.from({ length: 50 }, (_, i) => ({
 id: `post-${i + 1}`,
 title: `Статья о здоровье зубов №${i + 1}`,
 excerpt: 'Краткое описание того, как правильно ухаживать за полостью рта в современных условиях.',
 content: 'Здесь находится очень длинный и полезный текст статьи. '.repeat(20),
 author: 'Администрация FamilyDent',
 date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
 image: `https://picsum.photos/seed/post${i}/800/400`,
 tags: ['здоровье', 'советы', 'технологии']
}));

// 4. Записи
export const MOCK_BOOKINGS: Booking[] = Array.from({ length: 300 }, (_, i) => ({
 id: `b${i + 1}`,
 patientId: `u${(i % 50) + 1}`,
 doctorId: `d${(i % 20) + 1}`,
 serviceId: `s${(i % 15) + 1}`,
 date: new Date(Date.now() + (Math.random() * 30 * 86400000)).toISOString().split('T')[0],
 time: `${9 + (i % 10)}:00`,
 status: ['pending', 'confirmed', 'completed'][i % 3] as any,
 createdAt: Date.now() - (Math.random() * 10 * 86400000)
}));

// 5. Отзывы
export const MOCK_REVIEWS = Array.from({ length: 150 }, (_, i) => ({
 id: `r${i + 1}`,
 patientId: `u${(i % 50) + 1}`,
 patientName: `Пациент ${i + 1}`,
 doctorId: `d${(i % 20) + 1}`,
 rating: 4 + (Math.random() > 0.5 ? 1 : 0),
 comment: 'Отличная клиника, очень доволен результатом и отношением персонала!'.repeat(i % 2 + 1),
 date: new Date(Date.now() - i * 43200000).toLocaleDateString(),
 createdAt: Date.now() - i * 43200000
}));
