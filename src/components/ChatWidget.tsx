import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, User, RotateCcw } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    );
    if (scrollContainer)
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [messages, isLoading, isOpen]);

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
    <div className={styles.widgetWrapper}>
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
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className={styles.statusIndicator} />
                  </div>
                  <div>
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
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={styles.headerBtn}
                    onClick={() => setIsOpen(false)}
                    title="Закрыть"
                  >
                    <X className="w-5 h-5" />
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
                            <User className="w-4 h-4" />
                          ) : (
                            <MessageCircle className="w-4 h-4" />
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

              <div className={styles.quickActions}>
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
                    <Send className="w-5 h-5" />
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
                <X className="w-6 h-6" />
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
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
        {!isOpen && <div className={styles.notificationDot} />}
      </motion.div>
    </div>
  );
}

