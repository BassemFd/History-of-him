"use client";

import { useEffect, useRef } from "react";

const DURATION = 1500; // ms — the "sucked into a wormhole" moment

// Full-viewport canvas swirl that spins and zooms into a point while hue-cycling
// through the psychedelic palette, then unmounts and lets crazy mode take over.
// Only ever mounted when reduced motion is off (ThemeProvider gates that).
export default function VortexTransition({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;
    let raf = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ARMS = 6;
    const start = performance.now();

    function frame(now: number) {
      const t = Math.min(1, (now - start) / DURATION);
      const cx = width / 2;
      const cy = height / 2;

      // Fade the whole overlay in then out at the extremes.
      const alpha = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;

      ctx!.globalAlpha = 1;
      ctx!.fillStyle = "rgb(20 8 30)";
      ctx!.fillRect(0, 0, width, height);

      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.translate(cx, cy);
      ctx!.rotate(t * Math.PI * 9); // accelerating spin
      const scale = 1 + t * t * 7; // zoom into the centre
      ctx!.scale(scale, scale);
      ctx!.lineWidth = 5;
      ctx!.lineCap = "round";

      const reach = Math.hypot(cx, cy);
      for (let a = 0; a < ARMS; a++) {
        ctx!.beginPath();
        for (let i = 0; i < 200; i++) {
          const r = (i / 200) * reach;
          const ang = a * ((Math.PI * 2) / ARMS) + r * 0.035;
          const x = Math.cos(ang) * r;
          const y = Math.sin(ang) * r;
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        const hue = (a * 45 + t * 900) % 360;
        ctx!.strokeStyle = `hsl(${hue} 92% 58%)`;
        ctx!.stroke();
      }
      ctx!.restore();

      if (t >= 1) {
        doneRef.current();
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
}
