import React, { useEffect, useRef } from "react";

export interface OrbitalRingsProps {
  /** mouse position X normalized from -1 (left) to 1 (right) */
  mouseX?: number;
  /** mouse position Y normalized from -1 (top) to 1 (bottom) */
  mouseY?: number;
  /** 'back' draws z < 5 (behind object), 'front' draws z >= -5 (in front), 'all' draws full loop */
  layer?: "back" | "front" | "all";
  className?: string;
}

interface RingConfig {
  diameter: number; // 520, 620, 720 reference space
  tiltX: number; // inclination angle (radians)
  tiltY: number;
  tiltZ: number;
  speed: number; // rotation speed (rad / ms)
  dotSpeed: number; // glowing dot speed (rad / ms)
  colorFront: string;
  colorBack: string;
  dotColor: string;
  dotGlow: string;
  strokeWidth: number;
}

export function OrbitalRings({
  mouseX = 0,
  mouseY = 0,
  layer = "all",
  className = "",
}: OrbitalRingsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: mouseX, y: mouseY });

  // Sync mouse position smoothly without forcing component re-renders
  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // 3 3D orbital rings styled with elegant gold palette and proportioned to fit canvas unclipped
    const rings: RingConfig[] = [
      {
        diameter: 500,
        tiltX: 1.22, // ~70 deg inclination
        tiltY: 0.35,
        tiltZ: 0.2,
        speed: 0.00045,
        dotSpeed: 0.001,
        colorFront: "rgba(216, 200, 163, 0.9)", // Warm bright gold
        colorBack: "rgba(180, 155, 110, 0.38)",
        dotColor: "#FFFFFF",
        dotGlow: "rgba(216, 200, 163, 0.95)",
        strokeWidth: 1.5,
      },
      {
        diameter: 600,
        tiltX: -0.92, // ~-53 deg inclination
        tiltY: 1.1,
        tiltZ: -0.4,
        speed: -0.00035,
        dotSpeed: -0.00085,
        colorFront: "rgba(235, 222, 190, 0.8)",
        colorBack: "rgba(160, 138, 95, 0.3)",
        dotColor: "#FFF8E7",
        dotGlow: "rgba(235, 222, 190, 0.9)",
        strokeWidth: 1.3,
      },
      {
        diameter: 700,
        tiltX: 0.62, // ~35 deg inclination
        tiltY: -0.95,
        tiltZ: 0.8,
        speed: 0.00028,
        dotSpeed: 0.00065,
        colorFront: "rgba(216, 200, 163, 0.7)",
        colorBack: "rgba(140, 120, 80, 0.25)",
        dotColor: "#FFFFFF",
        dotGlow: "rgba(216, 200, 163, 0.85)",
        strokeWidth: 1.3,
      },
    ];

    let currentMouseX = mouseX;
    let currentMouseY = mouseY;

    const render = (now: number) => {
      // Use performance.now() directly for synchronized cross-layer timing
      const elapsed = now;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse coordinates for continuous smooth parallax response
      currentMouseX += (mouseRef.current.x - currentMouseX) * 0.06;
      currentMouseY += (mouseRef.current.y - currentMouseY) * 0.06;

      const cx = width / 2;
      const cy = height / 2;

      // Scale factor relative to 800px standard reference space
      const scaleFactor = Math.min(width, height) / 800;

      // Parallax rotation angles from mouse (-1 to 1)
      const mouseRotY = currentMouseX * 0.28;
      const mouseRotX = -currentMouseY * 0.28;

      // 3D Point transformation function
      const project3D = (
        x3d: number,
        y3d: number,
        z3d: number,
        rotX: number,
        rotY: number,
        rotZ: number
      ) => {
        // Z rotation
        const cosZ = Math.cos(rotZ);
        const sinZ = Math.sin(rotZ);
        const x1 = x3d * cosZ - y3d * sinZ;
        const y1 = x3d * sinZ + y3d * cosZ;
        const z1 = z3d;

        // Y rotation
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x2 = x1 * cosY + z1 * sinY;
        const y2 = y1;
        const z2 = -x1 * sinY + z1 * cosY;

        // X rotation
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const x3 = x2;
        const y3 = y2 * cosX - z2 * sinX;
        const z3 = y2 * sinX + z2 * cosX;

        // Parallax mouse rotation
        const cosMY = Math.cos(mouseRotY);
        const sinMY = Math.sin(mouseRotY);
        const px = x3 * cosMY + z3 * sinMY;
        const py = y3;
        const pz = -x3 * sinMY + z3 * cosMY;

        const cosMX = Math.cos(mouseRotX);
        const sinMX = Math.sin(mouseRotX);
        const finalX = px;
        const finalY = py * cosMX - pz * sinMX;
        const finalZ = py * sinMX + pz * cosMX;

        // Weak perspective projection
        const focalLength = 1000;
        const perspective = focalLength / (focalLength - finalZ * 0.4);

        return {
          x: cx + finalX * scaleFactor * perspective,
          y: cy + finalY * scaleFactor * perspective,
          z: finalZ,
          scale: perspective,
        };
      };

      const zThreshold = 0;

      rings.forEach((ring) => {
        const radius = ring.diameter / 2;
        const ringSpin = elapsed * ring.speed;
        const currentTiltY = ring.tiltY + ringSpin;
        const steps = 180;

        // Sample 3D circle points
        const points = [];
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * Math.PI * 2;
          const x3d = radius * Math.cos(t);
          const y3d = radius * Math.sin(t);

          const p = project3D(x3d, y3d, 0, ring.tiltX, currentTiltY, ring.tiltZ);
          points.push(p);
        }

        // Render line segments according to layer ('back' | 'front' | 'all')
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const avgZ = (p1.z + p2.z) / 2;

          const isBackSegment = avgZ < 5;
          const isFrontSegment = avgZ >= -5;

          if (layer === "back" && !isBackSegment) continue;
          if (layer === "front" && !isFrontSegment) continue;

          // Depth attenuation
          const normZ = Math.max(-1, Math.min(1, avgZ / radius));

          let strokeW: number;
          let strokeColor: string;

          if (avgZ >= 0) {
            // Front segment: bright, crisp, thicker
            const frontFactor = 0.6 + 0.4 * normZ;
            strokeW = ring.strokeWidth * scaleFactor * (1 + normZ * 0.25);
            strokeColor = ring.colorFront.replace(
              /[\d\.]+\)$/,
              `${(0.88 * frontFactor).toFixed(2)})`
            );
          } else {
            // Back segment: dimmer, thinner, subtle
            const backFactor = 0.35 + 0.35 * (1 + normZ);
            strokeW = ring.strokeWidth * scaleFactor * 0.85;
            strokeColor = ring.colorBack.replace(
              /[\d\.]+\)$/,
              `${(0.5 * backFactor).toFixed(2)})`
            );
          }

          ctx.lineWidth = Math.max(0.8, strokeW);
          ctx.strokeStyle = strokeColor;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Project position of glowing dot riding along the ring
        const dotT = elapsed * ring.dotSpeed;
        const dotX3d = radius * Math.cos(dotT);
        const dotY3d = radius * Math.sin(dotT);
        const dotP = project3D(dotX3d, dotY3d, 0, ring.tiltX, currentTiltY, ring.tiltZ);

        const isDotBack = dotP.z < zThreshold;
        const isDotFront = dotP.z >= zThreshold;

        const shouldRenderDot =
          layer === "all" ||
          (layer === "back" && isDotBack) ||
          (layer === "front" && isDotFront);

        if (shouldRenderDot) {
          const dotRadius = Math.max(2, 3.5 * scaleFactor * dotP.scale);
          const glowRadius = Math.max(8, 18 * scaleFactor * dotP.scale);

          const dotAlpha = isDotFront ? 1.0 : 0.45;

          const gradient = ctx.createRadialGradient(
            dotP.x,
            dotP.y,
            0,
            dotP.x,
            dotP.y,
            glowRadius
          );
          gradient.addColorStop(0, ring.dotGlow);
          gradient.addColorStop(0.35, ring.colorFront);
          gradient.addColorStop(1, "rgba(216, 200, 163, 0)");

          ctx.save();
          ctx.globalAlpha = dotAlpha;

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(dotP.x, dotP.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = ring.dotColor;
          ctx.beginPath();
          ctx.arc(dotP.x, dotP.y, dotRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [layer]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute pointer-events-none select-none ${className}`}
      style={{ touchAction: "none" }}
    />
  );
}

export default OrbitalRings;

