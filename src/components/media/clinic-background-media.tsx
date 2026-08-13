import React from "react";
import { useReducedMotion } from "motion/react";

export interface ClinicBackgroundMediaProps {
  visible: boolean;
  onReady?: () => void;
  onError?: () => void;
}

const posterStyle = {
  backgroundImage: "url('/images/clinic_about.jpg')",
};

export function ClinicBackgroundMedia({ visible, onReady, onError }: ClinicBackgroundMediaProps) {
  const shouldReduceMotion = useReducedMotion();
  const showVideo = visible && !shouldReduceMotion;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-cover bg-center" style={posterStyle} />
      {showVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/clinic_about.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          onCanPlay={onReady}
          onError={onError}
        >
          <source src="/videos/familydent.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
