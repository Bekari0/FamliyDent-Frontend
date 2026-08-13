import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface ScrollAnimateProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  threshold?: number;
  as?: keyof React.JSX.IntrinsicElements;
  id?: string;
}

export function ScrollAnimate({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  yOffset = 24,
  threshold = 0.15,
  as = "div",
  id,
}: ScrollAnimateProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = as;
    return <Tag id={id} className={className}>{children}</Tag>;
  }

  const Component = (motion as any)[as] ?? motion.div;

  return (
    <Component
      id={id}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: threshold }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </Component>
  );
}
