import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as styles from './AboutPage.styles';

const VALUES = [
 { title: 'Комфорт', desc: 'Создаем спокойную атмосферу и подбираем лечение так, чтобы пациенту было удобно на каждом этапе.' },
 { title: 'Точность', desc: 'Используем современную диагностику и внимательно контролируем все этапы лечения.' },
 { title: 'Честность', desc: 'Объясняем план лечения простым языком и не навязываем лишние услуги.' },
];

export function AboutPage() {
 return (
 <div className={styles.page}>
 <div className={styles.container}>
 <div className={styles.backWrapper}>
 <Link to="/" className={styles.backButton}>
 <ChevronRight className={styles.backIcon} />
 Вернуться на главную
 </Link>
 </div>

 <div className={styles.mainGrid}>
 <motion.div
 initial={{ opacity: 0, x: -30 }}
 animate={{ opacity: 1, x: 0 }}
 >
 <div className={styles.badge}>Миссия клиники</div>
 <h1 className={styles.title}>
 Создаем улыбки, <br />
 <span className={styles.titleAccent}>которым доверяют</span>
 </h1>
 <p className={styles.description}>
 FamilyDent - современная стоматологическая клиника в Душанбе. Мы объединяем опыт врачей, точную диагностику и внимательное отношение к каждому пациенту, чтобы лечение было понятным, комфортным и эффективным.
 </p>
 <div className={styles.statsGrid}>
 <div>
 <div className={styles.statValue}>12+</div>
 <div className={styles.statLabel}>Лет опыта</div>
 </div>
 <div>
 <div className={styles.statValue}>15к+</div>
 <div className={styles.statLabel}>Довольных пациентов</div>
 </div>
 </div>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className={styles.imageBox}
 >
 <div className={styles.imageWrapper}>
 <img
 src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000"
 alt="FamilyDent Clinic"
 className={styles.image}
 />
 </div>
 <div className={styles.infoCard}>
 <div className={styles.iconBox}>
 <Award className={styles.infoIcon} />
 </div>
 <div>
 <div className={styles.infoCardTitle}>Клиника FamilyDent</div>
 <div className={styles.infoCardDescription}>Забота, точность и честный подход</div>
 </div>
 </div>
 </motion.div>
 </div>

 <div className={styles.valuesSection}>
 <div className={styles.valuesInner}>
 <h2 className={styles.valuesTitle}>
 Наши основные <span className={styles.valuesTitleAccent}>принципы</span>
 </h2>
 <div className={styles.valuesGrid}>
 {VALUES.map((item) => (
 <div key={item.title} className={styles.valueItem}>
 <div className={styles.valueIcon}>
 <CheckCircle2 className={styles.valueIconInner} />
 </div>
 <h4 className={styles.valueTitle}>{item.title}</h4>
 <p className={styles.valueDescription}>{item.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

