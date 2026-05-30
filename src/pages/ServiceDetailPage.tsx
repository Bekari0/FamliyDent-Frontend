
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MOCK_SERVICES } from '../data/mockData';
import { Button } from '../components/ui/button';
import { ChevronRight, Clock, Banknote, ShieldCheck } from 'lucide-react';

export function ServiceDetailPage() {
 const { id } = useParams();
 const service = MOCK_SERVICES.find(s => s.id === id);

 if (!service) return <div className="py-20 text-center">Услуга не найдена</div>;

 return (
 <div className="pt-24 pb-20">
 <div className="container mx-auto px-4">
 <div className="mb-8">
 <Button variant="ghost" asChild>
 <Link to="/services">
 <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
 Ко всем услугам
 </Link>
 </Button>
 </div>

 <div className="grid lg:grid-cols-3 gap-12">
 <div className="lg:col-span-2">
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-6"
 >
 {service.title}
 </motion.h1>
 
 <p className="text-xl text-text-secondary mb-8 leading-relaxed">
 {service.description}
 </p>

 <div className="bg-secondary rounded-[32px] p-8 mb-12 grid sm:grid-cols-3 gap-6">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-primary shadow-sm">
 <Clock className="w-6 h-6" />
 </div>
 <div>
 <div className="text-xs text-text-secondary font-bold uppercase tracking-wider">Длительность</div>
 <div className="font-bold text-foreground">{service.duration} мин</div>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-primary shadow-sm">
 <Banknote className="w-6 h-6" />
 </div>
 <div>
 <div className="text-xs text-text-secondary font-bold uppercase tracking-wider">Стоимость</div>
 <div className="font-bold text-foreground">от {service.price} смн</div>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-primary shadow-sm">
 <ShieldCheck className="w-6 h-6" />
 </div>
 <div>
 <div className="text-xs text-text-secondary font-bold uppercase tracking-wider">Гарантия</div>
 <div className="font-bold text-foreground">до 5 лет</div>
 </div>
 </div>
 </div>

 <div className="prose prose-stone max-w-none">
 <h2 className="text-2xl font-bold mb-4">О процедуре</h2>
 <p>Здесь представлено подробное описание процедуры {service.title}. Мы используем только самое современное оборудование и сертифицированные материалы.</p>
 <ul className="grid sm:grid-cols-2 gap-4 list-none p-0 mt-8">
 {['Безболезненность', 'Высокая точность', 'Минимальный срок заживления', 'Лучшие материалы'].map((item, i) => (
 <li key={i} className="flex items-center gap-3 bg-card p-4 rounded-2xl border border-border shadow-sm">
 <div className="w-2 h-2 rounded-full bg-primary" />
 <span className="font-medium">{item}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>

 <div className="lg:col-span-1">
 <div className="sticky top-32 bg-primary rounded-[40px] p-8 text-white shadow-2xl shadow-primary/30">
 <h3 className="text-2xl font-bold mb-4">Записаться на прием</h3>
 <p className="opacity-90 mb-8 text-sm">Оставьте заявку, и мы перезвоним вам в течение 15 минут для согласования времени.</p>
 <Link to="/book">
 <Button className="w-full bg-card text-primary hover:bg-secondary h-14 rounded-2xl font-bold text-lg">
 Записаться
 </Button>
 </Link>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

