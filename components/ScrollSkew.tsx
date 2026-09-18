"use client";

import { useEffect, useRef } from "react";

// Content tilts with scroll velocity and eases back to flat at rest — a small
// vanilla version of the Locomotive/Lenis skew effect, driven by native
// scroll events rather than a scroll-hijacking library, so keyboard/wheel/
// touch scrolling stays untouched.
export default function ScrollSkew({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastY = window.scrollY;
    let skew = 0;
    let raf = 0;

    function frame() {
      const y = window.scrollY;
      const velocity = y - lastY;
      lastY = y;

      const target = Math.max(-3, Math.min(3, velocity * 0.15));
      skew += (target - skew) * 0.25;
      skew *= 0.85; // ease back to flat at rest

      if (ref.current) {
        ref.current.style.transform = `skewY(${skew.toFixed(3)}deg)`;
      }
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
