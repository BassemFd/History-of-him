"use client";

import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import ProjectsGrid from "@/components/ProjectsGrid";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import EducationSection from "@/components/EducationSection";
import { contentByLocale } from "@/lib/content";
import { STRINGS } from "@/lib/strings";
import { useLocale } from "@/components/LocaleProvider";

export default function Home() {
  const { locale } = useLocale();
  const { profile, projects, experience, stats, education, certifications } =
    contentByLocale[locale];
  const t = STRINGS[locale];

  return (
    <main>
      <Hero profile={profile} recent={projects.slice(0, 4)} />
      <ExperienceTimeline experience={experience} t={t} />
      <StatsSection stats={stats} t={t} />
      <ProjectsGrid projects={projects} t={t} />
      <EducationSection education={education} certifications={certifications} t={t} />

      <footer className="max-w-3xl px-6 py-10 lg:px-16">
        <p className="font-mono text-xs text-muted">
          {t.footerBuiltWith} <span className="text-ink">{t.footerContentLives}</span> ·{" "}
          <a
            href={profile.socials.github}
            className="underline decoration-rule underline-offset-4 hover:text-accent"
            target="_blank"
            rel="noreferrer"
          >
            {t.footerSource}
          </a>
        </p>
      </footer>
    </main>
  );
}
