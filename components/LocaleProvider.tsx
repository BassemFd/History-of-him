"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Locale } from "@/lib/strings";

type LocaleContext = { locale: Locale; setLocale: (l: Locale) => void };

const Ctx = createContext<LocaleContext | null>(null);

export function useLocale() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

// Same shape as ThemeProvider: persist to localStorage, sync from the
// no-flash inline script's <html lang> stamp on mount. A brief flash of
// English content on first paint for returning FR visitors is the accepted
// tradeoff — unlike theme colors, translating actual text needs JS either way.
export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const applied = document.documentElement.lang;
    if (applied === "en" || applied === "fr") setLocaleState(applied);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    document.documentElement.lang = l;
    try {
      localStorage.setItem("locale", l);
    } catch {
      /* private mode / storage disabled — locale still applies for the session */
    }
    setLocaleState(l);
  }, []);

  return <Ctx.Provider value={{ locale, setLocale }}>{children}</Ctx.Provider>;
}
