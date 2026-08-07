import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Calendar, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NavDropdown, type NavDropdownItem } from "./nav-dropdown";
import { MobileNavGroup } from "./mobile-nav-group";

interface SiteHeaderProps {
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  colorMode?: "emerald-gradient" | "white";
  onToggleColorMode?: () => void;
}

const PEOPLE_ITEMS: NavDropdownItem[] = [
  { label: "Врачи", href: "/doctors" },
  { label: "Медсёстры", href: "/people#nurses" },
  { label: "Администраторы", href: "/people#administrators" },
  { label: "Руководство", href: "/people#management" },
  { label: "Техническая и хозяйственная служба", href: "/people#technical" },
];

const ABOUT_ITEMS: NavDropdownItem[] = [
  { label: "О клинике", href: "/about" },
  { label: "Познакомьтесь с нашей клиникой", href: "/about/clinic-tour" },
  { label: "Современное оборудование", href: "/about/equipment" },
];

const MORE_ITEMS: NavDropdownItem[] = [
  { label: "Отзывы", href: "/reviews" },
  { label: "Блог", href: "/blog" },
  { label: "Стоматологический туризм", href: "/tourism" },
  { label: "Академия Family Dent", href: "/academy" },
  { label: "FAQ", href: "/faq" },
];

export function SiteHeader({
  onOpenBooking,
  onOpenAuth,
  colorMode = "emerald-gradient",
  onToggleColorMode,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isPeopleActive = currentPath === "/people" || currentPath === "/doctors";
  const isAboutActive = currentPath.startsWith("/about");
  const isMoreActive = ["/reviews", "/blog", "/tourism", "/academy", "/faq"].includes(currentPath);

  return (
    <header className="sticky top-0 z-40 w-full bg-ink/95 backdrop-blur-xl border-b border-rule/20 transition-all text-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center group focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded-lg p-1 flex-shrink-0"
          aria-label="Family Dent Главная"
        >
          <svg
            width="196"
            height="40"
            viewBox="0 0 196 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 sm:h-9 w-auto text-white transition-transform duration-300 group-hover:scale-105"
          >
            <g clipPath="url(#a)" fill="#fff">
              <path d="M132.299 12.73h7.164c2.938 0 5.384.872 7.331 2.616 1.953 1.745 2.927 4.097 2.927 7.057v1.101c0 2.96-.974 5.312-2.927 7.057-1.953 1.744-4.399 2.617-7.331 2.617h-7.164V12.73Zm7.536 16.844c1.719 0 3.095-.553 4.135-1.672 1.033-1.113 1.55-2.677 1.55-4.68v-1.114c0-2.009-.517-3.573-1.55-4.692-1.04-1.12-2.416-1.678-4.135-1.678h-2.728v13.836h2.728ZM152.131 25.2c0-2.351.739-4.27 2.217-5.75 1.478-1.486 3.408-2.226 5.793-2.226 2.386 0 4.273.698 5.607 2.087 1.334 1.39 2.001 3.273 2.001 5.643v1.612H155.73v-3.008h7.813v.15a4.567 4.567 0 0 0-.667-2.297c-.427-.71-1.28-1.06-2.554-1.06-1.052 0-1.881.446-2.482 1.343-.601.896-.902 2.009-.902 3.338v.56s.12 2.448.769 3.357c.649.902 1.635 1.353 2.957 1.353.878 0 1.641-.168 2.284-.511.643-.337 1.16-.728 1.55-1.161l2.897 1.973c-.475.782-1.298 1.45-2.482 2.015-1.184.56-2.584.843-4.207.843-2.62 0-4.645-.728-6.081-2.19-1.437-1.462-2.494-5.691-2.494-5.691V25.2ZM170.159 17.542h4.351l.084 1.805h.144c.499-.674 1.16-1.185 1.978-1.54a6.762 6.762 0 0 1 2.68-.53c1.725 0 3.119.47 4.188 1.408 1.064.939 1.599 2.599 1.599 4.993v9.5h-4.808v-9.373c0-1.035-.24-1.769-.715-2.214-.481-.44-1.13-.662-1.959-.662-.745 0-1.406.21-1.989.626a4.153 4.153 0 0 0-1.346 1.618v9.999h-4.207V17.53v.012ZM186.385 17.542H196v3.008h-9.615v-3.008Zm2.404 1.961.601-.409v-5.161h3.365l-.601 4.295.841 1.907v8.152c0 .655.132 1.119.397 1.395.264.277.655.416 1.172.416.252 0 .499-.03.733-.09.234-.06.469-.133.703-.211v3.284c-.198.109-.493.205-.871.283-.379.078-.794.12-1.232.12-1.527 0-2.759-.379-3.696-1.137-.944-.758-1.412-2.015-1.412-3.784v-9.06ZM32.541 12.128h14.423v3.61H37.35l-.6 5.414h9.013v3.61h-9.014v8.422h-4.206V12.128ZM66.796 17.542h3.948l.084 1.805h.066s1.13-1.125 1.917-1.474a6.298 6.298 0 0 1 2.542-.517c1.16 0 2.146.222 2.95.668.806.445 1.798 1.925 1.798 1.925h-.18a5.58 5.58 0 0 1 2.265-1.943 6.972 6.972 0 0 1 3.065-.686c1.664 0 3.01.487 4.044 1.456 1.028.968 1.545 2.653 1.545 5.035v9.367h-4.207V23.9c-.006-1.035-.228-1.787-.655-2.262-.427-.475-1.01-.71-1.743-.71-.673 0-1.262.21-1.767.632-.504.421-.919.957-1.243 1.6v10.017h-4.808v-9.265c0-1.04-.216-1.799-.655-2.274-.439-.475-1.028-.71-1.767-.71-.667 0-1.25.21-1.755.638-.504.427-.92.963-1.232 1.606v9.999h-4.206V17.53l-.006.012ZM94.56 11.911c.45-.427 1.105-.643 1.959-.643.853 0 1.514.21 1.965.643.45.427.673.969.673 1.625 0 .655-.222 1.209-.673 1.63-.445.427-1.1.638-1.965.638-.866 0-1.479-.211-1.947-.632-.463-.421-.691-.963-.691-1.636 0-.674.228-1.198.679-1.625Zm-.12 5.631h4.206v15.642H94.44V17.542ZM102.252 11.526h4.206v21.658h-4.206V11.526ZM54.627 33.55c-1.287 0-2.537-.324-3.576-.968-1.04-.643-1.863-1.582-2.464-2.815-.601-1.227-.902-2.701-.902-4.416 0-1.714.307-3.104.92-4.355.613-1.252 1.448-2.202 2.506-2.858 1.058-.656 2.32-.987 3.606-.987.937 0 1.754.15 2.464.458a5.84 5.84 0 0 1 1.718 1.106c.517.476.974 1.15 1.076 1.733l-.397 1.029v-3.935h4.207v15.642h-4.207v-2.846l.583-.36c-.12.607-.763 1.178-1.196 1.726-.426.547-1.015.986-1.76 1.33-.746.342-1.605.517-2.584.517h.005Zm1.508-12.982c-.793 0-1.502.199-2.115.596a3.8 3.8 0 0 0-1.407 1.654c-.324.704-.486 1.528-.486 2.479 0 .95.162 1.775.486 2.49.325.716.794 1.27 1.407 1.655.612.385 1.316.578 2.115.578.8 0 1.526-.187 2.133-.56.601-.373 1.07-.914 1.407-1.618.336-.704.504-1.528.504-2.479v-.132c0-.927-.168-1.739-.505-2.443-.336-.704-.805-1.251-1.406-1.636-.6-.385-1.31-.578-2.133-.578v-.006ZM120.28 28.293a4.148 4.148 0 0 1-1.346 1.63 3.307 3.307 0 0 1-1.989.632c-.829 0-1.478-.223-1.959-.668-.481-.445-.715-1.191-.715-2.232V17.536h-4.207v8.807c0 2.395.379 3.839 1.551 5.228 1.021 1.21 2.734 1.98 4.417 1.98 1.857 0 2.878-.566 3.707-1.33.716-.662 1.268-1.45 1.587-2.653h.27s.133 1.997-.649 3.82c-.823 1.92-2.391 2.888-4.597 2.888-2.548 0-4.122-1.528-4.122-1.528l-2.23 2.875s2.218 2.37 6.124 2.37c4.94 0 8.365-4.096 8.365-10.16l.012-12.297h-4.219v10.757ZM5.282 7.584A3.844 3.844 0 0 0 3.518.101a3.844 3.844 0 0 0 1.764 7.483ZM21.018 8.603a3.194 3.194 0 0 0-1.466-6.218 3.195 3.195 0 0 0 1.466 6.218ZM12.602 10.504a2.555 2.555 0 0 0 2.554-2.557 2.555 2.555 0 0 0-2.554-2.557 2.555 2.555 0 0 0-2.554 2.557 2.555 2.555 0 0 0 2.554 2.557Z" />
              <path d="M23.035 12.561c-.595-.92-1.563-1.648-2.68-1.727-1.1-.078-2.11.229-3.264.783-1.298.625-2.338 1.13-3.179 1.335-1.058.253-1.725.054-1.725.054.926 3.983 6.689 3.995 6.689 3.995-3.233 2.105-7.26.68-9.471-2.852l-.871-1.335C6.34 8.68 2.969 9.276 1.623 10.648.24 12.056-.017 13.698 0 17.554c.018 3.694.3 6.377 1.647 10.588 1.304 4.073 2.38 5.926 3.45 7.16 1.009 1.166 2.33 1.275 3.016-.5.83-2.124 2.031-6.257 2.626-7.839.475-1.27.974-1.87 1.839-1.793 1.088.09 1.448 1.444 1.79 2.587.428 1.408.632 2.172 1.455 4.807.673 2.142 2.188 2.617 3.366 1.366.865-.92 1.953-2.936 2.962-6.04 1.04-3.195 1.67-6.227 1.857-8.681.186-2.455.06-5.03-.98-6.642l.007-.006Z" />
            </g>
            <defs>
              <clipPath id="a">
                <path fill="#fff" d="M0 0h196v40H0z" />
              </clipPath>
            </defs>
          </svg>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white/[0.04] border border-white/10 rounded-full px-3.5 py-1 shadow-lg shrink-0 whitespace-nowrap">
          <Link
            to="/services"
            aria-current={currentPath === "/services" ? "page" : undefined}
            className={`text-xs font-medium px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              currentPath === "/services" ? "text-white font-semibold" : "text-white/70 hover:text-white"
            }`}
          >
            Услуги
          </Link>

          <Link
            to="/results"
            aria-current={currentPath === "/results" ? "page" : undefined}
            className={`text-xs font-medium px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              currentPath === "/results" ? "text-white font-semibold" : "text-white/70 hover:text-white"
            }`}
          >
            Результаты лечения
          </Link>

          <NavDropdown
            label="Люди Family Dent"
            items={PEOPLE_ITEMS}
            isActive={isPeopleActive}
          />

          <NavDropdown
            label="О нас"
            items={ABOUT_ITEMS}
            isActive={isAboutActive}
          />

          <Link
            to="/contacts"
            aria-current={currentPath === "/contacts" ? "page" : undefined}
            className={`text-xs font-medium px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              currentPath === "/contacts" ? "text-white font-semibold" : "text-white/70 hover:text-white"
            }`}
          >
            Контакты
          </Link>

          <NavDropdown
            label="Ещё"
            items={MORE_ITEMS}
            isActive={isMoreActive}
          />
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 whitespace-nowrap">
          <a
            href="tel:+992446606600"
            className="flex items-center gap-2 text-xs font-medium text-[var(--color-paper)]/85 hover:text-[var(--color-accent-2)] transition-colors whitespace-nowrap shrink-0"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] shrink-0">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <span className="whitespace-nowrap">+992 446 60 66 00</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-pill border border-paper bg-paper px-4 font-semibold text-xs text-ink transition duration-[var(--dur-micro)] ease-out hover:border-accent hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus cursor-pointer shadow-md whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-ink shrink-0" />
            <span>Записаться</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden relative h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer text-white"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-ink border-b border-rule/20 px-6 py-6 flex flex-col items-center gap-4 text-center overflow-y-auto max-h-[85vh]"
          >
            <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-medium text-paper hover:text-accent py-1"
            >
              Услуги
            </Link>

            <Link
              to="/results"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-medium text-paper hover:text-accent py-1"
            >
              Результаты лечения
            </Link>

            <MobileNavGroup
              label="Люди Family Dent"
              items={PEOPLE_ITEMS}
              onItemClick={() => setMenuOpen(false)}
            />

            <MobileNavGroup
              label="О нас"
              items={ABOUT_ITEMS}
              onItemClick={() => setMenuOpen(false)}
            />

            <Link
              to="/contacts"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-medium text-paper hover:text-accent py-1"
            >
              Контакты
            </Link>

            <MobileNavGroup
              label="Ещё"
              items={MORE_ITEMS}
              onItemClick={() => setMenuOpen(false)}
            />

            <div className="w-full h-[1px] bg-rule/20 my-2" />

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full inline-flex min-h-11 items-center justify-center rounded-pill border border-paper bg-paper px-5 font-semibold text-ink transition duration-[var(--dur-micro)] ease-out hover:border-accent hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              <Calendar className="w-4 h-4" />
              <span>Записаться на приём</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
