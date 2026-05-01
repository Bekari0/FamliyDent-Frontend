import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import Logo from '@/assets/images/logo/Logo.svg?react';
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-main">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Logo />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Современная стоматологическая клиника в Душанбе. Мы создаем здоровые и красивые улыбки с использованием передовых технологий и заботой о каждом пациенте.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Linkedin, href: '#' }
              ].map((social, i) => (
                <Button 
                  key={i}
                  size="icon" 
                  variant="ghost" 
                  className="footer-social-btn"
                  render={<a href={social.href} />}
                  nativeButton={false}
                >
                  <social.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-8 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Навигация
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Главная', href: '/' },
                { label: 'Услуги', href: '/services' },
                { label: 'Врачи', href: '/#doctors' },
                { label: 'Отзывы', href: '/#reviews' },
                { label: 'Контакты', href: '/#contacts' }
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-slate-400 hover:text-primary transition-all duration-300 text-sm flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-8 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Наши услуги
            </h4>
            <ul className="space-y-4">
              {[
                'Лечение кариеса',
                'Имплантация зубов',
                'Ортодонтия (брекеты)',
                'Профессиональная гигиена',
                'Детская стоматология'
              ].map((item) => (
                <li key={item}>
                  <Link 
                    to="/services" 
                    className="text-slate-400 hover:text-primary transition-all duration-300 text-sm flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-8 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Контакты
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-sm leading-relaxed">
                  г. Душанбе, <br />
                  ул. Рудаки 123
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <a href="tel:+992 446 60 66 00" className="text-slate-400 hover:text-primary transition-colors text-sm font-bold">
                  +992 446 60 66 00
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:familydent.tj@gmail.com" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  familydent.tj@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 mb-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span>© {currentYear} FamilyDent. Все права защищены.</span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1">
              Сделано с любовью для вашей улыбки
            </span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

