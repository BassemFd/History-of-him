import type { Experience } from "@/lib/types";
import { SectionLabel } from "./StatsSection";

// Experience on the same spine metaphor: each role is a tagged release on the
// branch. Confidential roles render narrative only — no repo names, no links.
export default function ExperienceTimeline({
  experience,
}: {
  experience: Experience[];
}) {
  return (
    <section id="experience" className="border-b border-rule">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <SectionLabel index="02" title="Releases" />

        <div className="relative mt-8 pl-8">
          <span className="spine-line absolute left-[7px] top-2 bottom-2 w-px bg-rule" />
          <ol className="space-y-6">
            {experience.map((e, i) => (
              <li
                key={`${e.company}-${i}`}
                className="node-in relative"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span
                  className={`absolute -left-[27px] top-1.5 h-3.5 w-3.5 rotate-45 border-2 border-accent ${
                    e.flagship ? "bg-accent" : "bg-card"
                  }`}
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3
                    className={`font-display font-semibold tracking-tight ${
                      e.flagship ? "text-xl" : "text-lg"
                    }`}
                  >
                    {e.company}
                  </h3>
                  {e.flagship && (
                    <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-card">
                      Flagship
                    </span>
                  )}
                  {e.confidential && (
                    <span className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                      Under NDA
                    </span>
                  )}
                  <span className="ml-auto font-mono text-xs text-muted">
                    {e.start} — {e.end}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-xs text-accent">{e.role}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/75">
                  {e.summary}
                </p>
                {e.stack.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px] text-muted">
                    {e.stack.map((s) => (
                      <li
                        key={s}
                        className="rounded border border-rule px-1.5 py-0.5"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
