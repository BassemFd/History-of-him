"use client";

import { useState } from "react";
import type { Project, ProjectCategory } from "@/lib/types";
import { shortHash } from "@/lib/hash";
import { SectionLabel } from "./StatsSection";

const FILTERS: { key: ProjectCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "personal", label: "Personal" },
  { key: "client", label: "Client" },
  { key: "dojo", label: "Training" },
];

// Projects as commit nodes on a branch line: each card hangs off the spine with
// its short hash, so the section reads as a log of shipped work.
export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const shown =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="work" className="border-b border-rule">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <SectionLabel index="02" title="Work log" />

        <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3 py-1 transition-colors ${
                filter === f.key
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-rule text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* the branch line */}
        <div className="relative mt-8 pl-8">
          <span className="spine-line absolute left-[7px] top-2 bottom-2 w-px bg-rule" />
          <ol className="space-y-4">
            {shown.map((p, i) => (
              <li
                key={p.slug}
                className="node-in relative"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="absolute -left-[27px] top-6 h-3.5 w-3.5 rounded-full border-2 border-accent bg-card" />
                <ProjectCard project={p} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const href = p.links.live ?? p.links.github;
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`block rounded-lg border border-rule bg-card p-5 transition-colors ${
        href ? "hover:border-accent" : ""
      }`}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-accent">
          {shortHash(p.slug)}
        </span>
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {p.title}
        </h3>
        {p.role === "contributor" && (
          <span className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
            Contributor
          </span>
        )}
        <span className="ml-auto font-mono text-xs text-muted">{p.year}</span>
      </div>

      <p className="mt-2 text-[14px] leading-relaxed text-ink/75">{p.blurb}</p>

      {p.stack.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px] text-muted">
          {p.stack.map((s) => (
            <li key={s} className="rounded border border-rule px-1.5 py-0.5">
              {s}
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
}
