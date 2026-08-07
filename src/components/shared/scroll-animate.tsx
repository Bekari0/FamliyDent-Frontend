import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface ScrollAnimateProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  threshold?: number;
  as?: string;
  id?: string;
  key?: React.Key;
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
    const Tag = as as any;
    return <Tag id={id} className={className}>{children}</Tag>;
  }

  const Component = (motion as any)[as] || motion.div;

  return (
    <Component
      id={id}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
  as?: string;
  id?: string;
  key?: React.Key;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  threshold = 0.1,
  as = "div",
  id,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = as as any;
    return <Tag id={id} className={className}>{children}</Tag>;
  }

  const Component = (motion as any)[as] || motion.div;

  return (
    <Component
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: threshold }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  duration?: number;
  as?: string;
  id?: string;
  key?: React.Key;
}

export function StaggerItem({
  children,
  className = "",
  yOffset = 24,
  duration = 0.5,
  as = "div",
  id,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = as as any;
    return <Tag id={id} className={className}>{children}</Tag>;
  }

  const Component = (motion as any)[as] || motion.div;

  return (
    <Component
      id={id}
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
