import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, PhoneCall, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import * as styles from './Hero.styles';
import { trackGoal } from './Analytics';

const FACTS = [
  { value: '12 лет', label: 'работаем в Душанбе' },
  { value: '18', label: 'практикующих врачей' },
  { value: '10 000+', label: 'пациентов доверяют нам' },
  { value: '2', label: 'филиала рядом с вами' },
];

export function Hero() {
  const [urgentOpen, setUrgentOpen] = useState(false);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={styles.content}
          >
            <p className={styles.kicker}>
              <span className={styles.kickerLine} aria-hidden="true" />
              Семейная стоматология в Душанбе
            </p>

            <h1 className={styles.title}>
              Заботимся о вашей <span className={styles.titleAccent}>улыбке</span> так, как о своей
            </h1>

            <p className={styles.desc}>
              FamilyDent сочетает современные технологии, опыт врачей и внимательный
              подход. Запишитесь на приём онлайн или оставьте срочную заявку на консультацию.
            </p>

            <div className={styles.btnGroup}>
              <Link to="/book" className={styles.btnPrimary}>
                <Calendar className="h-4 w-4" />
                Записаться на приём
              </Link>
              <button onClick={() => setUrgentOpen(true)} className={styles.btnUrgent}>
                <PhoneCall className="h-4 w-4 text-primary" />
                Срочная консультация
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={styles.imageWrap}
          >
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
          </motion.div>
        </div>
      </div>

      {/* Строка фактов */}
      <div className={styles.factsBar}>
        <div className={styles.factsGrid}>
          {FACTS.map((fact) => (
            <div key={fact.label} className={styles.factItem}>
              <span className={styles.factValue}>{fact.value}</span>
              <span className={styles.factLabel}>{fact.label}</span>
            </div>
          ))}
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
      <button className="absolute inset-0 bg-espresso/60" onClick={onClose} aria-label="Закрыть" />
      <form onSubmit={submit} className="relative w-full max-w-lg space-y-4 rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-medium text-foreground">Срочная консультация</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Оставьте контакты, оператор подберёт ближайшее время без выбора врача.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Закрыть окно"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Имя" value={form.name} onChange={(value: string) => setForm({ ...form, name: value })} required />
          <Input label="Телефон" value={form.phone} onChange={(value: string) => setForm({ ...form, phone: value })} required />
        </div>
        <Input label="Удобный филиал" value={form.branch} onChange={(value: string) => setForm({ ...form, branch: value })} placeholder="Например, Айни" />
        <Input label="Желаемое время" value={form.preferredTime} onChange={(value: string) => setForm({ ...form, preferredTime: value })} placeholder="Сегодня после 15:00" />
        <Input label="Что беспокоит" value={form.reason} onChange={(value: string) => setForm({ ...form, reason: value })} textarea required />

        <Button
          disabled={submitting}
          type="submit"
          className="h-12 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary-hover"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Отправить заявку'}
        </Button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, textarea, required, placeholder = '' }: any) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {textarea ? (
        <textarea
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-24 w-full resize-none rounded-md border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      ) : (
        <input
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      )}
    </label>
  );
}
