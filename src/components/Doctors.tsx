import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Instagram, Facebook, Award, Star, Calendar, ArrowRight, Plus, GraduationCap, CheckCircle2, Users, History } from 'lucide-react';
import axios from 'axios';
import { useBooking } from '@/context/BookingContext';
import { DoctorDetailModal } from './DoctorDetailModal';
import { Link } from 'react-router-dom';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  description: string;
  education: string;
  achievements: string[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { openBooking } = useBooking();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/doctors`);
        setDoctors(response.data.slice(0, 3));
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки врачей:', err);
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <section id="doctors" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-slate-600 font-medium">Поиск специалистов...</p>
          </div>
        </div>
      </section>
    );
  }

  if (doctors.length === 0) return null;

  return (
    <>
      <section id="doctors" className="py-24 bg-slate-50 scroll-mt-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -ml-48 -mb-48" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 lg:mb-20 gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6"
              >
                <Award className="w-3.5 h-3.5" />
                Наши эксперты
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6"
              >
                Познакомьтесь с <span className="text-primary italic">профессионалами</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-600 leading-relaxed"
              >
                Команда FamilyDent — это врачи высшей категории, которые любят свою работу и искренне заботятся о здоровье ваших зубов.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <Link to="/doctors">
                <Button variant="outline" className="rounded-2xl px-8 py-7 font-bold border-slate-200 group h-auto">
                  Все врачи
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="group h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md rounded-xl">
                  <div 
                    className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 sm:p-6">
                      <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Подробнее о враче</span>
                        <div className="w-10 h-0.5 bg-primary rounded-full mt-2" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>5.0</span>
                    </div>
                  </div>

                  <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="inline-block text-primary text-xs font-bold uppercase tracking-wider mb-3">
                      {doctor.specialty}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {doctor.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                      <History className="w-3 h-3 mr-1" />
                      Стаж: {doctor.experience}
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {doctor.description}
                    </p>

                    {doctor.achievements && doctor.achievements.length > 0 && (
                      <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                          <Award className="w-4 h-4 text-primary" />
                          <span>Достижения</span>
                        </div>
                        <ul className="space-y-1.5">
                          {doctor.achievements.slice(0, 2).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                          {doctor.achievements.length > 2 && (
                            <li 
                              className="text-primary text-[10px] font-bold cursor-pointer hover:underline mt-1"
                              onClick={() => setSelectedDoctor(doctor)}
                            >
                              +{doctor.achievements.length - 2} еще
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    <div className="mt-auto pt-4">
                      <Button 
                        onClick={() => openBooking(doctor._id)} 
                        className="w-full rounded-xl bg-primary hover:bg-primary/90 h-11 text-sm"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Записаться на прием
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center md:hidden">
            <Link to="/doctors">
              <Button variant="outline" className="w-full rounded-2xl py-8 font-bold border-slate-200">
                Посмотреть всех врачей
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <DoctorDetailModal 
        doctor={selectedDoctor}
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onBooking={(doctorId) => {
          setSelectedDoctor(null);
          openBooking(doctorId);
        }}
      />
    </>
  );
}