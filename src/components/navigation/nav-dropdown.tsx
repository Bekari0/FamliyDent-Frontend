import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface NavDropdownItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
  isActive?: boolean;
}

export function NavDropdown({ label, items, isActive }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const toggleClick = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close when route location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={toggleClick}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`relative text-xs font-medium transition-colors duration-200 cursor-pointer rounded px-1.5 py-1 flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-accent/50 ${
          isActive || isOpen ? "text-white" : "text-white/70 hover:text-white"
        }`}
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-accent" : "text-white/60"}`}
        />

        {(isActive || isOpen) && (
          <motion.span
            layoutId="activeNavIndicator"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-accent rounded-full"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 min-w-[280px] w-max max-w-[340px] sm:max-w-[380px] rounded-2xl bg-ink/95 border border-rule/20 p-2 shadow-2xl backdrop-blur-xl z-50"
          >
            <div className="flex flex-col gap-0.5">
              {items.map((item) => {
                const isItemActive = location.pathname + location.hash === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isItemActive ? "page" : undefined}
                    className={`text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between gap-3 leading-snug whitespace-normal break-words ${
                      isItemActive
                        ? "bg-accent/20 text-accent font-medium"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="flex-1 break-words">{item.label}</span>
                    {isItemActive && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
