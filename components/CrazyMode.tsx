"use client";

import { useEffect, useRef, useState } from "react";
import CrazyScene from "./CrazyScene";

// Crazy-mode chrome: the ambient three.js backdrop (CrazyScene) plus a roaming
// blob creature layered above it. Mounted only while theme === "crazy"
// (ThemeProvider unmounts it on exit, which tears down every rAF loop below).
export default function CrazyMode() {
  const blobRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // DVD-bounce with personality: squash on wall hits, occasional flip.
  useEffect(() => {
    if (reduced) return;
    const el = blobRef.current;
    if (!el) return;

    const SIZE = 96;
    let x = Math.random() * (window.innerWidth - SIZE);
    let y = Math.random() * (window.innerHeight - SIZE);
    let vx = 2.4;
    let vy = 1.8;
    let flip = 0; // frames left of a barrel roll
    let raf = 0;

    function step() {
      const maxX = window.innerWidth - SIZE;
      const maxY = window.innerHeight - SIZE;
      x += vx;
      y += vy;

      let squashX = 1;
      let squashY = 1;
      if (x <= 0 || x >= maxX) {
        vx = -vx;
        x = Math.max(0, Math.min(maxX, x));
        squashX = 0.7;
        if (Math.random() < 0.4) flip = 30;
      }
      if (y <= 0 || y >= maxY) {
        vy = -vy;
        y = Math.max(0, Math.min(maxY, y));
        squashY = 0.7;
        if (Math.random() < 0.4) flip = 30;
      }

      const roll = flip > 0 ? (30 - flip) * 12 : 0;
      if (flip > 0) flip--;

      el!.style.transform = `translate(${x}px, ${y}px) rotate(${roll}deg) scale(${squashX}, ${squashY})`;
      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <>
      <CrazyScene />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[40] overflow-hidden"
      >
        {/* Blob creature. Static (centred-ish) under reduced motion. */}
        <div
          ref={blobRef}
          className="absolute left-0 top-0 h-24 w-24"
          style={reduced ? { transform: "translate(24px, 120px)" } : undefined}
        >
          <div
            className="grid h-full w-full place-items-center bg-accent shadow-lg"
            style={{
              animation: reduced ? undefined : "crazy-blob-wobble 3s ease-in-out infinite",
              borderRadius: "46% 54% 58% 42% / 54% 46% 54% 46%",
            }}
          >
            {/* face */}
            <div className="flex gap-2">
              <span className="block h-3 w-3 rounded-full bg-white" />
              <span className="block h-3 w-3 rounded-full bg-white" />
            </div>
            <span className="absolute bottom-6 h-2 w-6 rounded-b-full border-b-2 border-white" />
          </div>
        </div>
      </div>
    </>
  );
}
