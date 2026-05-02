import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from '@/assets/images/logo/Logo.svg?react';
import { useBooking } from '@/context/BookingContext';


const NAV_ITEMS = [
  { label: 'Главная', href: '/' },
  { label: 'Услуги', href: '/services' },
  { label: 'Врачи', href: '/doctors' },
  { label: 'Отзывы', href: '/#reviews' },
  { label: 'Контакты', href: '/#contacts' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { openBooking } = useBooking();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <header
      className={cn(
        "header-main",
        isScrolled ? "header-scrolled" : "header-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Logo className="drop-shadow-2xl" />


        <nav className="hidden lg:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "nav-link group",
                isActive(item.href) ? "nav-link-active" : "nav-link-inactive"
              )}
            >
              {item.label}
              <span className={cn(
                "nav-link-underline",
                isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <a href="tel:+992 446 60 66 00" className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-primary" />
              +992 446 60 66 00
            </a>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Пн - Сб: 7:30 - 19:00</span>
          </div>
          <Button onClick={() => openBooking()} className="rounded-2xl px-8 py-6 shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
            <Calendar className="w-4 h-4 mr-2" />
            Записаться
          </Button>
        </div>

        <div className="lg:hidden flex items-center gap-3">
          <a href="tel:+992 446 60 66 00" className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Phone className="w-5 h-5" />
          </a>
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl bg-slate-50" />}>
              <Menu className="w-6 h-6 text-slate-900" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-none">
              <div className="flex flex-col h-full bg-white">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      F
                    </div>
                    <span className="text-xl font-display font-bold text-slate-900">
                      Family<span className="text-primary">Dent</span>
                    </span>
                  </div>
                </div>
                
                <nav className="flex-1 px-6 py-10 flex flex-col gap-8">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="text-2xl font-display font-bold text-slate-900 hover:text-primary transition-colors flex items-center justify-between group"
                    >
                      {item.label}
                      <ChevronDown className="w-5 h-5 -rotate-90 text-slate-300 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </nav>

                <div className="p-8 bg-slate-50 border-t border-slate-100">
                  <div className="mb-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Свяжитесь с нами</p>
                    <a href="tel:+992 446 60 66 00" className="text-2xl font-display font-bold text-slate-900 block mb-2">
                      +992 446 60 66 00
                    </a>
                    <p className="text-sm text-slate-500">г. Душанбе, ул. Рудаки 123</p>
                  </div>
                  <Button onClick={() => openBooking()} className="w-full rounded-2xl py-8 text-lg shadow-xl shadow-primary/20">
                    Записаться на прием
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
