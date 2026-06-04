import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, RotateCcw, Send, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChatResponse } from "@/services/geminiService";
import { Message } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useBooking } from "@/context/BookingContext";
import styles from "./ChatWidget.module.css";

function scrollHorizontally(container: HTMLDivElement, event: WheelEvent) {
  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  if (maxScrollLeft <= 0) return;

  const delta =
    Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

  event.preventDefault();
  event.stopPropagation();
  container.scrollLeft = Math.max(
    0,
    Math.min(maxScrollLeft, container.scrollLeft + delta),
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { openBooking } = useBooking();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Здравствуйте! Я консультант FamilyDent. Помогу с услугами, ценами, адресом и записью на прием.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasDelayedPing, setHasDelayedPing] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const playNotificationSound = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.55);
      gain.connect(audioContext.destination);

      [0, 0.16].forEach((offset, index) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(index === 0 ? 740 : 920, audioContext.currentTime + offset);
        oscillator.connect(gain);
        oscillator.start(audioContext.currentTime + offset);
        oscillator.stop(audioContext.currentTime + offset + 0.12);
      });

      window.setTimeout(() => void audioContext.close(), 800);
    } catch {
      // Браузер может заблокировать звук до первого действия пользователя.
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("familydent-chat-pinged") === "true") return;

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("familydent-chat-pinged", "true");
      setHasDelayedPing(true);
      if (!isOpen) playNotificationSound();
    }, 15000);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setHasDelayedPing(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (widgetRef.current && !widgetRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    );
    if (scrollContainer)
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const container = quickActionsRef.current;
    if (!container || !isOpen) return;

    const handleWheel = (event: WheelEvent) => scrollHorizontally(container, event);
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => container.removeEventListener("wheel", handleWheel);
  }, [isOpen]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    if (messageText === "Записаться на прием") {
      openBooking();
      setIsOpen(false);
      return;
    }

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getChatResponse([...messages, userMessage]);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: response },
      ]);
    } catch {
      toast.error("Не удалось получить ответ");
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Извините, произошла техническая ошибка. Попробуйте позже или позвоните нам.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: "model", content: "Чат очищен. Чем еще могу помочь?" },
    ]);
    toast.info("История чата очищена");
  };

  const quickActions = [
    "Записаться на прием",
    "Цены на услуги",
    "Наш адрес",
    "График работы",
  ];

  return (
    <div className={styles.widgetWrapper} ref={widgetRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 16,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            className={styles.cardContainer}
          >
            <Card className={styles.card}>
              <div className={styles.header}>
                <div className={styles.headerInfo}>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.avatarBox}>
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div className={styles.statusIndicator} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={styles.title}>Консультант FamilyDent</h3>
                    <div className={styles.subtitleWrapper}>
                      <span className={styles.subtitle}>На связи</span>
                    </div>
                  </div>
                </div>
                <div className={styles.headerActions}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={styles.headerBtn}
                    onClick={clearChat}
                    title="Очистить чат"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={styles.headerBtn}
                    onClick={() => setIsOpen(false)}
                    title="Закрыть"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className={styles.scrollArea} ref={scrollRef}>
                <div className={styles.messagesContainer}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        styles.messageRow,
                        msg.role === "user"
                          ? styles.messageUser
                          : styles.messageResponse,
                      )}
                    >
                      <div className={styles.messageInner}>
                        <div className={styles.messageAvatar}>
                          {msg.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <MessageCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div className={styles.messageBubble}>
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className={styles.messageRow}>
                      <div className={styles.loadingBubble}>
                        <div className={styles.loadingDot} />
                        <div className={styles.loadingDot} />
                        <div className={styles.loadingDot} />
                        <span className={styles.loadingText}>Печатает...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className={styles.quickActions} ref={quickActionsRef}>
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    className={styles.quickActionBtn}
                    onClick={() => handleSend(action)}
                  >
                    {action}
                  </Button>
                ))}
              </div>

              <div className={styles.inputArea}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className={styles.inputForm}
                >
                  <Input
                    placeholder="Напишите вопрос..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={styles.inputField}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className={styles.sendBtn}
                    disabled={isLoading}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
                <p className={styles.disclaimer}>
                  Ответ в чате не заменяет консультацию врача.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={styles.triggerWrapper}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(styles.triggerBtn, "group")}
          title="Открыть чат"
        >
          <div className={styles.triggerGradient} />
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                className={styles.triggerIcon}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                className={cn(
                  "flex items-center justify-center",
                  styles.triggerIcon,
                )}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
        {!isOpen && hasDelayedPing && <div className={styles.notificationDot} />}
      </motion.div>
    </div>
  );
}
