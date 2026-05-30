import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { useBooking } from '@/context/BookingContext';
import { 
 Stethoscope, Sparkles, Zap, Activity, Scissors, Sun, 
 CheckCircle2, Calendar, Phone, Loader2
} from 'lucide-react';
import { FALLBACK_SERVICES } from '@/fallbackData';
import * as styles from './ServicesPage.styles';


interface CategoryService {
 _id: string;
 category: string;
 services: string[];
}

const CATEGORY_ICON_MAP: Record<string, any> = {
 "Профессиональная гигиена и профилактика": Sparkles,
 "Ортопедия (протезирование)": Stethoscope,
 "Ортодонтия (выравнивание зубов)": Zap,
 "Хирургическая стоматология": Scissors,
 "Имплантология": Activity,
 "Детская стоматология": Sun,
 "Эстетическая стоматология": Sparkles,
 "Терапевтическая стоматология (лечение)": Stethoscope,
 "Диагностика": Activity,
};

export function ServicesPage() {
 const [categories, setCategories] = useState<CategoryService[]>([]);
 const [loading, setLoading] = useState(true);
 const { openBooking } = useBooking();

 useEffect(() => {
 const fetchServices = async () => {
 try {
 const response = await axios.get('/api/services');
 setCategories(Array.isArray(response.data) ? response.data : []);
 } catch (err) {
 console.error('Ошибка загрузки услуг, используем резервные данные:', err);
 setCategories(FALLBACK_SERVICES);
 } finally {
 setLoading(false);
 }
 };
 fetchServices();
 }, []);

 if (loading) {
 return (
 <div className={styles.page}>
 <div className="flex flex-col items-center justify-center py-40">
 <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
 <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Загрузка услуг...</p>
 </div>
 </div>
 );
 }

 return (
 <div className={styles.page}>
 <div className={styles.container}>
 <div className={styles.headerSection}>
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className={styles.badge}
 >
 Наши возможности
 </motion.div>
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className={styles.title}
 >
 Профессиональная забота о вашей <span className={styles.titleSpan}>улыбке</span>
 </motion.h1>
 <p className={styles.desc}>
 От профилактики до сложнейших операций — мы предоставляем полный спектр стоматологической помощи высшего уровня.
 </p>
 </div>

 <div className={styles.grid}>
 {categories.map((category, index) => {
 const Icon = CATEGORY_ICON_MAP[category.category] || Activity;
 return (
 <motion.div
 key={category._id}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.05 }}
 >
 <Card className={styles.card}>
 <div className={styles.cardHeader}>
 <div className={styles.iconWrapper}>
 <Icon className="w-8 h-8" />
 </div>
 <h3 className={styles.cardTitle}>{category.category}</h3>
 </div>

 <ul className={styles.serviceList}>
 {category.services.map((service, idx) => (
 <li key={idx} className={styles.serviceItem}>
 <CheckCircle2 className={styles.serviceIcon} />
 <span className={styles.serviceText}>{service}</span>
 </li>
 ))}
 </ul>

 <div className={styles.cardFooter}>
 <button onClick={() => openBooking()} className={styles.bookBtn}>
 <Calendar className="w-5 h-5" />
 Записаться на прием
 </button>
 </div>
 </Card>
 </motion.div>
 );
 })}
 </div>

 {/* CTA SECTION */}
 <div className={styles.ctaSection}>
 {/* Ornaments */}
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -mr-64 -mt-64" />
 <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] -ml-48 -mb-48" />

 <div className={styles.ctaContent}>
 <div className={styles.ctaTextWrapper}>
 <h2 className={styles.ctaTitle}>
 Не знаете, какая процедура <br />
 <span className="text-primary italic">вам нужна?</span>
 </h2>
 <p className={styles.ctaDesc}>
 Запишитесь на консультацию, и наши специалисты составят индивидуальный план лечения специально для вас.
 </p>
 <div className="flex flex-col sm:flex-row items-center gap-8">
 <button onClick={() => openBooking()} className={styles.ctaBtn}>
 <Calendar className="w-5 h-5" />
 Записаться онлайн
 </button>
 <a href="tel:+992446606600" className={styles.ctaPhone}>
 <div className={styles.ctaPhoneIcon}>
 <Phone className="w-6 h-6" />
 </div>
 <div>
 <span className={styles.ctaPhoneLabel}>Связаться с нами</span>
 <span className={styles.ctaPhoneNum}>+992 446 60 66 00</span>
 </div>
 </a>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}



