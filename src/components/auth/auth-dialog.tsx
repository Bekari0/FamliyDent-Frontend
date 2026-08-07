import React, { useState } from "react";
import { X, Lock, Mail, User, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-paper-2 border border-rule rounded-2xl p-6 shadow-card text-ink"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-paper hover:bg-paper-3 text-muted hover:text-ink transition-colors cursor-pointer border border-rule"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <div className="py-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-success-soft text-success border border-success/40 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold mb-1">
                {mode === "login" ? "С возвращением!" : "Регистрация завершена"}
              </h3>
              <p className="text-xs text-muted font-normal mb-4">
                Вы успешно вошли в личный кабинет пациента Family Dent.
              </p>
              <button
                onClick={handleDone}
                className="inline-flex min-h-11 items-center justify-center rounded-pill bg-ink text-paper px-6 py-2 font-medium text-xs hover:bg-accent hover:text-accent-ink transition duration-[var(--dur-micro)] cursor-pointer"
              >
                Продолжить
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-rule pb-3">
                <button
                  onClick={() => setMode("login")}
                  className={`text-sm font-bold transition-colors cursor-pointer ${
                    mode === "login" ? "text-accent" : "text-muted hover:text-ink"
                  }`}
                >
                  Вход
                </button>
                <span className="text-rule">•</span>
                <button
                  onClick={() => setMode("register")}
                  className={`text-sm font-bold transition-colors cursor-pointer ${
                    mode === "register" ? "text-accent" : "text-muted hover:text-ink"
                  }`}
                >
                  Регистрация
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label className="block text-xs text-ink font-medium mb-1">ФИО</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-accent absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Алишер Назаров"
                        className="w-full bg-paper border border-rule rounded-xl py-2 px-9 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-ink font-medium mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-accent absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full bg-paper border border-rule rounded-xl py-2 px-9 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-ink font-medium mb-1">Пароль</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-accent absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-paper border border-rule rounded-xl py-2 px-9 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 inline-flex min-h-11 items-center justify-center rounded-pill bg-ink text-paper hover:bg-accent hover:text-accent-ink font-semibold text-xs py-2.5 transition-all cursor-pointer shadow-lg"
                >
                  {mode === "login" ? "Войти в кабинет" : "Зарегистрироваться"}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
