import {
  Button,
  Container,
  Field,
  Heading,
  Input,
  Select,
  Text,
} from "@/ui-kit";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import React, { useState } from "react";
import { createBooking } from "../../lib/api";
import { ScrollAnimate } from "../shared/scroll-animate";

interface BookingSectionProps {
  onOpenBookingModal?: () => void;
}

export function BookingSection(_props: BookingSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "Первичный осмотр и 3D-диагностика",
    date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await createBooking({
        name: formData.name,
        phone: formData.phone,
        service: formData.service || undefined,
        preferredDate: formData.date || undefined,
      });
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="booking"
      className="relative w-full scroll-mt-24 overflow-hidden border-b border-rule bg-paper-2 py-12 text-ink sm:py-16 desktop:py-20"
    >
      <Container>
        <ScrollAnimate
          className="grid grid-cols-1 desktop:grid-cols-12 gap-0 items-stretch rounded-3xl overflow-hidden border border-rule shadow-card bg-surface"
          data-ui-scheme="default"
        >
          {/* Left Column: Dark Info & Benefits */}
          <div
            className="desktop:col-span-5 p-6 sm:p-10 desktop:p-12 flex flex-col justify-between text-paper relative overflow-hidden"
            style={{ background: "var(--gradient-dark)" }}
            data-ui-scheme="inverse"
          >
            {/* Subtle background glow circle */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="type-caption inline-flex items-center px-3.5 py-1.5 rounded-full bg-surface/10 text-accent-2 border border-on-dark/15 mb-6 max-w-full backdrop-blur-sm">
                <span className="truncate">Быстрая запись • Без очередей</span>
              </div>

              <Heading level={2} className="text-paper mb-4">
                Запишитесь на консультацию и 3D-диагностику
              </Heading>

              <Text variant="body-sm" className="text-paper/80 mb-8 max-w-md">
                Оставьте заявку за 30 секунд. Мы свяжемся с вами, ответим на
                вопросы и подберём удобное время приёма.
              </Text>

              {/* Clinic Advantages List */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/30 text-brand-text flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="type-caption text-paper/90">
                    Бесплатный первичный осмотр и подробный план лечения
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/30 text-brand-text flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="type-caption text-paper/90">
                    Прозрачная стоимость без скрытых платежей
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/30 text-brand-text flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="type-caption text-paper/90">
                    Персональный куратор от первого визита до результата
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="type-caption relative z-10 pt-6 border-t border-on-dark/15 flex flex-col gap-3 text-paper/80 mt-auto">
              <a
                href="tel:+992446606600"
                className="type-body-sm inline-flex items-center gap-3 text-paper hover:text-brand-text transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 text-brand-text flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+992 446 60 66 00</span>
              </a>
              <div className="flex items-start gap-3 text-paper/75">
                <MapPin className="w-4 h-4 text-brand-text shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span>Улица Айни, 45</span>
                  <span>Улица Немат Карабаева, 29</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-paper/75">
                <Clock className="w-4 h-4 text-brand-text shrink-0" />
                <span>Пн-Сб: 08:00 – 20:00</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Light Form */}
          <div
            className="desktop:col-span-7 p-6 sm:p-10 desktop:p-12 bg-surface text-ink flex flex-col justify-center"
            data-ui-scheme="default"
          >
            {submitted ? (
              <div className="text-center py-12 px-4 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 text-brand-text flex items-center justify-center mb-5 shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <Heading level={3} className="text-ink mb-3">
                  Заявка успешно отправлена!
                </Heading>
                <Text variant="body-sm" className="text-muted max-w-md mb-8">
                  Спасибо за обращение. Мы свяжемся с вами, чтобы согласовать и
                  подтвердить время записи.
                </Text>
                <button
                  onClick={() => setSubmitted(false)}
                  className="type-button bg-ink text-paper px-7 py-3.5 rounded-full hover:bg-accent hover:text-accent-ink transition-all duration-200 cursor-pointer shadow-md active:scale-95"
                  data-ui-scheme="inverse"
                >
                  Отправить ещё одну заявку
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 sm:gap-6"
              >
                <div>
                  <Heading level={3} className="text-ink mb-2">
                    Забронировать приём
                  </Heading>
                  <Text variant="body-sm" className="text-muted">
                    Заполните форму — мы согласуем удобное время и подтвердим
                    ваш визит
                  </Text>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Name */}
                  <Field
                    label="Ваше имя и фамилия"
                    required
                    className="flex flex-col"
                  >
                    <div className="relative">
                      <Input
                        type="text"
                        required
                        placeholder="например: Рустам Рахимов"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        data-ui-scheme="default"
                      />
                    </div>
                  </Field>

                  {/* Phone */}
                  <Field
                    label="Номер телефона"
                    required
                    className="flex flex-col"
                  >
                    <div className="relative">
                      <Input
                        type="tel"
                        required
                        placeholder="+992 446 60 66 00"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        data-ui-scheme="default"
                      />
                    </div>
                  </Field>
                </div>

                {/* Service & Preferred Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Service */}
                  <Field label="Направление / Услуга" className="flex flex-col">
                    <div className="relative">
                      <Select
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        data-ui-scheme="default"
                      >
                        <option value="">
                          Выберите услугу (необязательно)
                        </option>
                        <option>Первичный осмотр и 3D-диагностика</option>
                        <option>Лечение кариеса и эстетика</option>
                        <option>Имплантация и хирургия</option>
                        <option>Исправление прикуса (ортодонтия)</option>
                        <option>Виниры и реставрация</option>
                        <option>Профессиональная гигиена</option>
                        <option>Детская стоматология</option>
                      </Select>
                    </div>
                  </Field>

                  {/* Preferred Date */}
                  <Field label="Желаемая дата визита" className="flex flex-col">
                    <div className="relative">
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        data-ui-scheme="default"
                      />
                    </div>
                  </Field>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="lg"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    data-ui-scheme="inverse"
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>
                      {isSubmitting
                        ? "Отправляем…"
                        : "Записаться на удобное время"}
                    </span>
                  </Button>
                  {submitError && (
                    <Text
                      variant="body-sm"
                      role="alert"
                      className="mt-3 text-center text-error-ink"
                    >
                      {submitError}
                    </Text>
                  )}

                  <Text
                    variant="caption"
                    className="text-muted text-center mt-3 px-2"
                  >
                    Нажимая кнопку, вы соглашаетесь на обработку персональных
                    данных. Мы свяжемся с вами для подтверждения записи.
                  </Text>
                </div>
              </form>
            )}
          </div>
        </ScrollAnimate>
      </Container>
    </section>
  );
}
