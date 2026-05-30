import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
 Stethoscope, Sparkles, Zap, Activity, Scissors, Sun, 
 ArrowRight, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as styles from './Services.styles';


const ICON_MAP: Record<string, any> = {
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

export function Services() {
 const [services, setServices] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchServices = async () => {
 try {
 const response = await axios.get('/api/services');
 setServices(Array.isArray(response.data) ? response.data : []);
 } catch (error) {
 console.error('Error fetching services:', error);
 } finally {
 setLoading(false);
 }
 };
 fetchServices();
 }, []);

 return (
 <section id="services" className={styles.section}>
 <div className={styles.container}>
 <div className={styles.header}>
 <div>
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 className={styles.badge}
 >
 Наши услуги
 </motion.div>
 <motion.h2 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className={styles.title}
 >
 Профессиональная <span className={styles.titleSpan}>забота</span> о вашей улыбке
 </motion.h2>
 </div>
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 >
 <Link to="/services">
 <Button variant="outline" className={styles.seeAllBtn}>
 Все услуги
 <ArrowRight className="w-4 h-4" />
 </Button>
 </Link>
 </motion.div>
 </div>

 {loading ? (
 <div className="py-20 flex justify-center items-center">
 <Loader2 className="w-10 h-10 animate-spin text-primary" />
 </div>
 ) : (
 <div className={styles.grid}>
 {services.map((cat, index) => {
 const Icon = ICON_MAP[cat.category] || Stethoscope;
 return (
 <motion.div
 key={cat._id || index}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 >
 <Link to={`/pricing`} className={styles.card}>
 <div className={styles.iconWrapper}>
 <Icon className="w-8 h-8" />
 </div>
 
 <h3 className={styles.cardTitle}>
 {cat.category}
 </h3>
 
 <ul className={styles.serviceList}>
 {cat.services.slice(0, 3).map((s: string) => (
 <li key={s} className={styles.serviceItem}>
 <div className={styles.serviceDot} />
 {s}
 </li>
 ))}
 {cat.services.length > 3 && (
 <li className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded inline-block">
 +{cat.services.length - 3} услуги
 </li>
 )}
 </ul>

 <div className={styles.cardFooter}>
 <span className={styles.footerText}>{cat.services.length} процедур</span>
 <ArrowRight className={styles.arrowIcon} />
 </div>
 </Link>
 </motion.div>
 );
 })}
 </div>
 )}
 </div>
 </section>
 );
}




