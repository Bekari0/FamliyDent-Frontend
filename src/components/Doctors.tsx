import { motion } from 'motion/react';
import { DOCTORS } from '@/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Instagram, Facebook, Award, GraduationCap, Star, Calendar } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

export function Doctors() {
  const { openBooking } = useBooking();

  return (
    <section id="doctors" className="section-padding bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Award className="w-4 h-4" />
            Наши эксперты
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title mb-6"
          >
            Познакомьтесь с <span className="text-primary">профессионалами</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Команда FamilyDent — это врачи высшей категории, которые любят свою работу и постоянно совершенствуют свои навыки.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {DOCTORS.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group border-none bg-transparent shadow-none overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-8 soft-shadow border-4 border-white">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                    />
                    <div className="doctor-info-overlay">
                      <div className="flex gap-4 mb-6">
                        <Button size="icon" variant="secondary" className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md text-white border-none hover:bg-primary hover:text-white transition-all">
                          <Instagram className="w-5 h-5" />
                        </Button>
                        <Button size="icon" variant="secondary" className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md text-white border-none hover:bg-primary hover:text-white transition-all">
                          <Facebook className="w-5 h-5" />
                        </Button>
                      </div>
                      <Button className="w-full rounded-2xl py-7 font-bold shadow-2xl shadow-primary/30 text-lg">
                        <Calendar className="w-5 h-5 mr-2" />
                        Записаться
                      </Button>
                    </div>
                    
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-sm font-bold text-slate-900">5.0</span>
                    </div>
                  </div>
                  
                  <div className="text-center px-4">
                    <Badge variant="outline" className="mb-4 rounded-full border-primary/20 text-primary bg-primary/5 px-4 py-1.5 font-bold uppercase tracking-wider text-[10px]">
                      Стаж: {doctor.experience}
                    </Badge>
                    <h3 className="text-3xl font-display font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-6">
                      {doctor.specialty}
                    </p>
                    
                    <div className="flex items-center justify-center gap-6 pt-6 border-t border-slate-100">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-display font-bold text-slate-900">1.5k+</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Пациентов</span>
                      </div>
                      <div className="w-px h-8 bg-slate-100" />
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-display font-bold text-slate-900">12+</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Наград</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

