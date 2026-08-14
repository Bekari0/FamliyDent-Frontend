import { useRef, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Calendar, PhoneCall, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';
import { BackgroundVideo } from './BackgroundVideo';
import { CentralLogo } from './CentralLogo';
import * as styles from './Hero.styles';
import { trackGoal } from './Analytics';
import { getHomeMotionProps, submitUrgentRequest, validateUrgentRequest } from './home/home-behavior';
import { useAccessibleDialog } from './home/use-accessible-dialog';

export function Hero() {
  const [urgentOpen, setUrgentOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { openBooking } = useBooking();
  const leftMotion = getHomeMotionProps(Boolean(shouldReduceMotion), { opacity: 0, x: -30 }, { duration: 0.8, ease: 'easeOut' as const });
  const rightMotion = getHomeMotionProps(Boolean(shouldReduceMotion), { opacity: 0, x: 30 }, { duration: 0.8, ease: 'easeOut' as const, delay: 0.1 });

  return (
    <section className={styles.section}>
      <BackgroundVideo />
      <div className={styles.container}>
        <div className={styles.layout}>
          <motion.div {...leftMotion} animate={{ opacity: 1, x: 0 }} className={styles.leftColumn}>
            <h1 className={styles.title}>
              Современная<br />стоматология<br />для всей семьи
            </h1>
            <p className={styles.desc}>
              От первого молочного зуба до сложной имплантации — бережно, точно и без спешки.
            </p>
          </motion.div>

          <div className={styles.centerColumn}>
            <CentralLogo colorMode="glowing-white" />
          </div>

          <motion.div {...rightMotion} animate={{ opacity: 1, x: 0 }} className={styles.rightColumn}>
            <h2 className={styles.promise}>
              <span className="block whitespace-nowrap">Без боли.</span>
              <span className="block whitespace-nowrap">Без спешки.</span>
              <span className="block whitespace-nowrap">Без компромиссов.</span>
            </h2>
            <div className={styles.btnGroup}>
              <button type="button" onClick={() => openBooking()} className={styles.btnPrimary}>
                <Calendar className="h-5 w-5" />Записаться
              </button>
              <button type="button" onClick={() => setUrgentOpen(true)} className={styles.btnUrgent}>
                <PhoneCall className="h-5 w-5 text-accent" />Срочная консультация
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className={styles.watermark} aria-hidden="true">
        <span className={styles.watermarkText}>FAMILY DENT<span className="hidden sm:inline"> • ДУШАНБЕ</span></span>
      </div>
      {urgentOpen && <UrgentRequestModal onClose={() => setUrgentOpen(false)} />}
    </section>
  );
}

function UrgentRequestModal({ onClose }: { onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', branch: '', reason: '', preferredTime: '' });
  const dialogRef = useRef<HTMLFormElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const handleDialogKeyDown = useAccessibleDialog(dialogRef, initialFocusRef, onClose);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateUrgentRequest(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await submitUrgentRequest(form, {
        post: (endpoint, payload) => axios.post(endpoint, payload),
        track: trackGoal,
        notifySuccess: () => toast.success('Заявка отправлена. Мы свяжемся с вами в ближайшее время.'),
        close: onClose,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Не удалось отправить заявку');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="urgent-request-title" onKeyDown={handleDialogKeyDown}>
      <button className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} aria-label="Закрыть" />
      <form ref={dialogRef} onSubmit={submit} className="relative w-full max-w-lg space-y-4 rounded-2xl border border-rule bg-surface p-6 text-ink shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="urgent-request-title" className="font-display text-2xl font-bold">Срочная консультация</h2>
            <p className="mt-1 text-sm text-muted">Оставьте контакты, оператор подберёт ближайшее время без выбора врача.</p>
          </div>
          <button ref={initialFocusRef} type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper-2 text-muted hover:text-ink" aria-label="Закрыть форму">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Имя" value={form.name} onChange={(value: string) => setForm({ ...form, name: value })} required />
          <Input label="Телефон" value={form.phone} onChange={(value: string) => setForm({ ...form, phone: value })} required />
        </div>
        <Input label="Удобный филиал" value={form.branch} onChange={(value: string) => setForm({ ...form, branch: value })} placeholder="Например, Айни" />
        <Input label="Желаемое время" value={form.preferredTime} onChange={(value: string) => setForm({ ...form, preferredTime: value })} placeholder="Сегодня после 15:00" />
        <Input label="Что беспокоит" value={form.reason} onChange={(value: string) => setForm({ ...form, reason: value })} textarea required />

        <Button disabled={submitting} type="submit" className="h-12 w-full rounded-xl bg-accent font-bold text-accent-ink hover:bg-accent-2">
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Отправить заявку'}
        </Button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, textarea, required, placeholder = '' }: any) {
  const inputClassName = 'w-full rounded-xl border border-rule bg-paper px-4 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20';
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {textarea ? (
        <textarea required={required} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={`${inputClassName} min-h-24 resize-none py-3`} />
      ) : (
        <input required={required} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={`${inputClassName} h-11`} />
      )}
    </label>
  );
}
