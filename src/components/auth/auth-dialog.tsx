import {
  Button,
  Dialog,
  Field,
  Heading,
  IconButton,
  Input,
  Text,
} from "@/ui-kit";
import { CheckCircle2, Lock, Mail, User, X } from "lucide-react";
import React, { useState } from "react";
import { authenticate } from "../../lib/api";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await authenticate({
        mode,
        email,
        password,
        name: mode === "register" ? name : undefined,
      });
      setIsSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Не удалось выполнить вход",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog
      label="Личный кабинет пациента"
      onClose={onClose}
      className="max-w-sm p-6"
    >
      <IconButton
        onClick={onClose}
        className="absolute top-4 right-4"
        aria-label="Закрыть"
        data-ui-scheme="default"
      >
        <X className="w-5 h-5" />
      </IconButton>

      {isSuccess ? (
        <div className="py-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-success-soft text-success border border-success/40 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <Heading level={3} variant="heading-5" className="mb-1">
            {mode === "login" ? "С возвращением!" : "Регистрация завершена"}
          </Heading>
          <Text variant="body-sm" className="text-muted mb-4">
            Вы успешно вошли в личный кабинет пациента Family Dent.
          </Text>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleDone}
            className="w-full"
            data-ui-scheme="inverse"
          >
            Продолжить
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-6 pr-10 border-b border-rule pb-3">
            <button
              onClick={() => setMode("login")}
              className={`type-button transition-colors cursor-pointer ${
                mode === "login"
                  ? "text-brand-text"
                  : "text-muted hover:text-ink"
              }`}
            >
              Вход
            </button>
            <span className="text-rule">•</span>
            <button
              onClick={() => setMode("register")}
              className={`type-button transition-colors cursor-pointer ${
                mode === "register"
                  ? "text-brand-text"
                  : "text-muted hover:text-ink"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <Field label="ФИО" required>
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
            )}

            <Field label="Email" required>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-text absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="pl-10"
                  data-ui-scheme="default"
                />
              </div>
            </Field>

            <Field label="Пароль" required>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-text absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  required
                  minLength={mode === "register" ? 12 : 1}
                  maxLength={200}
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  data-ui-scheme="default"
                />
              </div>
            </Field>

            <Button
              variant="secondary"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              data-ui-scheme="inverse"
            >
              {isSubmitting
                ? "Отправляем…"
                : mode === "login"
                  ? "Войти в кабинет"
                  : "Зарегистрироваться"}
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
          </form>
        </div>
      )}
    </Dialog>
  );
}
