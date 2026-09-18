"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

// Content tilts with scroll velocity and eases back to flat at rest — a small
// vanilla version of the Locomotive/Lenis skew effect, driven by native
// scroll events rather than a scroll-hijacking library, so keyboard/wheel/
// touch scrolling stays untouched. Crazy mode turns the same mechanism up a
// lot — bigger swing, slower settle — instead of adding a second effect.
export default function ScrollSkew({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastY = window.scrollY;
    let skew = 0;
    let raf = 0;

    function frame() {
      const y = window.scrollY;
      const velocity = y - lastY;
      lastY = y;

      const crazy = themeRef.current === "crazy";
      const max = crazy ? 14 : 3;
      const sensitivity = crazy ? 0.4 : 0.15;
      const ease = crazy ? 0.35 : 0.25;
      const decay = crazy ? 0.93 : 0.85;

      const target = Math.max(-max, Math.min(max, velocity * sensitivity));
      skew += (target - skew) * ease;
      skew *= decay;

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
