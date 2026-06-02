import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import * as styles from './Footer.styles';
import logoWhite from '../assets/images/logo/LogoWhite.svg';

import { 
 Instagram, Facebook, Mail, MapPin, Phone, 
 ArrowRight, Heart 
} from 'lucide-react';

export function Footer() {
 const currentYear = new Date().getFullYear();

 return (
 <footer className={styles.footer}>
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64" />
 <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -ml-64 -mb-64" />

 <div className={styles.container}>
 <div className={styles.grid}>
 <div className={styles.brandCol}>
 <Link to="/" className={styles.logo}>
 <img src={logoWhite} alt="FamilyDent" className={styles.logoImage} />
 <span className={styles.logoText}>
 Family<span className={styles.logoSpan}>Dent</span>
 </span>
 </Link>
 <p className={styles.tagline}>
 Создаем здоровые и красивые улыбки с использованием передовых технологий и искренней заботой о каждом пациенте.
 </p>
 <div className={styles.socials}>
 <a href="#" className={styles.socialBtn}><Instagram className="w-5 h-5" /></a>
 <a href="#" className={styles.socialBtn}><Facebook className="w-5 h-5" /></a>
 <a href="#" className={styles.socialBtn}><Mail className="w-5 h-5" /></a>
 </div>
 </div>

 <div>
 <h4 className={styles.navTitle}>
 <div className={styles.navDot} />
 Навигация
 </h4>
 <ul className={styles.navList}>
 {[
 { label: 'Главная', href: '/' },
 { label: 'Услуги', href: '/services' },
 { label: 'Врачи', href: '/doctors' },
 { label: 'Цены', href: '/pricing' },
 { label: 'О нас', href: '/about' },
 { label: 'Блог', href: '/blog' },
 { label: 'Контакты', href: '/contact' }
 ].map((link) => (
 <li key={link.label}>
 <Link to={link.href} className={styles.navLink}>
 <ArrowRight className={styles.navArrow} />
 {link.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 <div>
 <h4 className={styles.navTitle}>
 <div className={styles.navDot} />
 Услуги
 </h4>
 <ul className={styles.navList}>
 {[
 'Терапия',
 'Имплантация',
 'Ортодонтия',
 'Гигиена',
 'Отбеливание',
 'Детский прием'
 ].map((item) => (
 <li key={item}>
 <Link to="/services" className={styles.navLink}>
 <ArrowRight className={styles.navArrow} />
 {item}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 <div>
 <h4 className={styles.navTitle}>
 <div className={styles.navDot} />
 Контакты
 </h4>
 <div className="space-y-6">
 <div className={styles.contactItem}>
 <div className={styles.contactIcon}><MapPin className="w-5 h-5" /></div>
 <div className={styles.contactText}>
 г. Душанбе, <br />
 ул. Рудаки 123
 </div>
 </div>
 <a href="tel:+992446606600" className={styles.contactItem}>
 <div className={styles.contactIcon}><Phone className="w-5 h-5" /></div>
 <div className="font-bold text-lg text-white">+992 446 60 66 00</div>
 </a>
 <div className={styles.contactItem}>
 <div className={styles.contactIcon}><Mail className="w-5 h-5" /></div>
 <div className={styles.contactText}>info@familydent.tj</div>
 </div>
 </div>
 </div>
 </div>

 <div className={styles.bottom}>
 <div className={styles.copyright}>
 <span>© {currentYear} FamilyDent. Все права защищены.</span>
 <div className="flex items-center gap-2">
 <span className="text-slate-700">|</span>
 <span className="flex items-center gap-2">
 Сделано с любовью для вашей улыбки
 </span>
 </div>
 </div>
 <div className={styles.legal}>
 <a href="#" className={styles.legalLink}>Приватность</a>
 <a href="#" className={styles.legalLink}>Оферта</a>
 </div>
 </div>
 </div>
 </footer>
 );
}


