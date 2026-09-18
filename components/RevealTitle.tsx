"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const HEAL_TAIL_MS = 2000; // how long the canvas keeps healing after the last brush stroke
const BRUSH_RADIUS = 70;

// A scratch-card style reveal: the canvas starts painted solid in the page
// background color, hiding a gradient panel underneath. Moving the cursor
// over it erases a soft circular hole (destination-out); the hole slowly
// heals back to solid once the cursor leaves or stops moving. Light theme
// only — the gradient is tuned for the light palette.
export default function RevealTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (theme !== "light") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paper = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-paper")
      .trim();
    const paperColor = `rgb(${paper})`;

    let width = 0;
    let height = 0;
    let raf = 0;
    let healUntil = 0;
    let pointer: { x: number; y: number } | null = null;

    function fillSolid() {
      ctx!.globalCompositeOperation = "source-over";
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = paperColor;
      ctx!.fillRect(0, 0, width, height);
    }

    function resize() {
      const rect = container!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      fillSolid();
    }

    function loop() {
      // Slowly re-solidify everything — a no-op visually on already-solid
      // areas, and a gradual heal on erased ones.
      ctx!.globalCompositeOperation = "source-over";
      ctx!.globalAlpha = 0.045;
      ctx!.fillStyle = paperColor;
      ctx!.fillRect(0, 0, width, height);
      ctx!.globalAlpha = 1;

      if (pointer) {
        const gradient = ctx!.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          BRUSH_RADIUS
        );
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.globalCompositeOperation = "destination-out";
        ctx!.fillStyle = gradient;
        ctx!.fillRect(
          pointer.x - BRUSH_RADIUS,
          pointer.y - BRUSH_RADIUS,
          BRUSH_RADIUS * 2,
          BRUSH_RADIUS * 2
        );
      }

      if (performance.now() < healUntil) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
        pointer = null;
      }
    }

    function start() {
      healUntil = performance.now() + HEAL_TAIL_MS;
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      start();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    container.addEventListener("pointermove", onMove);
    return () => {
      ro.disconnect();
      container.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [theme]);

  return (
    <div ref={containerRef} className="relative inline-block">
      {theme === "light" && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent via-teal to-violet opacity-70" />
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />
        </>
      )}
      <h1 className={`relative select-none ${className ?? ""}`}>{children}</h1>
    </div>
  );
}
