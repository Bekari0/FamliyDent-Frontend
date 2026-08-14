import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  ChevronDown,
  ClipboardList,
  Loader2,
  LogOut,
  Menu,
  Phone,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import {
  getAccountNavigationItems,
  performMobileBooking,
  performMobileNavigation,
  performRouteChange,
  performShellLogout,
} from "@/components/application-shell-model";
import {
  ABOUT_NAV_ITEMS,
  MORE_NAV_ITEMS,
  PEOPLE_NAV_ITEMS,
  PRIMARY_NAV_ITEMS,
  type NavigationItem,
} from "@/lib/site-navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LEADING_NAV_PATHS = new Set(["/services", "/results", "/pricing"]);
const CONTACT_NAV_ITEM = PRIMARY_NAV_ITEMS.find((item) => item.href === "/contacts");

function Logo({ className }: { className?: string }) {
  return <img src="/Logo.svg" alt="" aria-hidden="true" className={className} />;
}

interface NavigationGroupProps {
  label: string;
  items: readonly NavigationItem[];
  isActive: boolean;
}

function NavigationGroup({ label, items, isActive }: NavigationGroupProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn("header-nav-group", isActive && "header-nav-group-active")}
          aria-label={`Открыть раздел «${label}»`}
        >
          {label}
          <ChevronDown className="header-nav-group-icon" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="header-nav-dropdown" sideOffset={12}>
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild className="header-nav-dropdown-item">
            <Link to={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavigationGroup({
  label,
  items,
  onNavigate,
}: Omit<NavigationGroupProps, "isActive"> & { onNavigate: () => void }) {
  return (
    <details className="mobile-nav-group">
      <summary className="mobile-nav-group-trigger">
        {label}
        <ChevronDown className="mobile-nav-group-icon" aria-hidden="true" />
      </summary>
      <div className="mobile-nav-group-links">
        {items.map((item) => (
          <Link key={item.href} to={item.href} className="mobile-nav-sub-link" onClick={onNavigate}>
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { openBooking } = useBooking();
  const { user, isAdmin, logout, loading } = useAuth();
  const isDoctor = user?.role === "doctor";
  const isHome = location.pathname === "/";
  const accountNavigationItems = getAccountNavigationItems({ isDoctor, isAdmin });

  useEffect(() => {
    performRouteChange({ closeMenu: () => setMobileMenuOpen(false) });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY <= 16) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(`${path}/`));

  const hasActiveItem = (items: readonly NavigationItem[]) =>
    items.some((item) => isActive(item.href));

  const handleLogout = async () => {
    await performShellLogout({
      closeMenu: () => setMobileMenuOpen(false),
      logout,
      navigateHome: () => navigate("/"),
    });
  };

  const handleMobileNavigation = () => {
    performMobileNavigation({ closeMenu: () => setMobileMenuOpen(false) });
  };

  const handleBooking = () => {
    openBooking();
  };

  const handleMobileBooking = () => {
    performMobileBooking({
      closeMenu: () => setMobileMenuOpen(false),
      openBooking,
    });
  };

  const renderUserSection = () => {
    if (loading) {
      return (
        <div className="header-user-loading" role="status" aria-label="Загрузка профиля">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      );
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="header-user-trigger" aria-label="Открыть меню профиля">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={12} className="header-user-dropdown">
            <DropdownMenuGroup className="px-3 py-2">
              <p className="truncate text-sm font-semibold text-ink">{user.displayName}</p>
              <p className="truncate text-xs text-editorial-muted">{user.email}</p>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {accountNavigationItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild className="header-user-item">
                <Link to={item.href}>
                  {item.href === "/profile" ? <User /> : item.href === "/admin" ? <Settings /> : <ClipboardList />}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="header-user-item header-logout-item">
              <LogOut />Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="header-auth-links">
        <Link to="/login" className="header-login-link">Войти</Link>
        <Link to="/register" className="header-register-link">Регистрация</Link>
      </div>
    );
  };

  return (
    <motion.header
      data-ui="reference-header"
      initial={false}
      animate={{ y: isVisible || mobileMenuOpen ? 0 : -100, opacity: isVisible || mobileMenuOpen ? 1 : 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      onFocusCapture={() => setIsVisible(true)}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] border-b border-rule/20 bg-ink/95 text-paper backdrop-blur-xl",
        "header-main",
        isScrolled || !isHome ? "header-scrolled" : "header-transparent",
      )}
    >
      <div className="header-container">
        <Link to="/" className="header-logo-link" aria-label="FamilyDent — на главную">
          <Logo className="header-logo-mark" />
        </Link>

        <nav className="header-nav-desktop" aria-label="Основная навигация">
          {PRIMARY_NAV_ITEMS.filter((item) => LEADING_NAV_PATHS.has(item.href)).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn("nav-link", isActive(item.href) && "nav-link-active")}
            >
              {item.label}
            </Link>
          ))}
          <NavigationGroup label="Люди" items={PEOPLE_NAV_ITEMS} isActive={hasActiveItem(PEOPLE_NAV_ITEMS)} />
          <NavigationGroup label="О нас" items={ABOUT_NAV_ITEMS} isActive={hasActiveItem(ABOUT_NAV_ITEMS)} />
          {CONTACT_NAV_ITEM && (
            <Link
              to={CONTACT_NAV_ITEM.href}
              aria-current={isActive(CONTACT_NAV_ITEM.href) ? "page" : undefined}
              className={cn("nav-link", isActive(CONTACT_NAV_ITEM.href) && "nav-link-active")}
            >
              {CONTACT_NAV_ITEM.label}
            </Link>
          )}
          <NavigationGroup label="Ещё" items={MORE_NAV_ITEMS} isActive={hasActiveItem(MORE_NAV_ITEMS)} />
        </nav>

        <div className="header-actions-desktop">
          <a href="tel:+992446606600" className="header-phone-link">
            <span className="header-phone-icon-wrap"><Phone className="header-phone-icon" /></span>
            <span>+992 446 60 66 00</span>
          </a>
          <Button type="button" onClick={handleBooking} className="header-booking-button">
            <Calendar className="h-3.5 w-3.5" />Записаться
          </Button>
          {renderUserSection()}
        </div>

        <div className="header-mobile-header">
          <a href="tel:+992446606600" className="header-mobile-phone-btn" aria-label="Позвонить в FamilyDent">
            <Phone className="header-mobile-phone-icon" />
          </a>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mobile-nav-trigger" aria-label="Открыть меню">
                <Menu className="mobile-nav-menu-icon" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="mobile-nav-content">
              <SheetTitle className="sr-only">Меню</SheetTitle>
              <div className="mobile-nav-inner">
                <div className="mobile-nav-header">
                  <Link to="/" className="mobile-sheet-logo-link" aria-label="FamilyDent — на главную" onClick={handleMobileNavigation}>
                    <Logo className="mobile-sheet-logo-mark" />
                  </Link>
                </div>
                <nav className="mobile-nav-links" aria-label="Мобильная навигация">
                  {PRIMARY_NAV_ITEMS.filter((item) => LEADING_NAV_PATHS.has(item.href)).map((item) => (
                    <Link key={item.href} to={item.href} className="mobile-nav-link" onClick={handleMobileNavigation}>{item.label}</Link>
                  ))}
                  <MobileNavigationGroup label="Люди" items={PEOPLE_NAV_ITEMS} onNavigate={handleMobileNavigation} />
                  <MobileNavigationGroup label="О нас" items={ABOUT_NAV_ITEMS} onNavigate={handleMobileNavigation} />
                  {CONTACT_NAV_ITEM && <Link to={CONTACT_NAV_ITEM.href} className="mobile-nav-link" onClick={handleMobileNavigation}>{CONTACT_NAV_ITEM.label}</Link>}
                  <MobileNavigationGroup label="Ещё" items={MORE_NAV_ITEMS} onNavigate={handleMobileNavigation} />

                  <div className="mobile-nav-account">
                    {user ? (
                      <>
                        {accountNavigationItems.map((item) => (
                          <Link key={item.href} to={item.href} className="mobile-nav-account-link" onClick={handleMobileNavigation}>
                            {item.href === "/profile" ? <User /> : item.href === "/admin" ? <Settings /> : <ClipboardList />}
                            {item.label}
                          </Link>
                        ))}
                        <button type="button" onClick={handleLogout} className="mobile-nav-account-link mobile-nav-logout"><LogOut />Выйти</button>
                      </>
                    ) : (
                      <div className="mobile-nav-auth-links">
                        <Link to="/login" className="mobile-nav-login" onClick={handleMobileNavigation}>Войти</Link>
                        <Link to="/register" className="mobile-nav-register" onClick={handleMobileNavigation}>Регистрация</Link>
                      </div>
                    )}
                  </div>
                </nav>
                <div className="mobile-nav-footer">
                  <Button type="button" onClick={handleMobileBooking} className="mobile-nav-cta">
                    <Calendar className="h-4 w-4" />Записаться на приём
                  </Button>
                  <a href="tel:+992446606600" className="mobile-nav-contact-phone">+992 446 60 66 00</a>
                  <p className="mobile-nav-contact-address">г. Душанбе, ул. Айни, 45</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
