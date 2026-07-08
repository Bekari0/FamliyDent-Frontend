
import React from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FAQS = [
 { q: 'Как часто нужно проходить осмотр?', a: 'Мы рекомендуем посещать стоматолога не реже одного раза в полгода для профилактического осмотра и профессиональной гигиены.' },
 { q: 'Болезненно ли лечение зубов?', a: 'В нашей клинике мы используем современные методы анестезии, которые делают процедуру абсолютно безболезненной даже для самых чувствительных пациентов.' },
 { q: 'С какого возраста можно приводить ребенка?', a: 'Первый визит рекомендуется совершить в возрасте 1 года, чтобы ребенок привык к обстановке и врач мог оценить правильность формирования прикуса.' },
 { q: 'Что такое профессиональная гигиена?', a: 'Это комплекс процедур (AirFlow, УЗ-чистка), направленный на удаление налета и зубного камня, которые невозможно убрать в домашних условиях.' },
 { q: 'Какие гарантии предоставляет клиника?', a: 'Мы даем гарантию на все виды терапевтического лечения до 2 лет, на имплантацию — до 10 лет, при условии соблюдения рекомендаций врача.' },
];

export function FAQPage() {
 const [openIdx, setOpenIdx] = React.useState<number | null>(0);

 return (
 <div className="pb-20 bg-background min-h-screen">
 <div className="container mx-auto px-4">
 <div className="mb-12">
 <Button variant="ghost" asChild>
 <Link to="/">
 <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
 Назад на главную
 </Link>
 </Button>
 </div>
 <div className="flex flex-col lg:flex-row gap-16">
 <div className="lg:w-1/3">
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 className="sticky top-32"
 >
 <h1 className="text-5xl font-display font-semibold text-foreground mb-8 leading-tight">
 Часто задаваемые <span className="text-primary italic">вопросы</span>
 </h1>
 <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
 Мы собрали ответы на самые популярные вопросы наших пациентов. Если вы не нашли нужную информацию, свяжитесь с нами.
 </p>
 
 <div className="relative">
 <input 
 type="text" 
 placeholder="Поиск по вопросам..." 
 className="w-full h-16 pl-14 pr-6 rounded-lg border-none shadow-xl focus:ring-2 focus:ring-primary/20 text-lg transition-all"
 />
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
 </div>
 </motion.div>
 </div>

 <div className="lg:w-2/3">
 <div className="space-y-6">
 {FAQS.map((faq, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.1 }}
 className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
 >
 <button 
 onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
 className="w-full p-8 flex items-center justify-between text-left group"
 >
 <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{faq.q}</span>
 <div className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${openIdx === idx ? 'bg-primary text-primary-foreground rotate-180' : 'bg-secondary text-muted-foreground'}`}>
 {openIdx === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
 </div>
 </button>
 {openIdx === idx && (
 <motion.div 
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 className="px-8 pb-8 text-muted-foreground leading-relaxed text-lg border-t border-border/50 pt-6"
 >
 {faq.a}
 </motion.div>
 )}
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

