import React, { useEffect, useRef } from "react";

export interface OrbitalRingsProps {
  mouseX?: number;
  mouseY?: number;
  layer?: "back" | "front" | "all";
  className?: string;
}

type Point = { x: number; y: number; z: number; scale: number };

export function OrbitalRings({ mouseX = 0, mouseY = 0, layer = "all", className = "" }: OrbitalRingsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: mouseX, y: mouseY });

  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const rings = [
      { diameter: 500, tiltX: 1.22, tiltY: 0.35, tiltZ: 0.2, speed: 0.00045, dotSpeed: 0.001, front: "rgba(216, 200, 163, 0.9)", back: "rgba(180, 155, 110, 0.38)", dot: "#FFFFFF", glow: "rgba(216, 200, 163, 0.95)", stroke: 1.5 },
      { diameter: 600, tiltX: -0.92, tiltY: 1.1, tiltZ: -0.4, speed: -0.00035, dotSpeed: -0.00085, front: "rgba(235, 222, 190, 0.8)", back: "rgba(160, 138, 95, 0.3)", dot: "#FFF8E7", glow: "rgba(235, 222, 190, 0.9)", stroke: 1.3 },
      { diameter: 700, tiltX: 0.62, tiltY: -0.95, tiltZ: 0.8, speed: 0.00028, dotSpeed: 0.00065, front: "rgba(216, 200, 163, 0.7)", back: "rgba(140, 120, 80, 0.25)", dot: "#FFFFFF", glow: "rgba(216, 200, 163, 0.85)", stroke: 1.3 },
    ];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let currentMouseX = mouseX;
    let currentMouseY = mouseY;

    const draw = (elapsed: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!rect.width || !rect.height) return;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      context.save();
      context.scale(dpr, dpr);
      context.clearRect(0, 0, rect.width, rect.height);
      currentMouseX += (mouseRef.current.x - currentMouseX) * 0.06;
      currentMouseY += (mouseRef.current.y - currentMouseY) * 0.06;
      const scale = Math.min(rect.width, rect.height) / 800;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const project = (x: number, y: number, z: number, rotateX: number, rotateY: number, rotateZ: number): Point => {
        const cosZ = Math.cos(rotateZ); const sinZ = Math.sin(rotateZ);
        const x1 = x * cosZ - y * sinZ; const y1 = x * sinZ + y * cosZ;
        const cosY = Math.cos(rotateY); const sinY = Math.sin(rotateY);
        const x2 = x1 * cosY + z * sinY; const z2 = -x1 * sinY + z * cosY;
        const cosX = Math.cos(rotateX); const sinX = Math.sin(rotateX);
        const y3 = y1 * cosX - z2 * sinX; const z3 = y1 * sinX + z2 * cosX;
        const mouseYRotation = currentMouseX * 0.28;
        const px = x2 * Math.cos(mouseYRotation) + z3 * Math.sin(mouseYRotation);
        const pz = -x2 * Math.sin(mouseYRotation) + z3 * Math.cos(mouseYRotation);
        const mouseXRotation = -currentMouseY * 0.28;
        const finalY = y3 * Math.cos(mouseXRotation) - pz * Math.sin(mouseXRotation);
        const finalZ = y3 * Math.sin(mouseXRotation) + pz * Math.cos(mouseXRotation);
        const perspective = 1000 / (1000 - finalZ * 0.4);
        return { x: centerX + px * scale * perspective, y: centerY + finalY * scale * perspective, z: finalZ, scale: perspective };
      };

      rings.forEach((ring) => {
        const radius = ring.diameter / 2;
        const points: Point[] = [];
        const rotation = ring.tiltY + elapsed * ring.speed;
        for (let index = 0; index <= 180; index += 1) {
          const angle = (index / 180) * Math.PI * 2;
          points.push(project(radius * Math.cos(angle), radius * Math.sin(angle), 0, ring.tiltX, rotation, ring.tiltZ));
        }
        points.slice(0, -1).forEach((point, index) => {
          const next = points[index + 1];
          const z = (point.z + next.z) / 2;
          if ((layer === "back" && z >= 5) || (layer === "front" && z < -5)) return;
          const normalZ = Math.max(-1, Math.min(1, z / radius));
          context.lineWidth = Math.max(0.8, ring.stroke * scale * (z >= 0 ? 1 + normalZ * 0.25 : 0.85));
          context.strokeStyle = z >= 0 ? ring.front : ring.back;
          context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(next.x, next.y); context.stroke();
        });
        const dotAngle = elapsed * ring.dotSpeed;
        const dot = project(radius * Math.cos(dotAngle), radius * Math.sin(dotAngle), 0, ring.tiltX, rotation, ring.tiltZ);
        if (layer === "all" || (layer === "back" && dot.z < 0) || (layer === "front" && dot.z >= 0)) {
          const glow = Math.max(8, 18 * scale * dot.scale);
          const gradient = context.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, glow);
          gradient.addColorStop(0, ring.glow); gradient.addColorStop(0.35, ring.front); gradient.addColorStop(1, "rgba(216, 200, 163, 0)");
          context.globalAlpha = dot.z >= 0 ? 1 : 0.45;
          context.fillStyle = gradient; context.beginPath(); context.arc(dot.x, dot.y, glow, 0, Math.PI * 2); context.fill();
          context.fillStyle = ring.dot; context.beginPath(); context.arc(dot.x, dot.y, Math.max(2, 3.5 * scale * dot.scale), 0, Math.PI * 2); context.fill(); context.globalAlpha = 1;
        }
      });
      context.restore();
      if (!prefersReducedMotion) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [layer]);

  return <canvas ref={canvasRef} data-orbital-rings="true" className={`absolute pointer-events-none select-none ${className}`} style={{ touchAction: "none" }} />;
}

export default OrbitalRings;
