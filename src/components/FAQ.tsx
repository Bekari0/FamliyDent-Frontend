import { motion, useReducedMotion } from 'motion/react';
import * as styles from './FAQ.styles';
import { getHomeMotionProps } from './home/home-behavior';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    question: 'Болезненно ли проходит лечение?',
    answer: 'Нет, мы используем современные методы местной анестезии, которые полностью блокируют болевые ощущения. Для особо чувствительных пациентов возможна седация.',
  },
  {
    question: 'Как часто нужно приходить на профессиональную гигиену?',
    answer: 'Мы рекомендуем проводить профессиональную чистку зубов каждые 6 месяцев. Это помогает предотвратить развитие кариеса и заболеваний десен.',
  },
  {
    question: 'С какого возраста можно приводить ребенка к стоматологу?',
    answer: 'Первый визит рекомендуется совершить при появлении первых зубов, но не позднее 1 года. Это поможет ребенку привыкнуть к врачу и сформировать правильные привычки.',
  },
  {
    question: 'Предоставляете ли вы гарантию на лечение?',
    answer: 'Да, мы предоставляем официальную гарантию на все виды работ: от пломб до имплантов. Срок гарантии зависит от вида услуги и фиксируется в договоре.',
  },
  {
    question: 'Можно ли установить имплант сразу после удаления зуба?',
    answer: 'В большинстве случаев — да. Это называется одномоментная имплантация. Однако окончательное решение принимает врач после осмотра и КТ-диагностики.',
  },
];

export function FAQ() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <motion.h2 {...getHomeMotionProps(shouldReduceMotion, { opacity: 0, x: -20 }, {})} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={styles.title}>
              Часто задаваемые <span className="text-accent">вопросы</span>
            </motion.h2>
            <motion.p {...getHomeMotionProps(shouldReduceMotion, { opacity: 0, x: -20 }, { delay: 0.1 })} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={styles.desc}>
              Мы собрали ответы на самые популярные вопросы наших пациентов. Если вы не нашли нужную информацию, мы всегда готовы проконсультировать вас лично.
            </motion.p>
            <div className={styles.supportCard}>
              <h4 className={styles.supportTitle}>Не нашли ответ?</h4>
              <p className={styles.supportDesc}>Напишите нам в чат или позвоните в клинику напрямую для подробной консультации со специалистом.</p>
              <a href="tel:+992446606600" className={styles.supportBtn}>+992 446 60 66 00</a>
            </div>
          </div>

          <div className={styles.accordionWrapper}>
            <Accordion type="single" collapsible className={styles.accordion}>
              {FAQS.map((faq, index) => (
                <motion.div key={faq.question} {...getHomeMotionProps(shouldReduceMotion, { opacity: 0, y: 10 }, { delay: index * 0.1 })} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <AccordionItem value={`item-${index}`} className={styles.accordionItem}>
                    <AccordionTrigger className={styles.accordionTrigger}>{faq.question}</AccordionTrigger>
                    <AccordionContent className={styles.accordionContent}>{faq.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
