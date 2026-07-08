import { useState, useEffect } from 'react';
import {
  Menu, Phone, User,
  LogOut, Settings, ClipboardList, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NAV_ITEMS = [
  { label: 'Главная', href: '/' },
  { label: 'Услуги', href: '/services' },
  { label: 'Врачи', href: '/doctors' },
  { label: 'Цены', href: '/pricing' },
  { label: 'Блог', href: '/blog' },
  { label: 'О нас', href: '/about' },
  { label: 'Контакты', href: '/#contacts' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout, loading } = useAuth();
  const isDoctor = user?.role === 'doctor';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const renderUserSection = () => {
    if (loading) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-card transition-colors hover:border-primary/40"
              aria-label="Меню пользователя"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-2 w-64 rounded-lg border-border p-1.5">
            <DropdownMenuGroup className="px-3 py-2.5">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold leading-none text-foreground">{user.displayName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="rounded-md">
              <Link to="/profile" className="flex w-full cursor-pointer items-center px-3 py-2">
                <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Профиль</span>
              </Link>
            </DropdownMenuItem>
            {isDoctor && (
              <DropdownMenuItem asChild className="rounded-md">
                <Link to="/doctor/dashboard" className="flex w-full cursor-pointer items-center px-3 py-2">
                  <ClipboardList className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Кабинет врача</span>
                </Link>
              </DropdownMenuItem>
            )}
            {!isDoctor && (
              <DropdownMenuItem asChild className="rounded-md">
                <Link to="/profile/bookings" className="flex w-full cursor-pointer items-center px-3 py-2">
                  <ClipboardList className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Мои записи</span>
                </Link>
              </DropdownMenuItem>
            )}
            {isAdmin && (
              <DropdownMenuItem asChild className="rounded-md">
                <Link to="/admin" className="flex w-full cursor-pointer items-center px-3 py-2">
                  <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Админ-панель</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer rounded-md px-3 py-2 text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2.5 h-4 w-4" />
              <span className="text-sm font-medium">Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="hidden items-center gap-2 lg:flex">
        <Button variant="ghost" asChild className="h-10 rounded-full px-4 text-sm font-medium text-foreground hover:bg-secondary">
          <Link to="/login">Войти</Link>
        </Button>
        <Button asChild className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
          <Link to="/book">Записаться на приём</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 lg:px-6">
      {/* Плавающая пилюля */}
      <div
        className={cn(
          'mx-auto max-w-7xl rounded-full border bg-card/95 backdrop-blur-sm transition-shadow',
          isScrolled ? 'border-border shadow-md' : 'border-border/60 shadow-sm'
        )}
      >
        <div className="flex h-14 items-center justify-between gap-6 pl-5 pr-2 lg:h-16 lg:pl-7 lg:pr-2.5">
          <Link to="/" className="text-foreground" aria-label="FamilyDent — на главную">
            <Logo className="h-7 w-auto lg:h-8" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm transition-colors',
                  isActive(item.href)
                    ? 'bg-secondary font-semibold text-foreground'
                    : 'font-medium text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {renderUserSection()}
          </div>

          {/* Мобильные действия */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="tel:+992446606600"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground"
              aria-label="Позвонить в клинику"
            >
              <Phone className="h-4 w-4" />
            </a>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md border border-border bg-card" aria-label="Открыть меню">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm border-border bg-background p-0">
                <div className="flex h-full flex-col">
                  <div className="border-b border-border px-6 py-5">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-foreground"
                      aria-label="FamilyDent — на главную"
                    >
                      <Logo className="h-8 w-auto" />
                    </Link>
                  </div>

                  <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Мобильная навигация">
                    <div className="flex flex-col">
                      {NAV_ITEMS.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="border-b border-border py-3.5 text-base font-medium text-foreground transition-colors hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                      {user ? (
                        <>
                          <Link to="/profile" className="border-b border-border py-3.5 text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                            Профиль
                          </Link>
                          {!isDoctor && (
                            <Link to="/profile/bookings" className="border-b border-border py-3.5 text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                              Мои записи
                            </Link>
                          )}
                          {isDoctor && (
                            <Link to="/doctor/dashboard" className="border-b border-border py-3.5 text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                              Кабинет врача
                            </Link>
                          )}
                          {isAdmin && (
                            <Link to="/admin" className="border-b border-border py-3.5 text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                              Админ-панель
                            </Link>
                          )}
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="border-b border-border py-3.5 text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                            Войти
                          </Link>
                          <Link to="/register" className="border-b border-border py-3.5 text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                            Регистрация
                          </Link>
                        </>
                      )}
                    </div>
                  </nav>

                  <div className="border-t border-border px-6 py-5">
                    <Button asChild className="mb-4 h-11 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary-hover">
                      <Link to="/book" onClick={() => setMobileMenuOpen(false)}>Записаться на приём</Link>
                    </Button>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Свяжитесь с нами</p>
                    <a href="tel:+992446606600" className="mt-1 block text-lg font-semibold text-foreground">
                      +992 446 60 66 00
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground">г. Душанбе, ул. Айни 14а</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
