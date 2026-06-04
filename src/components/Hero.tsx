import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, Star, ShieldCheck, Users, PhoneCall, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import * as styles from './Hero.styles';
import { trackGoal } from './Analytics';


export function Hero() {
 const [urgentOpen, setUrgentOpen] = useState(false);

 return (
 <section className={styles.section}>
 <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64" />

 <div className={styles.container}>
 <div className={styles.layout}>
 <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className={styles.content}>
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className={styles.badge}>
 <Star className="w-4 h-4 fill-primary" />
 Стоматология №1 в Душанбе
 </motion.div>

 <h1 className={styles.title}>
 Заботимся о вашей <span className={styles.titleAccent}>улыбке</span> так, как о своей
 </h1>

 <p className={styles.desc}>
 FamilyDent сочетает современные технологии, опыт врачей и внимательный подход. Запишитесь на прием онлайн или оставьте срочную заявку на консультацию.
 </p>

 <div className={styles.btnGroup}>
 <Link to="/book" className={styles.btnPrimary}>
 <Calendar className="w-5 h-5" />
 Записаться на прием
 </Link>
 <button onClick={() => setUrgentOpen(true)} className={styles.btnUrgent}>
 <PhoneCall className="w-5 h-5 text-primary" />
 Срочная консультация
 </button>
 </div>

 <div className={styles.features}>
 <div className={styles.featureItem}>
 <div className={styles.featureIcon}>
 <ShieldCheck className="w-5 h-5" />
 </div>
 <div>
 <span className={styles.featureTitle}>Гарантия</span>
 <span className={styles.featureSubtitle}>на все виды работ</span>
 </div>
 </div>
 <div className={styles.featureItem}>
 <div className={styles.featureIcon}>
 <Users className="w-5 h-5" />
 </div>
 <div>
 <span className={styles.featureTitle}>10,000+</span>
 <span className={styles.featureSubtitle}>довольных пациентов</span>
 </div>
 </div>
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative hidden md:block max-w-[590px] justify-self-center lg:justify-self-end">
 <div className={styles.imageContainer}>
 <img
 src="/offerImage.jpg"
 alt="Интерьер стоматологической клиники FamilyDent"
 className={styles.image}
 width={590}
 height={420}
 loading="eager"
 decoding="async"
 fetchPriority="high"
 />
 </div>
 <motion.div
 animate={{ y: [0, -8, 0] }}
 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
 className={`${styles.floatingCard} -top-4 -left-4`}
 >
 <div className="w-9 h-9 rounded-xl bg-amber-400 text-white flex items-center justify-center">
 <Star className="w-4 h-4 fill-current" />
 </div>
 <div>
 <div className="text-sm font-black text-slate-900 leading-none">Рейтинг 5.0</div>
 <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">FamilyDent</div>
 </div>
 </motion.div>
 <motion.div
 animate={{ y: [0, 8, 0] }}
 transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.55 }}
 className={`${styles.floatingCard} -bottom-4 -right-4`}
 >
 <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
 <MessageCircle className="w-4 h-4" />
 </div>
 <div>
 <div className="text-sm font-black text-slate-900 leading-none">Онлайн чат 24/7</div>
 <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">поможем быстро</div>
 </div>
 </motion.div>
 </motion.div>
 </div>
 </div>

 {urgentOpen && <UrgentRequestModal onClose={() => setUrgentOpen(false)} />}
 </section>
 );
}

function UrgentRequestModal({ onClose }: { onClose: () => void }) {
 const [submitting, setSubmitting] = useState(false);
 const [form, setForm] = useState({
 name: '',
 phone: '',
 branch: '',
 reason: '',
 preferredTime: ''
 });

 const submit = async (event: FormEvent) => {
 event.preventDefault();
 if (!form.name.trim() || !form.phone.trim() || !form.reason.trim()) {
 toast.error('Укажите имя, телефон и причину обращения');
 return;
 }

 setSubmitting(true);
 try {
 await axios.post('/api/urgent-requests', form);
 trackGoal('urgent_request_submit');
 toast.success('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
 onClose();
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Не удалось отправить заявку');
 } finally {
 setSubmitting(false);
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <button className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" onClick={onClose} aria-label="Закрыть" />
 <form onSubmit={submit} className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl border border-border p-6 space-y-4">
 <div className="flex items-start justify-between gap-4">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Срочная консультация</h2>
 <p className="text-sm text-text-secondary mt-1">Оставьте контакты, оператор подберет ближайшее время без выбора врача.</p>
 </div>
 <button type="button" onClick={onClose} className="w-10 h-10 rounded-xl bg-secondary text-text-secondary hover:text-foreground flex items-center justify-center">
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="grid sm:grid-cols-2 gap-3">
 <Input label="Имя" value={form.name} onChange={(value: string) => setForm({ ...form, name: value })} required />
 <Input label="Телефон" value={form.phone} onChange={(value: string) => setForm({ ...form, phone: value })} required />
 </div>
 <Input label="Удобный филиал" value={form.branch} onChange={(value: string) => setForm({ ...form, branch: value })} placeholder="Например, Айни" />
 <Input label="Желаемое время" value={form.preferredTime} onChange={(value: string) => setForm({ ...form, preferredTime: value })} placeholder="Сегодня после 15:00" />
 <Input label="Что беспокоит" value={form.reason} onChange={(value: string) => setForm({ ...form, reason: value })} textarea required />

 <Button disabled={submitting} type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover">
 {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Отправить заявку'}
 </Button>
 </form>
 </div>
 );
}

function Input({ label, value, onChange, textarea, required, placeholder = '' }: any) {
 return (
 <label className="block space-y-1">
 <span className="text-sm font-semibold text-foreground">{label}</span>
 {textarea ? (
 <textarea required={required} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full min-h-24 rounded-xl border border-border bg-white px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
 ) : (
 <input required={required} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full h-11 rounded-xl border border-border bg-white px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
 )}
 </label>
 );
}


