import { motion } from 'motion/react';
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
    <section className="py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6"
            >
              Часто задаваемые <span className="text-primary">вопросы</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 leading-relaxed mb-8"
            >
              Мы собрали ответы на самые популярные вопросы наших пациентов. Если вы не нашли нужную информацию, наш AI-ассистент всегда готов помочь.
            </motion.p>
            <div className="p-6 bg-primary/5 rounded-[32px] border border-primary/10">
              <h4 className="font-bold text-slate-900 mb-2">Не нашли ответ?</h4>
              <p className="text-sm text-slate-600 mb-4">Напишите нам в чат или позвоните напрямую.</p>
              <a href="tel:+992000000000" className="text-primary font-bold hover:underline">
                +992 (000) 00-00-00
              </a>
            </div>
          </div>

          <div className="lg:w-2/3 w-full">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {FAQS.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem value={`item-${index}`} className="border-none bg-slate-50 rounded-2xl px-6 overflow-hidden">
                    <AccordionTrigger className="hover:no-underline py-6 text-left font-bold text-slate-900 hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
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
