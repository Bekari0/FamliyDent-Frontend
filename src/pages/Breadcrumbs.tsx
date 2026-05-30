
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'motion/react';
import styles from './Breadcrumbs.module.css';
import { cn } from '@/lib/utils';

const routeConfig: Record<string, string> = {
 'about': 'О клинике',
 'services': 'Услуги',
 'doctors': 'Наши врачи',
 'reviews': 'Отзывы',
 'pricing': 'Цены',
 'blog': 'Блог',
 'contact': 'Контакты',
 'faq': 'Вопросы и ответы',
 'profile': 'Личный кабинет',
 'bookings': 'Мои записи',
 'records': 'Медицинская карта',
 'book': 'Запись на прием',
 'admin': 'Панель управления',
};

export function Breadcrumbs() {
 const location = useLocation();
 const pathnames = location.pathname.split('/').filter((x) => x);

 if (location.pathname === '/') return null;

 return (
 <nav aria-label="Breadcrumb" className={styles.nav}>
 <div className={styles.container}>
 <ol className={styles.list}>
 <li className={styles.item}>
 <Link 
 to="/" 
 className={styles.link}
 >
 <Home size={14} />
 <span className={styles.homeLabel}>Главная</span>
 </Link>
 </li>
 
 {pathnames.map((value, index) => {
 const last = index === pathnames.length - 1;
 const to = `/${pathnames.slice(0, index + 1).join('/')}`;
 const label = routeConfig[value] || value;

 return (
 <li key={to} className={cn(styles.item, "space-x-2")}>
 <ChevronRight size={14} className={styles.separator} />
 {last ? (
 <motion.span 
 initial={{ opacity: 0, x: -5 }}
 animate={{ opacity: 1, x: 0 }}
 className={styles.current}
 >
 {label}
 </motion.span>
 ) : (
 <Link 
 to={to} 
 className={styles.breadcrumbLink}
 >
 {label}
 </Link>
 )}
 </li>
 );
 })}
 </ol>
 </div>
 </nav>
 );
}

