import React, { useState, useEffect } from "react";
import { X, Calendar, User, Phone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getDoctors } from "../../lib/data/doctors";
import type { Doctor } from "../../lib/data/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctor?: string;
}

export function BookingModal({ isOpen, onClose, preselectedDoctor }: BookingModalProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctor, setDoctor] = useState(preselectedDoctor || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-paper-2 border border-rule rounded-2xl p-6 sm:p-8 shadow-card text-ink"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-paper hover:bg-paper-3 text-muted hover:text-ink transition-colors cursor-pointer border border-rule"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-success-soft border border-success/40 text-success flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Заявка принята!</h3>
              <p className="text-xs sm:text-sm text-muted font-normal mb-6">
                Администратор клиники Family Dent свяжется с вами в течение 15 минут для подтверждения времени записи.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex min-h-11 items-center justify-center rounded-pill bg-ink text-paper px-6 py-2.5 font-semibold text-xs hover:bg-accent hover:text-accent-ink transition duration-[var(--dur-micro)] cursor-pointer"
              >
                Отлично
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-accent text-xs uppercase font-semibold tracking-wider mb-1 font-mono">
                <Calendar className="w-4 h-4" />
                <span>Запись на приём</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink mb-2">
                Забронируйте время
              </h2>
              <p className="text-xs text-muted font-normal mb-6">
                Оставьте контактные данные, и мы свяжемся с вами для выбора удобного времени.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-ink font-medium mb-1">Ваше имя *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-accent absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Алишер Назаров"
                      className="w-full bg-paper border border-rule rounded-xl py-2.5 pl-10 pr-4 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-ink font-medium mb-1">Номер телефона *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-accent absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+992 446 60 66 00"
                      className="w-full bg-paper border border-rule rounded-xl py-2.5 pl-10 pr-4 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-ink font-medium mb-1">Врач (необязательно)</label>
                  <select
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    className="w-full bg-paper border border-rule rounded-xl py-2.5 px-3 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Любой свободный специалист</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 inline-flex min-h-11 items-center justify-center rounded-pill bg-ink text-paper hover:bg-accent hover:text-accent-ink font-semibold text-xs py-3 transition-all cursor-pointer shadow-lg"
                >
                  Записаться на консультацию
                </button>

                <p className="text-[10px] text-muted text-center font-normal mt-2">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
                </p>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
