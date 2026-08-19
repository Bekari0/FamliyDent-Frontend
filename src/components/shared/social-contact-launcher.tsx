import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const channels = [
  {
    name: "Telegram",
    detail: "@FamilyDentAssistant_bot",
    href: "https://t.me/FamilyDentAssistant_bot",
    icon: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/telegram/default.svg",
  },
  {
    name: "Instagram",
    detail: "@familydent.tj",
    href: "https://instagram.com/familydent.tj",
    icon: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/instagram/default.svg",
  },
  {
    name: "WhatsApp",
    detail: "+992 98 877 0009",
    href: "https://wa.me/992988770009",
    icon: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/whatsapp/default.svg",
  },
] as const;

export function SocialContactLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="social-contact-menu"
            role="menu"
            aria-label="Связаться с Family Dent"
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-1 rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-2 text-[var(--color-ink)] shadow-[var(--shadow-card)]"
          >
            <p className="px-3 pb-2 pt-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
              Напишите нам
            </p>
            {channels.map((channel, index) => (
              <motion.a
                key={channel.name}
                role="menuitem"
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.24, delay: index * 0.045 }}
                className="group flex min-h-14 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 transition-colors duration-200 hover:bg-[var(--color-paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-paper)]">
                  <img src={channel.icon} alt="" width={22} height={22} className="size-[22px] object-contain" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block font-body text-sm font-semibold">{channel.name}</span>
                  <span className="block truncate font-body text-xs text-[var(--color-muted)]">{channel.detail}</span>
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "Закрыть способы связи" : "Открыть способы связи"}
        aria-expanded={isOpen}
        aria-controls="social-contact-menu"
        onClick={() => setIsOpen((value) => !value)}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        className="flex size-14 items-center justify-center rounded-full border border-transparent bg-[var(--color-accent)] text-[var(--color-accent-ink)] shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-[color-mix(in_oklch,var(--color-accent)_88%,var(--color-ink))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklch,var(--color-focus)_35%,transparent)] sm:size-16"
      >
        <span className="sr-only">{isOpen ? "Закрыть" : "Связаться с клиникой"}</span>
        <motion.span animate={reduceMotion ? undefined : { rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.22 }}>
          {isOpen ? <X aria-hidden="true" className="size-6" /> : <MessageCircle aria-hidden="true" className="size-6" />}
        </motion.span>
      </motion.button>
    </div>
  );
}
