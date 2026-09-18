"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const CONFETTI_COLORS = [
  "#FF2D95",
  "#FF7A18",
  "#FFD23F",
  "#00C2CB",
  "#C77DFF",
];

// All crazy-mode chrome: a roaming blob creature, an anime power-up doodle, and
// confetti rain — original art, no IP. Mounted only while theme === "crazy"
// (ThemeProvider unmounts it on exit, which tears down the rAF loop).
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

  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: `${(i % 10) * 0.6}s`,
        duration: `${4 + (i % 5)}s`,
        size: 6 + (i % 4) * 3,
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      {/* Confetti rain — CSS-only fall, skipped under reduced motion. */}
      {!reduced &&
        confetti.map((c, i) => (
          <span
            key={i}
            className="absolute top-0 block rounded-sm"
            style={{
              left: c.left,
              width: c.size,
              height: c.size * 1.6,
              backgroundColor: c.color,
              animation: `crazy-confetti-fall ${c.duration} linear ${c.delay} infinite`,
            }}
          />
        ))}

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

      {/* Anime power-up: original stick figure with an energy ring + charge. */}
      <div className="absolute bottom-6 right-6 h-32 w-24">
        {/* energy ring burst */}
        <span
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-manual"
          style={{
            animation: reduced ? undefined : "crazy-powerup 6s ease-out infinite",
          }}
        />
        <svg
          viewBox="0 0 60 90"
          className="relative h-full w-full text-ink"
          style={{
            animation: reduced ? undefined : "crazy-charge 6s ease-in-out infinite",
            transformOrigin: "bottom center",
          }}
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <circle cx="30" cy="14" r="8" />
            <line x1="30" y1="22" x2="30" y2="52" />
            {/* arms flung up mid power-up */}
            <line x1="30" y1="30" x2="14" y2="18" />
            <line x1="30" y1="30" x2="46" y2="18" />
            {/* braced legs */}
            <line x1="30" y1="52" x2="18" y2="80" />
            <line x1="30" y1="52" x2="42" y2="80" />
            {/* energy streaks */}
            <line x1="8" y1="60" x2="2" y2="52" stroke="#FFD23F" />
            <line x1="52" y1="60" x2="58" y2="52" stroke="#FFD23F" />
          </g>
        </svg>
      </div>
    </div>
  );
}
