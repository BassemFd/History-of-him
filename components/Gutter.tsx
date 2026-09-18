"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { useTheme, type Theme } from "./ThemeProvider";

const THEMES: { id: Theme; label: string }[] = [
  { id: "light", label: "lgt" },
  { id: "dark", label: "drk" },
  { id: "crazy", label: "???" },
];

// Terminal-styled theme switch — mono, muted until active. "???" is the hidden
// crazy-mode easter egg; picking it plays the vortex before the palette lands.
// While crazy is active, "lgt"/"drk" glow — they're the only way out, and the
// gutter itself sits above every chaos layer so they stay clickable and calm.
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-1 font-mono text-xs">
      <span className="text-gutter-muted">theme:</span>
      {THEMES.map((t) => {
        const isExit = theme === "crazy" && t.id !== "crazy";
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            aria-pressed={isActive}
            className={
              isExit
                ? "exit-glow rounded px-1.5 py-0.5 text-white"
                : isActive
                ? "rounded px-1.5 py-0.5 text-accent"
                : "rounded px-1.5 py-0.5 text-gutter-muted transition-colors hover:text-white"
            }
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

type Route = { cmd: string; alias: string[]; id: string; number: string; label: string };

const ROUTES: Route[] = [
  { cmd: "log", alias: ["releases", "experience"], id: "experience", number: "00", label: "Releases" },
  { cmd: "shortlog", alias: ["stats"], id: "stats", number: "01", label: "Shortlog" },
  { cmd: "ls", alias: ["work", "projects"], id: "work", number: "02", label: "Work log" },
  { cmd: "formation", alias: ["education", "certs"], id: "formation", number: "03", label: "Formation" },
];

const HELP =
  "commands: log, shortlog, ls, formation, whoami, open <github|linkedin|email>, top, clear";

// The gutter is the page's line-number column: a persistent index of the
// sections in order, plus the command prompt that actually drives navigation.
// On narrow screens it collapses to the same prompt as a bottom bar.
export default function Gutter({ profile }: { profile: Profile }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("type `help`");

  function run(raw: string) {
    const line = raw.trim().toLowerCase();
    if (!line) return;

    if (line === "help") return setOutput(HELP);
    if (line === "clear") return setOutput("");
    if (line === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return setOutput("↑ top");
    }
    if (line === "whoami") return setOutput(profile.summary);

    const openMatch = line.match(/^open (github|linkedin|email)$/);
    if (openMatch) {
      const key = openMatch[1] as "github" | "linkedin" | "email";
      const url =
        key === "email" ? `mailto:${profile.socials.email}` : profile.socials[key];
      window.open(url, "_blank");
      return setOutput(`opening ${key}…`);
    }

    const route = ROUTES.find((r) => r.cmd === line || r.alias.includes(line));
    if (route) {
      goTo(route);
      return;
    }

    setOutput(`command not found: ${raw} — try \`help\``);
  }

  function goTo(route: Route) {
    document.getElementById(route.id)?.scrollIntoView({ behavior: "smooth" });
    setOutput(`→ ${route.label}`);
  }

  const prompt = (
    <div className="flex items-center gap-2 font-mono text-sm">
      <span className="text-accent">$</span>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          run(input);
          setInput("");
        }}
        placeholder="help"
        spellCheck={false}
        className="w-full min-w-0 bg-transparent text-white outline-none placeholder:text-gutter-muted"
      />
    </div>
  );

  return (
    <>
      {/* Desktop: sticky sidebar, the file's real line-number index */}
      <aside className="hidden shrink-0 lg:sticky lg:top-0 lg:z-[70] lg:flex lg:h-screen lg:w-56 lg:flex-col lg:justify-between lg:border-r lg:border-gutter-line lg:bg-gutter lg:px-6 lg:py-8">
        <nav className="flex flex-col gap-1">
          {ROUTES.map((r) => (
            <button
              key={r.id}
              onClick={() => goTo(r)}
              className="group flex items-baseline gap-3 rounded px-2 py-1.5 text-left transition-colors hover:bg-white/5"
            >
              <span className="font-mono text-xs text-accent">{r.number}</span>
              <span className="font-display text-sm text-white/70 group-hover:text-white">
                {r.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="border-t border-gutter-line pt-4">
          {prompt}
          <p className="mt-2 truncate font-mono text-xs text-gutter-muted">{output}</p>
          <div className="mt-4 border-t border-gutter-line pt-3">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile / tablet: fixed bottom prompt */}
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-gutter-line bg-gutter lg:hidden">
        <div className="flex items-center gap-3 px-6 py-3">
          {prompt}
          <span className="hidden shrink-0 truncate text-xs text-gutter-muted sm:block">
            {output}
          </span>
          <div className="ml-auto shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
