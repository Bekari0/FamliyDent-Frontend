import { Button, Heading, Text } from "@/ui-kit";
import { Cookie } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CookiePreference = "all" | "necessary";

interface CookieConsentContextValue {
  preference: CookiePreference | null;
  externalContentAllowed: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  openSettings: () => void;
}

const STORAGE_KEY = "familydent-cookie-consent-v1";

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

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
          transition={{
            duration: reduceMotion ? 0 : 0.42,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 z-[80] max-h-[calc(100dvh-2.5rem)] w-[calc(100%-1.5rem)] overflow-y-auto sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:left-5 sm:w-96 desktop:w-[30vw]"
        >
          <div
            className="relative w-full overflow-hidden rounded-xl border border-on-dark/15 bg-ink/95 text-paper shadow-dialog backdrop-blur-xl"
            data-ui-scheme="inverse"
          >
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
              aria-hidden="true"
            />

            <div className="min-w-0 px-5 pb-4 pt-5">
              <div className="type-overline mb-2 flex items-center gap-2 uppercase text-accent-2">
                <Cookie aria-hidden="true" className="size-3.5" />
                {hasSavedPreference ? "Настройки cookie" : "Ваш выбор важен"}
              </div>
              <Heading
                level={2}
                variant="heading-5"
                id="cookie-consent-title"
                className="text-paper"
              >
                Конфиденциальность — без мелкого шрифта
              </Heading>
              <Text
                variant="body-sm"
                id="cookie-consent-description"
                className="mt-2 text-paper/65"
              >
                Необходимые данные помогают сайту запомнить ваш выбор. С вашего
                согласия мы также загрузим Яндекс Карты и видео из Instagram —
                эти сервисы могут использовать собственные cookie.
              </Text>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-on-dark/10 p-4">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={onAcceptNecessary}
                className="w-full"
              >
                Только необходимые
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="button"
                onClick={onAcceptAll}
                className="w-full"
              >
                Принять все
              </Button>
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
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider",
    );
  }

  return context;
}
