import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { Transition, Variants } from "motion/react";
import { OrbitalRings } from "./OrbitalRings";

interface CentralLogoProps {
  colorMode?: "emerald-gradient" | "white" | "glowing-white";
  className?: string;
}

export function CentralLogo({ colorMode: _colorMode = "glowing-white", className = "" }: CentralLogoProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isEntered, setIsEntered] = useState(false);
  const [normMousePos, setNormMousePos] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const pointerX = useTransform(springX, [0, 1], [-16, 16]);
  const pointerY = useTransform(springY, [0, 1], [-14, 14]);
  const pointerRotateX = useTransform(springY, [0, 1], [5, -5]);
  const pointerRotateY = useTransform(springX, [0, 1], [-7, 7]);

  useEffect(() => {
    if (shouldReduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
      setNormMousePos({ x: (x - 0.5) * 2, y: (y - 0.5) * 2 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, shouldReduceMotion]);

  const entranceVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -20, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
    },
  };
  const loopAnimate = !shouldReduceMotion && isEntered
    ? { y: [-14, 14, -14], scale: [1, 1.03, 1], rotateY: [-8, 8, -8] }
    : {};
  const loopTransition: Transition | undefined = !shouldReduceMotion && isEntered
    ? {
        y: { duration: 7.5, ease: "easeInOut", repeat: Infinity },
        scale: { duration: 8.5, ease: "easeInOut", repeat: Infinity },
        rotateY: { duration: 9.5, ease: "easeInOut", repeat: Infinity },
      }
    : undefined;

  return (
    <div className={`relative mx-auto flex w-full aspect-square max-w-[310px] items-center justify-center overflow-visible pointer-events-none select-none sm:max-w-[390px] lg:max-w-[470px] xl:max-w-[550px] ${className}`}>
      <OrbitalRings mouseX={normMousePos.x} mouseY={normMousePos.y} layer="back" className="absolute top-1/2 left-1/2 z-0 h-[240%] w-[240%] -translate-x-1/2 -translate-y-1/2 pointer-events-none sm:h-[280%] sm:w-[280%] lg:h-[320%] lg:w-[320%]" />
      <motion.div
        className="relative z-10 flex h-full w-full items-center justify-center will-change-transform"
        style={{
          x: shouldReduceMotion ? 0 : pointerX,
          y: shouldReduceMotion ? 0 : pointerY,
          rotateX: shouldReduceMotion ? 0 : pointerRotateX,
          rotateY: shouldReduceMotion ? 0 : pointerRotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div variants={entranceVariants} initial="hidden" animate="visible" onAnimationComplete={() => setIsEntered(true)} className="relative flex h-full w-full items-center justify-center">
          <motion.div animate={loopAnimate} transition={loopTransition} className="relative z-10 flex h-full w-full items-center justify-center">
            <svg aria-label="Family Dent" data-orbital-rings="true" className="h-full w-full max-h-[340px] pointer-events-none select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)] sm:max-h-[416px] lg:max-h-[494px] xl:max-h-[572px]" viewBox="0 0 27 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g fill="#fff">
                <path d="M5.282 7.584A3.844 3.844 0 0 0 3.518.101a3.844 3.844 0 0 0 1.764 7.483ZM21.018 8.603a3.194 3.194 0 0 0-1.466-6.218 3.195 3.195 0 0 0 1.466 6.218ZM12.602 10.504a2.555 2.555 0 0 0 2.554-2.557 2.555 2.555 0 0 0-2.554-2.557 2.555 2.555 0 0 0-2.554 2.557 2.555 2.555 0 0 0 2.554 2.557Z" />
                <path d="M23.035 12.561c-.595-.92-1.563-1.648-2.68-1.727-1.1-.078-2.11.229-3.264.783-1.298.625-2.338 1.13-3.179 1.335-1.058.253-1.725.054-1.725.054.926 3.983 6.689 3.995 6.689 3.995-3.233 2.105-7.26.68-9.471-2.852l-.871-1.335C6.34 8.68 2.969 9.276 1.623 10.648.24 12.056-.017 13.698 0 17.554c.018 3.694.3 6.377 1.647 10.588 1.304 4.073 2.38 5.926 3.45 7.16 1.009 1.166 2.33 1.275 3.016-.5.83-2.124 2.031-6.257 2.626-7.839.475-1.27.974-1.87 1.839-1.793 1.088.09 1.448 1.444 1.79 2.587.428 1.408.632 2.172 1.455 4.807.673 2.142 2.188 2.617 3.366 1.366.865-.92 1.953-2.936 2.962-6.04 1.04-3.195 1.67-6.227 1.857-8.681.186-2.455.06-5.03-.98-6.642l.007-.006Z" />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
      <OrbitalRings mouseX={normMousePos.x} mouseY={normMousePos.y} layer="front" className="absolute top-1/2 left-1/2 z-20 h-[240%] w-[240%] -translate-x-1/2 -translate-y-1/2 pointer-events-none sm:h-[280%] sm:w-[280%] lg:h-[320%] lg:w-[320%]" />
    </div>
  );
}
