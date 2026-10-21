import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { NavDropdownItem } from "./nav-dropdown";

interface MobileNavGroupProps {
  label: string;
  items: NavDropdownItem[];
  onItemClick?: () => void;
}

export function MobileNavGroup({
  label,
  items,
  onItemClick,
}: MobileNavGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="type-button text-on-dark/90 hover:text-brand-text transition-colors py-2 px-4 flex items-center justify-center gap-2 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-text" : "text-on-dark/60"}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden w-full flex flex-col items-center gap-1.5 py-1 bg-surface/5 rounded-xl my-1"
          >
            {items.map((item) => {
              const isItemActive =
                location.pathname + location.hash === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => {
                    setIsOpen(false);
                    if (onItemClick) onItemClick();
                  }}
                  aria-current={isItemActive ? "page" : undefined}
                  className={`type-body-sm py-1.5 px-4 rounded-lg transition-colors ${
                    isItemActive
                      ? "text-brand-text "
                      : "text-on-dark/70 hover:text-on-dark"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
