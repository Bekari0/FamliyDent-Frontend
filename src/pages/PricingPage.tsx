
import React from 'react';
import { motion } from 'motion/react';
import { MOCK_SERVICES } from '../data/mockData';
import { Check, ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import * as styles from './PricingPage.styles';


export function PricingPage() {
 const categories = Array.from(new Set(MOCK_SERVICES.map(s => s.category)));
 const { openBooking } = useBooking();

 return (
 <div className={styles.page}>
 <div className={styles.container}>
 <div className={styles.backWrapper}>
 <Link to="/" className={styles.backBtn}>
 <ChevronRight className="w-4 h-4 rotate-180" />
 Вернуться на главную
 </Link>
 </div>

 <div className={styles.header}>
 <div className={styles.badge}>Клинические услуги</div>
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className={styles.title}
 >
 Прозрачное <span className={styles.titleSpan}>ценообразование</span>
 </motion.h1>
 <p className={styles.desc}>
 Мы предлагаем честный подход к лечению. Все цены указаны в сомони (TJS) и включают стоимость основных расходных материалов.
 </p>
 </div>

 <div className="space-y-12">
 {categories.map((cat, idx) => (
 <motion.div 
 key={cat}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.1 }}
 className={styles.categoryCard}
 >
 <div className={styles.categoryHeader}>
 <h2 className={styles.categoryTitle}>{cat}</h2>
 <div className={styles.categoryBadge}>
 {MOCK_SERVICES.filter(s => s.category === cat).length} процедур
 </div>
 </div>
 <div className={styles.listWrapper}>
 <div className="space-y-2">
 {MOCK_SERVICES.filter(s => s.category === cat).map((service) => (
 <div key={service.id} className={styles.serviceItem}>
 <div className="flex items-center gap-5">
 <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
 <div>
 <span className={styles.serviceTitle}>{service.title}</span>
 <span className={styles.serviceMeta}>Длительность: {service.duration} мин • Гарантия FamilyDent</span>
 </div>
 </div>
 <div className={styles.priceRow}>
 <span className="text-slate-400 text-xs font-bold mr-1">от</span>
 <span className={styles.priceValue}>{service.price}</span>
 <span className={styles.priceCurrency}>TJS</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 <div className={styles.ctaCard}>
 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
 
 <div className={styles.ctaContent}>
 <h3 className={styles.ctaTitle}>Нужен точный <br /><span className="text-primary">расчет лечения?</span></h3>
 <p className={styles.ctaDesc}>Запишитесь на прием, и наши эксперты составят индивидуальный план лечения с учетом всех нюансов и точной стоимостью.</p>
 </div>

 <div className={styles.ctaActions}>
 <button onClick={() => openBooking()} className={styles.ctaBtn}>
 <Calendar className="w-5 h-5" />
 Записаться сейчас
 </button>
 <div className={styles.benefits}>
 <div className="flex items-center gap-3 text-slate-400">
 <Check className="w-4 h-4 text-primary" />
 <span className="text-[10px] font-black uppercase tracking-widest">План лечения</span>
 </div>
 <div className="flex items-center gap-3 text-slate-400">
 <Check className="w-4 h-4 text-primary" />
 <span className="text-[10px] font-black uppercase tracking-widest">Без скрытых платежей</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}


