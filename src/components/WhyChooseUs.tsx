import { motion } from 'motion/react';
import { Shield, Clock, Heart, Award, Microscope, ThumbsUp } from 'lucide-react';
import * as styles from './WhyChooseUs.styles';


const REASONS = [
 {
 title: 'Современное оборудование',
 description: 'Используем цифровые сканеры, микроскопы и лазерные технологии для максимальной точности.',
 icon: Microscope
 },
 {
 title: 'Безболезненное лечение',
 description: 'Применяем современные методы анестезии и седации для вашего комфорта.',
 icon: Shield
 },
 {
 title: 'Опытные специалисты',
 description: 'Наши врачи регулярно проходят стажировки в Европе и России.',
 icon: Award
 },
 {
 title: 'Забота о каждом',
 description: 'Индивидуальный подход и уютная атмосфера, где каждый чувствует себя как дома.',
 icon: Heart
 },
 {
 title: 'Экономия времени',
 description: 'Работаем быстро и эффективно, ценим ваше время и предлагаем удобный график.',
 icon: Clock
 },
 {
 title: 'Гарантия качества',
 description: 'Предоставляем официальную гарантию на все виды стоматологических работ.',
 icon: ThumbsUp
 }
];

export function WhyChooseUs() {
 return (
 <section className={styles.section}>
 {/* Фоновые элементы */}
 <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mt-32" />
 <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mb-32" />

 <div className={styles.container}>
 <div className={styles.header}>
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 className={styles.badge}
 >
 Наши преимущества
 </motion.div>
 <motion.h2 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className={styles.title}
 >
 Почему выбирают <span className={styles.titleSpan}>FamilyDent</span>?
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className={styles.desc}
 >
 Мы создали клинику, где передовые технологии встречаются с искренней заботой о пациенте.
 </motion.p>
 </div>

 <div className={styles.grid}>
 {REASONS.map((reason, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className={styles.card}
 >
 <div className={styles.iconWrapper}>
 <reason.icon className="w-8 h-8" />
 </div>
 <h3 className={styles.cardTitle}>
 {reason.title}
 </h3>
 <p className={styles.cardDesc}>
 {reason.description}
 </p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}



