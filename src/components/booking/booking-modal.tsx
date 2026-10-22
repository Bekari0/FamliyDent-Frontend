import {
  Button,
  Dialog,
  Field,
  Heading,
  IconButton,
  Input,
  Select,
  Text,
} from "@/ui-kit";
import { Calendar, CheckCircle2, Phone, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createBooking } from "../../lib/api";
import { getDoctors } from "../../lib/data/doctors";
import type { Doctor } from "../../lib/data/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctor?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  preselectedDoctor,
}: BookingModalProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctor, setDoctor] = useState(preselectedDoctor || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function fetchDocs() {
      const docs = await getDoctors();
      setDoctors(docs);
    }
    fetchDocs();
  }, []);

  useEffect(() => {
    if (preselectedDoctor) {
      setDoctor(preselectedDoctor);
    }
  }, [preselectedDoctor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await createBooking({ name, phone, doctor: doctor || undefined });
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Не удалось отправить заявку. Позвоните нам или попробуйте ещё раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog
      label="Запись на приём"
      onClose={onClose}
      className="max-w-md p-6 sm:p-8"
    >
      <IconButton
        onClick={onClose}
        className="absolute top-4 right-4"
        aria-label="Закрыть"
        data-ui-scheme="default"
      >
        <X className="w-5 h-5" />
      </IconButton>

      {submitted ? (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-success-soft border border-success/40 text-success flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <Heading level={3} variant="heading-4" className="mb-2">
            Заявка принята!
          </Heading>
          <Text variant="body-sm" className="text-muted mb-6">
            Администратор клиники Family Dent свяжется с вами в течение 15 минут
            для подтверждения времени записи.
          </Text>
          <button
            onClick={handleReset}
            className="type-button inline-flex min-h-11 items-center justify-center rounded-pill bg-ink text-paper px-6 py-2.5 hover:bg-accent hover:text-accent-ink transition duration-[var(--dur-micro)] cursor-pointer"
            data-ui-scheme="inverse"
          >
            Отлично
          </button>
        </div>
      ) : (
        <div>
          <div className="type-overline pr-12 flex items-center gap-2 text-brand-text uppercase mb-1">
            <Calendar className="w-4 h-4" />
            <span>Запись на приём</span>
          </div>
          <Heading
            level={2}
            variant="heading-4"
            className="text-ink mb-2 pr-10"
          >
            Забронируйте время
          </Heading>
          <Text variant="body-sm" className="text-muted mb-6">
            Оставьте контактные данные, и мы свяжемся с вами для выбора удобного
            времени.
          </Text>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Ваше имя" required>
              <div className="relative">
                <User className="w-4 h-4 text-brand-text absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Алишер Назаров"
                  className="pl-10"
                  data-ui-scheme="default"
                />
              </div>
            </Field>

            <Field label="Номер телефона" required>
              <div className="relative">
                <Phone className="w-4 h-4 text-brand-text absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+992 446 60 66 00"
                  className="pl-10"
                  data-ui-scheme="default"
                />
              </div>
            </Field>

            <Field label="Врач (необязательно)">
              <Select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                data-ui-scheme="default"
              >
                <option value="">Любой свободный специалист</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </Select>
            </Field>

            <Button
              variant="secondary"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              data-ui-scheme="inverse"
            >
              {isSubmitting ? "Отправляем…" : "Записаться на консультацию"}
            </Button>

            {submitError && (
              <Text
                variant="body-sm"
                className="text-error-ink text-center"
                role="alert"
              >
                {submitError}
              </Text>
            )}

            <Text variant="caption" className="text-muted text-center mt-2">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
            </Text>
          </form>
        </div>
      )}
    </Dialog>
  );
}
