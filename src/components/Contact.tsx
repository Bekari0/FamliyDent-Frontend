import * as React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Заявка успешно отправлена!', {
      description: 'Мы свяжемся с вами в ближайшее время для подтверждения записи.',
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Телефон',
      value: '+992 446 60 66 00',
      description: 'Пн - Сб: 7:30 - 19:00',
      href: 'tel:+992 446 60 66 00'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'familydent.tj@gmail.com',
      description: 'Для общих вопросов',
      href: 'mailto:familydent.tj@gmail.com'
    },
    {
      icon: MapPin,
      title: 'Адрес',
      value: 'г. Душанбе, ул. Рудаки 123',
      description: 'Центральный вход, 2 этаж',
      href: '#'
    }
  ];

  return (
    <section id="contacts" className="contact-section">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch">
          <div className="flex-1 space-y-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-12 h-0.5 bg-primary" />
                <span className="section-subtitle">Контакты</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-title lg:text-6xl mb-8"
              >
                Остались вопросы? <br />
                <span className="text-primary">Свяжитесь с нами</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-600 leading-relaxed max-w-xl"
              >
                Мы всегда на связи, чтобы помочь вам. Выберите удобный способ связи или заполните форму, и мы перезвоним вам в течение 15 минут.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="contact-card group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <info.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{info.title}</h4>
                  <p className="text-sm font-bold text-slate-900 mb-1">{info.value}</p>
                  <p className="text-xs text-slate-400 font-medium">{info.description}</p>
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-primary rounded-[32px] shadow-2xl shadow-primary/20 text-white flex flex-col justify-center"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold">AI Помощник</span>
                </div>
                <p className="text-sm opacity-90 leading-relaxed">
                  Наш AI-ассистент доступен 24/7 и готов ответить на любые вопросы прямо сейчас.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <Card className="contact-form-card">
                <CardContent className="p-8 lg:p-12">
                  <div className="mb-10">
                    <h3 className="text-3xl font-display font-bold text-slate-900 mb-3">Записаться на прием</h3>
                    <p className="text-slate-500">Заполните форму, и мы подберем для вас удобное время.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Ваше имя</label>
                        <Input 
                          placeholder="Иван Иванов" 
                          required 
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Телефон</label>
                        <Input 
                          type="tel" 
                          placeholder="+992 (___) __-__-__" 
                          required 
                          className="input-field"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Выберите услугу</label>
                      <select className="w-full h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 px-4 text-slate-600 text-base appearance-none cursor-pointer">
                        <option>Профилактический осмотр</option>
                        <option>Лечение кариеса</option>
                        <option>Профессиональная чистка</option>
                        <option>Имплантация</option>
                        <option>Ортодонтия (брекеты)</option>
                        <option>Отбеливание зубов</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Комментарий (необязательно)</label>
                      <Textarea 
                        placeholder="Опишите вашу проблему или пожелания..." 
                        className="min-h-[120px] rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-base p-4"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Отправка...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          Отправить заявку
                        </div>
                      )}
                    </Button>
                    
                    <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности <br />
                      и обработкой персональных данных.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


