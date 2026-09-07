import type { Stats } from "@/lib/types";

// Stats rendered as a shortlog-style datasheet: label on the left, value on the
// right, hairline rows. Live GitHub numbers carry a small "fetched" timestamp so
// their freshness is honest; manual numbers are marked as aggregates.
export default function StatsSection({ stats }: { stats: Stats }) {
  const fetched = new Date(stats.liveFetchedAt).toLocaleDateString("en-CA");

  const live: { label: string; value: string; note: string }[] = [
    {
      label: "Public repositories",
      value: String(stats.live.publicRepos),
      note: "github.com/BassemFd",
    },
    {
      label: "Pull requests merged",
      value: String(stats.live.mergedPRs),
      note: "across public repos",
    },
    {
      label: "Stars earned",
      value: String(stats.live.totalStars),
      note: "on own projects",
    },
    {
      label: "Followers",
      value: String(stats.live.followers),
      note: "on GitHub",
    },
  ];

  return (
    <section id="stats" className="border-b border-rule">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <SectionLabel index="00" title="Shortlog" />

        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2">
          {stats.manual.map((s) => (
            <StatRow
              key={s.label}
              label={s.label}
              value={s.value}
              note={s.note}
              source="manual"
            />
          ))}
          {live.map((s) => (
            <StatRow
              key={s.label}
              label={s.label}
              value={s.value}
              note={s.note}
              source="live"
            />
          ))}
        </div>

        <p className="mt-3 font-mono text-xs text-muted">
          Live figures fetched from the GitHub API on {fetched}. Aggregate
          production figures are recorded manually from private employer
          codebases.
        </p>
      </div>
    </section>
  );
}

function StatRow({
  label,
  value,
  note,
  source,
}: {
  label: string;
  value: string;
  note: string;
  source: "manual" | "live";
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 bg-card px-5 py-5">
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted">
          <span
            className={
              source === "live"
                ? "text-accent"
                : "text-muted"
            }
          >
            {source === "live" ? "● live" : "○ manual"}
          </span>
          <span>{note}</span>
        </div>
      </div>
      <div className="font-display text-3xl font-semibold tabular-nums tracking-tight">
        {value}
      </div>
    </div>
  );
}

export function SectionLabel({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-accent">{index}</span>
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ink">
        {title}
      </h2>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}
