import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, Play, X, Loader2, Instagram, Facebook, Send,
  Stethoscope, Microscope, HeartPulse, Syringe, Dna, Cross
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import * as styles from './Hero.styles';
import { trackGoal } from './Analytics';

const PARTNERS = [
  { icon: Stethoscope, label: 'Oxygen Medical' },
  { icon: Dna, label: 'DNA Laboratory' },
  { icon: Cross, label: 'Pharmacy' },
  { icon: HeartPulse, label: 'Imynology' },
  { icon: Microscope, label: 'Diagnostica' },
  { icon: Syringe, label: 'Medical Consulting' },
];

export function Hero() {
  const [urgentOpen, setUrgentOpen] = useState(false);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={styles.headlineWrap}
        >
          <h1>
            <span className={styles.titleDark}>
              Не просто лечим зубы.
              <br />
              Заботимся о семье.
            </span>
            <span className={styles.titleLight}>
              Точная стоматология —
              <br />
              лично и бережно
            </span>
          </h1>
          <img
            src="/images/crystal-tooth.png"
            alt=""
            aria-hidden="true"
            className={styles.heroImage}
            width={500}
            height={500}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className={styles.bottomRow}
        >
          <div className={styles.bottomLeft}>
            <p className={styles.desc}>
              Современная семейная стоматология в Душанбе, где каждый этап лечения
              объясняют спокойно и понятно.
            </p>
            <div className={styles.actionsRow}>
              <Link to="/book" className={styles.btnSplit} aria-label="Записаться на приём">
                <span className={styles.btnSplitMain}>Записаться на приём</span>
                <span className={styles.btnSplitChip} aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <div className={styles.socialGroup}>
                <a
                  href="https://instagram.com/familydent.tj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="Instagram клиники"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="Facebook клиники"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://t.me/familydent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="Telegram клиники"
                >
                  <Send className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className={styles.bottomRight}>
            <div className={styles.statCard}>
              <span className={styles.statCaption}>
                лет профессионального опыта в заботе о пациентах
              </span>
              <span className={styles.statValue}>12+</span>
            </div>
            <div className={styles.photoCard}>
              <img
                src="/offerImage.jpg"
                alt="Интерьер стоматологической клиники FamilyDent"
                className={styles.photoImg}
                width={256}
                height={224}
                loading="eager"
                decoding="async"
              />
              <button
                type="button"
                onClick={() => setUrgentOpen(true)}
                className={styles.playBtn}
                aria-label="Срочная консультация"
              >
                <Play className="h-6 w-6 fill-current" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Полоса партнёров */}
        <div className={styles.partnersStrip}>
          <div className={styles.partnersGrid}>
            {PARTNERS.map((partner) => (
              <span key={partner.label} className={styles.partnerItem}>
                <partner.icon className="h-5 w-5" aria-hidden="true" />
                {partner.label}
              </span>
            ))}
          </div>
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
