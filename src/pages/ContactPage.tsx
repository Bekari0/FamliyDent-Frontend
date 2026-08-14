import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { Bus, Car, Clock, Loader2, Navigation, Send } from 'lucide-react';
import { toast } from 'sonner';
import { trackGoal } from '@/components/Analytics';
import { Contact as ContactComponent } from '@/components/Contact';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { submitContactRequest, type ContactRequestForm } from './public-pages-behavior';

const EMPTY_CONTACT_FORM: ContactRequestForm = {
  name: '',
  phone: '',
  branch: '',
  reason: '',
  preferredTime: '',
};

export function ContactPage() {
  const [form, setForm] = useState<ContactRequestForm>(EMPTY_CONTACT_FORM);
  const [submission, setSubmission] = useState<{ status: 'idle' | 'submitting' | 'success' | 'error'; message?: string }>({ status: 'idle' });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmission({ status: 'submitting' });
    const result = await submitContactRequest(form, {
      post: (endpoint, payload) => axios.post(endpoint, payload),
      track: trackGoal,
    });

    if (result.status === 'success') {
      const message = 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
      setSubmission({ status: 'success', message });
      setForm(EMPTY_CONTACT_FORM);
      toast.success(message);
      return;
    }

    setSubmission({ status: 'error', message: result.message });
    toast.error(result.message);
  };

  return (
    <main className="min-h-screen bg-paper text-ink" data-ui="editorial-page">
      <EditorialPageHero
        badge="Связь с нами"
        title="Контакты клиники FamilyDent"
        description="Два филиала в Душанбе, удобная парковка и администраторы, которые помогут подобрать время приема."
      />

      <section className="mx-auto grid w-full max-w-5xl gap-5 px-5 pb-4 sm:px-8 md:grid-cols-3" aria-label="Информация для визита">
        <div className="rounded-2xl border border-rule bg-surface p-5 shadow-whisper"><Clock className="h-5 w-5 text-accent" /><h2 className="mt-4 font-display text-base font-bold">Часы работы</h2><p className="mt-2 text-sm text-editorial-muted">Пн–Сб: 7:30–19:00<br />Вс: выходной</p></div>
        <div className="rounded-2xl border border-rule bg-surface p-5 shadow-whisper"><Bus className="h-5 w-5 text-accent" /><h2 className="mt-4 font-display text-base font-bold">Общественный транспорт</h2><p className="mt-2 text-sm text-editorial-muted">Автобусы №2 и №10, остановка «Центральная клиника».</p></div>
        <div className="rounded-2xl border border-rule bg-surface p-5 shadow-whisper"><Car className="h-5 w-5 text-accent" /><h2 className="mt-4 font-display text-base font-bold">Парковка и маршрут</h2><p className="mt-2 text-sm text-editorial-muted">Бесплатная стоянка перед входом.</p><a href="https://yandex.tj/maps/" target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-pill bg-ink px-5 text-xs font-bold text-paper"><Navigation className="h-4 w-4 text-accent" />Проложить маршрут</a></div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="contact-form-title">
        <div className="rounded-3xl bg-ink p-7 text-paper shadow-card sm:p-9">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">Обратный звонок</span>
          <h2 id="contact-form-title" className="mt-3 font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">Записаться на консультацию</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/65">Оставьте контакты и кратко опишите вопрос. Администратор FamilyDent свяжется с вами и подберет удобный филиал и время.</p>
          <p className="mt-6 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-wider text-white/45">Обязательные поля: имя, телефон и причина обращения</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-rule bg-surface p-6 shadow-whisper sm:grid-cols-2 sm:p-8" noValidate>
          <ContactField label="Ваше имя" required value={form.name} onChange={(name) => setForm({ ...form, name })} placeholder="Иван Иванов" />
          <ContactField label="Телефон" required type="tel" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} placeholder="+992 ___ __ __ __" />
          <label className="grid gap-2 text-sm font-semibold">
            Удобный филиал
            <select value={form.branch} onChange={(event) => setForm({ ...form, branch: event.target.value })} className="min-h-11 rounded-xl border border-rule bg-paper px-4 text-sm font-normal text-ink focus:border-accent focus:outline-none">
              <option value="">Выберите филиал</option>
              <option value="Айни">Айни, 45</option>
              <option value="Карабаева">Немат Карабаева, 29</option>
            </select>
          </label>
          <ContactField label="Желаемое время" value={form.preferredTime} onChange={(preferredTime) => setForm({ ...form, preferredTime })} placeholder="Например, после 15:00" />
          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            Причина обращения <span className="sr-only">обязательное поле</span>
            <textarea required value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} className="min-h-28 resize-y rounded-xl border border-rule bg-paper p-4 text-sm font-normal text-ink focus:border-accent focus:outline-none" placeholder="Опишите, что вас беспокоит" />
          </label>

          {submission.status === 'success' && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 sm:col-span-2" role="status">{submission.message}</p>}
          {submission.status === 'error' && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:col-span-2" role="alert">{submission.message}</p>}

          <button disabled={submission.status === 'submitting'} type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-pill bg-accent px-6 text-xs font-bold text-accent-ink transition-colors hover:bg-accent-2 disabled:cursor-wait disabled:opacity-60 sm:col-span-2">
            {submission.status === 'submitting' ? <><Loader2 className="h-4 w-4 animate-spin" />Отправляем...</> : <><Send className="h-4 w-4" />Отправить заявку</>}
          </button>
        </form>
      </section>

      <ContactComponent />
    </main>
  );
}

function ContactField({ label, value, onChange, required = false, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}{required && <span className="sr-only">обязательное поле</span>}
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-11 rounded-xl border border-rule bg-paper px-4 text-sm font-normal text-ink focus:border-accent focus:outline-none" />
    </label>
  );
}
