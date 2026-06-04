
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { ChevronRight, Award, GraduationCap, Calendar, Star, Loader2, Home, History } from 'lucide-react';
import axios from 'axios';
import * as styles from './DoctorDetailPage.styles';


export function DoctorDetailPage() {
 const { id } = useParams();
 const [doctor, setDoctor] = useState<any>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchDoctor = async () => {
 try {
 const response = await axios.get(`/api/doctors/${id}`);
 setDoctor(response.data);
 } catch (error) {
 console.error('Error fetching doctor:', error);
 } finally {
 setLoading(false);
 }
 };
 fetchDoctor();
 }, [id]);

 if (loading) return (
 <div className="min-h-screen pt-40 flex items-center justify-center">
 <Loader2 className="w-10 h-10 animate-spin text-primary" />
 </div>
 );

 if (!doctor) return <div className="py-20 text-center">Врач не найден</div>;

 return (
 <div className={styles.page}>
 <div className={styles.container}>
 <div className={styles.breadcrumbWrapper}>
 <div className={styles.breadcrumb}>
 <Link to="/" className={styles.breadcrumbLink}>
 <Home className="w-3.5 h-3.5" />
 Главная
 </Link>
 <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
 <Link to="/doctors" className={styles.breadcrumbLink}>
 Наши врачи
 </Link>
 <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
 <span className={styles.breadcrumbActive}>{doctor.name}</span>
 </div>
 </div>
 </div>

 <div className={styles.container}>
 <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start py-8">
 <div className="lg:col-span-4">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="relative rounded-[40px] sm:rounded-[56px] overflow-hidden shadow-2xl border-[8px] sm:border-[12px] border-slate-50"
 >
 <img src={doctor.image} alt={doctor.name} className="w-full aspect-[4/5] object-cover" loading="eager" decoding="async" />
 <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent text-white">
 <div className="flex items-center gap-2 text-amber-400">
 <Star className="w-5 h-5 fill-current" />
 <span className="font-bold text-lg">5.0 Рейтинг</span>
 <span className="text-white/60 text-sm ml-2">На основе отзывов</span>
 </div>
 </div>
 </motion.div>
 </div>

 <div className="lg:col-span-8">
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 >
 <div className="flex flex-wrap gap-4 mb-6">
 <span className={styles.specialtyBadge}>
 {doctor.specialty}
 </span>
 <span className="px-5 py-2 rounded-full bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-2">
 <History className="w-4 h-4 text-primary" />
 Опыт работы: {doctor.experience}
 </span>
 </div>
 
 <h1 className={styles.title}>
 {doctor.name}
 </h1>
 
 <div className={styles.descBlock}>
 <p className={styles.descText}>
 "{doctor.description}"
 </p>
 </div>

 <div className="grid sm:grid-cols-2 gap-8 mb-12">
 <div className={styles.infoCard}>
 <div className={styles.infoHeader}>
 <div className={styles.infoIcon}>
 <GraduationCap className="w-6 h-6" />
 </div>
 <h3 className={styles.infoTitle}>Образование</h3>
 </div>
 <ul className="space-y-4">
 {(Array.isArray(doctor.education) ? doctor.education : [doctor.education]).map((item: string, i: number) => (
 <li key={i} className={styles.infoItem}>
 <span className={styles.infoBullet} />
 <span className={styles.infoContent}>{item}</span>
 </li>
 ))}
 </ul>
 </div>
 
 <div className={styles.infoCard}>
 <div className={styles.infoHeader}>
 <div className={styles.infoIcon}>
 <Award className="w-6 h-6 text-accent" />
 </div>
 <h3 className={styles.infoTitle}>Достижения</h3>
 </div>
 <ul className="space-y-4">
 {doctor.achievements?.map((item: string, i: number) => (
 <li key={i} className={styles.infoItem}>
 <span className="w-2 h-2 rounded-full bg-accent mt-2.5 shrink-0" />
 <span className="font-medium leading-relaxed">{item}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>

 <div className={styles.buttonGroup}>
 <Button asChild className={styles.bookButton}>
 <Link to={`/book?doctorId=${doctor._id || doctor.id}`}>
 <Calendar className="w-6 h-6 mr-3" />
 Записаться на прием
 </Link>
 </Button>
 <Button variant="outline" asChild className="h-14 sm:h-18 px-10 rounded-2xl sm:rounded-3xl border-slate-100 text-lg font-bold hover:bg-slate-50 transition-all">
 <Link to="/contact">Задать вопрос</Link>
 </Button>
 </div>
 </motion.div>
 </div>
 </div>
 </div>
 </div>
 );
}


