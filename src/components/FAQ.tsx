import * as styles from './FAQ.styles';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Болезненно ли проходит лечение?",
    answer: "Нет, мы используем современные методы местной анестезии, которые полностью блокируют болевые ощущения. Для особо чувствительных пациентов возможна седация."
  },
  {
    question: "Как часто нужно приходить на профессиональную гигиену?",
    answer: "Мы рекомендуем проводить профессиональную чистку зубов каждые 6 месяцев. Это помогает предотвратить развитие кариеса и заболеваний десен."
  },
  {
    question: "С какого возраста можно приводить ребенка к стоматологу?",
    answer: "Первый визит рекомендуется совершить при появлении первых зубов, но не позднее 1 года. Это поможет ребенку привыкнуть к врачу и сформировать правильные привычки."
  },
  {
    question: "Предоставляете ли вы гарантию на лечение?",
    answer: "Да, мы предоставляем официальную гарантию на все виды работ: от пломб до имплантов. Срок гарантии зависит от вида услуги и фиксируется в договоре."
  },
  {
    question: "Можно ли установить имплант сразу после удаления зуба?",
    answer: "В большинстве случаев — да. Это называется одномоментная имплантация. Однако окончательное решение принимает врач после осмотра и КТ-диагностики."
  }
];

export function FAQ() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <p className={styles.kicker}>
              <span className={styles.kickerLine} aria-hidden="true" />
              Вопросы и ответы
            </p>
            <h2 className={styles.title}>
              Часто задаваемые вопросы
            </h2>
            <p className={styles.desc}>
              Мы собрали ответы на самые популярные вопросы наших пациентов. Если вы
              не нашли нужную информацию, мы всегда готовы проконсультировать вас лично.
            </p>
            <div className={styles.supportCard}>
              <h3 className={styles.supportTitle}>Не нашли ответ?</h3>
              <p className={styles.supportDesc}>
                Напишите нам в чат или позвоните в клинику напрямую для подробной
                консультации со специалистом.
              </p>
              <a href="tel:+992446606600" className={styles.supportBtn}>
                +992 446 60 66 00
              </a>
            </div>
          </div>

          <div className={styles.accordionWrapper}>
            <Accordion type="single" collapsible className={styles.accordion}>
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className={styles.accordionItem}>
                  <AccordionTrigger className={styles.accordionTrigger}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className={styles.accordionContent}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
