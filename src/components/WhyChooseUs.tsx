import { motion } from 'motion/react';
import { Shield, Clock, Heart, Award, Microscope, ThumbsUp } from 'lucide-react';

const REASONS = [
  {
    title: 'Современное оборудование',
    description: 'Используем цифровые сканеры, микроскопы и лазерные технологии для максимальной точности.',
    icon: Microscope,
    color: 'bg-blue-500'
  },
  {
    title: 'Безболезненное лечение',
    description: 'Применяем современные методы анестезии и седации для вашего комфорта.',
    icon: Shield,
    color: 'bg-green-500'
  },
  {
    title: 'Опытные специалисты',
    description: 'Наши врачи регулярно проходят стажировки в Европе и США.',
    icon: Award,
    color: 'bg-purple-500'
  },
  {
    title: 'Забота о каждом',
    description: 'Индивидуальный подход и уютная атмосфера, где каждый чувствует себя как дома.',
    icon: Heart,
    color: 'bg-red-500'
  },
  {
    title: 'Экономия времени',
    description: 'Работаем быстро и эффективно, ценим ваше время и предлагаем удобный график.',
    icon: Clock,
    color: 'bg-orange-500'
  },
  {
    title: 'Гарантия качества',
    description: 'Предоставляем официальную гарантию на все виды стоматологических работ.',
    icon: ThumbsUp,
    color: 'bg-teal-500'
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6"
          >
            Почему выбирают <span className="text-primary">FamilyDent</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Мы создали клинику, в которую хочется возвращаться. Наша цель — не просто лечить зубы, а дарить уверенность и здоровье.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {REASONS.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 bg-white rounded-[32px] soft-shadow hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 border border-slate-100"
            >
              <div className={`w-16 h-16 ${reason.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-current/20 group-hover:scale-110 transition-transform duration-500`}>
                <reason.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
