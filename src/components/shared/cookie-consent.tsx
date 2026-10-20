import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Cookie, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type CookiePreference = "all" | "necessary";

interface CookieConsentContextValue {
  preference: CookiePreference | null;
  externalContentAllowed: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  openSettings: () => void;
}

const STORAGE_KEY = "familydent-cookie-consent-v1";

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

interface CookieConsentBannerProps {
  isOpen: boolean;
  hasSavedPreference: boolean;
  onAcceptAll: () => void;
  onAcceptNecessary: () => void;
}

function CookieConsentBanner({
  isOpen,
  hasSavedPreference,
  onAcceptAll,
  onAcceptNecessary,
}: CookieConsentBannerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
          aria-live="polite"
          initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.99 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5 sm:pb-5"
        >
          <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[var(--radius-xl)] border border-white/15 bg-ink/95 text-paper shadow-[0_1.75rem_5rem_rgba(0,0,0,0.34)] backdrop-blur-xl lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" aria-hidden="true" />

            <div className="hidden p-6 pr-0 sm:block lg:pl-7">
              <span className="flex size-12 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-accent-2">
                <Cookie aria-hidden="true" className="size-5" />
              </span>
            </div>

            <div className="min-w-0 px-5 pb-4 pt-5 sm:px-6 sm:pb-5 lg:py-6">
              <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-2">
                <ShieldCheck aria-hidden="true" className="size-3.5" />
                {hasSavedPreference ? "Настройки cookie" : "Ваш выбор важен"}
              </div>
              <h2 id="cookie-consent-title" className="font-display text-xl font-semibold tracking-[-0.025em] text-paper sm:text-2xl">
                Конфиденциальность — без мелкого шрифта
              </h2>
              <p id="cookie-consent-description" className="mt-2 max-w-3xl text-xs leading-relaxed text-paper/65 sm:text-sm">
                Необходимые данные помогают сайту запомнить ваш выбор. С вашего согласия мы также загрузим Яндекс Карты и видео из Instagram — эти сервисы могут использовать собственные cookie.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-white/10 p-4 sm:flex-row sm:px-6 sm:pb-6 lg:min-w-[20rem] lg:flex-col-reverse lg:border-l lg:border-t-0 lg:p-6">
              <button
                type="button"
                onClick={onAcceptNecessary}
                className="inline-flex min-h-11 items-center justify-center rounded-pill border border-white/25 px-5 text-xs font-semibold text-paper transition-colors hover:border-white/50 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Только необходимые
              </button>
              <button
                type="button"
                onClick={onAcceptAll}
                className="inline-flex min-h-11 items-center justify-center rounded-pill border border-accent bg-accent px-5 text-xs font-bold text-accent-ink shadow-md transition-colors hover:border-accent-2 hover:bg-accent-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Принять все
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<CookiePreference | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const savedPreference = window.localStorage.getItem(STORAGE_KEY);
      if (savedPreference === "all" || savedPreference === "necessary") {
        setPreference(savedPreference);
      } else {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    } finally {
      setIsReady(true);
    }
  }, []);

  const savePreference = useCallback((nextPreference: CookiePreference) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextPreference);
    } catch {
      // The current session still respects the choice when storage is unavailable.
    }
    setPreference(nextPreference);
    setIsOpen(false);
  }, []);

  const openSettings = useCallback(() => setIsOpen(true), []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      preference,
      externalContentAllowed: preference === "all",
      acceptAll: () => savePreference("all"),
      acceptNecessary: () => savePreference("necessary"),
      openSettings,
    }),
    [openSettings, preference, savePreference],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {isReady && (
        <CookieConsentBanner
          isOpen={isOpen}
          hasSavedPreference={preference !== null}
          onAcceptAll={value.acceptAll}
          onAcceptNecessary={value.acceptNecessary}
        />
      )}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }

  return context;
}
