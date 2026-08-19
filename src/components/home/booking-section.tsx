import React, { useState } from "react";
import { Calendar, Clock, Phone, MapPin, CheckCircle2, ShieldCheck, Sparkles, User, ChevronDown } from "lucide-react";
import { ScrollAnimate } from "../shared/scroll-animate";

interface BookingSectionProps {
  onOpenBookingModal?: () => void;
}

export function BookingSection({ onOpenBookingModal }: BookingSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "Первичный осмотр и 3D-диагностика",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <section
      id="booking"
      className="relative w-full scroll-mt-24 overflow-hidden border-b border-rule bg-paper-2 py-12 text-ink sm:py-16 lg:py-20"
    >
      <div className="page-container">
        <ScrollAnimate className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch rounded-3xl overflow-hidden border border-rule shadow-card bg-surface">
          {/* Left Column: Dark Info & Benefits */}
          <div
            className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between text-paper relative overflow-hidden"
            style={{ background: "var(--gradient-dark)" }}
          >
            {/* Subtle background glow circle */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-accent-2 border border-white/15 text-xs font-semibold mb-6 max-w-full backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="truncate">Быстрая запись • Без очередей</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-paper leading-[1.2] mb-4 tracking-tight">
                Запишитесь на консультацию и 3D-диагностику
              </h2>

              <p className="text-xs sm:text-sm text-paper/80 font-normal leading-relaxed mb-8 max-w-md">
                Оставьте заявку за 30 секунд. Наш администратор свяжется с вами в течение 10 минут, ответит на любые вопросы и подберет максимально удобное время приёма.
              </p>

              {/* Clinic Advantages List */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/30 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm text-paper/90 font-medium leading-snug">
                    Бесплатный первичный осмотр и подробный план лечения
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/30 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm text-paper/90 font-medium leading-snug">
                    Прозрачная стоимость без скрытых платежей
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/30 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm text-paper/90 font-medium leading-snug">
                    Персональный куратор от первого визита до результата
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="relative z-10 pt-6 border-t border-white/15 flex flex-col gap-3 text-xs sm:text-sm text-paper/80 mt-auto">
              <a
                href="tel:+992446606600"
                className="inline-flex items-center gap-3 text-paper hover:text-accent transition-colors font-bold text-base sm:text-lg tracking-tight group"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+992 446 60 66 00</span>
              </a>
              <div className="flex items-start gap-3 text-paper/75">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span>Улица Айни, 45</span>
                  <span>Улица Немат Карабаева, 29</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-paper/75">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span>Пн-Сб: 08:00 – 20:00</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Light Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-surface text-ink flex flex-col justify-center">
            {submitted ? (
              <div className="text-center py-12 px-4 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-5 shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-3 tracking-tight">
                  Заявка успешно отправлена!
                </h3>
                <p className="text-xs sm:text-sm text-muted font-normal max-w-md mb-8 leading-relaxed">
                  Спасибо за обращение. Наш администратор перезвонит вам в течение 10 минут для подтверждения времени записи.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-ink text-paper font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full hover:bg-accent hover:text-accent-ink transition-all duration-200 cursor-pointer shadow-md active:scale-95"
                >
                  Отправить ещё одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-2">
                    Забронировать приём
                  </h3>
                  <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed">
                    Заполните форму — мы забронируем удобное окно и подтвердим визит звонком
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Name */}
                  <div className="flex flex-col">
                    <label className="block text-xs font-semibold text-muted font-mono uppercase tracking-wider mb-2">
                      Ваше имя и фамилия <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="например: Рустам Рахимов"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full h-11 sm:h-12 bg-paper border border-rule rounded-xl px-4 text-xs sm:text-sm text-ink font-medium focus:bg-surface focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-muted/50"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col">
                    <label className="block text-xs font-semibold text-muted font-mono uppercase tracking-wider mb-2">
                      Номер телефона <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="+992 446 60 66 00"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full h-11 sm:h-12 bg-paper border border-rule rounded-xl px-4 text-xs sm:text-sm text-ink font-medium focus:bg-surface focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-muted/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Service & Preferred Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Service */}
                  <div className="flex flex-col">
                    <label className="block text-xs font-semibold text-muted font-mono uppercase tracking-wider mb-2">
                      Направление / Услуга
                    </label>
                    <div className="relative">
                      <select
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        className="w-full h-11 sm:h-12 bg-paper border border-rule rounded-xl pl-4 pr-10 text-xs sm:text-sm text-ink font-medium focus:bg-surface focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer appearance-none"
                      >
                        <option>Первичный осмотр и 3D-диагностика</option>
                        <option>Лечение кариеса и эстетика</option>
                        <option>Имплантация и хирургия</option>
                        <option>Исправление прикуса (ортодонтия)</option>
                        <option>Виниры и реставрация</option>
                        <option>Профессиональная гигиена</option>
                        <option>Детская стоматология</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div className="flex flex-col">
                    <label className="block text-xs font-semibold text-muted font-mono uppercase tracking-wider mb-2">
                      Желаемая дата визита
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full h-11 sm:h-12 bg-paper border border-rule rounded-xl px-4 text-xs sm:text-sm text-ink font-medium focus:bg-surface focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-12 sm:h-13 inline-flex items-center justify-center rounded-xl sm:rounded-full bg-ink text-paper hover:bg-accent hover:text-accent-ink font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer gap-2.5"
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>Записаться на удобное время</span>
                  </button>

                  <p className="text-[11px] text-muted text-center leading-normal mt-3 px-2">
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Администратор перезвонит вам в течение 10 минут.
                  </p>
                </div>
              </form>
            )}
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}

