import React, { useRef } from "react";
import { motion, useSpring } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MagneticButton({ children, onClick, className = "" }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // Smooth springs for magnetic motion
  const x = useSpring(0, { stiffness: 120, damping: 18, mass: 0.5 });
  const y = useSpring(0, { stiffness: 120, damping: 18, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    // Check if device has a fine pointer (desktop with mouse/trackpad)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Restrain maximum movement to approximately 8px
    const strength = 0.22;
    const maxMovement = 8;
    const distanceX = Math.min(Math.max(deltaX * strength, -maxMovement), maxMovement);
    const distanceY = Math.min(Math.max(deltaY * strength, -maxMovement), maxMovement);

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`liquid-glass select-none transition-all duration-300 hover:bg-white/[0.08] active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 ${className}`}
    >
      {children}
    </motion.button>
  );
}
