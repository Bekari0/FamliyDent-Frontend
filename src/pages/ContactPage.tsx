import React from 'react';
import { Contact as ContactComponent } from '../components/Contact';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, MessageCircle, ChevronRight, Navigation, Bus, Car, Train } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function ContactPage() {
 return (
 <div className="pb-20 bg-background">
 <div className="container mx-auto px-4">
 <div className="mb-8">
 <Button variant="ghost" asChild className="hover:bg-secondary rounded-xl">
 <Link to="/" className="flex items-center gap-2 text-text-secondary font-bold text-xs uppercase tracking-widest">
 <ChevronRight className="w-4 h-4 rotate-180" />
 Вернуться на главную
 </Link>
 </Button>
 </div>

 {/* Hero Section for Contact Page */}
 <div className="mb-16">
 <div className="bg-card rounded-[48px] p-12 border border-border shadow-xl shadow-foreground/5 flex flex-col lg:flex-row gap-12">
 <div className="flex-1">
 <h1 className="text-4xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
 Мы всегда <br />
 ряду с <span className="text-primary italic">вами</span>
 </h1>
 <p className="text-lg text-text-secondary mb-10 max-w-md">
 Наши клиники расположены в центре города с удобным подъездом и парковкой.
 </p>
 
 <div className="grid grid-cols-2 gap-4">
 <a 
 href="https://yandex.tj/maps/" 
 target="_blank" 
 rel="noreferrer"
 className="h-16 px-6 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
 >
 <Navigation className="w-5 h-5" />
 Проложить маршрут
 </a>
 <button className="h-16 px-6 bg-foreground text-card rounded-2xl flex items-center justify-center gap-3 font-bold hover:scale-105 transition-all shadow-lg shadow-foreground/10">
 <Clock className="w-5 h-5 text-primary" />
 Все филиалы
 </button>
 </div>
 </div>
 
 <div className="lg:w-1/3 space-y-4">
 <div className="p-6 rounded-3xl bg-secondary border border-border">
 <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
 <Clock className="w-4 h-4" />
 Часы работы
 </h3>
 <div className="space-y-2">
 <div className="flex justify-between items-center text-sm">
 <span className="text-text-secondary">Пн - Пт:</span>
 <span className="font-bold text-foreground">08:00 - 20:00</span>
 </div>
 <div className="flex justify-between items-center text-sm">
 <span className="text-text-secondary">Сб - Вс:</span>
 <span className="font-bold text-foreground">09:00 - 18:00</span>
 </div>
 </div>
 </div>
 
 <div className="p-6 rounded-3xl bg-secondary border border-border">
 <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
 <Bus className="w-4 h-4" />
 Как добраться
 </h3>
 <ul className="space-y-3">
 <li className="flex gap-3 text-sm">
 <Bus className="w-4 h-4 text-primary shrink-0 mt-1" />
 <div>
 <div className="font-bold">Автобус №2, №10</div>
 <div className="text-text-secondary">Остановка «Центральная клиника»</div>
 </div>
 </li>
 <li className="flex gap-3 text-sm">
 <Car className="w-4 h-4 text-primary shrink-0 mt-1" />
 <div>
 <div className="font-bold">Парковка</div>
 <div className="text-text-secondary">Бесплатная стоянка перед входом</div>
 </div>
 </li>
 </ul>
 </div>
 </div>
 </div>
 </div>
 </div>
 <ContactComponent />
 </div>
 );
}

