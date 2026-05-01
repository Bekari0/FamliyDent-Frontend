import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getChatResponse } from '@/services/geminiService';
import { Message } from '@/types';
import { toast } from 'sonner';


export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Здравствуйте! Я ваш AI-помощник FamilyDent. Чем я могу вам помочь?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // скролл
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse([...messages, userMessage]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast.error('Ошибка связи с AI');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Извините, произошла ошибка. Пожалуйста, попробуйте позже.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Чат очищен. Чем еще я могу помочь?' }]);
    toast.info('История чата очищена');
  };

  const quickActions = [
    "Записаться",
    "Цены",
    "Адрес",
    "График"
  ];


  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="mb-3"
          >
            <Card className="w-[320px] sm:w-[380px] h-[500px] flex flex-col overflow-hidden shadow-2xl rounded-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">FamilyDent AI</h3>
                    <p className="text-[10px] opacity-80">Всегда онлайн</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/10 rounded-lg" 
                    onClick={clearChat}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/10 rounded-lg" 
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-slate-50/50"
                style={{ scrollBehavior: 'smooth' }}
              >
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          msg.role === 'user' ? 'bg-primary text-white' : 'bg-white text-primary border border-slate-200'
                        }`}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`p-3 rounded-xl text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-1">
                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.3s]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5 shrink-0">
                {quickActions.map((action, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] h-7 rounded-lg bg-white border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all"
                    onClick={() => handleSend(action)}
                  >
                    {action}
                  </Button>
                ))}
              </div>
              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <Input 
                    placeholder="Напишите вопрос..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="rounded-xl h-10 text-sm bg-slate-50 border-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button type="submit" size="icon" className="h-10 w-10 rounded-xl shrink-0" disabled={isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <p className="text-[9px] text-center text-slate-400 mt-2">
                  AI может ошибаться
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center relative"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageCircle className="w-6 h-6" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
              />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}