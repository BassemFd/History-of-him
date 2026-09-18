"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";

type Route = { cmd: string; alias: string[]; id: string; label: string };

const ROUTES: Route[] = [
  { cmd: "log", alias: ["releases", "experience"], id: "experience", label: "Releases" },
  { cmd: "shortlog", alias: ["stats"], id: "stats", label: "Shortlog" },
  { cmd: "ls", alias: ["work", "projects"], id: "work", label: "Work log" },
  { cmd: "formation", alias: ["education", "certs"], id: "formation", label: "Formation" },
];

const HELP =
  "commands: log, shortlog, ls, formation, whoami, open <github|linkedin|email>, top, clear";

export default function TerminalNav({ profile }: { profile: Profile }) {
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
      document.getElementById(route.id)?.scrollIntoView({ behavior: "smooth" });
      return setOutput(`→ ${route.label}`);
    }

    setOutput(`command not found: ${raw} — try \`help\``);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-3 font-mono text-sm">
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
          className="flex-1 bg-transparent text-ink outline-none placeholder:text-muted"
        />
        <span className="hidden shrink-0 truncate text-xs text-muted sm:block">
          {output}
        </span>
      </div>
    </div>
  );
}
