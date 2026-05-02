import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ShieldCheck, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';

export function Hero() {

  const { openBooking } = useBooking();

  return (
    <section className="hero-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="secondary" className="hero-badge">
                <Star className="w-3.5 h-3.5 mr-2 fill-primary" />
                Стоматология №1 в Душанбе
              </Badge>
            </motion.div>
            
            <h1 className="hero-title">
              Ваша улыбка — <br className="hidden sm:block" />
              наша <span className="text-primary relative">
                забота
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h1>
            
            <p className="hero-description">
              FamilyDent — это сочетание передовых технологий, опыта лучших врачей и искренней заботы о каждом пациенте. Мы создаем здоровые улыбки для всей семьи.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 mb-16">
              <Button size="lg" className="hero-btn-primary group">
                <Calendar className="w-5 h-5 mr-3" />
                Записаться на прием
                <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Button>
              <Button size="lg" variant="outline" render={<Link to="/services" />} nativeButton={false} className="hero-btn-outline">
                Наши услуги
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 lg:gap-12">
              <div className="hero-feature-card group">
                <div className="hero-feature-icon-wrapper group-hover:bg-accent group-hover:text-white">
                  <ShieldCheck className="w-7 h-7 text-accent group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 text-lg">100% Гарантия</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">на все виды работ</div>
                </div>
              </div>
              <div className="hero-feature-card group">
                <div className="hero-feature-icon-wrapper group-hover:bg-primary group-hover:text-white">
                  <Users className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 text-lg">10,000+</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">счастливых пациентов</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="flex-1 relative w-full max-w-[600px] lg:max-w-none"
          >
            <div className="hero-image-container">
              <img 
                src="/images/about/offerImage.jpg" 
                alt="FamilyDent Clinic" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </div>

            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hero-floating-card top-1/4 -left-8 lg:-left-16"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                <Star className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-base">Рейтинг 5.0</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">на основе 500+ отзывов</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="hero-floating-card bottom-1/4 -right-8 lg:-right-16"
            >
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-base">Запись онлайн</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">24/7 через AI-чат</div>
              </div>
            </motion.div>

            {/* Background Blobs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
